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
    eyebrow: "COMMERCIAL PHOTOGRAPHER · VIDEOGRAPHER · CONTENT CREATOR",
    title: "Commercial Photographer & Videographer for Businesses",
    intro: "Commercial photography and video for hotels, restaurants, properties and brands across Portugal and the UK. Available in the Algarve, Lisbon, Birmingham, the West Midlands, London and for selected international productions.",
    location: "PORTUGAL · UK · INTERNATIONAL",
    enquire: "Enquire About a Project",
    work: "View My Work",
    startingEyebrow: "THE STARTING POINT",
    startingTitle: "Your business may deliver a great experience. The content needs to show it.",
    startingBody: "Before someone visits, books, enquires or buys, they often judge a business through its photography and video.",
    startingSupporting: "Strong commercial content helps people understand the space, product, atmosphere and experience before they make that decision.",
    servicesEyebrow: "WHAT I CREATE",
    servicesTitle: "Visual content with a commercial purpose.",
    processEyebrow: "HOW I WORK",
    processTitle: "More than taking pictures.",
    processBody: "A clear production process keeps the work focused on the commercial objective, practical to deliver and useful after the shoot.",
    galleryEyebrow: "VISUAL STORYTELLING",
    galleryTitle: "Content that lets people understand the experience before they arrive.",
    galleryBody: "Strong commercial photography should communicate more than how something looks. It should show atmosphere, detail, people, scale and what the experience actually feels like.",
    workEyebrow: "SELECTED COMMERCIAL WORK",
    workTitle: "Projects made for real businesses.",
    workIntro: "Photography and video that show the experience clearly, give people a reason to choose it and provide useful assets across marketing channels.",
    viewProject: "View project",
    experienceEyebrow: "HOSPITALITY EXPERIENCE",
    experienceTitle: "Commercial thinking behind the camera.",
    experience: "Before moving into professional photography and video, I spent around 15 years working inside hospitality and food and beverage environments across Portugal and the UK. That experience gives me a practical understanding of service, guest experience, operational timing and how customer-facing businesses need to present themselves. Today, I combine that background with photography, video, creative direction and digital marketing through Hospo Creative.",
    geographyEyebrow: "WHERE I WORK",
    geographyTitle: "Portugal, UK and selected international projects.",
    testimonialsEyebrow: "CLIENT FEEDBACK",
    testimonialsTitle: "Trusted by teams who care about the result.",
    faqEyebrow: "FAQ",
    faqTitle: "Practical questions before booking a shoot.",
    ctaEyebrow: "LET’S WORK TOGETHER",
    ctaTitle: "Planning a photography or video project?",
    ctaBody: "Tell me about your business, location and the content you need. I’ll recommend the most suitable production approach.",
    cta: "Enquire About a Project",
    email: "Email me",
    linkedin: "LinkedIn",
    backToHospo: "Hospo Creative"
  },
  pt: {
    eyebrow: "FOTÓGRAFO COMERCIAL · VIDEÓGRAFO · CRIADOR DE CONTEÚDO",
    title: "Fotógrafo Comercial e Videógrafo para Negócios",
    intro: "Fotografia e vídeo comercial para hotéis, restaurantes, propriedades e marcas em Portugal e no Reino Unido. Disponível no Algarve, Lisboa, Birmingham, West Midlands, Londres e para produções internacionais selecionadas.",
    location: "PORTUGAL · REINO UNIDO · INTERNACIONAL",
    enquire: "Falar sobre um projeto",
    work: "Ver projetos",
    startingEyebrow: "O PONTO DE PARTIDA",
    startingTitle: "O seu negócio pode proporcionar uma ótima experiência. O conteúdo tem de a mostrar.",
    startingBody: "Antes de visitar, reservar, pedir informações ou comprar, as pessoas avaliam muitas vezes um negócio através da fotografia e do vídeo.",
    startingSupporting: "Um conteúdo comercial forte ajuda a compreender o espaço, produto, ambiente e experiência antes de tomar essa decisão.",
    servicesEyebrow: "O QUE CRIO",
    servicesTitle: "Conteúdo visual com objetivo comercial.",
    processEyebrow: "COMO TRABALHO",
    processTitle: "Mais do que tirar fotografias.",
    processBody: "Um processo de produção claro mantém o trabalho focado no objetivo comercial, prático de produzir e útil depois da sessão.",
    galleryEyebrow: "NARRATIVA VISUAL",
    galleryTitle: "Conteúdo que deixa as pessoas compreender a experiência antes de chegarem.",
    galleryBody: "Uma fotografia comercial forte deve comunicar mais do que a aparência. Deve mostrar ambiente, detalhe, pessoas, escala e como a experiência realmente se sente.",
    workEyebrow: "TRABALHO COMERCIAL SELECIONADO",
    workTitle: "Projetos para negócios reais.",
    workIntro: "Fotografia e vídeo que mostram a experiência com clareza, ajudam as pessoas a escolhê-la e criam assets úteis em vários canais de marketing.",
    viewProject: "Ver projeto",
    experienceEyebrow: "EXPERIÊNCIA EM HOTELARIA",
    experienceTitle: "Pensamento comercial atrás da câmara.",
    experience: "Antes de trabalhar profissionalmente em fotografia e vídeo, passei cerca de 15 anos em contextos de hotelaria e alimentação e bebidas em Portugal e no Reino Unido. Essa experiência dá-me uma compreensão prática de serviço, experiência de cliente, timing operacional e da forma como negócios orientados ao cliente precisam de se apresentar. Hoje, combino esse percurso com fotografia, vídeo, direção criativa e marketing digital através da Hospo Creative.",
    geographyEyebrow: "ONDE TRABALHO",
    geographyTitle: "Portugal, Reino Unido e projetos internacionais selecionados.",
    testimonialsEyebrow: "OPINIÃO DE CLIENTES",
    testimonialsTitle: "Escolhido por equipas que valorizam o resultado.",
    faqEyebrow: "PERGUNTAS FREQUENTES",
    faqTitle: "Questões práticas antes de marcar uma sessão.",
    ctaEyebrow: "VAMOS TRABALHAR EM CONJUNTO",
    ctaTitle: "Está a planear um projeto de fotografia ou vídeo?",
    ctaBody: "Fale-me do seu negócio, localização e do conteúdo de que precisa. Recomendarei a abordagem de produção mais adequada.",
    cta: "Falar sobre um projeto",
    email: "Enviar email",
    linkedin: "LinkedIn",
    backToHospo: "Hospo Creative"
  }
} as const;

