import type { BlogPost } from "@/types/blogPost";
import type { CaseStudy, CaseStudyMedia, ContentStatus } from "@/types/caseStudy";
import type { ClientLogo } from "@/types/clientLogo";
import type { Locale } from "@/lib/i18n";
import { isSupabaseConfigured } from "./env";
import { createSupabasePublicClient } from "./public";
import { createSupabaseServerClient } from "./server";

type CaseStudyMediaRow = {
  id: string;
  case_study_id: string;
  media_type: "image" | "video" | "embed";
  src: string;
  alt: string;
  caption: string | null;
  sort_order: number;
  published: boolean;
};

type CaseStudyRow = {
  id: string;
  title: string;
  title_pt: string | null;
  slug: string;
  client_name: string;
  location: string | null;
  sector: string | null;
  sector_pt: string | null;
  summary: string;
  summary_pt: string | null;
  challenge: string | null;
  challenge_pt: string | null;
  solution: string | null;
  solution_pt: string | null;
  result: string | null;
  result_pt: string | null;
  services: string[] | null;
  services_pt: string[] | null;
  hero_image: string | null;
  hero_image_alt: string | null;
  hero_image_alt_pt: string | null;
  featured: boolean;
  display_order: number;
  status: ContentStatus;
  published_at: string | null;
};

type BlogPostRow = {
  id: string;
  title: string;
  title_pt: string | null;
  slug: string;
  excerpt: string;
  excerpt_pt: string | null;
  content: string;
  content_pt: string | null;
  cover_image: string | null;
  cover_image_alt: string | null;
  cover_image_alt_pt: string | null;
  author_name: string | null;
  tags: string[] | null;
  tags_pt: string[] | null;
  status: ContentStatus;
  published_at: string | null;
};

type ClientLogoRow = {
  id: string;
  client_name: string;
  logo_url: string;
  alternate_logo_url: string | null;
  alt: string;
  url: string | null;
  sort_order: number;
  published: boolean;
  related_case_study_id: string | null;
};

function mapCaseStudyMedia(row: CaseStudyMediaRow): CaseStudyMedia {
  return {
    id: row.id,
    caseStudyId: row.case_study_id,
    mediaType: row.media_type,
    src: row.src,
    alt: row.alt,
    caption: row.caption,
    sortOrder: row.sort_order,
    published: row.published
  };
}

function translatedText(locale: Locale, translated: string | null, fallback: string) {
  return locale === "pt" && translated?.trim() ? translated : fallback;
}

function translatedOptional(locale: Locale, translated: string | null, fallback: string | null) {
  return locale === "pt" && translated?.trim() ? translated : fallback;
}

function translatedList(locale: Locale, translated: string[] | null, fallback: string[] | null) {
  return locale === "pt" && translated?.length ? translated : (fallback ?? []);
}

function mapCaseStudy(row: CaseStudyRow, media: CaseStudyMediaRow[] = [], locale: Locale = "en"): CaseStudy {
  return {
    id: row.id,
    title: translatedText(locale, row.title_pt, row.title),
    titlePt: row.title_pt,
    slug: row.slug,
    clientName: row.client_name,
    location: row.location,
    sector: translatedOptional(locale, row.sector_pt, row.sector),
    sectorPt: row.sector_pt,
    summary: translatedText(locale, row.summary_pt, row.summary),
    summaryPt: row.summary_pt,
    challenge: translatedOptional(locale, row.challenge_pt, row.challenge),
    challengePt: row.challenge_pt,
    solution: translatedOptional(locale, row.solution_pt, row.solution),
    solutionPt: row.solution_pt,
    result: translatedOptional(locale, row.result_pt, row.result),
    resultPt: row.result_pt,
    services: translatedList(locale, row.services_pt, row.services),
    servicesPt: row.services_pt ?? [],
    heroImage: row.hero_image,
    heroImageAlt: translatedOptional(locale, row.hero_image_alt_pt, row.hero_image_alt),
    heroImageAltPt: row.hero_image_alt_pt,
    featured: row.featured,
    displayOrder: row.display_order,
    status: row.status,
    publishedAt: row.published_at,
    media: media
      .filter((media) => media.published)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapCaseStudyMedia)
  };
}

