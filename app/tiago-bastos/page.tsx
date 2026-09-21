import type { Metadata } from "next";
import { TiagoBastosProfile } from "@/components/TiagoBastosProfile";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { getRequestLocale } from "@/lib/locale-server";
import { FAVICON, SITE_URL } from "@/lib/seo";
import { getPublishedCaseStudies } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const portuguese = locale === "pt";
  const title = portuguese ? "Tiago Bastos | Criador de Conteúdo, Fotógrafo e Videógrafo" : "Tiago Bastos | Content Creator, Photographer & Videographer";
  const description = portuguese ? "Criador de conteúdo, fotógrafo e videógrafo especializado em hotelaria, gastronomia e lifestyle em Portugal, no Reino Unido e em projetos internacionais." : "Content creator, photographer and videographer specialising in hospitality, food and lifestyle content across Portugal, the UK and international projects.";
  return { metadataBase: new URL(SITE_URL), title, description, robots: { index: false, follow: false, nocache: true }, icons: { icon: [{ url: FAVICON, type: "image/png", sizes: "500x500" }], shortcut: FAVICON, apple: FAVICON } };
}

export default async function TiagoBastosPage() {
  const locale = await getRequestLocale();
  const caseStudies = await getPublishedCaseStudies(locale);
  const description = locale === "pt" ? "Criador de conteúdo, fotógrafo e videógrafo especializado em hotelaria, gastronomia e lifestyle." : "Content creator, photographer and videographer specialising in hospitality, food and lifestyle.";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Tiago Bastos",
    description,
    url: `${SITE_URL}${locale === "pt" ? "/pt" : ""}/tiago-bastos`,
    sameAs: ["https://www.linkedin.com/in/tiagobastos93", "https://hospocreative.com/services/photography-video"],
    address: { "@type": "PostalAddress", addressCountry: "PT" },
    knowsAbout: ["Content Creation", "Photography", "Videography", "Hospitality Content", "Food Photography", "Creative Production"]
  };
  return <main id="main"><SeoStructuredData data={structuredData} /><TiagoBastosProfile locale={locale} caseStudies={caseStudies} /></main>;
}