const services = {
  en: [
    ["01", "Hospitality & Hotels", "Hotel and resort photography, rooms, suites, interiors, architecture, lifestyle, amenities, food and beverage, plus guest-experience video."],
    ["02", "Food, Drink & Restaurants", "Food and drink photography for restaurants, bars and cafés, including cocktails, menus, chefs, service, interiors and promotional video."],
    ["03", "Corporate Events & Conferences", "Photography and video for conferences, launches, awards, networking events, corporate gatherings and branded experiences."],
    ["04", "Property & Real Estate", "Residential and commercial property photography, interiors, villas, hospitality accommodation, developments and property video."],
    ["05", "Brands & Local Businesses", "Photography and video for customer-facing businesses including retail, barbershops, salons, gyms, automotive, lifestyle and independent brands."],
    ["06", "Video & Social Content", "Promotional films, Reels, TikTok, vertical video, short-form content, website video, campaign assets and practical content libraries."]
  ],
  pt: [
    ["01", "Hotelaria e Hotéis", "Fotografia de hotéis e resorts, quartos, suites, interiores, arquitetura, lifestyle, comodidades, F&B e vídeo de experiência de hóspede."],
    ["02", "Gastronomia, Bebidas e Restaurantes", "Fotografia de comida e bebida para restaurantes, bares e cafés, incluindo cocktails, menus, chefs, serviço, interiores e vídeo promocional."],
    ["03", "Eventos Corporativos e Conferências", "Fotografia e vídeo para conferências, lançamentos, prémios, eventos de networking, encontros corporativos e experiências de marca."],
    ["04", "Propriedade e Imobiliário", "Fotografia de propriedade residencial e comercial, interiores, villas, alojamento turístico, empreendimentos e vídeo de propriedade."],
    ["05", "Marcas e Negócios Locais", "Fotografia e vídeo para negócios orientados ao cliente, incluindo retalho, barbearias, salões, ginásios, automóvel, lifestyle e marcas independentes."],
    ["06", "Vídeo e Conteúdo para Redes Sociais", "Filmes promocionais, Reels, TikTok, vídeo vertical, conteúdo short-form, vídeo para websites, ativos de campanha e bibliotecas de conteúdo."]
  ]
} as const;

