"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { ClientLogo } from "@/types/clientLogo";
import { Reveal } from "@/components/Reveal";

type ClientLogosSectionProps = {
  logos: ClientLogo[];
};

export function ClientLogosSection({ logos }: ClientLogosSectionProps) {
  const reduceMotion = useReducedMotion();
  const publishedLogos = logos
    .filter((logo) => logo.published && logo.logoUrl)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (!publishedLogos.length) {
    return null;
  }

  return (
    <section
      className="border-t border-white/10 bg-ink px-5 py-12 text-white sm:px-8 lg:py-14"
      aria-labelledby="client-logos-title"
    >
      <Reveal className="mx-auto max-w-7xl">
        <div className="max-w-5xl">
          <span className="mb-5 block h-1 w-12 bg-yellow" aria-hidden="true" />
          <p className="section-eyebrow text-yellow">Clients &amp; partners</p>
          <h2
            id="client-logos-title"
            className="max-w-4xl font-serif text-[clamp(1.8rem,3.2vw,2.8rem)] font-semibold leading-[1.05]"
          >
            Hospitality brands we have supported.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 items-center gap-x-10 gap-y-9 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-14 lg:gap-y-10">
          {publishedLogos.map((logo, index) => (
            <motion.div
              key={`${logo.clientName}-${logo.logoUrl}`}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.42, delay: index * 0.06, ease: "easeOut" }}
              className="flex h-24 items-center justify-center sm:h-28 lg:h-32"
            >
              <Image
                src={logo.logoUrl}
                alt={logo.alt || `${logo.clientName} logo`}
                width={240}
                height={120}
                sizes="(min-width: 1024px) 200px, (min-width: 640px) 28vw, 42vw"
                className="h-auto max-h-[78%] w-auto max-w-full object-contain opacity-90 transition duration-500 hover:scale-105 hover:opacity-100"
              />
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
