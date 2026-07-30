"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { services } from "@/data/services";
import { siteContent } from "@/data/site";
import { SmartImage } from "./SmartImage";
import { SectionHeading } from "./SectionHeading";

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
        <SectionHeading tone="light" width="wide" eyebrow={servicesContent.eyebrow} title="Marketing support that makes your business easier to find, trust and choose." body={servicesContent.body} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(270px,0.36fr)_minmax(0,1fr)] lg:items-start">
          <div className="border-y border-white/12 py-1 lg:sticky lg:top-28">
            <div className="space-y-0">
              {services.map((service, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={service.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className={`group flex min-h-14 w-full items-center justify-between gap-4 border-b border-white/10 px-2 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow ${
                      isActive
                        ? "text-white"
                        : "text-white/55 hover:text-white"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="font-serif text-[clamp(1.05rem,2vw,1.35rem)] font-semibold leading-tight">
                      {service.title}
                    </span>
                    <span
                      className={`size-2.5 shrink-0 rounded-full transition ${
                        isActive ? "bg-yellow" : "bg-white/25 group-hover:bg-white/60"
                      }`}
                      aria-hidden="true"
                    />
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
                className="grid overflow-hidden border border-white/14 bg-white/[0.06] shadow-soft backdrop-blur-sm lg:min-h-[30rem] lg:grid-cols-[minmax(0,0.88fr)_minmax(300px,0.82fr)]"
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
