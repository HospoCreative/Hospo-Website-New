import type { MetadataRoute } from "next";
import { getPublishedBlogPosts, getPublishedCaseStudies } from "@/lib/supabase/queries";
import { localizedUrls } from "@/lib/seo";

export const revalidate = 3600;

const staticRoutes = ["/", "/blog", "/case-studies", "/digital-scan"];

function entriesForPath(pathname: string, lastModified?: Date): MetadataRoute.Sitemap {
  const { english, portuguese } = localizedUrls(pathname);
  const languages = { "en-GB": english, "pt-PT": portuguese, "x-default": english };
  return [
    { url: english, ...(lastModified ? { lastModified } : {}), alternates: { languages } },
    { url: portuguese, ...(lastModified ? { lastModified } : {}), alternates: { languages } }
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
      entriesForPath(`/blog/${post.slug}`, post.publishedAt ? new Date(post.publishedAt) : new Date())
    );
    const caseStudyEntries = caseStudies.flatMap((caseStudy) =>
      entriesForPath(
        `/case-studies/${caseStudy.slug}`,
        caseStudy.publishedAt ? new Date(caseStudy.publishedAt) : new Date()
      )
    );
    return [...staticEntries, ...postEntries, ...caseStudyEntries];
  } catch {
    return staticEntries;
  }
}
