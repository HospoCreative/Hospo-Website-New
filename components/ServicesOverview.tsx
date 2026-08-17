import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { servicePages } from "@/data/commercialPages";
import { localizedPath, translate, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const copy = {
  en: {
    eyebrow: "Core services",
    title: "Focused expertise. Connected support.",
    body: "Start with one priority or combine specialist support around a bigger commercial goal.",
    cta: "View all services",
    supporting: "Supporting capabilities include paid media, CRM, reputation and analytics."
  },
  pt: {
    eyebrow: "Serviços principais",
    title: "Especialização focada. Apoio conectado.",
    body: "Comece por uma prioridade ou combine apoio especializado em torno de um objetivo comercial mais amplo.",
    cta: "Ver todos os serviços",
    supporting: "As capacidades complementares incluem media paga, CRM, reputação e analytics."
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
              <Link href={localizedPath(`/services/${service.slug}`, locale)} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
                <h3 className="font-serif text-[1.8rem] font-semibold leading-[1.03] group-hover:text-ink/65">{translate(locale, service.title)}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/68">{translate(locale, service.description)}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em]">{translate(locale, "Explore service")} <ArrowUpRight size={15} aria-hidden="true" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-ink/58">{content.supporting}</p>
      </div>
    </section>
  );
}
