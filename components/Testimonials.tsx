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
    <section className="overflow-hidden bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[minmax(0,0.7fr)_minmax(18rem,0.5fr)] md:items-end">
          <div>
            <p className="section-eyebrow text-yellow">{testimonials.eyebrow}</p>
            <h2 className="mt-3 max-w-3xl font-serif text-[clamp(2.35rem,4.1vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.025em]">
              {testimonials.title}
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-white/68 md:justify-self-end md:text-right">
            Trusted by teams who need their work to look as considered online as it feels in person.
          </p>
        </div>

        <div
          className="mt-11"
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
          <div className="overflow-hidden rounded-[8px] bg-white text-ink">
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
                  className="min-h-[31rem] w-full shrink-0 px-6 py-8 sm:min-h-[27rem] sm:px-12 sm:py-11 lg:min-h-[25rem] lg:px-20 lg:py-14"
                >
                  <Quote aria-hidden="true" className="size-11 fill-yellow text-yellow sm:size-14" strokeWidth={0} />
                  <blockquote className="mt-7 max-w-5xl font-serif text-[clamp(1.7rem,3.25vw,3rem)] font-semibold leading-[1.15] tracking-[-0.025em]">
                    <p>“{testimonial.quote}”</p>
                  </blockquote>
                  <footer className="mt-9 flex flex-col gap-1 border-l-2 border-yellow pl-4">
                    <cite className="not-italic text-lg font-bold text-ink">{testimonial.name}</cite>
                    <p className="max-w-2xl text-[0.7rem] font-black uppercase tracking-[0.14em] text-ink/62">{testimonial.title}</p>
                  </footer>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2" role="tablist" aria-label={t.carousel}>
              {testimonials.items.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`${index + 1} of ${total}: ${testimonial.name}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-4 focus-visible:ring-offset-ink ${index === activeIndex ? "w-8 bg-yellow" : "w-2 bg-white/35 hover:bg-white/65"}`}
                />
              ))}
            </div>
            <div className="flex gap-2 self-end sm:self-auto">
              <button type="button" onClick={showPrevious} aria-label={t.previous} className="grid size-11 place-items-center rounded-full border border-white/30 text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button type="button" onClick={showNext} aria-label={t.next} className="grid size-11 place-items-center rounded-full border border-white/30 text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
