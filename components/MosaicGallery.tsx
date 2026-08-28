"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { SmartImage } from "./SmartImage";

type MosaicGalleryItem = { src: string; alt: string };

const labels = {
  en: { gallery: "Hospo Creative visual storytelling gallery", open: "Open image full screen", close: "Close full screen image", previous: "View previous image", next: "View next image" },
  pt: { gallery: "Galeria de narrativa visual da Hospo Creative", open: "Abrir imagem em ecrã inteiro", close: "Fechar imagem em ecrã inteiro", previous: "Ver imagem anterior", next: "Ver imagem seguinte" }
} as const;

export function MosaicGallery({ items, locale = "en" }: { items: MosaicGalleryItem[]; locale?: Locale }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const openerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousSelection = useRef<number | null>(null);
  const t = labels[locale];

  useEffect(() => {
    if (selectedIndex === null) {
      if (previousSelection.current !== null) openerRefs.current[previousSelection.current]?.focus();
      return;
    }
    previousSelection.current = selectedIndex;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") setSelectedIndex((value) => value === null ? null : (value - 1 + items.length) % items.length);
      if (event.key === "ArrowRight") setSelectedIndex((value) => value === null ? null : (value + 1) % items.length);
    };
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [items.length, selectedIndex]);

  if (!items.length) return null;

  const reveal = (verticalOffset: number, delay: number) => reduceMotion ? {} : {
    initial: { clipPath: "inset(8% 0 0 0)", opacity: 0.72, y: verticalOffset, scale: 1.04 },
    whileInView: { clipPath: "inset(0% 0 0 0)", opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.38 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const }
  };

  const imageButton = (item: MosaicGalleryItem, index: number, className: string, offset: number, delay: number) => (
    <motion.button
      key={item.src}
      type="button"
      ref={(element) => { openerRefs.current[index] = element; }}
      onClick={() => setSelectedIndex(index)}
      aria-label={`${t.open}: ${item.alt}`}
      className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-[8px] bg-ink text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-4 ${className}`}
      {...reveal(offset, delay)}
    >
      <SmartImage src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 42vw, (min-width: 768px) 46vw, 86vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" fallbackLabel={item.alt} />
    </motion.button>
  );

  return (
    <>
      <div role="region" aria-label={t.gallery} className="mt-10">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:h-[440px] md:grid-cols-5 md:grid-rows-2 md:overflow-visible lg:h-[520px] lg:gap-4">
          {imageButton(items[0], 0, "aspect-[4/5] w-[86vw] max-w-[31rem] shrink-0 snap-center md:col-span-3 md:row-span-2 md:h-full md:w-auto md:max-w-none", -14, 0)}
          {items.slice(1, 3).map((item, index) => imageButton(item, index + 1, "aspect-[4/5] w-[86vw] max-w-[31rem] shrink-0 snap-center md:col-span-2 md:h-full md:w-auto md:max-w-none", index === 0 ? 14 : -10, 0.12 + index * 0.08))}
        </div>
        <p className="mt-3 text-right text-[0.65rem] font-black uppercase tracking-[0.16em] text-ink/52 md:hidden">01 / {String(Math.min(items.length, 3)).padStart(2, "0")}</p>
      </div>

      {selectedIndex !== null ? (
        <div role="dialog" aria-modal="true" aria-label={items[selectedIndex].alt} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedIndex(null); }} className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 sm:p-8">
          <button ref={closeRef} type="button" onClick={() => setSelectedIndex(null)} aria-label={t.close} className="absolute right-4 top-4 z-10 flex size-12 items-center justify-center rounded-full border border-white/30 bg-ink text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow sm:right-7 sm:top-7"><X size={22} aria-hidden="true" /></button>
          <button type="button" onClick={() => setSelectedIndex((selectedIndex - 1 + items.length) % items.length)} aria-label={t.previous} className="absolute left-3 z-10 flex size-11 items-center justify-center rounded-full border border-white/30 bg-ink/80 text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow sm:left-7 sm:size-12"><ArrowLeft size={20} aria-hidden="true" /></button>
          <p className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[0.65rem] font-black tracking-[0.16em] text-white/72">{String(selectedIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</p>
          <div className="relative h-[86vh] w-[min(88vw,1100px)]"><SmartImage src={items[selectedIndex].src} alt={items[selectedIndex].alt} fill sizes="90vw" className="object-contain" fallbackLabel={items[selectedIndex].alt} /></div>
          <button type="button" onClick={() => setSelectedIndex((selectedIndex + 1) % items.length)} aria-label={t.next} className="absolute right-3 z-10 flex size-11 items-center justify-center rounded-full border border-white/30 bg-ink/80 text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow sm:right-7 sm:size-12"><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      ) : null}
    </>
  );
}
