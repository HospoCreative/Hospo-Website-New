import { ArrowRight, ExternalLink, Play } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getPublishedPortfolioEmbeds } from "@/lib/supabase/queries";
import { Reveal } from "./Reveal";

const selectedWorkLinks = [
  "https://www.instagram.com/p/Chbzn6FjuEa/?igsh=bmtob294Y2Nwbnoz",
  "https://www.instagram.com/p/DO_boWTDRMc/",
  "https://www.instagram.com/p/C8WaAkSOLP3/?hl=en",
  "https://www.instagram.com/p/C7UNghgO7FU/?hl=en",
  "https://www.instagram.com/p/DOgotIUiZfu/?hl=en",
  "https://www.instagram.com/p/C5LS5n5KxnJ/",
  "https://www.instagram.com/p/DIEo6UkoXuc/",
  "https://www.instagram.com/p/DY-Gx8OjOP9/",
  "https://www.instagram.com/p/DC3_dYWtY25/"
] as const;

const reels = [
  "https://www.instagram.com/p/DRkUWq1Cs1X/",
  "https://www.instagram.com/reel/C6LpA0eqq27/",
  "https://www.instagram.com/p/DQ_tVW7CGxs/",
  "https://www.instagram.com/p/DXW36Uxj6yy/",
  "https://www.instagram.com/p/DYO3X3UD9dl/",
  "https://www.instagram.com/p/DWlgA6tjQXv/",
  "https://www.instagram.com/p/DUtU344le3b/",
  "https://www.instagram.com/p/DVO0SP-jKp/",
  "https://www.instagram.com/p/DGgU27vB6po/"
] as const;

const copy = {
  en: {
    workEyebrow: "Selected work",
    workTitle: "A closer look at work made to be noticed.",
    workBody: "A selection of hospitality photography, content and campaign work created for the channels where guests discover and decide.",
    reelsEyebrow: "Reels gallery",
    reelsTitle: "Made for the pace of social.",
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
    swipe: "Deslize",
    openWork: "Abrir projeto selecionado",
    reel: "Abrir reel"
  }
} as const;

function SwipeHint({ children }: { children: string }) {
  return <div className="mt-7 flex justify-center sm:hidden"><span className="swipe-hint text-ink/60">{children}<ArrowRight aria-hidden="true" size={14} /></span></div>;
}

function getPostEmbedUrl(postUrl: string) {
  try {
    const url = new URL(postUrl);
    const [postType, postId] = url.pathname.split("/").filter(Boolean);
    return postType && postId ? `https://www.instagram.com/${postType}/${postId}/embed/` : undefined;
  } catch {
    return undefined;
  }
}

export async function PortfolioShowcase({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const embeds = await getPublishedPortfolioEmbeds();
  const savedSelectedWork = embeds.filter((embed) => embed.section === "selected_work").map((embed) => embed.instagramUrl);
  const savedReels = embeds.filter((embed) => embed.section === "reels").map((embed) => embed.instagramUrl);
  const selectedWork = savedSelectedWork.length ? savedSelectedWork : selectedWorkLinks;
  const reelLinks = savedReels.length ? savedReels : reels;

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
            {selectedWork.map((href, index) => {
              const embedUrl = getPostEmbedUrl(href);
              const label = `${t.workEyebrow} ${index + 1}`;
              return <Reveal key={href} delay={index * .04} className="w-full snap-start sm:min-w-[340px] lg:min-w-[360px]"><article className="relative aspect-[3/4] overflow-hidden rounded-[8px] bg-white shadow-lg ring-1 ring-ink/10">{embedUrl ? <iframe src={embedUrl} title={label} className="h-[128%] w-[128%] origin-top-left scale-[.781] bg-white sm:h-full sm:w-full sm:scale-100" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen /> : <a href={href} target="_blank" rel="noreferrer" aria-label={t.openWork} className="flex h-full flex-col items-center justify-center gap-4 bg-ink px-8 text-center text-white"><span className="section-eyebrow text-yellow">{label}</span><ExternalLink size={24} aria-hidden="true" /></a>}</article></Reveal>;
            })}
          </div>
        </div>
      </section>

      <section id="reels-gallery" className="overflow-hidden bg-ink px-5 py-[var(--hc-section-compact)] text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center lg:text-left">
            <p className="section-eyebrow text-yellow">{t.reelsEyebrow}</p><h2 className="mt-5 max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[.98]">{t.reelsTitle}</h2>
          </Reveal>
          <div className="mt-7 flex justify-center sm:hidden"><span className="swipe-hint text-yellow">{t.swipe}<ArrowRight aria-hidden="true" size={14} /></span></div>
          <div className="scroll-row mt-7 grid auto-cols-[calc((100vw_-_3.5rem)_/_2)] grid-flow-col grid-rows-2 gap-4 overflow-x-auto pb-5 [scrollbar-color:rgba(255,255,255,.35)_transparent] sm:mt-12 sm:flex sm:auto-cols-auto sm:gap-5">
            {reelLinks.map((href, index) => { const embedUrl = getPostEmbedUrl(href); return <Reveal key={href} delay={index * .04} className="w-full snap-start sm:min-w-[280px] lg:min-w-[315px]"><article className="group rounded-[8px] bg-white/10 p-1 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-yellow sm:p-1.5"><div className="relative aspect-[9/16] overflow-hidden rounded-[6px] bg-black">{embedUrl ? <iframe src={embedUrl} title={`${t.reelsEyebrow} ${index + 1}`} className="h-[134%] w-[134%] origin-top-left scale-[.746] sm:h-full sm:w-full sm:scale-100" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen /> : <a href={href} target="_blank" rel="noreferrer" aria-label={t.reel} className="flex h-full items-center justify-center bg-ink text-yellow"><ExternalLink aria-hidden="true" /></a>}<span className="sr-only">{t.reel}</span><Play className="pointer-events-none absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-ink/40 p-3 text-white opacity-0 transition group-hover:opacity-100" aria-hidden="true" /></div></article></Reveal>; })}
          </div>
        </div>
      </section>
    </>
  );
}
