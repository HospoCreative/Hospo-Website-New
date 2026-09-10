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
import {
  getPublishedBlogPosts,
  getPublishedClientLogos
} from "@/lib/supabase/queries";
import { getRequestLocale } from "@/lib/locale-server";

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
