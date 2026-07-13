"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ForkKnife } from "lucide-react";
import { useRef } from "react";
import { siteContent } from "@/data/site";
import { SmartImage } from "./SmartImage";

type HeroImage = {
  src: string;
  alt: string;
};

type HeroClientProps = {
  hero: typeof siteContent.hero;
  backgroundImage: HeroImage;
  galleryImages: readonly HeroImage[];
};

const heroGalleryLayout = [
  "col-span-7 row-span-2 aspect-[4/5]",
  "col-span-5 aspect-[5/4]",
  "col-span-3 aspect-[4/5]",
  "col-span-2 aspect-square"
];

function renderHeroTitle(title: string) {
  if (title === "Hospitality marketing that turns attention into action.") {
    return (
      <>
        Hospitality marketing
        <br />
        that turns attention
        <br />
        into action.
      </>
    );
  }

  return title;
}

export function HeroClient({
  hero,
  backgroundImage,
  galleryImages
}: HeroClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  const collageY = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const collageRotate = useTransform(scrollYProgress, [0, 1], ["0deg", "-1.6deg"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 34]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink text-white"
      aria-label="Hospo Creative hospitality portfolio hero"
    >
      <SmartImage
        src={backgroundImage.src}
        alt={backgroundImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        fallbackLabel="Hero background image"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,44,93,0.96),rgba(0,44,93,0.72)_48%,rgba(0,44,93,0.34)),linear-gradient(180deg,rgba(0,44,93,0.42),rgba(0,44,93,0.82))]" />

      <div className="relative z-10 mx-auto max-w-[82.5rem] px-5 pb-16 pt-14 sm:px-8 lg:pb-20 lg:pt-12">
        <div className="grid gap-10 lg:grid-cols-[46fr_54fr] lg:items-start lg:gap-14 xl:gap-16">
          <motion.div
            style={{ y: copyY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-[38rem]"
          >
            <div className="mb-4 inline-flex items-center gap-3 border border-yellow/35 bg-white/[0.06] px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.22em] text-white backdrop-blur-md">
              <ForkKnife aria-hidden="true" size={15} className="text-yellow" />
              {hero.eyebrow}
            </div>
            <h1 className="font-serif text-[clamp(4rem,5.6vw,5.6rem)] font-semibold leading-[0.96] tracking-[-0.035em] text-white">
              {renderHeroTitle(hero.title)}
            </h1>
            <div className="mt-6 max-w-[35rem] space-y-4 text-lg leading-8 text-white/[0.82] sm:text-xl sm:leading-9">
              {hero.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#work"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.17em] text-ink transition hover:-translate-y-0.5 hover:text-ink/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                {hero.primaryCta}
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/[0.28] px-6 py-4 text-sm font-bold uppercase tracking-[0.17em] text-white transition hover:-translate-y-0.5 hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                {hero.secondaryCta}
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div
            style={{ y: collageY, rotate: collageRotate }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.22, ease: "easeOut" }}
            className="w-full lg:pt-8"
          >
            <div className="relative grid max-h-[38rem] grid-cols-12 items-start gap-3 lg:gap-4">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.32 + index * 0.08,
                    ease: "easeOut"
                  }}
                  className={`group relative overflow-hidden rounded-[8px] shadow-editorial ${
                    heroGalleryLayout[index % heroGalleryLayout.length]
                  }`}
                >
                  <SmartImage
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1280px) 420px, (min-width: 1024px) 30vw, (min-width: 640px) 40vw, 82vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.025]"
                    fallbackLabel="Hero gallery image"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
