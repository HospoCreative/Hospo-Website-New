import { Check } from "lucide-react";
import { homepageContent } from "@/data/homepage";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SmartImage } from "./SmartImage";

export function DigitalFirstImpression() {
  const content = homepageContent.problem;
  return (
    <section className="bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.72fr] lg:items-center lg:gap-16">
        <Reveal>
          <SectionHeading tone="light" eyebrow={content.eyebrow} title={content.title} body={content.body} />
          <ul className="mt-9 grid gap-4 sm:grid-cols-2">
            {content.problems.map((problem) => (
              <li key={problem} className="flex gap-3 border-t border-white/16 pt-4 text-base leading-7 text-white/78">
                <Check className="mt-1 shrink-0 text-yellow" size={18} aria-hidden="true" />
                <span>{problem}</span>
              </li>
            ))}
          </ul>
          <p className="mt-9 max-w-2xl font-serif text-2xl italic leading-8 text-yellow">{content.closing}</p>
        </Reveal>
        <Reveal delay={0.12} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[8px]">
            <SmartImage src={content.image.src} alt={content.image.alt} fill sizes="(min-width: 1024px) 34vw, 90vw" className="object-cover object-center" fallbackLabel="Digital first impression" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
