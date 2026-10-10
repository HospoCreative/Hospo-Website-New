import type { Metadata } from "next";
import { AndreiaOliveiraMarketingPage } from "@/components/AndreiaOliveiraMarketingPage";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { getRequestLocale } from "@/lib/locale-server";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const pathname = "/andreia-oliveira-digital-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    title: locale === "pt" ? "Redes Sociais para Hotéis e Restaurantes | Andreia Oliveira" : "Social Media for Hotels & Restaurants | Andreia Oliveira",
    description: locale === "pt" ? "Estratégia e gestão de redes sociais para hotéis, restaurantes e negócios de hotelaria e restauração no Algarve, Lisboa e Reino Unido. Social media, conteúdos e Meta Ads." : "Social media strategy and management for hotels, restaurants and hospitality businesses across Portugal and the UK, including the Algarve, Lisbon and West Midlands.",
    pathname,
    locale,
    image: "/images/about/Andreia.jpg"
  });
}

export default async function AndreiaOliveiraPage() {
  const locale = await getRequestLocale();
  const canonicalUrl = `${SITE_URL}${locale === "pt" ? "/pt" : ""}${pathname}`;
  const personId = `${SITE_URL}${pathname}#person`;
  const services = locale === "pt"
    ? ["Gestão de Redes Sociais", "Estratégia de Redes Sociais", "Gestão de Meta Ads", "Gestão de Google Ads", "Estratégia de Conteúdo e Campanhas", "Consultoria de Marketing Digital"]
    : ["Social Media Management", "Social Media Strategy", "Meta Ads Management", "Google Ads Management", "Content and Campaign Strategy", "Digital Marketing Consultancy"];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": canonicalUrl,
        url: canonicalUrl,
        name: locale === "pt" ? "Redes Sociais para Hotéis e Restaurantes | Andreia Oliveira" : "Social Media for Hotels & Restaurants | Andreia Oliveira",
        description: locale === "pt" ? "Estratégia e gestão de redes sociais para hotéis, restaurantes e negócios de hotelaria e restauração em Portugal e no Reino Unido." : "Social media strategy and management for hotels, restaurants and hospitality businesses across Portugal and the UK.",
        inLanguage: locale === "pt" ? "pt-PT" : "en-GB",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": personId },
        primaryImageOfPage: { "@id": `${canonicalUrl}#portrait` }
      },
      { "@type": "ImageObject", "@id": `${canonicalUrl}#portrait`, contentUrl: `${SITE_URL}/images/about/Andreia.jpg`, url: `${SITE_URL}/images/about/Andreia.jpg`, caption: "Andreia Oliveira, Digital Marketing and Social Media Specialist" },
      {
        "@type": "Person",
        "@id": personId,
        name: "Andreia Oliveira",
        url: canonicalUrl,
        image: `${SITE_URL}/images/about/Andreia.jpg`,
        jobTitle: locale === "pt" ? "Especialista em Redes Sociais e Marketing Digital" : "Social Media & Digital Marketing Specialist",
        description: locale === "pt" ? "Especialista em redes sociais e marketing digital para hotéis, restaurantes e negócios de hotelaria e restauração em Portugal e no Reino Unido." : "Social media and digital marketing specialist for hotels, restaurants and hospitality businesses across Portugal and the UK.",
        worksFor: { "@id": `${SITE_URL}/#organization` },
        sameAs: ["https://www.linkedin.com/in/andreia-rodrigues-de-oliveira/"],
        knowsAbout: locale === "pt" ? ["Marketing Digital", "Gestão de Redes Sociais", "Estratégia de Redes Sociais", "Meta Ads", "Publicidade no Facebook", "Publicidade no Instagram", "Google Ads", "Estratégia de Conteúdo", "Marketing para Hotelaria e Restauração"] : ["Digital Marketing", "Social Media Marketing", "Social Media Management", "Meta Ads", "Facebook Advertising", "Instagram Advertising", "Google Ads", "Content Strategy", "Hospitality Marketing"]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Hospo Creative", item: `${SITE_URL}${locale === "pt" ? "/pt" : ""}` },
          { "@type": "ListItem", position: 2, name: "Andreia Oliveira", item: canonicalUrl }
        ]
      },
      ...services.map((name) => ({ "@type": "Service", name, provider: { "@id": personId }, areaServed: [{ "@type": "Country", name: "Portugal" }, { "@type": "Country", name: "United Kingdom" }], mainEntityOfPage: canonicalUrl }))
    ]
  };
  return <main id="main" lang={locale === "pt" ? "pt-PT" : "en-GB"}><SeoStructuredData data={structuredData} /><AndreiaOliveiraMarketingPage locale={locale} /></main>;
}
