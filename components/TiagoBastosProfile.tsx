import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin } from "lucide-react";
import { SeoStructuredData } from "@/components/SeoStructuredData";
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
    servicesEyebrow: "WHAT I CREATE",
    servicesTitle: "Visual content with a commercial purpose.",
    workEyebrow: "SELECTED WORK",
    workTitle: "Projects made for real businesses.",
    workIntro: "Photography and video that show the experience clearly, give people a reason to choose it and provide useful assets across marketing channels.",
    viewProject: "View project",
    experienceEyebrow: "HOSPITALITY EXPERIENCE",
    experienceTitle: "A practical understanding behind every shoot.",
    experience: "With around 15 years of experience across hospitality and F&B operations in Portugal and the UK, I understand the pace, standards and details that shape a guest experience. As co-founder of Hospo Creative, I combine this operational perspective with commercial photography, video and creative direction.",
    geographyEyebrow: "WHERE I WORK",
    geographyTitle: "Photography & video across Portugal and the UK.",
    testimonialsEyebrow: "CLIENT FEEDBACK",
    testimonialsTitle: "Trusted by teams who care about the result.",
    faqEyebrow: "FAQ",
    faqTitle: "Questions about working together.",
    ctaTitle: "Need photography or video for your business?",
    ctaBody: "Tell me about your business, location and what you need to show. I will come back with the most useful next step for your project.",
    cta: "Start a conversation",
    backToHospo: "Hospo Creative"
  },
  pt: {
    eyebrow: "FOTÓGRAFO COMERCIAL · VIDEÓGRAFO · CRIADOR DE CONTEÚDO",
    title: "Fotógrafo Comercial e Videógrafo para Negócios",
    intro: "Fotografia e vídeo comercial para hotéis, restaurantes, propriedades e marcas em Portugal e no Reino Unido. Disponível no Algarve, Lisboa, Birmingham, West Midlands, Londres e para produções internacionais selecionadas.",
    location: "PORTUGAL · REINO UNIDO · INTERNACIONAL",
    enquire: "Falar sobre um projeto",
    work: "Ver projetos",
    servicesEyebrow: "O QUE CRIO",
    servicesTitle: "Conteúdo visual com objetivo comercial.",
    workEyebrow: "PROJETOS SELECIONADOS",
    workTitle: "Projetos para negócios reais.",
    workIntro: "Fotografia e vídeo que mostram a experiência com clareza, ajudam as pessoas a escolhê-la e criam assets úteis em vários canais de marketing.",
    viewProject: "Ver projeto",
    experienceEyebrow: "EXPERIÊNCIA EM HOTELARIA",
    experienceTitle: "Uma perspetiva prática em cada produção.",
    experience: "Com cerca de 15 anos de experiência em operações de hotelaria e F&B em Portugal e no Reino Unido, compreendo o ritmo, os padrões e os detalhes que definem a experiência de um cliente. Como cofundador da Hospo Creative, combino essa perspetiva operacional com fotografia comercial, vídeo e direção criativa.",
    geographyEyebrow: "ONDE TRABALHO",
    geographyTitle: "Fotografia e vídeo em Portugal e no Reino Unido.",
    testimonialsEyebrow: "OPINIÃO DE CLIENTES",
    testimonialsTitle: "Escolhido por equipas que valorizam o resultado.",
    faqEyebrow: "PERGUNTAS FREQUENTES",
    faqTitle: "Questões sobre trabalhar em conjunto.",
    ctaTitle: "Precisa de fotografia ou vídeo para o seu negócio?",
    ctaBody: "Fale-me do seu negócio, localização e do que precisa de mostrar. Responderei com o próximo passo mais útil para o seu projeto.",
    cta: "Iniciar uma conversa",
    backToHospo: "Hospo Creative"
  }
} as const;

