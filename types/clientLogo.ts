export type ClientLogo = {
  id?: string;
  clientName: string;
  logoUrl: string;
  alternateLogoUrl?: string | null;
  alt: string;
  url?: string | null;
  sortOrder: number;
  published: boolean;
  relatedCaseStudyId?: string | null;
};
