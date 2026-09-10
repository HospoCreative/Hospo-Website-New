import { imageFolders, photoGalleryImageText } from "@/data/images";
import { getPublicImageList } from "@/lib/imageFolders";
import { localizedPath, type Locale } from "@/lib/i18n";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AutoSlidingGallery } from "./AutoSlidingGallery";
import { Reveal } from "./Reveal";

const copy: Record<Locale, { eyebrow: string; title: string; body: string; cta: string }> = {
  en: {
    eyebrow: "Visual work",
    title: "Show the experience before the decision is made.",
    body: "A selection of photography and video created to make hotels, stays, restaurants and food-led brands easier to notice, understand and choose.",
    cta: "Explore photography & video"
  },
  pt: {
    eyebrow: "Trabalho visual",
    title: "Mostre a experiência antes de a decisão ser tomada.",
    body: "Uma seleção de fotografia e vídeo criada para tornar hotéis, alojamentos, restaurantes e marcas de alimentação mais fáceis de descobrir, compreender e escolher.",
    cta: "Explorar fotografia e vídeo"
  }
};

function getGalleryItems() {
  return getPublicImageList(imageFolders.photoGallery, {
    text: photoGalleryImageText,
    altPrefix: "Hospo Creative portfolio image"
  }).map(({ src, alt }) => ({ src, alt }));
}

export function PresentationGallery({ locale, id }: { locale: Locale; id?: string }) {
  const sectionCopy = copy[locale];
  const items = getGalleryItems();

  return (
    <section id={id} className="overflow-hidden bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-5xl">
            <p className="section-eyebrow text-ink/55">{sectionCopy.eyebrow}</p>
            <h2 className="mt-5 font-serif text-[clamp(2.5rem,5.4vw,5rem)] font-semibold leading-[0.96]">
              {sectionCopy.title}
            </h2>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-ink/65 sm:text-xl sm:leading-9">
              {sectionCopy.body}
            </p>
            <Link href={localizedPath("/services/photography-video", locale)} className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-ink transition hover:text-ink/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
              {sectionCopy.cta} <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
        <AutoSlidingGallery items={items} locale={locale} />
      </div>
    </section>
  );
}