const services = {
  en: [
    ["01", "Hospitality & Hotels", "Hotel photography, room and suite imagery, lifestyle, amenities and video content that helps guests understand the stay before they book."],
    ["02", "Food, Drink & Restaurants", "Food and drinks photography, restaurant interiors, service, people and short-form video for venues, menus and campaigns."],
    ["03", "Corporate Events & Conferences", "Event photography and video that capture speakers, attendees, brand moments and the energy of the day without disrupting it."],
    ["04", "Property & Real Estate", "Photography and video for residential, hospitality and commercial spaces, made to communicate scale, detail and atmosphere."],
    ["05", "Brands & Local Businesses", "Brand imagery, team portraits, product, workspace and campaign content for businesses that need a stronger visual presence."],
    ["06", "Video & Social Content", "Short-form vertical video, campaign edits and a practical content library designed for websites, social channels and digital marketing."]
  ],
  pt: [
    ["01", "Hotelaria e Hotéis", "Fotografia para hotéis, quartos e suites, lifestyle, comodidades e vídeo que ajuda os hóspedes a compreender a estadia antes de reservar."],
    ["02", "Gastronomia, Bebidas e Restaurantes", "Fotografia de comida e bebidas, interiores de restaurantes, serviço, pessoas e vídeo short-form para espaços, menus e campanhas."],
    ["03", "Eventos Corporativos e Conferências", "Fotografia e vídeo de eventos que registam oradores, participantes, momentos de marca e a energia do dia sem interromper o evento."],
    ["04", "Propriedade e Imobiliário", "Fotografia e vídeo para espaços residenciais, de hotelaria e comerciais, pensados para comunicar escala, detalhe e ambiente."],
    ["05", "Marcas e Negócios Locais", "Imagem de marca, retratos de equipa, produto, espaço de trabalho e conteúdo de campanha para negócios que precisam de uma presença visual mais forte."],
    ["06", "Vídeo e Conteúdo para Redes Sociais", "Vídeo vertical short-form, edições de campanha e uma biblioteca de conteúdo prática para websites, redes sociais e marketing digital."]
  ]
} as const;

const projectDetails = [
  { matches: ["yotel-porto"], type: ["Hotel Photography & Video", "Fotografia e Vídeo para Hotel"], location: ["Porto, Portugal", "Porto, Portugal"], alt: ["YOTEL Porto hotel interior", "Interior do hotel YOTEL Porto"] },
  { matches: ["pullman-danang-beach-resort"], type: ["Hotel & Resort Photography", "Fotografia de Hotel e Resort"], location: ["Danang, Vietnam", "Danang, Vietname"], alt: ["Pullman Danang Beach Resort", "Pullman Danang Beach Resort"] },
  { matches: ["pan-pacific-hanoi", "pan-pacific-hanoi-content-production"], type: ["Food & Hospitality Content", "Conteúdo de Gastronomia e Hotelaria"], location: ["Hanoi, Vietnam", "Hanoi, Vietname"], alt: ["Pan Pacific Hanoi food and hospitality content", "Conteúdo de gastronomia e hotelaria no Pan Pacific Hanoi"] },
  { matches: ["ashas-award-winning-restaurant"], type: ["Restaurant Food & Drink", "Gastronomia e Bebidas para Restaurante"], location: ["Birmingham, UK", "Birmingham, Reino Unido"], alt: ["Asha's Birmingham restaurant content", "Conteúdo do restaurante Asha's Birmingham"] }
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
    ["Who is Tiago Bastos?", "Tiago Bastos is a commercial photographer and videographer working with hotels, restaurants, properties and brands. He is also co-founder of Hospo Creative."],
    ["What does Tiago specialise in?", "His work focuses on commercial photography, videography and content production, with particular experience in hospitality, food and drink, property, events and brand content."],
    ["Do you work in the Algarve and Lisbon?", "Yes. Tiago is based in Portugal and works across the Algarve, Lisbon and throughout the country."],
    ["Are you available in Birmingham and the West Midlands?", "Yes. Tiago is available for commercial shoots in Birmingham, the West Midlands and across the wider UK."],
    ["Can you work in London?", "Yes. London shoots can be planned alongside work throughout the UK."],
    ["Can I hire you as a freelance photographer or videographer?", "Yes. Projects can be booked directly for photography, video or a combined content production."],
    ["Do you offer both photography and video?", "Yes. Productions can include still photography, video, short-form vertical edits and content planning where needed."],
    ["Do you cover corporate events?", "Yes. Tiago covers conferences, launches, awards, brand events and other business occasions."],
    ["Do you photograph property and real estate?", "Yes. This includes hospitality, residential and commercial spaces, with photography and video shaped around the property’s audience."],
    ["Do you work internationally?", "Yes, for selected productions. Travel and production requirements are discussed as part of the proposal."]
  ],
  pt: [
    ["Quem é o Tiago Bastos?", "Tiago Bastos é fotógrafo comercial e videógrafo para hotéis, restaurantes, propriedades e marcas. É também cofundador da Hospo Creative."],
    ["Em que é que o Tiago é especializado?", "O seu trabalho foca-se em fotografia comercial, videografia e produção de conteúdo, com experiência particular em hotelaria, gastronomia e bebidas, imobiliário, eventos e conteúdos de marca."],
    ["Trabalha no Algarve e em Lisboa?", "Sim. O Tiago está baseado em Portugal e trabalha no Algarve, em Lisboa e em todo o país."],
    ["Está disponível em Birmingham e West Midlands?", "Sim. O Tiago está disponível para produções comerciais em Birmingham, West Midlands e no restante Reino Unido."],
    ["Pode trabalhar em Londres?", "Sim. As produções em Londres podem ser planeadas em conjunto com projetos por todo o Reino Unido."],
    ["Posso contratar como fotógrafo ou videógrafo freelancer?", "Sim. Pode contratar diretamente fotografia, vídeo ou uma produção de conteúdo combinada."],
    ["Disponibiliza fotografia e vídeo?", "Sim. As produções podem incluir fotografia, vídeo, edições verticais short-form e planeamento de conteúdo quando necessário."],
    ["Cobre eventos corporativos?", "Sim. O Tiago cobre conferências, lançamentos, prémios, eventos de marca e outras ocasiões empresariais."],
    ["Fotografa propriedade e imobiliário?", "Sim. Inclui espaços de hotelaria, residenciais e comerciais, com fotografia e vídeo adequados ao público da propriedade."],
    ["Trabalha internacionalmente?", "Sim, para produções selecionadas. As necessidades de viagem e produção são discutidas na proposta."]
  ]
} as const;

