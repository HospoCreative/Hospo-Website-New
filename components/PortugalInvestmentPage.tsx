"use client";

import { ArrowUpRight, Check, ChevronDown, LoaderCircle, LockKeyhole } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { portugalInvestmentCategories, portugalInvestmentServices } from "@/data/portugalInvestment";
import { trackAnalyticsEvent } from "@/lib/analytics";

const inputClass = "mt-2 min-h-12 w-full rounded-[8px] border border-ink/18 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/35";

export function PortugalInvestmentPage({ accessGranted }: { accessGranted: boolean }) {
  const [unlocked, setUnlocked] = useState(accessGranted);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    trackAnalyticsEvent(accessGranted ? "pricing_access_granted" : "pricing_gate_view");
  }, [accessGranted]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading"); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/pricing-portugal-access", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: form.get("name"), businessName: form.get("businessName"), email: form.get("email"), website: form.get("website"), businessType: form.get("businessType"), privacy: form.get("privacy") === "on", companyWebsite: form.get("companyWebsite") }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Não foi possível desbloquear o acesso.");
      trackAnalyticsEvent("pricing_gate_submit");
      trackAnalyticsEvent("pricing_access_granted");
      setUnlocked(true);
      window.setTimeout(() => document.querySelector("#servicos")?.scrollIntoView({ behavior: "smooth" }), 80);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível desbloquear o acesso."); setStatus("error"); }
  }

  return <main className="min-h-screen bg-ink text-white"><header className="border-b border-white/10 px-5 py-5 sm:px-8"><div className="page-container flex items-center justify-between"><Logo variant="white" className="h-8 w-auto" priority/><p className="inline-flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.15em] text-white/65"><LockKeyhole size={14} className="text-yellow"/>Área comercial privada</p></div></header>{unlocked ? <InvestmentContent/> : <section className="px-5 py-14 sm:px-8 lg:py-20"><div className="page-container grid gap-10 lg:grid-cols-[0.88fr_0.92fr] lg:items-center"><div><h1 className="max-w-xl font-serif text-[clamp(3rem,5.8vw,5.4rem)] leading-[0.92]">Serviços &amp; Investimento</h1><p className="mt-6 max-w-xl text-lg leading-8 text-white/72">Consulte os nossos serviços e valores de referência para projetos em Portugal.</p><div className="mt-9 border-l-2 border-yellow pl-5 text-sm leading-7 text-white/65">Preencha os seus dados para aceder à nossa estrutura de serviços e investimento.</div></div><form onSubmit={submit} noValidate className="rounded-[8px] bg-white p-5 text-ink shadow-editorial sm:p-8"><label className="sr-only" aria-hidden="true">Website da empresa<input tabIndex={-1} autoComplete="off" name="companyWebsite" /></label><div className="grid gap-5 sm:grid-cols-2"><Field label="Nome"><input required name="name" autoComplete="name" className={inputClass}/></Field><Field label="Nome do negócio"><input required name="businessName" autoComplete="organization" className={inputClass}/></Field><Field label="Email profissional"><input required name="email" type="email" autoComplete="email" className={inputClass}/></Field><Field label="Website ou uma rede social"><input name="website" inputMode="url" placeholder="https://" className={inputClass}/></Field><Field label="Tipo de negócio"><select required name="businessType" defaultValue="" className={inputClass}><option value="" disabled>Selecione uma opção</option>{["Hotel", "Boutique Hotel", "Alojamento", "Resort", "Restaurante", "Bar", "Café", "Grupo de Hotelaria / Restauração", "Outro"].map((option) => <option key={option}>{option}</option>)}</select></Field></div><label className="mt-5 flex items-start gap-3 text-sm leading-6 text-ink/72"><input required name="privacy" type="checkbox" className="mt-1 size-4 accent-ink"/><span>Autorizo a Hospo Creative a utilizar estes dados para gerir este pedido e entrar em contacto comigo sobre os seus serviços.</span></label><button disabled={status === "loading"} type="submit" className="button-primary mt-7 bg-ink text-white hover:bg-ink/85 disabled:opacity-60">{status === "loading" ? <><LoaderCircle className="animate-spin" size={16}/>A abrir acesso</> : <>Ver Serviços &amp; Investimento<ArrowUpRight size={16}/></>}</button>{error ? <p role="alert" className="mt-4 text-sm font-bold text-red-700">{error}</p> : null}</form></div></section>}</main>;
}

