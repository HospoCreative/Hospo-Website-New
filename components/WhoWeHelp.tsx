import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getHomepageContent } from "@/data/homepage";
import { localizedPath, translate, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SmartImage } from "./SmartImage";

export function WhoWeHelp({ locale = "en" }: { locale?: Locale }) {
  const content = getHomepageContent(locale).whoWeHelp;
  const routes = ["/hotels-stays", "/restaurants-fb"];

  return (
    <section id="who-we-help" className="bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal><SectionHeading eyebrow={content.eyebrow} title={content.title} body={content.body} width="wide" /></Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {content.categories.map((category, index) => (
            <Reveal key={category.title} delay={0.08 + index * 0.07}>
              <Link href={localizedPath(routes[index] ?? "/services", locale)} className="group grid min-h-[25rem] overflow-hidden rounded-[8px] bg-ink text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink sm:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-52 overflow-hidden sm:min-h-full">
                  <SmartImage src={category.image.src} alt={category.image.alt} fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" fallbackLabel={category.title} />
                </div>
                <div className="flex flex-col p-7 sm:p-8">
                  <p className="section-eyebrow text-yellow">{index === 0 ? translate(locale, "For hotels & stays") : translate(locale, "For restaurants & F&B")}</p>
                  <h3 className="mt-4 font-serif text-[2.25rem] font-semibold leading-[1.02]">{category.title}</h3>
                  <p className="mt-5 text-base leading-7 text-white/72">{category.body}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-xs font-black uppercase tracking-[0.15em] text-white group-hover:text-yellow">{translate(locale, "Explore support")} <ArrowUpRight size={16} aria-hidden="true" /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
