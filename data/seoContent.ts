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
      title: "Hospitality Marketing for Hotels & Restaurants in the Algarve",
      description: "Hospo Creative is a hospitality marketing agency supporting hotels, resorts, restaurants and F&B businesses across the Algarve. Services include social media management, photography and video, SEO, website support and marketing campaigns.",
      titleTag: "Hospitality Marketing Agency Algarve | HOSPO Creative",
      metaDescription: "Hospitality marketing for Algarve hotels, resorts, restaurants and F&B brands: social media, photography, video, SEO, websites and campaigns.",
      audienceTitle: "Built for hospitality businesses with a seasonal, destination-led guest journey.",
      audience: ["Hotels, resorts and boutique accommodation", "Restaurants, beach clubs and bars", "Hospitality groups and F&B brands"],
      localContextTitle: "Support that connects destination appeal with a clear commercial route.",
      localContext: "In the Algarve, guests compare accommodation, places to eat and experiences across search, Maps, social media, OTAs and booking websites. Hospo brings hotel marketing, restaurant marketing, photography, video, SEO, websites and campaigns together so the right audience can understand the offer and take the next step.",
      servicesTitle: "Relevant support for Algarve hospitality businesses.",
      servicesIntro: "Choose a focused service or connect the capabilities that matter to your next commercial priority.",
      faqs: [
        { question: "Do you provide marketing for hotels and resorts in the Algarve?", answer: "Yes. We support Algarve hotels and resorts with strategy, direct-booking journeys, OTA presentation, websites, Google visibility, social media and content." },
        { question: "Do you provide marketing for restaurants and bars in the Algarve?", answer: "Yes. Support can include social media, campaigns, photography and video, Google visibility, websites and reservation journeys for Algarve restaurants and bars." },
        { question: "Do you provide social media management in the Algarve?", answer: "Yes. Hospitality social media support can include strategy, content planning, publishing, campaigns and ongoing optimisation." },
        { question: "Do you provide hotel and restaurant photography in the Algarve?", answer: "Yes. We create photography and video for hotels, restaurants, bars, food and drink, lifestyle content and social media." },
        { question: "Can you help Algarve hotels improve Google visibility?", answer: "Yes. We can connect SEO, Google Business Profile signals, website content, location information and technical foundations around a clearer search presence." },
        { question: "Can you help hotels improve direct bookings?", answer: "We can improve the website, SEO, campaigns, OTA presentation and booking journey. The right approach depends on the hotel’s offer, channels and priorities." },
        { question: "Which areas of the Algarve do you cover?", answer: "We work across the Algarve and can plan projects around the property or venue location, including Faro, Vilamoura, Albufeira, Quinta do Lago, Portimão, Lagos, Tavira and surrounding areas." },
        { question: "Can Hospo support both marketing and content production?", answer: "Yes. Strategy can be planned alongside photography, video and content production so the visual work supports the same commercial direction." }
      ]
    },
    pt: {
      eyebrow: "Marketing para hotelaria no Algarve",
      title: "Marketing para Hotéis e Restaurantes no Algarve",
      description: "A Hospo Creative apoia hotéis, resorts, restaurantes e negócios de hotelaria e restauração no Algarve. Os serviços incluem redes sociais, fotografia e vídeo, SEO, websites e campanhas de marketing.",
      titleTag: "Agência de Marketing para Hotelaria no Algarve | HOSPO Creative",
      metaDescription: "Marketing para hotéis, resorts, restaurantes e marcas F&B no Algarve: redes sociais, fotografia, vídeo, SEO, websites e campanhas.",
      audienceTitle: "Para negócios de hotelaria com uma jornada de cliente sazonal e orientada para o destino.",
      audience: ["Hotéis, resorts e alojamentos boutique", "Restaurantes, beach clubs e bares", "Grupos de hotelaria e marcas F&B"],
      localContextTitle: "Apoio que liga a força do destino a um percurso comercial claro.",
      localContext: "No Algarve, os clientes comparam alojamentos, locais para comer e experiências através da pesquisa, Maps, redes sociais, OTAs e websites de reserva. A Hospo reúne marketing para hotéis e restaurantes, fotografia, vídeo, SEO, websites e campanhas para que o público certo compreenda a oferta e dê o próximo passo.",
      servicesTitle: "Apoio relevante para negócios de hotelaria no Algarve.",
      servicesIntro: "Escolha um serviço focado ou combine as capacidades mais relevantes para a sua próxima prioridade comercial.",
      faqs: [
        { question: "Fazem marketing para hotéis e resorts no Algarve?", answer: "Sim. Apoiamos hotéis e resorts no Algarve com estratégia, percursos de reservas diretas, apresentação em OTAs, websites, visibilidade no Google, redes sociais e conteúdo." },
        { question: "Fazem marketing para restaurantes e bares no Algarve?", answer: "Sim. O apoio pode incluir redes sociais, campanhas, fotografia e vídeo, visibilidade no Google, websites e percursos de reserva para restaurantes e bares no Algarve." },
        { question: "Fazem gestão de redes sociais no Algarve?", answer: "Sim. A gestão de redes sociais para hotelaria e restauração pode incluir estratégia, planeamento de conteúdos, publicação, campanhas e otimização contínua." },
        { question: "Fazem fotografia para hotéis e restaurantes no Algarve?", answer: "Sim. Criamos fotografia e vídeo para hotéis, restaurantes, bares, gastronomia, bebidas, lifestyle e redes sociais." },
        { question: "Podem ajudar hotéis do Algarve a melhorar a visibilidade no Google?", answer: "Sim. Podemos ligar SEO, sinais do Perfil de Empresa no Google, conteúdo do website, informação de localização e bases técnicas para reforçar a presença na pesquisa." },
        { question: "Podem ajudar hotéis a melhorar as reservas diretas?", answer: "Podemos melhorar o website, SEO, campanhas, apresentação em OTAs e percurso de reserva. A abordagem adequada depende da oferta, canais e prioridades do hotel." },
        { question: "Que zonas do Algarve cobrem?", answer: "Trabalhamos em todo o Algarve e podemos planear projetos de acordo com a localização da propriedade ou espaço, incluindo Faro, Vilamoura, Albufeira, Quinta do Lago, Portimão, Lagos, Tavira e zonas próximas." },
        { question: "A Hospo pode tratar de marketing e produção de conteúdo?", answer: "Sim. A estratégia pode ser planeada juntamente com fotografia, vídeo e produção de conteúdos para que o trabalho visual apoie a mesma direção comercial." }
      ]
    }
  },
  lisboa: {
    en: {
      eyebrow: "Hospitality marketing in Lisbon",
      title: "Hospitality Marketing for Hotels & Restaurants in Lisbon",
      description: "Hospo Creative provides hospitality marketing support for hotels, restaurants, bars and F&B businesses in Lisbon. Services include social media, photography and video, SEO, websites and campaign strategy.",
      titleTag: "Hospitality Marketing Agency Lisbon | HOSPO Creative",
      metaDescription: "Hospitality marketing for Lisbon hotels, restaurants, bars and F&B brands: social media, photography, video, SEO, websites and campaigns.",
      audienceTitle: "For city hospitality businesses competing for attention, bookings and repeat visits.",
      audience: ["Hotels and boutique hotels", "Restaurants, restaurant groups and bars", "Food-led venues and F&B concepts"],
      localContextTitle: "Clearer discovery and conversion in a fast-moving city market.",
      localContext: "Lisbon guests and diners often move quickly between search, Maps, social media, review platforms and booking journeys. Hospo helps make the experience, location, offer and next step easier to understand through hotel marketing, restaurant marketing, photography, video, SEO, websites and campaigns.",
      servicesTitle: "Relevant support for Lisbon hospitality businesses.",
      servicesIntro: "Start with a single commercial priority or create an integrated plan around visibility, presentation and conversion.",
      faqs: [
        { question: "Do you provide marketing for hotels in Lisbon?", answer: "Yes. We support Lisbon hotels and boutique hotels with digital strategy, social media, SEO, websites, photography, video and campaigns." },
        { question: "Do you provide marketing for restaurants and bars in Lisbon?", answer: "Yes. We work with restaurants, bars and F&B businesses in Lisbon on digital presentation, content, social media, SEO, websites and campaigns." },
        { question: "Do you manage social media for hotels and restaurants in Lisbon?", answer: "Yes. Support can include strategy, content planning, publishing, community management, campaigns and ongoing optimisation." },
        { question: "Do you provide photography and video in Lisbon?", answer: "Yes. We create photography and video for hotel spaces, food and drink, restaurants, interiors, service, lifestyle and social media." },
        { question: "Can you improve Google visibility for Lisbon hospitality businesses?", answer: "Yes. We can connect SEO, local information, website content, technical foundations and Google Business Profile signals around the right search intent." },
        { question: "Can you support restaurant launches, menu launches or hotel campaigns?", answer: "Yes. Strategy, content, photography, video, paid campaigns and landing-page support can be planned around a launch or seasonal priority." },
        { question: "Do you work with independent businesses as well as groups?", answer: "Yes. We support independent hotels, restaurants and bars, as well as hospitality groups with several properties, venues or concepts." },
        { question: "Can you work alongside an existing in-house marketing team?", answer: "Yes. Hospo can provide a focused service, additional production capacity or an integrated plan alongside an internal marketing team." }
      ]
    },
    pt: {
      eyebrow: "Marketing para hotelaria em Lisboa",
      title: "Marketing para Hotéis e Restaurantes em Lisboa",
      description: "A Hospo Creative presta serviços de marketing a hotéis, restaurantes, bares e negócios de hotelaria e restauração em Lisboa. Os serviços incluem redes sociais, fotografia e vídeo, SEO, websites e estratégia de campanhas.",
      titleTag: "Agência de Marketing para Hotelaria em Lisboa | HOSPO Creative",
      metaDescription: "Marketing para hotéis, restaurantes, bares e marcas F&B em Lisboa: redes sociais, fotografia, vídeo, SEO, websites e campanhas.",
      audienceTitle: "Para negócios urbanos de hotelaria que competem por atenção, reservas e visitas repetidas.",
      audience: ["Hotéis e hotéis boutique", "Restaurantes, grupos de restauração e bares", "Espaços de restauração e conceitos F&B"],
      localContextTitle: "Descoberta e conversão mais claras num mercado urbano em movimento.",
      localContext: "Em Lisboa, hóspedes e clientes passam rapidamente entre pesquisa, Maps, redes sociais, plataformas de avaliações e percursos de reserva. A Hospo ajuda a tornar a experiência, localização, oferta e próximo passo mais fáceis de compreender através de marketing para hotéis e restaurantes, fotografia, vídeo, SEO, websites e campanhas.",
      servicesTitle: "Apoio relevante para negócios de hotelaria em Lisboa.",
      servicesIntro: "Comece por uma prioridade comercial ou construa um plano integrado em torno de visibilidade, apresentação e conversão.",
      faqs: [
        { question: "Fazem marketing para hotéis em Lisboa?", answer: "Sim. Apoiamos hotéis e hotéis boutique em Lisboa com estratégia digital, redes sociais, SEO, websites, fotografia, vídeo e campanhas." },
        { question: "Fazem marketing para restaurantes e bares em Lisboa?", answer: "Sim. Trabalhamos com restaurantes, bares e negócios de alimentação e bebidas em Lisboa na apresentação digital, conteúdos, redes sociais, SEO, websites e campanhas." },
        { question: "Fazem gestão de redes sociais para hotéis e restaurantes em Lisboa?", answer: "Sim. O apoio pode incluir estratégia, planeamento de conteúdos, publicação, gestão de comunidade, campanhas e otimização contínua." },
        { question: "Fazem fotografia e vídeo em Lisboa?", answer: "Sim. Criamos fotografia e vídeo para espaços de hotel, gastronomia e bebidas, restaurantes, interiores, serviço, lifestyle e redes sociais." },
        { question: "Podem melhorar a visibilidade no Google de negócios de hotelaria em Lisboa?", answer: "Sim. Podemos ligar SEO, informação local, conteúdo do website, bases técnicas e sinais do Perfil de Empresa no Google à intenção de pesquisa adequada." },
        { question: "Podem apoiar lançamentos de restaurantes, menus ou campanhas de hotéis?", answer: "Sim. Estratégia, conteúdos, fotografia, vídeo, campanhas pagas e landing pages podem ser planeados em torno de um lançamento ou prioridade sazonal." },
        { question: "Trabalham com negócios independentes e também com grupos?", answer: "Sim. Apoiamos hotéis, restaurantes e bares independentes, assim como grupos com várias propriedades, espaços ou conceitos." },
        { question: "Podem trabalhar com uma equipa interna de marketing?", answer: "Sim. A Hospo pode prestar um serviço específico, reforçar a capacidade de produção ou criar um plano integrado em conjunto com uma equipa interna." }
      ]
    }
  }
};
