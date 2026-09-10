import type { CommercialItem } from "@/types/commercial";

export const contentCreationPackages: CommercialItem[] = [
  {
    id: "content-essentials-private", slug: "content-essentials", name: "Content Essentials", name_pt: null,
    market: "general", category: "content_creation", description: "Best suited for a focused content refresh.", description_pt: null,
    price_amount: 350, price_currency: "GBP", price_type: "project", price_note: null, price_note_pt: null,
    included_items: ["Up to 3-hour content shoot", "25–30 professionally edited photos", "2 edited short-form vertical videos", "Content tailored to the business, brand and key areas they want to promote", "Optimised for Instagram, Facebook and TikTok"],
    included_items_pt: [], featured: false, badge: null, badge_pt: null, is_active: true, sort_order: 10
  },
  {
    id: "content-plus-private", slug: "content-plus", name: "Content Plus", name_pt: null,
    market: "general", category: "content_creation", description: "Best suited for creating a stronger and more varied bank of content.", description_pt: null,
    price_amount: 450, price_currency: "GBP", price_type: "project", price_note: null, price_note_pt: null,
    included_items: ["Up to 4-hour content shoot", "35–45 professionally edited photos", "3 edited short-form vertical videos", "Broader content coverage across the business, products, services, atmosphere and experience", "More variety of scenes, details and moments captured during the shoot", "Optimised for Instagram, Facebook and TikTok"],
    included_items_pt: [], featured: true, badge: "Most Popular", badge_pt: null, is_active: true, sort_order: 20
  },
  {
    id: "content-campaign-private", slug: "content-campaign", name: "Content Campaign", name_pt: null,
    market: "general", category: "content_creation", description: "Best suited for businesses wanting a larger and more versatile content library.", description_pt: null,
    price_amount: 600, price_currency: "GBP", price_type: "project", price_note: null, price_note_pt: null,
    included_items: ["Up to 6-hour content shoot", "50–60 professionally edited photos", "4 edited short-form vertical videos", "More comprehensive coverage of the business, atmosphere, people, products, services and overall experience", "Greater variety of content captured across different setups, locations or areas of the venue", "Optimised for Instagram, Facebook and TikTok"],
    included_items_pt: [], featured: false, badge: null, badge_pt: null, is_active: true, sort_order: 30
  }
];
