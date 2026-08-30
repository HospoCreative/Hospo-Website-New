import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ContactEnquiry } from "@/components/ContactEnquiry";
import { getRequestLocale } from "@/lib/locale-server";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({ title: locale === "pt" ? "Contacto | Hospo Creative" : "Contact Hospo Creative", description: locale === "pt" ? "Fale com a Hospo Creative sobre o seu próximo desafio de marketing, conteúdo ou otimização digital." : "Talk to Hospo Creative about your next marketing, content or digital optimisation priority.", pathname: "/contact", locale });
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ package?: string | string[] }> }) {
  const locale = await getRequestLocale();
  const candidate = (await searchParams).package;
  const packageName = (Array.isArray(candidate) ? candidate[0] : candidate)?.trim().slice(0, 120);
  return <><Header locale={locale} /><main id="main"><ContactEnquiry locale={locale} packageName={packageName} /></main><Footer locale={locale} /></>;
}
