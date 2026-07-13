export type ContentStatus = "draft" | "published" | "archived";

export type CaseStudyMedia = {
  id?: string;
  caseStudyId?: string;
  mediaType: "image" | "video" | "embed";
  src: string;
  alt: string;
  caption?: string | null;
  sortOrder: number;
  published?: boolean;
};

export type CaseStudy = {
  id?: string;
  title: string;
  slug: string;
  clientName: string;
  location?: string | null;
  sector?: string | null;
  summary: string;
  challenge?: string | null;
  solution?: string | null;
  result?: string | null;
  services: string[];
  heroImage?: string | null;
  heroImageAlt?: string | null;
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
  publishedAt?: string | null;
  media?: CaseStudyMedia[];
};