function mapBlogPost(row: BlogPostRow, locale: Locale = "en"): BlogPost {
  return {
    id: row.id,
    title: translatedText(locale, row.title_pt, row.title),
    titlePt: row.title_pt,
    slug: row.slug,
    excerpt: translatedText(locale, row.excerpt_pt, row.excerpt),
    excerptPt: row.excerpt_pt,
    content: translatedText(locale, row.content_pt, row.content),
    contentPt: row.content_pt,
    coverImage: row.cover_image,
    coverImageAlt: translatedOptional(locale, row.cover_image_alt_pt, row.cover_image_alt),
    coverImageAltPt: row.cover_image_alt_pt,
    authorName: row.author_name,
    tags: translatedList(locale, row.tags_pt, row.tags),
    tagsPt: row.tags_pt ?? [],
    status: row.status,
    publishedAt: row.published_at
  };
}

function mapClientLogo(row: ClientLogoRow): ClientLogo {
  return {
    id: row.id,
    clientName: row.client_name,
    logoUrl: row.logo_url,
    alternateLogoUrl: row.alternate_logo_url,
    alt: row.alt,
    url: row.url,
    sortOrder: row.sort_order,
    published: row.published,
    relatedCaseStudyId: row.related_case_study_id
  };
}

export async function getPublishedCaseStudies(locale: Locale = "en") {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select(
      "id,title,title_pt,slug,client_name,location,sector,sector_pt,summary,summary_pt,challenge,challenge_pt,solution,solution_pt,result,result_pt,services,services_pt,hero_image,hero_image_alt,hero_image_alt_pt,featured,display_order,status,published_at"
    )
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  const caseStudyRows = data as CaseStudyRow[];
  const caseStudyIds = caseStudyRows.map((caseStudy) => caseStudy.id);
  const { data: mediaData } = await supabase
    .from("case_study_media")
    .select("id,case_study_id,media_type,src,alt,caption,sort_order,published")
    .in("case_study_id", caseStudyIds)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  const mediaByCaseStudy = ((mediaData ?? []) as CaseStudyMediaRow[]).reduce<
    Record<string, CaseStudyMediaRow[]>
  >((groups, item) => {
    groups[item.case_study_id] = groups[item.case_study_id] ?? [];
    groups[item.case_study_id].push(item);
    return groups;
  }, {});

  return caseStudyRows.map((caseStudy) =>
    mapCaseStudy(caseStudy, mediaByCaseStudy[caseStudy.id] ?? [], locale)
  );
}

export async function getFeaturedCaseStudies(locale: Locale = "en") {
  const caseStudies = await getPublishedCaseStudies(locale);
  return caseStudies
    .filter(
      (caseStudy) =>
        caseStudy.featured &&
        Boolean(caseStudy.heroImage || caseStudy.media?.length)
    )
    .sort((a, b) => {
      const orderDifference = a.displayOrder - b.displayOrder;
      if (orderDifference !== 0) return orderDifference;
      return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
    });
}

export async function getCaseStudyBySlug(slug: string, locale: Locale = "en") {
  const caseStudies = await getPublishedCaseStudies(locale);
  return caseStudies.find((caseStudy) => caseStudy.slug === slug) ?? null;
}

export async function getPublishedBlogPosts(locale: Locale = "en") {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,title,title_pt,slug,excerpt,excerpt_pt,content,content_pt,cover_image,cover_image_alt,cover_image_alt_pt,author_name,tags,tags_pt,status,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  return (data as BlogPostRow[]).map((post) => mapBlogPost(post, locale));
}

export async function getBlogPostBySlug(slug: string, locale: Locale = "en") {
  const posts = await getPublishedBlogPosts(locale);
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getPublishedClientLogos() {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("client_logos")
    .select("id,client_name,logo_url,alternate_logo_url,alt,url,sort_order,published,related_case_study_id")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return [];
  }

  return (data as ClientLogoRow[]).map(mapClientLogo);
}

export async function getAdminContentCounts() {
  if (!isSupabaseConfigured()) {
    return {
      caseStudies: 0,
      blogPosts: 0,
      clientLogos: 0
    };
  }

  const supabase = await createSupabaseServerClient();
  const [caseStudies, blogPosts, clientLogos] = await Promise.all([
    supabase.from("case_studies").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("client_logos").select("id", { count: "exact", head: true })
  ]);

  return {
    caseStudies: caseStudies.count ?? 0,
    blogPosts: blogPosts.count ?? 0,
    clientLogos: clientLogos.count ?? 0
  };
}
