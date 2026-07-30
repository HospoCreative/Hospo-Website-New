import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getSiteContent } from "@/data/site";
import { localizedPath, translate, type Locale } from "@/lib/i18n";
import { Logo } from "./Logo";

export function Footer({ locale = "en" }: { locale?: Locale }) {
  const siteContent = getSiteContent(locale);
  const { contact, footer } = siteContent;

  return (
    <footer className="border-t border-white/10 bg-ink px-5 py-6 text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href={localizedPath("/", locale)}
            className="inline-flex min-h-11 items-center transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
            aria-label={translate(locale, "Hospo Creative home")}
          >
            <Logo variant="white" className="h-7 w-auto" />
          </Link>
          <p className="max-w-xl text-sm leading-6 text-white/60">
            {footer.description}
          </p>
          <p className="text-xs text-white/45">
            &copy; {footer.copyright}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-white/60 lg:justify-end">
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex min-h-9 items-center transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
          >
            {contact.email}
          </a>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {contact.socials.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-9 items-center gap-1 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
              >
                {link.label}
                <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            ))}
            <Link
              href={localizedPath("/#home", locale)}
              className="inline-flex min-h-9 items-center gap-1 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
            >
              {translate(locale, "Back to top")}
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
