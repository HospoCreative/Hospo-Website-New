"use client";

import { Cookie } from "lucide-react";
import { COOKIE_CONSENT_EVENT } from "@/lib/analytics";
import { translate, type Locale } from "@/lib/i18n";

export function CookieSettingsButton({ locale = "en" }: { locale?: Locale }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT))}
      className="inline-flex min-h-9 items-center gap-1 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
    >
      <Cookie aria-hidden="true" size={14} />
      {translate(locale, "Cookie Settings")}
    </button>
  );
}
