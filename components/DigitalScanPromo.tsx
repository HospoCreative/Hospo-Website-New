import { ArrowUpRight, Gauge, Search, Waypoints } from "lucide-react";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

const content = {
  en: {
    eyebrow: "Free instant tool",
    title: "How strong is your public digital presence?",
    body: "Scan the signals guests can see across your website, booking journey, Google links, social profiles and OTA connections. No account connection required.",
    cta: "Run the free scan",
    points: ["Website and SEO health", "Booking journey signals", "Google, social and OTA links"]
  },
  pt: {
    eyebrow: "Ferramenta instantânea gratuita",
    title: "Qual é a força da sua presença digital pública?",
    body: "Analise os sinais que os hóspedes encontram no website, percurso de reserva, ligações Google, redes sociais e OTAs. Não é necessário ligar qualquer conta.",
    cta: "Fazer a análise gratuita",
    points: ["Saúde do website e SEO", "Sinais do percurso de reserva", "Ligações Google, sociais e OTAs"]
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
