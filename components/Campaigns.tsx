import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const copy = {
  en: {
    eyebrow: "Campaigns",
    title: "Campaigns built around what you need to sell.",
    body: "From seasonal occasions and new launches to hotel packages, restaurant reservations and quieter trading periods, Hospo builds campaigns around a specific commercial opportunity.",
    stages: ["Strategy", "Offer", "Creative", "Distribution", "Conversion", "Measurement"],
    supporting: "We can connect the proposition, landing page, photography or video, social, email, paid media, Google and tracking into one plan.",
    cta: "Explore strategy & campaigns"
  },
  pt: {
    eyebrow: "Campanhas",
    title: "Campanhas pensadas para aquilo que precisa de vender.",
    body: "De épocas sazonais e novos lançamentos a pacotes de hotel, reservas de restaurante e períodos de menor procura, a Hospo cria campanhas em torno de uma oportunidade comercial concreta.",
    stages: ["Estratégia", "Oferta", "Criatividade", "Distribuição", "Conversão", "Medição"],
    supporting: "Podemos ligar a proposta, a landing page, fotografia ou vídeo, redes sociais, email, media paga, Google e medição num só plano.",
    cta: "Explorar estratégia e campanhas"
  }
} as const;

export function Campaigns({ locale = "en" }: { locale?: Locale }) {
  const content = copy[locale];
  return (
    <section className="bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:gap-16">
        <Reveal>
          <SectionHeading eyebrow={content.eyebrow} title={content.title} body={content.body} />
        </Reveal>
        <Reveal delay={0.08} className="border-y border-ink/16 py-7 sm:py-9">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            {content.stages.map((stage, index) => (
              <li key={stage} className="border-l border-yellow pl-3">
                <span className="block text-[0.64rem] font-black uppercase tracking-[0.15em] text-ink/45">0{index + 1}</span>
                <span className="mt-1 block font-serif text-2xl font-semibold leading-none">{stage}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-2xl text-base leading-7 text-ink/70">{content.supporting}</p>
          <Link href={localizedPath("/services/strategy-campaigns", locale)} className="mt-7 inline-flex min-h-11 items-center gap-2 text-xs font-black uppercase tracking-[0.15em] transition hover:text-ink/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
            {content.cta} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
