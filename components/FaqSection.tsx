"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { getHomepageContent } from "@/data/homepage";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

export function FaqSection({ locale = "en" }: { locale?: Locale }) {
  const content = getHomepageContent(locale).faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="bg-white px-5 py-[var(--hc-section-compact)] text-ink sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
        <SectionHeading eyebrow={content.eyebrow} title={content.title} />
        <div className="border-t border-ink/18">
          {content.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `faq-panel-${index}`;
            return (
              <div key={item.question} className="border-b border-ink/18">
                <button type="button" onClick={() => setOpenIndex(open ? null : index)} aria-expanded={open} aria-controls={panelId} className="flex min-h-16 w-full items-center justify-between gap-5 py-4 text-left font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
                  <span>{item.question}</span><ChevronDown aria-hidden="true" size={19} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                <div id={panelId} hidden={!open} className="pb-5 pr-10 text-base leading-7 text-ink/68">{item.answer}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
