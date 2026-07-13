import { siteContent } from "@/data/site";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

export function About() {
  const { about } = siteContent;

  return (
    <section id="about" className="bg-white px-5 py-20 text-ink sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-6xl">
          <p className="section-eyebrow text-ink/[0.58]">{about.eyebrow}</p>
          <h2 className="mt-5 font-serif text-[clamp(2.55rem,9vw,5.2rem)] font-semibold leading-[0.98]">
            {about.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.62fr)] lg:items-center">
          <Reveal>
            <div className="mt-7 max-w-4xl space-y-5 text-xl leading-9 text-ink/74 sm:text-2xl sm:leading-10">
              {about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {about.founders.map((founder) => (
                <article key={founder.name} className="border-l border-yellow pl-5">
                  <h3 className="font-serif text-3xl font-semibold leading-tight">
                    {founder.name}
                  </h3>
                  <p className="mt-2 text-[0.7rem] font-black uppercase tracking-[0.18em] text-ink/50">
                    {founder.role}
                  </p>
                  <p className="mt-4 text-lg leading-8 text-ink/70">{founder.bio}</p>
                </article>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-9 inline-flex items-center gap-2 font-serif text-2xl italic text-ink transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
            >
              {about.linkLabel}
              <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </Reveal>

          <Reveal delay={0.12} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -right-5 -top-5 h-32 w-px bg-yellow" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-[8px] bg-white shadow-editorial">
              <SmartImage
                src={about.image.src}
                alt={about.image.alt}
                fill
                sizes="(min-width: 1024px) 34vw, 90vw"
                className="object-cover"
                fallbackLabel="Hospo Creative team portrait"
              />
            </div>
            <div className="absolute -bottom-6 left-5 bg-ink px-5 py-4 text-white shadow-soft">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-yellow">
                Hands-on background
              </p>
              <p className="mt-2 max-w-xs text-base leading-7 text-white/78">
                Hospitality knowledge, marketing direction and visual production in one team.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
