import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Linkedin, Mail, MapPin } from "lucide-react";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import { Reveal } from "@/components/Reveal";
import { TiagoBastosHero } from "@/components/TiagoBastosHero";
import { MosaicGallery } from "@/components/MosaicGallery";
import { imageFolders, photoGalleryImageText } from "@/data/images";
import { getPublicImageList } from "@/lib/imageFolders";
import { localizedPath, type Locale } from "@/lib/i18n";
import type { CaseStudy } from "@/types/caseStudy";

type Props = { locale: Locale; caseStudies: CaseStudy[] };

const content = {
  en: {
    eyebrow: "HOSPITALITY · FOOD & DRINK · VIDEO",
    title: "Photographer & Videographer for Hotels, Restaurants, Bars & Food Brands",
    intro: "I create professional photography, video and social-first content for hotels, resorts, restaurants, bars and food & drink brands across Portugal and the UK, with selected international productions available.",
    supporting: "Based in Portugal, with projects across the Algarve, Lisbon, Birmingham, the West Midlands, London and beyond.",
    location: "PORTUGAL · UK · INTERNATIONAL",
    enquire: "Enquire About a Shoot",
    work: "View My Work",
    startingEyebrow: "THE STARTING POINT",
    startingTitle: "People often experience your business online before they experience it in person.",
    startingBody: "For hotels, restaurants and food & drink brands, photography and video often shape the first impression long before someone books a room, reserves a table or chooses a product.",
    startingSupporting: "The content needs to communicate the quality, atmosphere, detail and experience people can expect in real life.",
    servicesEyebrow: "WHAT I CREATE",
    servicesTitle: "Visual content with a commercial purpose.",
    processEyebrow: "HOW I WORK",
    processTitle: "More than taking pictures.",
    processBody: "A clear production process keeps the work focused on the commercial objective, practical to deliver and useful after the shoot.",
    galleryEyebrow: "VISUAL STORYTELLING",
    galleryTitle: "Content that makes people want to experience the business for themselves.",
    galleryBody: "Photography should capture the guest experience, atmosphere, food, drinks, people, spaces, details and lifestyle that make a business worth visiting.",
    workEyebrow: "SELECTED COMMERCIAL WORK",
    workTitle: "Projects made for real businesses.",
    workIntro: "Hotel, restaurant and food & drink photography and video made to show the experience clearly and work across the channels where people discover and decide.",
    viewProject: "View project",
    experienceEyebrow: "HOSPITALITY EXPERIENCE",
    experienceTitle: "Hospitality experience behind the camera.",
    experience: "Before moving into professional photography and video, I spent around 15 years working inside hospitality and food & beverage environments across Portugal and the UK. That background helps me understand service, guest experience, operational timing and how hotels, restaurants and F&B businesses actually work. It means I approach a shoot not only as a photographer or videographer, but with an understanding of the business behind the content.",
    geographyEyebrow: "WHERE I WORK",
    geographyTitle: "Photography & Video Across Portugal and the UK",
    testimonialsEyebrow: "CLIENT FEEDBACK",
    testimonialsTitle: "Trusted by teams who care about the result.",
    faqEyebrow: "FAQ",
    faqTitle: "Practical questions before booking a shoot.",
    ctaEyebrow: "LET’S WORK TOGETHER",
    ctaTitle: "Planning a hotel, restaurant or food & drink shoot?",
    ctaBody: "Tell me about the business, location and content you need. I’ll recommend the most suitable photography and video approach.",
    cta: "Enquire About a Shoot",
    email: "Email me",
    linkedin: "LinkedIn",
    backToHospo: "Hospo Creative"
  },
  pt: {
    eyebrow: "HOTELARIA · RESTAURAÇÃO · VÍDEO",
    title: "Fotografia e Vídeo para Hotéis, Restaurantes, Bares e Marcas de Alimentação e Bebidas",
    intro: "Crio fotografia, vídeo e conteúdo para redes sociais para hotéis, resorts, restaurantes, bares e marcas de alimentação e bebidas em Portugal e no Reino Unido, com disponibilidade para projetos internacionais.",
    supporting: "Disponível para produções no Algarve, Lisboa e em todo o país, assim como em Birmingham, West Midlands, Londres e outras regiões do Reino Unido.",
    location: "PORTUGAL · REINO UNIDO · INTERNACIONAL",
    enquire: "Pedir proposta",
    work: "Ver projetos",
    startingEyebrow: "O PONTO DE PARTIDA",
    startingTitle: "As pessoas conhecem muitas vezes o seu negócio online antes de o conhecerem presencialmente.",
    startingBody: "O primeiro contacto com um hotel, restaurante ou marca acontece muitas vezes através de uma fotografia ou vídeo.",
    startingSupporting: "O conteúdo precisa de transmitir a qualidade, o ambiente, os detalhes e a experiência que o cliente pode esperar quando visita, reserva ou compra.",
    servicesEyebrow: "O QUE CRIO",
    servicesTitle: "Conteúdo visual com objetivo comercial.",
    processEyebrow: "COMO TRABALHO",
    processTitle: "Mais do que tirar fotografias.",
    processBody: "Um processo de produção claro mantém o trabalho focado no objetivo comercial, prático de produzir e útil depois da sessão.",
    galleryEyebrow: "NARRATIVA VISUAL",
    galleryTitle: "Conteúdo que ajuda o cliente a imaginar a experiência antes de chegar.",
    galleryBody: "A fotografia deve captar a experiência do cliente, o ambiente, a gastronomia, as bebidas, as pessoas, os espaços, os detalhes e o lifestyle que fazem um negócio valer a visita.",
    workEyebrow: "TRABALHO COMERCIAL SELECIONADO",
    workTitle: "Projetos para negócios reais.",
    workIntro: "Fotografia e vídeo para hotéis, restaurantes e alimentação e bebidas, feitos para mostrar a experiência com clareza nos canais onde as pessoas descobrem e decidem.",
    viewProject: "Ver projeto",
    experienceEyebrow: "EXPERIÊNCIA EM HOTELARIA E RESTAURAÇÃO",
    experienceTitle: "Experiência em hotelaria e restauração por detrás da câmara.",
    experience: "Antes de trabalhar profissionalmente em fotografia e vídeo, passei cerca de 15 anos dentro da hotelaria e restauração em Portugal e no Reino Unido. Essa experiência ajuda-me a compreender serviço, experiência do cliente, operação e a realidade por detrás de um hotel ou restaurante. Por isso, não abordo uma produção apenas como fotógrafo ou videógrafo. Compreendo também o negócio que o conteúdo precisa de representar.",
    geographyEyebrow: "ONDE TRABALHO",
    geographyTitle: "Fotografia e Vídeo em Portugal e no Reino Unido",
    testimonialsEyebrow: "OPINIÃO DE CLIENTES",
    testimonialsTitle: "Escolhido por equipas que valorizam o resultado.",
    faqEyebrow: "PERGUNTAS FREQUENTES",
    faqTitle: "Questões práticas antes de marcar uma sessão.",
    ctaEyebrow: "VAMOS TRABALHAR EM CONJUNTO",
    ctaTitle: "A planear uma sessão para o seu hotel, restaurante ou marca?",
    ctaBody: "Conte-me um pouco sobre o negócio, localização e conteúdo de que precisa. Posso recomendar a abordagem de fotografia e vídeo mais adequada.",
    cta: "Pedir proposta",
    email: "Enviar email",
    linkedin: "LinkedIn",
    backToHospo: "Hospo Creative"
  }
} as const;