const process = {
  en: [["01", "Brief", "Understand the objective, audience, platforms and required deliverables."], ["02", "Plan", "Build the shot list, production schedule, styling direction and practical production plan."], ["03", "Produce", "Capture photography and video with the final commercial use in mind."], ["04", "Edit & Deliver", "Select, retouch, edit, colour grade and prepare the assets for the required channels."]],
  pt: [["01", "Briefing", "Compreender o objetivo, público, plataformas e entregáveis necessários."], ["02", "Planear", "Preparar a lista de captação, calendário de produção, direção de styling e plano prático."], ["03", "Produzir", "Captar fotografia e vídeo tendo em conta a utilização comercial final."], ["04", "Editar e Entregar", "Selecionar, retocar, editar, fazer correção de cor e preparar os assets para os canais necessários."]]
} as const;

const projectDetails = [
  { matches: ["yotel-porto"], type: ["Hotel Photography & Video", "Fotografia e Vídeo para Hotel"], location: ["Porto, Portugal", "Porto, Portugal"], contribution: ["Photography, video and content production", "Fotografia, vídeo e produção de conteúdo"], alt: ["YOTEL Porto hotel interior", "Interior do hotel YOTEL Porto"] },
  { matches: ["pullman-danang-beach-resort"], type: ["Hotel & Resort Photography", "Fotografia de Hotel e Resort"], location: ["Danang, Vietnam", "Danang, Vietname"], contribution: ["Hospitality photography and creative direction", "Fotografia de hotelaria e direção criativa"], alt: ["Pullman Danang Beach Resort", "Pullman Danang Beach Resort"] },
  { matches: ["pan-pacific-hanoi", "pan-pacific-hanoi-content-production"], type: ["Food & Hospitality Content", "Conteúdo de Gastronomia e Hotelaria"], location: ["Hanoi, Vietnam", "Hanoi, Vietname"], contribution: ["Photography and short-form video", "Fotografia e vídeo short-form"], alt: ["Pan Pacific Hanoi food and hospitality content", "Conteúdo de gastronomia e hotelaria no Pan Pacific Hanoi"] },
  { matches: ["ashas-award-winning-restaurant"], type: ["Restaurant Food & Drink", "Gastronomia e Bebidas para Restaurante"], location: ["Birmingham, UK", "Birmingham, Reino Unido"], contribution: ["Food, drink and restaurant content", "Conteúdo de gastronomia, bebidas e restaurante"], alt: ["Asha's Birmingham restaurant content", "Conteúdo do restaurante Asha's Birmingham"] },
  { matches: ["beleza-rodizio"], type: ["Restaurant Content", "Conteúdo para Restaurante"], location: ["United Kingdom", "Reino Unido"], contribution: ["Commercial photography and video", "Fotografia e vídeo comercial"], alt: ["Beleza Rodizio restaurant content", "Conteúdo do restaurante Beleza Rodizio"] },
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
    ["Do you provide both photography and video?", "Yes. Projects can include photography, video or a combination of both depending on the required content and platforms."],
    ["What types of businesses do you work with?", "Hotels, resorts, restaurants, food and drink brands, corporate events, property businesses, local businesses and commercial brands."],
    ["Do you work across Portugal?", "Yes. I’m based in Portugal and available for projects nationwide, including the Algarve and Lisbon."],
    ["Do you work in the UK?", "Yes. I continue to undertake photography and video projects across the UK, including Birmingham, the West Midlands and London."],
    ["Do you cover corporate events?", "Yes. I provide photography and video for conferences, launches, awards, networking events and other corporate gatherings."],
    ["Do you provide property and real-estate photography?", "Yes. This can include residential property, commercial spaces, interiors, villas, hospitality accommodation and property video."],
    ["Can photography and video be produced during the same shoot?", "Yes. Where practical, both can be planned as part of the same production."],
    ["Where can the content be used?", "Depending on the project, assets can be created for websites, social media, Google, booking platforms, advertising, campaigns, property listings and other agreed commercial uses."],
    ["Do you travel internationally?", "Yes. Selected international productions can be arranged depending on the project."]
  ],
  pt: [
    ["Disponibiliza fotografia e vídeo?", "Sim. Os projetos podem incluir fotografia, vídeo ou uma combinação dos dois, de acordo com o conteúdo e plataformas necessários."],
    ["Com que tipos de negócios trabalha?", "Hotéis, resorts, restaurantes, marcas de alimentação e bebidas, eventos corporativos, negócios de imobiliário, negócios locais e marcas comerciais."],
    ["Trabalha em todo o Portugal?", "Sim. Estou baseado em Portugal e disponível para projetos em todo o país, incluindo Algarve e Lisboa."],
    ["Trabalha no Reino Unido?", "Sim. Continuo a realizar projetos de fotografia e vídeo no Reino Unido, incluindo Birmingham, West Midlands e Londres."],
    ["Cobre eventos corporativos?", "Sim. Realizo fotografia e vídeo para conferências, lançamentos, prémios, eventos de networking e outros encontros corporativos."],
    ["Disponibiliza fotografia de propriedade e imobiliário?", "Sim. Pode incluir propriedade residencial, espaços comerciais, interiores, villas, alojamento turístico e vídeo de propriedade."],
    ["É possível produzir fotografia e vídeo na mesma sessão?", "Sim. Quando é prático, ambos podem ser planeados como parte da mesma produção."],
    ["Onde pode ser utilizado o conteúdo?", "Consoante o projeto, os assets podem ser criados para websites, redes sociais, Google, plataformas de reserva, publicidade, campanhas, anúncios de propriedade e outras utilizações comerciais acordadas."],
    ["Trabalha internacionalmente?", "Sim. Produções internacionais selecionadas podem ser organizadas de acordo com o projeto."]
  ]
} as const;

