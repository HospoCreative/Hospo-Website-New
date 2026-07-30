export { siteContent } from "@/content/sections/site";
import { siteContent } from "@/content/sections/site";
import { localizeTree, type Locale } from "@/lib/i18n";

export function getSiteContent(locale: Locale) {
  return localizeTree(locale, siteContent);
}
