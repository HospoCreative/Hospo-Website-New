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
import { siteContent } from "@/data/site";

function JourneyStage({
  stage,
  index,
  progress
}: {
  stage: (typeof siteContent.journey.stages)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  const start = 0.04 + index * 0.1;
  const end = start + 0.16;
  const opacity = useTransform(progress, [start - 0.05, start, end], [0.46, 1, 0.88]);
  const y = useTransform(progress, [start - 0.05, end], [24, 0]);
  const rotateX = useTransform(progress, [start - 0.04, end], ["6deg", "0deg"]);

  return (
    <motion.article
      style={reduceMotion ? undefined : { opacity, y, rotateX }}
      className="motion-depth relative border border-ink/12 bg-white p-5 text-ink shadow-soft sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-yellow">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-ink/12" />
      </div>
      <h3 className="font-serif text-[clamp(2rem,8vw,3.4rem)] font-semibold leading-none">
        {stage.title}
      </h3>
      <p className="mt-4 text-lg leading-8 text-ink/70">{stage.channels}</p>
    </motion.article>
  );
}

export function MarketingJourney() {
  const { journey } = siteContent;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const progress = useSpring(scrollYProgress, { stiffness: 76, damping: 25, mass: 0.42 });
  const pathScale = useTransform(progress, [0.08, 0.62], [0, 1]);
  const orbY = useTransform(progress, [0.08, 0.62], ["0%", "100%"]);
  const orbX = useTransform(progress, [0.08, 0.25, 0.45, 0.62], [0, 22, -18, 0]);

  return (
    <section
      id="approach"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-ink/10 bg-white px-5 py-20 text-ink sm:px-8 lg:min-h-[132vh] lg:py-0"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,44,93,0.04),rgba(255,255,255,0)_28%,rgba(0,44,93,0.035))]" />

      <div className="relative lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:py-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-6xl">
            <p className="section-eyebrow text-ink/55">{journey.eyebrow}</p>
            <h2 className="mt-5 max-w-3xl font-serif text-[clamp(2.7rem,12vw,6.2rem)] font-semibold leading-[0.94]">
              {journey.title}
            </h2>
            <p className="mt-8 max-w-3xl text-xl leading-9 text-ink/72 sm:text-2xl sm:leading-10">
              {journey.body}
            </p>
          </div>

          <div className="relative mt-12 grid gap-4 lg:grid-cols-[1fr_4rem_1fr] lg:gap-6">
            <div className="absolute left-4 top-0 hidden h-full w-px bg-ink/12 lg:left-1/2 lg:block">
              <motion.div
                style={{ scaleY: pathScale, transformOrigin: "top" }}
                className="h-full w-px bg-ink"
              />
              <motion.div
                style={{ y: orbY, x: orbX }}
                className="absolute -left-[13px] top-0 grid size-7 place-items-center rounded-full border border-yellow/70 bg-white shadow-[0_0_35px_rgba(255,204,83,0.56)]"
                aria-hidden="true"
              >
                <span className="size-2.5 rounded-full bg-yellow" />
              </motion.div>
            </div>

            {journey.stages.map((stage, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={stage.title}
                  className={`lg:col-span-3 lg:grid lg:grid-cols-[1fr_4rem_1fr] lg:items-center ${
                    index > 0 ? "lg:-mt-6" : ""
                  }`}
                >
                  <div className={isLeft ? "lg:col-start-1" : "lg:col-start-3"}>
                    <JourneyStage stage={stage} index={index} progress={progress} />
                  </div>
                  <div className="hidden lg:col-start-2 lg:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
