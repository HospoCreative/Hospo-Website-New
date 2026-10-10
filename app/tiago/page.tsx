import type { Metadata } from "next";
import { DigitalBusinessCard } from "@/components/DigitalBusinessCard";
import { digitalBusinessCards } from "@/data/digitalBusinessCards";
import { FAVICON, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Tiago Bastos | Hospo Creative",
  description: "Digital business card for Tiago Bastos, Co-Founder, Photographer and Videographer at Hospo Creative.",
  robots: { index: false, follow: false },
  icons: { icon: [{ url: FAVICON, type: "image/png" }], apple: FAVICON }
};

export default function TiagoDigitalBusinessCardPage() {
  return <DigitalBusinessCard card={digitalBusinessCards.tiago} />;
}
