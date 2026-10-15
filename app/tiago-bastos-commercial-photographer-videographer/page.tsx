import type { Metadata } from "next";
import { TiagoBastosProfile } from "@/components/TiagoBastosProfile";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { getRequestLocale } from "@/lib/locale-server";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { getPublishedCaseStudies } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

const pathname = "/tiago-bastos-commercial-photographer-videographer";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    title: locale === "pt" ? "Fotografia e Vídeo para Hotéis e Restaurantes | Tiago Bastos" : "Hotel, Restaurant & Food Photographer | Tiago Bastos",
    description: locale === "pt" ? "Fotografia e vídeo profissional para hotéis, resorts, restaurantes, bares e marcas de alimentação e bebidas no Algarve, Lisboa, Portugal e Reino Unido." : "Photography and video for hotels, resorts, restaurants, bars and food & drink brands across Portugal and the UK, including the Algarve, Lisbon, Birmingham and London.",
    pathname,
    locale,
    image: "/images/about/Tiago.png"
  });
}

export default async function TiagoBastosCommercialPage() {
  const locale = await getRequestLocale();
  const caseStudies = await getPublishedCaseStudies(locale);
  const canonicalUrl = `${SITE_URL}${locale === "pt" ? "/pt" : ""}${pathname}`;
  const personId = `${SITE_URL}${pathname}#person`;
  const services = locale === "pt"
    ? ["Fotografia e Vídeo para Hotéis", "Fotografia e Vídeo para Restaurantes", "Fotografia de Alimentação e Bebidas", "Vídeo para Hotelaria e Restauração", "Produção de Conteúdo para Redes Sociais", "Fotografia de Eventos Corporativos", "Fotografia de Propriedade e Interiores"]
    : ["Hotel Photography & Video", "Restaurant Photography & Video", "Food & Drink Photography", "Hospitality Videography", "Social Media Content Production", "Corporate Event Photography", "Property Photography"];
  const areaServed = [
    { "@type": "Country", name: "Portugal" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "AdministrativeArea", name: "Algarve" },
    { "@type": "City", name: "Lisbon" },
    { "@type": "City", name: "Birmingham" },
    { "@type": "AdministrativeArea", name: "West Midlands" },
    { "@type": "City", name: "London" }
  ];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": canonicalUrl,
        url: canonicalUrl,
        name: locale === "pt" ? "Fotografia e Vídeo para Hotéis e Restaurantes | Tiago Bastos" : "Hotel, Restaurant & Food Photographer | Tiago Bastos",
        description: locale === "pt" ? "Fotografia e vídeo profissional para hotéis, resorts, restaurantes, bares e marcas de alimentação e bebidas no Algarve, Lisboa, Portugal e Reino Unido." : "Photography and video for hotels, resorts, restaurants, bars and food & drink brands across Portugal and the UK, including the Algarve, Lisbon, Birmingham and London.",
        inLanguage: locale === "pt" ? "pt-PT" : "en-GB",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": personId },
        primaryImageOfPage: { "@id": `${canonicalUrl}#portrait` }
      },
      {
        "@type": "ImageObject",
        "@id": `${canonicalUrl}#portrait`,
        contentUrl: `${SITE_URL}/images/about/Tiago.png`,
        url: `${SITE_URL}/images/about/Tiago.png`,
        caption: locale === "pt" ? "Tiago Bastos, fotógrafo e videógrafo para hotéis, restaurantes e marcas de alimentação e bebidas" : "Tiago Bastos, photographer and videographer for hotels, restaurants and food brands"
      },
      {
        "@type": "ImageObject",
        "@id": `${canonicalUrl}#hospitality-image`,
        contentUrl: `${SITE_URL}/images/hero/collage/1.jpg`,
        url: `${SITE_URL}/images/hero/collage/1.jpg`,
        caption: locale === "pt" ? "Fotografia de hotelaria, gastronomia e bebidas por Tiago Bastos" : "Hotel, food and drink photography by Tiago Bastos"
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "Tiago Bastos",
        url: canonicalUrl,
        image: `${SITE_URL}/images/about/Tiago.png`,
        jobTitle: locale === "pt" ? "Fotógrafo e Videógrafo para Hotéis, Restaurantes e Marcas de Alimentação e Bebidas" : "Photographer & Videographer for Hotels, Restaurants & Food Brands",
        description: locale === "pt" ? "Tiago Bastos é fotógrafo e videógrafo especializado em hotéis, restaurantes, bares e marcas de alimentação e bebidas em Portugal e no Reino Unido." : "Tiago Bastos is a photographer and videographer specialising in hotels, restaurants, bars and food and drink brands across Portugal and the UK.",
        worksFor: { "@id": `${SITE_URL}/#organization` },
        sameAs: ["https://www.linkedin.com/in/tiagobastos93/"],
        knowsAbout: locale === "pt"
          ? ["Fotografia para Hotelaria", "Fotografia de Hotéis", "Fotografia de Restaurantes", "Vídeo para Hotelaria", "Vídeo para Hotéis", "Vídeo para Restaurantes", "Conteúdo de Alimentação e Bebidas", "Direção Criativa", "Operações de Hotelaria", "Produção de Conteúdo"]
          : ["Hospitality Photography", "Hotel Photography", "Restaurant Photography", "Hospitality Videography", "Hotel Videography", "Restaurant Videography", "Food & Beverage Content", "Creative Direction", "Hospitality Operations", "Content Production"]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Hospo Creative", item: `${SITE_URL}${locale === "pt" ? "/pt" : ""}` },
          { "@type": "ListItem", position: 2, name: "Tiago Bastos", item: canonicalUrl }
        ]
      },
      ...services.map((name) => ({
        "@type": "Service",
        name,
        provider: { "@id": personId },
        areaServed,
        mainEntityOfPage: canonicalUrl
      }))
    ]
  };

  return <main id="main" lang={locale === "pt" ? "pt-PT" : "en-GB"}><SeoStructuredData data={structuredData} /><TiagoBastosProfile locale={locale} caseStudies={caseStudies} /></main>;
}
