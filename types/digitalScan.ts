export type ScanAreaKey =
  | "website"
  | "seo"
  | "booking"
  | "google"
  | "visibility"
  | "brand"
  | "photography";

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