function InvestmentContent() {
  const headerImages = [
    { src: "/images/gallery/0.1_Bar Hotel cocktail hospo creative.jpg", alt: "Cocktail num bar de hotel" },
    { src: "/images/gallery/0.2_Bar Hotel Hospo Creative Cocktail.jpg", alt: "Cocktail servido num bar de hotel" },
    { src: "/images/gallery/0.4_Wine Hospo Creative.jpg", alt: "Vinho servido num espaço de hotelaria" },
    { src: "/images/gallery/1.7.jpg", alt: "Experiência de hotelaria" }
  ];

  return <><section className="px-5 py-14 sm:px-8 lg:py-20"><div className="page-container grid gap-10 lg:grid-cols-[1fr_.78fr] lg:items-center"><div><p className="section-eyebrow text-yellow">Valores de referência para Portugal</p><h1 className="mt-5 max-w-4xl font-serif text-[clamp(3.2rem,6vw,5.8rem)] leading-[0.91]">Serviços &amp; Investimento</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">Marketing especializado para hotéis, alojamentos, restauração e marcas F&amp;B em Portugal.</p><p className="mt-5 max-w-4xl text-base leading-7 text-white/62">Os nossos serviços são modulares e podem ser combinados de acordo com as necessidades de cada negócio. Os níveis Light, Standard e Pro funcionam como referências de complexidade, permitindo adaptar o âmbito e o investimento à dimensão da operação, mercados, canais e objetivos.</p></div><div className="mx-auto grid w-full max-w-[22rem] grid-cols-2 gap-3 lg:mx-0 lg:justify-self-end" aria-label="Seleção de trabalho Hospo Creative">{headerImages.map((image) => <div key={image.src} className="group relative aspect-[4/5] overflow-hidden rounded-[8px] border border-white/15"><Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 14rem, 45vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" /></div>)}</div></div></section><nav aria-label="Índice de serviços" className="sticky top-0 z-20 border-y border-white/10 bg-[#052f61]/95 px-5 py-4 backdrop-blur sm:px-8"><div className="page-container flex gap-5 overflow-x-auto"><a href="#modelo" className="shrink-0 text-xs font-black uppercase tracking-[0.13em] text-yellow">Modelo</a>{portugalInvestmentCategories.map((item) => <a key={item} href={`#${portugalInvestmentServices.find((service) => service.category === item)?.id}`} className="shrink-0 text-xs font-black uppercase tracking-[0.13em] text-white/72 transition hover:text-yellow">{item}</a>)}</div></nav><FrameworkSection/><section id="servicos" className="px-5 py-[var(--hc-section-compact)] sm:px-8"><div className="page-container space-y-4">{portugalInvestmentServices.map((service) => <ServiceCard key={service.id} service={service}/>)}</div></section><section className="border-y border-white/10 bg-[#052f61] px-5 py-[var(--hc-section-compact)] sm:px-8"><div className="page-container"><p className="section-eyebrow text-yellow">Informação importante</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{["Valores sem IVA e apresentados como referências comerciais.", "Investimento publicitário e fees de plataformas são pagos separadamente pelo cliente, quando aplicável.", "Creators, modelos, terceiros, software/licenças específicas, produções especiais e deslocações extraordinárias são orçamentados separadamente.", "O nível final é definido com base na dimensão, oferta, canais, mercados, volume de campanhas, website e complexidade operacional.", "Os serviços e níveis podem ser combinados."].map((item) => <p key={item} className="border-t border-white/20 pt-4 text-sm leading-6 text-white/72"><Check size={16} className="mr-2 inline text-yellow"/>{item}</p>)}</div></div></section><section className="px-5 py-16 sm:px-8 sm:py-20"><div className="page-container flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="section-eyebrow text-yellow">Próximo passo</p><h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.5rem,4.5vw,4.4rem)] leading-[0.93]">Não sabe qual a combinação mais adequada para o seu negócio?</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">Podemos ajudar a identificar os serviços prioritários e construir uma estrutura adaptada aos objetivos, operação e orçamento do seu negócio.</p></div><a onClick={() => trackAnalyticsEvent("contact_click", { source: "pricing_portugal" })} href="mailto:info@hospoagency.com?subject=Serviços%20%26%20Investimento%20Portugal" className="button-primary shrink-0">Falar com a HOSPO<ArrowUpRight size={16}/></a></div></section></>;
}

