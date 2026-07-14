import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BarChart3, Building2, CalendarDays, Instagram, MapPin } from "lucide-react";
import { BelezaGrowthChart } from "@/components/BelezaGrowthChart";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import {
  belezaFacebookResults,
  belezaHeadlineMetrics,
  belezaPaidContent,
  belezaServices
} from "@/data/belezaCaseStudy";

export const metadata: Metadata = {
  title: "Beleza Rodizio Instagram Growth Case Study | Hospo Creative",
  description:
    "How Hospo Creative grew Beleza's shared Instagram account from 5.2K to more than 13.2K followers in nine months across a three-location hospitality programme."
};

const locations = ["Hull", "Stratford-upon-Avon", "Solihull"];

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <Reveal className="max-w-5xl">
      <p className="section-eyebrow text-yellow">{eyebrow}</p>
      <h2 className="mt-5 font-serif text-[clamp(2.7rem,8vw,5.7rem)] font-semibold leading-[0.96]">{title}</h2>
      {body ? <p className="mt-7 max-w-4xl text-xl leading-9 opacity-70 sm:text-2xl sm:leading-10">{body}</p> : null}
    </Reveal>
  );
}

function AssetPlaceholder({ label, note }: { label: string; note: string }) {
  return (
    <div className="grid min-h-[22rem] place-items-center rounded-[8px] border border-dashed border-white/25 bg-white/[0.045] p-8 text-center">
      <div className="max-w-md">
        <p className="section-eyebrow text-white/50">Asset awaiting approval</p>
        <p className="mt-4 font-serif text-3xl font-semibold text-white">{label}</p>
        <p className="mt-4 text-base leading-7 text-white/60">{note}</p>
      </div>
    </div>
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
                  <p className="section-eyebrow text-yellow">Beleza Rodizio · Instagram growth case study</p>
                  <h1 className="mt-6 max-w-6xl font-serif text-[clamp(3.2rem,9vw,7rem)] font-semibold leading-[0.91]">
                    Growing Beleza&apos;s Instagram community from 5.2K to more than 13.2K followers in nine months.
                  </h1>
                </Reveal>

                <Reveal delay={0.12} className="border-l border-yellow/55 pl-6 sm:pl-8">
                  <p className="text-xl leading-9 text-white/74">
                    A connected social media, content and campaign programme spanning Hull, Stratford-upon-Avon and Solihull.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3 text-sm text-white/65">
                    <span className="inline-flex items-center gap-2"><CalendarDays size={17} aria-hidden="true" /> Jan 2025-Mar 2026</span>
                    <span className="inline-flex items-center gap-2"><Building2 size={17} aria-hidden="true" /> Brazilian dining</span>
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
                eyebrow="Project overview"
                title="One shared brand. Three local audiences."
                body="Hospo Creative built a connected operating system for social content, campaigns, paid support and reporting while Beleza expanded from two established venues to a third location."
              />
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {locations.map((location, index) => (
                  <Reveal key={location} delay={index * 0.07} className="border-t border-ink/18 pt-5">
                    <MapPin aria-hidden="true" className="text-yellow" size={22} />
                    <p className="mt-5 font-serif text-3xl font-semibold">{location}</p>
                    <p className="mt-3 text-base leading-7 text-ink/60">Location-led activity within one recognisable group presence.</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-ink px-5 py-20 text-white sm:px-8 lg:py-28">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
              <SectionHeading
                eyebrow="Challenge"
                title="Consistency without losing local relevance."
                body="The programme needed to support an expanding campaign calendar, different local priorities and a major venue launch without fragmenting the Beleza brand."
              />
              <Reveal delay={0.1} className="self-end border-l border-white/18 pl-6 sm:pl-8">
                <p className="text-xl leading-9 text-white/72 sm:text-2xl sm:leading-10">
                  Content also had to connect with paid media, seasonal menus, website updates, creators and PR partners, supported by dependable reporting and practical approval workflows.
                </p>
              </Reveal>
            </div>
          </section>

          <section className="px-5 py-20 sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Strategic approach"
                title="A connected multi-location system."
                body="Group-level direction created consistency while venue-led campaigns gave each restaurant room to respond to its local market. Always-on content, paid distribution, website support and specialist PR coordination worked as one programme."
              />
              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {["Group brand direction", "Location-led campaigns", "Reporting and optimisation"].map((item, index) => (
                  <Reveal key={item} delay={index * 0.06} className="rounded-[8px] border border-ink/14 p-6">
                    <p className="text-sm font-black text-yellow">0{index + 1}</p>
                    <h3 className="mt-8 font-serif text-3xl font-semibold">{item}</h3>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-ink px-5 py-20 text-white sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Instagram growth"
                title="From 5,220 to 13,213 followers."
                body="Nine continuous monthly reports track the shared Beleza group account from the earliest reliable baseline in June 2025 to the latest reliable count on 27 February 2026."
              />
              <div className="mt-12"><BelezaGrowthChart /></div>

              <div className="mt-12 grid gap-4 lg:grid-cols-2">
                <Reveal className="rounded-[8px] border border-white/14 bg-white/[0.045] p-7">
                  <p className="section-eyebrow text-yellow">June 2025 baseline</p>
                  <p className="mt-5 font-serif text-6xl font-semibold">5,220</p>
                  <p className="mt-4 text-lg leading-8 text-white/66">Earliest reliable raw follower count for the shared group account.</p>
                  <p className="mt-8 text-xs uppercase tracking-[0.16em] text-white/42">Baseline report export still required for publication</p>
                </Reveal>
                <Reveal delay={0.08} className="overflow-hidden rounded-[8px] border border-white/14 bg-white/[0.045]">
                  <Image
                    src="/images/case-studies/beleza/february-instagram-evidence.png"
                    alt="February 2026 Beleza Group Instagram report showing 13,213 followers for 29 January to 27 February and 43 percent of views from ads"
                    width={2048}
                    height={1152}
                    className="h-auto w-full"
                  />
                  <div className="p-5">
                    <p className="section-eyebrow text-yellow">February 2026 endpoint</p>
                    <p className="mt-3 text-sm leading-6 text-white/60">Supporting report evidence. Account label, reporting dates and paid-view context are retained.</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="px-5 py-20 sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Facebook performance"
                title="Local pages supporting the wider programme."
                body="February 2026 venue-level results, shown as monthly report figures rather than annual totals."
              />
              <div className="mt-12 grid gap-4 lg:grid-cols-3">
                {belezaFacebookResults.map((result, index) => (
                  <Reveal key={result.location} delay={index * 0.06} className="rounded-[8px] bg-ink p-6 text-white">
                    <p className="section-eyebrow text-yellow">{result.location}</p>
                    <dl className="mt-8 space-y-5">
                      <div className="flex items-end justify-between gap-4 border-b border-white/12 pb-4"><dt className="text-white/55">Views</dt><dd className="font-serif text-3xl font-semibold">{result.views}</dd></div>
                      <div className="flex items-end justify-between gap-4 border-b border-white/12 pb-4"><dt className="text-white/55">Follows</dt><dd className="font-serif text-3xl font-semibold">{result.follows}</dd></div>
                      <div className="flex items-end justify-between gap-4"><dt className="text-white/55">Website clicks</dt><dd className="font-serif text-3xl font-semibold text-yellow">{result.clicks}</dd></div>
                    </dl>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-ink px-5 py-20 text-white sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-4 lg:grid-cols-2">
                <Reveal className="rounded-[8px] border border-white/14 p-7 sm:p-9">
                  <p className="section-eyebrow text-yellow">TikTok growth · February 2026</p>
                  <p className="mt-8 font-serif text-7xl font-semibold">4,839</p>
                  <p className="mt-3 text-xl text-white/70">total group followers</p>
                  <div className="mt-10 grid grid-cols-2 gap-5 border-t border-white/14 pt-6">
                    <div><p className="text-3xl font-bold text-yellow">+272</p><p className="mt-2 text-sm text-white/50">followers in month</p></div>
                    <div><p className="text-3xl font-bold text-yellow">16,000</p><p className="mt-2 text-sm text-white/50">viewers</p></div>
                  </div>
                </Reveal>
                <Reveal delay={0.08} className="rounded-[8px] bg-yellow p-7 text-ink sm:p-9">
                  <p className="section-eyebrow">Website link clicks · February 2026</p>
                  <p className="mt-8 font-serif text-7xl font-semibold">3,127</p>
                  <p className="mt-4 max-w-md text-xl leading-8 text-ink/68">Combined monthly website-link activity reported across the programme.</p>
                  <p className="mt-10 text-xs uppercase tracking-[0.16em] text-ink/48">Paid and organic composition unavailable</p>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="px-5 py-20 sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="High-performing content"
                title="Paid-video examples that moved people."
                body="The strongest supported Instagram ad examples from the June and September reports. These are paid results, not claims about organic Reel performance."
              />
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {belezaPaidContent.map((item, index) => (
                  <Reveal key={item.title} delay={index * 0.05} className="overflow-hidden rounded-[8px] border border-ink/14">
                    <div className="grid aspect-[4/3] place-items-center bg-ink p-6 text-center text-white">
                      <div><Instagram aria-hidden="true" className="mx-auto text-yellow" /><p className="mt-5 text-xs font-black uppercase tracking-[0.18em]">Creative requires approval</p></div>
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-ink/42">{item.month} · Top-performing Instagram ad</p>
                      <h3 className="mt-3 font-serif text-2xl font-semibold">{item.title}</h3>
                      <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                        <div><dd className="font-bold">{item.views}</dd><dt className="mt-1 text-[0.65rem] text-ink/48">Views</dt></div>
                        <div><dd className="font-bold">{item.clicks}</dd><dt className="mt-1 text-[0.65rem] text-ink/48">Clicks</dt></div>
                        <div><dd className="font-bold">{item.follows}</dd><dt className="mt-1 text-[0.65rem] text-ink/48">Follows</dt></div>
                      </dl>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-ink px-5 py-20 text-white sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Solihull launch"
                title="A third-location story built for local attention."
                body="Hospo coordinated planning and creative requirements while The Relationship supported press, creator and event activity."
              />
              <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <AssetPlaceholder label="Solihull launch photography" note="Replace with approved high-resolution event photography once photographer, client and subject permissions are confirmed." />
                <Reveal className="rounded-[8px] bg-white p-7 text-ink sm:p-9">
                  <p className="section-eyebrow text-ink/45">Agency-reported attendance</p>
                  <dl className="mt-8 space-y-6">
                    <div className="flex items-end justify-between border-b border-ink/12 pb-5"><dt className="text-lg text-ink/60">Guests</dt><dd className="font-serif text-5xl font-semibold">105</dd></div>
                    <div className="flex items-end justify-between border-b border-ink/12 pb-5"><dt className="text-lg text-ink/60">Influencers</dt><dd className="font-serif text-5xl font-semibold">18</dd></div>
                    <div className="flex items-end justify-between"><dt className="text-lg text-ink/60">Press representatives</dt><dd className="font-serif text-5xl font-semibold">14</dd></div>
                  </dl>
                  <p className="mt-8 text-sm leading-6 text-ink/50">Figures reported by PR partner The Relationship and not independently verified.</p>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="px-5 py-20 sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHeading eyebrow="Campaign, influencer and PR activity" title="Always-on delivery, with campaign moments layered in." />
              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {[
                  ["Wagyu promotion", "Press, social, event and giveaway coordination supported a focused product story."],
                  ["Seasonal campaigns", "Festive menus, Valentine's activity and lunch campaigns gave each venue timely reasons to communicate."],
                  ["Creators and local press", "Launch invitations, media coordination and post-launch activity extended the Solihull story."]
                ].map(([title, body], index) => (
                  <Reveal key={title} delay={index * 0.06} className="rounded-[8px] border border-ink/14 p-6 sm:p-7">
                    <BarChart3 aria-hidden="true" className="text-yellow" />
                    <h3 className="mt-8 font-serif text-3xl font-semibold">{title}</h3>
                    <p className="mt-4 text-base leading-7 text-ink/64">{body}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-ink px-5 py-20 text-white sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHeading eyebrow="Services delivered" title="A practical programme across content, campaign and conversion touchpoints." />
              <div className="mt-12 grid border-t border-white/14 sm:grid-cols-2 lg:grid-cols-3">
                {belezaServices.map((service, index) => (
                  <Reveal key={service} delay={(index % 3) * 0.04} className="border-b border-white/14 py-5 sm:pr-6">
                    <p className="flex gap-4 text-lg font-semibold"><span className="text-yellow">{String(index + 1).padStart(2, "0")}</span>{service}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 py-20 sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Outcome"
                title="Instagram more than doubled while the operating system expanded."
                body="Hospo grew Beleza's shared Instagram community from 5.2K to more than 13.2K followers in nine months while building a connected framework for content and campaigns across three locations."
              />
              <p className="mt-8 max-w-4xl text-lg leading-8 text-ink/64">
                The result reflects the total shared account, supported by organic content and paid activity. It does not claim that follower growth was wholly organic, and it does not use the unconfirmed 13.5K milestone.
              </p>
            </div>
          </section>

          <section className="border-t border-yellow/45 bg-ink px-5 py-20 text-white sm:px-8 lg:py-24">
            <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-4xl">
                <p className="section-eyebrow text-yellow">Growing across more than one location?</p>
                <h2 className="mt-5 font-serif text-[clamp(2.8rem,7vw,5.5rem)] font-semibold leading-[0.95]">Build one connected marketing system.</h2>
              </div>
              <Link
                href="/#contact"
                className="inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-yellow px-6 py-4 text-sm font-black uppercase tracking-[0.17em] text-ink transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow lg:self-auto"
              >
                Enquire about our services <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
