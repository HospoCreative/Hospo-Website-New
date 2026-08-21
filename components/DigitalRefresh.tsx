import { ArrowUpRight } from "lucide-react";
import { getHomepageContent } from "@/data/homepage";
import { localizedPath, translate, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function DigitalRefresh({ locale = "en" }: { locale?: Locale }) {
  const content = getHomepageContent(locale).refresh;
  return (
    <section id="digital-refresh" className="bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-8 lg:grid-cols-[1.08fr_0.72fr] lg:items-end">
          <SectionHeading tone="light" eyebrow={content.eyebrow} title={content.title} body={content.body} width="wide" />
          <p className="max-w-xl text-lg leading-8 text-white/72">{content.supporting}</p>
        </Reveal>
        <div className="mt-9 grid border-y border-white/20 lg:grid-cols-3">
          {content.pathways.map((pathway, index) => (
            <Reveal key={pathway.title} delay={index * 0.08} className="group cursor-default border-b border-white/20 py-7 transition-colors last:border-b-0 hover:bg-white/[0.05] lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
              <h3 className="font-serif text-3xl font-semibold transition-colors group-hover:text-yellow">{pathway.title}</h3>
              <p className="mt-4 text-base leading-7 text-white/72">{pathway.body}</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-white/52">{pathway.items.slice(0, 3).join(" · ")}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href={localizedPath("/services", locale)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-ink transition hover:-translate-y-0.5 hover:bg-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink">{translate(locale, "Explore the Digital Refresh")} <ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href={localizedPath("/digital-scan", locale)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:-translate-y-0.5 hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">{translate(locale, "Digital Presence Review")} <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
