import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Building2, CalendarDays, Instagram, MapPin, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import {
  belezaCampaigns,
  belezaHeadlineMetrics,
  belezaInfluencerMetrics,
  belezaInstagramHighlights,
  belezaServices
} from "@/data/belezaCaseStudy";

export const metadata: Metadata = {
  title: "Beleza Rodizio Instagram Growth Case Study | Hospo Creative",
  description:
    "How Hospo Creative helped grow Beleza Rodizio's Instagram community from approximately 1,000 to 13,500 followers in under one year."
};

const locations = ["Stratford-upon-Avon", "Hull", "Solihull"];

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <Reveal className="max-w-5xl">
      <p className="section-eyebrow text-yellow">{eyebrow}</p>
      <h2 className="mt-5 font-serif text-[clamp(2.7rem,7vw,5.2rem)] font-semibold leading-[0.96]">{title}</h2>
      {body ? <p className="mt-7 max-w-4xl text-xl leading-9 opacity-70 sm:text-2xl sm:leading-10">{body}</p> : null}
    </Reveal>
  );
}

export default function BelezaRodizioCaseStudy() {
  return (
    <>
      <Header />
      <main id="main" className="bg-white pt-16 text-ink">
        <article>
          <section className="overflow-hidden bg-ink px-5 pb-20 pt-14 text-white sm:px-8 lg:pb-28 lg:pt-20">
            <div className="mx-auto max-w-7xl">
              <Link
                href="/#work"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/65 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
              >
                <ArrowLeft aria-hidden="true" size={16} />
                Selected work
              </Link>

              <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(21rem,0.62fr)] lg:items-end">
                <Reveal>
                  <p className="section-eyebrow text-yellow">Social media, content and multi-location growth</p>
                  <h1 className="mt-6 max-w-6xl font-serif text-[clamp(3.2rem,8vw,6.6rem)] font-semibold leading-[0.92]">
                    From 1,000 to 13,500 followers: building Beleza Rodizio&apos;s Instagram community.
                  </h1>
                </Reveal>

                <Reveal delay={0.12} className="border-l border-yellow/55 pl-6 sm:pl-8">
                  <p className="text-xl leading-9 text-white/74">
                    A results-led Instagram, content and campaign programme across three Beleza Rodizio restaurants.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-4 text-sm text-white/65">
                    <span className="inline-flex items-center gap-2"><CalendarDays size={17} aria-hidden="true" /> Jan 2025-Mar 2026</span>
                    <span className="inline-flex items-center gap-2"><Building2 size={17} aria-hidden="true" /> Brazilian rodizio</span>
                  </div>
                </Reveal>
              </div>

              <div className="mt-14 grid gap-px overflow-hidden rounded-[8px] bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
                {belezaHeadlineMetrics.map((metric, index) => (
                  <Reveal key={metric.label} delay={index * 0.06} className="bg-white/[0.055] p-6 lg:p-7">
                    <p className="font-serif text-4xl font-semibold text-yellow sm:text-5xl">{metric.value}</p>
                    <p className="mt-4 text-sm font-bold leading-6 text-white">{metric.label}</p>
                    <p className="mt-1 text-xs leading-5 text-white/48">{metric.detail}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 py-20 sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Client overview"
                title="One restaurant brand. Three local communities."
                body="Beleza Rodizio needed a consistent Instagram presence that could communicate the complete dining experience while supporting local campaigns across Stratford-upon-Avon, Hull and Solihull."
              />
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {locations.map((location, index) => (
                  <Reveal key={location} delay={index * 0.07} className="border-t border-ink/18 pt-5">
                    <MapPin aria-hidden="true" className="text-yellow" size={22} />
                    <p className="mt-5 font-serif text-3xl font-semibold">{location}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-ink px-5 py-20 text-white sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="The approach"
                title="Show the experience, then give people a reason to act."
                body="Hospo Creative combined consistent publishing, short-form content, community management, campaign-led planning and creator collaborations. The content moved beyond individual dishes to show Brazilian hospitality, tableside carving, cocktails, celebrations and the atmosphere around each visit."
              />
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {belezaServices.map((service, index) => (
                  <Reveal key={service} delay={index * 0.04} className="rounded-[8px] border border-white/14 bg-white/[0.04] p-6">
                    <p className="text-xs font-black text-yellow">0{index + 1}</p>
                    <h3 className="mt-8 font-serif text-3xl font-semibold">{service}</h3>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 py-20 sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Instagram growth"
                title="A community approximately 13.5 times larger."
                body="Beleza Rodizio's Instagram audience grew from approximately 1,000 to 13,500 followers in under one year. That represents approximately 12,500 net new followers and around 1,250% audience growth."
              />

              <Reveal className="mt-12 rounded-[8px] bg-ink p-7 text-white sm:p-10">
                <div className="grid items-center gap-7 md:grid-cols-[auto_1fr_auto]">
                  <div>
                    <p className="section-eyebrow text-white/45">Starting audience</p>
                    <p className="mt-3 font-serif text-6xl font-semibold">~1K</p>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-white/15">
                    <div className="absolute inset-y-0 left-0 w-full origin-left bg-yellow" />
                  </div>
                  <div className="md:text-right">
                    <p className="section-eyebrow text-yellow">Final audience</p>
                    <p className="mt-3 font-serif text-6xl font-semibold">~13.5K</p>
                  </div>
                </div>
              </Reveal>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {belezaInstagramHighlights.map((metric, index) => (
                  <Reveal key={`${metric.label}-${metric.detail}`} delay={index * 0.05} className="rounded-[8px] border border-ink/14 p-6">
                    <p className="font-serif text-4xl font-semibold">{metric.value}</p>
                    <p className="mt-4 font-bold">{metric.label}</p>
                    <p className="mt-1 text-sm leading-6 text-ink/55">{metric.detail}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-ink px-5 py-20 text-white sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
                <Reveal>
                  <Instagram className="text-yellow" size={34} aria-hidden="true" />
                  <p className="section-eyebrow mt-8 text-yellow">Influencer highlight</p>
                  <h2 className="mt-5 font-serif text-[clamp(2.8rem,6vw,5.2rem)] font-semibold leading-[0.96]">West Midlands Foodie.</h2>
                  <p className="mt-7 text-xl leading-9 text-white/70">
                    The creator collaboration paired strong reach and engagement with measurable audience growth, generating approximately 400 new Instagram followers in one day.
                  </p>
                </Reveal>
                <div className="grid gap-px overflow-hidden rounded-[8px] bg-white/15 sm:grid-cols-2">
                  {belezaInfluencerMetrics.map((metric, index) => (
                    <Reveal key={metric.label} delay={index * 0.05} className="bg-white/[0.055] p-7 sm:p-9">
                      <p className="font-serif text-5xl font-semibold text-yellow">{metric.value}</p>
                      <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-white/70">{metric.label}</p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 py-20 sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Campaigns promoted"
                title="A year of reasons to discover, visit and return."
                body="Always-on restaurant storytelling was supported by launch activity, seasonal moments, product campaigns, local partnerships and booking-led promotions."
              />
              <div className="mt-12 grid gap-px overflow-hidden rounded-[8px] border border-ink/12 bg-ink/12 sm:grid-cols-2 lg:grid-cols-3">
                {belezaCampaigns.map((campaign, index) => (
                  <Reveal key={campaign} delay={(index % 6) * 0.025} className="flex min-h-28 items-start gap-4 bg-white p-5 sm:p-6">
                    <span className="mt-1 text-xs font-black text-yellow">{String(index + 1).padStart(2, "0")}</span>
                    <p className="text-lg font-bold leading-7">{campaign}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-ink px-5 py-20 text-white sm:px-8 lg:py-28">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.7fr] lg:items-end">
              <SectionHeading
                eyebrow="Outcome"
                title="Consistent creative became measurable community growth."
                body="The programme gave Beleza Rodizio a larger, more active Instagram audience and a clear campaign rhythm across three restaurant locations, supported by content, creators, community management and regular optimisation."
              />
              <Reveal delay={0.1} className="rounded-[8px] border border-white/14 p-7">
                <Sparkles className="text-yellow" aria-hidden="true" />
                <p className="mt-6 font-serif text-3xl font-semibold">Need a stronger hospitality growth system?</p>
                <Link href="/#contact" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-yellow">
                  Start a project <ArrowUpRight aria-hidden="true" size={17} />
                </Link>
              </Reveal>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
