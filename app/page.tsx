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

export const dynamic = "force-dynamic";

export default async function Home() {
  const [caseStudies, blogPosts, clientLogos] = await Promise.all([
    getFeaturedCaseStudies(),
    getPublishedBlogPosts(),
    getPublishedClientLogos()
  ]);

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <WhoWeHelp />
        <DigitalFirstImpression />
        <DigitalRefresh />
        <SelectedProjects caseStudies={caseStudies} />
        <FourWaysWeHelp />
        <MarketingJourney />
        <ServiceEnquiry />
        <About />
        <ClientLogosSection logos={clientLogos} />
        <BlogPreviewSection posts={blogPosts} />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
