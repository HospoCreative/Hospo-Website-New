import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { servicePages } from "@/data/commercialPages";
import { localizedPath, translate, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const copy = {
  en: {
    eyebrow: "Services",
    title: "Choose the next move that matters most.",
    body: "Six focused services, designed to work on their own or together when the brief needs more than one answer.",
    cta: "View all services",
    supporting: "Additional support can include paid media, CRM, reputation and analytics."
  },
  pt: {
    eyebrow: "Serviços",
    title: "Escolha o próximo passo que mais importa.",
    body: "Seis serviços focados, pensados para funcionar isoladamente ou em conjunto quando o desafio pede mais do que uma resposta.",
    cta: "Ver todos os serviços",
    supporting: "O apoio complementar pode incluir media paga, CRM, reputação e analytics."
  }
} as const;

export function ServicesOverview({ locale = "en" }: { locale?: Locale }) {
  const content = copy[locale];
  return (
    <section id="services" className="bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow={content.eyebrow} title={content.title} body={content.body} width="wide" />
          <Link href={localizedPath("/services", locale)} className="inline-flex shrink-0 items-center gap-2 text-xs font-black uppercase tracking-[0.15em] transition hover:text-ink/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
            {content.cta} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>
        <div className="mt-10 grid border-y border-ink/16 md:grid-cols-2 xl:grid-cols-3">
          {servicePages.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.04} className="border-b border-ink/16 p-6 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 xl:border-b-0 xl:border-r xl:px-7 xl:first:pl-0 xl:[&:nth-child(3n)]:border-r-0 xl:[&:nth-child(4)]:pl-0">
              <Link href={localizedPath(`/services/${service.slug}`, locale)} className="group -m-3 block cursor-pointer rounded-[8px] p-3 transition duration-300 hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
                <h3 className="font-serif text-[1.8rem] font-semibold leading-[1.03] transition-colors">{translate(locale, service.title)}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/68 transition-colors group-hover:text-white/72">{translate(locale, service.description)}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-yellow">{translate(locale, "Explore service")} <ArrowUpRight size={15} aria-hidden="true" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-ink/58">{content.supporting}</p>
      </div>
    </section>
  );
}
