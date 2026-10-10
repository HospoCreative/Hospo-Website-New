import type { Metadata } from "next";
import { TiagoBastosProfile } from "@/components/TiagoBastosProfile";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { getRequestLocale } from "@/lib/locale-server";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { getPublishedCaseStudies } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    title: locale === "pt" ? "Fotógrafo Comercial e Videógrafo em Portugal e Reino Unido | Tiago Bastos" : "Commercial Photographer & Videographer Portugal & UK | Tiago Bastos",
    description: locale === "pt" ? "Fotógrafo comercial e videógrafo para hotéis, restaurantes, eventos, propriedades e marcas em Portugal, no Reino Unido e em projetos internacionais selecionados." : "Commercial photographer and videographer for hotels, restaurants, events, property and brands across Portugal, the UK and selected international projects.",
    pathname: "/tiago-bastos",
    locale,
    image: "/images/tiago-bastos-headshot.png"
  });
}

export default async function TiagoBastosPage() {
  const locale = await getRequestLocale();
  const caseStudies = await getPublishedCaseStudies(locale);
  const canonicalUrl = `${SITE_URL}${locale === "pt" ? "/pt" : ""}/tiago-bastos`;
  const personId = `${SITE_URL}/tiago-bastos#person`;
  const services = locale === "pt"
    ? ["Fotografia para Hotelaria", "Fotografia de Gastronomia e Bebidas", "Fotografia e Vídeo de Eventos Corporativos", "Fotografia de Propriedade e Imobiliário", "Conteúdo de Marca", "Produção de Vídeo"]
    : ["Hospitality Photography", "Food and Drink Photography", "Corporate Event Photography and Video", "Property and Real Estate Photography", "Brand Content", "Video Production"];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: "Tiago Bastos",
        url: canonicalUrl,
        image: `${SITE_URL}/images/tiago-bastos-headshot.png`,
        jobTitle: locale === "pt" ? "Fotógrafo Comercial e Videógrafo" : "Commercial Photographer & Videographer",
        description: locale === "pt" ? "Fotógrafo comercial e videógrafo para hotéis, restaurantes, eventos, propriedades e marcas." : "Commercial photographer and videographer for hotels, restaurants, events, property and brands.",
        worksFor: { "@id": `${SITE_URL}/#organization` },
        sameAs: ["https://www.linkedin.com/in/tiagobastos93/"],
        knowsAbout: ["Commercial Photography", "Commercial Videography", "Hospitality Photography", "Food and Drink Photography", "Corporate Event Photography", "Property Photography", "Content Production"]
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
        areaServed: [{ "@type": "Country", name: "Portugal" }, { "@type": "Country", name: "United Kingdom" }],
        mainEntityOfPage: canonicalUrl
      }))
    ]
  };
  return <main id="main"><SeoStructuredData data={structuredData} /><TiagoBastosProfile locale={locale} caseStudies={caseStudies} /></main>;
}
