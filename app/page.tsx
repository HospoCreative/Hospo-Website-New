import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ClientLogosSection } from "@/components/client-logos/ClientLogosSection";
import { BlogPreviewSection } from "@/components/BlogPreviewSection";
import { MarketingJourney } from "@/components/MarketingJourney";
import { SelectedProjects } from "@/components/SelectedProjects";
import { ServiceEnquiry } from "@/components/ServiceEnquiry";
import { ServicesExperience } from "@/components/ServicesExperience";
import { VideoShowcase } from "@/components/VideoShowcase";
import {
  getPublishedBlogPosts,
  getPublishedCaseStudies,
  getPublishedClientLogos
} from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [caseStudies, blogPosts, clientLogos] = await Promise.all([
    getPublishedCaseStudies(),
    getPublishedBlogPosts(),
    getPublishedClientLogos()
  ]);

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <ClientLogosSection logos={clientLogos} />
        <SelectedProjects caseStudies={caseStudies} />
        <ServicesExperience />
        <MarketingJourney />
        <VideoShowcase />
        <About />
        <BlogPreviewSection posts={blogPosts} />
        <ServiceEnquiry />
      </main>
      <Footer />
    </>
  );
}
