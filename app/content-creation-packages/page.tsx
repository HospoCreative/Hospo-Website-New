import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivateContentCreationLanding } from "@/components/PrivateContentCreationLanding";
import { PortugueseContentCreationLanding } from "@/components/PortugueseContentCreationLanding";
import { FAVICON, SITE_URL } from "@/lib/seo";
import { getRequestLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const portuguese = locale === "pt";
  const pathname = portuguese ? "/pt/content-creation-packages" : "/content-creation-packages";
  const title = portuguese ? "Pacotes de Criação de Conteúdo | Fotografia e Vídeo | HOSPO Creative" : "Content Creation Packages | Photography & Video | HOSPO Creative";
  const description = portuguese ? "Pacotes de fotografia, vídeo vertical e gestão de redes sociais para hotéis, restaurantes, alojamentos e marcas de hotelaria." : "Photography and short-form video content packages for restaurants, hotels, bars and hospitality brands. Build a professional content library for social media, websites and digital campaigns.";
  return { metadataBase: new URL(SITE_URL), title, description, icons: { icon: [{ url: FAVICON, type: "image/png", sizes: "500x500" }] }, alternates: { canonical: pathname }, openGraph: { type: "website", url: pathname, siteName: "Hospo Creative", locale: portuguese ? "pt_PT" : "en_GB", title, description }, twitter: { card: "summary_large_image", title, description } };
}

export default async function ContentCreationPackagesPage() {
  const locale = await getRequestLocale();
  return <><Header locale={locale} showLanguageSwitcher={false}/><main id="main">{locale === "pt" ? <PortugueseContentCreationLanding/> : <PrivateContentCreationLanding/>}</main><Footer locale={locale}/></>;
}
