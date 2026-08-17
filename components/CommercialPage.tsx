import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CommercialHub, ServicePage } from "@/data/commercialPages";
import { localizedPath, translate, type Locale } from "@/lib/i18n";

const serviceLabels: Record<string, string> = {
  "strategy-campaigns": "Strategy & Campaigns",
  "websites-direct-booking": "Websites & Direct Booking",
  "ota-optimisation": "OTA Optimisation",
  "seo-google-visibility": "SEO & Google Visibility",
  "photography-video": "Photography & Video",
  "social-media": "Social Media"
};

export function CommercialHubPage({ hub, locale }: { hub: CommercialHub; locale: Locale }) {
  return (
    <main id="main" className="bg-white text-ink">
      <section className="bg-ink px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="section-eyebrow text-yellow">{translate(locale, hub.eyebrow)}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[0.96]">{translate(locale, hub.title)}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{translate(locale, hub.description)}</p>
          <p className="mt-6 max-w-2xl border-l-2 border-yellow pl-4 text-sm leading-7 text-white/60">{translate(locale, hub.audience)}</p>
          <Link href={localizedPath("/digital-scan", locale)} className="button-primary mt-8 inline-flex items-center gap-2">{translate(locale, "Digital Presence Review")}<ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="px-5 py-[var(--hc-section)] sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="section-eyebrow text-yellow">{translate(locale, "How Hospo supports you")}</p>
          <div className="mt-7 grid border-y border-ink/10 md:grid-cols-2 xl:grid-cols-5">
            {hub.pillars.map((pillar, index) => (
              <article key={pillar.title} className="border-b border-ink/10 px-0 py-8 md:px-6 md:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:px-7 xl:last:border-r-0">
                <p className="text-xs font-black tracking-[0.16em] text-yellow">0{index + 1}</p>
                <h2 className="mt-4 font-serif text-3xl font-semibold leading-none">{translate(locale, pillar.title)}</h2>
                <p className="mt-4 text-sm leading-7 text-ink/70">{translate(locale, pillar.description)}</p>
                <ul className="mt-5 space-y-2 text-sm leading-6 text-ink/72">
                  {pillar.items.map((item) => <li key={item} className="flex gap-2"><span className="text-yellow">•</span><span>{translate(locale, item)}</span></li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {hub.journey ? (
        <section className="bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="section-eyebrow text-yellow">{translate(locale, "One connected guest journey")}</p>
            <h2 className="mt-5 max-w-3xl font-serif text-[clamp(2.35rem,4vw,4rem)] font-semibold leading-[0.98]">{translate(locale, "Every touchpoint should support the next step.")}</h2>
            <div className="mt-10 flex flex-wrap items-center gap-3 text-sm font-semibold text-white/80">
              {hub.journey.map((step, index) => <span key={step} className="flex items-center gap-3"><span>{translate(locale, step)}</span>{index < hub.journey!.length - 1 ? <ArrowRight className="text-yellow" size={18} aria-hidden="true" /> : null}</span>)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-5 py-[var(--hc-section)] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="section-eyebrow text-yellow">{translate(locale, "Related services")}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {hub.relatedServiceSlugs.map((slug) => <Link key={slug} href={localizedPath(`/services/${slug}`, locale)} className="group flex items-center justify-between border-b border-ink/15 py-3 text-sm font-black uppercase tracking-[0.1em] transition hover:text-yellow">{translate(locale, serviceLabels[slug])}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
            </div>
          </div>
          <div>
            <p className="section-eyebrow text-yellow">{translate(locale, "Relevant work")}</p>
            <div className="mt-6 grid gap-3">
              {hub.relatedCaseStudies.map((slug) => <Link key={slug} href={localizedPath(`/case-studies/${slug}`, locale)} className="group flex items-center justify-between border-b border-ink/15 py-3 text-sm font-black uppercase tracking-[0.1em] transition hover:text-yellow">{translate(locale, "View case study")}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ServiceDetailPage({ service, locale }: { service: ServicePage; locale: Locale }) {
  const relatedHub = service.relatedHub === "hotels-stays" ? "/hotels-stays" : service.relatedHub === "restaurants-fb" ? "/restaurants-fb" : "/services";
  return (
    <main id="main" className="bg-white text-ink">
      <section className="bg-ink px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="section-eyebrow text-yellow">{translate(locale, service.eyebrow)}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[0.96]">{translate(locale, service.title)}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{translate(locale, service.description)}</p>
          <Link href={localizedPath("/digital-scan", locale)} className="button-primary mt-8 inline-flex items-center gap-2">{translate(locale, "Digital Presence Review")}<ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
      <section className="px-5 py-[var(--hc-section)] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="section-eyebrow text-yellow">{translate(locale, "Commercial focus")}</p><h2 className="mt-5 font-serif text-4xl font-semibold leading-none">{translate(locale, "Built around the next commercial step.")}</h2></div>
          <div className="grid gap-4 sm:grid-cols-2">{service.outcomes.map((outcome, index) => <div key={outcome} className="border-t border-ink/15 py-5"><p className="text-xs font-black tracking-[0.16em] text-yellow">0{index + 1}</p><p className="mt-3 text-base leading-7 text-ink/75">{translate(locale, outcome)}</p></div>)}</div>
        </div>
      </section>
      <section className="border-t border-ink/10 px-5 py-10 sm:px-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6"><p className="max-w-2xl text-base leading-7 text-ink/70">{translate(locale, "This service foundation will be expanded with deeper sector-specific guidance, proof and insight content.")}</p><Link href={localizedPath(relatedHub, locale)} className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] hover:text-yellow">{translate(locale, "Explore related support")}<ArrowUpRight size={16} aria-hidden="true" /></Link></div></section>
    </main>
  );
}
