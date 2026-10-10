import { SITE_URL } from "@/lib/seo";

export type DigitalCardSlug = "tiago" | "andreia";
export type DigitalCardLocale = "en" | "pt";
export type SocialNetwork = "instagram" | "linkedin" | "website";

export type DigitalCardSocial = {
  label: string;
  href: string;
  network: SocialNetwork;
};

export type DigitalCardPortfolioItem = {
  src: string;
  alt: string;
  altPt: string;
  href: string;
};

export type DigitalBusinessCard = {
  slug: DigitalCardSlug;
  firstName: string;
  lastName: string;
  name: string;
  title: string;
  titlePt: string;
  portrait: string;
  portraitAlt: string;
  portraitAltPt: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  emailActionLabel?: string;
  socialLinks: readonly DigitalCardSocial[];
  portfolio: readonly DigitalCardPortfolioItem[];
};

const portfolio: readonly DigitalCardPortfolioItem[] = [
  {
    src: "/images/gallery/0.1_Bar Hotel cocktail hospo creative.jpg",
    alt: "Cocktail creation photographed for a hotel bar",
    altPt: "Cocktail criado para o bar de um hotel",
    href: "/services/photography-video"
  },
  {
    src: "/images/gallery/0.3_Food Restaurante Hospo Creative.jpg",
    alt: "Restaurant dish photographed for hospitality marketing",
    altPt: "Prato de restaurante fotografado para marketing de hotelaria",
    href: "/services/photography-video"
  },
  {
    src: "/images/gallery/0.4_Wine Hospo Creative.jpg",
    alt: "Wine service photographed for a hospitality brand",
    altPt: "Serviço de vinho fotografado para uma marca de hotelaria",
    href: "/case-studies"
  }
];

const companySocials: readonly DigitalCardSocial[] = [
  {
    label: "Hospo Creative on Instagram",
    href: "https://www.instagram.com/hospo_creative/",
    network: "instagram"
  },
  {
    label: "Hospo Creative on LinkedIn",
    href: "https://www.linkedin.com/company/hospo-creative-agency",
    network: "linkedin"
  }
];

export const digitalBusinessCards = {
  tiago: {
    slug: "tiago",
    firstName: "Tiago",
    lastName: "Bastos",
    name: "Tiago Bastos",
    title: "Co-Founder, Creative and Business Development Director",
    titlePt: "Co-Fundador, Diretor Criativo e de Desenvolvimento de Negócio",
    portrait: "/images/about/Tiago.png",
    portraitAlt: "Tiago Bastos, Co-Founder and Creative and Business Development Director at Hospo Creative",
    portraitAltPt: "Tiago Bastos, Co-Fundador e Diretor Criativo e de Desenvolvimento de Negócio na Hospo Creative",
    email: "info@hospoagency.com",
    emailActionLabel: "Email Hospo",
    phone: "+447887783999",
    whatsapp: "+447887783999",
    socialLinks: companySocials,
    portfolio
  },
  andreia: {
    slug: "andreia",
    firstName: "Andreia",
    lastName: "Oliveira",
    name: "Andreia Oliveira",
    title: "Co-Founder, Marketing and Growth Director",
    titlePt: "Co-Fundadora, Diretora de Marketing e Crescimento",
    portrait: "/images/about/Andreia.jpg",
    portraitAlt: "Andreia Oliveira, Co-Founder and Marketing and Growth Director at Hospo Creative",
    portraitAltPt: "Andreia Oliveira, Co-Fundadora e Diretora de Marketing e Crescimento na Hospo Creative",
    email: "info@hospoagency.com",
    emailActionLabel: "Email Hospo",
    phone: "+447928946702",
    whatsapp: "+447928946702",
    socialLinks: companySocials,
    portfolio
  }
} as const satisfies Record<DigitalCardSlug, DigitalBusinessCard>;

export function getDigitalBusinessCard(slug: string) {
  return digitalBusinessCards[slug as DigitalCardSlug];
}

export function digitalCardUrl(slug: DigitalCardSlug) {
  return new URL(`/${slug}`, SITE_URL).toString();
}
