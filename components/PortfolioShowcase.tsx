import { ArrowRight, ExternalLink, Play } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

const selectedWork = [
  ["https://www.instagram.com/p/Chbzn6FjuEa/?igsh=bmtob294Y2Nwbnoz", "/images/gallery/1.4.jpg"],
  ["https://www.instagram.com/p/DO_boWTDRMc/", "/images/gallery/21.jpg"],
  ["https://www.instagram.com/p/C8WaAkSOLP3/?hl=en", "/images/gallery/28.jpg"],
  ["https://www.instagram.com/p/C7UNghgO7FU/?hl=en", "/images/gallery/35.jpg"],
  ["https://www.instagram.com/p/DOgotIUiZfu/?hl=en", "/images/gallery/8.jpg"],
  ["https://www.instagram.com/p/C5LS5n5KxnJ/", "/images/gallery/17.jpg"],
  ["https://www.instagram.com/p/DIEo6UkoXuc/", "/images/gallery/14.jpg"],
  ["https://www.instagram.com/p/DY-Gx8OjOP9/", "/images/gallery/10.jpg"],
  ["https://www.instagram.com/p/DC3_dYWtY25/", "/images/gallery/5.2.jpg"]
] as const;

const reels = [
  ["https://www.instagram.com/p/DRkUWq1Cs1X/", "/images/gallery/1.5.jpg"],
  ["https://www.instagram.com/reel/C6LpA0eqq27/", "/images/gallery/1.6.jpg"],
  ["https://www.instagram.com/p/DQ_tVW7CGxs/", "/images/gallery/1.7.jpg"],
  ["https://www.instagram.com/p/DXW36Uxj6yy/", "/images/gallery/1.8.jpg"],
  ["https://www.instagram.com/p/DYO3X3UD9dl/", "/images/gallery/1.9.jpg"],
  ["https://www.instagram.com/p/DWlgA6tjQXv/", "/images/gallery/2.jpg"],
  ["https://www.instagram.com/p/DUtU344le3b/", "/images/gallery/5.jpg"],
  ["https://www.instagram.com/p/DVO0SP-jKp/", "/images/gallery/6.jpg"],
  ["https://www.instagram.com/p/DGgU27vB6po/", "/images/gallery/9.jpg"]
] as const;

const copy = {
  en: {
    workEyebrow: "Selected work",
    workTitle: "A closer look at work made to be noticed.",
    workBody: "A selection of hospitality photography, content and campaign work created for the channels where guests discover and decide.",
    reelsEyebrow: "Reels gallery",
    reelsTitle: "Made for the pace of social.",
    reelsLabel: "Short-form video",
    reelsBody: "Vertical content designed to hold attention, communicate the experience and give people a reason to act.",
    swipe: "Swipe",
    openWork: "Open selected work",
    reel: "Open reel"
  },
  pt: {
    workEyebrow: "Projetos selecionados",
    workTitle: "Um olhar mais próximo sobre trabalho feito para ser visto.",
    workBody: "Uma seleção de fotografia, conteúdo e campanhas para hotelaria, criada para os canais onde os clientes descobrem e decidem.",
    reelsEyebrow: "Galeria de reels",
    reelsTitle: "Feito para o ritmo das redes sociais.",
    reelsLabel: "Vídeo de formato curto",
    reelsBody: "Conteúdo vertical pensado para captar atenção, comunicar a experiência e dar às pessoas uma razão para agir.",
    swipe: "Deslize",
    openWork: "Abrir projeto selecionado",
    reel: "Abrir reel"
  }
} as const;

function SwipeHint({ children }: { children: string }) {
  return <div className="mt-7 flex justify-center sm:hidden"><span className="swipe-hint text-ink/60">{children}<ArrowRight aria-hidden="true" size={14} /></span></div>;
}

