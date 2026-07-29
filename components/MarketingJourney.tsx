"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export function MarketingJourney() {
  const reduceMotion = useReducedMotion();
  const stages = [
    { title: "Get discovered", channels: "Social media, photography, video and Google Search" },
    { title: "Build interest", channels: "Campaigns, Reels, advertising and reviews" },
    { title: "Earn trust", channels: "Website, menus, room pages, OTA listings and landing pages" },
    { title: "Drive bookings", channels: "Reservation journeys, enquiry pages and direct booking links" },
    { title: "Bring guests back", channels: "Email marketing, remarketing and guest communication" }
  ];

  return (
    <section id="approach" className="border-t border-ink/10 bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="page-container grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="An integrated approach"
            title="Turn every guest touchpoint into one connected journey."
            body="Guests rarely move directly from seeing your business to making a booking. They discover, compare, return and build trust across several channels. We help those touchpoints work together as one clear and consistent brand experience."
          />
          <p className="mt-8 border-l-2 border-yellow pl-4 text-sm font-semibold leading-7 text-ink/70">
            We make every touchpoint feel like part of the same brand.
          </p>
          <a href="#contact" className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-ink transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
            Discuss your guest journey <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="relative pl-7 sm:pl-9">
          <div className="absolute bottom-5 left-2 top-5 w-px bg-ink/20 sm:left-3" aria-hidden="true" />
          <motion.div
            className="absolute left-2 top-5 h-[calc(100%-2.5rem)] w-px origin-top bg-yellow sm:left-3"
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            aria-hidden="true"
          />
          <ol className="space-y-3">
            {stages.map((stage, index) => (
              <motion.li
                key={stage.title}
                initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                className="group relative border border-ink/10 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-yellow hover:shadow-soft sm:p-5"
              >
                <span className="absolute -left-[1.82rem] top-6 size-3.5 rounded-full border-2 border-yellow bg-white sm:-left-[1.9rem]" aria-hidden="true" />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="font-serif text-2xl font-semibold leading-tight sm:text-[1.75rem]">{stage.title}</h3>
                  <p className="max-w-[30rem] text-sm leading-6 text-ink/65">{stage.channels}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
