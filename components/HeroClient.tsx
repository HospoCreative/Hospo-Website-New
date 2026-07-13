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
  "col-span-2 aspect-[4/5] sm:col-span-3",
  "aspect-square",
  "aspect-square",
  "aspect-square"
];

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
  const collageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const collageRotate = useTransform(scrollYProgress, [0, 1], ["0deg", "-3deg"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 58]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-ink text-white"
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

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[92rem] flex-col justify-center px-5 pb-12 pt-28 sm:px-8 lg:pb-16 lg:pt-28">
        <div className="grid gap-8 sm:grid-cols-[minmax(0,0.78fr)_minmax(300px,0.82fr)] sm:items-center lg:grid-cols-[minmax(0,0.95fr)_minmax(430px,0.98fr)] xl:gap-14">
          <motion.div
            style={{ y: copyY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-5xl"
          >
            <div className="mb-5 inline-flex items-center gap-3 border border-yellow/35 bg-white/[0.06] px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.22em] text-white backdrop-blur-md">
              <ForkKnife aria-hidden="true" size={15} className="text-yellow" />
              {hero.eyebrow}
            </div>
            <h1 className="font-serif text-[clamp(3.25rem,7.5vw,7.6rem)] font-semibold leading-[0.9] tracking-normal text-white">
              {hero.title}
            </h1>
            <div className="mt-7 max-w-2xl space-y-4 text-lg leading-8 text-white/[0.8] sm:text-xl sm:leading-9">
              {hero.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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
            className="w-full sm:-mr-4 lg:-mr-8 xl:-mr-14"
          >
            <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
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
                  className={`group relative overflow-hidden rounded-[8px] border border-white/12 bg-white/10 p-2 shadow-editorial backdrop-blur-sm ${
                    heroGalleryLayout[index % heroGalleryLayout.length]
                  }`}
                >
                  <SmartImage
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1280px) 620px, (min-width: 1024px) 46vw, (min-width: 640px) 300px, 50vw"
                    className="object-contain p-2 transition duration-700 group-hover:scale-[1.025]"
                    fallbackLabel="Hero gallery image"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-[8px] ring-1 ring-inset ring-white/10" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
