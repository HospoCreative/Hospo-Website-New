import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getHomepageContent } from "@/data/homepage";
import { localizedPath, translate, type Locale } from "@/lib/i18n";
import type { CaseStudy, CaseStudyMedia } from "@/types/caseStudy";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SmartImage } from "./SmartImage";

type ProjectMedia = Pick<CaseStudyMedia, "src" | "alt" | "mediaType">;

function getMedia(caseStudy: CaseStudy): ProjectMedia | null {
  if (caseStudy.heroImage) return { src: caseStudy.heroImage, alt: caseStudy.heroImageAlt || caseStudy.title, mediaType: /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(caseStudy.heroImage) ? "video" : "image" };
  return (caseStudy.media ?? []).find((item) => item.mediaType === "image" || item.mediaType === "video") ?? null;
}

function ProjectMediaView({ media, title }: { media: ProjectMedia; title: string }) {
  const video = media.mediaType === "video" || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(media.src);
  if (video) return <video className="h-full w-full object-cover object-center" muted playsInline preload="metadata" aria-label={media.alt || title}><source src={media.src} /></video>;
  return <SmartImage src={media.src} alt={media.alt || title} fill sizes="(min-width: 1024px) 384px, 94vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]" fallbackLabel={title} />;
}

export function SelectedProjects({ caseStudies = [], locale = "en" }: { caseStudies?: CaseStudy[]; locale?: Locale }) {
  const content = getHomepageContent(locale).work;
  if (!caseStudies.length) return null;
  return (
    <section id="work" className="bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading tone="light" eyebrow={content.eyebrow} title={content.title} body={content.body} width="wide" />
          <Link href={localizedPath("/case-studies", locale)} className="inline-flex shrink-0 items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">{translate(locale, "View all case studies")} <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </Reveal>
        <div className="mt-12 space-y-14 lg:space-y-20">
          {caseStudies.slice(0, 5).map((project, index) => {
            const media = getMedia(project);
            if (!media) return null;
            return (
              <Reveal key={project.id || project.slug}>
                <article className={`group grid gap-7 lg:items-center lg:gap-12 ${index % 2 ? "lg:grid-cols-[minmax(0,1fr)_24rem]" : "lg:grid-cols-[24rem_minmax(0,1fr)]"}`}>
                  <div className={`relative aspect-[4/5] overflow-hidden rounded-[8px] bg-ink ${index % 2 ? "lg:order-2" : ""}`}><ProjectMediaView media={media} title={project.title} /></div>
                  <div className={index % 2 ? "lg:order-1" : ""}>
                    <p className="section-eyebrow text-yellow">{project.clientName}{project.sector ? ` · ${project.sector}` : ""}{project.location ? ` · ${project.location}` : ""}</p>
                    <h3 className="mt-4 font-serif text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04]">{project.title}</h3>
                    {project.challenge ? <div className="mt-5"><p className="text-[0.66rem] font-black uppercase tracking-[0.17em] text-white/48">{translate(locale, "The challenge")}</p><p className="mt-2 line-clamp-3 text-base leading-7 text-white/68">{project.challenge}</p></div> : null}
                    {project.solution ? <div className="mt-5"><p className="text-[0.66rem] font-black uppercase tracking-[0.17em] text-white/48">{translate(locale, "What Hospo changed")}</p><p className="mt-2 line-clamp-3 text-base leading-7 text-white/68">{project.solution}</p></div> : null}
                    {project.result ? <p className="mt-5 border-l-2 border-yellow pl-4 font-semibold leading-7 text-white">{project.result}</p> : null}
                    <div className="mt-5 flex flex-wrap gap-2">{project.services.slice(0, 3).map((service) => <span key={service} className="border border-white/18 px-3 py-1.5 text-[0.62rem] font-black uppercase tracking-[0.13em]">{service}</span>)}</div>
                    <Link href={localizedPath(`/case-studies/${project.slug}`, locale)} className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">{translate(locale, "View case study")} <ArrowUpRight size={16} aria-hidden="true" /></Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
