"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { SmartImage } from "./SmartImage";

const images = [
  "/images/gallery/1.9.jpg",
  "/images/gallery/0.3_Food%20Restaurante%20Hospo%20Creative.jpg",
  "/images/gallery/1.5.jpg",
  "/images/gallery/1.1.jpg",
  "/images/gallery/Bar%20Hotel%20hospo%20creative.jpg"
];

const copy = {
  en: { label: "Selected hospitality work", previous: "Show previous image", next: "Show next image" },
  pt: { label: "Trabalho selecionado em hotelaria", previous: "Ver imagem anterior", next: "Ver imagem seguinte" }
} as const;

export function HeroGalleryCarousel({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const reduceMotion = useReducedMotion();
  const t = copy[locale];
  const go = (nextDirection: -1 | 1) => {
    setDirection(nextDirection);
    setActive((current) => (current + nextDirection + images.length) % images.length);
  };
  const imageAt = (offset: number) => images[(active + offset + images.length) % images.length];

  return (
    <section aria-label={t.label} className="relative mx-auto h-[21rem] w-full max-w-[39rem] sm:h-[28rem] lg:h-[min(66vh,42rem)]">
      <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { x: direction * 8, rotate: direction * 0.5 }} transition={{ type: "spring", stiffness: 180, damping: 24 }} className="absolute inset-y-[8%] right-[2%] w-[68%] overflow-hidden rounded-[8px] opacity-30"><SmartImage key={imageAt(2)} src={imageAt(2)} alt="" fill sizes="(min-width: 1024px) 28vw, 68vw" className="object-cover" /></motion.div>
      <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { x: direction * -8, rotate: direction * -0.5 }} transition={{ type: "spring", stiffness: 180, damping: 24 }} className="absolute inset-y-[4%] left-[1%] w-[72%] overflow-hidden rounded-[8px] opacity-50"><SmartImage key={imageAt(1)} src={imageAt(1)} alt="" fill sizes="(min-width: 1024px) 30vw, 72vw" className="object-cover" /></motion.div>
      <motion.div drag={reduceMotion ? false : "x"} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} onDragEnd={(_, info) => { if (info.offset.x < -45 || info.velocity.x < -300) go(1); if (info.offset.x > 45 || info.velocity.x > 300) go(-1); }} className="absolute inset-y-0 left-[9%] z-10 w-[76%] cursor-grab overflow-hidden rounded-[8px] border border-white/25 bg-[#052f61] shadow-editorial active:cursor-grabbing"><AnimatePresence initial={false} custom={direction} mode="popLayout"><motion.div key={imageAt(0)} custom={direction} initial={reduceMotion ? false : { opacity: 0, x: direction * 56, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, x: direction * -56, scale: 1.02 }} transition={{ duration: 0.32, ease: "easeOut" }} className="absolute inset-0"><SmartImage src={imageAt(0)} alt={t.label} fill sizes="(min-width: 1024px) 32vw, 76vw" className="object-cover" /></motion.div></AnimatePresence></motion.div>
      <div className="absolute bottom-4 left-[13%] z-20 flex items-center gap-2"><button type="button" onClick={() => go(-1)} aria-label={t.previous} className="flex size-10 items-center justify-center rounded-full border border-white/35 bg-ink/80 text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"><ArrowLeft size={17} aria-hidden="true" /></button><button type="button" onClick={() => go(1)} aria-label={t.next} className="flex size-10 items-center justify-center rounded-full border border-white/35 bg-ink/80 text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"><ArrowRight size={17} aria-hidden="true" /></button></div>
      <p className="absolute bottom-5 right-[13%] z-20 text-[0.63rem] font-black uppercase tracking-[0.16em] text-white/75">{String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</p>
    </section>
  );
}
