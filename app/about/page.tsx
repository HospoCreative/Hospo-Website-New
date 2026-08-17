import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getHomepageContent } from "@/data/homepage";
import { getRequestLocale } from "@/lib/locale-server";
import { localizedPath, translate } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({ title: locale === "pt" ? "Sobre a Hospo Creative" : "About Hospo Creative", description: locale === "pt" ? "Conheça a equipa da Hospo Creative, sediada no Reino Unido e Portugal e a trabalhar em projetos selecionados em todo o mundo." : "Meet Hospo Creative, based in the UK and Portugal and working on selected hospitality projects worldwide.", pathname: "/about", locale });
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const content = getHomepageContent(locale).whyHospo;
  return <><Header locale={locale} /><main id="main" className="bg-ink text-white"><section className="px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><p className="section-eyebrow text-yellow">{content.eyebrow}</p><h1 className="mt-5 max-w-4xl font-serif text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[0.96]">{content.title}</h1><div className="mt-8 max-w-3xl space-y-5 text-lg leading-8 text-white/75"><p>{content.body}</p><p>{content.supporting}</p></div><div className="mt-10 max-w-3xl border-l-2 border-yellow pl-5"><h2 className="font-serif text-3xl font-semibold">{content.markets.title}</h2><p className="mt-3 text-base leading-7 text-white/70">{content.markets.body}</p></div></div></section><section className="border-t border-white/10 px-5 py-[var(--hc-section)] sm:px-8"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">{content.founders.map((founder) => <article key={founder.name} className="border-t border-white/20 pt-6"><h2 className="font-serif text-4xl font-semibold">{founder.name}</h2><p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-yellow">{founder.role}</p><p className="mt-5 max-w-xl text-base leading-8 text-white/70">{founder.bio}</p></article>)}</div></section><section className="border-t border-white/10 px-5 py-10 sm:px-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6"><p className="text-lg text-white/75">{translate(locale, "Ready to discuss your next priority?")}</p><Link href={localizedPath("/contact", locale)} className="button-primary inline-flex items-center gap-2">{translate(locale, "Talk to Hospo")}<ArrowUpRight size={17} aria-hidden="true" /></Link></div></section></main><Footer locale={locale} /></>;
}
