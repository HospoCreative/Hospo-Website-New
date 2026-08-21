import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import { servicePages } from "@/data/commercialPages";
import { getRequestLocale } from "@/lib/locale-server";
import { localizedPath, translate } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({ title: locale === "pt" ? "Serviços de Marketing para Hotéis e Restaurantes | Hospo Creative" : "Marketing Services for Hotels & Restaurants | Hospo Creative", description: locale === "pt" ? "Campanhas, websites, SEO, fotografia, vídeo e redes sociais para hotéis, alojamentos, restaurantes, bares e marcas F&B." : "Campaigns, websites, SEO, photography, video and social media for hotels, stays, restaurants, bars and F&B brands.", pathname: "/services", locale });
}

const processContent = {
  en: {
    eyebrow: "How we work",
    title: "A clear process from first priority to ongoing improvement.",
    intro: "Every Hospo project starts with what will make the most useful commercial difference, then creates a focused route from action to learning.",
    steps: [
      ["01", "Understand", "We learn how people currently discover, assess and choose your business, then identify the immediate commercial priority."],
      ["02", "Prioritise", "We decide which improvements should come first and where Hospo can make the most useful impact."],
      ["03", "Create & implement", "We turn the strategy into campaigns, content, websites, digital improvements and usable commercial assets."],
      ["04", "Measure", "We review relevant signals such as visibility, enquiries, bookings, reservations, engagement and quality of response."],
      ["05", "Optimise", "We use performance, customer behaviour and feedback to refine the work and decide what happens next."]
    ],
    support: "Not sure which service is the right first step? Start with a conversation about the commercial priority in front of you.",
    cta: "Talk to Hospo"
  },
  pt: {
    eyebrow: "Como trabalhamos",
    title: "Um processo claro, da primeira prioridade à melhoria contínua.",
    intro: "Cada projeto Hospo começa por aquilo que pode criar a diferença comercial mais útil e constrói um percurso focado entre ação e aprendizagem.",
    steps: [
      ["01", "Compreender", "Percebemos como as pessoas descobrem, avaliam e escolhem atualmente o seu negócio, depois identificamos a prioridade comercial imediata."],
      ["02", "Priorizar", "Decidimos que melhorias devem acontecer primeiro e onde a Hospo pode criar o impacto mais útil."],
      ["03", "Criar e implementar", "Transformamos a estratégia em campanhas, conteúdo, websites, melhorias digitais e ativos comerciais úteis."],
      ["04", "Medir", "Revemos sinais relevantes como visibilidade, contactos, reservas, marcações, envolvimento e qualidade da resposta."],
      ["05", "Otimizar", "Usamos desempenho, comportamento dos clientes e feedback para melhorar o trabalho e decidir o próximo passo."]
    ],
    support: "Não tem a certeza de qual serviço deve ser o primeiro passo? Comece por uma conversa sobre a prioridade comercial à sua frente.",
    cta: "Fale com a Hospo"
  }
} as const;

export default async function ServicesPage() {
  const locale = await getRequestLocale();
  const process = processContent[locale];
  return (
    <>
      <Header locale={locale} />
      <main id="main" className="bg-white text-ink">
        <section className="bg-ink px-5 py-14 text-white sm:px-8 lg:py-16"><div className="mx-auto max-w-7xl"><p className="section-eyebrow text-yellow">{translate(locale, "Hospo services")}</p><h1 className="mt-5 max-w-5xl font-serif text-[clamp(2.7rem,5vw,4.6rem)] font-semibold leading-[0.96]">{locale === "pt" ? "Escolha o apoio que move a sua próxima prioridade." : "Choose the support that moves your next priority forward."}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{locale === "pt" ? "Comece com um desafio claro ou reúna as especialidades certas num só plano comercial." : "Start with one clear challenge, or bring the right specialist support into one commercial plan."}</p></div></section>
        <section className="bg-white px-5 py-[var(--hc-section)] sm:px-8"><div className="mx-auto max-w-7xl"><div className="grid border-y border-ink/10 md:grid-cols-2 lg:grid-cols-3">{servicePages.map((service, index) => <Reveal key={service.slug} delay={index * .035}><Link href={localizedPath(`/services/${service.slug}`, locale)} className="group block h-full border-b border-ink/10 p-7 transition hover:bg-ink hover:text-white md:border-r lg:[&:nth-child(3n)]:border-r-0"><p className="section-eyebrow text-yellow">{translate(locale, service.eyebrow)}</p><h2 className="mt-4 font-serif text-3xl font-semibold leading-none">{translate(locale, service.title)}</h2><p className="mt-4 text-sm leading-7 opacity-70">{translate(locale, service.description)}</p><span className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em]">{translate(locale, "Explore service")}<ArrowUpRight size={16} aria-hidden="true" /></span></Link></Reveal>)}</div>
          <div className="mt-10 flex flex-wrap gap-3 border-t border-ink/10 pt-8 text-sm text-ink/70"><span>{translate(locale, "Also available within integrated support:")}</span><span>{translate(locale, "Email & CRM")}</span><span>•</span><span>{translate(locale, "Reputation & Reviews")}</span><span>•</span><span>{translate(locale, "Analytics & Reporting")}</span><span>•</span><span>{translate(locale, "Influencer Marketing")}</span></div></div></section>
        <section className="overflow-hidden bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="section-eyebrow text-yellow">{process.eyebrow}</p><h2 className="mt-5 font-serif text-[clamp(2.4rem,4.6vw,4.35rem)] font-semibold leading-[.98]">{process.title}</h2><p className="mt-6 text-lg leading-8 text-white/72">{process.intro}</p></div><div className="relative mt-12"><div className="absolute left-4 right-4 top-5 hidden h-px bg-yellow/70 lg:block" /><ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{process.steps.map(([number, title, body], index) => <Reveal key={number} delay={index * .07} className="relative"><span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow bg-ink text-xs font-black text-yellow">{number}</span><div className="mt-5 border-l border-white/22 pl-4 lg:border-l-0 lg:pl-0"><h3 className="font-serif text-3xl font-semibold leading-none">{title}</h3><p className="mt-4 text-sm leading-7 text-white/70">{body}</p></div></Reveal>)}</ol></div></div></section>
        <section className="bg-[#f6f8fb] px-5 py-[var(--hc-section-compact)] sm:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 border border-ink/12 bg-white p-7 md:flex-row md:items-center md:p-9"><p className="max-w-2xl text-lg leading-8 text-ink/74">{process.support}</p><Link href={localizedPath("/contact", locale)} className="button-primary shrink-0 bg-ink text-white hover:bg-ink/90">{process.cta}<ArrowUpRight size={16} /></Link></div></section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
