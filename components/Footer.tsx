import { ArrowUpRight } from "lucide-react";
import { siteContent } from "@/data/site";
import { Logo } from "./Logo";

export function Footer() {
  const { contact, footer } = siteContent;

  return (
    <footer className="border-t border-white/10 bg-ink px-5 py-12 text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-end">
        <div className="max-w-md">
          <a
            href="#home"
            className="block transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
            aria-label="Hospo Creative home"
          >
            <Logo variant="white" className="h-10 w-auto" />
          </a>
          <p className="mt-5 text-base leading-7 text-white/64">
            {footer.description}
          </p>
          <p className="mt-5 text-sm text-white/[0.52]">
            &copy; {footer.copyright}
          </p>
        </div>

        <div className="flex flex-col gap-4 text-sm text-white/[0.62] lg:items-end">
          <a
            href={`mailto:${contact.email}`}
            className="transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
          >
            {contact.email}
          </a>
          <div className="flex flex-wrap gap-4">
            {contact.socials.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
              >
                {link.label}
                <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            ))}
            <a
              href="#home"
              className="inline-flex items-center gap-1 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
            >
              Back to top
              <ArrowUpRight aria-hidden="true" size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
