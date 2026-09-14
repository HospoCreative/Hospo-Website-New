type ContentPackage = {
  name: string;
  badge?: string;
  description: string;
  duration: string;
  photography: string;
  photographyVideo: string;
  photos: string;
  videos: string;
  items: string[];
};

type SocialPackage = {
  name: string;
  badge?: string;
  price: string;
  description: string;
  items: string[];
  note: string;
};

export const portugueseContentPackages: ContentPackage[] = [
  {
    name: "Light",
    description: "Ideal para uma atualização focada de conteúdo.",
    duration: "Até 3 horas de captação",
    photography: "350€",
    photographyVideo: "450€",
    photos: "25–30 fotografias profissionalmente editadas",
    videos: "2 vídeos verticais editados em formato short-form",
    items: ["Cobertura das principais áreas ou produtos", "Conteúdo preparado para redes sociais, website e campanhas digitais"]
  },
  {
    name: "Standard",
    badge: "Mais Popular",
    description: "Ideal para criar um banco de conteúdo mais completo e variado.",
    duration: "Até 4 horas de captação",
    photography: "475€",
    photographyVideo: "600€",
    photos: "35–45 fotografias profissionalmente editadas",
    videos: "3 vídeos verticais editados em formato short-form",
    items: ["Cobertura de produtos, serviços, ambiente e experiência", "Maior variedade de momentos, detalhes e áreas", "Conteúdo preparado para redes sociais, website e campanhas digitais"]
  },
  {
    name: "Pro",
    description: "Ideal para negócios que precisam de uma cobertura mais completa para campanhas e comunicação ao longo dos meses seguintes.",
    duration: "Até 6 horas de captação",
    photography: "600€",
    photographyVideo: "750€",
    photos: "50–60 fotografias profissionalmente editadas",
    videos: "4 vídeos verticais editados em formato short-form",
    items: ["Cobertura do negócio, ambiente, pessoas, produtos, serviços e experiência", "Maior variedade de conteúdos em diferentes cenários, áreas ou localizações", "Conteúdo preparado para redes sociais, website e campanhas digitais"]
  }
];

export const portugueseSocialPackages: SocialPackage[] = [
  {
    name: "Social",
    price: "550 €/mês",
    description: "Para negócios que já dispõem de fotografia e vídeo e procuram uma gestão profissional e consistente das redes sociais.",
    items: ["Instagram + Facebook", "Até 3 publicações por semana", "Planeamento editorial mensal", "Copywriting, agendamento e publicação", "Stories de apoio com conteúdo fornecido pelo cliente", "Community management básica", "Reporting e recomendações mensais"],
    note: "A criação profissional de fotografia e vídeo não está incluída neste pacote e pode ser contratada separadamente."
  },
  {
    name: "Social + Content",
    badge: "Mais Popular",
    price: "1.100 €/mês",
    description: "Gestão de redes sociais com produção profissional de conteúdo mensal.",
    items: ["Instagram + Facebook e até 3 publicações por semana", "Estratégia, planeamento editorial, copywriting e Stories regulares", "Community management regular", "1 sessão profissional por mês, até 4 horas", "35–45 fotografias e 4 vídeos verticais por mês", "Gestão de 1 campanha Meta Ads por mês", "Reporting e recomendações mensais"],
    note: "O investimento publicitário em Meta Ads não está incluído e é pago diretamente pelo cliente."
  },
  {
    name: "Social + Content Pro",
    price: "1.450 €/mês",
    description: "Para hotéis, restaurantes e negócios com várias áreas, serviços ou experiências.",
    items: ["Instagram + Facebook e até 4 publicações por semana", "Estratégia, calendário editorial, copywriting e Stories regulares", "Maior volume de community management", "1 sessão profissional por mês, até 6 horas", "50–60 fotografias e 6 vídeos verticais por mês", "Gestão de 1 campanha Meta Ads por mês", "Reporting mensal e reunião estratégica mensal"],
    note: "O investimento publicitário em Meta Ads não está incluído e é pago diretamente pelo cliente."
  }
];
