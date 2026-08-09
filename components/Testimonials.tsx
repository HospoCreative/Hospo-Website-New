"use client";

import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { getHomepageContent } from "@/data/homepage";
import type { Locale } from "@/lib/i18n";

const labels = {
  en: {
    carousel: "Client testimonials",
    previous: "Show previous testimonial",
    next: "Show next testimonial",
    slide: "testimonial"
  },
  pt: {
    carousel: "Testemunhos de clientes",
    previous: "Mostrar testemunho anterior",
    next: "Mostrar testemunho seguinte",
    slide: "testemunho"
  }
} as const;

export function Testimonials({ locale = "en" }: { locale?: Locale }) {
  const testimonials = getHomepageContent(locale).testimonials;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const t = labels[locale];
  const total = testimonials.items.length;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setIsReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (isPaused || isReducedMotion || total < 2) return;
    const interval = window.setInterval(() => setActiveIndex((current) => (current + 1) % total), 8500);
    return () => window.clearInterval(interval);
  }, [isPaused, isReducedMotion, total]);

  const showPrevious = () => setActiveIndex((current) => (current - 1 + total) % total);
  const showNext = () => setActiveIndex((current) => (current + 1) % total);

  return (
    <section className="overflow-hidden bg-white px-5 py-[var(--hc-section-compact)] text-ink sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div
          className="border-y border-ink/15 py-8 sm:py-10"
          role="region"
          aria-roledescription="carousel"
          aria-label={t.carousel}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
          }}
          onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
          onTouchEnd={(event) => {
            const startedAt = touchStart;
            const endedAt = event.changedTouches[0]?.clientX;
            setTouchStart(null);
            if (startedAt === null || endedAt === undefined || Math.abs(endedAt - startedAt) < 45) return;
            if (endedAt < startedAt) showNext(); else showPrevious();
          }}
        >
          <div className="overflow-hidden text-ink">
            <div
              className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.items.map((testimonial, index) => (
                <article
                  key={testimonial.name}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${total}: ${t.slide}`}
                  aria-hidden={index !== activeIndex}
                  className="flex min-h-[20rem] w-full shrink-0 flex-col justify-center px-1 py-1 text-center sm:min-h-[21rem] sm:px-8"
                >
                  <p className="section-eyebrow text-yellow">{testimonials.eyebrow}</p>
                  <Quote aria-hidden="true" className="mx-auto mt-3 size-7 fill-yellow text-yellow sm:size-8" strokeWidth={0} />
                  <blockquote className="mx-auto mt-4 max-w-4xl font-sans text-[clamp(1.05rem,1.7vw,1.35rem)] font-normal leading-[1.52] tracking-[-0.015em] text-ink/90">
                    <p>“{testimonial.quote}”</p>
                  </blockquote>
                  <footer className="mt-6 flex flex-col gap-1">
                    <cite className="not-italic text-sm font-bold text-ink sm:text-base">{testimonial.name}</cite>
                    <p className="mx-auto max-w-2xl text-[0.62rem] font-black uppercase tracking-[0.14em] text-ink/58 sm:text-[0.67rem]">{testimonial.title}</p>
                  </footer>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-7 flex items-center justify-center gap-5">
            <button type="button" onClick={showPrevious} aria-label={t.previous} className="grid size-9 place-items-center rounded-full border border-ink/20 text-ink transition hover:border-yellow hover:bg-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
              <ArrowLeft size={16} aria-hidden="true" />
            </button>
            <div className="flex gap-2" role="tablist" aria-label={t.carousel}>
              {testimonials.items.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`${index + 1} of ${total}: ${testimonial.name}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-4 focus-visible:ring-offset-white ${index === activeIndex ? "w-7 bg-yellow" : "w-1.5 bg-ink/28 hover:bg-ink/55"}`}
                />
              ))}
            </div>
            <button type="button" onClick={showNext} aria-label={t.next} className="grid size-9 place-items-center rounded-full border border-ink/20 text-ink transition hover:border-yellow hover:bg-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
