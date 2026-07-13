import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";
import { getCaseStudyBySlug, getPublishedCaseStudies } from "@/lib/supabase/queries";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const caseStudies = await getPublishedCaseStudies();
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
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

  const media = caseStudy.media?.length
    ? caseStudy.media
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
      <main className="bg-white pt-28 text-ink">
        <article className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="section-eyebrow text-ink/55">Case Study</p>
          <h1 className="mt-5 max-w-5xl font-serif text-[clamp(3rem,10vw,6.4rem)] font-semibold leading-[0.94]">
            {caseStudy.title}
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-9 text-ink/72 sm:text-2xl sm:leading-10">
            {caseStudy.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {caseStudy.services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-ink/16 px-3 py-1.5 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ink/70"
              >
                {service}
              </span>
            ))}
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((item) => (
              <figure key={item.src} className="overflow-hidden rounded-[8px] bg-ink">
                <div className="relative aspect-[4/5]">
                  <SmartImage
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    fallbackLabel={caseStudy.title}
                  />
                </div>
              </figure>
            ))}
          </div>

          {(caseStudy.challenge || caseStudy.solution || caseStudy.result) && (
            <div className="mt-16 grid gap-8 border-t border-ink/12 pt-10 lg:grid-cols-3">
              {caseStudy.challenge ? (
                <section>
                  <p className="section-eyebrow text-ink/55">Challenge</p>
                  <p className="mt-4 text-lg leading-8 text-ink/72">{caseStudy.challenge}</p>
                </section>
              ) : null}
              {caseStudy.solution ? (
                <section>
                  <p className="section-eyebrow text-ink/55">Solution</p>
                  <p className="mt-4 text-lg leading-8 text-ink/72">{caseStudy.solution}</p>
                </section>
              ) : null}
              {caseStudy.result ? (
                <section>
                  <p className="section-eyebrow text-ink/55">Result</p>
                  <p className="mt-4 text-lg leading-8 text-ink/72">{caseStudy.result}</p>
                </section>
              ) : null}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
