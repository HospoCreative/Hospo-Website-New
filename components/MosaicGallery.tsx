"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { SmartImage } from "./SmartImage";

type MosaicGalleryItem = {
  src: string;
  alt: string;
};

const labels = {
  en: {
    gallery: "Hospo Creative visual storytelling gallery",
    open: "Open image full screen",
    close: "Close full screen image",
    previous: "View previous image",
    next: "View next image"
  },
  pt: {
    gallery: "Galeria de narrativa visual da Hospo Creative",
    open: "Abrir imagem em ecrã inteiro",
    close: "Fechar imagem em ecrã inteiro",
    previous: "Ver imagem anterior",
    next: "Ver imagem seguinte"
  }
} as const;

const mosaicClasses = [
  "col-span-2 row-span-2 aspect-square",
  "aspect-[4/5]",
  "aspect-[4/5]",
  "col-span-2 aspect-[16/10]",
  "aspect-[4/5]",
  "aspect-square",
  "col-span-2 row-span-2 aspect-square",
  "aspect-[4/5]",
  "aspect-[4/5]",
  "col-span-2 aspect-[16/10]"
];

export function MosaicGallery({ items, locale = "en" }: { items: MosaicGalleryItem[]; locale?: Locale }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const t = labels[locale];

  useEffect(() => {
    if (selectedIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") setSelectedIndex((value) => value === null ? null : (value - 1 + items.length) % items.length);
      if (event.key === "ArrowRight") setSelectedIndex((value) => value === null ? null : (value + 1) % items.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [items.length, selectedIndex]);

  if (!items.length) return null;

  return (
    <>
      <div role="region" aria-label={t.gallery} className="mt-10 grid grid-cols-2 auto-rows-[minmax(8rem,15vw)] gap-3 sm:grid-cols-4 sm:gap-4">
        {items.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`${t.open}: ${item.alt}`}
            className={`group relative overflow-hidden rounded-[8px] bg-ink text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-4 ${mosaicClasses[index % mosaicClasses.length]}`}
          >
            <SmartImage src={item.src} alt={item.alt} fill sizes="(min-width: 1280px) 22vw, (min-width: 640px) 28vw, 46vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" fallbackLabel={item.alt} />
          </button>
        ))}
      </div>

      {selectedIndex !== null ? (
        <div role="dialog" aria-modal="true" aria-label={items[selectedIndex].alt} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedIndex(null); }} className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 sm:p-8">
          <button type="button" onClick={() => setSelectedIndex(null)} aria-label={t.close} className="absolute right-4 top-4 z-10 flex size-12 items-center justify-center rounded-full border border-white/30 bg-ink text-white transition hover:border-yellow hover:text-yellow sm:right-7 sm:top-7"><X size={22} aria-hidden="true" /></button>
          <button type="button" onClick={() => setSelectedIndex((selectedIndex - 1 + items.length) % items.length)} aria-label={t.previous} className="absolute left-3 z-10 flex size-11 items-center justify-center rounded-full border border-white/30 bg-ink/80 text-white transition hover:border-yellow hover:text-yellow sm:left-7 sm:size-12"><ArrowLeft size={20} aria-hidden="true" /></button>
          <div className="relative h-[86vh] w-[min(88vw,1100px)]"><SmartImage src={items[selectedIndex].src} alt={items[selectedIndex].alt} fill sizes="90vw" className="object-contain" fallbackLabel={items[selectedIndex].alt} /></div>
          <button type="button" onClick={() => setSelectedIndex((selectedIndex + 1) % items.length)} aria-label={t.next} className="absolute right-3 z-10 flex size-11 items-center justify-center rounded-full border border-white/30 bg-ink/80 text-white transition hover:border-yellow hover:text-yellow sm:right-7 sm:size-12"><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      ) : null}
    </>
  );
}
