import type { Metadata } from "next";
import { DigitalScanTool } from "@/components/DigitalScanTool";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getRequestLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: locale === "pt" ? "Análise Digital Gratuita | Hospo Creative" : "Free Hospitality Digital Scan | Hospo Creative",
    description:
      locale === "pt"
        ? "Analise gratuitamente os sinais públicos do website, percurso de reserva, Google, redes sociais e OTAs."
        : "Scan the public website, booking journey, Google, social and OTA signals of your hospitality business."
  };
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
