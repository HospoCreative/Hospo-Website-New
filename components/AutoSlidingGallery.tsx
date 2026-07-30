"use client";

import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
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
    pause: "Pause gallery",
    play: "Play gallery"
  },
  pt: {
    gallery: "Galeria do portefólio de hotelaria",
    previous: "Ver imagens anteriores",
    next: "Ver imagens seguintes",
    pause: "Pausar galeria",
    play: "Reproduzir galeria"
  }
} as const;

export function AutoSlidingGallery({ items, locale = "en" }: { items: SlidingGalleryItem[]; locale?: Locale }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
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

      if (!paused && !interacting) {
        scroller.scrollLeft += elapsed * 0.028;
        const loopPoint = scroller.scrollWidth / 2;
        if (scroller.scrollLeft >= loopPoint) scroller.scrollLeft -= loopPoint;
      }
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [interacting, items.length, paused]);

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
        <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? t.play : t.pause} className="flex size-11 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:border-yellow hover:bg-yellow">
          {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
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
                <figure key={`${setIndex}-${item.src}`} className="group relative aspect-[4/5] w-[72vw] max-w-[340px] shrink-0 overflow-hidden rounded-[8px] bg-ink sm:w-[42vw] lg:w-[25vw] xl:w-[21vw]">
                  <SmartImage
                    src={item.src}
                    alt={setIndex === 0 ? item.alt : ""}
                    fill
                    sizes="(min-width: 1280px) 21vw, (min-width: 1024px) 25vw, (min-width: 640px) 42vw, 72vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]"
                    fallbackLabel={`Portfolio image ${index + 1}`}
                  />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
