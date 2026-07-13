import { fallbackBlogPosts } from "@/content/fallback/blogPosts";
import { fallbackCaseStudies } from "@/content/fallback/caseStudies";
import { fallbackClientLogos } from "@/content/fallback/clientLogos";
import type { BlogPost } from "@/types/blogPost";
import type { CaseStudy, CaseStudyMedia, ContentStatus } from "@/types/caseStudy";
import type { ClientLogo } from "@/types/clientLogo";
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
  slug: string;
  client_name: string;
  location: string | null;
  sector: string | null;
  summary: string;
  challenge: string | null;
  solution: string | null;
  result: string | null;
  services: string[] | null;
  hero_image: string | null;
  hero_image_alt: string | null;
  featured: boolean;
  display_order: number;
  status: ContentStatus;
  published_at: string | null;
};

type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  cover_image_alt: string | null;
  author_name: string | null;
  tags: string[] | null;
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

function mapCaseStudy(row: CaseStudyRow, media: CaseStudyMediaRow[] = []): CaseStudy {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    clientName: row.client_name,
    location: row.location,
    sector: row.sector,
    summary: row.summary,
    challenge: row.challenge,
    solution: row.solution,
    result: row.result,
    services: row.services ?? [],
    heroImage: row.hero_image,
    heroImageAlt: row.hero_image_alt,
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

function mapBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    coverImageAlt: row.cover_image_alt,
    authorName: row.author_name,
    tags: row.tags ?? [],
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

export async function getPublishedCaseStudies() {
  if (!isSupabaseConfigured()) {
    return fallbackCaseStudies;
  }

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select(
      "id,title,slug,client_name,location,sector,summary,challenge,solution,result,services,hero_image,hero_image_alt,featured,display_order,status,published_at"
    )
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return fallbackCaseStudies;
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
    mapCaseStudy(caseStudy, mediaByCaseStudy[caseStudy.id] ?? [])
  );
}

export async function getFeaturedCaseStudies() {
  const caseStudies = await getPublishedCaseStudies();
  return caseStudies
    .filter((caseStudy) => caseStudy.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getCaseStudyBySlug(slug: string) {
  const caseStudies = await getPublishedCaseStudies();
  return caseStudies.find((caseStudy) => caseStudy.slug === slug) ?? null;
}

export async function getPublishedBlogPosts() {
  if (!isSupabaseConfigured()) {
    return fallbackBlogPosts;
  }

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,title,slug,excerpt,content,cover_image,cover_image_alt,author_name,tags,status,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return fallbackBlogPosts;
  }

  return (data as BlogPostRow[]).map(mapBlogPost);
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getPublishedBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getPublishedClientLogos() {
  if (!isSupabaseConfigured()) {
    return fallbackClientLogos;
  }

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("client_logos")
    .select("id,client_name,logo_url,alternate_logo_url,alt,url,sort_order,published,related_case_study_id")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackClientLogos;
  }

  return (data as ClientLogoRow[]).map(mapClientLogo);
}

export async function getAdminContentCounts() {
  if (!isSupabaseConfigured()) {
    return {
      caseStudies: fallbackCaseStudies.length,
      blogPosts: fallbackBlogPosts.length,
      clientLogos: fallbackClientLogos.length
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
