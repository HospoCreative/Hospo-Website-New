"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

function contactMethod(href: string) {
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "phone";
  if (/^https?:\/\/(?:wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(href)) return "whatsapp";
  return null;
}

export function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link?.href) return;

      const method = contactMethod(link.href);
      if (method) {
        trackAnalyticsEvent("contact_click", { method, source_page: window.location.pathname });
        return;
      }

      const targetUrl = new URL(link.href, window.location.origin);
      if (targetUrl.origin !== window.location.origin || targetUrl.pathname !== "/contact" || !link.classList.contains("button-primary")) return;
      trackAnalyticsEvent("cta_click", { cta_type: "contact", source_page: window.location.pathname });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
