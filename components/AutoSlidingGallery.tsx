"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { SmartImage } from "./SmartImage";

type SlidingGalleryItem = {
  src: string;
  alt: string;
};

const labels = {
  en: {
    gallery: "Hospitality portfolio gallery",
    previous: "View previous images",
    next: "View next images",
    open: "Open image full screen",
    close: "Close full screen image"
  },
  pt: {
    gallery: "Galeria do portefólio de hotelaria",
    previous: "Ver imagens anteriores",
    next: "Ver imagens seguintes",
    open: "Abrir imagem em ecrã inteiro",
    close: "Fechar imagem em ecrã inteiro"
  }
} as const;

export function AutoSlidingGallery({ items, locale = "en" }: { items: SlidingGalleryItem[]; locale?: Locale }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [interacting, setInteracting] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const t = labels[locale];

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let previousTime = 0;
    const animate = (time: number) => {
      if (!previousTime) previousTime = time;
      const elapsed = Math.min(time - previousTime, 50);
      previousTime = time;

      if (!interacting) {
        scroller.scrollLeft += elapsed * 0.018;
        const loopPoint = scroller.scrollWidth / 2;
        if (scroller.scrollLeft >= loopPoint) scroller.scrollLeft -= loopPoint;
      }
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [interacting, items.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") setSelectedIndex((value) => value === null ? null : (value - 1 + items.length) % items.length);
      if (event.key === "ArrowRight") setSelectedIndex((value) => value === null ? null : (value + 1) % items.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items.length, selectedIndex]);

  function move(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * Math.min(scroller.clientWidth * 0.78, 520), behavior: "smooth" });
  }

  if (!items.length) return null;

  return (
    <div className="mt-10">
      <div className="mb-5 flex justify-end gap-2">
        <button type="button" onClick={() => move(-1)} aria-label={t.previous} className="flex size-11 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:border-yellow hover:bg-yellow">
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => move(1)} aria-label={t.next} className="flex size-11 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:border-yellow hover:bg-yellow">
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>

      <div
        ref={scrollerRef}
        role="region"
        aria-label={t.gallery}
        className="gallery-slider -mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8"
        onPointerEnter={() => setInteracting(true)}
        onPointerLeave={() => setInteracting(false)}
        onPointerDown={() => setInteracting(true)}
        onPointerUp={() => setInteracting(false)}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={() => setInteracting(false)}
      >
        <div className="flex w-max gap-4 pr-4 sm:gap-5 sm:pr-5">
          {[0, 1].map((setIndex) => (
            <div key={setIndex} aria-hidden={setIndex === 1 ? "true" : undefined} className="flex shrink-0 gap-4 sm:gap-5">
              {items.map((item, index) => (
                <button
                  type="button"
                  key={`${setIndex}-${item.src}`}
                  tabIndex={setIndex === 1 ? -1 : 0}
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`${t.open}: ${item.alt}`}
                  className="group relative aspect-[4/5] w-[72vw] max-w-[340px] shrink-0 cursor-zoom-in overflow-hidden rounded-[8px] bg-ink text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-4"
                >
                  <SmartImage src={item.src} alt={setIndex === 0 ? item.alt : ""} fill sizes="(min-width: 1280px) 21vw, (min-width: 1024px) 25vw, (min-width: 640px) 42vw, 72vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]" fallbackLabel={`Portfolio image ${index + 1}`} />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {selectedIndex !== null ? (
        <div role="dialog" aria-modal="true" aria-label={items[selectedIndex].alt} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedIndex(null); }} className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 sm:p-8">
          <button type="button" onClick={() => setSelectedIndex(null)} aria-label={t.close} className="absolute right-4 top-4 z-10 flex size-12 items-center justify-center rounded-full border border-white/30 bg-ink text-white transition hover:border-yellow hover:text-yellow sm:right-7 sm:top-7">
            <X size={22} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setSelectedIndex((selectedIndex - 1 + items.length) % items.length)} aria-label={t.previous} className="absolute left-3 z-10 flex size-11 items-center justify-center rounded-full border border-white/30 bg-ink/80 text-white transition hover:border-yellow hover:text-yellow sm:left-7 sm:size-12">
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <div className="relative h-[86vh] w-[min(88vw,1100px)]">
            <SmartImage src={items[selectedIndex].src} alt={items[selectedIndex].alt} fill sizes="90vw" className="object-contain" fallbackLabel={items[selectedIndex].alt} />
          </div>
          <button type="button" onClick={() => setSelectedIndex((selectedIndex + 1) % items.length)} aria-label={t.next} className="absolute right-3 z-10 flex size-11 items-center justify-center rounded-full border border-white/30 bg-ink/80 text-white transition hover:border-yellow hover:text-yellow sm:right-7 sm:size-12">
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
