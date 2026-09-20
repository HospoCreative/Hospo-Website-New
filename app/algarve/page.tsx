import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LocationMarketingPage } from "@/components/LocationMarketingPage";
import { locationPages } from "@/data/seoContent";
import { getRequestLocale } from "@/lib/locale-server";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const page = locationPages.algarve[locale];
  return buildPageMetadata({ title: page.titleTag, description: page.metaDescription, pathname: "/algarve", locale });
}

export default async function AlgarvePage() {
  const locale = await getRequestLocale();
  return <><Header locale={locale} /><LocationMarketingPage slug="algarve" locale={locale} /><Footer locale={locale} /></>;
}
