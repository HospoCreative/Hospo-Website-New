export const PROPOSAL_STATUSES = [
  "draft",
  "ready",
  "sent",
  "viewed",
  "interested",
  "accepted",
  "declined",
  "archived",
] as const;

export const PROPOSAL_EVENT_TYPES = [
  "created",
  "package_selected",
  "ready",
  "sent",
  "viewed",
  "cta_clicked",
  "accepted",
  "declined",
  "archived",
] as const;

export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];
export type ProposalEventType = (typeof PROPOSAL_EVENT_TYPES)[number];
export type CommercialMarket = "restaurant" | "hotel" | "general";
export type CommercialCategory = "marketing" | "content_creation";
export type PriceType = "project" | "from_project" | "monthly" | "from_monthly" | "custom";

export type CommercialItem = {
  id: string;
  slug: string;
  name: string;
  name_pt: string | null;
  market: CommercialMarket;
  category?: CommercialCategory;
  description: string | null;
  description_pt: string | null;
  price_amount: number | null;
  price_currency: "EUR" | "GBP";
  price_type: PriceType;
  price_note: string | null;
  price_note_pt: string | null;
  included_items: string[];
  included_items_pt: string[];
  excluded_items?: string[];
  excluded_items_pt?: string[];
  commercial_terms?: string | null;
  commercial_terms_pt?: string | null;
  featured?: boolean;
  badge?: string | null;
  badge_pt?: string | null;
  is_active: boolean;
  sort_order: number;
};

export type Proposal = {
  id: string;
  slug: string;
  prospect_id: string | null;
  status: ProposalStatus;
  language: "en" | "pt";
  template_type: "restaurant" | "hotel" | "custom";
  proposal_date: string;
  sent_at: string | null;
  valid_until: string | null;
  client_name: string | null;
  business_name: string | null;
  business_type: string | null;
  contact_name: string | null;
  contact_email: string | null;
  website_url: string | null;
  market: string | null;
  location: string | null;
  headline: string | null;
  introduction: string | null;
  prepared_for: string | null;
  prepared_by: string | null;
  personal_message: string | null;
  objectives: string[];
  observations: unknown[];
  opportunities: unknown[];
  commercial_details: Record<string, unknown>;
  cta_config: Record<string, unknown>;
  package_id: string | null;
  package_snapshot: Record<string, unknown> | null;
  package_overrides: Record<string, unknown>;
  first_viewed_at: string | null;
  last_viewed_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type PublicProposal = Omit<Proposal, "prospect_id" | "contact_email" | "sent_at" | "first_viewed_at" | "last_viewed_at" | "view_count" | "created_at" | "updated_at"> & {
  addons: Array<{ snapshot: Record<string, unknown>; overrides: Record<string, unknown>; sort_order: number }>;
  case_studies: Array<{ snapshot: Record<string, unknown>; sort_order: number }>;
  media: Array<{ source_url: string; alt_text: string | null; media_type: "image" | "video"; sort_order: number }>;
};
