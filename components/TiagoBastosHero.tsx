"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import { SmartImage } from "@/components/SmartImage";

type Props = {
  locale: Locale;
  eyebrow: string;
  title: string;
  intro: string;
  supporting?: string;
  location: string;
  enquire: string;
  work: string;
};

const homepageHeroImages = [
  { src: "/images/hero/collage/1.jpg", alt: "Restaurant dish photographed for a client" },
  { src: "/images/hero/collage/2.jpg", alt: "Hotel pool and grounds photographed from above" },
  { src: "/images/hero/collage/3.jpg", alt: "Destination and guest experience photography" }
] as const;

const labels = {
  en: { services: "Services", work: "Work", video: "Video", about: "About", faq: "FAQ", contact: "Contact", open: "Open menu", close: "Close menu", language: "Português", portrait: "Photography, video and creative direction for hospitality and food & drink brands through Hospo Creative." },
  pt: { services: "Serviços", work: "Portfólio", video: "Vídeo", about: "Sobre", faq: "FAQ", contact: "Contacto", open: "Abrir menu", close: "Fechar menu", language: "English", portrait: "Fotografia, vídeo e direção criativa para hotelaria e restauração através da Hospo Creative." }
} as const;

export function TiagoBastosHero({ locale, eyebrow, title, intro, supporting, location, enquire, work }: Props) {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = labels[locale];
  const landingPath = "/tiago-bastos-commercial-photographer-videographer";
  const alternateLanguagePath = locale === "pt" ? landingPath : `/pt${landingPath}`;
  const links = [
    [nav.services, "#services"],
    [nav.work, "#work"],
    [nav.video, "#reels-gallery"],
    [nav.about, "#about"],
    [nav.faq, "#faq"]
  ] as const;

  return (
    <section className="relative overflow-hidden bg-[#062f5f] text-white">
      <header className="relative z-30 border-b border-white/15">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
          <a href="#top" className="font-serif text-2xl font-semibold tracking-tight">Tiago Bastos</a>
          <nav className="hidden items-center gap-7 text-xs font-bold uppercase tracking-[0.14em] lg:flex" aria-label="Tiago Bastos">
            {links.map(([label, href]) => <a key={href} href={href} className="text-white/75 transition hover:text-[#f5c342]">{label}</a>)}
            <Link href={alternateLanguagePath} hrefLang={locale === "pt" ? "en-GB" : "pt-PT"} className="text-white/60 transition hover:text-[#f5c342]">{nav.language}</Link>
            <Link href={localizedPath("/contact", locale)} className="rounded-full border border-[#f5c342] px-4 py-2 text-[#f5c342] transition hover:bg-[#f5c342] hover:text-[#062f5f]">{nav.contact}</Link>
          </nav>
          <button type="button" className="inline-flex p-2 text-[#f5c342] lg:hidden" aria-expanded={menuOpen} aria-label={menuOpen ? nav.close : nav.open} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <nav className="border-t border-white/15 bg-[#062f5f] px-6 py-5 sm:px-10 lg:hidden" aria-label="Tiago Bastos mobile">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block py-3 text-sm font-bold text-white/85">{label}</a>)}<Link href={alternateLanguagePath} hrefLang={locale === "pt" ? "en-GB" : "pt-PT"} className="block py-3 text-sm font-bold text-[#f5c342]">{nav.language}</Link><Link href={localizedPath("/contact", locale)} className="mt-3 inline-flex rounded-full bg-[#f5c342] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#062f5f]">{nav.contact}</Link></nav>}
      </header>

      <div id="top" className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl gap-11 px-6 py-14 sm:px-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:gap-14 lg:px-16 lg:py-12">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: "easeOut" }} className="relative z-10 max-w-2xl">
          <p className="text-xs font-bold tracking-[0.18em] text-[#f5c342]">{eyebrow}</p>
          <h1 className="mt-5 max-w-none font-serif text-[clamp(2.15rem,9vw,2.65rem)] leading-[0.98] tracking-tight sm:max-w-[17ch] sm:text-[clamp(2.8rem,5vw,3.5rem)] lg:max-w-[21ch] lg:text-[clamp(3.25rem,4vw,3.9rem)]">{title}</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/78">{intro}</p>
          {supporting ? <p className="mt-4 max-w-xl text-base leading-7 text-white/65">{supporting}</p> : null}
          <p className="mt-7 border-l-2 border-[#f5c342] pl-4 text-xs font-bold tracking-[0.16em] text-white/72">{location}</p>
          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row"><Link href={localizedPath("/contact", locale)} className="inline-flex items-center rounded-full bg-[#f5c342] px-6 py-3.5 text-sm font-bold text-[#062f5f] transition hover:bg-white">{enquire}<ArrowUpRight className="ml-2 h-4 w-4" /></Link><a href="#work" className="inline-flex items-center rounded-full border border-white/35 px-6 py-3.5 text-sm font-bold transition hover:border-white hover:bg-white/10">{work}<ArrowUpRight className="ml-2 h-4 w-4" /></a></div>
          <motion.div initial={reduceMotion ? false : { opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.32 }} className="mt-10 flex items-center gap-4"><div className="relative size-14 overflow-hidden rounded-full border-2 border-[#f5c342]"><SmartImage src="/images/about/Tiago.png" alt="Tiago Bastos" fill sizes="56px" className="object-cover" fallbackLabel="Tiago Bastos" /></div><p className="max-w-xs text-sm leading-5 text-white/72">{nav.portrait}</p></motion.div>
        </motion.div>

        <div className="relative hidden h-[clamp(31rem,43vw,40rem)] min-w-0 grid-cols-[minmax(0,1.35fr)_minmax(13rem,0.72fr)] grid-rows-2 gap-4 lg:grid" aria-label="Tiago Bastos commercial portfolio photography">
          <HeroImage image={homepageHeroImages[0]} priority delay={0.13} />
          <HeroImage image={homepageHeroImages[1]} delay={0.23} />
          <HeroImage image={homepageHeroImages[2]} delay={0.33} />
          <motion.span initial={reduceMotion ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, delay: 0.45 }} className="absolute -right-5 bottom-0 top-[18%] w-px origin-top bg-[#f5c342]" aria-hidden="true" />
        </div>
        <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75, delay: 0.1 }} className="relative aspect-[4/5] overflow-hidden rounded-lg lg:hidden"><SmartImage src={homepageHeroImages[0].src} alt={homepageHeroImages[0].alt} fill priority sizes="calc(100vw - 48px)" className="object-cover" fallbackLabel="Commercial photography" /></motion.div>
      </div>
    </section>
  );
}

function HeroImage({ image, priority = false, delay }: { image: { src: string; alt: string }; priority?: boolean; delay: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 1.03 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay, ease: "easeOut" }} className="group relative min-h-0 overflow-hidden rounded-lg shadow-2xl first:row-span-2"><SmartImage src={image.src} alt={image.alt} fill priority={priority} sizes="(min-width: 1024px) 38vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" fallbackLabel="Commercial photography" /></motion.div>;
}
