import { imageFolders, photoGalleryImageText } from "@/data/images";
import { getHomepageContent } from "@/data/homepage";
import { getPublicImageList } from "@/lib/imageFolders";
import type { Locale } from "@/lib/i18n";
import { AutoSlidingGallery } from "./AutoSlidingGallery";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function WhoWeHelp({ locale = "en" }: { locale?: Locale }) {
  const content = getHomepageContent(locale).whoWeHelp;
  const galleryItems = getPublicImageList(imageFolders.photoGallery, {
    text: photoGalleryImageText,
    altPrefix: "Hospo Creative hospitality portfolio image"
  });

  return (
    <section id="who-we-help" className="bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal><SectionHeading eyebrow={content.eyebrow} title={content.title} body={content.body} width="wide" /></Reveal>
        <Reveal delay={0.08}>
          <AutoSlidingGallery items={galleryItems} locale={locale} />
        </Reveal>
      </div>
    </section>
  );
}
