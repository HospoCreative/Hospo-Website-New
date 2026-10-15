import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";

const content = {
  en: {
    eyebrow: "Where we work",
    title: "Hospitality marketing in Portugal",
    body: "Hospo Creative works with hotels, restaurants and F&B businesses across Portugal, with a particular focus on the Algarve and Lisbon.",
    cta: "Explore",
    markets: [
      { href: "/algarve", label: "Algarve", title: "Hospitality Marketing in the Algarve", body: "Marketing, photography, video, social media, SEO and digital support for hotels, resorts, restaurants, bars and F&B brands across the Algarve." },
      { href: "/lisboa", label: "Lisbon", title: "Hospitality Marketing in Lisbon", body: "Digital marketing, content, social media, SEO and campaign support for hotels, restaurants, bars and F&B businesses across Lisbon." }
    ]
  },
  pt: {
    eyebrow: "Onde trabalhamos",
    title: "Marketing para hotelaria e restauração em Portugal",
    body: "A Hospo Creative trabalha com hotéis, alojamentos, restaurantes e marcas de alimentação e bebidas em Portugal, com especial foco no Algarve e Lisboa.",
    cta: "Explorar",
    markets: [
      { href: "/algarve", label: "Algarve", title: "Marketing para Hotelaria e Restauração no Algarve", body: "Estratégia, redes sociais, fotografia, vídeo, SEO, websites e campanhas para hotéis, resorts, restaurantes, bares e marcas de alimentação e bebidas no Algarve." },
      { href: "/lisboa", label: "Lisboa", title: "Marketing para Hotelaria e Restauração em Lisboa", body: "Marketing digital, conteúdos, redes sociais, SEO e campanhas para hotéis, restaurantes, bares e marcas de alimentação e bebidas em Lisboa." }
    ]
  }
} as const;

export function PortugalMarkets({ locale }: { locale: Locale }) {
  const section = content[locale];
  return <section aria-labelledby="portugal-markets-title" className="bg-[#f6f8fb] px-5 py-[var(--hc-section-compact)] text-ink sm:px-8"><div className="mx-auto max-w-7xl"><p className="section-eyebrow text-yellow">{section.eyebrow}</p><h2 id="portugal-markets-title" className="mt-5 max-w-4xl font-serif text-[clamp(2.25rem,4vw,3.8rem)] font-semibold leading-[.98]">{section.title}</h2><p className="mt-6 max-w-3xl text-lg leading-8 text-ink/72">{section.body}</p><div className="mt-9 grid gap-5 md:grid-cols-2">{section.markets.map((market) => <Link key={market.href} href={localizedPath(market.href, locale)} className="group border border-ink/15 bg-white p-7 transition hover:bg-ink hover:text-white"><p className="section-eyebrow text-yellow">{market.label}</p><h3 className="mt-4 font-serif text-3xl leading-tight">{market.title}</h3><p className="mt-4 max-w-xl text-sm leading-7 text-ink/70 group-hover:text-white/72">{market.body}</p><span className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] group-hover:text-yellow">{section.cta} {market.label}<ArrowUpRight size={16} /></span></Link>)}</div></div></section>;
}
