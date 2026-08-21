import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ServiceDetailPage } from "@/components/CommercialPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { servicePageBySlug, servicePages } from "@/data/commercialPages";
import { serviceDetails } from "@/data/serviceDetails";
import { getRequestLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { getPublishedCaseStudies } from "@/lib/supabase/queries";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return servicePages.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicePageBySlug[slug];
  const locale = await getRequestLocale();
  if (!service) return {};
  const detail = serviceDetails[slug]?.[locale];
  return buildPageMetadata({ title: `${translate(locale, service.title)} | Hospo Creative`, description: detail?.heroDescription ?? service.description, pathname: `/services/${slug}`, locale });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = servicePageBySlug[slug];
  if (!service) notFound();
  const locale = await getRequestLocale();
  const caseStudies = await getPublishedCaseStudies(locale);
  return <><Header locale={locale} /><ServiceDetailPage service={service} locale={locale} caseStudies={caseStudies} /><Footer locale={locale} /></>;
}
