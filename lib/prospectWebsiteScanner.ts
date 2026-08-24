import "server-only";

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const SCANNER_VERSION = "website-scanner-v1";
const MAX_PAGES = 12;
const HARD_MAX_PAGES = 15;
const MAX_HTML_BYTES = 2_000_000;
const MAX_REDIRECTS = 4;
const TIMEOUT_MS = 8_000;
const USER_AGENT = "HospoCreativeWebsiteScanner/1.0 (+https://hospocreative.com)";

export type Evidence = {
  evidence_key: string;
  evidence_group: "overview" | "conversion" | "pages" | "contact_discovery" | "technical";
  confidence: "high" | "medium" | "low";
  page_url?: string;
  value: Record<string, unknown>;
};
type ScanPage = { url: string; type: string; priority: number };
type PageResult = { url: string; finalUrl: string; status: number; html: string; contentType: string; links: Anchor[]; evidence: Evidence[] };
type Anchor = { href: string; text: string };

const socialHosts: Record<string, string> = { "instagram.com": "WEB_INSTAGRAM", "facebook.com": "WEB_FACEBOOK", "tiktok.com": "WEB_TIKTOK", "linkedin.com": "WEB_LINKEDIN", "youtube.com": "WEB_YOUTUBE" };
const bookingHosts: Record<string, string> = { "booking.com": "Booking.com", "synxis.com": "SynXis", "mews.com": "Mews", "siteminder.com": "SiteMinder", "resnexus.com": "ResNexus", "opentable.com": "OpenTable", "thefork.com": "TheFork", "resy.com": "Resy", "sevenrooms.com": "SevenRooms", "quandoo.com": "Quandoo", "toasttab.com": "Toast" };

const decode = (value: string) => value.replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2] ?? "";
const tagText = (html: string, tag: string) => decode(html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] ?? "");
const meta = (html: string, name: string) => (html.match(/<meta\b[^>]*>/gi) ?? []).find((tag) => (attr(tag, "name") || attr(tag, "property")).toLowerCase() === name.toLowerCase()) ? attr((html.match(/<meta\b[^>]*>/gi) ?? []).find((tag) => (attr(tag, "name") || attr(tag, "property")).toLowerCase() === name.toLowerCase())!, "content") : "";
const links = (html: string, base: URL): Anchor[] => (html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) ?? []).flatMap((anchor) => { const tag = anchor.match(/^<a\b[^>]*>/i)?.[0] ?? ""; try { const url = new URL(attr(tag, "href"), base); return ["http:", "https:"].includes(url.protocol) ? [{ href: url.toString(), text: decode(anchor.replace(/^<a\b[^>]*>/i, "").replace(/<\/a>$/i, "")) }] : []; } catch { return []; } });
const hostMatches = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`);

function privateAddress(address: string) {
  if (isIP(address) === 4) { const [a, b] = address.split(".").map(Number); return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224; }
  if (isIP(address) === 6) { const value = address.toLowerCase(); return value === "::" || value === "::1" || value.startsWith("fc") || value.startsWith("fd") || /^fe[89ab]/.test(value) || value.startsWith("::ffff:127.") || value.startsWith("::ffff:10.") || value.startsWith("::ffff:192.168."); }
  return true;
}

export async function assertSafePublicUrl(value: string | URL) {
  const url = typeof value === "string" ? new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`) : value;
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error("Only public HTTP and HTTPS URLs can be analysed.");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal") || host === "metadata.google.internal") throw new Error("Private or local URLs cannot be analysed.");
  if (isIP(host)) { if (privateAddress(host)) throw new Error("Private or local URLs cannot be analysed."); return url; }
  const addresses = await lookup(host, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => privateAddress(address))) throw new Error("The URL does not resolve to a public server.");
  return url;
}

