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
  return buildPageMetadata({ title: locale === "pt" ? "Marketing para Restaurantes e F&B | Hospo Creative" : "Restaurant & F&B Marketing | Hospo Creative", description: locale === "pt" ? "Estratégia, campanhas, conteúdo e presença digital para restaurantes, bares e marcas F&B." : "Strategy, campaigns, content and digital marketing for restaurants, bars, food-led venues and F&B brands.", pathname: "/restaurants-fb", locale });
}

export default async function RestaurantsAndFbPage() {
  const locale = await getRequestLocale();
  const caseStudies = await getPublishedCaseStudies(locale);
  return <><Header locale={locale} /><CommercialHubPage hub={commercialHubs["restaurants-fb"]} locale={locale} caseStudies={caseStudies} /><Footer locale={locale} /></>;
}
