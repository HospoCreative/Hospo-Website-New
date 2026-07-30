import { getHomepageContent } from "@/data/homepage";
import type { Locale } from "@/lib/i18n";
import { HeroClient } from "./HeroClient";

export function Hero({ locale = "en" }: { locale?: Locale }) {
  return <HeroClient hero={getHomepageContent(locale).hero} />;
}
