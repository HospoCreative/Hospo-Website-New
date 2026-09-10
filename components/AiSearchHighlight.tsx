"use client";

import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function AiSearchHighlight({ locale }: { locale: Locale }) {
  const content = locale === "pt"
    ? { title: "A forma como os clientes pesquisam está a mudar.", body: "Cada vez mais pessoas utilizam motores de pesquisa e ferramentas de Inteligência Artificial para descobrir onde ficar, onde comer e o que fazer.", support: "Ajudamos hotéis, alojamentos e restaurantes a preparar a sua presença digital para esta nova forma de pesquisa.", cta: "Explorar serviços de IA" }
    : { title: "The way customers search is changing.", body: "More people are using search engines and Artificial Intelligence tools to discover where to stay, eat and spend their time.", support: "We help hotels, stays and restaurants prepare their digital presence for this new way of searching.", cta: "Explore AI services" };
  return <section className="bg-white px-5 py-[var(--hc-section-compact)] text-ink sm:px-8"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><Reveal><div className="flex size-12 items-center justify-center rounded-full border border-yellow text-yellow"><Search size={21}/></div><p className="mt-6 section-eyebrow text-ink/55">AI Search &amp; Visibility</p><h2 className="mt-4 max-w-xl font-serif text-[clamp(2.4rem,4.4vw,4.1rem)] leading-[0.94]">{content.title}</h2></Reveal><Reveal delay={0.08}><p className="max-w-2xl text-lg leading-8 text-ink/76">{content.body}</p><p className="mt-4 max-w-2xl text-base leading-7 text-ink/62">{content.support}</p><div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-ink/16 pt-5"><p className="text-xs font-black uppercase tracking-[0.16em] text-yellow">SEO · AEO · GEO · ChatGPT Ads</p><Link onClick={() => trackAnalyticsEvent("cta_click", { source: "homepage_ai_search" })} href={locale === "pt" ? "/pt/ai-search" : "/ai-search"} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-ink transition hover:text-ink/60">{content.cta} <ArrowUpRight size={16}/></Link></div></Reveal></div></section>;
}
