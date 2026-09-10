import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getHomepageContent } from "@/data/homepage";
import { localizedPath, translate, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SmartImage } from "./SmartImage";

const categoryPaths = ["/hotels-stays", "/restaurants-fb"] as const;

export function WhoWeHelp({ locale = "en" }: { locale?: Locale }) {
  const content = getHomepageContent(locale).whoWeHelp;

  return (
    <section id="who-we-help" className="bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            body={content.body}
            width="wide"
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {content.categories.map((category, index) => (
            <Reveal key={category.title} delay={index * 0.08}>
              <article className="group grid min-h-[25rem] overflow-hidden rounded-[8px] bg-ink text-white sm:grid-cols-[0.88fr_1.12fr] sm:min-h-[24rem]">
                <div className="relative min-h-64 overflow-hidden sm:min-h-full">
                  <SmartImage
                    src={category.image.src}
                    alt={category.image.alt}
                    fill
                    sizes="(min-width: 1024px) 42vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover object-center transition duration-700 group-hover:scale-[1.035]"
                    fallbackLabel={category.title}
                  />
                </div>
                <div className="flex flex-col p-7 sm:p-8">
                  <p className="section-eyebrow text-yellow">{translate(locale, index === 0 ? "For hotels & stays" : "For restaurants & F&B")}</p>
                  <h3 className="mt-4 font-serif text-[clamp(2rem,3.1vw,2.75rem)] font-semibold leading-[1.02] tracking-[-0.025em]">
                    {category.title}
                  </h3>
                  <p className="mt-4 max-w-sm text-base leading-7 text-white/72">{category.body}</p>
                  <Link
                    href={localizedPath(categoryPaths[index], locale)}
                    className="mt-auto inline-flex w-fit items-center gap-2 pt-8 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
                  >
                    {translate(locale, "Explore support")}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
