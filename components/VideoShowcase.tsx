import { reels } from "@/data/reels";
import { siteContent } from "@/data/site";
import { Play } from "lucide-react";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

export function VideoShowcase() {
  const { reels: reelsContent } = siteContent;

  return (
    <section id="campaigns" className="bg-ink px-5 py-20 text-white sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-6xl">
          <p className="section-eyebrow text-yellow">{reelsContent.eyebrow}</p>
          <h2 className="mt-5 font-serif text-[clamp(2.65rem,10vw,5.6rem)] font-semibold leading-[0.96]">
            {reelsContent.title}
          </h2>
          <p className="mt-7 max-w-4xl text-xl leading-9 text-white/76 sm:text-2xl sm:leading-10">
            {reelsContent.body}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reels.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.07}>
              <article className="group relative overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.06] p-2 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-yellow/45">
                <div className="relative aspect-[9/16] overflow-hidden rounded-[6px] bg-ink">
                  {item.videoSrc ? (
                    <video
                      src={item.videoSrc}
                      poster={item.thumbnail}
                      controls
                      preload="metadata"
                      playsInline
                      className="h-full w-full object-cover"
                      aria-label={item.title}
                    />
                  ) : (
                    <>
                      <SmartImage
                        src={item.thumbnail ?? "/images/reels/reel-01.jpg"}
                        alt={`${item.title} poster image`}
                        fill
                        sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                        fallbackLabel={item.title}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,44,93,0.1),rgba(0,44,93,0.78))]" />
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="grid size-14 place-items-center rounded-full border border-white/35 bg-white/14 text-white backdrop-blur-sm">
                          <Play aria-hidden="true" size={20} fill="currentColor" />
                        </span>
                      </div>
                      {item.note && (
                        <span className="absolute left-3 top-3 rounded-full border border-yellow/45 bg-ink/70 px-3 py-1 text-[0.58rem] font-black uppercase tracking-[0.14em] text-yellow backdrop-blur-sm">
                          {item.note}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-yellow">
                    {item.category}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight">
                    {item.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.services.map((service) => (
                      <span
                        key={service}
                        className="rounded-full border border-white/14 px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.13em] text-white/66"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
