import type { Metadata } from "next";
import { CommercialHubPage } from "@/components/CommercialPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { commercialHubs } from "@/data/commercialPages";
import { sectorSeo } from "@/data/seoContent";
import { getRequestLocale } from "@/lib/locale-server";
import { buildPageMetadata } from "@/lib/seo";
import { getPublishedCaseStudies } from "@/lib/supabase/queries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const seo = sectorSeo["hotels-stays"][locale];
  return buildPageMetadata({ title: seo.title, description: seo.description, pathname: "/hotels-stays", locale });
}

export default async function HotelsAndStaysPage() {
  const locale = await getRequestLocale();
  const caseStudies = await getPublishedCaseStudies(locale);
  return <><Header locale={locale} /><CommercialHubPage hub={commercialHubs["hotels-stays"]} locale={locale} caseStudies={caseStudies} /><Footer locale={locale} /></>;
}
