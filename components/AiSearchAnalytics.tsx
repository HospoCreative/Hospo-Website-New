"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";

export function AiSearchAnalytics() {
  useEffect(() => { trackAnalyticsEvent("cta_click", { source: "ai_search_page_view" }); }, []);
  return null;
}

export function AiSearchContactLink({ className, locale = "pt" }: { className: string; locale?: Locale }) {
  return <Link onClick={() => trackAnalyticsEvent("contact_click", { source: "ai_search" })} href={locale === "pt" ? "/pt/contact" : "/contact"} className={className}>{locale === "pt" ? "Falar com a HOSPO" : "Talk to Hospo"}<ArrowUpRight size={16}/></Link>;
}
