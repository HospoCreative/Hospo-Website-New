import { getHomepageContent } from "@/data/homepage";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SmartImage } from "./SmartImage";

export function WhoWeHelp({ locale = "en" }: { locale?: Locale }) {
  const content = getHomepageContent(locale).whoWeHelp;
  return (
    <section id="who-we-help" className="bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal><SectionHeading eyebrow={content.eyebrow} title={content.title} body={content.body} width="wide" /></Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {content.categories.map((category, index) => (
            <Reveal key={category.title} delay={index * 0.08}>
              <article className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] bg-ink">
                  <SmartImage src={category.image.src} alt={category.image.alt} fill sizes="(min-width: 768px) 31vw, 90vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]" fallbackLabel={category.title} />
                </div>
                <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight">{category.title}</h3>
                <p className="mt-2 text-base leading-7 text-ink/68">{category.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