const services = {
  en: [
    ["01", "Hotels & Resorts", "Hotel and resort photography, rooms, suites, interiors, architecture, pools, amenities, lifestyle, guest experience, food & beverage, promotional films and social-first video."],
    ["02", "Restaurants & Food", "Restaurant photography, food photography, menus, dishes, chefs, kitchens, service, atmosphere, interiors, promotional video and social-first content."],
    ["03", "Bars, Drinks & F&B Brands", "Cocktail, beverage and bar photography, bartender content, product photography, launches, campaigns, lifestyle imagery, promotional video and social media assets."],
    ["04", "Video & Social Content", "Reels, TikTok, short-form vertical video, promotional films, campaign assets, website video and practical content libraries for hospitality and food & drink businesses."]
  ],
  pt: [
    ["01", "Hotéis e Resorts", "Fotografia de hotéis e resorts, quartos, suites, interiores, arquitetura, piscinas, comodidades, lifestyle, experiência do cliente, alimentação e bebidas, filmes promocionais e vídeo para redes sociais."],
    ["02", "Restaurantes e Gastronomia", "Fotografia de restaurantes, gastronomia, menus, pratos, chefs, cozinha, serviço, ambiente, interiores, vídeo promocional e conteúdo para redes sociais."],
    ["03", "Bares, Bebidas e Marcas de Alimentação e Bebidas", "Fotografia de cocktails, bebidas e bares, conteúdo com bartenders, fotografia de produto, lançamentos, campanhas, lifestyle, vídeo promocional e assets para redes sociais."],
    ["04", "Vídeo e Conteúdo para Redes Sociais", "Reels, TikTok, vídeo vertical e short-form, filmes promocionais, conteúdo de campanha, vídeo para website e bibliotecas de conteúdo para hotelaria e restauração."]
  ]
} as const;

