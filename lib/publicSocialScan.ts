import "server-only";

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import sharp from "sharp";
import type { PublicSocialProfileScan, SocialFeedMetrics } from "@/types/digitalScan";

const MAX_HTML_BYTES = 2_000_000;
const MAX_IMAGE_BYTES = 5_000_000;
const MAX_REDIRECTS = 3;
const FETCH_TIMEOUT_MS = 9_000;

const imageDomains = [
  "cdninstagram.com",
  "fbcdn.net",
  "tiktokcdn.com",
  "tiktokcdn-us.com",
  "muscdn.com",
  "byteoversea.com",
  "ytimg.com",
  "ggpht.com",
  "googleusercontent.com",
  "pinimg.com"
];

type Platform = PublicSocialProfileScan["platform"];

const platforms: Array<{ platform: Platform; domains: string[] }> = [
  { platform: "Instagram", domains: ["instagram.com"] },
  { platform: "Facebook", domains: ["facebook.com", "fb.com"] },
  { platform: "TikTok", domains: ["tiktok.com"] },
  { platform: "YouTube", domains: ["youtube.com", "youtu.be"] },
  { platform: "LinkedIn", domains: ["linkedin.com"] },
  { platform: "Pinterest", domains: ["pinterest.com", "pin.it"] }
];

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function standardDeviation(values: number[]) {
  if (!values.length) return 0;
  const average = values.reduce((total, value) => total + value, 0) / values.length;
  return Math.sqrt(values.reduce((total, value) => total + (value - average) ** 2, 0) / values.length);
}

function hostMatches(host: string, domains: string[]) {
  return domains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function platformFor(url: string): Platform | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname.replace(/\/+$/, "");
    const platform = platforms.find((item) => hostMatches(host, item.domains))?.platform ?? null;
    if (platform === "TikTok" && !/^\/@[^/]+$/i.test(path)) return null;
    if (platform === "YouTube" && !/^\/(?:@[^/]+|channel\/[^/]+|c\/[^/]+|user\/[^/]+)$/i.test(path)) return null;
    if (platform === "LinkedIn" && !/^\/(?:company|in)\/[^/]+$/i.test(path)) return null;
    return platform;
  } catch {
    return null;
  }
}

function isPrivateIpv4(address: string) {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return true;
  const [a, b] = parts;
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224;
}

function isPrivateAddress(address: string) {
  if (isIP(address) === 4) return isPrivateIpv4(address);
  if (isIP(address) === 6) {
    const value = address.toLowerCase();
    return value === "::" || value === "::1" || value.startsWith("fc") || value.startsWith("fd") ||
      value.startsWith("fe8") || value.startsWith("fe9") || value.startsWith("fea") || value.startsWith("feb") ||
      value.startsWith("::ffff:127.") || value.startsWith("::ffff:10.") || value.startsWith("::ffff:192.168.");
  }
  return true;
}

async function assertPublicUrl(url: URL) {
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Unsupported protocol");
  if (url.username || url.password) throw new Error("Credentials are not accepted");
  if (url.hostname === "localhost" || url.hostname.endsWith(".local") || url.hostname.endsWith(".internal")) {
    throw new Error("Private address");
  }
  if (isIP(url.hostname)) {
    if (isPrivateAddress(url.hostname)) throw new Error("Private address");
    return;
  }
  const addresses = await lookup(url.hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) throw new Error("Private address");
}

async function readBoundedBytes(response: Response, maxBytes: number) {
  if (!response.body) throw new Error("Empty response");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("Response too large");
    }
    chunks.push(value);
  }
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}

async function fetchBounded(initialUrl: string, maxBytes: number) {
  let current = new URL(initialUrl);
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    await assertPublicUrl(current);
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; HospoCreativePublicScan/1.0; +https://hospocreative.com)",
        accept: "text/html,application/json,image/avif,image/webp,image/*,*/*;q=0.8"
      }
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("Invalid redirect");
      current = new URL(location, current);
      continue;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const declared = Number(response.headers.get("content-length") || 0);
    if (declared > maxBytes) throw new Error("Response too large");
    const bytes = await readBoundedBytes(response, maxBytes);
    return { bytes, contentType: response.headers.get("content-type")?.toLowerCase() ?? "", finalUrl: current.toString() };
  }
  throw new Error("Too many redirects");
}