function findImage(study: CaseStudy) {
  return study.heroImage || study.media?.find((item) => item.mediaType === "image")?.src || null;
}

export function TiagoBastosProfile({ locale, caseStudies }: Props) {
  const t = content[locale];
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
      <TiagoBastosHero locale={locale} eyebrow={t.eyebrow} title={t.title} intro={t.intro} location={t.location} enquire={t.enquire} work={t.work} />

      <section className="bg-white px-6 py-20 text-[#062f5f] sm:px-10 lg:px-16 lg:py-24"><Reveal className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end"><div><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.startingEyebrow}</p><h2 className="mt-5 max-w-xl font-serif text-[clamp(2.25rem,4vw,3.9rem)] leading-[0.98]">{t.startingTitle}</h2></div><div className="max-w-2xl border-l-2 border-[#f5c342] pl-5 text-lg leading-8 text-[#173f6d]"><p>{t.startingBody}</p><p className="mt-4">{t.startingSupporting}</p></div></Reveal></section>

      <section id="services" className="bg-[#f7f6f2] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.servicesEyebrow}</p><h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-[#062f5f] sm:text-5xl">{t.servicesTitle}</h2></Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#062f5f]/15 bg-[#062f5f]/15 md:grid-cols-2 lg:grid-cols-3">
            {services[locale].map(([number, title, body], index) => <Reveal key={number} delay={index * 0.05} className="bg-[#f7f6f2] p-7 sm:p-8"><article><p className="text-xs font-bold tracking-[0.2em] text-[#b27b00]">{number}</p><h3 className="mt-8 text-xl font-bold text-[#062f5f]">{title}</h3><p className="mt-4 leading-7 text-[#173f6d]">{body}</p></article></Reveal>)}
          </div>
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

      <section className="bg-[#f7f6f2] px-6 py-20 sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto max-w-7xl"><Reveal><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.geographyEyebrow}</p><h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.35rem,4vw,3.9rem)] leading-[0.98] text-[#062f5f]">{t.geographyTitle}</h2></Reveal><div className="mt-12 grid gap-6 md:grid-cols-3">{(locale === "pt" ? [["Portugal", "Baseado em Portugal e disponível para produções em todo o país, com especial foco no Algarve e em Lisboa."], ["Reino Unido", "Continuo a trabalhar no Reino Unido, com disponibilidade regular em Birmingham, West Midlands e Londres."], ["Internacional", "Disponível para viajar em produções selecionadas de hotelaria, comerciais e de marca."]] : [["Portugal", "Based in Portugal and available for productions nationwide, with a particular focus on the Algarve and Lisbon."], ["United Kingdom", "I continue to work across the UK, with regular availability in Birmingham, the West Midlands and London."], ["International", "Available to travel internationally for selected hospitality, commercial and brand productions."]]).map(([title, body], index) => <Reveal key={title} delay={index * 0.08}><article className="rounded-2xl bg-white p-7"><MapPin className="h-5 w-5 text-[#b27b00]" /><h3 className="mt-6 text-xl font-bold text-[#062f5f]">{title}</h3><p className="mt-3 leading-7 text-[#173f6d]">{body}</p></article></Reveal>)}</div></div></section>

      <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.testimonialsEyebrow}</p><h2 className="mt-4 font-serif text-4xl leading-tight text-[#062f5f] sm:text-5xl">{t.testimonialsTitle}</h2><div className="mt-12 grid gap-6 lg:grid-cols-3">{testimonials[locale].map(([quote, source]) => <figure key={source} className="rounded-2xl border border-[#062f5f]/15 p-7"><blockquote className="font-serif text-2xl leading-snug text-[#062f5f]">“{quote}”</blockquote><figcaption className="mt-7 text-sm leading-6 text-[#173f6d]">{source}</figcaption></figure>)}</div></div></section>

      <section id="faq" className="bg-[#062f5f] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28"><Reveal className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.62fr_1.38fr]"><div><p className="text-xs font-bold tracking-[0.18em] text-[#f5c342]">{t.faqEyebrow}</p><h2 className="mt-4 max-w-md font-serif text-[clamp(2.35rem,4vw,3.9rem)] leading-[0.98]">{t.faqTitle}</h2></div><div className="border-y border-white/20">{faqs[locale].map(([question, answer]) => <details key={question} className="group border-b border-white/20 py-5 last:border-b-0"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-bold leading-7 marker:hidden"><span>{question}</span><span className="text-[#f5c342] transition group-open:rotate-45">+</span></summary><p className="max-w-3xl pt-4 leading-7 text-white/72">{answer}</p></details>)}</div></Reveal></section>

      <section className="bg-[#f7f6f2] px-6 py-20 text-[#062f5f] sm:px-10 lg:px-16 lg:py-28"><Reveal className="mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.ctaEyebrow}</p><h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.5rem,4.5vw,4.2rem)] leading-[0.98]">{t.ctaTitle}</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-[#173f6d]">{t.ctaBody}</p></div><div className="flex flex-col items-start gap-4"><Link href={localizedPath("/contact", locale)} className="inline-flex items-center rounded-full bg-[#062f5f] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#0b3b70]">{t.cta}<ArrowUpRight className="ml-2 h-4 w-4" /></Link><div className="flex gap-5"><a href="mailto:info@hospoagency.com" className="inline-flex items-center gap-2 text-sm font-bold text-[#173f6d] transition hover:text-[#062f5f]"><Mail className="h-4 w-4" />{t.email}</a><a href="https://www.linkedin.com/in/tiagobastos93/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#173f6d] transition hover:text-[#062f5f]"><Linkedin className="h-4 w-4" />{t.linkedin}</a></div></div></Reveal></section>
    </>
  );
}
