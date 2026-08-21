import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const copy = {
  en: {
    eyebrow: "Campaigns",
    title: "Campaigns with a clear reason to act.",
    body: "For seasonal dates, launches and trading periods that need a focused offer, clear creative and a measurable next step.",
    stages: ["Strategy", "Offer", "Creative", "Distribution", "Conversion", "Measurement"],
    supporting: "We connect the offer, landing page, content, distribution and tracking into one practical plan.",
    cta: "Explore strategy & campaigns"
  },
  pt: {
    eyebrow: "Campanhas",
    title: "Campanhas com um motivo claro para agir.",
    body: "Para épocas sazonais, lançamentos e períodos comerciais que precisam de uma oferta focada, criativos claros e um próximo passo mensurável.",
    stages: ["Estratégia", "Oferta", "Criatividade", "Distribuição", "Conversão", "Medição"],
    supporting: "Ligamos a oferta, a landing page, o conteúdo, a distribuição e a medição num só plano prático.",
    cta: "Explorar estratégia e campanhas"
  }
} as const;

export function Campaigns({ locale = "en" }: { locale?: Locale }) {
  const content = copy[locale];
  return (
    <section className="bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:gap-16">
        <Reveal>
          <SectionHeading tone="light" eyebrow={content.eyebrow} title={content.title} body={content.body} />
        </Reveal>
        <Reveal delay={0.08} className="border-y border-white/18 py-7 sm:py-9">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            {content.stages.map((stage, index) => (
              <li key={stage} className="group border-l border-yellow pl-3">
                <span className="block text-[0.64rem] font-black uppercase tracking-[0.15em] text-white/48">0{index + 1}</span>
                <span className="mt-1 block font-serif text-2xl font-semibold leading-none">{stage}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-2xl text-base leading-7 text-white/70">{content.supporting}</p>
          <Link href={localizedPath("/services/strategy-campaigns", locale)} className="mt-7 inline-flex min-h-11 items-center gap-2 text-xs font-black uppercase tracking-[0.15em] transition hover:translate-x-1 hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
            {content.cta} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
