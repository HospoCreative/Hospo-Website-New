import { ArrowUpRight } from "lucide-react";
import { getHomepageContent } from "@/data/homepage";
import { translate, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function DigitalRefresh({ locale = "en" }: { locale?: Locale }) {
  const content = getHomepageContent(locale).refresh;
  return (
    <section id="digital-refresh" className="bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-8 lg:grid-cols-[1.08fr_0.72fr] lg:items-end">
          <SectionHeading eyebrow={content.eyebrow} title={content.title} body={content.body} width="wide" />
          <p className="max-w-xl text-lg leading-8 text-ink/75">{content.supporting}</p>
        </Reveal>
        <div className="mt-12 grid border-y border-ink/25 lg:grid-cols-3">
          {content.pathways.map((pathway, index) => (
            <Reveal key={pathway.title} delay={index * 0.08} className="border-b border-ink/25 py-7 last:border-b-0 lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
              <h3 className="font-serif text-3xl font-semibold">{pathway.title}</h3>
              <p className="mt-4 text-base leading-7 text-ink/72">{pathway.body}</p>
              <ul className="mt-6 space-y-2 text-sm font-semibold leading-6 text-ink/78">
                {pathway.items.map((item) => <li key={item} className="border-l border-ink/30 pl-3">{item}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#services" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-white">{translate(locale, "Explore the Digital Refresh")} <ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href="#digital-review" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/40 px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-ink transition hover:-translate-y-0.5 hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">{translate(locale, "Request a Digital Review")} <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
