import type { Metadata } from "next";
import { GenericPackagesPage } from "@/components/GenericPackagesPage";
import { getRequestLocale } from "@/lib/locale-server";
import { getFeaturedCaseStudies } from "@/lib/supabase/queries";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PackagesPage() {
  const locale = await getRequestLocale();
  const supabase = createSupabasePublicClient();
  const [{ data: packages }, { data: values }, { data: addons }, { data: addonValues }, caseStudies] = await Promise.all([
    supabase.from("packages").select("id,slug,name,name_pt,category,featured,badge,badge_pt,sort_order").eq("market", "general").eq("is_active", true).order("sort_order"),
    supabase.from("package_market_values").select("package_id,currency,price_amount,price_type,price_note,description,deliverables,excluded_items,production_duration,minimum_commitment,cta_label,cta_destination").eq("is_active", true),
    supabase.from("addons").select("id,slug,name,name_pt,category,sort_order").eq("market", "general").eq("is_active", true).order("sort_order"),
    supabase.from("addon_market_values").select("addon_id,currency,price_amount,price_type,description").eq("is_active", true),
    getFeaturedCaseStudies(locale),
  ]);
  return <GenericPackagesPage locale={locale} packages={packages ?? []} values={values ?? []} addons={addons ?? []} addonValues={addonValues ?? []} caseStudies={caseStudies} />;
}
