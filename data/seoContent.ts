import type { Locale } from "@/lib/i18n";

type SeoCopy = { title: string; description: string; h1?: string };

export const portugueseHomeSeo: SeoCopy = {
  title: "Agência de Marketing para Hotelaria em Portugal | HOSPO Creative",
  description: "A HOSPO Creative é uma agência de marketing para hotéis, alojamentos, restaurantes e marcas F&B em Portugal. Estratégia, redes sociais, fotografia, vídeo, SEO, websites e reservas diretas.",
  h1: "Agência de marketing para hotelaria em Portugal."
};

export const sectorSeo: Record<"hotels-stays" | "restaurants-fb", Record<Locale, SeoCopy>> = {
  "hotels-stays": {
    en: {
      title: "Hotel Marketing Agency | HOSPO Creative",
      description: "Hotel marketing, SEO, photography, websites and direct-booking optimisation for independent hotels, resorts and accommodation businesses."
    },
    pt: {
      title: "Marketing para Hotéis e Alojamentos | HOSPO Creative",
      description: "Marketing hoteleiro para hotéis, resorts, alojamentos e grupos independentes: estratégia, SEO, fotografia, websites, OTAs e reservas diretas.",
      h1: "Marketing para hotéis e alojamentos que querem ser encontrados, escolhidos e reservados."
    }
  },
  "restaurants-fb": {
    en: {
      title: "Restaurant & F&B Marketing Agency | HOSPO Creative",
      description: "Restaurant marketing, social media, photography, SEO and websites for restaurants, bars, hospitality groups and F&B brands."
    },
    pt: {
      title: "Marketing para Restaurantes e Marcas F&B | HOSPO Creative",
      description: "Marketing para restaurantes, bares, grupos de restauração e marcas F&B: estratégia, redes sociais, fotografia, SEO, campanhas e websites.",
      h1: "Marketing para restaurantes, bares e marcas F&B que precisam de gerar procura."
    }
  }
};

export const serviceSeo: Record<string, Record<Locale, SeoCopy>> = {
  "strategy-campaigns": {
    en: { title: "Hospitality Marketing Strategy & Campaigns | HOSPO Creative", description: "Marketing strategy and campaigns for hotels, restaurants and F&B brands." },
    pt: { title: "Estratégia de Marketing para Hotelaria | HOSPO Creative", description: "Estratégia de marketing e campanhas para hotéis, restaurantes e marcas F&B, pensadas para lançamentos, sazonalidade e prioridades comerciais.", h1: "Estratégia de marketing e campanhas para hotelaria." }
  },
  "websites-direct-booking": {
    en: { title: "Hotel & Restaurant Websites | Direct Booking | HOSPO Creative", description: "Websites, booking journeys and conversion optimisation for hotels, restaurants and F&B brands." },
    pt: { title: "Websites para Hotéis e Restaurantes | Reservas Diretas | HOSPO Creative", description: "Websites para hotéis e restaurantes, com percursos claros para reservas diretas, marcações, pedidos e contactos.", h1: "Websites para hotéis e restaurantes, pensados para gerar reservas diretas." }
  },
  "ota-optimisation": {
    en: { title: "OTA Optimisation for Hotels | HOSPO Creative", description: "OTA listing optimisation, photography and content for hotels, stays and accommodation businesses." },
    pt: { title: "Otimização de OTAs para Hotéis e Alojamentos | HOSPO Creative", description: "Otimização de OTAs para hotéis e alojamentos: apresentação, fotografia, textos, comodidades e percurso entre OTAs e reservas diretas.", h1: "Otimização de OTAs para hotéis e alojamentos." }
  },
  "seo-google-visibility": {
    en: { title: "SEO for Hotels & Restaurants | HOSPO Creative", description: "SEO, Google visibility and local search optimisation for hotels, restaurants and F&B brands." },
    pt: { title: "SEO para Hotéis e Restaurantes | HOSPO Creative", description: "SEO para hotéis, alojamentos, restaurantes e marcas F&B: estrutura técnica, conteúdo, pesquisa local, Perfil de Empresa Google e visibilidade orgânica.", h1: "SEO para hotéis, restaurantes e marcas F&B." }
  },
  "photography-video": {
    en: { title: "Hotel & Restaurant Photography and Video | HOSPO Creative", description: "Professional photography and video for hotels, restaurants, bars and F&B brands." },
    pt: { title: "Fotografia e Vídeo para Hotéis e Restaurantes | HOSPO Creative", description: "Fotografia e vídeo profissional para hotéis, alojamentos, restaurantes, bares e marcas F&B, criado para websites, redes sociais, campanhas e OTAs.", h1: "Fotografia e vídeo para hotéis, restaurantes e marcas F&B." }
  },
  "social-media": {
    en: { title: "Social Media Management for Hotels & Restaurants | HOSPO Creative", description: "Social media strategy, content planning and management for hotels, restaurants and F&B brands." },
    pt: { title: "Gestão de Redes Sociais para Hotéis e Restaurantes | HOSPO Creative", description: "Gestão de redes sociais para hotéis, restaurantes e marcas F&B: estratégia, planeamento, conteúdo, publicação, comunidade e otimização contínua.", h1: "Gestão de redes sociais para hotéis, restaurantes e marcas F&B." }
  }
};

