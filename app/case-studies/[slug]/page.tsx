import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";
import { getCaseStudyBySlug } from "@/lib/supabase/queries";
import type { CaseStudyMedia } from "@/types/caseStudy";

export const dynamic = "force-dynamic";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

function isVideoMedia(item: Pick<CaseStudyMedia, "mediaType" | "src">) {
  return item.mediaType === "video" || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(item.src);
}

function CaseStudyMediaAsset({
  item,
  title,
  sizes,
  priority = false
}: {
  item: Pick<CaseStudyMedia, "mediaType" | "src" | "alt">;
  title: string;
  sizes: string;
  priority?: boolean;
}) {
  if (isVideoMedia(item)) {
    return (
      <video
        className="absolute inset-0 h-full w-full bg-black object-cover"
        autoPlay
        controls
        muted
        loop
        playsInline
        preload="auto"
        aria-label={item.alt || title}
      >
        <source src={item.src} />
        Your browser does not support this video.
      </video>
    );
  }

  return (
    <SmartImage
      src={item.src}
      alt={item.alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition duration-700 group-hover:scale-[1.03]"
      fallbackLabel={title}
    />
  );
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return {};
  }

  return {
    title: `${caseStudy.title} | Hospo Creative`,
    description: caseStudy.summary,
    openGraph: {
      title: `${caseStudy.title} | Hospo Creative`,
      description: caseStudy.summary,
      images: caseStudy.heroImage ? [caseStudy.heroImage] : undefined
    }
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const uploadedMedia = (caseStudy.media ?? []).filter(
    (item) => item.mediaType === "image" || item.mediaType === "video" || isVideoMedia(item)
  );
  const media = uploadedMedia.length
    ? uploadedMedia
    : caseStudy.heroImage
      ? [
          {
            mediaType: "image" as const,
            src: caseStudy.heroImage,
            alt: caseStudy.heroImageAlt ?? caseStudy.title,
            sortOrder: 0
          }
        ]
      : [];

  return (
    <>
      <Header />
      <main className="bg-white pt-24 text-ink">
        <article>
          <section className="bg-ink px-5 py-16 text-white sm:px-8 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.58fr)] lg:items-end">
              <div>
                <Link
                  href="/#work"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/68 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
                >
                  <ArrowLeft aria-hidden="true" size={16} />
                  Selected work
                </Link>
                <p className="section-eyebrow mt-8 text-yellow">Case Study</p>
                <h1 className="mt-5 max-w-5xl font-serif text-[clamp(3.2rem,10vw,6.9rem)] font-semibold leading-[0.92]">
                  {caseStudy.title}
                </h1>
                <p className="mt-7 max-w-3xl text-xl leading-9 text-white/76 sm:text-2xl sm:leading-10">
                  {caseStudy.summary}
                </p>

                <div className="mt-8 grid gap-4 border-y border-white/14 py-6 text-sm text-white/72 sm:grid-cols-3">
                  <div>
                    <p className="section-eyebrow text-white/42">Client</p>
                    <p className="mt-2 text-lg font-bold text-white">{caseStudy.clientName}</p>
                  </div>
                  {caseStudy.location ? (
                    <div>
                      <p className="section-eyebrow text-white/42">Location</p>
                      <p className="mt-2 text-lg font-bold text-white">{caseStudy.location}</p>
                    </div>
                  ) : null}
                  {caseStudy.sector ? (
                    <div>
                      <p className="section-eyebrow text-white/42">Sector</p>
                      <p className="mt-2 text-lg font-bold text-white">{caseStudy.sector}</p>
                    </div>
                  ) : null}
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {caseStudy.services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full border border-white/22 px-3 py-1.5 text-[0.66rem] font-black uppercase tracking-[0.16em] text-white/78"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {media[0] ? (
                <figure className="overflow-hidden rounded-[8px] bg-white/8 shadow-editorial">
                  <div className="relative aspect-[4/5]">
                    <CaseStudyMediaAsset
                      item={media[0]}
                      title={caseStudy.title}
                      sizes="(min-width: 1024px) 38vw, 100vw"
                      priority
                    />
                  </div>
                </figure>
              ) : null}
            </div>
          </section>

          {media.length ? (
            <section className="px-5 py-16 sm:px-8 lg:py-24">
              <div className="mx-auto max-w-7xl">
                <div className="mb-10 max-w-4xl">
                  <p className="section-eyebrow text-ink/55">Gallery</p>
                  <h2 className="mt-4 font-serif text-[clamp(2.6rem,8vw,5.2rem)] font-semibold leading-[0.96]">
                    Visual story.
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {media.map((item, index) => (
                    <figure
                      key={`${item.src}-${index}`}
                      className="group overflow-hidden rounded-[8px] bg-ink shadow-soft"
                    >
                      <div className="relative aspect-[4/5]">
                        <CaseStudyMediaAsset
                          item={item}
                          title={caseStudy.title}
                          sizes="(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
                        />
                      </div>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <section className="bg-ink px-5 py-16 text-white sm:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-5 lg:grid-cols-3">
                {caseStudy.challenge ? (
                  <section className="rounded-[8px] border border-white/12 bg-white/[0.04] p-6">
                    <p className="section-eyebrow text-yellow">Challenge</p>
                    <p className="mt-5 text-lg leading-8 text-white/74">{caseStudy.challenge}</p>
                  </section>
                ) : null}
                {caseStudy.solution ? (
                  <section className="rounded-[8px] border border-white/12 bg-white/[0.04] p-6">
                    <p className="section-eyebrow text-yellow">Solution</p>
                    <p className="mt-5 text-lg leading-8 text-white/74">{caseStudy.solution}</p>
                  </section>
                ) : null}
                {caseStudy.result ? (
                  <section className="rounded-[8px] border border-white/12 bg-white/[0.04] p-6">
                    <p className="section-eyebrow text-yellow">Result</p>
                    <p className="mt-5 text-lg leading-8 text-white/74">{caseStudy.result}</p>
                  </section>
                ) : null}
              </div>

              <Link
                href="/#contact"
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.17em] text-ink transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
              >
                Discuss a similar project
                <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
