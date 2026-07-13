import { siteContent } from "@/data/site";
import { Reveal } from "./Reveal";

export function SocialProof() {
  const { proof } = siteContent;

  return (
    <section className="border-t border-white/10 bg-ink px-5 py-16 text-white sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl border-y border-white/14 py-12">
        <Reveal className="max-w-6xl">
          <p className="section-eyebrow text-yellow">{proof.eyebrow}</p>
          <h2 className="mt-5 max-w-5xl font-serif text-[clamp(2.35rem,8vw,4.8rem)] font-semibold leading-[0.98]">
            {proof.title}
          </h2>
          <div className="mt-7 max-w-3xl">
            <p className="text-xl leading-9 text-white/74 sm:text-2xl sm:leading-10">
              {proof.body}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {proof.sectors.map((sector) => (
                <span
                  key={sector}
                  className="rounded-full border border-white/16 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-white/70"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
