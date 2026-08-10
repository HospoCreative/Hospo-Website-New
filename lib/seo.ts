import type { Metadata } from "next";
import type { Locale } from "./i18n";

const FALLBACK_SITE_URL = "https://hospo-website-new-hospo-creative-s-projects.vercel.app";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, "");
export const DEFAULT_OG_IMAGE = "/images/social/hospo-creative-open-graph.png";
export const FAVICON = "/images/social/hospo-favicon-v2.png";

function normalisePath(pathname: string) {
  const withoutLocale = pathname === "/pt" ? "/" : pathname.replace(/^\/pt(?=\/)/, "");
  if (!withoutLocale || withoutLocale === "/") return "/";
  return `/${withoutLocale.replace(/^\/+|\/+$/g, "")}`;
}

export function localizedUrls(pathname: string) {
  const path = normalisePath(pathname);
  const english = new URL(path, SITE_URL).toString();
  const portuguesePath = path === "/" ? "/pt" : `/pt${path}`;
  const portuguese = new URL(portuguesePath, SITE_URL).toString();

  return { english, portuguese };
}

type PageMetadataOptions = {
  title: string;
  description: string;
  pathname: string;
  locale: Locale;
  image?: string | null;
  type?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description,
  pathname,
  locale,
  image = DEFAULT_OG_IMAGE,
  type = "website"
}: PageMetadataOptions): Metadata {
  const { english, portuguese } = localizedUrls(pathname);
  const canonical = locale === "pt" ? portuguese : english;
  const socialImage = image || DEFAULT_OG_IMAGE;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    icons: {
      icon: [{ url: FAVICON, type: "image/png", sizes: "500x500" }],
      shortcut: FAVICON,
      apple: FAVICON
    },
    alternates: {
      canonical,
      languages: {
        "en-GB": english,
        "pt-PT": portuguese,
        "x-default": english
      }
    },
    openGraph: {
      type,
      url: canonical,
      siteName: "Hospo Creative",
      locale: locale === "pt" ? "pt_PT" : "en_GB",
      alternateLocale: locale === "pt" ? ["en_GB"] : ["pt_PT"],
      title,
      description,
      images: [{ url: socialImage, alt: title }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage]
    }
  };
}
