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

export type AssessmentCategory = {
  key: string;
  label: string;
  weight: number;
  legacyKeys?: string[];
};

export type AssessmentProfile = {
  key: "HOTEL_ACCOMMODATION" | "RESTAURANT_CAFE" | "BAR";
  label: string;
  categories: AssessmentCategory[];
};

const HOTEL_CATEGORIES: AssessmentCategory[] = [
  { key: "website_mobile", label: "Website & Mobile", weight: 12 },
  { key: "direct_booking", label: "Direct Booking Journey", weight: 15 },
  { key: "ota_presentation", label: "OTA Presentation", weight: 13 },
  { key: "google_local", label: "Google & Local", weight: 8 },
  { key: "reputation_reviews", label: "Reputation & Reviews", weight: 8 },
  { key: "photography_visual", label: "Photography & Visual", weight: 10 },
  { key: "rooms_accommodation", label: "Rooms & Accommodation Presentation", weight: 8 },
  { key: "seo_discovery", label: "SEO & Discovery", weight: 8 },
  { key: "offers_packages", label: "Offers & Packages", weight: 6 },
  { key: "crm_retention", label: "CRM & Guest Retention", weight: 4 },
  { key: "analytics_tracking", label: "Analytics & Tracking", weight: 4 },
  { key: "campaign_readiness", label: "Campaign Readiness", weight: 4 },
];

const RESTAURANT_CATEGORIES: AssessmentCategory[] = [
  { key: "website_mobile", label: "Website & Mobile", weight: 10 },
  { key: "reservation_contact", label: "Reservation / Contact Journey", weight: 12, legacyKeys: ["reservation_ordering"] },
  { key: "google_local", label: "Google & Local", weight: 12 },
  { key: "reputation_reviews", label: "Reputation & Reviews", weight: 10 },
  { key: "photography_visual", label: "Photography & Visual", weight: 12 },
  { key: "social_content", label: "Social Media & Content", weight: 12 },
  { key: "menu_offer", label: "Menu & Offer", weight: 12 },
  { key: "seo_discovery", label: "SEO & Discovery", weight: 7 },
  { key: "ordering_delivery", label: "Ordering / Delivery", weight: 3 },
  { key: "crm_retention", label: "CRM & Customer Retention", weight: 3 },
  { key: "analytics_tracking", label: "Analytics & Tracking", weight: 3 },
  { key: "campaign_readiness", label: "Campaign Readiness", weight: 4 },
];

const BAR_CATEGORIES: AssessmentCategory[] = [
  { key: "website_mobile", label: "Website & Mobile", weight: 8 },
  { key: "google_local", label: "Google & Local", weight: 12 },
  { key: "reputation_reviews", label: "Reputation & Reviews", weight: 7 },
  { key: "photography_visual", label: "Photography & Visual", weight: 12 },
  { key: "social_content", label: "Social Media & Content", weight: 12 },
  { key: "drinks_bar_menu", label: "Drinks / Bar Menu", weight: 12 },
  { key: "atmosphere_experience", label: "Atmosphere & Experience", weight: 12 },
  { key: "events_programming", label: "Events & Programming", weight: 10 },
  { key: "reservation_contact", label: "Reservation / Contact", weight: 5 },
  { key: "seo_discovery", label: "SEO & Discovery", weight: 4 },
  { key: "crm_retention", label: "CRM & Customer Retention", weight: 3 },
  { key: "campaign_readiness", label: "Campaign Readiness", weight: 3 },
];

export const ASSESSMENT_PROFILES: Record<AssessmentProfile["key"], AssessmentProfile> = {
  HOTEL_ACCOMMODATION: { key: "HOTEL_ACCOMMODATION", label: "Hotel & Accommodation", categories: HOTEL_CATEGORIES },
  RESTAURANT_CAFE: { key: "RESTAURANT_CAFE", label: "Restaurant & Cafe", categories: RESTAURANT_CATEGORIES },
  BAR: { key: "BAR", label: "Bar", categories: BAR_CATEGORIES },
};

export function isAccommodationType(value: string) {
  return ["Hotel", "Boutique Hotel", "Guesthouse", "Aparthotel", "Accommodation"].includes(value);
}

export function assessmentProfile(businessType: string): AssessmentProfile {
  if (isAccommodationType(businessType)) return ASSESSMENT_PROFILES.HOTEL_ACCOMMODATION;
  if (businessType === "Bar") return ASSESSMENT_PROFILES.BAR;
  return ASSESSMENT_PROFILES.RESTAURANT_CAFE;
}

export function assessmentCategories(businessType: string) {
  return assessmentProfile(businessType).categories;
}

export function calculateDigitalPresenceScore(businessType: string, scores: Record<string, number | null | undefined>) {
  const categories = assessmentCategories(businessType);
  const applicable = categories.filter((category) => scores[category.key] !== null);
  if (!applicable.length || applicable.some((category) => !scores[category.key] || scores[category.key]! < 1 || scores[category.key]! > 5)) return null;
  const applicableWeight = applicable.reduce((total, category) => total + category.weight, 0);
  return Math.round(applicable.reduce((total, category) => total + ((scores[category.key]! - 1) / 4) * category.weight, 0) / applicableWeight * 100);
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
