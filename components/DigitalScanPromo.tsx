import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

const content = {
  en: {
    eyebrow: "Your digital score",
    title: "How strong is your digital presence?",
    body: "Get a quick public review of how clearly customers can find you, understand your offer and take the next step. No account connection required.",
    cta: "Test your digital score",
    points: ["Visibility", "Customer journey", "Brand presentation"]
  },
  pt: {
    eyebrow: "A sua pontuação digital",
    title: "Qual é a força da sua presença digital?",
    body: "Receba uma análise pública rápida sobre a facilidade com que os clientes encontram o negócio, compreendem a oferta e avançam para o próximo passo. Não é necessário ligar qualquer conta.",
    cta: "Teste a sua presença digital",
    points: ["Visibilidade", "Percurso do cliente", "Apresentação da marca"]
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
