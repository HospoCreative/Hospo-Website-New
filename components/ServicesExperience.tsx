"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { services } from "@/data/services";
import { siteContent } from "@/data/site";
import { SmartImage } from "./SmartImage";

export function ServicesExperience() {
  const { services: servicesContent } = siteContent;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = services[activeIndex];

  return (
    <section
      id="services"
      className="border-t border-white/10 bg-ink px-5 py-20 text-white sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-6xl">
          <p className="section-eyebrow text-yellow">{servicesContent.eyebrow}</p>
          <h2 className="mt-5 font-serif text-[clamp(2.55rem,9vw,5.2rem)] font-semibold leading-[0.98]">
            {servicesContent.title}
          </h2>
          <p className="mt-7 max-w-4xl text-xl leading-9 text-white/76 sm:text-2xl sm:leading-10">
            {servicesContent.body}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(270px,0.36fr)_minmax(0,1fr)] lg:items-start">
          <div className="rounded-[8px] border border-white/12 bg-white/[0.035] p-2 lg:sticky lg:top-28">
            <div className="max-h-[42rem] space-y-2 overflow-y-auto pr-1 [scrollbar-color:rgba(255,255,255,0.34)_transparent] [scrollbar-width:thin] lg:max-h-[68vh]">
              {services.map((service, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={service.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className={`group flex min-h-16 w-full items-center justify-between gap-4 rounded-[7px] border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow ${
                      isActive
                        ? "border-yellow bg-white/[0.1] text-white shadow-soft"
                        : "border-white/10 text-white/62 hover:border-white/30 hover:bg-white/[0.04] hover:text-white"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="font-serif text-[clamp(1.2rem,4.5vw,1.7rem)] font-semibold leading-tight">
                      {service.title}
                    </span>
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full border text-[0.72rem] font-black transition ${
                        isActive
                          ? "border-yellow text-yellow"
                          : "border-white/16 text-white/36 group-hover:border-white/34"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeService.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.34, ease: "easeOut" }}
                className="grid overflow-hidden rounded-[8px] border border-white/14 bg-white/[0.06] shadow-soft backdrop-blur-sm lg:min-h-[68vh] lg:grid-cols-[minmax(0,0.88fr)_minmax(360px,0.82fr)]"
              >
                <div className="p-5 sm:p-7 lg:p-8">
                  <p className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-yellow">
                    Client challenge
                  </p>
                  <p className="mt-4 max-w-2xl text-xl leading-8 text-white sm:text-2xl sm:leading-9">
                    {activeService.challenge}
                  </p>

                  <p className="mt-7 text-[0.7rem] font-black uppercase tracking-[0.22em] text-white/48">
                    How Hospo helps
                  </p>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-white/76">
                    {activeService.how}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {activeService.support.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/16 px-3 py-1.5 text-[0.67rem] font-black uppercase tracking-[0.15em] text-white/72"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="mt-8 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
                  >
                    Enquire about this service
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </a>
                </div>

                <div className="relative min-h-[360px] bg-ink lg:min-h-full">
                  <SmartImage
                    src={activeService.image.src}
                    alt={activeService.image.alt}
                    fill
                    sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 90vw"
                    className="object-cover"
                    fallbackLabel={activeService.title}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,44,93,0.0),rgba(0,44,93,0.25))]" />
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
