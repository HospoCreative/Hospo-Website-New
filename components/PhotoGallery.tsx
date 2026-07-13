import { imageFolders, photoGalleryImageText } from "@/data/images";
import { siteContent } from "@/data/site";
import { getPublicImageList } from "@/lib/imageFolders";
import {
  ScrollAssemblyGallery,
  type AssemblyGalleryItem
} from "./ScrollAssemblyGallery";

function getGalleryItems(): AssemblyGalleryItem[] {
  return getPublicImageList(imageFolders.photoGallery, {
    text: photoGalleryImageText,
    altPrefix: "Hospo Creative portfolio image"
  }).map((image) => ({
    src: image.src,
    alt: image.alt
  }));
}

export function PhotoGallery() {
  return (
    <ScrollAssemblyGallery
      items={getGalleryItems()}
      copy={siteContent.photoGallery}
    />
  );
}
