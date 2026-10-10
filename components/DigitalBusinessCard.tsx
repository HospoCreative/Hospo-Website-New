"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Globe2, Instagram, Linkedin, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { digitalCardUrl, type DigitalBusinessCard, type DigitalCardLocale, type SocialNetwork } from "@/data/digitalBusinessCards";
import { DigitalCardContactActions } from "./DigitalCardContactActions";

const languageStorageKey = "hospo-digital-card-locale";

const copy: Record<DigitalCardLocale, {
  language: string;
  location: string;
  connect: string;
  website: string;
  selectedWork: string;
  workHeading: string;
  discussProject: string;
  socialLabel: (network: SocialNetwork) => string;
}> = {
  en: {
    language: "Language",
    location: "Portugal & United Kingdom | Available Worldwide",
    connect: "Connect",
    website: "Website",
    selectedWork: "Selected work",
    workHeading: "A glimpse of our work.",
    discussProject: "Discuss a project",
    socialLabel: (network) => `Hospo Creative on ${network === "linkedin" ? "LinkedIn" : network === "instagram" ? "Instagram" : "Website"}`
  },
  pt: {
    language: "Idioma",
    location: "Portugal e Reino Unido | Disponível em todo o mundo",
    connect: "Contactos",
    website: "Website",
    selectedWork: "Trabalho selecionado",
    workHeading: "Uma amostra do nosso trabalho.",
    discussProject: "Falar sobre um projeto",
    socialLabel: (network) => `Hospo Creative no ${network === "linkedin" ? "LinkedIn" : network === "instagram" ? "Instagram" : "Website"}`
  }
};

function SocialIcon({ network }: { network: SocialNetwork }) {
  if (network === "instagram") return <Instagram size={18} aria-hidden="true" />;
  if (network === "linkedin") return <Linkedin size={18} aria-hidden="true" />;
  return <Globe2 size={18} aria-hidden="true" />;
}

export function DigitalBusinessCard({ card }: { card: DigitalBusinessCard }) {
  const [locale, setLocale] = useState<DigitalCardLocale>("en");
  const content = copy[locale];

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(languageStorageKey);
    if (savedLocale === "pt") setLocale("pt");
  }, []);

  function changeLocale(nextLocale: DigitalCardLocale) {
    setLocale(nextLocale);
    window.localStorage.setItem(languageStorageKey, nextLocale);
  }

  return (
    <main className="min-h-dvh bg-[#002c5d] px-4 py-4 text-white sm:px-6 sm:py-8">
      <article className="mx-auto max-w-[32rem] overflow-hidden rounded-[1.75rem] bg-[#002c5d] shadow-[0_24px_80px_rgba(0,19,53,0.35)] ring-1 ring-white/15">
        <section className="relative overflow-hidden px-6 pb-6 pt-6 sm:px-9 sm:pb-8 sm:pt-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#ffcc53]/12 blur-3xl" />
          <div className="relative flex items-center justify-between gap-4">
            <Image
              src="/logos/hospo/hospo-logo-white-transparent.png"
              alt="Hospo Creative"
              width={58}
              height={58}
              className="h-14 w-14 object-contain object-left"
              priority
            />
            <div role="group" aria-label={content.language} className="inline-flex rounded-full border border-white/20 bg-white/5 p-1 text-[0.62rem] font-extrabold uppercase tracking-[0.15em]">
              {(["en", "pt"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => changeLocale(option)}
                  aria-pressed={locale === option}
                  className={`rounded-full px-3 py-1.5 transition ${locale === option ? "bg-[#ffcc53] text-[#002c5d]" : "text-white/70 hover:text-white"}`}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-6 flex items-end gap-5 sm:mt-7">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-[#ffcc53] bg-white/10 shadow-xl">
              <Image src={card.portrait} alt={locale === "pt" ? card.portraitAltPt : card.portraitAlt} fill sizes="112px" className="object-cover" priority />
            </div>
            <div className="pb-1">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#ffcc53]">Hospo Creative</p>
              <h1 className="mt-2 font-[var(--font-display)] text-4xl leading-[0.9] tracking-[-0.035em]">{card.name}</h1>
              <p className="mt-3 max-w-56 text-sm font-semibold leading-5 text-white/75">{locale === "pt" ? card.titlePt : card.title}</p>
            </div>
          </div>

          <p className="relative mt-6 max-w-sm font-[var(--font-display)] text-[1.4rem] leading-[1.18] text-white">We make your business look good and easy to find.</p>
          <div className="relative mt-4 flex items-center gap-2 text-xs font-semibold text-white/65">
            <MapPin size={15} className="text-[#ffcc53]" aria-hidden="true" />
            {content.location}
          </div>
        </section>

        <section className="bg-white px-6 py-7 text-[#002c5d] sm:px-9">
          <DigitalCardContactActions card={card} cardUrl={digitalCardUrl(card.slug)} locale={locale} title={locale === "pt" ? card.titlePt : card.title} />

          <div className="mt-8 border-t border-[#002c5d]/10 pt-7">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#002c5d]/55">{content.connect}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://hospocreative.com" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#f3f5f7] px-4 text-xs font-bold transition hover:bg-[#e7ebef]">
                <Globe2 size={18} aria-hidden="true" /> {content.website}
              </a>
              {card.socialLinks.map((social) => (
                <a key={social.href} href={social.href} target="_blank" rel="noreferrer" aria-label={content.socialLabel(social.network)} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#f3f5f7] px-4 text-xs font-bold transition hover:bg-[#e7ebef]">
                  <SocialIcon network={social.network} /> {social.network === "linkedin" ? "LinkedIn" : social.network === "instagram" ? "Instagram" : content.website}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-[#002c5d]/10 pt-7">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#002c5d]/55">{content.selectedWork}</p>
                <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-none">{content.workHeading}</h2>
              </div>
              <BriefcaseBusiness size={23} className="mb-1 shrink-0 text-[#ffcc53]" aria-hidden="true" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {card.portfolio.map((item) => (
                <Link key={item.src} href={item.href} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-[#002c5d]/10">
                  <Image src={item.src} alt={locale === "pt" ? item.altPt : item.alt} fill sizes="(max-width: 520px) 28vw, 130px" className="object-cover transition duration-500 group-hover:scale-105" />
                </Link>
              ))}
            </div>
          </div>

          <Link href={locale === "pt" ? "/pt/contact" : "/contact"} className="mt-8 flex min-h-14 items-center justify-between rounded-2xl bg-[#002c5d] px-5 text-white transition hover:bg-[#003a78]">
            <span>
              <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#ffcc53]">Hospo Creative</span>
              <span className="mt-1 block font-[var(--font-display)] text-xl">{content.discussProject}</span>
            </span>
            <ArrowUpRight size={21} aria-hidden="true" />
          </Link>
        </section>
      </article>
    </main>
  );
}
