import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { getHomepageContent } from "@/data/homepage";
import { localizedPath, translate, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function FourWaysWeHelp({ locale = "en" }: { locale?: Locale }) {
  const content = getHomepageContent(locale).pillars;
  return (
    <section id="services" className="bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow={content.eyebrow} title={content.title} body={content.body} width="wide" />
        </Reveal>

        <div className="mt-12 grid border-y border-ink/16 md:grid-cols-2">
          {content.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06} className={`py-8 md:p-8 ${index % 2 === 0 ? "md:border-r md:border-ink/16" : ""} ${index < 2 ? "border-b border-ink/16" : index === 2 ? "border-b border-ink/16 md:border-b-0" : ""}`}>
              <h3 className="font-serif text-3xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-4 max-w-xl text-[1.0625rem] leading-7 text-ink/68">{item.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="pt-12">
          <Reveal>
            <h3 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">{content.servicesHeading}</h3>
            <p className="mt-4 max-w-3xl text-[1.0625rem] leading-7 text-ink/68">{content.servicesBody}</p>
          </Reveal>

          <div className="mt-9 hidden grid-cols-4 md:grid">
            {content.groups.map((group, index) => (
              <Reveal
                key={group.title}
                delay={index * 0.06}
                className={`min-w-0 px-6 first:pl-0 last:pr-0 ${index < content.groups.length - 1 ? "border-r border-ink/16" : ""}`}
              >
                <span className="block h-0.5 w-8 bg-yellow" aria-hidden="true" />
                <h4 className="mt-5 font-serif text-2xl font-semibold leading-tight text-ink">{group.title}</h4>
                <ul className="mt-6 space-y-3 text-[1.0625rem] leading-7 text-ink/68">
                  {group.services.map((service) => <li key={service}>{service}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 border-b border-ink/16 md:hidden">
            {content.groups.map((group) => (
              <details key={group.title} className="group border-t border-ink/16">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif text-2xl font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink [&::-webkit-details-marker]:hidden">
                  {group.title}
                  <ChevronDown className="shrink-0 transition-transform group-open:rotate-180" size={20} aria-hidden="true" />
                </summary>
                <ul className="space-y-3 pb-6 text-[1.0625rem] leading-7 text-ink/68">
                  {group.services.map((service) => <li key={service}>{service}</li>)}
                </ul>
              </details>
            ))}
          </div>

          <Link href={localizedPath("/#digital-refresh", locale)} className="mt-14 inline-flex min-h-11 items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-ink transition hover:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
            {translate(locale, "Explore all services")} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
