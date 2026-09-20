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
  const seo = sectorSeo["restaurants-fb"][locale];
  return buildPageMetadata({ title: seo.title, description: seo.description, pathname: "/restaurants-fb", locale });
}

export default async function RestaurantsAndFbPage() {
  const locale = await getRequestLocale();
  const caseStudies = await getPublishedCaseStudies(locale);
  return <><Header locale={locale} /><CommercialHubPage hub={commercialHubs["restaurants-fb"]} locale={locale} caseStudies={caseStudies} /><Footer locale={locale} /></>;
}
