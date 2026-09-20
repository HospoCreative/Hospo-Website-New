import { getHomepageContent } from "@/data/homepage";
import { portugueseHomeSeo } from "@/data/seoContent";
import type { Locale } from "@/lib/i18n";
import { HeroClient } from "./HeroClient";

export function Hero({ locale = "en" }: { locale?: Locale }) {
  const hero = getHomepageContent(locale).hero;
  const portugueseHero = locale === "pt" ? {
    ...hero,
    eyebrow: "Marketing para hotelaria em Portugal",
    title: portugueseHomeSeo.h1 ?? hero.title,
    body: "A HOSPO Creative é uma agência de marketing especializada em hotéis, alojamentos, restaurantes e marcas F&B, com estratégia, redes sociais, fotografia, vídeo, SEO, websites e apoio à conversão."
  } : hero;
  return <HeroClient hero={portugueseHero} locale={locale} />;
}
