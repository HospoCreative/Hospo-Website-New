"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { homepageContent } from "@/data/homepage";
import { SmartImage } from "./SmartImage";

type HeroProps = { hero: typeof homepageContent.hero };

export function HeroClient({ hero }: HeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="relative overflow-hidden bg-ink text-white">
      <div className="page-container grid min-h-[calc(100svh-4.5rem)] gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-14 lg:py-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-[42rem]"
        >
          <p className="section-eyebrow text-yellow">{hero.eyebrow}</p>
          <h1 className="mt-4 text-balance font-serif text-[2.7rem] font-semibold leading-[0.96] tracking-[-0.035em] sm:text-[3.25rem] lg:text-[clamp(3.5rem,4.5vw,4.35rem)]">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-[39rem] text-[1.0625rem] leading-8 text-white/78 sm:text-lg">
            {hero.body}
          </p>
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row">
            <a href="#digital-review" className="button-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
              {hero.primaryCta}<ArrowUpRight aria-hidden="true" size={17} />
            </a>
            <a href="#work" className="button-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
              {hero.secondaryCta}<ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </div>
          <p className="mt-6 border-l border-yellow pl-4 text-sm leading-6 text-white/60">{hero.note}</p>
        </motion.div>

        <div className="relative hidden h-[clamp(31rem,42vw,39rem)] lg:block" aria-label="Hospo Creative hospitality photography">
          <div className="absolute left-0 top-[6%] h-[88%] w-[67%]">
            <HeroImage image={hero.images[0]} priority delay={0.12} />
          </div>
          <div className="absolute right-0 top-0 h-[42%] w-[36%]">
            <HeroImage image={hero.images[1]} delay={0.22} />
          </div>
          <div className="absolute bottom-[2%] right-[3%] h-[42%] w-[31%]">
            <HeroImage image={hero.images[2]} delay={0.32} />
          </div>
          <motion.span
            initial={reduceMotion ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="absolute -right-5 bottom-0 top-[24%] w-px origin-top bg-yellow"
            aria-hidden="true"
          />
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="relative aspect-[4/5] overflow-hidden rounded-[8px] lg:hidden"
        >
          <SmartImage src={hero.images[0].src} alt={hero.images[0].alt} fill priority sizes="calc(100vw - 40px)" className="object-cover object-center" fallbackLabel="Hospitality photography" />
        </motion.div>
      </div>
    </section>
  );
}

function HeroImage({ image, priority = false, delay }: { image: { src: string; alt: string }; priority?: boolean; delay: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 1.03 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className="group relative h-full overflow-hidden rounded-[8px] shadow-soft"
    >
      <SmartImage src={image.src} alt={image.alt} fill priority={priority} sizes="(min-width: 1024px) 38vw, 90vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]" fallbackLabel="Hospitality photography" />
    </motion.div>
  );
}
