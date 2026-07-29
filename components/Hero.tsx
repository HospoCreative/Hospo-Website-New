import { homepageContent } from "@/data/homepage";
import { HeroClient } from "./HeroClient";

export function Hero() {
  return <HeroClient hero={homepageContent.hero} />;
}