const secondaryServices = {
  en: {
    eyebrow: "SELECTED COMMERCIAL PROJECTS",
    title: "Also Available for Selected Commercial Projects",
    items: [
      ["Corporate Events", "Photography and video for conferences, launches, awards, networking events and branded events."],
      ["Property & Interiors", "Photography and video for interiors, hospitality property, villas and selected commercial property projects."]
    ]
  },
  pt: {
    eyebrow: "PROJETOS COMERCIAIS SELECIONADOS",
    title: "Também Disponível para Projetos Comerciais Selecionados",
    items: [
      ["Eventos Corporativos", "Fotografia e vídeo para conferências, lançamentos, prémios, eventos de networking e eventos de marca."],
      ["Propriedade e Interiores", "Fotografia e vídeo para interiores, propriedades hoteleiras, villas e projetos selecionados de propriedade comercial."]
    ]
  }
} as const;

const process = {
  en: [["01", "Brief", "Understand the objective, audience, platforms and required deliverables."], ["02", "Plan", "Build the shot list, production schedule, styling direction and practical production plan."], ["03", "Produce", "Capture photography and video with the final commercial use in mind."], ["04", "Edit & Deliver", "Select, retouch, edit, colour grade and prepare the assets for the required channels."]],
  pt: [["01", "Briefing", "Compreender o objetivo, público, plataformas e entregáveis necessários."], ["02", "Planear", "Preparar a lista de captação, calendário de produção, direção de styling e plano prático."], ["03", "Produzir", "Captar fotografia e vídeo tendo em conta a utilização comercial final."], ["04", "Editar e Entregar", "Selecionar, retocar, editar, fazer correção de cor e preparar os assets para os canais necessários."]]
} as const;

