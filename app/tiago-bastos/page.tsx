import type { Metadata } from "next";
import { TiagoBastosProfile } from "@/components/TiagoBastosProfile";
import { FAVICON, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Tiago Bastos | Photographer & Content Creator",
  description: "Tiago Bastos is a hospitality photographer, content creator and creative business developer working across Portugal, the UK and selected international projects.",
  robots: {
    index: false,
    follow: false,
    nocache: true
  },
  icons: {
    icon: [{ url: FAVICON, type: "image/png", sizes: "500x500" }],
    shortcut: FAVICON,
    apple: FAVICON
  }
};

export default function TiagoBastosPage() {
  return <main id="main"><TiagoBastosProfile /></main>;
}