function ServiceCard({ service }: { service: typeof portugalInvestmentServices[number] }) {
  return <details id={service.id} className="group scroll-mt-24 rounded-[8px] border border-white/15 bg-[#06396d] open:border-yellow/70"><summary onClick={() => trackAnalyticsEvent("pricing_service_view", { service: service.id })} className="flex cursor-pointer list-none items-center justify-between gap-6 p-5 sm:p-7"><div><p className="section-eyebrow text-yellow">{service.category}</p><h2 className="mt-3 font-serif text-[clamp(1.9rem,3vw,3rem)] leading-none">{service.title}</h2></div><ChevronDown className="shrink-0 transition group-open:rotate-180"/></summary><div className="border-t border-white/15 px-5 pb-6 pt-6 sm:px-7 sm:pb-8"><p className="max-w-4xl text-base leading-7 text-white/72">{service.intro}</p>{service.contentPackages ? <ContentShootingCards packages={service.contentPackages}/> : service.tiers ? <div className="mt-6 grid gap-3 lg:grid-cols-3">{service.tiers.map((tier) => <article key={tier.name} className={`flex flex-col rounded-[8px] border ${tier.popular ? "border-yellow/70" : "border-white/15"} bg-ink/35 p-5`}>{service.tiers?.some((item) => item.popular) ? <div className="mb-3 min-h-6">{tier.popular ? <span className="inline-block rounded-full bg-yellow px-3 py-1 text-xs font-black text-ink">Mais Popular</span> : null}</div> : null}<p className="section-eyebrow text-yellow">{tier.name}</p><p className="mt-3 font-serif text-2xl text-white">{tier.price}</p>{tier.description ? <p className="mt-4 text-sm leading-6 text-white/75">{tier.description}</p> : null}<ul className="mt-5 space-y-2.5">{tier.items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-white/75"><Check size={15} className="mt-1 shrink-0 text-yellow"/>{item}</li>)}</ul>{tier.note ? <div className="mt-auto pt-5"><p className="border-t border-white/15 pt-4 text-sm leading-6 text-white/60">{tier.note}</p></div> : null}</article>)}</div> : <div className="mt-6 rounded-[8px] border border-white/15 bg-ink/35 p-5"><p className="font-serif text-2xl text-yellow">{service.singlePrice}</p><ul className="mt-4 space-y-2.5">{service.singleItems?.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-white/75"><Check size={15} className="mt-1 shrink-0 text-yellow"/>{item}</li>)}</ul></div>}{service.notes?.map((note, index) => <p key={note} className={`mt-5 text-sm leading-6 ${index === 0 && service.id === "conteudo" && !service.contentPackages ? "border-l-2 border-yellow bg-yellow/10 p-4 text-white" : "text-white/60"}`}>{note}</p>)}{service.contentPackages ? <a href="mailto:info@hospoagency.com?subject=Planear%20o%20meu%20shooting" onClick={() => trackAnalyticsEvent("contact_click", { source: "pricing_portugal_content" })} className="button-primary mt-7">Planear o meu shooting<ArrowUpRight size={16}/></a> : null}</div></details>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="text-sm font-bold text-ink">{label}{children}</label>; }


const frameworkRows = [
  ["Dimensão e diversidade da oferta", "Operação simples", "Oferta diversificada", "Resort / operação complexa"],
  ["Outlets e serviços", "1-2 principais", "3-4 áreas relevantes", "5+ áreas / vários conceitos"],
  ["Mercados e idiomas", "1 mercado principal", "2-3 mercados", "Vários mercados"],
  ["Campanhas", "Pontuais", "Regulares e sazonais", "Frequentes / vários segmentos"],
  ["Necessidade de conteúdo", "Baixa a moderada", "Regular", "Elevada e contínua"],
  ["Website / presença digital", "Estrutura simples", "Estrutura média", "Ecossistema digital complexo"],
  ["Processo de aprovação", "Simples", "Normal", "Vários intervenientes"],
] as const;

function FrameworkSection() {
  return (
    <section id="modelo" aria-labelledby="framework-title" className="scroll-mt-24 border-b border-white/10 bg-[#06396d] px-5 py-[var(--hc-section-compact)] sm:px-8">
      <div className="page-container">
        <p className="section-eyebrow text-yellow">Como funciona</p>
        <h2 id="framework-title" className="mt-4 font-serif text-[clamp(2.4rem,4.5vw,4.2rem)] leading-[0.95]">Lógica de enquadramento</h2>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-white/75">Cada unidade é avaliada com base na sua complexidade operacional e digital. Light, Standard e Pro são níveis de referência e não classificações rígidas de cada hotel.</p>
        <p className="mt-6 text-xs text-white/65 md:hidden">Deslize a tabela para comparar os três níveis.</p>
        <div role="region" aria-label="Comparação dos níveis Light, Standard e Pro" tabIndex={0} className="mt-4 overflow-x-auto rounded-[8px] border border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow md:mt-8">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm leading-6">
            <caption className="sr-only">Critérios de enquadramento por nível de serviço</caption>
            <thead className="bg-ink/60">
              <tr>{["Critério", "Light", "Standard", "Pro"].map((heading) => <th key={heading} scope="col" className="px-5 py-5 font-black text-yellow first:w-[28%]">{heading}</th>)}</tr>
            </thead>
            <tbody>{frameworkRows.map(([criterion, ...levels]) => (
              <tr key={criterion} className="border-t border-white/15 even:bg-ink/20">
                <th scope="row" className="px-5 py-4 font-semibold text-white">{criterion}</th>
                {levels.map((level, index) => <td key={index} className="px-5 py-4 align-top text-white/80">{level}</td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
        <p className="mt-6 border-l-2 border-yellow bg-yellow/10 p-5 text-base leading-7 text-white/90"><strong className="text-yellow">Importante:</strong> uma unidade pode, por exemplo, contratar Produção de Conteúdo Pro, Social Standard e Meta Ads Light. O preço final resulta do mix real de necessidades.</p>
      </div>
    </section>
  );
}


function ContentShootingCards({ packages }: { packages: NonNullable<typeof portugalInvestmentServices[number]["contentPackages"]> }) {
  return <div className="mt-6 grid gap-3 lg:grid-cols-3">{packages.map((item) => (
    <article key={item.name} className={`flex min-w-0 flex-col rounded-[8px] border bg-ink/35 p-5 ${item.popular ? "border-yellow/70" : "border-white/15"}`}>
      <div className="lg:min-h-[9.5rem]">
        <div className="mb-3 min-h-6">{item.popular ? <span className="inline-block rounded-full bg-yellow px-3 py-1 text-xs font-black text-ink">Mais Popular</span> : null}</div>
        <h3 className="section-eyebrow text-yellow">{item.name}</h3>
        <p className="mt-3 text-sm leading-6 text-white/75">{item.description}</p>
      </div>
      <p className="mt-4 text-sm font-bold text-white">{item.duration}</p>
      <dl className="mt-4 divide-y divide-white/15 border-y border-white/15">
        {[['Fotografia', item.photographyPrice], ['Fotografia + Vídeo', item.videoPrice]].map(([label, price]) => <div key={label} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3"><dt className="text-sm text-white/80">{label}</dt><dd className="font-serif text-2xl text-white">{price}<span className="ml-2 font-sans text-xs text-white/65">/ shooting</span></dd></div>)}
      </dl>
      <p className="mt-5 text-sm font-bold text-white">Fotografia inclui</p>
      <ul className="mt-3 space-y-2.5">{[item.photos, ...item.items].map((text) => <li key={text} className="flex gap-2 text-sm leading-6 text-white/75"><Check size={15} className="mt-1 shrink-0 text-yellow"/>{text}</li>)}</ul>
      <div className="mt-auto pt-5"><div className="border-t border-white/15 pt-4"><p className="text-sm font-bold text-white">Fotografia + Vídeo inclui</p><p className="mt-2 text-sm leading-6 text-white/75">Tudo o que está incluído em Fotografia, mais <strong className="font-semibold text-white">{item.videos}</strong>.</p></div></div>
    </article>
  ))}</div>;
}
