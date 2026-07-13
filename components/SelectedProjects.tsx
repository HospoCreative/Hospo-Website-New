import { selectedProjects } from "@/data/portfolio";
import { siteContent } from "@/data/site";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

export function SelectedProjects() {
  const { work } = siteContent;
  const hasRealClientMeta = (value: string) =>
    value.trim().length > 0 && !value.includes("[");

  return (
    <section id="work" className="bg-white px-5 py-20 text-ink sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-6xl">
          <p className="section-eyebrow text-ink/55">{work.eyebrow}</p>
          <h2 className="mt-5 font-serif text-[clamp(2.7rem,10vw,5.8rem)] font-semibold leading-[0.96]">
            {work.title}
          </h2>
          <p className="mt-7 max-w-4xl text-xl leading-9 text-ink/72 sm:text-2xl sm:leading-10">
            {work.body}
          </p>
        </Reveal>

        <div className="mt-14 space-y-16 lg:mt-20 lg:space-y-24">
          {selectedProjects.map((project, index) => {
            return (
              <Reveal key={`${project.type}-${index}`} delay={index * 0.06}>
                <article className="border-t border-ink/12 pt-8">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)] lg:items-end">
                    <div>
                      {hasRealClientMeta(project.client) &&
                        hasRealClientMeta(project.location) ? (
                          <p className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-ink/48">
                            {project.client} / {project.location}
                          </p>
                        ) : null}
                      <h3 className="mt-3 font-serif text-[clamp(2rem,7vw,3.45rem)] font-semibold leading-[0.98]">
                        {project.type}
                      </h3>
                    </div>

                    <div className="lg:max-w-3xl">
                      <p className="text-xl leading-9 text-ink/76 sm:text-2xl sm:leading-10">
                        {project.objective}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.services.map((service) => (
                          <span
                            key={service}
                            className="rounded-full border border-ink/16 px-3 py-1.5 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ink/70"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mobile-scroll-cue mt-8 [--scroll-cue-bg:#ffffff]">
                    <div className="scroll-row flex gap-4 overflow-x-auto pb-5">
                      {project.images.map((image) => (
                        <figure
                          key={image.src}
                          className="group relative min-w-[78vw] snap-start overflow-hidden rounded-[8px] bg-ink shadow-soft sm:min-w-[44vw] lg:min-w-[25rem] xl:min-w-[29rem]"
                        >
                          <div className="relative aspect-[4/5]">
                            <SmartImage
                              src={image.src}
                              alt={image.alt}
                              fill
                              sizes="(min-width: 1280px) 460px, (min-width: 1024px) 400px, (min-width: 640px) 44vw, 78vw"
                              className="object-cover transition duration-700 group-hover:scale-[1.03]"
                              fallbackLabel={project.type}
                            />
                          </div>
                        </figure>
                      ))}
                    </div>
                  </div>

                  <a
                    href="#contact"
                    className="mt-3 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] text-ink transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
                  >
                    Discuss a similar project
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
