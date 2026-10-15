import type { Metadata } from "next";
import { BirminghamMarketingPage } from "@/components/BirminghamMarketingPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { DEFAULT_OG_IMAGE, FAVICON, SITE_URL } from "@/lib/seo";

const pathname = "/birmingham";
const title = "Hospitality Marketing Agency Birmingham & West Midlands | Hospo Creative";
const description = "Hospitality marketing for hotels, restaurants and F&B businesses across Birmingham and the West Midlands. Social media, photography, video, SEO, websites and campaigns.";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const canonical = `${SITE_URL}${pathname}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    icons: {
      icon: [{ url: FAVICON, type: "image/png", sizes: "500x500" }],
      shortcut: FAVICON,
      apple: FAVICON
    },
    alternates: {
      canonical,
      languages: { "en-GB": canonical, "x-default": canonical }
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Hospo Creative",
      locale: "en_GB",
      title,
      description,
      images: [{ url: DEFAULT_OG_IMAGE, alt: title }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE]
    }
  };
}

export default async function BirminghamPage() {
  const canonical = `${SITE_URL}${pathname}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: title, description, inLanguage: "en-GB", isPartOf: { "@id": `${SITE_URL}/#website` }, about: [{ "@type": "Place", name: "Birmingham" }, { "@type": "AdministrativeArea", name: "West Midlands" }] },
      { "@type": "Service", "@id": `${canonical}#service`, name: "Hospitality Marketing", description, url: canonical, provider: { "@id": `${SITE_URL}/#organization` }, areaServed: [{ "@type": "City", name: "Birmingham" }, { "@type": "AdministrativeArea", name: "West Midlands" }, { "@type": "Country", name: "United Kingdom" }], audience: { "@type": "Audience", audienceType: "Hotels, restaurants and F&B businesses" } },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Birmingham & West Midlands", item: canonical }] }
    ]
  };
  return <><Header locale="en" /><SeoStructuredData data={structuredData} /><BirminghamMarketingPage /><Footer locale="en" /></>;
}
