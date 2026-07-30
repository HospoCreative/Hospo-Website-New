import type { Metadata } from "next";
import { DigitalScanTool } from "@/components/DigitalScanTool";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getRequestLocale } from "@/lib/locale-server";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    title: locale === "pt" ? "Teste a Sua Presença Digital | Hospo Creative" : "Test Your Digital Score | Hospo Creative",
    description:
      locale === "pt"
        ? "Descubra os pontos fortes e as prioridades de melhoria da oferta, website, percurso comercial, pesquisa, marca, redes sociais e fotografia."
        : "Discover strengths and improvement priorities across your offer, website, customer journey, search presence, brand, social channels and photography.",
    pathname: "/digital-scan",
    locale
  });
}

export default async function DigitalScanPage() {
  const locale = await getRequestLocale();
  return (
    <>
      <Header locale={locale} />
      <main id="main">
        <DigitalScanTool locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
