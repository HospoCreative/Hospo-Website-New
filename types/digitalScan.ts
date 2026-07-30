export type ScanAreaKey =
  | "website"
  | "seo"
  | "booking"
  | "google"
  | "visibility"
  | "social_visual"
  | "brand"
  | "photography";

export type SocialFeedMetrics = {
  source: "screenshot";
  width: number;
  height: number;
  tileCount: number;
  colourCohesion: number;
  exposureBalance: number;
  contrastBalance: number;
  imageQuality: number;
  repetitionRisk: number;
};

export type ScanConfidence = "verified" | "partial" | "not_confirmed";

export type ScanArea = {
  key: ScanAreaKey;
  title: string;
  score: number;
  confidence: ScanConfidence;
  summary: string;
  findings: string[];
};

export type DigitalScanReport = {
  id?: string;
  websiteUrl: string;
  finalUrl: string;
  businessName: string;
  location: string;
  scannedAt: string;
  overallScore: number;
  pageSpeedAvailable: boolean;
  areas: ScanArea[];
  priorities: string[];
  discovered: {
    socialLinks: string[];
    otaLinks: string[];
    googleLinks: string[];
  };
  limitations: string[];
};
