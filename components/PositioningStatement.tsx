import { siteContent } from "@/data/site";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

export function PositioningStatement() {
  const { positioning } = siteContent;

  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 text-ink sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-6xl">
          <p className="section-eyebrow text-ink/55">{positioning.eyebrow}</p>
          <h2 className="mt-5 font-serif text-[clamp(2.7rem,8vw,5.5rem)] font-semibold leading-[0.98] tracking-normal">
            {positioning.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(300px,0.52fr)] lg:items-center">
          <Reveal className="grid gap-8 text-xl leading-9 text-ink/74 sm:text-2xl sm:leading-10 lg:grid-cols-2">
            <p>{positioning.body}</p>
            <p>{positioning.supporting}</p>
          </Reveal>

          <Reveal delay={0.1} className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="absolute -left-6 -top-6 h-28 w-px bg-yellow" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-[8px] shadow-editorial">
              <SmartImage
                src="/images/gallery/1.8.jpg"
                alt="Portrait hospitality photography detail"
                fill
                sizes="(min-width: 1024px) 32vw, 88vw"
                className="object-cover"
                fallbackLabel="Guest journey image"
              />
            </div>
            <div className="absolute -bottom-7 -right-3 max-w-[14rem] bg-ink px-5 py-4 text-white shadow-soft">
              <p className="text-[0.64rem] font-black uppercase tracking-[0.22em] text-yellow">
                One connected path
              </p>
              <p className="mt-2 text-base leading-7 text-white/78">
                Discovery, trust and booking touchpoints designed to work together.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
