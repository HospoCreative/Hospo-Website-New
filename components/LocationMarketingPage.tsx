import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { locationPages, type LocationSlug } from "@/data/seoContent";
import { localizedPath, type Locale } from "@/lib/i18n";
import { localizedUrls, SITE_URL } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";
import { SeoStructuredData } from "./SeoStructuredData";

const serviceLinks = [
  { slug: "social-media", en: "Social media management", pt: "Gestão de redes sociais" },
  { slug: "photography-video", en: "Photography & video", pt: "Fotografia e vídeo" },
  { slug: "seo-google-visibility", en: "SEO & Google visibility", pt: "SEO e visibilidade no Google" },
  { slug: "websites-direct-booking", en: "Websites & direct booking", pt: "Websites e reservas diretas" },
  { slug: "strategy-campaigns", en: "Marketing strategy & campaigns", pt: "Estratégia e campanhas" }
] as const;

export function LocationMarketingPage({ slug, locale }: { slug: LocationSlug; locale: Locale }) {
  const page = locationPages[slug][locale];
  const place = slug === "algarve" ? "Algarve" : "Lisboa";
  const country = locale === "pt" ? "Portugal" : "Portugal";
  const { english, portuguese } = localizedUrls(`/${slug}`);
  const canonical = locale === "pt" ? portuguese : english;
  const labels = locale === "pt"
    ? { home: "Início", services: "Serviços", faq: "Perguntas frequentes", contact: "Fale com a Hospo", sectors: "Veja também" }
    : { home: "Home", services: "Services", faq: "FAQs", contact: "Talk to Hospo", sectors: "Explore also" };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: page.titleTag,
        description: page.metaDescription,
        inLanguage: locale === "pt" ? "pt-PT" : "en-GB",
        about: { "@type": "Place", name: `${place}, ${country}` },
        isPartOf: { "@id": `${SITE_URL}/#website` }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: labels.home, item: locale === "pt" ? `${SITE_URL}/pt` : SITE_URL },
          { "@type": "ListItem", position: 2, name: place, item: canonical }
        ]
      }
    ]
  };

  return (
    <main id="main" className="bg-white text-ink">
      <SeoStructuredData data={structuredData} />
      <section className="bg-ink px-5 py-14 text-white sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs locale={locale} tone="dark" items={[{ label: labels.home, href: "/" }, { label: place }]} />
          <p className="mt-8 section-eyebrow text-yellow">{page.eyebrow}</p>
          <h1 className="mt-5 max-w-5xl font-serif text-[clamp(2.7rem,5vw,4.7rem)] font-semibold leading-[.96]">{page.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{page.description}</p>
          <Link href={localizedPath("/contact", locale)} className="button-primary mt-8">{labels.contact}<ArrowUpRight size={17} /></Link>
        </div>
      </section>

      <section className="px-5 py-[var(--hc-section-compact)] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.76fr_1.24fr]">
          <div><p className="section-eyebrow text-yellow">{place}</p><h2 className="mt-5 font-serif text-[clamp(2.25rem,4vw,3.8rem)] font-semibold leading-[.98]">{page.audienceTitle}</h2></div>
          <ul className="grid gap-4 sm:grid-cols-3">{page.audience.map((item) => <li key={item} className="border-t border-ink/15 pt-4 text-base leading-7 text-ink/72"><Check className="mr-2 inline text-yellow" size={17} />{item}</li>)}</ul>
        </div>
      </section>

      <section className="bg-[#f6f8fb] px-5 py-[var(--hc-section-compact)] sm:px-8">
        <div className="mx-auto max-w-7xl"><p className="section-eyebrow text-yellow">{place}</p><h2 className="mt-5 max-w-4xl font-serif text-[clamp(2.25rem,4vw,3.8rem)] font-semibold leading-[.98]">{page.localContextTitle}</h2><p className="mt-6 max-w-4xl text-lg leading-8 text-ink/72">{page.localContext}</p></div>
      </section>

      <section className="px-5 py-[var(--hc-section-compact)] sm:px-8">
        <div className="mx-auto max-w-7xl"><p className="section-eyebrow text-yellow">{labels.services}</p><h2 className="mt-5 max-w-4xl font-serif text-[clamp(2.25rem,4vw,3.8rem)] font-semibold leading-[.98]">{page.servicesTitle}</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-ink/72">{page.servicesIntro}</p><div className="mt-9 grid border-y border-ink/15 sm:grid-cols-2 lg:grid-cols-5">{serviceLinks.map((service) => <Link key={service.slug} href={localizedPath(`/services/${service.slug}`, locale)} className="group border-b border-ink/15 p-5 transition hover:bg-ink hover:text-white sm:border-r sm:[&:nth-child(even)]:border-r-0 lg:border-b-0 lg:[&:nth-child(even)]:border-r lg:last:border-r-0"><h3 className="font-serif text-2xl leading-tight">{service[locale]}</h3><span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] group-hover:text-yellow">{locale === "pt" ? "Explorar serviço" : "Explore service"}<ArrowUpRight size={15} /></span></Link>)}</div></div>
      </section>

      <section className="bg-ink px-5 py-[var(--hc-section-compact)] text-white sm:px-8"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.65fr_1.35fr]"><div><p className="section-eyebrow text-yellow">{labels.faq}</p><h2 className="mt-5 font-serif text-[clamp(2.25rem,4vw,3.8rem)] font-semibold leading-[.98]">{locale === "pt" ? "Questões práticas antes de avançar." : "Practical questions before getting started."}</h2></div><div className="border-y border-white/20">{page.faqs.map((item) => <details key={item.question} className="border-b border-white/20 py-5 last:border-b-0"><summary className="cursor-pointer list-none font-bold leading-7">{item.question}</summary><p className="pt-3 text-sm leading-7 text-white/70">{item.answer}</p></details>)}</div></div></section>

      <section className="px-5 py-12 sm:px-8"><div className="mx-auto max-w-7xl border-y border-ink/15 py-7"><p className="section-eyebrow text-yellow">{labels.sectors}</p><div className="mt-5 flex flex-wrap gap-x-7 gap-y-4"><Link href={localizedPath("/hotels-stays", locale)} className="font-bold transition hover:text-ink/60">{locale === "pt" ? "Marketing para hotéis e alojamentos" : "Hotel & stay marketing"}</Link><Link href={localizedPath("/restaurants-fb", locale)} className="font-bold transition hover:text-ink/60">{locale === "pt" ? "Marketing para restaurantes e F&B" : "Restaurant & F&B marketing"}</Link><Link href={localizedPath(slug === "algarve" ? "/lisboa" : "/algarve", locale)} className="font-bold transition hover:text-ink/60">{slug === "algarve" ? "Lisboa" : "Algarve"}</Link></div></div></section>
    </main>
  );
}
