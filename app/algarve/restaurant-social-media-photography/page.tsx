import type { Metadata } from "next";
import { AlgarveRestaurantMarketingEnglishPage } from "@/components/AlgarveRestaurantMarketingEnglishPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DEFAULT_OG_IMAGE, FAVICON, SITE_URL } from "@/lib/seo";
import { getPublishedCaseStudies } from "@/lib/supabase/queries";

const pathname = "/algarve/restaurant-social-media-photography";
const portuguesePath = "/pt/algarve/redes-sociais-fotografia-restaurantes";
const title = "Restaurant Photography & Social Media Algarve | Hospo Creative";
const description = "Restaurant photography, video, Reels and social media management for restaurants, bars and F&B businesses across the Algarve. Content, strategy, Meta Ads and campaigns.";

export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  icons: { icon: [{ url: FAVICON, type: "image/png", sizes: "500x500" }], shortcut: FAVICON, apple: FAVICON },
  alternates: { canonical: pathname, languages: { "en-GB": pathname, "pt-PT": portuguesePath, "x-default": pathname } },
  openGraph: { type: "website", url: pathname, siteName: "Hospo Creative", locale: "en_GB", alternateLocale: ["pt_PT"], title, description, images: [{ url: DEFAULT_OG_IMAGE, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE] }
};

export default async function RestaurantSocialMediaPhotographyPage() {
  const caseStudies = await getPublishedCaseStudies("en");
  return <><Header locale="en" /><AlgarveRestaurantMarketingEnglishPage caseStudies={caseStudies} /><Footer locale="en" /></>;
}
