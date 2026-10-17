import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlgarveRestaurantMarketingPage } from "@/components/AlgarveRestaurantMarketingPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getRequestLocale } from "@/lib/locale-server";
import { DEFAULT_OG_IMAGE, FAVICON, SITE_URL } from "@/lib/seo";
import { getPublishedCaseStudies } from "@/lib/supabase/queries";

const pathname = "/pt/algarve/redes-sociais-fotografia-restaurantes";
const englishPath = "/algarve/restaurant-social-media-photography";
const title = "Fotografia e Redes Sociais para Restaurantes no Algarve | Hospo Creative";
const description = "Fotografia gastronómica, vídeo, Reels e gestão de redes sociais para restaurantes, bares e negócios F&B no Algarve. Conteúdo, estratégia, Meta Ads e campanhas.";

export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  icons: { icon: [{ url: FAVICON, type: "image/png", sizes: "500x500" }], shortcut: FAVICON, apple: FAVICON },
  alternates: { canonical: pathname, languages: { "en-GB": englishPath, "pt-PT": pathname, "x-default": englishPath } },
  openGraph: { type: "website", url: pathname, siteName: "Hospo Creative", locale: "pt_PT", alternateLocale: ["en_GB"], title, description, images: [{ url: DEFAULT_OG_IMAGE, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE] }
};

export default async function AlgarveRestaurantMarketingPageRoute() {
  const locale = await getRequestLocale();
  if (locale !== "pt") notFound();
  const caseStudies = await getPublishedCaseStudies("pt");
  return <><Header locale="pt" /><AlgarveRestaurantMarketingPage caseStudies={caseStudies} /><Footer locale="pt" /></>;
}
