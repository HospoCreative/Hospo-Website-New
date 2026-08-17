import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getSiteContent } from "@/data/site";
import { localizedPath, translate, type Locale } from "@/lib/i18n";
import { Logo } from "./Logo";
import { CookieSettingsButton } from "./CookieSettingsButton";

export function Footer({ locale = "en" }: { locale?: Locale }) {
  const siteContent = getSiteContent(locale);
  const { contact, footer } = siteContent;
  const groups = [
    {
      title: "Industries",
      links: [
        { label: "Hotels & Stays", href: "/hotels-stays" },
        { label: "Restaurants & F&B", href: "/restaurants-fb" }
      ]
    },
    {
      title: "Services",
      links: [
        { label: "Strategy & Campaigns", href: "/services/strategy-campaigns" },
        { label: "Websites & Direct Booking", href: "/services/websites-direct-booking" },
        { label: "OTA Optimisation", href: "/services/ota-optimisation" },
        { label: "SEO & Google Visibility", href: "/services/seo-google-visibility" },
        { label: "Photography & Video", href: "/services/photography-video" },
        { label: "Social Media", href: "/services/social-media" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Work", href: "/case-studies" },
        { label: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Insights", href: "/blog" },
        { label: "Digital Presence Review", href: "/digital-scan" }
      ]
    }
  ];

  return (
    <footer className="border-t border-white/10 bg-ink px-5 py-12 text-white sm:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)]">
          <div>
            <Link href={localizedPath("/", locale)} className="inline-flex min-h-11 items-center transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow" aria-label={translate(locale, "Hospo Creative home")}>
              <Logo variant="white" className="h-7 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">{footer.description}</p>
            <a href={`mailto:${contact.email}`} className="mt-5 inline-flex min-h-9 items-center text-sm text-white/75 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">{contact.email}</a>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => <div key={group.title}><p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-yellow">{translate(locale, group.title)}</p><ul className="mt-4 space-y-2.5">{group.links.map((link) => <li key={link.href}><Link href={localizedPath(link.href, locale)} className="text-sm leading-6 text-white/65 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">{translate(locale, link.label)}</Link></li>)}</ul></div>)}
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-white/10 pt-5 text-xs text-white/45">
          <p>&copy; {footer.copyright}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2"><span>{locale === "en" ? "English" : "Português"}</span><CookieSettingsButton locale={locale} />{contact.socials.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">{link.label}<ArrowUpRight aria-hidden="true" size={13} /></a>)}</div>
        </div>
      </div>
    </footer>
  );
}
