import Link from "next/link";
import { selectedProjects } from "@/data/portfolio";
import { siteContent } from "@/data/site";
import type { CaseStudy, CaseStudyMedia } from "@/types/caseStudy";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

type DisplayProject = {
  key: string;
  client: string;
  location: string;
  title: string;
  objective: string;
  services: string[];
  images: Array<{
    src: string;
    alt: string;
    mediaType?: CaseStudyMedia["mediaType"];
  }>;
  href?: string;
};

type DisplayProjectMedia = DisplayProject["images"][number];

function isVideoMedia(item: Pick<CaseStudyMedia, "mediaType" | "src">) {
  return item.mediaType === "video" || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(item.src);
}

function getCaseStudyMedia(caseStudy: CaseStudy): DisplayProjectMedia[] {
  const mediaItems = (caseStudy.media ?? [])
    .filter((item) => item.mediaType === "image" || item.mediaType === "video" || isVideoMedia(item))
    .map((item): DisplayProjectMedia => ({
      src: item.src,
      alt: item.alt || item.caption || caseStudy.title,
      mediaType: isVideoMedia(item) ? "video" : item.mediaType
    }));

  if (mediaItems.length) {
    return mediaItems;
  }

  if (caseStudy.heroImage) {
    return [
      {
        src: caseStudy.heroImage,
        alt: caseStudy.heroImageAlt || caseStudy.title,
        mediaType: "image" as const
      }
    ];
  }

  return [];
}

function mapCaseStudyToProject(caseStudy: CaseStudy): DisplayProject {
  return {
    key: caseStudy.id ?? caseStudy.slug,
    client: caseStudy.clientName,
    location: caseStudy.location ?? "",
    title: caseStudy.title,
    objective: caseStudy.summary,
    services: caseStudy.services,
    images: getCaseStudyMedia(caseStudy),
    href: `/case-studies/${caseStudy.slug}`
  };
}

function ProjectMedia({
  image,
  title
}: {
  image: DisplayProject["images"][number];
  title: string;
}) {
  if (image.mediaType === "video" || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(image.src)) {
    return (
      <video
        className="absolute inset-0 h-full w-full bg-ink object-contain"
        controls
        muted
        playsInline
        preload="metadata"
        aria-label={image.alt || title}
      >
        <source src={image.src} />
        Your browser does not support this video.
      </video>
    );
  }

  return (
    <SmartImage
      src={image.src}
      alt={image.alt}
      fill
      sizes="(min-width: 1280px) 460px, (min-width: 1024px) 400px, (min-width: 640px) 44vw, 78vw"
      className="object-contain transition duration-700 group-hover:scale-[1.02]"
      fallbackLabel={title}
    />
  );
}

function mapFallbackProject(project: (typeof selectedProjects)[number], index: number): DisplayProject {
  return {
    key: `${project.type}-${index}`,
    client: project.client,
    location: project.location,
    title: project.type,
    objective: project.objective,
    services: project.services,
    images: project.images,
    href: undefined
  };
}

export function SelectedProjects({ caseStudies = [] }: { caseStudies?: CaseStudy[] }) {
  const { work } = siteContent;
  const cmsProjects = caseStudies.map(mapCaseStudyToProject);
  const projects = cmsProjects.length
    ? cmsProjects
    : selectedProjects.map(mapFallbackProject);
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
          {projects.map((project, index) => {
            return (
              <Reveal key={project.key} delay={index * 0.06}>
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
                        {project.title}
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

                  {project.images.length ? (
                    <div className="mobile-scroll-cue mt-8 [--scroll-cue-bg:#ffffff]">
                      <div className="scroll-row flex gap-4 overflow-x-auto pb-5">
                        {project.images.map((image) => (
                          <figure
                            key={image.src}
                            className="group relative min-w-[78vw] snap-start overflow-hidden rounded-[8px] bg-ink shadow-soft sm:min-w-[44vw] lg:min-w-[25rem] xl:min-w-[29rem]"
                          >
                            <div className="relative aspect-[4/5]">
                              <ProjectMedia image={image} title={project.title} />
                            </div>
                          </figure>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <Link
                    href={project.href ?? "#contact"}
                    className="mt-3 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] text-ink transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
                  >
                    {project.href ? "View case study" : "Discuss a similar project"}
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
