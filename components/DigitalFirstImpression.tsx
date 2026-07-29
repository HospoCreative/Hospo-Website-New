import { Check } from "lucide-react";
import { homepageContent } from "@/data/homepage";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SmartImage } from "./SmartImage";

export function DigitalFirstImpression() {
  const content = homepageContent.problem;
  return (
    <section id="digital-first-impression" className="bg-ink px-5 py-[var(--hc-section-compact)] text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.14fr_0.86fr] lg:items-start lg:gap-14">
        <Reveal>
          <SectionHeading
            tone="light"
            eyebrow={content.eyebrow}
            title={content.title}
            body={content.body}
            width="wide"
          />
          <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
            {content.problems.map((problem) => (
              <li key={problem.title} className="flex gap-3 border-t border-white/18 py-5 sm:min-h-36">
                <Check className="mt-1 shrink-0 text-yellow" size={18} strokeWidth={2.5} aria-hidden="true" />
                <div>
                  <h3 className="text-[1.125rem] font-semibold leading-7 text-white sm:text-xl">{problem.title}</h3>
                  <p className="mt-2 text-[1.0625rem] leading-7 text-white/70">{problem.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-9 max-w-3xl border-l-2 border-yellow pl-5 font-serif text-[1.35rem] font-semibold leading-8 text-white sm:text-2xl">{content.closing}</p>
        </Reveal>
        <Reveal delay={0.12} className="relative mx-auto w-full max-w-lg lg:pt-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[8px]">
            <SmartImage
              src={content.experienceImage.src}
              alt={content.experienceImage.alt}
              fill
              sizes="(min-width: 1024px) 36vw, 90vw"
              className="object-cover object-center"
              fallbackLabel="Hospitality experience"
            />
          </div>
          <div className="mt-4 overflow-hidden rounded-[8px] border border-white/20 bg-white shadow-editorial lg:absolute lg:-bottom-7 lg:-left-10 lg:mt-0 lg:w-[78%]">
            <div className="flex h-8 items-center gap-1.5 border-b border-ink/10 bg-white px-3" aria-hidden="true">
              <span className="size-1.5 rounded-full bg-ink/20" />
              <span className="size-1.5 rounded-full bg-ink/20" />
              <span className="size-1.5 rounded-full bg-ink/20" />
              <span className="ml-2 h-2 w-2/5 rounded-full bg-ink/10" />
            </div>
            <div className="grid grid-cols-[0.9fr_1.1fr] gap-3 p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[4px]">
                <SmartImage
                  src={content.digitalImage.src}
                  alt={content.digitalImage.alt}
                  fill
                  sizes="(min-width: 1024px) 14vw, 42vw"
                  className="object-cover object-center"
                  fallbackLabel="Website photography"
                />
              </div>
              <div className="flex flex-col justify-center gap-2" aria-hidden="true">
                <span className="h-2 w-3/4 rounded-full bg-ink/22" />
                <span className="h-1.5 w-full rounded-full bg-ink/10" />
                <span className="h-1.5 w-5/6 rounded-full bg-ink/10" />
                <span className="mt-1 h-5 w-20 rounded-full bg-ink" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
