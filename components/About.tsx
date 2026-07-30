import { getHomepageContent } from "@/data/homepage";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SmartImage } from "./SmartImage";

export function About({ locale = "en" }: { locale?: Locale }) {
  const content = getHomepageContent(locale).whyHospo;
  const founderPortraits: Record<string, { src: string; alt: string }> = {
    "Andreia Oliveira": {
      src: "/images/about/Andreia.jpg",
      alt: "Andreia Oliveira, Co-Founder and Marketing and Growth Director"
    },
    "Tiago Bastos": {
      src: "/images/about/Tiago.png",
      alt: "Tiago Bastos, Co-Founder and Creative and Business Development Director"
    }
  };

  return (
    <section id="about" className="bg-ink px-5 pb-[var(--hc-section-compact)] pt-[var(--hc-section)] text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] lg:items-start lg:gap-8">
          <Reveal className="md:col-span-2 lg:col-span-1">
            <SectionHeading tone="light" eyebrow={content.eyebrow} title={content.title} body={<><p>{content.body}</p><p className="mt-3">{content.supporting}</p></>} />
            <p className="mt-7 border-l-2 border-yellow pl-4 font-serif text-xl italic leading-7">{content.closing}</p>
          </Reveal>
          {content.founders.map((founder, index) => {
            const portrait = founderPortraits[founder.name];
            return (
              <Reveal key={founder.name} delay={0.08 + index * 0.06}>
                <article className="border-t border-white/18 pt-6">
                  {portrait ? (
                    <div className="relative mb-5 size-24 overflow-hidden rounded-full border-2 border-yellow/80 sm:size-28">
                      <SmartImage
                        src={portrait.src}
                        alt={portrait.alt}
                        fill
                        sizes="112px"
                        className="object-cover object-center"
                        fallbackLabel={founder.name}
                      />
                    </div>
                  ) : null}
                  <h3 className="font-serif text-2xl font-semibold">{founder.name}</h3>
                  <p className="mt-2 text-[0.68rem] font-black uppercase tracking-[0.17em] text-yellow">{founder.role}</p>
                  <p className="mt-4 text-sm leading-6 text-white/68">{founder.bio}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
