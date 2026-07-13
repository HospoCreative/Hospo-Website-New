"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue
} from "framer-motion";
import { useRef } from "react";
import { SmartImage } from "./SmartImage";

export type AssemblyGalleryItem = {
  src: string;
  alt: string;
  label: string;
};

type ScrollAssemblyGalleryProps = {
  items: AssemblyGalleryItem[];
  copy: {
    eyebrow: string;
    title: string;
    body: string;
  };
};

const offsets = [
  { x: -190, y: 70, rotate: -6.5, scale: 0.9 },
  { x: 120, y: -80, rotate: 5.5, scale: 0.88 },
  { x: -130, y: -120, rotate: -4.5, scale: 0.92 },
  { x: 180, y: 90, rotate: 7, scale: 0.87 },
  { x: -80, y: 140, rotate: 3, scale: 0.94 },
  { x: 95, y: -120, rotate: -6, scale: 0.9 },
  { x: -160, y: -10, rotate: 4.5, scale: 0.86 },
  { x: 140, y: 130, rotate: -3.5, scale: 0.93 },
  { x: -90, y: -90, rotate: 6, scale: 0.9 },
  { x: 190, y: -20, rotate: -5.5, scale: 0.88 }
] as const;

function AssemblyTile({
  item,
  index,
  progress
}: {
  item: AssemblyGalleryItem;
  index: number;
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  const offset = offsets[index % offsets.length];
  const start = 0.02 + index * 0.012;
  const end = 0.32 + index * 0.014;
  const x = useTransform(progress, [start, end], [offset.x, 0]);
  const y = useTransform(progress, [start, end], [offset.y, 0]);
  const rotate = useTransform(progress, [start, end], [`${offset.rotate}deg`, "0deg"]);
  const scale = useTransform(progress, [start, end], [offset.scale, 1]);
  const opacity = useTransform(progress, [0, start, end], [0.42, 0.78, 1]);
  const filter = useTransform(progress, [start, end], ["blur(5px)", "blur(0px)"]);

  return (
    <motion.figure
      style={
        reduceMotion
          ? undefined
          : {
              x,
              y,
              rotate,
              scale,
              opacity,
              filter
            }
      }
      className="group relative overflow-hidden rounded-[8px] bg-ink shadow-soft will-change-transform"
    >
      <div className="relative aspect-[4/5]">
      <SmartImage
        src={item.src}
        alt={item.alt}
        fill
        sizes="(min-width: 1280px) 360px, (min-width: 768px) 28vw, 50vw"
        className="object-cover transition duration-700 group-hover:scale-[1.035]"
        fallbackLabel={item.label}
      />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,44,93,0.0)_35%,rgba(0,44,93,0.36))] opacity-70" />
      <figcaption className="absolute inset-x-0 bottom-0 p-3 text-[0.64rem] font-black uppercase tracking-[0.16em] text-white/86 sm:p-4">
        {item.label}
      </figcaption>
    </motion.figure>
  );
}

export function ScrollAssemblyGallery({ items, copy }: ScrollAssemblyGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const progress = useSpring(scrollYProgress, { stiffness: 82, damping: 24, mass: 0.35 });
  const selectedItems = items.slice(0, 10);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/10 bg-ink px-5 py-20 text-white sm:px-8 lg:min-h-[124vh] lg:py-0"
      aria-label="Scroll assembled portrait gallery"
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:py-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-6xl">
            <p className="section-eyebrow text-yellow">{copy.eyebrow}</p>
            <h2 className="mt-5 font-serif text-[clamp(2.6rem,12vw,5.4rem)] font-semibold leading-[0.96]">
              {copy.title}
            </h2>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-white/76 sm:text-2xl sm:leading-10">
              {copy.body}
            </p>
          </div>

          <div className="mt-12 grid auto-rows-auto grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {selectedItems.map((item, index) => (
              <AssemblyTile
                key={item.src}
                item={item}
                index={index}
                progress={progress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