function findImage(study: CaseStudy) {
  return study.heroImage || study.media?.find((item) => item.mediaType === "image")?.src || null;
}

export function TiagoBastosProfile({ locale, caseStudies }: Props) {
  const t = content[locale];
  const languageIndex = locale === "pt" ? 1 : 0;
  const selectedProjects = projectDetails.flatMap((detail) => {
    const slugs = Array.from(detail.matches) as string[];
    const study = caseStudies.find((item) => slugs.includes(item.slug) || item.clientName.toLowerCase().includes(detail.matches[0].replaceAll("-", " ").split(" ").slice(0, 2).join(" ")));
    return study ? [{ detail, study, image: findImage(study) }] : [];
  });
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs[locale].map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
  };

  return (
    <>
      <SeoStructuredData data={faqSchema} />
      <section className="overflow-hidden bg-[#062f5f] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24 lg:px-16">
          <div className="max-w-3xl">
            <Link href={localizedPath("/", locale)} className="inline-flex items-center text-sm font-semibold tracking-[0.18em] text-[#f5c342] transition hover:text-white">HOSPO CREATIVE <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
            <p className="mt-14 text-xs font-bold tracking-[0.18em] text-[#f5c342]">{t.eyebrow}</p>
            <h1 className="mt-5 font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">{t.title}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80">{t.intro}</p>
            <p className="mt-8 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#f5c342]"><MapPin className="h-4 w-4" /> {t.location}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href={localizedPath("/contact", locale)} className="inline-flex items-center justify-center rounded-full bg-[#f5c342] px-7 py-4 text-sm font-bold text-[#062f5f] transition hover:bg-white">{t.enquire}<ArrowUpRight className="ml-2 h-4 w-4" /></Link>
              <a href="#work" className="inline-flex items-center justify-center rounded-full border border-white/35 px-7 py-4 text-sm font-bold text-white transition hover:border-white hover:bg-white/10">{t.work}</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[2rem] border border-[#f5c342]/30" />
            <Image src="/images/tiago-bastos-headshot.png" alt="Tiago Bastos, commercial photographer and videographer" width={960} height={1200} priority className="relative aspect-[4/5] w-full rounded-[1.55rem] object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-[#f7f6f2] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.servicesEyebrow}</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-[#062f5f] sm:text-5xl">{t.servicesTitle}</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#062f5f]/15 bg-[#062f5f]/15 md:grid-cols-2 lg:grid-cols-3">
            {services[locale].map(([number, title, body]) => <article key={number} className="bg-[#f7f6f2] p-7 sm:p-8"><p className="text-xs font-bold tracking-[0.2em] text-[#b27b00]">{number}</p><h3 className="mt-8 text-xl font-bold text-[#062f5f]">{title}</h3><p className="mt-4 leading-7 text-[#173f6d]">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section id="work" className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.workEyebrow}</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"><h2 className="font-serif text-4xl leading-tight text-[#062f5f] sm:text-5xl">{t.workTitle}</h2><p className="max-w-xl leading-7 text-[#173f6d]">{t.workIntro}</p></div>
          {selectedProjects.length > 0 && <div className="mt-12 grid gap-7 md:grid-cols-2">{selectedProjects.map(({ detail, study, image }) => <article key={study.slug} className="group overflow-hidden rounded-2xl bg-[#f7f6f2]"><div className="aspect-[16/10] overflow-hidden bg-[#dfe5e9]">{image ? <Image src={image} alt={detail.alt[languageIndex]} width={1600} height={1000} unoptimized className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="h-full w-full bg-[#062f5f]" />}</div><div className="p-7"><p className="text-xs font-bold tracking-[0.15em] text-[#b27b00]">{detail.type[languageIndex]} · {detail.location[languageIndex]}</p><h3 className="mt-3 text-2xl font-bold text-[#062f5f]">{locale === "pt" && study.titlePt ? study.titlePt : study.title}</h3><Link href={localizedPath(`/case-studies/${study.slug}`, locale)} className="mt-6 inline-flex items-center font-bold text-[#062f5f] underline underline-offset-4">{t.viewProject}<ArrowUpRight className="ml-2 h-4 w-4" /></Link></div></article>)}</div>}
        </div>
      </section>

      <section className="bg-[#0b3b70] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="text-xs font-bold tracking-[0.18em] text-[#f5c342]">{t.experienceEyebrow}</p><h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{t.experienceTitle}</h2></div><div><p className="max-w-2xl text-lg leading-8 text-white/85">{t.experience}</p><ul className="mt-8 grid gap-3 sm:grid-cols-2">{[locale === "pt" ? "Direção criativa com contexto operacional" : "Creative direction with operational context", locale === "pt" ? "Conteúdo pensado para equipas comerciais" : "Content made for commercial teams", locale === "pt" ? "Produções eficientes no local" : "Efficient productions on location", locale === "pt" ? "Fotografia, vídeo e edição numa equipa" : "Photography, video and editing in one team"].map((item) => <li key={item} className="flex gap-3 text-sm text-white/85"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#f5c342]" />{item}</li>)}</ul></div></div></section>

      <section className="bg-[#f7f6f2] px-6 py-20 sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.geographyEyebrow}</p><h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-[#062f5f] sm:text-5xl">{t.geographyTitle}</h2><div className="mt-12 grid gap-6 md:grid-cols-3">{(locale === "pt" ? [["Portugal", "Baseado em Portugal, disponível no Algarve, Lisboa e em todo o país para fotografia e vídeo comercial."], ["Reino Unido", "Disponível em Birmingham, West Midlands, Londres e no restante Reino Unido."], ["Internacional", "Produções internacionais selecionadas, com requisitos de viagem definidos na proposta."]] : [["Portugal", "Based in Portugal, available in the Algarve, Lisbon and nationwide for commercial photography and video."], ["United Kingdom", "Available in Birmingham, the West Midlands, London and throughout the wider UK."], ["International", "Selected international productions, with travel requirements set out in the proposal."]]).map(([title, body]) => <article key={title} className="rounded-2xl bg-white p-7"><MapPin className="h-5 w-5 text-[#b27b00]" /><h3 className="mt-6 text-xl font-bold text-[#062f5f]">{title}</h3><p className="mt-3 leading-7 text-[#173f6d]">{body}</p></article>)}</div></div></section>

      <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.testimonialsEyebrow}</p><h2 className="mt-4 font-serif text-4xl leading-tight text-[#062f5f] sm:text-5xl">{t.testimonialsTitle}</h2><div className="mt-12 grid gap-6 lg:grid-cols-3">{testimonials[locale].map(([quote, source]) => <figure key={source} className="rounded-2xl border border-[#062f5f]/15 p-7"><blockquote className="font-serif text-2xl leading-snug text-[#062f5f]">“{quote}”</blockquote><figcaption className="mt-7 text-sm leading-6 text-[#173f6d]">{source}</figcaption></figure>)}</div></div></section>

      <section className="bg-[#f7f6f2] px-6 py-20 sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto max-w-4xl"><p className="text-xs font-bold tracking-[0.18em] text-[#b27b00]">{t.faqEyebrow}</p><h2 className="mt-4 font-serif text-4xl leading-tight text-[#062f5f] sm:text-5xl">{t.faqTitle}</h2><div className="mt-10 divide-y divide-[#062f5f]/15 border-y border-[#062f5f]/15">{faqs[locale].map(([question, answer]) => <details key={question} className="group py-5"><summary className="cursor-pointer list-none pr-8 text-lg font-bold text-[#062f5f] marker:hidden">{question}<span className="float-right text-[#b27b00] group-open:rotate-45">+</span></summary><p className="max-w-3xl pt-4 leading-7 text-[#173f6d]">{answer}</p></details>)}</div></div></section>

      <section className="bg-[#062f5f] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto max-w-4xl text-center"><h2 className="font-serif text-4xl leading-tight sm:text-6xl">{t.ctaTitle}</h2><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">{t.ctaBody}</p><Link href={localizedPath("/contact", locale)} className="mt-10 inline-flex items-center rounded-full bg-[#f5c342] px-8 py-4 text-sm font-bold text-[#062f5f] transition hover:bg-white">{t.cta}<ArrowUpRight className="ml-2 h-4 w-4" /></Link></div></section>
    </>
  );
}
