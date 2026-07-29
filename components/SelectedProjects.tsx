import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy, CaseStudyMedia } from "@/types/caseStudy";
import { siteContent } from "@/data/site";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";
import { SectionHeading } from "./SectionHeading";

type ProjectMedia = Pick<CaseStudyMedia, "src" | "alt" | "mediaType">;

function isVideo(media: ProjectMedia) {
  return media.mediaType === "video" || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(media.src);
}

function getMedia(caseStudy: CaseStudy): ProjectMedia | null {
  if (caseStudy.heroImage) {
    return {
      src: caseStudy.heroImage,
      alt: caseStudy.heroImageAlt || caseStudy.title,
      mediaType: /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(caseStudy.heroImage) ? "video" : "image"
    };
  }

  const firstMedia = (caseStudy.media ?? []).find(
    (media) => media.mediaType === "image" || media.mediaType === "video"
  );

  if (firstMedia) return firstMedia;
  if (!caseStudy.heroImage) return null;

  return {
    src: caseStudy.heroImage,
    alt: caseStudy.heroImageAlt || caseStudy.title,
    mediaType: "image"
  };
}

function CaseStudyPreviewMedia({ media, title }: { media: ProjectMedia | null; title: string }) {
  if (!media) return null;

  if (isVideo(media)) {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={media.alt || title}
      >
        <source src={media.src} />
      </video>
    );
  }

  return (
    <SmartImage
      src={media.src}
      alt={media.alt || title}
      fill
      sizes="(min-width: 1280px) 31vw, (min-width: 768px) 45vw, 90vw"
      className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
      fallbackLabel={title}
    />
  );
}

export function SelectedProjects({ caseStudies = [] }: { caseStudies?: CaseStudy[] }) {
  const { work } = siteContent;

  if (!caseStudies.length) return null;

  return (
    <section id="work" className="scroll-mt-24 bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow={work.eyebrow} title={work.title} body={work.body} />
          <Link
            href="/case-studies"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-ink transition hover:text-yellow"
          >
            All case studies <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 md:items-stretch xl:grid-cols-3">
          {caseStudies.slice(0, 6).map((caseStudy, index) => {
            const media = getMedia(caseStudy);
            return (
              <Reveal key={caseStudy.id} delay={index * 0.05} className="h-full">
                <Link
                  href={`/case-studies/${caseStudy.slug}`}
                  className="group flex min-h-[34rem] flex-col overflow-hidden border border-ink/10 bg-white shadow-soft transition duration-500 hover:-translate-y-2 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow md:h-[45rem] md:min-h-0"
                >
                  {media ? (
                    <div className="relative h-72 shrink-0 overflow-hidden bg-ink md:h-[24rem]">
                      <CaseStudyPreviewMedia media={media} title={caseStudy.title} />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-ink/52">
                      {caseStudy.clientName}
                      {caseStudy.location ? ` / ${caseStudy.location}` : ""}
                    </p>
                    <h3 className="mt-3 font-serif text-[1.65rem] font-semibold leading-[1.02]">{caseStudy.title}</h3>
                    <p className="mt-4 line-clamp-3 text-base leading-7 text-ink/70">{caseStudy.summary}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-black uppercase tracking-[0.16em]">
                      View case study <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
