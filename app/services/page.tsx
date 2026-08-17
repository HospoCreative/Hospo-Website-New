import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { servicePages } from "@/data/commercialPages";
import { getRequestLocale } from "@/lib/locale-server";
import { localizedPath, translate } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({ title: locale === "pt" ? "Serviços de Marketing Digital | Hospo Creative" : "Hospitality Marketing Services | Hospo Creative", description: locale === "pt" ? "Serviços de marketing, campanhas, websites, SEO, OTAs, fotografia e redes sociais para hotéis, restaurantes e marcas F&B." : "Marketing, campaigns, websites, SEO, OTA optimisation, photography and social media for hotels, restaurants and F&B brands.", pathname: "/services", locale });
}

export default async function ServicesPage() {
  const locale = await getRequestLocale();
  return (
    <>
      <Header locale={locale} />
      <main id="main" className="bg-white text-ink">
        <section className="bg-ink px-5 py-16 text-white sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="section-eyebrow text-yellow">{translate(locale, "Hospo services")}</p>
            <h1 className="mt-5 max-w-4xl font-serif text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[0.96]">{translate(locale, "Connected support for stronger commercial performance.")}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{translate(locale, "Choose focused support for a specific challenge, or bring services together around one commercial goal.")}</p>
          </div>
        </section>
        <section className="px-5 py-[var(--hc-section)] sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid border-y border-ink/10 md:grid-cols-2 lg:grid-cols-3">
              {servicePages.map((service) => (
                <Link key={service.slug} href={localizedPath(`/services/${service.slug}`, locale)} className="group border-b border-ink/10 p-7 transition hover:bg-ink hover:text-white md:border-r lg:[&:nth-child(3n)]:border-r-0">
                  <p className="section-eyebrow text-yellow">{translate(locale, service.eyebrow)}</p>
                  <h2 className="mt-4 font-serif text-3xl font-semibold leading-none">{translate(locale, service.title)}</h2>
                  <p className="mt-4 text-sm leading-7 opacity-70">{translate(locale, service.description)}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em]">{translate(locale, "Explore service")}<ArrowUpRight size={16} aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3 border-t border-ink/10 pt-8 text-sm text-ink/70">
              <span>{translate(locale, "Also available within integrated support:")}</span>
              <span>{translate(locale, "Email & CRM")}</span><span>•</span>
              <span>{translate(locale, "Reputation & Reviews")}</span><span>•</span>
              <span>{translate(locale, "Analytics & Reporting")}</span><span>•</span>
              <span>{translate(locale, "Influencer Marketing")}</span>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
