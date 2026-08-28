import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { CommercialHub, ServicePage } from "@/data/commercialPages";
import { serviceDetails, type ServiceVisual } from "@/data/serviceDetails";
import { localizedPath, translate, type Locale } from "@/lib/i18n";
import type { CaseStudy } from "@/types/caseStudy";
import { ConnectedJourney } from "./ConnectedJourney";
import { imageFolders, photoGalleryImageText } from "@/data/images";
import { getPublicImageList } from "@/lib/imageFolders";
import { MosaicGallery } from "./MosaicGallery";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

const serviceLabels: Record<string, string> = {
  "strategy-campaigns": "Strategy & Campaigns",
  "websites-direct-booking": "Websites & Direct Booking",
  "ota-optimisation": "OTA Optimisation",
  "seo-google-visibility": "SEO & Google Visibility",
  "photography-video": "Photography & Video",
  "social-media": "Social Media"
};

const serviceTerms: Record<string, string[]> = {
  "strategy-campaigns": ["campaign", "strategy", "advertising", "social", "content"],
  "websites-direct-booking": ["website", "web design", "booking", "conversion"],
  "ota-optimisation": ["ota", "hotel", "stay", "accommodation", "resort"],
  "seo-google-visibility": ["seo", "google", "search", "website"],
  "photography-video": ["photo", "photography", "video", "content", "production"],
  "social-media": ["social", "content", "campaign", "community"]
};

const relatedServiceSlugs: Record<string, string[]> = {
  "strategy-campaigns": ["photography-video", "social-media", "websites-direct-booking", "seo-google-visibility"],
  "websites-direct-booking": ["seo-google-visibility", "photography-video", "strategy-campaigns", "ota-optimisation"],
  "ota-optimisation": ["photography-video", "seo-google-visibility", "websites-direct-booking", "strategy-campaigns"],
  "seo-google-visibility": ["websites-direct-booking", "ota-optimisation", "strategy-campaigns", "social-media"],
  "photography-video": ["social-media", "websites-direct-booking", "strategy-campaigns", "ota-optimisation"],
  "social-media": ["photography-video", "strategy-campaigns", "seo-google-visibility", "websites-direct-booking"]
};

