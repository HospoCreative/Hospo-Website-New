import { imageFolders, photoGalleryImageText } from "@/data/images";
import { getPublicImageList } from "@/lib/imageFolders";
import type { Locale } from "@/lib/i18n";
import { AutoSlidingGallery } from "./AutoSlidingGallery";
import { Reveal } from "./Reveal";

const copy: Record<Locale, { eyebrow: string; title: string; body: string }> = {
  en: {
    eyebrow: "Who we help",
    title: "Built for businesses where presentation influences the decision.",
    body: "We work with independent hotels, restaurants, stays and food and drink brands that want to improve how people discover, compare and choose them online."
  },
  pt: {
    eyebrow: "Quem ajudamos",
    title: "Pensado para negócios onde a apresentação influencia a decisão.",
    body: "Trabalhamos com hotéis independentes, restaurantes, alojamentos e marcas de alimentação e bebidas que querem melhorar a forma como as pessoas os descobrem, comparam e escolhem online."
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
          </div>
        </Reveal>
        <AutoSlidingGallery items={items} locale={locale} />
      </div>
    </section>
  );
}
