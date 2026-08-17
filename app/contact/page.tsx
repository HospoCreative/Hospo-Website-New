import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServiceEnquiry } from "@/components/ServiceEnquiry";
import { getRequestLocale } from "@/lib/locale-server";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({ title: locale === "pt" ? "Contacto | Hospo Creative" : "Contact Hospo Creative", description: locale === "pt" ? "Fale com a Hospo Creative sobre o seu próximo desafio de marketing, conteúdo ou otimização digital." : "Talk to Hospo Creative about your next marketing, content or digital optimisation priority.", pathname: "/contact", locale });
}

export default async function ContactPage() {
  const locale = await getRequestLocale();
  return <><Header locale={locale} /><main id="main"><ServiceEnquiry locale={locale} /></main><Footer locale={locale} /></>;
}
