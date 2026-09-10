"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { getHomepageContent } from "@/data/homepage";
import { translate, type Locale } from "@/lib/i18n";

function StatisticValue({ statistic }: { statistic: string }) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const hasAnimated = useRef(false);
  const match = statistic.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : null;
  const suffix = match?.[2] ?? "";
  const [value, setValue] = useState(target === null || reducedMotion ? target : 0);

  useEffect(() => {
    if (target === null || hasAnimated.current) return;

    let frame = 0;
    const startAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      if (reducedMotion) {
        setValue(target);
        return;
      }

      const startedAt = performance.now();
      const duration = 560;
      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const element = elementRef.current;
    if (!element || !("IntersectionObserver" in window)) {
      startAnimation();
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.55 }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion, target]);

  return <span ref={elementRef} aria-hidden="true">{target === null ? statistic : `${value ?? 0}${suffix}`}</span>;
}

export function DigitalPresenceStatistics({ locale = "en" }: { locale?: Locale }) {
  const content = getHomepageContent(locale).statistics;
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);

  const updatePosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 0);
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(maxScroll === 0 || track.scrollLeft >= maxScroll - 2);
    setProgress(maxScroll ? (track.scrollLeft / maxScroll) * 100 : 100);
  }, []);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [updatePosition]);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("[data-stat-card]");
    if (!track || !card) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || "0");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: reducedMotion ? "auto" : "smooth"
    });
  }

  return (
    <section className="overflow-hidden bg-ink px-5 pb-[var(--hc-section-compact)] pt-[var(--hc-section)] text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(20rem,0.48fr)] lg:items-end">
          <div>
            <p className="section-eyebrow text-yellow">{content.eyebrow}</p>
            <h2 className="mt-3 max-w-[52rem] font-serif text-[clamp(2.35rem,4.1vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.025em]">
              {content.title}
            </h2>
          </div>
          <p className="max-w-2xl text-[1.0625rem] leading-8 text-white/72 lg:pb-1">{content.body}</p>
        </div>

        <div className="mt-12">
          <div
            ref={trackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={translate(locale, "Digital presence statistics")}
            tabIndex={0}
            onScroll={updatePosition}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                move(-1);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                move(1);
              }
            }}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse") return;
              const track = event.currentTarget;
              dragRef.current = { active: true, startX: event.clientX, scrollLeft: track.scrollLeft };
              track.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!dragRef.current.active || event.pointerType !== "mouse") return;
              event.currentTarget.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
            }}
            onPointerUp={(event) => {
              dragRef.current.active = false;
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
            }}
            onPointerCancel={() => {
              dragRef.current.active = false;
            }}
            className="gallery-slider flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow sm:gap-5 lg:gap-6"
          >
            {content.cards.map((card, index) => (
              <article
                key={card.headline}
                data-stat-card
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} ${translate(locale, "of")} ${content.cards.length}`}
                className="flex min-h-[31rem] basis-[88%] shrink-0 snap-start flex-col rounded-[8px] bg-white p-7 text-ink sm:min-h-[30rem] sm:basis-[58%] sm:p-8 lg:basis-[36%] xl:basis-[31.5%]"
              >
                <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-ink/64">{card.category}</p>
                <p aria-label={card.statistic} className={`mt-7 font-serif font-semibold tracking-[-0.04em] text-ink ${card.statistic.length > 5 ? "text-[clamp(2.65rem,4.6vw,4.2rem)] leading-[0.9]" : "text-[clamp(3.7rem,6vw,5.8rem)] leading-[0.84]"}`}>
                  <StatisticValue statistic={card.statistic} />
                </p>
                <h3 className="mt-8 font-serif text-[1.8rem] font-semibold leading-[1.05]">{card.headline}</h3>
                <p className="mt-5 text-[0.98rem] leading-7 text-ink/72">{card.body}</p>
                <p className="mt-auto border-t border-ink/12 pt-6 text-[0.68rem] leading-5 text-ink/48">{card.source}</p>
              </article>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between gap-6">
            <div
              role="progressbar"
              aria-label={translate(locale, "Carousel progress")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              className="h-px max-w-sm flex-1 overflow-hidden bg-white/22"
            >
              <span
                className="block h-full bg-yellow transition-[width] duration-200 motion-reduce:transition-none"
                style={{ width: `${Math.max(progress, 4)}%` }}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => move(-1)}
                disabled={atStart}
                aria-label={translate(locale, "Previous statistics card")}
                className="grid size-11 place-items-center rounded-full border border-white/28 text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                disabled={atEnd}
                aria-label={translate(locale, "Next statistics card")}
                className="grid size-11 place-items-center rounded-full border border-white/28 text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
