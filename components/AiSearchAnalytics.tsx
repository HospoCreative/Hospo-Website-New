"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export function AiSearchAnalytics() {
  useEffect(() => { trackAnalyticsEvent("cta_click", { source: "ai_search_page_view" }); }, []);
  return null;
}

export function AiSearchContactLink({ className }: { className: string }) {
  return <Link onClick={() => trackAnalyticsEvent("contact_click", { source: "ai_search" })} href="/pt/contact" className={className}>Falar com a HOSPO<ArrowUpRight size={16}/></Link>;
}
