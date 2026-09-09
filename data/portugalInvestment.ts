export type InvestmentTier = { name: "Light" | "Standard" | "Pro"; price: string; items: string[] };
export type InvestmentService = { id: string; category: string; title: string; intro?: string; tiers?: InvestmentTier[]; notes?: string[]; singlePrice?: string; singleItems?: string[] };

export const portugalInvestmentServices: InvestmentService[] = [
  { id: "estrategia", category: "Estratégia", title: "Estratégia / Posicionamento & Analytics", intro: "Uma camada transversal de direção estratégica e análise de performance, consolidando a atividade dos diferentes canais. O reporting incluído nos restantes serviços é operacional e específico de cada canal.", tiers: [
    { name: "Light", price: "250 €/mês", items: ["Estrutura simples / 1 mercado principal", "Auditoria e diagnóstico", "Acompanhamento estratégico", "Analytics & Reporting com portal web"] },
    { name: "Standard", price: "500 €/mês", items: ["2–3 mercados ou segmentos", "Auditoria e diagnóstico", "Acompanhamento estratégico", "Analytics & Reporting com portal web"] },
    { name: "Pro", price: "750 €/mês", items: ["Vários mercados / maior complexidade", "Auditoria e diagnóstico", "Acompanhamento estratégico", "Analytics & Reporting com portal web"] }
  ] },
  { id: "conteudo", category: "Conteúdo", title: "Produção de Conteúdo", intro: "Serviço contínuo de produção de conteúdo com ciclo bimestral.", tiers: [
    { name: "Light", price: "500 €/mês", items: ["Sessão de captação bimestral até 6h", "Foco nas áreas principais", "Fotografia + vídeo vertical", "Seleção, edição e banco de conteúdos para utilização ao longo do ciclo"] },
    { name: "Standard", price: "600 €/mês", items: ["Sessão de captação bimestral até 8h", "Quartos, áreas comuns, F&B, experiências e lifestyle", "Fotografia + vídeo vertical", "Banco de conteúdos para 2 meses e campanhas; seleção, edição e organização"] },
    { name: "Pro", price: "700 €/mês", items: ["Sessão de captação bimestral até 8h, com maior complexidade operacional", "Múltiplas áreas/outlets segundo prioridades definidas", "Fotografia + vídeo vertical", "Maior volume de edição, adaptações ao longo do ciclo e banco contínuo"] }
  ], notes: ["A mensalidade cobre todo o ciclo de produção, incluindo planeamento, preparação, captação, seleção, edição, organização e gestão do banco de conteúdos ao longo dos dois meses, garantindo disponibilidade regular de conteúdos atualizados para redes sociais, campanhas e restantes canais digitais.", "Modelos/atores, alugueres, produções especiais, deslocações extraordinárias, necessidades de grande escala e sessões de captação adicionais ou fora do plano acordado são orçamentados separadamente."] },
  { id: "copy", category: "Conteúdo", title: "Copywriting PT + EN", intro: "Conteúdos adicionais para website, ofertas, campanhas, experiências e materiais comerciais. O copy operacional necessário à Gestão de Redes Sociais, Paid Media e Email Marketing está incluído nos respetivos serviços.", tiers: [
    { name: "Light", price: "150 €/mês", items: ["Até 6–8 peças por trimestre", "Website, atualizações, ofertas, campanhas, experiências e materiais comerciais"] },
    { name: "Standard", price: "250 €/mês", items: ["Até 10–12 peças por trimestre", "Website, atualizações, ofertas, campanhas, experiências e materiais comerciais"] },
    { name: "Pro", price: "300 €/mês", items: ["Até 15 peças por trimestre", "Website, atualizações, ofertas, campanhas, experiências e materiais comerciais"] }
  ], notes: ["Conteúdos extensos, páginas completas ou materiais complexos podem equivaler a mais de uma peça."] },
  { id: "social", category: "Social", title: "Gestão de Redes Sociais + Comunidade", intro: "Inclui planeamento editorial, copy, agendamento, publicação, vídeo vertical, Stories de apoio, grafismos simples, reporting e recomendações mensais.", tiers: [
    { name: "Light", price: "700 €/mês", items: ["Instagram + Facebook", "Até 2 posts/semana", "TikTok pontual quando relevante", "Community management básica"] },
    { name: "Standard", price: "800 €/mês", items: ["Instagram + Facebook", "3 posts/semana", "TikTok até 1 post/semana quando relevante", "Community management regular"] },
    { name: "Pro", price: "900 €/mês", items: ["Instagram + Facebook", "Até 4 posts/semana", "TikTok até 1–2 posts/semana", "Maior volume de community management"] }
  ], notes: ["Reservas, reclamações e questões operacionais são encaminhadas para a equipa do cliente."] },
  { id: "meta", category: "Paid Media", title: "Meta Ads", intro: "Inclui configuração, gestão, públicos, implementação de criativos, copy, otimização, acompanhamento e reporting.", tiers: [
    { name: "Light", price: "150 €/mês", items: ["Até aproximadamente 2 campanhas ativas"] },
    { name: "Standard", price: "200 €/mês", items: ["Até aproximadamente 3 campanhas ativas"] },
    { name: "Pro", price: "250 €/mês", items: ["Até aproximadamente 4–5 campanhas ativas"] }
  ], notes: ["Investimento publicitário não incluído.", "Operações com volume de campanhas ou media spend significativamente superior são orçamentadas individualmente."] },
  { id: "google", category: "Search", title: "Google Ads", intro: "Inclui configuração, gestão, públicos, implementação de criativos e copy, otimização e reporting.", tiers: [
    { name: "Light", price: "300 €/mês", items: ["Até aproximadamente 2 campanhas ativas"] },
    { name: "Standard", price: "450 €/mês", items: ["Até aproximadamente 4 campanhas ativas"] },
    { name: "Pro", price: "600 €/mês", items: ["Até aproximadamente 6 campanhas ativas"] }
  ], notes: ["Investimento publicitário não incluído."] },
  { id: "chatgpt", category: "Paid Media", title: "ChatGPT Ads", tiers: [
    { name: "Light", price: "200 €/mês", items: ["Até aproximadamente 2 campanhas ativas"] },
    { name: "Standard", price: "275 €/mês", items: ["Até aproximadamente 4 campanhas ativas"] },
    { name: "Pro", price: "350 €/mês", items: ["Até aproximadamente 6 campanhas ativas"] }
  ], notes: ["O OpenAI Ads Manager encontra-se atualmente em beta, estando as funcionalidades, formatos e opções de segmentação sujeitos à evolução da plataforma. Investimento publicitário não incluído. Landing pages, implementação técnica avançada de tracking e integrações são orçamentadas separadamente quando necessário."] },
  { id: "ota", category: "Distribution", title: "OTA Ads / Metasearch", intro: "Inclui configuração, gestão, segmentação, ativos de campanha quando aplicável, otimização, acompanhamento e reporting.", tiers: [
    { name: "Light", price: "100 €/mês", items: ["Até aproximadamente 2 campanhas ativas"] },
    { name: "Standard", price: "125 €/mês", items: ["Até aproximadamente 3 campanhas ativas"] },
    { name: "Pro", price: "150 €/mês", items: ["Até aproximadamente 4 campanhas ativas"] }
  ], notes: ["Investimento nas plataformas não incluído. O âmbito final depende das OTAs, metasearch e soluções de distribuição utilizadas por cada unidade.", "Podemos executar campanhas nas OTAs; no entanto, a integração de preços e disponibilidade com os canais de metasearch deverá ser assegurada diretamente pelos developers ou pelo fornecedor responsável pelo motor de reservas de cada website."] },
  { id: "email", category: "CRM", title: "Email Marketing", intro: "Inclui criação/configuração, gestão das listas, estratégia de comunicação, automatismos, criativos, copy, otimização e reporting.", tiers: [
    { name: "Light", price: "150 €/mês", items: ["Estrutura simples", "1 automatização de comunicação", "2 campanhas promocionais por ano"] },
    { name: "Standard", price: "200 €/mês", items: ["Estrutura reforçada", "2 automatizações", "3 campanhas promocionais por ano"] },
    { name: "Pro", price: "250 €/mês", items: ["Estrutura avançada", "3 automatizações", "4 campanhas promocionais por ano"] }
  ], notes: ["Fee da plataforma de email marketing não incluída."] },
  { id: "seo", category: "Search", title: "SEO / AEO / GEO", intro: "Fase inicial: auditoria técnica, crawl, indexação, Search Console, pesquisa e intenção, concorrência, estrutura, metadata, internal linking, SEO local, dados estruturados quando aplicável, AEO/GEO e plano de implementação.", tiers: [
    { name: "Light", price: "Setup: 600 € · Manutenção: 150 €/mês", items: ["Monitorização, pequenas otimizações on-page, indexação, oportunidades de conteúdo, SEO local, AEO/GEO e reporting"] },
    { name: "Standard", price: "Setup: 800 € · Manutenção: 200 €/mês", items: ["Monitorização, pequenas otimizações on-page, indexação, oportunidades de conteúdo, SEO local, AEO/GEO e reporting"] },
    { name: "Pro", price: "Setup: 1.000 € · Manutenção: 250 €/mês", items: ["Monitorização, pequenas otimizações on-page, indexação, oportunidades de conteúdo, SEO local, AEO/GEO e reporting"] }
  ], notes: ["Não inclui desenvolvimento de grande dimensão, produção ilimitada de artigos, link building pago ou PR digital."] },
  { id: "influencer", category: "Influencer & PR", title: "Influencer Marketing", singlePrice: "350–500 € / ativação", singleItems: ["Pesquisa, validação, contacto, negociação, briefing, coordenação e acompanhamento de nano, micro e médios influenciadores", "Baseado numa campanha ou ativação específica"], notes: ["Não inclui fees dos creators, estadias, experiências ou outros custos associados."] },
  { id: "linkedin", category: "Influencer & PR", title: "LinkedIn", singlePrice: "Desde 200 €/mês", singleItems: ["Aplicável quando existir necessidade de comunicação corporate, MICE, eventos, recrutamento ou comunicação institucional."] },
  { id: "pr", category: "Influencer & PR", title: "Relações Públicas / PR", singleItems: ["Sugerimos que os serviços de Relações Públicas sejam assegurados por agências de PR especializadas. Da nossa parte, podemos complementar estas ações através de serviços de Influencer Marketing associados a campanhas ou ativações específicas."] }
];

export const portugalInvestmentCategories = ["Estratégia", "Conteúdo", "Social", "Paid Media", "Search", "Distribution", "CRM", "Influencer & PR"];
