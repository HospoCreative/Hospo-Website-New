import type { Metadata } from "next";
import { CommercialHubPage } from "@/components/CommercialPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { commercialHubs } from "@/data/commercialPages";
import { getRequestLocale } from "@/lib/locale-server";
import { buildPageMetadata } from "@/lib/seo";
import { getPublishedCaseStudies } from "@/lib/supabase/queries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({ title: locale === "pt" ? "Marketing para Hotéis e Alojamentos | Hospo Creative" : "Hotel & Stay Marketing | Hospo Creative", description: locale === "pt" ? "Marketing, presença digital e otimização de reservas diretas para hotéis, alojamentos e grupos independentes." : "Marketing, digital presence and direct-booking optimisation for independent hotels, stays and accommodation groups.", pathname: "/hotels-stays", locale });
}

export default async function HotelsAndStaysPage() {
  const locale = await getRequestLocale();
  const caseStudies = await getPublishedCaseStudies(locale);
  return <><Header locale={locale} /><CommercialHubPage hub={commercialHubs["hotels-stays"]} locale={locale} caseStudies={caseStudies} /><Footer locale={locale} /></>;
}
