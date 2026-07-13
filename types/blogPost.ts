import type { ContentStatus } from "./caseStudy";

export type BlogPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  authorName?: string | null;
  tags: string[];
  status: ContentStatus;
  publishedAt?: string | null;
};
