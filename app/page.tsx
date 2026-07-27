import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ClientLogosSection } from "@/components/client-logos/ClientLogosSection";
import { BlogPreviewSection } from "@/components/BlogPreviewSection";
import { MarketingJourney } from "@/components/MarketingJourney";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PositioningStatement } from "@/components/PositioningStatement";
import { SelectedProjects } from "@/components/SelectedProjects";
import { ServiceEnquiry } from "@/components/ServiceEnquiry";
import { ServicesExperience } from "@/components/ServicesExperience";
import { SocialProof } from "@/components/SocialProof";
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
        <PositioningStatement />
        <PhotoGallery />
        <SelectedProjects caseStudies={caseStudies} />
        <BlogPreviewSection posts={blogPosts} />
        <ClientLogosSection logos={clientLogos} />
        <ServicesExperience />
        <MarketingJourney />
        <VideoShowcase />
        <About />
        <SocialProof />
        <ServiceEnquiry />
      </main>
      <Footer />
    </>
  );
}
