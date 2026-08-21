import type { Locale } from "@/lib/i18n";

export type ServiceDetailCard = { title: string; body: string };
export type ServiceDetailStep = { number: string; title: string; body: string };
export type ServiceDetailFaq = { question: string; answer: string };
export type ServiceVisual = {
  kind: "campaign" | "journey" | "listing" | "search" | "gallery" | "social";
  eyebrow: string;
  title: string;
  body: string;
  stages: ServiceDetailCard[];
  note?: string;
  images?: { src: string; alt: string }[];
};

export type ServiceDetail = {
  heroDescription: string;
  audienceTitle: string;
  audienceBody: string;
  improveIntro: string;
  improvements: ServiceDetailCard[];
  deliverIntro: string;
  deliverables: ServiceDetailCard[];
  process: ServiceDetailStep[];
  visual: ServiceVisual;
  faqs: ServiceDetailFaq[];
  scopeNote?: string;
};

const visualImages = {
  strategy: [
    { src: "/images/gallery/28.jpg", alt: "Hospo campaign photography" },
    { src: "/images/gallery/21.jpg", alt: "Hospitality food and drink content" },
    { src: "/images/gallery/35.jpg", alt: "Hospitality campaign visual" }
  ],
  websites: [
    { src: "/images/gallery/1.4.jpg", alt: "Hotel presentation photography" },
    { src: "/images/gallery/14.jpg", alt: "Restaurant experience photography" },
    { src: "/images/gallery/10.jpg", alt: "Hospitality website visual asset" }
  ],
  photography: [
    { src: "/images/gallery/1.4.jpg", alt: "Hotel visual content" },
    { src: "/images/gallery/21.jpg", alt: "Restaurant visual content" },
    { src: "/images/gallery/28.jpg", alt: "Food and drink visual content" }
  ],
  social: [
    { src: "/images/gallery/8.jpg", alt: "Hospitality social media content" },
    { src: "/images/gallery/17.jpg", alt: "Hospitality content production" },
    { src: "/images/gallery/35.jpg", alt: "Hospitality campaign content" }
  ]
};

