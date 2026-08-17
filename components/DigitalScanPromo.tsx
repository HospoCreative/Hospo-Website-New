import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

const content = {
  en: {
    eyebrow: "Digital Presence Review",
    title: "See where your digital presence could be working harder.",
    body: "Get a practical public review of your website, Google presence, booking or reservation journey, photography, content and social signals. No account connection is required.",
    cta: "Get your Digital Presence Review",
    points: ["Website & Google", "Booking or reservation journey", "Content & visibility"]
  },
  pt: {
    eyebrow: "Análise da Presença Digital",
    title: "Veja onde a sua presença digital pode estar a trabalhar melhor.",
    body: "Receba uma análise pública prática ao seu website, presença no Google, percurso de reserva ou pedido, fotografia, conteúdo e sinais nas redes sociais. Não é necessário ligar qualquer conta.",
    cta: "Pedir a sua análise de presença digital",
    points: ["Website e Google", "Percurso de reserva ou pedido", "Conteúdo e visibilidade"]
  }
} as const;

export function DigitalScanPromo({ locale = "en" }: { locale?: Locale }) {
  const copy = content[locale];
  return (
    <section className="bg-white px-5 pb-[var(--hc-section-compact)] text-ink sm:px-8">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden border border-ink/15 bg-ink px-6 py-7 text-white shadow-soft sm:px-8 sm:py-9 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
        <span aria-hidden="true" className="absolute left-0 top-0 h-1 w-24 bg-yellow" />
        <div className="max-w-4xl">
          <p className="section-eyebrow text-yellow">{copy.eyebrow}</p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3.4vw,3.25rem)] font-semibold leading-[1.02]">{copy.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/70 sm:text-lg">{copy.body}</p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-[0.12em] text-white/65">
            {copy.points.map((point) => <li key={point} className="flex items-center gap-2"><span aria-hidden="true" className="size-1.5 rounded-full bg-yellow" />{point}</li>)}
          </ul>
        </div>
        <Link href={localizedPath("/digital-scan", locale)} className="mt-7 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.15em] text-ink transition hover:-translate-y-0.5 hover:bg-yellow lg:mt-0">
          {copy.cta}<ArrowUpRight className="text-yellow" size={17} aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}
