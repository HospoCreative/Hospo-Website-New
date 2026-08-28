"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { SmartImage } from "./SmartImage";

type GalleryItem = { src: string; alt: string };

const labels = {
  en: { gallery: "Hospo Creative visual storytelling gallery", open: "Open image full screen", close: "Close full screen image", previous: "View previous image", next: "View next image", previousSet: "View previous gallery images", nextSet: "View next gallery images" },
  pt: { gallery: "Galeria de narrativa visual da Hospo Creative", open: "Abrir imagem em ecrã inteiro", close: "Fechar imagem em ecrã inteiro", previous: "Ver imagem anterior", next: "Ver imagem seguinte", previousSet: "Ver imagens anteriores da galeria", nextSet: "Ver imagens seguintes da galeria" }
} as const;

function groupIntoSets(items: GalleryItem[], size = 12) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));
}

export function MosaicGallery({ items, locale = "en" }: { items: GalleryItem[]; locale?: Locale }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const openerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousSelection = useRef<number | null>(null);
  const t = labels[locale];
  const sets = groupIntoSets(items);

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

  const move = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth, behavior: "smooth" });
  };

  return (
    <>
      <div role="region" aria-label={t.gallery} className="mt-10">
        <div className="relative">
          <div ref={scrollerRef} className="gallery-slider flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sets.map((set, setIndex) => (
              <div key={setIndex} className="grid min-w-[88vw] snap-start grid-cols-2 gap-3 sm:min-w-full sm:grid-cols-4 sm:grid-rows-3 sm:gap-4">
                {set.map((item, index) => {
                  const imageIndex = setIndex * 12 + index;
                  return <button key={item.src} type="button" ref={(element) => { openerRefs.current[imageIndex] = element; }} onClick={() => setSelectedIndex(imageIndex)} aria-label={`${t.open}: ${item.alt}`} className="group relative aspect-[4/5] overflow-hidden rounded-[8px] bg-ink text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-4"><SmartImage src={item.src} alt={item.alt} fill sizes="(min-width: 640px) 23vw, 41vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]" fallbackLabel={item.alt} /></button>;
                })}
              </div>
            ))}
          </div>
          {sets.length > 1 ? <><button type="button" onClick={() => move(-1)} aria-label={t.previousSet} className="absolute left-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-ink/80 text-white shadow-lg backdrop-blur transition hover:border-yellow hover:bg-yellow hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow sm:flex"><ArrowLeft size={19} aria-hidden="true" /></button><button type="button" onClick={() => move(1)} aria-label={t.nextSet} className="absolute right-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-ink/80 text-white shadow-lg backdrop-blur transition hover:border-yellow hover:bg-yellow hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow sm:flex"><ArrowRight size={19} aria-hidden="true" /></button></> : null}
        </div>
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
