import { homepageContent } from "@/data/homepage";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SmartImage } from "./SmartImage";

export function About() {
  const content = homepageContent.whyHospo;
  return (
    <section id="about" className="bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] shadow-editorial">
              <SmartImage src={content.image.src} alt={content.image.alt} fill sizes="(min-width: 1024px) 38vw, 90vw" className="object-cover object-center" fallbackLabel="Hospo Creative founders" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <SectionHeading eyebrow={content.eyebrow} title={content.title} body={<><p>{content.body}</p><p className="mt-3">{content.supporting}</p></>} />
            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              {content.founders.map((founder) => (
                <article key={founder.name} className="border-t border-ink/18 pt-5">
                  <h3 className="font-serif text-2xl font-semibold">{founder.name}</h3>
                  <p className="mt-2 text-[0.68rem] font-black uppercase tracking-[0.17em] text-ink/58">{founder.role}</p>
                  <p className="mt-4 text-sm leading-6 text-ink/68">{founder.bio}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 border-l-2 border-yellow pl-4 font-serif text-xl italic leading-7">{content.closing}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
