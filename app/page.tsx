import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ClientLogosSection } from "@/components/client-logos/ClientLogosSection";
import { BlogPreviewSection } from "@/components/BlogPreviewSection";
import { MarketingJourney } from "@/components/MarketingJourney";
import { SelectedProjects } from "@/components/SelectedProjects";
import { ServiceEnquiry } from "@/components/ServiceEnquiry";
import { WhoWeHelp } from "@/components/WhoWeHelp";
import { DigitalFirstImpression } from "@/components/DigitalFirstImpression";
import { DigitalRefresh } from "@/components/DigitalRefresh";
import { FourWaysWeHelp } from "@/components/FourWaysWeHelp";
import { FaqSection } from "@/components/FaqSection";
import { FinalCta } from "@/components/FinalCta";
import {
  getPublishedBlogPosts,
  getFeaturedCaseStudies,
  getPublishedClientLogos
} from "@/lib/supabase/queries";
import { getRequestLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = await getRequestLocale();
  const [caseStudies, blogPosts, clientLogos] = await Promise.all([
    getFeaturedCaseStudies(),
    getPublishedBlogPosts(),
    getPublishedClientLogos()
  ]);

  return (
    <>
      <Header locale={locale} />
      <main id="main">
        <Hero locale={locale} />
        <WhoWeHelp locale={locale} />
        <DigitalFirstImpression locale={locale} />
        <DigitalRefresh locale={locale} />
        <SelectedProjects caseStudies={caseStudies} locale={locale} />
        <FourWaysWeHelp locale={locale} />
        <MarketingJourney locale={locale} />
        <ServiceEnquiry locale={locale} />
        <About locale={locale} />
        <ClientLogosSection logos={clientLogos} locale={locale} />
        <BlogPreviewSection posts={blogPosts} locale={locale} />
        <FaqSection locale={locale} />
        <FinalCta locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
