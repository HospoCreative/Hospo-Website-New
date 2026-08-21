import { ArrowUpRight, Mail } from "lucide-react";
import { getHomepageContent } from "@/data/homepage";
import { getSiteContent } from "@/data/site";
import { localizedPath, translate, type Locale } from "@/lib/i18n";

export function FinalCta({ locale = "en" }: { locale?: Locale }) {
  const content = getHomepageContent(locale).finalCta;
  const siteContent = getSiteContent(locale);
  return (
    <section className="bg-ink px-5 py-[var(--hc-section-compact)] text-white sm:px-8">
      <div className="mx-auto max-w-7xl border-y border-white/16 py-10 sm:py-12">
        <h2 className="max-w-5xl text-balance font-serif text-[clamp(2.4rem,4.4vw,3.8rem)] font-semibold leading-[1.02]">{content.title}</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{content.body}</p>
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
          <a href={localizedPath("/contact", locale)} className="button-primary">{translate(locale, "Talk to Hospo")}<ArrowUpRight size={17} aria-hidden="true" /></a>
          <a href={localizedPath("/case-studies", locale)} className="button-secondary">{content.secondaryCta}<ArrowUpRight size={17} aria-hidden="true" /></a>
          <a href={`mailto:${siteContent.contact.email}`} className="inline-flex min-h-12 items-center gap-2 px-2 text-sm text-white/70 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"><Mail size={16} aria-hidden="true" />{siteContent.contact.email}</a>
        </div>
      </div>
    </section>
  );
}
