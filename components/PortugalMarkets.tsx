import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { localizedPath } from "@/lib/i18n";

const markets = [
  { href: "/algarve", title: "Marketing para hotelaria no Algarve", body: "Apoio para hotéis, resorts, alojamentos, restaurantes, beach clubs e marcas F&B num mercado sazonal e orientado para o destino." },
  { href: "/lisboa", title: "Marketing para hotelaria em Lisboa", body: "Apoio para hotéis, restaurantes, grupos, bares e conceitos F&B que precisam de maior visibilidade, procura e conversão." }
];

export function PortugalMarkets() {
  return <section className="bg-[#f6f8fb] px-5 py-[var(--hc-section-compact)] text-ink sm:px-8"><div className="mx-auto max-w-7xl"><p className="section-eyebrow text-yellow">Portugal</p><h2 className="mt-5 max-w-4xl font-serif text-[clamp(2.25rem,4vw,3.8rem)] font-semibold leading-[.98]">Marketing especializado para negócios de hotelaria no Algarve e em Lisboa.</h2><p className="mt-6 max-w-3xl text-lg leading-8 text-ink/72">A Hospo trabalha com negócios de hotelaria nestes mercados, criando apoio adaptado à forma como hóspedes e clientes descobrem, comparam e escolhem online.</p><div className="mt-9 grid gap-5 md:grid-cols-2">{markets.map((market) => <Link key={market.href} href={localizedPath(market.href, "pt")} className="group border border-ink/15 bg-white p-7 transition hover:bg-ink hover:text-white"><h3 className="font-serif text-3xl leading-tight">{market.title}</h3><p className="mt-4 max-w-xl text-sm leading-7 text-ink/70 group-hover:text-white/72">{market.body}</p><span className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] group-hover:text-yellow">Explorar mercado<ArrowUpRight size={16} /></span></Link>)}</div></div></section>;
}
