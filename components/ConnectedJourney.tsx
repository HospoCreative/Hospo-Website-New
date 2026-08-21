"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { translate, type Locale } from "@/lib/i18n";

export type JourneyStage = { title: string; action: string; support: string };

export function ConnectedJourney({ locale, stages }: { locale: Locale; stages: JourneyStage[] }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const stage = stages[active];

  return (
    <section className="overflow-hidden bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="section-eyebrow text-yellow">{translate(locale, "One connected guest journey")}</p>
        <h2 className="mt-5 max-w-3xl font-serif text-[clamp(2.35rem,4vw,4rem)] font-semibold leading-[0.98]">{translate(locale, "Every touchpoint should support the next step.")}</h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-center">
          <div className="relative">
            <div className="absolute left-4 right-4 top-5 hidden h-px bg-white/25 lg:block" />
            <motion.div aria-hidden="true" className="absolute left-4 top-5 hidden h-px bg-yellow lg:block" initial={reduced ? false : { width: 0 }} whileInView={{ width: `${(active / Math.max(stages.length - 1, 1)) * 100}%` }} transition={{ duration: reduced ? 0 : .45 }} />
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7 lg:gap-2" aria-label={translate(locale, "Guest journey stages")}>
              {stages.map((item, index) => <li key={item.title}>
                <button type="button" onClick={() => setActive(index)} className={`group relative z-10 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow ${active === index ? "text-white" : "text-white/55 hover:text-white"}`} aria-pressed={active === index}>
                  <span className={`mb-3 block h-10 w-10 rounded-full border-2 p-1 ${active === index ? "border-yellow bg-yellow text-ink" : "border-white/35"}`}><span className="flex h-full w-full items-center justify-center rounded-full border border-current text-[.62rem] font-black">{index + 1}</span></span>
                  <span className="block text-[.64rem] font-black uppercase leading-4 tracking-[.12em]">{translate(locale, item.title)}</span>
                </button>
              </li>)}
            </ol>
          </div>
          <motion.div key={stage.title} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .32 }} className="border-l-2 border-yellow bg-white/[.06] p-6">
            <p className="section-eyebrow text-yellow">{translate(locale, stage.title)}</p>
            <p className="mt-4 text-xl font-semibold leading-8">{translate(locale, stage.action)}</p>
            <div className="mt-5 flex gap-3 text-sm leading-7 text-white/72"><ArrowRight className="mt-1 shrink-0 text-yellow" size={16} aria-hidden="true" /><p>{translate(locale, stage.support)}</p></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
