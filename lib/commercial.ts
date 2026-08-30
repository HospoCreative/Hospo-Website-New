import type { CommercialItem, PriceType } from "@/types/commercial";

export const COMMERCIAL_MARKETS = ["restaurant", "hotel", "general"] as const;
export const COMMERCIAL_CATEGORIES = ["marketing", "content_creation"] as const;
export const PRICE_TYPES = ["project", "from_project", "monthly", "from_monthly", "custom"] as const;

export function displayPrice(item: Pick<CommercialItem, "price_amount" | "price_currency" | "price_type" | "price_note">, locale: "en" | "pt" = "en") {
  if (item.price_type === "custom" || item.price_amount === null) return item.price_note || (locale === "pt" ? "Sob consulta" : "On request");
  const amount = new Intl.NumberFormat(locale === "pt" ? "de-DE" : "en-GB", { maximumFractionDigits: 0, useGrouping: true }).format(item.price_amount);
  const value = item.price_currency === "EUR" ? `€${amount}` : `£${amount}`;
  const prefix = item.price_type.startsWith("from_") ? (locale === "pt" ? "Desde " : "From ") : "";
  const suffix = item.price_type.endsWith("monthly") ? (locale === "pt" ? "/mês" : "/month") : "";
  return `${prefix}${value}${suffix}`;
}

export function commercialItemSnapshot(item: CommercialItem) {
  return {
    slug: item.slug, name: item.name, name_pt: item.name_pt, market: item.market,
    description: item.description, description_pt: item.description_pt,
    price_amount: item.price_amount, price_currency: item.price_currency, price_type: item.price_type,
    price_note: item.price_note, price_note_pt: item.price_note_pt,
    included_items: item.included_items, included_items_pt: item.included_items_pt,
    captured_at: new Date().toISOString(),
  };
}

export function asPriceType(value: string): PriceType {
  return (PRICE_TYPES as readonly string[]).includes(value) ? value as PriceType : "custom";
}