const projectDetails = [
  { matches: ["yotel-porto"], type: ["Hotel Photography & Video", "Fotografia e Vídeo para Hotel"], location: ["Porto, Portugal", "Porto, Portugal"], contribution: ["Photography, video and content production", "Fotografia, vídeo e produção de conteúdo"], alt: ["YOTEL Porto hotel interior", "Interior do hotel YOTEL Porto"] },
  { matches: ["pullman-danang-beach-resort"], type: ["Hotel & Resort Photography", "Fotografia de Hotel e Resort"], location: ["Danang, Vietnam", "Danang, Vietname"], contribution: ["Hospitality photography and creative direction", "Fotografia de hotelaria e direção criativa"], alt: ["Pullman Danang Beach Resort", "Pullman Danang Beach Resort"] },
  { matches: ["pan-pacific-hanoi", "pan-pacific-hanoi-content-production"], type: ["Hotel, Restaurant & Lifestyle Content", "Conteúdo de Hotel, Restaurante e Lifestyle"], location: ["Hanoi, Vietnam", "Hanoi, Vietname"], contribution: ["Photography and short-form video", "Fotografia e vídeo short-form"], alt: ["Pan Pacific Hanoi food and hospitality content", "Conteúdo de gastronomia e hotelaria no Pan Pacific Hanoi"] },
  { matches: ["ashas-award-winning-restaurant"], type: ["Restaurant Food & Drink", "Gastronomia e Bebidas para Restaurante"], location: ["Birmingham, UK", "Birmingham, Reino Unido"], contribution: ["Food, drink and restaurant content", "Conteúdo de gastronomia, bebidas e restaurante"], alt: ["Asha's Birmingham restaurant content", "Conteúdo do restaurante Asha's Birmingham"] },
  { matches: ["beleza-rodizio"], type: ["Restaurant & Social Content", "Conteúdo para Restaurante e Redes Sociais"], location: ["United Kingdom", "Reino Unido"], contribution: ["Commercial photography and video", "Fotografia e vídeo comercial"], alt: ["Beleza Rodizio restaurant content", "Conteúdo do restaurante Beleza Rodizio"] },
  { matches: ["grand-tourane-hotel"], type: ["Hotel Photography", "Fotografia para Hotel"], location: ["Danang, Vietnam", "Danang, Vietname"], contribution: ["Hospitality photography and video", "Fotografia e vídeo para hotelaria"], alt: ["Grand Tourane Hotel photography", "Fotografia do Grand Tourane Hotel"] }
] as const;

const testimonials = {
  en: [
    ["We have reviewed all of the deliverables, and they are truly eye-catching. We especially love the way you captured our Afternoon Tea set and the Nitrogen Ice Cream Show.", "Marketing Communications Manager, Pullman Danang Beach Resort, Accor Hotels"],
    ["The final result from the YOTEL Porto photoshoot looks fantastic. We’re really pleased with the images and will be sharing them with our social media team to use across our digital channels.", "Influencer Marketing Consultant, M Public Relations"],
    ["Great results and great photos. We were really pleased with the final outcome and the quality of the content delivered for Asha’s Birmingham.", "Director, Asha’s"]
  ],
  pt: [
    ["Revimos todos os conteúdos entregues e são realmente marcantes. Gostamos especialmente da forma como captou o nosso Afternoon Tea e o espetáculo de gelado com nitrogénio.", "Marketing Communications Manager, Pullman Danang Beach Resort, Accor Hotels"],
    ["O resultado final da sessão para o YOTEL Porto está fantástico. Estamos muito satisfeitos com as imagens e vamos partilhá-las com a equipa de redes sociais para utilização nos nossos canais digitais.", "Influencer Marketing Consultant, M Public Relations"],
    ["Ótimos resultados e ótimas fotografias. Ficámos muito satisfeitos com o resultado final e com a qualidade do conteúdo entregue para o Asha’s Birmingham.", "Diretor, Asha’s"]
  ]
} as const;

