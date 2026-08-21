"use client";

import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { localizedPath, translate, type Locale } from "@/lib/i18n";
import { Logo } from "./Logo";

type NavItem = {
  label: string;
  href: string;
};

type MenuLink = {
  label: string;
  href: string;
  description?: string;
};

export function HeaderClient({ locale, navItems }: { locale: Locale; navItems: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus: Record<string, MenuLink[]> = locale === "pt"
    ? {
        "/hotels-stays": [
          { label: "Hotéis e alojamentos", href: "/hotels-stays", description: "Marketing para propriedades e estadias." },
          { label: "Websites e reservas diretas", href: "/services/websites-direct-booking" },
          { label: "Otimização de OTAs", href: "/services/ota-optimisation" },
          { label: "SEO e visibilidade no Google", href: "/services/seo-google-visibility" },
          { label: "Fotografia e vídeo", href: "/services/photography-video" }
        ],
        "/restaurants-fb": [
          { label: "Restaurantes e F&B", href: "/restaurants-fb", description: "Marketing para restaurantes, bares e marcas F&B." },
          { label: "Estratégia e campanhas", href: "/services/strategy-campaigns" },
          { label: "Redes sociais", href: "/services/social-media" },
          { label: "Fotografia e vídeo", href: "/services/photography-video" },
          { label: "Websites e reservas diretas", href: "/services/websites-direct-booking" }
        ],
        "/services": [
          { label: "Todos os serviços", href: "/services", description: "Apoio conectado para prioridades comerciais." },
          { label: "Estratégia e campanhas", href: "/services/strategy-campaigns" },
          { label: "Websites e reservas diretas", href: "/services/websites-direct-booking" },
          { label: "Otimização de OTAs", href: "/services/ota-optimisation" },
          { label: "SEO e visibilidade no Google", href: "/services/seo-google-visibility" },
          { label: "Fotografia e vídeo", href: "/services/photography-video" },
          { label: "Redes sociais", href: "/services/social-media" }
        ],
        "/case-studies": [
          { label: "Projetos selecionados", href: "/case-studies", description: "Estratégia, conteúdo e execução em ação." }
        ],
        "/blog": [
          { label: "Todos os artigos", href: "/blog", description: "Ideias práticas para presença digital e marketing." }
        ],
        "/about": [
          { label: "Sobre a Hospo", href: "/about", description: "A equipa e a forma como trabalhamos." },
          { label: "Fale com a Hospo", href: "/contact" }
        ]
      }
    : {
        "/hotels-stays": [
          { label: "Hotels & stays", href: "/hotels-stays", description: "Marketing for properties and stays." },
          { label: "Websites & direct booking", href: "/services/websites-direct-booking" },
          { label: "OTA optimisation", href: "/services/ota-optimisation" },
          { label: "SEO & Google visibility", href: "/services/seo-google-visibility" },
          { label: "Photography & video", href: "/services/photography-video" }
        ],
        "/restaurants-fb": [
          { label: "Restaurants & F&B", href: "/restaurants-fb", description: "Marketing for restaurants, bars and F&B brands." },
          { label: "Strategy & campaigns", href: "/services/strategy-campaigns" },
          { label: "Social media", href: "/services/social-media" },
          { label: "Photography & video", href: "/services/photography-video" },
          { label: "Websites & direct booking", href: "/services/websites-direct-booking" }
        ],
        "/services": [
          { label: "All services", href: "/services", description: "Connected support for commercial priorities." },
          { label: "Strategy & campaigns", href: "/services/strategy-campaigns" },
          { label: "Websites & direct booking", href: "/services/websites-direct-booking" },
          { label: "OTA optimisation", href: "/services/ota-optimisation" },
          { label: "SEO & Google visibility", href: "/services/seo-google-visibility" },
          { label: "Photography & video", href: "/services/photography-video" },
          { label: "Social media", href: "/services/social-media" }
        ],
        "/case-studies": [
          { label: "Selected work", href: "/case-studies", description: "Strategy, content and execution in action." }
        ],
        "/blog": [
          { label: "All insights", href: "/blog", description: "Practical thinking for stronger marketing." }
        ],
        "/about": [
          { label: "About Hospo", href: "/about", description: "The team and the way we work." },
          { label: "Talk to Hospo", href: "/contact" }
        ]
      };

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setActiveMenu(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function switchLanguage() {
    const nextLocale = locale === "en" ? "pt" : "en";
    const currentPath = window.location.pathname;
    const unprefixedPath = currentPath === "/pt" ? "/" : currentPath.replace(/^\/pt(?=\/)/, "");
    const nextPath = nextLocale === "pt" ? (unprefixedPath === "/" ? "/pt" : `/pt${unprefixedPath}`) : unprefixedPath;
    window.location.assign(`${nextPath}${window.location.search}${window.location.hash}`);
  }

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-white/10 bg-ink text-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-3 focus:text-ink">
        {translate(locale, "Skip to content")}
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href={localizedPath("/", locale)} className="inline-flex min-h-11 items-center outline-none transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink" aria-label={translate(locale, "Hospo Creative home")}>
          <Logo variant="white" className="h-7 w-auto sm:h-8" priority />
        </Link>

        <nav className="hidden items-center gap-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/[0.78] xl:flex" aria-label={translate(locale, "Main navigation")}>
          {navItems.map((item) => {
            const links = item.href === "/services" ? menus[item.href] : undefined;
            if (!links) {
              return <a key={item.href} href={localizedPath(item.href, locale)} className="inline-flex min-h-11 items-center transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink">{item.label}</a>;
            }

            const isActive = activeMenu === item.href;
            return (
              <div key={item.href} className="relative" onMouseEnter={() => setActiveMenu(item.href)} onMouseLeave={() => setActiveMenu(null)}>
                <div className="flex min-h-11 items-center">
                  <a href={localizedPath(item.href, locale)} className="py-3 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink">{item.label}</a>
                  <button type="button" onClick={() => setActiveMenu(isActive ? null : item.href)} onFocus={() => setActiveMenu(item.href)} aria-label={`${item.label} ${translate(locale, "menu")}`} aria-expanded={isActive} aria-controls={`header-menu-${item.href.slice(1)}`} className="ml-1 grid size-6 place-items-center rounded-sm transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
                    <ChevronDown size={14} aria-hidden="true" className={`transition-transform duration-200 ${isActive ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {isActive && (
                  <div id={`header-menu-${item.href.slice(1)}`} className="absolute left-0 top-[calc(100%-0.15rem)] w-[20rem] rounded-md border border-white/15 bg-ink p-2 shadow-[0_18px_45px_rgba(0,0,0,0.28)]" onFocus={() => setActiveMenu(item.href)}>
                    {links.map((link, index) => (
                      <a key={link.href} href={localizedPath(link.href, locale)} className="group block rounded-sm px-3 py-3 transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
                        <span className="block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white transition group-hover:text-yellow">{link.label}</span>
                        {index === 0 && link.description && <span className="mt-1 block normal-case text-xs font-normal leading-5 tracking-normal text-white/56">{link.description}</span>}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href={localizedPath("/contact", locale)} className="hidden items-center gap-2 rounded-full bg-yellow px-4 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:inline-flex">
            {translate(locale, "Talk to Hospo")}
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} />
          </Link>

          <button type="button" className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink xl:hidden" onClick={() => setIsOpen((value) => !value)} aria-label={translate(locale, isOpen ? "Close menu" : "Open menu")} aria-expanded={isOpen}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button type="button" onClick={switchLanguage} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/25 px-3 text-[0.65rem] font-black uppercase tracking-[0.14em] text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow" aria-label={locale === "en" ? "Ver site em português" : "View site in English"}>
            {locale === "en" ? "PT" : "EN"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="min-h-[calc(100vh-4.5rem)] border-t border-white/10 bg-ink px-5 py-5 shadow-editorial xl:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <div key={item.href} className="rounded-md">
                <a href={localizedPath(item.href, locale)} onClick={() => setIsOpen(false)} className="block px-2 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/[0.82] transition hover:bg-white/[0.08] hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">{item.label}</a>
                {item.href === "/services" && menus[item.href] && <div className="grid gap-1 border-l border-white/15 pb-2 pl-4">{menus[item.href].slice(1).map((link) => <a key={link.href} href={localizedPath(link.href, locale)} onClick={() => setIsOpen(false)} className="py-1.5 text-xs leading-5 text-white/60 transition hover:text-yellow focus-visible:outline-none focus-visible:text-yellow">{link.label}</a>)}</div>}
              </div>
            ))}
            <Link href={localizedPath("/contact", locale)} onClick={() => setIsOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-yellow px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
              {translate(locale, "Talk to Hospo")}
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
