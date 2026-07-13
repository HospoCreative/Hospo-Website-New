import { imageFolders } from "@/data/images";
import { siteContent } from "@/data/site";
import { getPublicImageList } from "@/lib/imageFolders";
import { HeroClient } from "./HeroClient";

export function Hero() {
  const { hero } = siteContent;
  const [backgroundImage] = getPublicImageList(imageFolders.heroBackground, {
    altPrefix: "Hero background image"
  });
  const galleryImages = getPublicImageList(imageFolders.heroCollage, {
    altPrefix: "Hero collage image"
  }).slice(0, 4);
  const safeBackgroundImage =
    backgroundImage ?? galleryImages[0] ?? hero.galleryImages[0] ?? hero.backgroundImage;

  return (
    <HeroClient
      hero={hero}
      backgroundImage={safeBackgroundImage}
      galleryImages={galleryImages.length > 0 ? galleryImages : hero.galleryImages}
    />
  );
}