async function readHtml(response: Response) {
  const length = Number(response.headers.get("content-length") || 0);
  if (length > MAX_HTML_BYTES) throw new Error("Response exceeded the scanner size limit.");
  if (!response.body) throw new Error("Response has no readable content.");
  const reader = response.body.getReader(); const decoder = new TextDecoder(); let total = 0; let html = "";
  while (true) { const { done, value } = await reader.read(); if (done) break; total += value.byteLength; if (total > MAX_HTML_BYTES) { await reader.cancel(); throw new Error("Response exceeded the scanner size limit."); } html += decoder.decode(value, { stream: true }); }
  return html + decoder.decode();
}

async function fetchSafe(url: URL) {
  let current = url;
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    await assertSafePublicUrl(current);
    const response = await fetch(current, { redirect: "manual", signal: AbortSignal.timeout(TIMEOUT_MS), headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1" } });
    if ([301, 302, 303, 307, 308].includes(response.status)) { const location = response.headers.get("location"); if (!location) throw new Error("Invalid redirect."); current = new URL(location, current); continue; }
    return { response, finalUrl: current };
  }
  throw new Error("Too many redirects.");
}

function sameSite(candidate: URL, primary: URL) { return candidate.hostname === primary.hostname || candidate.hostname === `www.${primary.hostname}` || primary.hostname === `www.${candidate.hostname}`; }
function pageType(link: Anchor, businessType: string) {
  const signal = `${link.text} ${new URL(link.href).pathname}`.toLowerCase();
  if (/\b(menu|food|drinks|ementa|cocktail)/.test(signal)) return "menu";
  if (/\b(room|suite|accommodation|stay|villa|apartments?)/.test(signal)) return "rooms";
  if (/\b(offer|package|experience|event|what.?s on|private dining|private hire)/.test(signal)) return "offers_events";
  if (/\b(book|reserve|reservation|availability)/.test(signal)) return businessType.includes("Hotel") || businessType.includes("Accommodation") ? "booking" : "reservation";
  if (/\b(contact|location|find us|visit)/.test(signal)) return "contact";
  return "page";
}
function priority(type: string, businessType: string) { const hotel = /Hotel|Accommodation|Guesthouse|Aparthotel/.test(businessType); if (["booking", "reservation"].includes(type)) return 100; if (hotel && type === "rooms") return 95; if (!hotel && type === "menu") return 95; if (type === "offers_events") return 80; if (type === "contact") return 65; return 10; }
function robotAllowed(robots: string, path: string) { const lines = robots.split(/\r?\n/); let applies = false; const disallow: string[] = []; for (const raw of lines) { const [key, ...rest] = raw.split(":"); const value = rest.join(":").trim(); if (key?.trim().toLowerCase() === "user-agent") applies = value === "*" || value.toLowerCase().includes("hospocreativewebsitescanner"); if (applies && key?.trim().toLowerCase() === "disallow" && value) disallow.push(value); } return !disallow.some((rule) => path.startsWith(rule)); }

function evidenceForPage(html: string, page: string, status: number, type: string, anchors: Anchor[], businessType: string, isHomepage: boolean): Evidence[] {
  const value = (evidence_key: string, evidence_group: Evidence["evidence_group"], payload: Record<string, unknown>, confidence: Evidence["confidence"] = "high"): Evidence => ({ evidence_key, evidence_group, confidence, page_url: page, value: payload });
  const output: Evidence[] = [value("WEB_HTTP_STATUS", "technical", { status, page_type: type }), value("WEB_PAGE_TYPE", "pages", { page_type: type })];
  const title = tagText(html, "title"); if (title) output.push(value(isHomepage ? "WEB_HOME_TITLE" : "WEB_PAGE_TITLE", "overview", { text: title }));
  const description = meta(html, "description"); if (description) output.push(value(isHomepage ? "WEB_HOME_DESCRIPTION" : "WEB_PAGE_DESCRIPTION", "overview", { text: description }));
  const canonicalTag = (html.match(/<link\b[^>]*>/gi) ?? []).find((tag) => attr(tag, "rel").toLowerCase().split(/\s+/).includes("canonical")); if (canonicalTag) output.push(value("WEB_CANONICAL", "technical", { url: attr(canonicalTag, "href") }));
  const robots = meta(html, "robots"); if (robots) output.push(value("WEB_META_ROBOTS", "technical", { value: robots }));
  const lang = html.match(/<html\b[^>]*\blang=["']([^"']+)/i)?.[1]; if (lang) output.push(value("WEB_PAGE_LANGUAGE", "technical", { value: lang }));
  const h1 = tagText(html, "h1"); if (h1) output.push(value(isHomepage ? "WEB_HOME_H1" : "WEB_PAGE_H1", "overview", { text: h1 }));
  const h2 = (html.match(/<h2\b[^>]*>[\s\S]*?<\/h2>/gi) ?? []).map((tag) => decode(tag)).filter(Boolean).slice(0, 8); if (h2.length) output.push(value("WEB_H2", "overview", { headings: h2 }));
  const jsonLd = Array.from(html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)).flatMap((m) => { try { const data = JSON.parse(m[1]); const items = Array.isArray(data) ? data : [data, ...(Array.isArray(data?.['@graph']) ? data['@graph'] : [])]; return items.flatMap((item) => typeof item?.['@type'] === "string" ? [item['@type']] : Array.isArray(item?.['@type']) ? item['@type'] : []); } catch { return []; } }); if (jsonLd.length) output.push(value("WEB_STRUCTURED_DATA", "technical", { types: [...new Set(jsonLd)] }));
  const images = html.match(/<img\b[^>]*>/gi) ?? []; if (images.length) output.push(value("WEB_IMAGES", "overview", { count: images.length, with_alt: images.filter((image) => Boolean(attr(image, "alt").trim())).length, lazy_loaded: images.filter((image) => attr(image, "loading").toLowerCase() === "lazy").length }));
  const ctas = anchors.filter((anchor) => /\b(book now|book|reserve|reservation|check availability|order|contact|enquire|get in touch)\b/i.test(anchor.text)).slice(0, 12); if (ctas.length) output.push(value("WEB_PRIMARY_CTA", "conversion", { ctas }, "medium"));
  for (const anchor of anchors) { try { const host = new URL(anchor.href).hostname.replace(/^www\./, "").toLowerCase(); const social = Object.entries(socialHosts).find(([domain]) => hostMatches(host, domain)); if (social) output.push(value(social[1], "contact_discovery", { url: anchor.href })); const provider = Object.entries(bookingHosts).find(([domain]) => hostMatches(host, domain)); if (provider) output.push(value(/Hotel|Accommodation|Guesthouse|Aparthotel/.test(businessType) ? "WEB_BOOKING_PROVIDER" : "WEB_RESERVATION_PROVIDER", "conversion", { provider: provider[1], url: anchor.href })); if (/maps\.google|google\.[a-z.]+\/maps|maps\.app\.goo\.gl/i.test(anchor.href)) output.push(value("WEB_GOOGLE_MAPS", "contact_discovery", { url: anchor.href })); } catch { /* invalid links are ignored */ } }
  const emails = [...new Set((html.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi) ?? []).slice(0, 5))]; if (emails.length) output.push(value("WEB_CONTACT_EMAIL", "contact_discovery", { emails }));
  const phones = [...new Set((html.match(/(?:\+?\d[\d\s().-]{6,}\d)/g) ?? []).slice(0, 5))]; if (phones.length) output.push(value("WEB_CONTACT_PHONE", "contact_discovery", { phones }, "medium"));
  return output;
}

export async function runProspectWebsiteScan(input: { websiteUrl: string; businessType: string }) {
  const initial = await assertSafePublicUrl(input.websiteUrl);
  const homeFetch = await fetchSafe(initial); const homeType = homeFetch.response.headers.get("content-type")?.toLowerCase() ?? "";
  if (!homeFetch.response.ok) throw new Error(`Homepage returned HTTP ${homeFetch.response.status}.`);
  if (!homeType.includes("text/html")) throw new Error("Homepage did not return HTML.");
  const homeHtml = await readHtml(homeFetch.response); const primary = homeFetch.finalUrl;
  let robots = ""; try { const robotsFetch = await fetchSafe(new URL("/robots.txt", primary)); if (robotsFetch.response.ok) robots = await readHtml(robotsFetch.response); } catch { /* robots unavailable: continue politely with explicit limits */ }
  const homeAnchors = links(homeHtml, primary); const candidates = homeAnchors.flatMap((link) => { try { const url = new URL(link.href); if (!sameSite(url, primary) || !robotAllowed(robots, url.pathname)) return []; const type = pageType(link, input.businessType); return [{ url: url.toString(), type, priority: priority(type, input.businessType) }]; } catch { return []; } });
  const pdfMenus = candidates.filter((page) => page.type === "menu" && /\.pdf(?:$|[?#])/i.test(page.url));
  const queue: ScanPage[] = [{ url: primary.toString(), type: "homepage", priority: 999 }, ...candidates].filter((page, index, pages) => pages.findIndex((item) => item.url === page.url) === index).sort((a, b) => b.priority - a.priority).slice(0, MAX_PAGES);
  if (queue.length > HARD_MAX_PAGES) throw new Error("Scanner page limit exceeded.");
  const results: PageResult[] = []; const failures: string[] = [];
  for (const page of queue) { try { const fetched = page.url === primary.toString() ? { response: new Response(homeHtml, { status: homeFetch.response.status, headers: { "content-type": homeType } }), finalUrl: primary } : await fetchSafe(new URL(page.url)); const contentType = fetched.response.headers.get("content-type")?.toLowerCase() ?? ""; if (!fetched.response.ok || !contentType.includes("text/html")) { failures.push(`${page.type}: HTTP ${fetched.response.status}`); continue; } const html = page.url === primary.toString() ? homeHtml : await readHtml(fetched.response); const pageLinks = links(html, fetched.finalUrl); results.push({ url: page.url, finalUrl: fetched.finalUrl.toString(), status: fetched.response.status, html, contentType, links: pageLinks, evidence: evidenceForPage(html, fetched.finalUrl.toString(), fetched.response.status, page.type, pageLinks, input.businessType, page.url === primary.toString()) }); } catch (error) { failures.push(`${page.type}: ${error instanceof Error ? error.message : "unavailable"}`); } }
  const evidence = results.flatMap((result) => result.evidence); const menu = results.find((result) => queue.find((page) => page.url === result.url)?.type === "menu"); if (menu) evidence.push({ evidence_key: "WEB_MENU_FOUND", evidence_group: "pages", confidence: "high", page_url: menu.finalUrl, value: { found: true } }, { evidence_key: "WEB_MENU_URL", evidence_group: "pages", confidence: "high", page_url: menu.finalUrl, value: { url: menu.finalUrl } });
  if (!menu && pdfMenus[0]) evidence.push({ evidence_key: "WEB_MENU_FOUND", evidence_group: "pages", confidence: "high", page_url: pdfMenus[0].url, value: { found: true, format: "pdf" } }, { evidence_key: "WEB_MENU_URL", evidence_group: "pages", confidence: "high", page_url: pdfMenus[0].url, value: { url: pdfMenus[0].url, format: "pdf" } });
  const rooms = results.find((result) => queue.find((page) => page.url === result.url)?.type === "rooms"); if (rooms) evidence.push({ evidence_key: "WEB_ROOMS_FOUND", evidence_group: "pages", confidence: "high", page_url: rooms.finalUrl, value: { found: true } }, { evidence_key: "WEB_ROOMS_URL", evidence_group: "pages", confidence: "high", page_url: rooms.finalUrl, value: { url: rooms.finalUrl } });
  if (results.some((result) => queue.find((page) => page.url === result.url)?.type === "offers_events")) evidence.push({ evidence_key: "WEB_OFFERS_FOUND", evidence_group: "pages", confidence: "medium", value: { found: true } }, { evidence_key: "WEB_EVENTS_FOUND", evidence_group: "pages", confidence: "medium", value: { found: true } });
  const uniqueEvidence = evidence.filter((item, index, values) => values.findIndex((other) => other.evidence_key === item.evidence_key && other.page_url === item.page_url && JSON.stringify(other.value) === JSON.stringify(item.value)) === index);
  return { finalUrl: primary.toString(), pagesDiscovered: queue.length, pagesScanned: results.length, evidence: uniqueEvidence, failures };
}
