"use client";

import { motion, useReducedMotion } from "framer-motion";
import { homepageContent } from "@/data/homepage";
import { SectionHeading } from "./SectionHeading";

export function MarketingJourney() {
  const content = homepageContent.journey;
  const reduceMotion = useReducedMotion();
  return (
    <section id="guest-journey" className="bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading tone="light" eyebrow={content.eyebrow} title={content.title} body={content.body} width="wide" />
        <div className="relative mt-12">
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-white/18 md:bottom-auto md:left-0 md:right-0 md:top-[7px] md:h-px md:w-auto" aria-hidden="true" />
          <motion.div
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1 }}
            className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-yellow md:hidden"
            aria-hidden="true"
          />
          <motion.div
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1 }}
            className="absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-yellow md:block"
            aria-hidden="true"
          />
          <ol className="grid gap-7 pl-8 md:grid-cols-5 md:gap-5 md:pl-0 md:pt-0">
            {content.stages.map((stage, index) => (
              <motion.li key={stage.title} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.45, delay: index * 0.08 }} className="relative md:pt-8">
                <span className="absolute -left-[1.95rem] top-1 size-3.5 rounded-full border-2 border-yellow bg-ink md:left-0 md:top-0" aria-hidden="true" />
                <h3 className="font-serif text-2xl font-semibold">{stage.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-6 text-white/68">{stage.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