export function PortfolioShowcase({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <>
      <section id="selected-work" className="overflow-hidden bg-white px-5 py-[var(--hc-section-compact)] text-ink sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-col items-center gap-5 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
            <div><p className="section-eyebrow text-ink/55">{t.workEyebrow}</p><h2 className="mt-5 max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[.98]">{t.workTitle}</h2></div>
            <p className="max-w-sm text-base leading-7 text-ink/65">{t.workBody}</p>
          </Reveal>
          <SwipeHint>{t.swipe}</SwipeHint>
          <div className="scroll-row mt-7 grid auto-cols-[calc((100vw_-_3.5rem)_/_2)] grid-flow-col grid-rows-2 gap-4 overflow-x-auto pb-5 sm:mt-12 sm:flex sm:auto-cols-auto sm:gap-5">
            {selectedWork.map(([href, image], index) => {
              const label = `${t.workEyebrow} ${index + 1}`;
              return <Reveal key={href} delay={index * .04} className="w-full snap-start sm:min-w-[340px] lg:min-w-[360px]"><a href={href} target="_blank" rel="noreferrer" aria-label={t.openWork} className="group relative block aspect-[3/4] overflow-hidden rounded-[8px] bg-ink shadow-lg ring-1 ring-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-4"><SmartImage src={image} alt={label} fill sizes="(min-width: 1024px) 360px, 43vw" className="object-cover transition duration-700 group-hover:scale-105" fallbackLabel={label} /><span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" /><span className="absolute bottom-5 left-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-white">{t.openWork}<ExternalLink size={15} aria-hidden="true" /></span></a></Reveal>;
            })}
          </div>
        </div>
      </section>

      <section id="reels-gallery" className="overflow-hidden bg-ink px-5 py-[var(--hc-section-compact)] text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="grid gap-8 text-center lg:grid-cols-[.78fr_1fr] lg:items-end lg:text-left">
            <div><p className="section-eyebrow text-yellow">{t.reelsEyebrow}</p><h2 className="mt-5 max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[.98]">{t.reelsTitle}</h2></div>
            <div className="rounded-[8px] bg-yellow p-6 text-ink shadow-lg sm:p-8 lg:-rotate-1"><p className="text-xs font-black uppercase tracking-[.2em]">{t.reelsLabel}</p><p className="mt-4 text-lg leading-8">{t.reelsBody}</p></div>
          </Reveal>
          <div className="mt-7 flex justify-center sm:hidden"><span className="swipe-hint text-yellow">{t.swipe}<ArrowRight aria-hidden="true" size={14} /></span></div>
          <div className="scroll-row mt-7 grid auto-cols-[calc((100vw_-_3.5rem)_/_2)] grid-flow-col grid-rows-2 gap-4 overflow-x-auto pb-5 [scrollbar-color:rgba(255,255,255,.35)_transparent] sm:mt-12 sm:flex sm:auto-cols-auto sm:gap-5">
            {reels.map(([href, image], index) => <Reveal key={href} delay={index * .04} className="w-full snap-start sm:min-w-[280px] lg:min-w-[315px]"><a href={href} target="_blank" rel="noreferrer" aria-label={t.reel} className="group block rounded-[8px] bg-white/10 p-2 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow sm:p-3"><div className="relative aspect-[9/16] overflow-hidden rounded-[6px] bg-black"><SmartImage src={image} alt={`${t.reelsEyebrow} ${index + 1}`} fill sizes="(min-width: 1024px) 315px, 43vw" className="object-cover transition duration-700 group-hover:scale-105" fallbackLabel={t.reel} /><span className="absolute inset-0 bg-ink/25" /><span className="absolute inset-0 grid place-items-center"><Play className="size-14 rounded-full border border-white/45 bg-white/15 p-4 text-white backdrop-blur-sm transition group-hover:scale-105 group-hover:bg-yellow group-hover:text-ink" fill="currentColor" aria-hidden="true" /></span></div></a></Reveal>)}
          </div>
        </div>
      </section>
    </>
  );
}