export type LocationSlug = "algarve" | "lisboa";

type LocationPage = {
  eyebrow: string;
  title: string;
  description: string;
  titleTag: string;
  metaDescription: string;
  audienceTitle: string;
  audience: string[];
  localContextTitle: string;
  localContext: string;
  servicesTitle: string;
  servicesIntro: string;
  faqs: { question: string; answer: string }[];
};

export const locationPages: Record<LocationSlug, Record<Locale, LocationPage>> = {
  algarve: {
    en: {
      eyebrow: "Hospitality marketing in the Algarve",
      title: "Marketing support for Algarve hotels, resorts, restaurants and F&B brands.",
      description: "Hospo works with hospitality businesses across the Algarve that need stronger discovery, visual presentation and digital conversion.",
      titleTag: "Hospitality Marketing Agency Algarve | HOSPO Creative",
      metaDescription: "Hospitality marketing for Algarve hotels, resorts, restaurants and F&B brands: social media, photography, video, SEO, websites and campaigns.",
      audienceTitle: "Built for hospitality businesses with a seasonal, destination-led guest journey.",
      audience: ["Hotels, resorts and boutique accommodation", "Restaurants, beach clubs and bars", "Hospitality groups and F&B brands"],
      localContextTitle: "Support that connects destination appeal with a clear commercial route.",
      localContext: "In the Algarve, guests compare accommodation, places to eat and experiences across search, Maps, social media, OTAs and booking websites. Hospo brings the strategy, content and digital foundations together so the right audience can understand the offer and take the next step.",
      servicesTitle: "Relevant support for Algarve hospitality businesses.",
      servicesIntro: "Choose a focused service or connect the capabilities that matter to your next commercial priority.",
      faqs: [{ question: "Do you work with Algarve businesses without a local office?", answer: "Yes. Hospo works with hospitality businesses in the Algarve and plans each project around the agreed scope, location and production requirements." }, { question: "Can photography and video be combined with ongoing marketing?", answer: "Yes. A visual production can provide the asset library for social media, campaigns, websites, OTAs and other agreed channels." }]
    },
    pt: {
      eyebrow: "Marketing para hotelaria no Algarve",
      title: "Marketing para hotéis, resorts, restaurantes e marcas F&B no Algarve.",
      description: "A Hospo trabalha com negócios de hotelaria no Algarve que querem reforçar a descoberta, a apresentação visual e a conversão digital.",
      titleTag: "Agência de Marketing para Hotelaria no Algarve | HOSPO Creative",
      metaDescription: "Marketing para hotéis, resorts, restaurantes e marcas F&B no Algarve: redes sociais, fotografia, vídeo, SEO, websites e campanhas.",
      audienceTitle: "Para negócios de hotelaria com uma jornada de cliente sazonal e orientada para o destino.",
      audience: ["Hotéis, resorts e alojamentos boutique", "Restaurantes, beach clubs e bares", "Grupos de hotelaria e marcas F&B"],
      localContextTitle: "Apoio que liga a força do destino a um percurso comercial claro.",
      localContext: "No Algarve, os clientes comparam alojamentos, locais para comer e experiências através da pesquisa, Maps, redes sociais, OTAs e websites de reserva. A Hospo reúne estratégia, conteúdo e bases digitais para que o público certo compreenda a oferta e dê o próximo passo.",
      servicesTitle: "Apoio relevante para negócios de hotelaria no Algarve.",
      servicesIntro: "Escolha um serviço focado ou combine as capacidades mais relevantes para a sua próxima prioridade comercial.",
      faqs: [{ question: "Trabalham com negócios no Algarve sem terem um escritório local?", answer: "Sim. A Hospo trabalha com negócios de hotelaria no Algarve e planeia cada projeto de acordo com o âmbito, localização e necessidades de produção acordadas." }, { question: "Podem combinar fotografia e vídeo com marketing contínuo?", answer: "Sim. Uma produção visual pode criar uma biblioteca de ativos para redes sociais, campanhas, websites, OTAs e outros canais acordados." }]
    }
  },
  lisboa: {
    en: {
      eyebrow: "Hospitality marketing in Lisbon",
      title: "Marketing support for Lisbon hotels, restaurants, bars and F&B concepts.",
      description: "Hospo works with Lisbon hospitality businesses that need clearer digital presentation, stronger local visibility and more useful customer journeys.",
      titleTag: "Hospitality Marketing Agency Lisbon | HOSPO Creative",
      metaDescription: "Hospitality marketing for Lisbon hotels, restaurants, bars and F&B brands: social media, photography, video, SEO, websites and campaigns.",
      audienceTitle: "For city hospitality businesses competing for attention, bookings and repeat visits.",
      audience: ["Hotels and boutique hotels", "Restaurants, restaurant groups and bars", "Food-led venues and F&B concepts"],
      localContextTitle: "Clearer discovery and conversion in a fast-moving city market.",
      localContext: "Lisbon guests and diners often move quickly between search, Maps, social media, review platforms and booking journeys. Hospo helps make the experience, location, offer and next step easier to understand across the places where people compare.",
      servicesTitle: "Relevant support for Lisbon hospitality businesses.",
      servicesIntro: "Start with a single commercial priority or create an integrated plan around visibility, presentation and conversion.",
      faqs: [{ question: "Do you work with hotel and restaurant groups in Lisbon?", answer: "Yes. The scope can be planned around one venue, one property or a group with different offers and channels." }, { question: "Can you help with local visibility as well as content?", answer: "Yes. SEO and Google visibility work can be connected with photography, social media, websites and campaigns where that supports the agreed objective." }]
    },
    pt: {
      eyebrow: "Marketing para hotelaria em Lisboa",
      title: "Marketing para hotéis, restaurantes, bares e conceitos F&B em Lisboa.",
      description: "A Hospo trabalha com negócios de hotelaria em Lisboa que precisam de uma apresentação digital mais clara, maior visibilidade local e percursos de cliente mais úteis.",
      titleTag: "Agência de Marketing para Hotelaria em Lisboa | HOSPO Creative",
      metaDescription: "Marketing para hotéis, restaurantes, bares e marcas F&B em Lisboa: redes sociais, fotografia, vídeo, SEO, websites e campanhas.",
      audienceTitle: "Para negócios urbanos de hotelaria que competem por atenção, reservas e visitas repetidas.",
      audience: ["Hotéis e hotéis boutique", "Restaurantes, grupos de restauração e bares", "Espaços de restauração e conceitos F&B"],
      localContextTitle: "Descoberta e conversão mais claras num mercado urbano em movimento.",
      localContext: "Em Lisboa, hóspedes e clientes passam rapidamente entre pesquisa, Maps, redes sociais, plataformas de avaliações e percursos de reserva. A Hospo ajuda a tornar a experiência, localização, oferta e próximo passo mais fáceis de compreender nos momentos em que as pessoas comparam.",
      servicesTitle: "Apoio relevante para negócios de hotelaria em Lisboa.",
      servicesIntro: "Comece por uma prioridade comercial ou construa um plano integrado em torno de visibilidade, apresentação e conversão.",
      faqs: [{ question: "Trabalham com grupos de hotéis e restaurantes em Lisboa?", answer: "Sim. O âmbito pode ser planeado para um espaço, uma propriedade ou um grupo com ofertas e canais distintos." }, { question: "Podem ajudar com visibilidade local e também com conteúdo?", answer: "Sim. O trabalho de SEO e visibilidade no Google pode ser ligado a fotografia, redes sociais, websites e campanhas quando isso apoia o objetivo acordado." }]
    }
  }
};