const faqs = {
  en: [
    ["Who is Tiago Bastos?", "Tiago Bastos is a Portuguese photographer and videographer specialising in hotels, restaurants, bars and food & drink brands, working across Portugal and the UK through Hospo Creative."],
    ["Does Tiago photograph hotels and resorts?", "Yes. Projects can include rooms, interiors, lifestyle, food & beverage, amenities, guest experience and promotional video."],
    ["Does Tiago photograph restaurants?", "Yes. Restaurant work can include food, drinks, interiors, chefs, atmosphere, service and social media content."],
    ["Does Tiago provide food photography?", "Yes. Tiago photographs restaurant dishes, menus, food brands and campaign content."],
    ["Does Tiago photograph bars and drinks?", "Yes. This includes cocktails, beverages, bartenders, atmosphere and food & beverage campaigns."],
    ["Does Tiago provide video as well as photography?", "Yes. Photography and video can be commissioned separately or together, depending on the purpose, channels and production plan."],
    ["Does Tiago create Reels and social media content?", "Yes. He creates vertical video, Reels, TikTok-style content and social-first assets for hospitality and food & drink businesses."],
    ["Does Tiago work with hotels and restaurants in the Algarve?", "Yes. Tiago is based in Portugal and works with hotels, restaurants and food & drink businesses in the Algarve and nationwide."],
    ["Does Tiago work in Lisbon?", "Yes. Tiago is available for hotel, restaurant and food & drink photography and video projects in Lisbon."],
    ["Does Tiago work in the UK?", "Yes. Tiago regularly undertakes selected hotel, restaurant and food & drink projects across the United Kingdom."],
    ["Does Tiago work in Birmingham and the West Midlands?", "Yes. He continues to work across Birmingham and the West Midlands for selected hotel, restaurant and food & drink projects."],
    ["Does Tiago work in London?", "Yes. Tiago is available for selected hotel, restaurant and food & drink photography and video projects in London."],
    ["Can photography and video be produced during the same shoot?", "Yes. Where practical, both can be planned as part of the same production."],
    ["Does Tiago travel internationally?", "Yes. Selected hotel, restaurant and food & drink productions can be arranged internationally."]
  ],
  pt: [
    ["Quem é o Tiago Bastos?", "O Tiago Bastos é fotógrafo e videógrafo especializado em hotéis, restaurantes, bares e marcas de alimentação e bebidas, trabalhando em Portugal e no Reino Unido através da Hospo Creative."],
    ["O Tiago faz fotografia para hotéis e resorts?", "Sim. Os projetos podem incluir quartos, interiores, lifestyle, alimentação e bebidas, comodidades, experiência do cliente e vídeo promocional."],
    ["O Tiago fotografa restaurantes?", "Sim. O trabalho para restaurantes pode incluir pratos, bebidas, interiores, chefs, ambiente, serviço e conteúdo para redes sociais."],
    ["O Tiago faz fotografia gastronómica?", "Sim. Fotografa pratos de restaurante, menus, marcas de alimentação e conteúdo para campanhas."],
    ["O Tiago fotografa comida e bebidas?", "Sim. Inclui comida, cocktails, bebidas, bartenders, ambiente e campanhas de alimentação e bebidas."],
    ["O Tiago faz fotografia e vídeo para bares?", "Sim. Pode criar fotografia, vídeo promocional e conteúdo para redes sociais para bares e marcas de bebidas."],
    ["O Tiago cria vídeos e Reels para redes sociais?", "Sim. Cria vídeo vertical, Reels, conteúdo para TikTok e assets pensados para redes sociais de hotéis, restaurantes, bares e marcas de alimentação e bebidas."],
    ["O Tiago trabalha com hotéis e restaurantes no Algarve?", "Sim. Está baseado em Portugal e trabalha com hotéis, restaurantes e negócios de alimentação e bebidas no Algarve e em todo o país."],
    ["O Tiago trabalha em Lisboa?", "Sim. Está disponível para projetos de fotografia e vídeo para hotéis, restaurantes e alimentação e bebidas em Lisboa."],
    ["O Tiago trabalha no Reino Unido?", "Sim. Continua disponível para projetos selecionados de hotéis, restaurantes e alimentação e bebidas em todo o Reino Unido."],
    ["O Tiago trabalha em Birmingham e West Midlands?", "Sim. Continua disponível para projetos selecionados de hotéis, restaurantes e alimentação e bebidas em Birmingham e West Midlands."],
    ["O Tiago trabalha em Londres?", "Sim. Está disponível para projetos selecionados de fotografia e vídeo para hotéis, restaurantes e alimentação e bebidas em Londres."],
    ["É possível fazer fotografia e vídeo na mesma produção?", "Sim. Quando é adequado, ambos podem ser planeados como parte da mesma produção."],
    ["O Tiago está disponível para projetos internacionais?", "Sim. É possível organizar produções internacionais selecionadas para hotéis, restaurantes e marcas de alimentação e bebidas."]
  ]
} as const;

function findImage(study: CaseStudy) {
  return study.heroImage || study.media?.find((item) => item.mediaType === "image")?.src || null;
}

