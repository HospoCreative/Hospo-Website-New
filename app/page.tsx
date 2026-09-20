import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ClientLogosSection } from "@/components/client-logos/ClientLogosSection";
import { BlogPreviewSection } from "@/components/BlogPreviewSection";
import { Campaigns } from "@/components/Campaigns";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import { ServicesOverview } from "@/components/ServicesOverview";
import { WhoWeHelp } from "@/components/WhoWeHelp";
import { FaqSection } from "@/components/FaqSection";
import { FinalCta } from "@/components/FinalCta";
import { AiSearchHighlight } from "@/components/AiSearchHighlight";
import { DigitalScanPromo } from "@/components/DigitalScanPromo";
import { DigitalPresenceStatistics } from "@/components/DigitalPresenceStatistics";
import { Testimonials } from "@/components/Testimonials";
import { PresentationGallery } from "@/components/PresentationGallery";
import { PortugalMarkets } from "@/components/PortugalMarkets";
import {
  getPublishedBlogPosts,
  getPublishedClientLogos
} from "@/lib/supabase/queries";
import { getRequestLocale } from "@/lib/locale-server";
import { portugueseHomeSeo } from "@/data/seoContent";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  if (locale === "pt") return buildPageMetadata({ title: portugueseHomeSeo.title, description: portugueseHomeSeo.description, pathname: "/", locale });
  return buildPageMetadata({ title: "Hospitality Marketing Agency for Hotels & Restaurants | HOSPO Creative", description: "HOSPO Creative is a specialist hospitality marketing agency for hotels, stays, restaurants and F&B brands across the UK and Portugal.", pathname: "/", locale });
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = await getRequestLocale();
  const [blogPosts, clientLogos] = await Promise.all([
    getPublishedBlogPosts(locale),
    getPublishedClientLogos()
  ]);

  return (
    <>
      <Header locale={locale} />
      <main id="main">
        <Hero locale={locale} />
        <WhoWeHelp locale={locale} />
        {locale === "pt" ? <PortugalMarkets /> : null}
        <ClientLogosSection logos={clientLogos} locale={locale} />
        <PresentationGallery locale={locale} id="presentation-gallery" />
        <Campaigns locale={locale} />
        <ServicesOverview locale={locale} />
        <AiSearchHighlight locale={locale} />
        <DigitalScanPromo locale={locale} />
        <DigitalPresenceStatistics locale={locale} />
        <Testimonials locale={locale} />
        <PortfolioShowcase locale={locale} />
        <About locale={locale} />
        <BlogPreviewSection posts={blogPosts} locale={locale} />
        <FaqSection locale={locale} />
        <FinalCta locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
import type { Metadata } from "next";
