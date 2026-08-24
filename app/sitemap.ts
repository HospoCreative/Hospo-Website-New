import type { MetadataRoute } from "next";
import { getPublishedBlogPosts, getPublishedCaseStudies } from "@/lib/supabase/queries";
import { localizedUrls } from "@/lib/seo";

export const revalidate = 3600;

const staticRoutes = [
  "/",
  "/hotels-stays",
  "/restaurants-fb",
  "/services",
  "/services/strategy-campaigns",
  "/services/websites-direct-booking",
  "/services/ota-optimisation",
  "/services/seo-google-visibility",
  "/services/photography-video",
  "/services/social-media",
  "/about",
  "/contact",
  "/blog",
  "/case-studies",
  "/digital-scan"
];

function entrySettings(pathname: string) {
  if (pathname === "/") return { changeFrequency: "weekly" as const, priority: 1 };
  if (["/services", "/hotels-stays", "/restaurants-fb", "/case-studies"].includes(pathname)) return { changeFrequency: "weekly" as const, priority: 0.9 };
  if (pathname.startsWith("/services/") || pathname.startsWith("/case-studies/")) return { changeFrequency: "monthly" as const, priority: 0.8 };
  return { changeFrequency: "monthly" as const, priority: 0.7 };
}

function entriesForPath(pathname: string, lastModified?: Date): MetadataRoute.Sitemap {
  const { english, portuguese } = localizedUrls(pathname);
  // Next normalises the root canonical without a trailing slash. Keep the
  // sitemap's root URL and alternate links identical to that canonical.
  const englishUrl = pathname === "/" ? english.replace(/\/$/, "") : english;
  const languages = { "en-GB": englishUrl, "pt-PT": portuguese, "x-default": englishUrl };
  const settings = entrySettings(pathname);
  return [
    { url: englishUrl, ...settings, ...(lastModified ? { lastModified } : {}), alternates: { languages } },
    { url: portuguese, ...settings, ...(lastModified ? { lastModified } : {}), alternates: { languages } }
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = staticRoutes.flatMap((route) => entriesForPath(route));

  try {
    const [posts, caseStudies] = await Promise.all([
      getPublishedBlogPosts("en"),
      getPublishedCaseStudies("en")
    ]);
    const postEntries = posts.flatMap((post) =>
      entriesForPath(`/blog/${post.slug}`, post.publishedAt ? new Date(post.publishedAt) : undefined)
    );
    const caseStudyEntries = caseStudies.flatMap((caseStudy) =>
      entriesForPath(
        `/case-studies/${caseStudy.slug}`,
        caseStudy.publishedAt ? new Date(caseStudy.publishedAt) : undefined
      )
    );
    return [...staticEntries, ...postEntries, ...caseStudyEntries];
  } catch {
    return staticEntries;
  }
}
