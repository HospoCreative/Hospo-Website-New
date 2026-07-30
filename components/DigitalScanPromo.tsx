import { ArrowUpRight, Gauge, Search, Waypoints } from "lucide-react";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

const content = {
  en: {
    eyebrow: "Your digital score",
    title: "How strong is your hospitality brand online?",
    body: "Discover what helps or weakens visibility, trust and customer action across your website, search presence, social channels and photography. No account connection required.",
    cta: "Test your digital score",
    points: ["Booking, ordering or purchase journey", "Search and website visibility", "Offer, social and photography signals"]
  },
  pt: {
    eyebrow: "A sua pontuação digital",
    title: "Qual é a força da sua marca de hotelaria online?",
    body: "Descubra o que reforça ou enfraquece a visibilidade, a confiança e a ação dos clientes no website, pesquisa, redes sociais e fotografia. Não é necessário ligar qualquer conta.",
    cta: "Teste a sua presença digital",
    points: ["Percurso de reserva, pedido ou compra", "Visibilidade na pesquisa e no website", "Sinais da oferta, redes sociais e fotografia"]
  }
} as const;

const icons = [Gauge, Waypoints, Search];

export function DigitalScanPromo({ locale = "en" }: { locale?: Locale }) {
  const copy = content[locale];
  return (
    <section className="bg-white px-5 py-[var(--hc-section-compact)] text-ink sm:px-8">
      <Reveal className="mx-auto grid max-w-7xl gap-10 border-y border-ink/15 py-10 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-16">
        <div>
          <p className="section-eyebrow text-ink/50">{copy.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none">{copy.title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/68">{copy.body}</p>
          <Link href={localizedPath("/digital-scan", locale)} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:-translate-y-0.5">
            {copy.cta}<ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid gap-4">
          {copy.points.map((point, index) => {
            const Icon = icons[index];
            return <li key={point} className="flex min-h-16 items-center gap-4 border-t border-ink/15 pt-4 text-base font-bold"><Icon className="shrink-0 text-ink" size={20} aria-hidden="true" />{point}</li>;
          })}
        </ul>
      </Reveal>
    </section>
  );
}
