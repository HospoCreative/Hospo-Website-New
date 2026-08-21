import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";
import { getHomepageContent } from "@/data/homepage";
import { getRequestLocale } from "@/lib/locale-server";
import { localizedPath, translate } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

const portraits: Record<string, string> = { "Andreia Oliveira": "/images/about/Andreia.jpg", "Tiago Bastos": "/images/about/Tiago.png" };

export async function generateMetadata(): Promise<Metadata> { const locale = await getRequestLocale(); return buildPageMetadata({ title: locale === "pt" ? "Sobre a Hospo Creative" : "About Hospo Creative", description: locale === "pt" ? "Conheça a equipa da Hospo Creative e a forma como apoiamos negócios de hotelaria." : "Meet Hospo Creative and the way we support hospitality businesses.", pathname: "/about", locale }); }

export default async function AboutPage() {
  const locale = await getRequestLocale(); const content = getHomepageContent(locale).whyHospo;
  return <><Header locale={locale} /><main id="main"><section className="bg-ink px-5 py-14 text-white sm:px-8 lg:py-16"><div className="mx-auto max-w-7xl"><p className="section-eyebrow text-yellow">{content.eyebrow}</p><h1 className="mt-5 max-w-5xl font-serif text-[clamp(2.7rem,5vw,4.6rem)] font-semibold leading-[.96]">{content.title}</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">{content.body}</p></div></section>
    <section className="bg-white px-5 py-[var(--hc-section-compact)] text-ink sm:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="section-eyebrow text-yellow">{translate(locale, "Our perspective")}</p><h2 className="mt-5 font-serif text-4xl font-semibold leading-none">{translate(locale, "Creative work works harder when it understands the operation behind it.")}</h2></div><div className="space-y-5 text-lg leading-8 text-ink/70"><p>{content.supporting}</p><p>{translate(locale, "We bring together marketing direction, operational understanding and visual production, so the work supports both how a business looks and how it performs.")}</p><div className="border-l-2 border-yellow pt-1 pl-5"><p className="section-eyebrow text-yellow">{translate(locale, "Where we work")}</p><h2 className="mt-3 font-serif text-3xl font-semibold leading-none text-ink">{content.markets.title}</h2><p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">{content.markets.body}</p></div></div></div></section>
    <section className="bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8"><div className="mx-auto max-w-7xl"><p className="section-eyebrow text-yellow">{translate(locale, "The people behind Hospo")}</p><div className="mt-8 grid gap-8 md:grid-cols-2">{content.founders.map((founder) => <article key={founder.name} className="grid gap-6 border-t border-white/20 pt-6 sm:grid-cols-[8rem_1fr]"><div className="relative aspect-square overflow-hidden rounded-full border-2 border-yellow"><SmartImage src={portraits[founder.name]} alt={founder.name} fill sizes="128px" className="object-cover" fallbackLabel={founder.name} /></div><div><h2 className="font-serif text-4xl font-semibold">{founder.name}</h2><p className="mt-3 text-[.68rem] font-black uppercase tracking-[.16em] text-yellow">{founder.role}</p><p className="mt-5 leading-7 text-white/72">{founder.bio}</p></div></article>)}</div></div></section>
    <section className="bg-ink px-5 py-12 text-white sm:px-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6"><p className="font-serif text-3xl font-semibold">{translate(locale, "Ready to discuss your next priority?")}</p><Link href={localizedPath("/contact", locale)} className="button-primary inline-flex items-center gap-2">{translate(locale, "Talk to Hospo")}<ArrowUpRight size={17} /></Link></div></section></main><Footer locale={locale} /></>;
}
