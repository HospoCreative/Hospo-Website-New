import type { ContentStatus } from "./caseStudy";

export type BlogPost = {
  id?: string;
  title: string;
  titlePt?: string | null;
  slug: string;
  excerpt: string;
  excerptPt?: string | null;
  content: string;
  contentPt?: string | null;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  coverImageAltPt?: string | null;
  authorName?: string | null;
  tags: string[];
  tagsPt?: string[];
  status: ContentStatus;
  publishedAt?: string | null;
};