export const serviceDetails: Record<string, Record<Locale, ServiceDetail>> = {
  "strategy-campaigns": {
    en: {
      heroDescription: "Campaigns built around what you need to sell, from the commercial goal through to the creative, distribution and measurement.",
      audienceTitle: "For launches, seasons and commercial moments that need a clear reason to act.",
      audienceBody: "This is for hotels, restaurants, bars and F&B brands with a specific priority, whether that is a new opening, a festive period, a quieter month, a menu launch, a package or an experience worth promoting.",
      improveIntro: "We connect the commercial objective to the audience, offer and customer journey, before deciding what content or channels are needed.",
      improvements: [
        { title: "The objective", body: "Clarify what needs to move, such as reservations, bookings, covers, enquiries, sales or awareness." },
        { title: "The offer", body: "Shape a proposition that gives people a useful reason to choose now." },
        { title: "The journey", body: "Link creative, landing pages, social, email, search and paid activity to a clear next step." },
        { title: "Measurement", body: "Agree the signals that show whether the campaign is creating useful commercial progress." }
      ],
      deliverIntro: "Delivery is shaped around the priority in front of you. Hospo can lead the full campaign or strengthen the pieces that are holding it back.",
      deliverables: [
        { title: "Campaign strategy", body: "Commercial goal, audience, offer, message, timing and channel direction." },
        { title: "Creative direction", body: "A practical brief, photography, video and design assets that make the offer easy to understand." },
        { title: "Distribution", body: "Landing pages, email, social, paid media, Google and creator activity where useful." },
        { title: "Tracking & reporting", body: "A clear view of activity, response and the next improvements to make." }
      ],
      process: [
        { number: "01", title: "Define", body: "Set the commercial goal, audience, offer and evidence of success." },
        { number: "02", title: "Build", body: "Create the message, content, journey and channel plan around the campaign." },
        { number: "03", title: "Launch", body: "Put the right assets into the right places with a clear conversion route." },
        { number: "04", title: "Measure & refine", body: "Use response and performance to improve the campaign while it is live." }
      ],
      visual: { kind: "campaign", eyebrow: "Campaign journey", title: "A campaign works when every part supports the next.", body: "The strongest work does not start with a post. It starts with the commercial outcome and builds a route towards it.", stages: [{ title: "Goal", body: "What needs to move" }, { title: "Offer", body: "Why choose now" }, { title: "Creative", body: "What makes it clear" }, { title: "Distribution", body: "Where it is seen" }, { title: "Conversion", body: "How people act" }, { title: "Measurement", body: "What improves next" }], note: "Typical opportunities include Valentine’s, Christmas, summer, low season, new menus, hotel packages, private dining, spa experiences and new openings.", images: visualImages.strategy },
      faqs: [
        { question: "Can Hospo support one campaign rather than an ongoing retainer?", answer: "Yes. We can scope focused campaign support around a launch, seasonal period, product, event or commercial challenge." },
        { question: "Do you create the content as well as the strategy?", answer: "Yes. Depending on the brief, we can combine strategy with photography, video, design direction, landing pages and distribution assets." },
        { question: "Can you work with our in-house marketing team?", answer: "Yes. We can provide the strategy and key assets, then work alongside your internal team or existing suppliers." },
        { question: "Which channels can be included?", answer: "The mix can include website landing pages, email, social media, paid media, Google, creator activity and campaign reporting." }
      ]
    },
    pt: {
      heroDescription: "Campanhas criadas em torno do que precisa de vender, desde o objetivo comercial à criatividade, distribuição e análise de resultados.",
      audienceTitle: "Para lançamentos, épocas e momentos comerciais que precisam de uma razão clara para agir.",
      audienceBody: "Indicado para hotéis, restaurantes, bares e marcas F&B com uma prioridade concreta, como uma abertura, época festiva, mês mais calmo, lançamento de menu, pacote ou experiência a promover.",
      improveIntro: "Ligamos o objetivo comercial ao público, à oferta e ao percurso do cliente antes de decidir que conteúdos ou canais são necessários.",
      improvements: [
        { title: "O objetivo", body: "Clarificamos o que precisa de evoluir, como reservas, estadias, mesas, pedidos, contactos, vendas ou notoriedade." },
        { title: "A oferta", body: "Criamos uma proposta que dá às pessoas uma razão útil para escolher agora." },
        { title: "O percurso", body: "Ligamos criatividade, páginas de destino, redes sociais, email, pesquisa e publicidade a um próximo passo claro." },
        { title: "A medição", body: "Definimos os sinais que mostram se a campanha está a criar progresso comercial útil." }
      ],
      deliverIntro: "A entrega é adaptada à prioridade em causa. A Hospo pode liderar a campanha completa ou reforçar as partes que estão a limitar o resultado.",
      deliverables: [
        { title: "Estratégia de campanha", body: "Objetivo comercial, público, oferta, mensagem, timing e orientação de canais." },
        { title: "Direção criativa", body: "Um briefing prático, fotografia, vídeo e ativos visuais que tornam a oferta fácil de compreender." },
        { title: "Distribuição", body: "Páginas de destino, email, redes sociais, publicidade paga, Google e criadores quando faz sentido." },
        { title: "Medição e análise", body: "Uma visão clara da atividade, da resposta e das próximas melhorias." }
      ],
      process: [
        { number: "01", title: "Definir", body: "Definimos o objetivo comercial, o público, a oferta e os sinais de sucesso." },
        { number: "02", title: "Construir", body: "Criamos a mensagem, conteúdos, percurso e plano de canais da campanha." },
        { number: "03", title: "Lançar", body: "Colocamos os ativos certos nos lugares certos, com um caminho claro para conversão." },
        { number: "04", title: "Medir e melhorar", body: "Usamos a resposta e o desempenho para melhorar a campanha enquanto está ativa." }
      ],
      visual: { kind: "campaign", eyebrow: "Percurso da campanha", title: "Uma campanha funciona quando cada parte apoia a seguinte.", body: "O trabalho mais forte não começa numa publicação. Começa no resultado comercial e constrói um percurso até lá.", stages: [{ title: "Objetivo", body: "O que precisa de evoluir" }, { title: "Oferta", body: "Porque escolher agora" }, { title: "Criatividade", body: "O que torna a mensagem clara" }, { title: "Distribuição", body: "Onde será vista" }, { title: "Conversão", body: "Como as pessoas agem" }, { title: "Medição", body: "O que melhora a seguir" }], note: "Exemplos de oportunidades: Dia dos Namorados, Natal, verão, época baixa, novos menus, pacotes de hotel, jantares privados, experiências de spa e novas aberturas.", images: visualImages.strategy },
      faqs: [
        { question: "A Hospo pode apoiar apenas uma campanha, sem acompanhamento contínuo?", answer: "Sim. Podemos definir um projeto focado num lançamento, época, produto, evento ou desafio comercial específico." },
        { question: "Criam os conteúdos, além da estratégia?", answer: "Sim. Conforme o briefing, combinamos estratégia com fotografia, vídeo, direção criativa, páginas de destino e ativos de distribuição." },
        { question: "Podem trabalhar com a nossa equipa interna?", answer: "Sim. Podemos fornecer estratégia e ativos principais e trabalhar em conjunto com a sua equipa ou fornecedores atuais." },
        { question: "Que canais podem ser incluídos?", answer: "A combinação pode incluir páginas de destino, email, redes sociais, publicidade paga, Google, criadores e análise de campanha." }
      ]
    }
  },
  "websites-direct-booking": {
    en: {
      heroDescription: "Make it easier to understand, choose and book, reserve, enquire or order directly.",
      audienceTitle: "For businesses whose website is not doing enough to turn interest into action.",
      audienceBody: "This is for accommodation, restaurants, bars and F&B brands that need a clearer explanation of the experience, offer, location and next step, particularly on mobile.",
      improveIntro: "A useful website gives visitors confidence quickly, then removes friction from the route towards a booking, reservation, enquiry or purchase.",
      improvements: [
        { title: "Structure & UX", body: "Navigation and pages arranged around the questions people need answered before they choose." },
        { title: "Offer & messaging", body: "Clearer reasons to visit, stay, dine, buy or enquire, supported by the right visual proof." },
        { title: "Mobile conversion", body: "A fast, focused mobile journey with visible calls to action and less unnecessary friction." },
        { title: "Search readiness", body: "Useful page structure, metadata, internal linking and foundations for stronger visibility." }
      ],
      deliverIntro: "We can start with an audit and recommendation, or support a full website project from user journey to launch.",
      deliverables: [
        { title: "Audit & architecture", body: "Website review, UX priorities, sitemap, navigation and page structure." },
        { title: "Content & conversion", body: "Copy, offer pages, landing pages, calls to action and booking or reservation journey review." },
        { title: "Design & development", body: "Website design and development where this forms part of the agreed scope." },
        { title: "SEO & analytics foundations", body: "On-page SEO, tracking readiness and practical recommendations for ongoing improvement." }
      ],
      process: [
        { number: "01", title: "Discover", body: "Review the audience, commercial priority, current journey and evidence from the existing site." },
        { number: "02", title: "Structure", body: "Plan the information, pages and conversion routes before visual design begins." },
        { number: "03", title: "Create & implement", body: "Build the content, design, platform and booking or reservation connections." },
        { number: "04", title: "Measure & optimise", body: "Use real behaviour and performance to improve the pages that matter most." }
      ],
      visual: { kind: "journey", eyebrow: "Direct journey", title: "The route from discovery to action should feel obvious.", body: "Whether the next step is a direct booking, a table reservation, an enquiry or an order, the website should make it easy to see where to go.", stages: [{ title: "Search, Google, social or OTA", body: "Discovery" }, { title: "Website", body: "Understand the offer" }, { title: "Property, menu or experience", body: "Build confidence" }, { title: "Booking, reservation or enquiry", body: "Take action" }, { title: "Direct conversion", body: "Complete the next step" }], note: "For accommodation, the route can connect discovery to room and offer pages, the booking engine and a direct booking. For restaurants, it can connect to menus, reservations, enquiries or orders.", images: visualImages.websites },
      faqs: [
        { question: "Do you only build new websites?", answer: "No. We can audit and improve an existing website, create focused landing pages or scope a full redesign and development project." },
        { question: "Can you review our booking engine or reservation link?", answer: "Yes. We review how clearly the website moves people to the relevant booking, reservation, enquiry or ordering route." },
        { question: "Will the website be mobile-first?", answer: "Yes. Mobile experience is central because many guests discover and act from a phone." },
        { question: "Can you provide the website copy?", answer: "Yes. We can develop the core messaging, page copy and offer-led content as part of the website scope." }
      ]
    },
    pt: {
      heroDescription: "Facilite a compreensão, a escolha e a reserva, marcação, contacto ou compra direta.",
      audienceTitle: "Para negócios cujo website ainda não transforma interesse em ação suficiente.",
      audienceBody: "Indicado para alojamentos, restaurantes, bares e marcas F&B que precisam de explicar melhor a experiência, a oferta, a localização e o próximo passo, especialmente em mobile.",
      improveIntro: "Um website útil dá confiança rapidamente e reduz fricção no caminho para uma reserva, marcação, contacto ou compra.",
      improvements: [
        { title: "Estrutura e experiência", body: "Navegação e páginas organizadas pelas perguntas que as pessoas precisam de esclarecer antes de escolher." },
        { title: "Oferta e mensagem", body: "Razões mais claras para visitar, ficar, jantar, comprar ou contactar, apoiadas pela prova visual certa." },
        { title: "Conversão em mobile", body: "Um percurso mobile rápido e focado, com chamadas para ação visíveis e menos fricção." },
        { title: "Preparação para pesquisa", body: "Estrutura de páginas, metadados, ligações internas e bases para maior visibilidade." }
      ],
      deliverIntro: "Podemos começar com uma auditoria e recomendações ou apoiar um projeto completo, desde o percurso do utilizador até ao lançamento.",
      deliverables: [
        { title: "Auditoria e arquitetura", body: "Revisão do website, prioridades de experiência, mapa do site, navegação e estrutura de páginas." },
        { title: "Conteúdo e conversão", body: "Copy, páginas de oferta, páginas de destino, chamadas para ação e revisão do percurso de reserva ou marcação." },
        { title: "Design e desenvolvimento", body: "Design e desenvolvimento de website quando fazem parte do âmbito acordado." },
        { title: "Bases de SEO e analítica", body: "SEO on-page, preparação para tracking e recomendações práticas para melhoria contínua." }
      ],
      process: [
        { number: "01", title: "Descobrir", body: "Analisamos o público, a prioridade comercial, o percurso atual e os sinais do website existente." },
        { number: "02", title: "Estruturar", body: "Planeamos informação, páginas e percursos de conversão antes de iniciar o design visual." },
        { number: "03", title: "Criar e implementar", body: "Desenvolvemos conteúdos, design, plataforma e ligações de reserva ou marcação." },
        { number: "04", title: "Medir e otimizar", body: "Usamos comportamento e desempenho reais para melhorar as páginas mais importantes." }
      ],
      visual: { kind: "journey", eyebrow: "Percurso direto", title: "O caminho entre descoberta e ação deve ser óbvio.", body: "Seja uma reserva direta, marcação de mesa, contacto ou compra, o website deve tornar claro onde a pessoa deve seguir.", stages: [{ title: "Pesquisa, Google, redes sociais ou OTA", body: "Descoberta" }, { title: "Website", body: "Compreender a oferta" }, { title: "Alojamento, menu ou experiência", body: "Ganhar confiança" }, { title: "Reserva, marcação ou contacto", body: "Agir" }, { title: "Conversão direta", body: "Concluir o próximo passo" }], note: "No alojamento, o percurso pode ligar a descoberta a páginas de quartos e ofertas, ao motor de reservas e à reserva direta. Nos restaurantes, pode conduzir a menus, marcações, contactos ou pedidos.", images: visualImages.websites },
      faqs: [
        { question: "Só criam websites novos?", answer: "Não. Podemos auditar e melhorar um website existente, criar páginas de destino ou desenvolver um projeto completo de redesign e desenvolvimento." },
        { question: "Podem rever o motor de reservas ou a ligação de marcações?", answer: "Sim. Analisamos se o website conduz claramente às rotas de reserva, marcação, contacto ou compra relevantes." },
        { question: "O website será pensado primeiro para mobile?", answer: "Sim. A experiência em mobile é central porque muitos clientes descobrem e agem através do telemóvel." },
        { question: "Podem criar o copy do website?", answer: "Sim. Podemos desenvolver a mensagem principal, o copy das páginas e conteúdo centrado nas ofertas como parte do projeto." }
      ]
    }
  },
  "ota-optimisation": {
    en: {
      heroDescription: "Present your property as strongly as the experience itself, wherever guests compare accommodation.",
      audienceTitle: "For accommodation businesses that need their listings to reflect the standard of the stay.",
      audienceBody: "Guests compare rooms, images, amenities and descriptions quickly. Clear, consistent listing presentation helps a property earn consideration before rate and availability become the deciding factor.",
      improveIntro: "We focus on the presentation and content signals that help guests understand the property, the rooms and what makes the stay worth choosing.",
      improvements: [
        { title: "Listing clarity", body: "Property information, room naming, descriptions and amenities that are easy to compare." },
        { title: "Photography selection", body: "The strongest images, chosen and sequenced to show the experience with purpose." },
        { title: "Content consistency", body: "A clearer relationship between the OTA listing, website, Google profile and campaign material." },
        { title: "Journey review", body: "A practical view of where direct and OTA journeys support or confuse the guest." }
      ],
      deliverIntro: "The scope can begin with an audit, then move into prioritised content improvements and implementation support where agreed.",
      deliverables: [
        { title: "Listing audit", body: "Review the property page, rooms, amenities, descriptions and customer-facing details." },
        { title: "Image audit & order", body: "Assess photography quality, image selection and the sequence guests see first." },
        { title: "Content refinement", body: "Improve room presentation, amenity clarity and property descriptions." },
        { title: "Priority roadmap", body: "A useful list of changes, with before-and-after comparison where implementation is included." }
      ],
      process: [
        { number: "01", title: "Audit", body: "Review the listing through the lens of discovery, comparison and guest confidence." },
        { number: "02", title: "Prioritise", body: "Identify the content, image and information changes with the greatest practical value." },
        { number: "03", title: "Optimise", body: "Refine the selected assets and listing content within the agreed scope." },
        { number: "04", title: "Review", body: "Check consistency across the listing, website and other key guest touchpoints." }
      ],
      visual: { kind: "listing", eyebrow: "Listing anatomy", title: "The details guests compare should tell one clear story.", body: "A well-presented listing guides the eye from the property promise to the room details and booking decision.", stages: [{ title: "Hero sequence", body: "Lead with the strongest proof" }, { title: "Room names", body: "Make options easy to understand" }, { title: "Descriptions", body: "Explain what matters" }, { title: "Amenities", body: "Remove uncertainty" }, { title: "Property details", body: "Build comparison confidence" }, { title: "Booking route", body: "Keep the next step clear" }], note: "Hospo focuses on listing presentation, content consistency, photography and the digital booking journey. We do not provide full revenue management, daily pricing or inventory management." },
      scopeNote: "Hospo focuses on listing presentation, content consistency, photography and the digital booking journey. We do not provide full revenue management, daily pricing or inventory management.",
      faqs: [
        { question: "Do you manage daily pricing and inventory?", answer: "No. Hospo focuses on listing presentation, content consistency, photography and the digital booking journey rather than full revenue management." },
        { question: "Can you work with our existing OTA or revenue team?", answer: "Yes. We can provide the content, photography and presentation recommendations for your internal team or existing platform specialists to implement." },
        { question: "Which platforms can you review?", answer: "The review is tailored to the platforms most relevant to your property and target guests." },
        { question: "Can you also improve the direct booking journey?", answer: "Yes. We can review how the website and booking route work alongside the OTA presentation, without treating OTA visibility as a substitute for direct booking." }
      ]
    },
    pt: {
      heroDescription: "Apresente o seu alojamento com a mesma força da própria experiência, onde quer que os hóspedes comparem opções.",
      audienceTitle: "Para negócios de alojamento que precisam que os seus anúncios reflitam o nível da estadia.",
      audienceBody: "Os hóspedes comparam quartos, imagens, comodidades e descrições rapidamente. Uma apresentação clara e consistente ajuda a propriedade a ganhar consideração antes de preço e disponibilidade se tornarem decisivos.",
      improveIntro: "Focamo-nos nos sinais de apresentação e conteúdo que ajudam os hóspedes a compreender a propriedade, os quartos e o que torna a estadia relevante.",
      improvements: [
        { title: "Clareza do anúncio", body: "Informação da propriedade, nomes de quartos, descrições e comodidades fáceis de comparar." },
        { title: "Seleção de fotografia", body: "As imagens mais fortes, escolhidas e organizadas para mostrar a experiência com intenção." },
        { title: "Consistência de conteúdo", body: "Uma relação mais clara entre o anúncio OTA, website, perfil Google e materiais de campanha." },
        { title: "Revisão do percurso", body: "Uma visão prática de como os percursos direto e OTA ajudam ou confundem o hóspede." }
      ],
      deliverIntro: "O âmbito pode começar com uma auditoria e avançar para melhorias de conteúdo prioritárias e apoio à implementação quando acordado.",
      deliverables: [
        { title: "Auditoria do anúncio", body: "Revisão da página da propriedade, quartos, comodidades, descrições e detalhes visíveis ao cliente." },
        { title: "Auditoria e ordem das imagens", body: "Avaliação da qualidade da fotografia, seleção de imagens e sequência apresentada primeiro." },
        { title: "Ajuste de conteúdo", body: "Melhoria da apresentação de quartos, clareza de comodidades e descrições da propriedade." },
        { title: "Plano de prioridades", body: "Uma lista útil de alterações, com comparação antes e depois quando a implementação está incluída." }
      ],
      process: [
        { number: "01", title: "Auditar", body: "Analisamos o anúncio pela perspetiva de descoberta, comparação e confiança do hóspede." },
        { number: "02", title: "Priorizar", body: "Identificamos as alterações de conteúdo, imagem e informação com maior valor prático." },
        { number: "03", title: "Otimizar", body: "Ajustamos os ativos selecionados e o conteúdo do anúncio dentro do âmbito acordado." },
        { number: "04", title: "Rever", body: "Verificamos a consistência entre o anúncio, website e outros momentos essenciais da jornada." }
      ],
      visual: { kind: "listing", eyebrow: "Anatomia do anúncio", title: "Os detalhes que os hóspedes comparam devem contar uma história clara.", body: "Um anúncio bem apresentado orienta o olhar da promessa da propriedade aos detalhes do quarto e à decisão de reserva.", stages: [{ title: "Sequência principal", body: "Começar com a melhor prova" }, { title: "Nomes dos quartos", body: "Tornar opções fáceis de entender" }, { title: "Descrições", body: "Explicar o que importa" }, { title: "Comodidades", body: "Reduzir incerteza" }, { title: "Detalhes da propriedade", body: "Dar confiança na comparação" }, { title: "Rota de reserva", body: "Manter o próximo passo claro" }], note: "A Hospo foca-se na apresentação do anúncio, consistência de conteúdo, fotografia e percurso digital de reserva. Não fornecemos gestão completa de receitas, preços diários ou gestão de inventário." },
      scopeNote: "A Hospo foca-se na apresentação do anúncio, consistência de conteúdo, fotografia e percurso digital de reserva. Não fornecemos gestão completa de receitas, preços diários ou gestão de inventário.",
      faqs: [
        { question: "Gerem preços diários e inventário?", answer: "Não. A Hospo trabalha a apresentação do anúncio, consistência de conteúdo, fotografia e percurso digital de reserva, não a gestão completa de receitas." },
        { question: "Podem trabalhar com a nossa equipa de OTAs ou revenue management?", answer: "Sim. Podemos fornecer recomendações de conteúdo, fotografia e apresentação para a sua equipa interna ou especialistas de plataforma implementarem." },
        { question: "Que plataformas podem rever?", answer: "A revisão é adaptada às plataformas mais relevantes para a propriedade e para os hóspedes que pretende alcançar." },
        { question: "Também podem melhorar o percurso de reserva direta?", answer: "Sim. Podemos rever como o website e a rota de reserva funcionam em conjunto com a apresentação nas OTAs, sem tratar as OTAs como substituto da reserva direta." }
      ]
    }
  },
  "seo-google-visibility": {
    en: {
      heroDescription: "Be easier to find when guests are actively looking for the experience, location or offer you provide.",
      audienceTitle: "For businesses that need search visibility to lead somewhere useful.",
      audienceBody: "SEO is not only about rankings. It is about being present in the right moments, giving people a relevant page or profile, then helping them take the next step.",
      improveIntro: "We look at the relationship between website SEO, Google visibility and content that answers real search intent.",
      improvements: [
        { title: "Website SEO", body: "Page structure, metadata, internal linking, local relevance and content gaps." },
        { title: "Google visibility", body: "Google Business Profile, local signals, reputation context and how the listing supports discovery." },
        { title: "Search-informed content", body: "Useful pages and topics built around what people are actively trying to find." },
        { title: "Conversion connection", body: "A clearer route from search result or Maps listing to a relevant website action." }
      ],
      deliverIntro: "The work can be a focused visibility audit, a structured improvement plan or hands-on implementation alongside your team.",
      deliverables: [
        { title: "SEO audit & research", body: "Technical and on-page review, search intent, competitors and visibility opportunities." },
        { title: "Website structure", body: "Metadata, page recommendations, internal linking and content priorities." },
        { title: "Google profile support", body: "Review of public local listing signals, category relevance and content consistency." },
        { title: "Reporting direction", body: "Practical measures for visibility, enquiries, bookings, reservations or commercial action." }
      ],
      process: [
        { number: "01", title: "Research", body: "Understand current visibility, search intent, local context and the strongest opportunities." },
        { number: "02", title: "Structure", body: "Prioritise pages, metadata, content and Google visibility work around commercial value." },
        { number: "03", title: "Implement", body: "Make the agreed changes directly or provide clear guidance for your team." },
        { number: "04", title: "Monitor & improve", body: "Review performance signals and keep refining the areas that matter." }
      ],
      visual: { kind: "search", eyebrow: "Search journey", title: "Search visibility only matters when it leads to a useful next step.", body: "Good SEO joins the question people ask with the page, profile or offer that can answer it.", stages: [{ title: "Search", body: "Intent begins" }, { title: "Google & Maps", body: "Visibility and trust" }, { title: "Relevant page or listing", body: "Answer the need" }, { title: "Website", body: "Build confidence" }, { title: "Booking, reservation or enquiry", body: "Move to action" }] },
      faqs: [
        { question: "How quickly will SEO results appear?", answer: "Search improvement takes time and depends on the current site, competition and implementation. We focus first on useful, measurable priorities rather than unrealistic promises." },
        { question: "Can you optimise our Google Business Profile?", answer: "Yes. We can review public profile signals, content consistency and how the listing supports discovery and action." },
        { question: "Do you write SEO content?", answer: "Yes. Where it supports a real search need, we can plan and create pages, landing content and supporting website copy." },
        { question: "Is SEO separate from a website project?", answer: "It can be. SEO foundations are often included in a website scope, while ongoing SEO and Google visibility can also be supported separately." }
      ]
    },
    pt: {
      heroDescription: "Seja mais fácil de encontrar quando os hóspedes procuram ativamente a experiência, localização ou oferta que disponibiliza.",
      audienceTitle: "Para negócios que precisam que a visibilidade em pesquisa conduza a algo útil.",
      audienceBody: "SEO não é apenas sobre posições. É estar presente nos momentos certos, mostrar uma página ou perfil relevante e ajudar a pessoa a dar o próximo passo.",
      improveIntro: "Analisamos a relação entre SEO do website, visibilidade no Google e conteúdo que responde à intenção real de pesquisa.",
      improvements: [
        { title: "SEO do website", body: "Estrutura de páginas, metadados, ligações internas, relevância local e lacunas de conteúdo." },
        { title: "Visibilidade no Google", body: "Perfil de Empresa Google, sinais locais, contexto de reputação e apoio à descoberta." },
        { title: "Conteúdo informado por pesquisa", body: "Páginas e temas úteis criados a partir do que as pessoas estão realmente a procurar." },
        { title: "Ligação à conversão", body: "Um percurso mais claro entre o resultado de pesquisa ou Maps e uma ação relevante no website." }
      ],
      deliverIntro: "O trabalho pode ser uma auditoria focada, um plano estruturado de melhoria ou implementação prática em colaboração com a sua equipa.",
      deliverables: [
        { title: "Auditoria e pesquisa SEO", body: "Revisão técnica e on-page, intenção de pesquisa, concorrentes e oportunidades de visibilidade." },
        { title: "Estrutura do website", body: "Metadados, recomendações de páginas, ligações internas e prioridades de conteúdo." },
        { title: "Apoio ao perfil Google", body: "Revisão de sinais públicos da ficha local, relevância de categorias e consistência de conteúdo." },
        { title: "Orientação de análise", body: "Métricas práticas de visibilidade, contactos, reservas, marcações ou ação comercial." }
      ],
      process: [
        { number: "01", title: "Pesquisar", body: "Compreendemos a visibilidade atual, intenção de pesquisa, contexto local e oportunidades principais." },
        { number: "02", title: "Estruturar", body: "Priorizamos páginas, metadados, conteúdo e visibilidade no Google com base no valor comercial." },
        { number: "03", title: "Implementar", body: "Aplicamos as alterações acordadas ou fornecemos orientação clara para a sua equipa." },
        { number: "04", title: "Monitorizar e melhorar", body: "Revemos os sinais de desempenho e continuamos a melhorar as áreas mais importantes." }
      ],
      visual: { kind: "search", eyebrow: "Percurso de pesquisa", title: "A visibilidade em pesquisa só importa quando conduz a um próximo passo útil.", body: "Um bom SEO liga a pergunta da pessoa à página, perfil ou oferta capaz de lhe responder.", stages: [{ title: "Pesquisa", body: "A intenção começa" }, { title: "Google e Maps", body: "Visibilidade e confiança" }, { title: "Página ou anúncio relevante", body: "Responder à necessidade" }, { title: "Website", body: "Ganhar confiança" }, { title: "Reserva, marcação ou contacto", body: "Agir" }] },
      faqs: [
        { question: "Quando é que os resultados de SEO começam a aparecer?", answer: "A melhoria em pesquisa exige tempo e depende do website atual, concorrência e implementação. Focamo-nos primeiro em prioridades úteis e mensuráveis." },
        { question: "Podem otimizar o Perfil de Empresa Google?", answer: "Sim. Podemos rever sinais públicos do perfil, consistência de conteúdo e a forma como a ficha apoia descoberta e ação." },
        { question: "Criam conteúdo SEO?", answer: "Sim. Quando responde a uma necessidade real de pesquisa, podemos planear e criar páginas, conteúdo de destino e copy de apoio." },
        { question: "SEO é separado de um projeto de website?", answer: "Pode ser. As bases de SEO são frequentemente incluídas num website, mas o SEO contínuo e a visibilidade no Google também podem ser trabalhados separadamente." }
      ]
    }
  },
  "photography-video": {
    en: {
      heroDescription: "Visual content built for the places guests actually make decisions, from the first image they notice to the page where they book or reserve.",
      audienceTitle: "For brands that need their real experience to be seen, felt and understood online.",
      audienceBody: "Guests look for atmosphere, people, rooms, food, drink, details and proof before they choose. The right visual library makes the experience easier to recognise across every channel.",
      improveIntro: "We create visual assets with a practical role, not simply a collection of attractive images.",
      improvements: [
        { title: "Experience", body: "Show the atmosphere, service, people and details that make the business distinct." },
        { title: "Offer", body: "Make rooms, menus, products, packages and experiences easier to understand and desire." },
        { title: "Channel fit", body: "Plan assets for website, social, campaigns, Google, OTAs, press and sales materials." },
        { title: "Consistency", body: "Build a visual library that feels connected across the places guests compare." }
      ],
      deliverIntro: "Each production is scoped around the commercial use of the content, with a clear plan for where the assets will work hardest.",
      deliverables: [
        { title: "Photography", body: "Hotel, stay, restaurant, food, drink, lifestyle, people, details and campaign imagery." },
        { title: "Video & short-form", body: "Brand films, experience video, social cuts, reels and launch-ready content." },
        { title: "Production direction", body: "Briefing, shot planning, styling direction, production coordination and talent guidance where needed." },
        { title: "Edited asset library", body: "A selected, edited library organised for the website, campaign, social and listing requirements." }
      ],
      process: [
        { number: "01", title: "Brief", body: "Define the business priority, target audience, channels and role of the visual work." },
        { number: "02", title: "Plan", body: "Build the shot list, production schedule, styling and practical preparation." },
        { number: "03", title: "Produce", body: "Capture the experience with direction that keeps the commercial purpose in view." },
        { number: "04", title: "Edit & deliver", body: "Select, refine and deliver the assets in formats that make them useful after the shoot." }
      ],
      visual: { kind: "gallery", eyebrow: "Visual storytelling", title: "Content for the moments people decide if the experience is for them.", body: "The strongest visual work gives people a feeling of the place while also answering practical questions about what they can expect.", stages: [{ title: "Hotels & stays", body: "Rooms, property, atmosphere, people and experience." }, { title: "Restaurants & F&B", body: "Food, drink, service, occasions, menus and venue atmosphere." }, { title: "Campaign assets", body: "Focused visual stories for launches, offers, seasons and events." }], images: visualImages.photography },
      faqs: [
        { question: "Do you work with hotels and restaurants?", answer: "Yes. Hospo produces content for hotels, stays, restaurants, bars, food-led venues and F&B brands." },
        { question: "Can you create both photography and video in one production?", answer: "Yes. We can scope photography, video and short-form content together where that makes the production more efficient." },
        { question: "Will we receive content for social media as well as the website?", answer: "Yes. The shot plan and delivery formats can be shaped around website, social, campaigns, OTAs, Google and other agreed uses." },
        { question: "Do you arrange the production?", answer: "We can support briefing, shot planning, styling direction, schedules and practical production coordination as part of the scope." }
      ]
    },
    pt: {
      heroDescription: "Conteúdo visual criado para os momentos em que os hóspedes tomam decisões, desde a primeira imagem que veem até à página onde reservam ou marcam.",
      audienceTitle: "Para marcas que precisam que a sua experiência real seja vista, sentida e compreendida online.",
      audienceBody: "Os hóspedes procuram ambiente, pessoas, quartos, comida, bebida, detalhes e prova antes de escolher. Uma boa biblioteca visual torna a experiência mais reconhecível em todos os canais.",
      improveIntro: "Criamos ativos visuais com uma função prática, não apenas uma coleção de imagens bonitas.",
      improvements: [
        { title: "Experiência", body: "Mostramos ambiente, serviço, pessoas e detalhes que tornam o negócio distinto." },
        { title: "Oferta", body: "Tornamos quartos, menus, produtos, pacotes e experiências mais fáceis de compreender e desejar." },
        { title: "Adequação ao canal", body: "Planeamos ativos para website, redes sociais, campanhas, Google, OTAs, imprensa e materiais comerciais." },
        { title: "Consistência", body: "Criamos uma biblioteca visual que se sente ligada nos locais onde os hóspedes comparam." }
      ],
      deliverIntro: "Cada produção é definida pelo uso comercial do conteúdo, com um plano claro para onde os ativos terão mais impacto.",
      deliverables: [
        { title: "Fotografia", body: "Hotel, alojamento, restaurante, comida, bebida, lifestyle, pessoas, detalhes e imagens de campanha." },
        { title: "Vídeo e formato curto", body: "Filmes de marca, vídeo de experiência, cortes para redes sociais, reels e conteúdos para lançamento." },
        { title: "Direção de produção", body: "Briefing, plano de captação, direção de styling, coordenação de produção e orientação de talento quando necessário." },
        { title: "Biblioteca editada", body: "Uma seleção editada e organizada para os requisitos de website, campanha, redes sociais e anúncios." }
      ],
      process: [
        { number: "01", title: "Brief", body: "Definimos a prioridade do negócio, público, canais e papel do trabalho visual." },
        { number: "02", title: "Planear", body: "Criamos a lista de captação, agenda de produção, styling e preparação prática." },
        { number: "03", title: "Produzir", body: "Captamos a experiência com direção que mantém o objetivo comercial em vista." },
        { number: "04", title: "Editar e entregar", body: "Selecionamos, refinamos e entregamos ativos em formatos que permanecem úteis depois da produção." }
      ],
      visual: { kind: "gallery", eyebrow: "Narrativa visual", title: "Conteúdo para os momentos em que as pessoas decidem se a experiência é para elas.", body: "O trabalho visual mais forte transmite a sensação do lugar e responde a perguntas práticas sobre o que podem esperar.", stages: [{ title: "Hotéis e alojamentos", body: "Quartos, propriedade, ambiente, pessoas e experiência." }, { title: "Restaurantes e F&B", body: "Comida, bebida, serviço, ocasiões, menus e ambiente." }, { title: "Ativos de campanha", body: "Histórias visuais focadas em lançamentos, ofertas, épocas e eventos." }], images: visualImages.photography },
      faqs: [
        { question: "Trabalham com hotéis e restaurantes?", answer: "Sim. A Hospo produz conteúdo para hotéis, alojamentos, restaurantes, bares, espaços de comida e bebida e marcas F&B." },
        { question: "Podem criar fotografia e vídeo na mesma produção?", answer: "Sim. Podemos incluir fotografia, vídeo e conteúdo de formato curto quando isso torna a produção mais eficiente." },
        { question: "Recebemos conteúdo para redes sociais e website?", answer: "Sim. O plano de captação e formatos de entrega podem ser pensados para website, redes sociais, campanhas, OTAs, Google e outros usos acordados." },
        { question: "Organizam a produção?", answer: "Podemos apoiar briefing, plano de captação, direção de styling, agendas e coordenação prática de produção como parte do projeto." }
      ]
    }
  },
  "social-media": {
    en: {
      heroDescription: "Stay visible, relevant and connected to commercial priorities, with social activity that has a clear role beyond regular posting.",
      audienceTitle: "For businesses that need social media to support demand, not simply fill a calendar.",
      audienceBody: "A useful social presence helps potential guests recognise the experience, understand the offer and keep the business in mind when the right moment to choose arrives.",
      improveIntro: "We turn social activity into a clearer mix of content themes, campaign moments and practical optimisation.",
      improvements: [
        { title: "Strategy & priorities", body: "Set the role of each channel around visibility, trust, offers, events, community or demand." },
        { title: "Content pillars", body: "Create a useful balance of experience, food, rooms, people, offers, proof and reasons to return." },
        { title: "Planning & publishing", body: "Build a realistic cadence, content calendar and publishing process that your brand can sustain." },
        { title: "Reporting & optimisation", body: "Review what is resonating and use the learning to improve creative, format and focus." }
      ],
      deliverIntro: "Support can cover a channel strategy, a monthly content rhythm, campaign delivery or a combined content and social programme.",
      deliverables: [
        { title: "Social strategy", body: "Channel roles, audience, content pillars, tone, cadence and commercial priorities." },
        { title: "Content planning", body: "Monthly calendars, campaign moments, briefs, publishing plans and creator integration." },
        { title: "Creation & publishing", body: "Photography, video, copy, platform-ready edits and publishing support within the agreed scope." },
        { title: "Performance review", body: "Reporting that turns platform signals into useful next decisions." }
      ],
      process: [
        { number: "01", title: "Strategy", body: "Set the commercial role, audience, channel priorities and content themes." },
        { number: "02", title: "Plan", body: "Create a workable calendar around offers, events, seasons and the rhythm of the business." },
        { number: "03", title: "Create & publish", body: "Produce and place content that makes the experience easy to recognise and respond to." },
        { number: "04", title: "Measure & optimise", body: "Use content response and commercial context to improve the next cycle." }
      ],
      visual: { kind: "social", eyebrow: "Content with a role", title: "A stronger feed starts with a clearer reason for every piece of content.", body: "The best social activity connects the visual world of the brand with useful commercial moments, not just a schedule of posts.", stages: [{ title: "Experience", body: "Give people a reason to notice" }, { title: "Offer", body: "Make the next occasion clear" }, { title: "Proof", body: "Build confidence through detail and consistency" }, { title: "Action", body: "Guide people to book, reserve, enquire or visit" }], note: "Where relevant and verified, Hospo social work has delivered approximately 131K views and approximately 400 new followers over seven days for a client campaign. Results vary by brand, audience, offer and activity.", images: visualImages.social },
      faqs: [
        { question: "Do you manage social media every month?", answer: "Yes. We can provide ongoing social media planning, content creation, publishing and optimisation where this is the right fit." },
        { question: "Can social media support campaigns and launches?", answer: "Yes. Social can be planned around seasonal offers, menu launches, packages, events and other commercial moments." },
        { question: "Do you create the photography and video?", answer: "Yes. Hospo can combine a social programme with photography, video and platform-ready content production." },
        { question: "Which channels do you support?", answer: "The channel mix is selected around the audience and commercial objective, rather than treating every platform as a priority." }
      ]
    },
    pt: {
      heroDescription: "Mantenha-se visível, relevante e ligado às prioridades comerciais, com redes sociais que têm uma função clara para além de publicar regularmente.",
      audienceTitle: "Para negócios que precisam que as redes sociais apoiem procura, não apenas preencham um calendário.",
      audienceBody: "Uma presença útil nas redes sociais ajuda potenciais hóspedes a reconhecer a experiência, compreender a oferta e lembrar-se do negócio quando chega o momento de escolher.",
      improveIntro: "Transformamos a atividade social numa combinação mais clara de temas de conteúdo, momentos de campanha e otimização prática.",
      improvements: [
        { title: "Estratégia e prioridades", body: "Definimos o papel de cada canal em visibilidade, confiança, ofertas, eventos, comunidade ou procura." },
        { title: "Pilares de conteúdo", body: "Criamos um equilíbrio útil entre experiência, comida, quartos, pessoas, ofertas, prova e razões para regressar." },
        { title: "Planeamento e publicação", body: "Construímos um ritmo, calendário e processo de publicação realistas para a marca manter." },
        { title: "Análise e otimização", body: "Revemos o que está a resultar e usamos essa aprendizagem para melhorar criatividade, formato e foco." }
      ],
      deliverIntro: "O apoio pode incluir estratégia de canais, um ritmo mensal de conteúdo, entrega de campanhas ou um programa integrado de conteúdo e redes sociais.",
      deliverables: [
        { title: "Estratégia de redes sociais", body: "Papel dos canais, público, pilares de conteúdo, tom, ritmo e prioridades comerciais." },
        { title: "Planeamento de conteúdo", body: "Calendários mensais, momentos de campanha, briefings, planos de publicação e integração de criadores." },
        { title: "Criação e publicação", body: "Fotografia, vídeo, copy, edições prontas para plataforma e apoio à publicação dentro do âmbito acordado." },
        { title: "Revisão de desempenho", body: "Análise que transforma sinais das plataformas em decisões úteis." }
      ],
      process: [
        { number: "01", title: "Estratégia", body: "Definimos a função comercial, público, prioridades de canal e temas de conteúdo." },
        { number: "02", title: "Planear", body: "Criamos um calendário viável em torno de ofertas, eventos, épocas e ritmo do negócio." },
        { number: "03", title: "Criar e publicar", body: "Produzimos e colocamos conteúdo que torna a experiência fácil de reconhecer e responder." },
        { number: "04", title: "Medir e otimizar", body: "Usamos resposta ao conteúdo e contexto comercial para melhorar o ciclo seguinte." }
      ],
      visual: { kind: "social", eyebrow: "Conteúdo com função", title: "Um feed mais forte começa com uma razão mais clara para cada peça de conteúdo.", body: "A melhor atividade social liga o universo visual da marca a momentos comerciais úteis, não apenas a um calendário de publicações.", stages: [{ title: "Experiência", body: "Dar uma razão para reparar" }, { title: "Oferta", body: "Tornar clara a próxima ocasião" }, { title: "Prova", body: "Criar confiança através de detalhe e consistência" }, { title: "Ação", body: "Orientar para reservar, marcar, contactar ou visitar" }], note: "Quando relevante e verificado, o trabalho social da Hospo gerou aproximadamente 131 mil visualizações e aproximadamente 400 novos seguidores em sete dias para uma campanha de cliente. Os resultados variam conforme marca, público, oferta e atividade.", images: visualImages.social },
      faqs: [
        { question: "Fazem gestão mensal de redes sociais?", answer: "Sim. Podemos prestar planeamento, criação de conteúdo, publicação e otimização contínuos quando é o modelo adequado." },
        { question: "As redes sociais podem apoiar campanhas e lançamentos?", answer: "Sim. Podem ser planeadas em torno de ofertas sazonais, lançamentos de menu, pacotes, eventos e outros momentos comerciais." },
        { question: "Criam fotografia e vídeo?", answer: "Sim. A Hospo pode combinar um programa de redes sociais com fotografia, vídeo e produção de conteúdos prontos para plataforma." },
        { question: "Que canais apoiam?", answer: "A combinação de canais é escolhida conforme o público e o objetivo comercial, sem tratar todas as plataformas como prioridade." }
      ]
    }
  }
};
