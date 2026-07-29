import { reels } from "@/data/reels";
import { siteContent } from "@/data/site";
import { Play } from "lucide-react";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";
import { SectionHeading } from "./SectionHeading";

export function VideoShowcase() {
  const { reels: reelsContent } = siteContent;

  return (
    <section id="campaigns" className="bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal><SectionHeading tone="light" eyebrow={reelsContent.eyebrow} title={reelsContent.title} body={reelsContent.body} /></Reveal>

        <div className="mt-10 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reels.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.07} className="h-full">
              <article className="group relative flex h-full min-h-[31rem] flex-col overflow-hidden border border-white/10 bg-white/[0.06] p-2 shadow-soft transition duration-500 hover:-translate-y-2 hover:border-yellow/70">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink">
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
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-yellow">
                    {item.category}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight">
                    {item.title}
                  </h3>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
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
