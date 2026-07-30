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
  titlePt?: string | null;
  slug: string;
  clientName: string;
  location?: string | null;
  sector?: string | null;
  sectorPt?: string | null;
  summary: string;
  summaryPt?: string | null;
  challenge?: string | null;
  challengePt?: string | null;
  solution?: string | null;
  solutionPt?: string | null;
  result?: string | null;
  resultPt?: string | null;
  services: string[];
  servicesPt?: string[];
  heroImage?: string | null;
  heroImageAlt?: string | null;
  heroImageAltPt?: string | null;
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
  publishedAt?: string | null;
  media?: CaseStudyMedia[];
};
