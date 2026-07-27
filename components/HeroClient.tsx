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

  const collageY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const collageRotate = useTransform(
    scrollYProgress,
    [0, 1],
    ["0deg", "-0.8deg"]
  );
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 24]);

  // The hero layout is designed for exactly four images.
  const visibleGalleryImages = galleryImages.slice(0, 4);

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

      <div className="relative z-10 mx-auto max-w-[85rem] px-5 pb-12 pt-24 sm:px-8 sm:pt-28 lg:min-h-[min(100svh,52rem)] lg:pb-14 lg:pt-24">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-12">
          <motion.div
            style={{ y: copyY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-[38rem]"
          >
            <div className="mb-4 inline-flex items-center gap-3 border border-yellow/35 bg-white/[0.06] px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.22em] text-white backdrop-blur-md">
              <ForkKnife
                aria-hidden="true"
                size={15}
                className="text-yellow"
              />
              {hero.eyebrow}
            </div>

            <h1 className="font-serif text-[clamp(3.5rem,6vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.035em] text-white">
              {renderHeroTitle(hero.title)}
            </h1>

            <div className="mt-5 max-w-[34rem] space-y-4 text-[1.05rem] leading-8 text-white/[0.82]">
              {hero.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#work"
                className="button-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                {hero.primaryCta}
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>

              <a
                href="#contact"
                className="button-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
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
            transition={{
              duration: 0.8,
              delay: 0.22,
              ease: "easeOut"
            }}
            className="w-full self-center"
          >
            <div className="grid h-[24rem] grid-cols-2 grid-rows-2 gap-3 sm:h-[29rem] lg:h-[clamp(25rem,32vw,32rem)] lg:gap-4">
              {visibleGalleryImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{
                    opacity: 0,
                    y: 24,
                    scale: 0.98
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.32 + index * 0.08,
                    ease: "easeOut"
                  }}
                  className="group relative min-h-0 overflow-hidden rounded-[8px]"
                >
                  <SmartImage
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 27vw, (min-width: 640px) 45vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
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
