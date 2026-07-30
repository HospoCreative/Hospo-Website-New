export { homepageContent } from "@/content/homepage";
import { homepageContent } from "@/content/homepage";
import { localizeTree, type Locale } from "@/lib/i18n";

export type HomepageContent = typeof homepageContent;

export function getHomepageContent(locale: Locale): HomepageContent {
  return localizeTree(locale, homepageContent);
}
