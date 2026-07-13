import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

export type PublicImageText = {
  title?: string;
  alt?: string;
  href?: string;
};

export type PublicImageItem = {
  fileName: string;
  src: string;
  title: string;
  alt: string;
  href?: string;
};

type PublicImageListOptions = {
  text?: Record<string, PublicImageText>;
  altPrefix?: string;
};

const imageExtensions = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

function titleFromFileName(fileName: string) {
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, "");
  const withoutLeadingNumber = nameWithoutExtension.replace(/^\d+[-_\s]*/, "");

  return withoutLeadingNumber
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function getPublicImageList(
  publicFolder: string,
  options: PublicImageListOptions = {}
): PublicImageItem[] {
  const cleanFolder = publicFolder
    .replace(/^\/?public\//, "")
    .replace(/^\/+|\/+$/g, "");
  const folderPath = path.join(process.cwd(), "public", cleanFolder);

  if (!existsSync(folderPath)) {
    return [];
  }

  return readdirSync(folderPath)
    .filter((fileName) => imageExtensions.has(path.extname(fileName).toLowerCase()))
    .sort((first, second) =>
      first.localeCompare(second, undefined, {
        numeric: true,
        sensitivity: "base"
      })
    )
    .map((fileName, index) => {
      const text = options.text?.[fileName];
      const title = text?.title ?? titleFromFileName(fileName);

      return {
        fileName,
        src: `/${cleanFolder}/${fileName}`,
        title,
        alt: text?.alt ?? `${options.altPrefix ?? title} ${index + 1}`,
        href: text?.href
      };
    });
}