function ProjectCards({ projects, locale, heading = "Relevant work", tone = "white" }: { projects: CaseStudy[]; locale: Locale; heading?: string; tone?: "white" | "ink" }) {
  if (!projects.length) return null;
  const dark = tone === "ink";
  return (
    <section className={`service-chapter service-chapter--${dark ? "ink" : "light"} ${dark ? "bg-ink text-white" : "bg-white text-ink"} px-5 py-[var(--hc-section-compact)] sm:px-8`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="section-eyebrow text-yellow">{translate(locale, heading)}</p><h2 className="mt-4 max-w-2xl font-serif text-[clamp(2.25rem,4vw,3.8rem)] font-semibold leading-[.98]">{locale === "pt" ? "Trabalho construído a partir de experiências reais." : "Work built around real guest experiences."}</h2></div>
          <Link href={localizedPath("/work", locale)} className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] ${dark ? "text-white/82 hover:text-yellow" : "hover:text-ink/60"}`}>{translate(locale, "View all work")}<ArrowUpRight size={16} /></Link>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => {
            const image = project.heroImage || project.media?.find((item) => item.mediaType === "image")?.src;
            if (!image) return null;
            return <Link key={project.id} href={localizedPath(`/case-studies/${project.slug}`, locale)} className="group overflow-hidden rounded-[8px] border border-white/55 bg-ink transition duration-300 hover:-translate-y-1 hover:border-yellow"><div className="relative aspect-[4/5] overflow-hidden"><SmartImage src={image} alt={project.heroImageAlt || project.title} fill sizes="(min-width: 1024px) 30vw, 94vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" fallbackLabel={project.title} /></div><div className="p-5"><p className="section-eyebrow text-yellow">{project.clientName}{project.sector ? ` · ${project.sector}` : ""}</p><h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-white">{project.title}</h3><span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-white">{translate(locale, "View case study")}<ArrowUpRight size={15} /></span></div></Link>;
          })}
        </div>
      </div>
    </section>
  );
}

function relevantWork(caseStudies: CaseStudy[], hub: CommercialHub["slug"] | "both", serviceSlug?: string) {
  const terms = serviceSlug ? serviceTerms[serviceSlug] ?? [] : hub === "hotels-stays" ? ["hotel", "stay", "accommodation", "resort", "lodging"] : hub === "restaurants-fb" ? ["restaurant", "food", "f&b", "bar", "café", "dining"] : [];
  if (!terms.length) return caseStudies;
  const matches = caseStudies.filter((study) => terms.some((term) => `${study.sector ?? ""} ${study.services.join(" ")}`.toLowerCase().includes(term)));
  return matches.length ? matches : caseStudies;
}

function HeroCtas({ locale }: { locale: Locale }) {
  return <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4"><Link href={localizedPath("/contact", locale)} className="button-primary inline-flex items-center gap-2">{translate(locale, "Talk to Hospo")}<ArrowUpRight size={17} /></Link><Link href={localizedPath("/digital-scan", locale)} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-white/70 transition hover:text-yellow">{translate(locale, "Digital Presence Review")}<ArrowUpRight size={16} /></Link></div>;
}

function ServiceVisualStory({ visual, locale }: { visual: ServiceVisual; locale: Locale }) {
  const homepageGalleryImages = getPublicImageList(imageFolders.photoGallery, { text: photoGalleryImageText, altPrefix: "Hospo Creative portfolio image" });
  const images = visual.kind === "gallery"
    ? homepageGalleryImages
    : visual.images ?? [];

  if (visual.kind === "gallery") {
    return (
      <section className="service-chapter service-chapter--light overflow-hidden bg-white px-5 py-[var(--hc-section-compact)] text-ink sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl"><p className="section-eyebrow text-yellow">{visual.eyebrow}</p><h2 className="mt-5 font-serif text-[clamp(2.25rem,4.4vw,4.15rem)] font-semibold leading-[.98]">{visual.title}</h2><p className="mt-6 max-w-3xl text-base leading-8 text-ink/72">{visual.body}</p></div>
          <MosaicGallery items={images} locale={locale} />
        </div>
      </section>
    );
  }

  return (
    <section className="service-chapter service-chapter--light overflow-hidden bg-white px-5 py-[var(--hc-section-compact)] text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div><p className="section-eyebrow text-yellow">{visual.eyebrow}</p><h2 className="mt-5 font-serif text-[clamp(2.25rem,4.4vw,4.15rem)] font-semibold leading-[.98]">{visual.title}</h2><p className="mt-6 max-w-xl text-base leading-8 text-ink/72">{visual.body}</p></div>
          {images.length ? <div className="grid grid-cols-3 gap-3 lg:-mt-4" aria-label={visual.eyebrow}>{images.map((image, index) => <Reveal key={image.src} delay={index * .07} className={`${index === 1 ? "mt-10" : ""} relative aspect-[3/4] overflow-hidden rounded-[8px]`}><SmartImage src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 18vw, 30vw" className="object-cover" fallbackLabel={image.alt} /></Reveal>)}</div> : null}
        </div>
        {visual.note ? <p className="mt-8 max-w-5xl border-l-2 border-yellow pl-4 text-sm leading-7 text-ink/72">{visual.note}</p> : null}
      </div>
    </section>
  );
}

function ServiceFaqs({ locale, items }: { locale: Locale; items: { question: string; answer: string }[] }) {
  const label = locale === "pt" ? "Perguntas frequentes" : "Service FAQs";
  const heading = locale === "pt" ? "Perguntas práticas antes de avançarmos." : "Practical questions before we get started.";
  return <section className="service-chapter service-chapter--ink bg-ink px-5 py-[var(--hc-section-compact)] text-white sm:px-8"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.62fr_1.38fr]"><div><p className="section-eyebrow text-yellow">{label}</p><h2 className="mt-5 max-w-md font-serif text-[clamp(2.25rem,4vw,3.8rem)] font-semibold leading-[.98]">{heading}</h2></div><div className="border-y border-white/22">{items.map((item) => <details key={item.question} className="group border-b border-white/22 py-4 last:border-b-0"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-bold leading-7 marker:hidden"><span>{item.question}</span><ChevronDown className="shrink-0 transition group-open:rotate-180" size={19} aria-hidden="true" /></summary><p className="max-w-3xl pt-3 text-sm leading-7 text-white/70">{item.answer}</p></details>)}</div></div></section>;
}

export function CommercialHubPage({ hub, locale, caseStudies = [] }: { hub: CommercialHub; locale: Locale; caseStudies?: CaseStudy[] }) {
  const projects = relevantWork(caseStudies, hub.slug);
  return <main id="main" className="bg-white text-ink"><section className="bg-ink px-5 py-14 text-white sm:px-8 lg:py-16"><div className="mx-auto max-w-7xl"><p className="section-eyebrow text-yellow">{translate(locale, hub.eyebrow)}</p><h1 className="mt-5 max-w-5xl font-serif text-[clamp(2.7rem,5vw,4.6rem)] font-semibold leading-[.96]">{translate(locale, hub.title)}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{translate(locale, hub.description)}</p><p className="mt-6 max-w-2xl border-l-2 border-yellow pl-4 text-sm leading-7 text-white/60">{translate(locale, hub.audience)}</p><HeroCtas locale={locale} /></div></section>
    <section className="px-5 py-[var(--hc-section-compact)] sm:px-8"><div className="mx-auto max-w-7xl"><p className="section-eyebrow text-yellow">{translate(locale, "How Hospo supports you")}</p><div className="mt-7 grid border-y border-ink/10 md:grid-cols-2 xl:grid-cols-5">{hub.pillars.map((pillar) => <article key={pillar.title} className="border-b border-ink/10 px-0 py-7 md:px-6 md:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:px-7 xl:last:border-r-0"><span className="block h-1 w-8 bg-yellow" /><h2 className="mt-5 font-serif text-3xl font-semibold leading-none">{translate(locale, pillar.title)}</h2><p className="mt-4 text-sm leading-7 text-ink/70">{translate(locale, pillar.description)}</p></article>)}</div></div></section>
    {hub.journey ? <ConnectedJourney locale={locale} stages={hub.journey} /> : null}
    <ProjectCards projects={projects} locale={locale} />
    <section className="bg-ink px-5 py-12 text-white sm:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center"><div><p className="section-eyebrow text-yellow">{translate(locale, "Related services")}</p><p className="mt-3 text-white/70">{translate(locale, "Bring focused support together around the commercial priority in front of you.")}</p></div><div className="flex flex-wrap gap-4">{hub.relatedServiceSlugs.map((slug) => <Link key={slug} href={localizedPath(`/services/${slug}`, locale)} className="text-xs font-black uppercase tracking-[.13em] hover:text-yellow">{translate(locale, serviceLabels[slug])}</Link>)}</div></div></section></main>;
}

export function ServiceDetailPage({ service, locale, caseStudies = [] }: { service: ServicePage; locale: Locale; caseStudies?: CaseStudy[] }) {
  const detail = serviceDetails[service.slug]?.[locale];
  const projects = relevantWork(caseStudies, service.relatedHub, service.slug);
  const labels = locale === "pt" ? {
    forWho: "O ponto de partida", delivery: "O que está incluído", process: "Como trabalhamos", scope: "Notas de âmbito", related: "Serviços relacionados", contact: "Fale com a Hospo sobre a sua próxima prioridade.", review: "Prefere começar por uma leitura rápida do que é visível online?"
  } : {
    forWho: "Where this starts", delivery: "What is included", process: "How we work", scope: "Scope notes", related: "Related services", contact: "Talk to Hospo about your next priority.", review: "Prefer to begin with a practical review of what is visible online?"
  };
  if (!detail) return null;
  const related = relatedServiceSlugs[service.slug] ?? Object.keys(serviceLabels).filter((slug) => slug !== service.slug).slice(0, 4);

  return <main id="main" className="bg-white text-ink">
    <section className="bg-ink px-5 py-14 text-white sm:px-8 lg:py-16"><div className="mx-auto max-w-7xl"><p className="section-eyebrow text-yellow">{translate(locale, service.eyebrow)}</p><h1 className="mt-5 max-w-5xl font-serif text-[clamp(2.7rem,5vw,4.6rem)] font-semibold leading-[.96]">{translate(locale, service.title)}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/78">{detail.heroDescription}</p><HeroCtas locale={locale} /></div></section>
    <section className="service-chapter service-chapter--light bg-white px-5 py-[var(--hc-section-compact)] sm:px-8"><div className="mx-auto max-w-7xl"><div className="border-b border-ink/12 pb-8"><p className="section-eyebrow text-yellow">{labels.forWho}</p><h2 className="mt-5 max-w-5xl font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[.98]">{detail.audienceTitle}</h2><div className="mt-6 grid gap-7 lg:grid-cols-[1.2fr_.8fr] lg:items-end"><p className="max-w-4xl border-l-2 border-yellow pl-5 text-lg leading-8 text-ink/76">{detail.audienceBody}</p><div><p className="section-eyebrow text-yellow">{labels.delivery}</p><p className="mt-3 max-w-xl text-base leading-7 text-ink/72">{detail.deliverIntro}</p>{detail.scopeNote ? <div className="mt-5 border-l-2 border-yellow pl-4"><p className="text-xs font-black uppercase tracking-[.14em] text-ink/62">{labels.scope}</p><p className="mt-2 text-sm leading-6 text-ink/70">{detail.scopeNote}</p></div> : null}</div></div></div><div className="grid border-b border-ink/12 sm:grid-cols-2 lg:grid-cols-4">{detail.deliverables.map((item, index) => <Reveal key={item.title} delay={index * .05} className="border-b border-ink/12 py-5 sm:px-6 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:[&:nth-child(odd)]:border-r lg:last:border-r-0"><span className="block h-1 w-8 bg-yellow" /><h3 className="mt-4 font-serif text-xl font-semibold leading-tight">{item.title}</h3><p className="mt-3 text-sm leading-6 text-ink/72">{item.body}</p></Reveal>)}</div></div></section>
    <section className="service-chapter service-chapter--ink overflow-hidden bg-ink px-5 py-[var(--hc-section-compact)] text-white sm:px-8"><div className="mx-auto max-w-7xl"><div className="max-w-5xl"><p className="section-eyebrow text-yellow">{labels.process}</p><h2 className="mt-5 font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[.98]">{detail.improveIntro}</h2><p className="mt-5 max-w-4xl text-lg leading-8 text-white/72">{locale === "pt" ? "Um percurso claro, desde a primeira decisão até à execução e melhoria contínua." : "A clear route from the first decision through to execution and ongoing improvement."}</p></div><div className="relative mt-9"><div className="absolute left-4 right-4 top-5 hidden h-px bg-yellow/70 lg:block" /><ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{detail.process.map((step, index) => <Reveal key={step.title} delay={index * .07} className="relative"><span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow bg-ink text-xs font-black text-yellow">{step.number}</span><div className="mt-5 border-l border-white/22 pl-4 lg:border-l-0 lg:pl-0"><h3 className="font-serif text-3xl font-semibold leading-none">{step.title}</h3><p className="mt-4 text-sm leading-7 text-white/70">{step.body}</p></div></Reveal>)}</ol></div></div></section>
    <ServiceVisualStory visual={detail.visual} locale={locale} />
    {service.slug !== "photography-video" ? <ProjectCards projects={projects} locale={locale} tone="ink" /> : null}
    <section className="service-chapter service-chapter--light bg-white px-5 py-10 sm:px-8"><div className="mx-auto max-w-7xl border-y border-ink/12 py-7"><p className="section-eyebrow text-yellow">{labels.related}</p><div className="mt-5 flex flex-wrap gap-x-7 gap-y-4">{related.map((slug) => <Link key={slug} href={localizedPath(`/services/${slug}`, locale)} className="inline-flex items-center gap-2 text-sm font-bold transition hover:text-ink/60">{translate(locale, serviceLabels[slug])}<ArrowUpRight size={15} /></Link>)}</div></div></section>
    <ServiceFaqs locale={locale} items={detail.faqs} />
    <section className="service-chapter service-chapter--light bg-white px-5 py-10 text-ink sm:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center"><div><p className="max-w-2xl font-serif text-3xl font-semibold leading-tight">{labels.contact}</p><Link href={localizedPath("/digital-scan", locale)} className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-ink/65 hover:text-ink">{labels.review}<ArrowUpRight size={15} /></Link></div><Link href={localizedPath("/contact", locale)} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-xs font-extrabold uppercase tracking-[.14em] text-white transition hover:-translate-y-0.5 hover:bg-ink/88">{translate(locale, "Talk to Hospo")}<ArrowUpRight size={17} /></Link></div></section>
  </main>;
}
