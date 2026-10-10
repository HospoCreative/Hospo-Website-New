import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Globe2, Instagram, Linkedin, MapPin } from "lucide-react";
import { digitalCardUrl, type DigitalBusinessCard, type SocialNetwork } from "@/data/digitalBusinessCards";
import { DigitalCardContactActions } from "./DigitalCardContactActions";

function SocialIcon({ network }: { network: SocialNetwork }) {
  if (network === "instagram") return <Instagram size={18} aria-hidden="true" />;
  if (network === "linkedin") return <Linkedin size={18} aria-hidden="true" />;
  return <Globe2 size={18} aria-hidden="true" />;
}

export function DigitalBusinessCard({ card }: { card: DigitalBusinessCard }) {
  return (
    <main className="min-h-dvh bg-[#002c5d] px-4 py-4 text-white sm:px-6 sm:py-8">
      <article className="mx-auto max-w-[32rem] overflow-hidden rounded-[1.75rem] bg-[#002c5d] shadow-[0_24px_80px_rgba(0,19,53,0.35)] ring-1 ring-white/15">
        <section className="relative overflow-hidden px-6 pb-8 pt-7 sm:px-9 sm:pt-9">
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#ffcc53]/12 blur-3xl" />
          <Image
            src="/logos/hospo/hospo-logo-white-transparent.png"
            alt="Hospo Creative"
            width={58}
            height={58}
            className="relative h-12 w-12 object-contain object-left"
            priority
          />

          <div className="relative mt-9 flex items-end gap-5">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-[#ffcc53] bg-white/10 shadow-xl">
              <Image src={card.portrait} alt={card.portraitAlt} fill sizes="112px" className="object-cover" priority />
            </div>
            <div className="pb-1">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#ffcc53]">Hospo Creative</p>
              <h1 className="mt-2 font-[var(--font-display)] text-4xl leading-[0.9] tracking-[-0.035em]">{card.name}</h1>
              <p className="mt-3 max-w-56 text-sm font-semibold leading-5 text-white/75">{card.title}</p>
            </div>
          </div>

          <p className="relative mt-8 max-w-sm font-[var(--font-display)] text-[1.65rem] leading-[1.06] text-white">We make hospitality look good.</p>
          <div className="relative mt-5 flex items-center gap-2 text-xs font-semibold text-white/65">
            <MapPin size={15} className="text-[#ffcc53]" aria-hidden="true" />
            Algarve, Portugal <span className="text-white/35">•</span> Working internationally
          </div>
        </section>

        <section className="bg-white px-6 py-7 text-[#002c5d] sm:px-9">
          <DigitalCardContactActions card={card} cardUrl={digitalCardUrl(card.slug)} />

          <div className="mt-9 border-t border-[#002c5d]/10 pt-8">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#002c5d]/55">Connect</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://hospocreative.com" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#f3f5f7] px-4 text-xs font-bold transition hover:bg-[#e7ebef]">
                <Globe2 size={18} aria-hidden="true" /> Website
              </a>
              {card.socialLinks.map((social) => (
                <a key={social.href} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#f3f5f7] px-4 text-xs font-bold transition hover:bg-[#e7ebef]">
                  <SocialIcon network={social.network} /> {social.network === "linkedin" ? "LinkedIn" : social.network === "instagram" ? "Instagram" : "Website"}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-[#002c5d]/10 pt-8">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#002c5d]/55">Selected work</p>
                <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-none">A glimpse of our work.</h2>
              </div>
              <BriefcaseBusiness size={23} className="mb-1 shrink-0 text-[#ffcc53]" aria-hidden="true" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {card.portfolio.map((item) => (
                <Link key={item.src} href={item.href} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-[#002c5d]/10">
                  <Image src={item.src} alt={item.alt} fill sizes="(max-width: 520px) 28vw, 130px" className="object-cover transition duration-500 group-hover:scale-105" />
                </Link>
              ))}
            </div>
          </div>

          <Link href="/contact" className="mt-10 flex min-h-14 items-center justify-between rounded-2xl bg-[#002c5d] px-5 text-white transition hover:bg-[#003a78]">
            <span>
              <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#ffcc53]">Hospo Creative</span>
              <span className="mt-1 block font-[var(--font-display)] text-xl">Discuss a project</span>
            </span>
            <ArrowUpRight size={21} aria-hidden="true" />
          </Link>
        </section>
      </article>
    </main>
  );
}
