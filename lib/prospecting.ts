export const BUSINESS_TYPES = [
  "Hotel", "Boutique Hotel", "Guesthouse", "Aparthotel", "Accommodation",
  "Restaurant", "Cafe", "Bar", "F&B Group", "Other"
] as const;

export const MARKETS = ["Portugal", "United Kingdom", "Other"] as const;
export const LEAD_FITS = ["A", "B", "C"] as const;
export const PIPELINE_STATUSES = [
  "New", "To Analyse", "Analysis Ready", "Ready for Outreach", "Contacted",
  "Follow-up 1", "Follow-up 2", "Replied", "Meeting", "Proposal",
  "Negotiation", "Won", "Lost", "Paused"
] as const;
export const PRIORITIES = ["HOT", "WARM", "WATCH", "LOW"] as const;
export const HOSPO_SERVICES = [
  "Strategy & Campaigns", "Websites & Direct Booking", "OTA Optimisation",
  "SEO & Google Visibility", "Photography & Video", "Social Media", "Email & CRM",
  "Reputation & Reviews", "Analytics & Reporting", "Influencer Marketing"
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];
export type LeadFit = (typeof LEAD_FITS)[number];
export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

type AssessmentCategory = { key: string; label: string; weight: number };

const HOTEL_CATEGORIES: AssessmentCategory[] = [
  { key: "website_mobile", label: "Website & Mobile", weight: 15 }, { key: "direct_booking", label: "Direct Booking", weight: 15 },
  { key: "ota_presentation", label: "OTA Presentation", weight: 15 }, { key: "google_local", label: "Google & Local", weight: 10 },
  { key: "reputation_reviews", label: "Reputation & Reviews", weight: 10 }, { key: "photography_visual", label: "Photography & Visual", weight: 10 },
  { key: "seo_discovery", label: "SEO & Discovery", weight: 10 }, { key: "crm_retention", label: "CRM & Retention", weight: 5 },
  { key: "analytics_tracking", label: "Analytics & Tracking", weight: 5 }, { key: "campaign_readiness", label: "Campaign Readiness", weight: 5 }
];

const RESTAURANT_CATEGORIES: AssessmentCategory[] = [
  { key: "website_mobile", label: "Website & Mobile", weight: 15 }, { key: "reservation_ordering", label: "Reservation / Contact / Ordering", weight: 15 },
  { key: "google_local", label: "Google & Local", weight: 10 }, { key: "reputation_reviews", label: "Reputation & Reviews", weight: 10 },
  { key: "photography_visual", label: "Photography & Visual", weight: 10 }, { key: "social_content", label: "Social Media & Content", weight: 10 },
  { key: "menu_offer", label: "Menu & Offer", weight: 10 }, { key: "seo_discovery", label: "SEO & Discovery", weight: 10 },
  { key: "crm_retention", label: "CRM & Retention", weight: 3 }, { key: "analytics_tracking", label: "Analytics & Tracking", weight: 3 },
  { key: "campaign_readiness", label: "Campaign Readiness", weight: 4 }
];

export function isAccommodationType(value: string) {
  return ["Hotel", "Boutique Hotel", "Guesthouse", "Aparthotel", "Accommodation"].includes(value);
}

export function assessmentCategories(businessType: string) {
  return isAccommodationType(businessType) ? HOTEL_CATEGORIES : RESTAURANT_CATEGORIES;
}

export function calculateDigitalPresenceScore(businessType: string, scores: Record<string, number | undefined>) {
  const categories = assessmentCategories(businessType);
  if (categories.some((category) => !scores[category.key] || scores[category.key]! < 1 || scores[category.key]! > 5)) return null;
  return Math.round(categories.reduce((total, category) => total + ((scores[category.key]! - 1) / 4) * category.weight, 0));
}

export function calculateOpportunityScore(input: {
  digitalPresenceScore: number | null;
  commercialFit: number | null;
  contactability: number | null;
  commercialTrigger: number | null;
  evidenceQuality: number | null;
}) {
  if (
    input.digitalPresenceScore === null ||
    input.digitalPresenceScore < 0 ||
    input.digitalPresenceScore > 100 ||
    [input.commercialFit, input.contactability, input.commercialTrigger, input.evidenceQuality].some(
      (value) => value === null || value < 1 || value > 5
    )
  ) return null;
  const digitalOpportunity = 100 - input.digitalPresenceScore!;
  return Math.round(
    digitalOpportunity * 0.45 + ((input.commercialFit! - 1) / 4) * 100 * 0.25 +
    ((input.contactability! - 1) / 4) * 100 * 0.15 + ((input.commercialTrigger! - 1) / 4) * 100 * 0.10 +
    ((input.evidenceQuality! - 1) / 4) * 100 * 0.05
  );
}

export function priorityFromScore(score: number | null, leadFit: string): Priority {
  if (leadFit === "C" || score === null) return "LOW";
  if (score >= 75) return "HOT";
  if (score >= 55) return "WARM";
  if (score >= 35) return "WATCH";
  return "LOW";
}

export function formatLeadFit(value: string) {
  return ({ A: "A | Strong Fit", B: "B | Possible Fit", C: "C | Low Fit" } as Record<string, string>)[value] ?? value;
}
