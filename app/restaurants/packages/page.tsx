import type { Metadata } from "next";
import { CommercialPackagesLanding } from "@/components/CommercialPackagesLanding";
import { getRequestLocale } from "@/lib/locale-server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { CommercialItem } from "@/types/commercial";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function RestaurantPackagesPage() {
  const locale = await getRequestLocale();
  const supabase = createSupabasePublicClient();
  const [{ data: packageRows }, { data: addonRows }] = await Promise.all([supabase.from("packages").select("*").eq("market", "restaurant").eq("is_active", true).order("sort_order"), supabase.from("addons").select("*").eq("market", "restaurant").eq("is_active", true).order("sort_order")]);
  return <CommercialPackagesLanding market="restaurant" locale={locale} packages={(packageRows ?? []) as CommercialItem[]} addons={(addonRows ?? []) as CommercialItem[]} />;
}
