import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";
import { getPublishedCaseStudies } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

function isVideo(src: string) {
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(src);
}

export default async function CaseStudiesPage() {
  const caseStudies = await getPublishedCaseStudies();

  return (
    <>
      <Header />
      <main id="main" className="bg-white text-ink">
        <section className="px-5 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
          <div className="mx-auto max-w-7xl">
            <p className="section-eyebrow text-ink/55">Selected work</p>
            <h1 className="mt-5 max-w-5xl font-serif text-[clamp(3.3rem,8vw,6.5rem)] font-semibold leading-[0.92]">
              Hospitality projects made to be seen, understood and chosen.
            </h1>
          </div>
        </section>

        {caseStudies.length ? (
          <section className="px-5 pb-20 sm:px-8 lg:pb-28">
            <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
              {caseStudies.map((caseStudy) => {
                const media = caseStudy.media?.[0];
                const mediaSrc = media?.src ?? caseStudy.heroImage;
                const mediaAlt = media?.alt ?? caseStudy.heroImageAlt ?? caseStudy.title;
                return (
                  <Link
                    key={caseStudy.id}
                    href={`/case-studies/${caseStudy.slug}`}
                    className="group overflow-hidden rounded-[8px] border border-ink/10 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
                  >
                    {mediaSrc ? (
                      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                        {media?.mediaType === "video" || isVideo(mediaSrc) ? (
                          <video className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline preload="metadata">
                            <source src={mediaSrc} />
                          </video>
                        ) : (
                          <SmartImage src={mediaSrc} alt={mediaAlt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" fallbackLabel={caseStudy.title} />
                        )}
                      </div>
                    ) : null}
                    <div className="p-7 sm:p-8">
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-ink/52">
                        {caseStudy.clientName}{caseStudy.location ? ` / ${caseStudy.location}` : ""}
                      </p>
                      <h2 className="mt-3 font-serif text-4xl font-semibold leading-[0.96]">{caseStudy.title}</h2>
                      <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">{caseStudy.summary}</p>
                      <span className="mt-7 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em]">View case study <ArrowUpRight size={17} aria-hidden="true" /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
