import type { Metadata } from "next";
import { DigitalBusinessCard } from "@/components/DigitalBusinessCard";
import { digitalBusinessCards } from "@/data/digitalBusinessCards";
import { FAVICON, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Andreia Oliveira | Hospo Creative",
  description: "Digital business card for Andreia Oliveira, Co-Founder and Marketing and Growth Director at Hospo Creative.",
  robots: { index: false, follow: false },
  icons: { icon: [{ url: FAVICON, type: "image/png" }], apple: FAVICON }
};

export default function AndreiaDigitalBusinessCardPage() {
  return <DigitalBusinessCard card={digitalBusinessCards.andreia} />;
}