function decodeHtmlUrls(html: string) {
  return html
    .replace(/\\u0026/gi, "&")
    .replace(/\\u003d/gi, "=")
    .replace(/\\\//g, "/")
    .replace(/&amp;/gi, "&");
}

function imageCandidates(html: string) {
  const decoded = decodeHtmlUrls(html);
  const values = decoded.match(/https?:\/\/[^"'<>\s\\]+/gi) ?? [];
  return Array.from(new Set(values.map((value) => {
    try {
      const url = new URL(value.replace(/[),;]+$/, ""));
      return hostMatches(url.hostname.toLowerCase(), imageDomains) ? url.toString() : "";
    } catch {
      return "";
    }
  }).filter(Boolean))).slice(0, 18);
}

type ProfileDiscovery = {
  platform: Platform;
  url: string;
  accessible: boolean;
  candidates: string[];
};

async function discoverProfile(url: string, platform: Platform): Promise<ProfileDiscovery> {
  let accessible = false;
  let html = "";

  if (platform === "TikTok") {
    try {
      const endpoint = new URL("https://www.tiktok.com/oembed");
      endpoint.searchParams.set("url", url);
      const response = await fetchBounded(endpoint.toString(), MAX_HTML_BYTES);
      if (response.contentType.includes("json")) {
        const data = JSON.parse(new TextDecoder().decode(response.bytes)) as { html?: string; thumbnail_url?: string };
        html += `${data.html ?? ""} ${data.thumbnail_url ?? ""}`;
        accessible = true;
      }
    } catch {
      // The normal public page request below may still succeed.
    }
  }

  try {
    const response = await fetchBounded(url, MAX_HTML_BYTES);
    if (response.contentType.includes("html")) {
      html += ` ${new TextDecoder().decode(response.bytes)}`;
      accessible = true;
    }
  } catch {
    // A blocked profile is reported clearly instead of failing the whole website scan.
  }

  return { platform, url, accessible, candidates: imageCandidates(html) };
}

type ImageSignal = {
  platform: Platform;
  red: number;
  green: number;
  blue: number;
  luminance: number;
  saturation: number;
  contrast: number;
  quality: number;
  signature: number[];
};

async function analyseImage(url: string, platform: Platform): Promise<ImageSignal> {
  const response = await fetchBounded(url, MAX_IMAGE_BYTES);
  if (!response.contentType.startsWith("image/")) throw new Error("Not an image");
  const source = sharp(response.bytes, { failOn: "warning", limitInputPixels: 20_000_000 });
  const metadata = await source.metadata();
  if (Math.min(metadata.width ?? 0, metadata.height ?? 0) < 240) throw new Error("Image is too small for feed analysis");
  const { data, info } = await source.clone().rotate().resize(96, 96, { fit: "cover" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const luminances: number[] = [];
  const signatureBuckets = Array.from({ length: 16 }, () => ({ total: 0, count: 0 }));
  let red = 0;
  let green = 0;
  let blue = 0;
  let saturation = 0;
  let count = 0;

  for (let y = 0; y < info.height; y += 3) {
    for (let x = 0; x < info.width; x += 3) {
      const index = (y * info.width + x) * info.channels;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const bucket = signatureBuckets[Math.min(3, Math.floor(y / 24)) * 4 + Math.min(3, Math.floor(x / 24))];
      red += r;
      green += g;
      blue += b;
      saturation += max === 0 ? 0 : ((max - min) / max) * 100;
      luminances.push(luminance);
      bucket.total += luminance;
      bucket.count += 1;
      count += 1;
    }
  }

  return {
    platform,
    red: red / count,
    green: green / count,
    blue: blue / count,
    luminance: luminances.reduce((total, value) => total + value, 0) / luminances.length,
    saturation: saturation / count,
    contrast: standardDeviation(luminances),
    quality: clamp((Math.min(metadata.width ?? 0, 1080) / 1080) * 100),
    signature: signatureBuckets.map((bucket) => bucket.count ? bucket.total / bucket.count : 0)
  };
}

function signatureDistance(left: number[], right: number[]) {
  return left.reduce((total, value, index) => total + Math.abs(value - right[index]), 0) / left.length;
}

function metricsFromSignals(signals: ImageSignal[]): SocialFeedMetrics | null {
  if (signals.length < 3) return null;
  const colourSpread = (standardDeviation(signals.map((item) => item.red)) + standardDeviation(signals.map((item) => item.green)) + standardDeviation(signals.map((item) => item.blue))) / 3;
  const saturationSpread = standardDeviation(signals.map((item) => item.saturation));
  let similarPairs = 0;
  let pairCount = 0;
  for (let left = 0; left < signals.length; left += 1) {
    for (let right = left + 1; right < signals.length; right += 1) {
      if (signatureDistance(signals[left].signature, signals[right].signature) < 7) similarPairs += 1;
      pairCount += 1;
    }
  }
  return {
    source: "automatic",
    width: 96,
    height: 96,
    tileCount: signals.length,
    colourCohesion: clamp(100 - colourSpread * 1.05 - saturationSpread * 0.55),
    exposureBalance: clamp(signals.reduce((total, item) => total + Math.max(0, 100 - Math.abs(item.luminance - 132) * 0.9), 0) / signals.length),
    contrastBalance: clamp(signals.reduce((total, item) => total + Math.max(0, 100 - Math.abs(item.contrast - 52) * 1.65), 0) / signals.length),
    imageQuality: clamp(signals.reduce((total, item) => total + item.quality, 0) / signals.length),
    repetitionRisk: clamp(pairCount ? (similarPairs / pairCount) * 100 : 0)
  };
}

export async function scanPublicSocialProfiles(links: string[]) {
  const profileMap = new Map<Platform, string>();
  for (const url of links) {
    const platform = platformFor(url);
    if (platform && !profileMap.has(platform)) profileMap.set(platform, url);
  }
  const uniqueProfiles = Array.from(profileMap, ([platform, url]) => ({ platform, url })).slice(0, platforms.length);
  const discoveries = await Promise.all(uniqueProfiles.map(({ url, platform }) => discoverProfile(url, platform)));
  const imageJobs = discoveries.flatMap((profile) => profile.candidates.slice(0, 4).map((url) => ({ url, platform: profile.platform }))).slice(0, 18);
  const settled = await Promise.allSettled(imageJobs.map((job) => analyseImage(job.url, job.platform)));
  const fetchedSignals = settled.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
  const signals: ImageSignal[] = [];
  for (const signal of fetchedSignals) {
    const duplicate = signals.some((existing) => existing.platform === signal.platform && signatureDistance(existing.signature, signal.signature) < 3);
    if (!duplicate) signals.push(signal);
  }
  const profiles: PublicSocialProfileScan[] = discoveries.map((profile) => {
    const thumbnailCount = signals.filter((signal) => signal.platform === profile.platform).length;
    return {
      platform: profile.platform,
      url: profile.url,
      status: thumbnailCount >= 3 ? "scanned" : profile.accessible || thumbnailCount ? "partial" : "blocked",
      thumbnailCount
    };
  });
  return { profiles, metrics: metricsFromSignals(signals), thumbnailCount: signals.length };
}
