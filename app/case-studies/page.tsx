import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";
import { getPublishedCaseStudies } from "@/lib/supabase/queries";
import { getRequestLocale } from "@/lib/locale-server";
import { localizedPath, translate } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    title: locale === "pt" ? "Projetos Selecionados | Hospo Creative" : "Selected Work | Hospo Creative",
    description:
      locale === "pt"
        ? "Projetos de estratégia, conteúdo e execução digital para hotéis, restaurantes, alojamentos e marcas de alimentação e bebidas."
        : "Strategy, content and digital projects for hotels, restaurants, stays and food and drink brands.",
    pathname: "/case-studies",
    locale
  });
}

function isVideo(src: string) {
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(src);
}

export default async function CaseStudiesPage() {
  const locale = await getRequestLocale();
  const caseStudies = await getPublishedCaseStudies(locale);

  return (
    <>
      <Header locale={locale} />
      <main id="main" className="bg-white text-ink">
        <section className="bg-ink px-5 py-16 text-white sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="section-eyebrow text-yellow">{translate(locale, "Selected work")}</p>
            <h1 className="mt-5 max-w-5xl font-serif text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[0.96]">
              {translate(locale, "Projects made to be seen, understood and chosen.")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{translate(locale, "Strategy, content and digital execution designed around the way people discover, compare and choose where to stay, eat and visit.")}</p>
          </div>
        </section>

        {caseStudies.length ? (
          <section className="px-5 pb-20 sm:px-8 lg:pb-28">
            <div className="mx-auto max-w-7xl space-y-14 lg:space-y-20">
              {caseStudies.map((caseStudy, index) => {
                const media = caseStudy.media?.[0];
                const mediaSrc = caseStudy.heroImage ?? media?.src;
                const mediaAlt = caseStudy.heroImageAlt ?? media?.alt ?? caseStudy.title;
                return (
                  <article
                    key={caseStudy.id}
                    className={`group grid gap-7 lg:items-center lg:gap-12 ${index % 2 ? "lg:grid-cols-[minmax(0,1fr)_24rem]" : "lg:grid-cols-[24rem_minmax(0,1fr)]"}`}
                  >
                    {mediaSrc ? (
                      <Link href={localizedPath(`/case-studies/${caseStudy.slug}`, locale)} className={`relative aspect-[4/5] overflow-hidden rounded-[8px] bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow ${index % 2 ? "lg:order-2" : ""}`}>
                        {isVideo(mediaSrc) ? (
                          <video className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline preload="metadata">
                            <source src={mediaSrc} />
                          </video>
                        ) : (
                          <SmartImage src={mediaSrc} alt={mediaAlt} fill sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw" className="object-cover object-center transition duration-500 group-hover:scale-[1.03]" fallbackLabel={caseStudy.title} />
                        )}
                      </Link>
                    ) : null}
                    <div className={index % 2 ? "lg:order-1" : ""}>
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-ink/52">
                        {caseStudy.clientName}{caseStudy.location ? ` / ${caseStudy.location}` : ""}
                      </p>
                      <h2 className="mt-3 font-serif text-[clamp(2.2rem,4vw,3.4rem)] font-semibold leading-[1]">{caseStudy.title}</h2>
                      <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">{caseStudy.summary}</p>
                      <Link href={localizedPath(`/case-studies/${caseStudy.slug}`, locale)} className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-black uppercase tracking-[0.16em] transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">{translate(locale, "View case study")} <ArrowUpRight size={17} aria-hidden="true" /></Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </main>
      <Footer locale={locale} />
    </>
  );
}
