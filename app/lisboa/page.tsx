import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LocationMarketingPage } from "@/components/LocationMarketingPage";
import { locationPages } from "@/data/seoContent";
import { getRequestLocale } from "@/lib/locale-server";
import { buildPageMetadata } from "@/lib/seo";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const page = locationPages.lisboa[locale];
  return buildPageMetadata({ title: page.titleTag, description: page.metaDescription, pathname: "/lisboa", locale });
}

export default async function LisboaPage() {
  const locale = await getRequestLocale();
  return <><Header locale={locale} /><LocationMarketingPage slug="lisboa" locale={locale} /><Footer locale={locale} /></>;
}
