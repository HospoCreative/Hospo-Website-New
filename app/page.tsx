import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ClientLogosSection } from "@/components/client-logos/ClientLogosSection";
import { MarketingJourney } from "@/components/MarketingJourney";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PositioningStatement } from "@/components/PositioningStatement";
import { SelectedProjects } from "@/components/SelectedProjects";
import { ServiceEnquiry } from "@/components/ServiceEnquiry";
import { ServicesExperience } from "@/components/ServicesExperience";
import { SocialProof } from "@/components/SocialProof";
import { VideoShowcase } from "@/components/VideoShowcase";
import { getPublishedCaseStudies, getPublishedClientLogos } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [caseStudies, clientLogos] = await Promise.all([
    getPublishedCaseStudies(),
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
