import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MarketingJourney } from "@/components/MarketingJourney";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PositioningStatement } from "@/components/PositioningStatement";
import { SelectedProjects } from "@/components/SelectedProjects";
import { ServiceEnquiry } from "@/components/ServiceEnquiry";
import { ServicesExperience } from "@/components/ServicesExperience";
import { SocialProof } from "@/components/SocialProof";
import { VideoShowcase } from "@/components/VideoShowcase";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <PositioningStatement />
        <PhotoGallery />
        <SelectedProjects />
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