export function TiagoBastosProfile({ locale, caseStudies }: Props) {
  const t = content[locale];
  const secondary = secondaryServices[locale];
  const languageIndex = locale === "pt" ? 1 : 0;
  const galleryItems = getPublicImageList(imageFolders.photoGallery, {
    text: photoGalleryImageText,
    altPrefix: locale === "pt" ? "Imagem de portefólio de fotografia comercial de Tiago Bastos" : "Tiago Bastos commercial photography portfolio image"
  });
  const selectedProjects = projectDetails.flatMap((detail) => {
    const slugs = Array.from(detail.matches) as string[];
    const study = caseStudies.find((item) => slugs.includes(item.slug) || item.clientName.toLowerCase().includes(detail.matches[0].replaceAll("-", " ").split(" ").slice(0, 2).join(" ")));
    return study ? [{ detail, study, image: findImage(study) }] : [];
  });
  const projectLabels = locale === "pt"
    ? { type: "Tipo de projeto", client: "Cliente", location: "Localização", contribution: "Contributo do Tiago" }
    : { type: "Project type", client: "Client", location: "Location", contribution: "Tiago’s contribution" };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs[locale].map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
  };

  return (
    <>
      <SeoStructuredData data={faqSchema} />
      <TiagoBastosHero locale={locale} eyebrow={t.eyebrow} title={t.title} intro={t.intro} supporting={t.supporting} location={t.location} enquire={t.enquire} work={t.work} />

      <section className="bg-white px-6 py-20 text-[#062f5f] sm:px-10 lg:px-16 lg:py-24"><Reveal className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end"><div><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.startingEyebrow}</p><h2 className="mt-5 max-w-xl font-serif text-[clamp(2.25rem,4vw,3.9rem)] leading-[0.98]">{t.startingTitle}</h2></div><div className="max-w-2xl border-l-2 border-[#f5c342] pl-5 text-lg leading-8 text-[#173f6d]"><p>{t.startingBody}</p><p className="mt-4">{t.startingSupporting}</p></div></Reveal></section>

      <section id="services" className="bg-[#f7f6f2] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.servicesEyebrow}</p><h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-[#062f5f] sm:text-5xl">{t.servicesTitle}</h2></Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#062f5f]/15 bg-[#062f5f]/15 md:grid-cols-2">
            {services[locale].map(([number, title, body], index) => <Reveal key={number} delay={index * 0.05} className="bg-[#f7f6f2] p-7 sm:p-8"><article><p className="text-xs font-bold tracking-[0.2em] text-[#b27b00]">{number}</p><h3 className="mt-8 text-xl font-bold text-[#062f5f]">{title}</h3><p className="mt-4 leading-7 text-[#173f6d]">{body}</p></article></Reveal>)}
          </div>
          <Reveal className="mt-14 border-t border-[#062f5f]/15 pt-10"><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{secondary.eyebrow}</p><h3 className="mt-4 max-w-2xl font-serif text-3xl leading-tight text-[#062f5f] sm:text-4xl">{secondary.title}</h3><div className="mt-8 grid gap-5 md:grid-cols-2">{secondary.items.map(([title, body]) => <article key={title} className="rounded-2xl border border-[#062f5f]/15 bg-white p-7"><h4 className="text-lg font-bold text-[#062f5f]">{title}</h4><p className="mt-3 leading-7 text-[#173f6d]">{body}</p></article>)}</div></Reveal>
        </div>
      </section>

      <section className="overflow-hidden bg-[#062f5f] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24"><div className="mx-auto max-w-7xl"><Reveal><p className="text-xs font-bold tracking-[0.18em] text-[#f5c342]">{t.processEyebrow}</p><h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.35rem,4.3vw,4rem)] leading-[0.98]">{t.processTitle}</h2><p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{t.processBody}</p></Reveal><div className="relative mt-12"><div className="absolute left-4 right-4 top-5 hidden h-px bg-[#f5c342]/70 lg:block" /><ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{process[locale].map(([number, title, body], index) => <Reveal key={number} delay={index * 0.08} className="relative"><span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#f5c342] bg-[#062f5f] text-xs font-bold text-[#f5c342]">{number}</span><div className="mt-5 border-l border-white/20 pl-4 lg:border-l-0 lg:pl-0"><h3 className="font-serif text-3xl leading-none">{title}</h3><p className="mt-4 text-sm leading-7 text-white/72">{body}</p></div></Reveal>)}</ol></div></div></section>

      <section className="overflow-hidden bg-white px-6 py-20 text-[#062f5f] sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto max-w-7xl"><Reveal className="max-w-4xl"><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.galleryEyebrow}</p><h2 className="mt-5 font-serif text-[clamp(2.35rem,4.4vw,4.1rem)] leading-[0.98]">{t.galleryTitle}</h2><p className="mt-6 max-w-3xl text-lg leading-8 text-[#173f6d]">{t.galleryBody}</p></Reveal><MosaicGallery items={galleryItems} locale={locale} /></div></section>

      <section id="work" className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.workEyebrow}</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"><h2 className="font-serif text-4xl leading-tight text-[#062f5f] sm:text-5xl">{t.workTitle}</h2><p className="max-w-xl leading-7 text-[#173f6d]">{t.workIntro}</p></div>
          {selectedProjects.length > 0 && <div className="mt-12 grid gap-7 md:grid-cols-2">{selectedProjects.map(({ detail, study, image }, index) => <Reveal key={study.slug} delay={index * 0.06}><article className="group overflow-hidden rounded-2xl bg-[#f7f6f2]"><div className="aspect-[16/10] overflow-hidden bg-[#dfe5e9]">{image ? <Image src={image} alt={detail.alt[languageIndex]} width={1600} height={1000} unoptimized className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="h-full w-full bg-[#062f5f]" />}</div><div className="p-7"><h3 className="text-2xl font-bold text-[#062f5f]">{locale === "pt" && study.titlePt ? study.titlePt : study.title}</h3><dl className="mt-6 grid gap-4 border-y border-[#062f5f]/15 py-5 text-sm sm:grid-cols-2"><div><dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#b27b00]">{projectLabels.type}</dt><dd className="mt-1 text-[#173f6d]">{detail.type[languageIndex]}</dd></div><div><dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#b27b00]">{projectLabels.client}</dt><dd className="mt-1 text-[#173f6d]">{study.clientName}</dd></div><div><dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#b27b00]">{projectLabels.location}</dt><dd className="mt-1 text-[#173f6d]">{detail.location[languageIndex]}</dd></div><div><dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#b27b00]">{projectLabels.contribution}</dt><dd className="mt-1 text-[#173f6d]">{detail.contribution[languageIndex]}</dd></div></dl><Link href={localizedPath(`/case-studies/${study.slug}`, locale)} className="mt-6 inline-flex items-center font-bold text-[#062f5f] underline underline-offset-4">{t.viewProject}<ArrowUpRight className="ml-2 h-4 w-4" /></Link></div></article></Reveal>)}</div>}
        </div>
      </section>

      <PortfolioShowcase locale={locale} showSelectedWork={false} variant="tiago" />

      <section id="about" className="bg-[#0b3b70] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28"><Reveal className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="text-xs font-bold tracking-[0.18em] text-[#f5c342]">{t.experienceEyebrow}</p><h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{t.experienceTitle}</h2></div><div><p className="max-w-2xl text-lg leading-8 text-white/85">{t.experience}</p><ul className="mt-8 grid gap-3 sm:grid-cols-2">{[locale === "pt" ? "Direção criativa com contexto operacional" : "Creative direction with operational context", locale === "pt" ? "Conteúdo pensado para equipas comerciais" : "Content made for commercial teams", locale === "pt" ? "Produções eficientes no local" : "Efficient productions on location", locale === "pt" ? "Fotografia, vídeo e edição numa equipa" : "Photography, video and editing in one team"].map((item) => <li key={item} className="flex gap-3 text-sm text-white/85"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#f5c342]" />{item}</li>)}</ul></div></Reveal></section>

      <section className="bg-[#f7f6f2] px-6 py-20 sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto max-w-7xl"><Reveal><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.geographyEyebrow}</p><h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.35rem,4vw,3.9rem)] leading-[0.98] text-[#062f5f]">{t.geographyTitle}</h2></Reveal><div className="mt-12 grid gap-6 md:grid-cols-3">{(locale === "pt" ? [["Portugal", "Baseado em Portugal, trabalho com hotéis, restaurantes e negócios de alimentação e bebidas em todo o país, com especial foco no Algarve e Lisboa."], ["Reino Unido", "Continuo disponível para projetos no Reino Unido, incluindo Birmingham, West Midlands e Londres."], ["Internacional", "Estou também disponível para produções internacionais selecionadas na área de hotelaria, restauração e alimentação e bebidas."]] : [["Portugal", "Based in Portugal, I work with hotels, restaurants and food & drink businesses across the country, with a particular focus on the Algarve and Lisbon."], ["United Kingdom", "I continue to work with hospitality and F&B businesses across the UK, with regular availability in Birmingham, the West Midlands and London."], ["International", "I’m also available for selected hotel, restaurant and food & drink productions internationally."]]).map(([title, body], index) => <Reveal key={title} delay={index * 0.08}><article className="rounded-2xl bg-white p-7"><MapPin className="h-5 w-5 text-[#b27b00]" /><h3 className="mt-6 text-xl font-bold text-[#062f5f]">{title}</h3><p className="mt-3 leading-7 text-[#173f6d]">{body}</p></article></Reveal>)}</div></div></section>

      <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.testimonialsEyebrow}</p><h2 className="mt-4 font-serif text-4xl leading-tight text-[#062f5f] sm:text-5xl">{t.testimonialsTitle}</h2><div className="mt-12 grid gap-6 lg:grid-cols-3">{testimonials[locale].map(([quote, source]) => <figure key={source} className="rounded-2xl border border-[#062f5f]/15 p-7"><blockquote className="font-serif text-2xl leading-snug text-[#062f5f]">“{quote}”</blockquote><figcaption className="mt-7 text-sm leading-6 text-[#173f6d]">{source}</figcaption></figure>)}</div></div></section>

      <section id="faq" className="bg-[#062f5f] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28"><Reveal className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.62fr_1.38fr]"><div><p className="text-xs font-bold tracking-[0.18em] text-[#f5c342]">{t.faqEyebrow}</p><h2 className="mt-4 max-w-md font-serif text-[clamp(2.35rem,4vw,3.9rem)] leading-[0.98]">{t.faqTitle}</h2></div><div className="border-y border-white/20">{faqs[locale].map(([question, answer]) => <details key={question} className="group border-b border-white/20 py-5 last:border-b-0"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-bold leading-7 marker:hidden"><span>{question}</span><span className="text-[#f5c342] transition group-open:rotate-45">+</span></summary><p className="max-w-3xl pt-4 leading-7 text-white/72">{answer}</p></details>)}</div></Reveal></section>

      <section className="bg-[#f7f6f2] px-6 py-20 text-[#062f5f] sm:px-10 lg:px-16 lg:py-28"><Reveal className="mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.ctaEyebrow}</p><h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.5rem,4.5vw,4.2rem)] leading-[0.98]">{t.ctaTitle}</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-[#173f6d]">{t.ctaBody}</p></div><div className="flex flex-col items-start gap-4"><Link href={localizedPath("/contact", locale)} className="inline-flex items-center rounded-full bg-[#062f5f] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#0b3b70]">{t.cta}<ArrowUpRight className="ml-2 h-4 w-4" /></Link><div className="flex gap-5"><a href="mailto:info@hospoagency.com" className="inline-flex items-center gap-2 text-sm font-bold text-[#173f6d] transition hover:text-[#062f5f]"><Mail className="h-4 w-4" />{t.email}</a><a href="https://www.linkedin.com/in/tiagobastos93/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#173f6d] transition hover:text-[#062f5f]"><Linkedin className="h-4 w-4" />{t.linkedin}</a></div></div></Reveal></section>
    </>
  );
}
