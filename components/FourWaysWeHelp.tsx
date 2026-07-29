import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { homepageContent } from "@/data/homepage";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function FourWaysWeHelp() {
  const content = homepageContent.pillars;
  return (
    <section id="services" className="bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal><SectionHeading tone="light" eyebrow={content.eyebrow} title={content.title} width="wide" /></Reveal>
        <div className="mt-10 grid border-y border-white/16 md:grid-cols-2">
          {content.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06} className={`py-7 md:p-8 ${index % 2 === 0 ? "md:border-r md:border-white/16" : ""} ${index < 2 ? "border-b border-white/16" : index === 2 ? "border-b border-white/16 md:border-b-0" : ""}`}>
              <h3 className="font-serif text-3xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/68">{item.body}</p>
            </Reveal>
          ))}
        </div>
        <Link href="/#digital-refresh" className="mt-8 inline-flex min-h-11 items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">View all services <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
