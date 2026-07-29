"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteContent } from "@/data/site";
import { Logo } from "./Logo";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-white/10 bg-ink text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center outline-none transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          aria-label="Hospo Creative home"
        >
          <Logo variant="white" className="h-7 w-auto sm:h-8" priority />
        </Link>

        <nav className="hidden items-center gap-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/[0.78] xl:flex">
          {siteContent.navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#digital-review"
            className="hidden items-center gap-2 rounded-full bg-yellow px-4 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:inline-flex"
          >
            Request a Digital Review
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} />
          </Link>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink xl:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="min-h-[calc(100vh-4.5rem)] border-t border-white/10 bg-ink px-5 py-5 shadow-editorial xl:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2">
            {siteContent.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-2 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/[0.82] transition hover:bg-white/[0.08] hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/#digital-review"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-yellow/45 bg-white/[0.06] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Request a Digital Review
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
