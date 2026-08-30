"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function PublicProposalTracker({ slug, ctaUrl, ctaLabel }: { slug: string; ctaUrl?: string; ctaLabel?: string }) {
  useEffect(() => { void createSupabaseBrowserClient().rpc("record_proposal_public_event", { p_slug: slug, p_event_type: "viewed" }); trackAnalyticsEvent("proposal_view", { proposal_slug: slug }); }, [slug]);
  if (!ctaUrl) return null;
  return <a href={ctaUrl} onClick={() => { void createSupabaseBrowserClient().rpc("record_proposal_public_event", { p_slug: slug, p_event_type: "cta_clicked" }); trackAnalyticsEvent("proposal_cta_click", { proposal_slug: slug }); }} className="button-primary">{ctaLabel || "Talk to Hospo"}</a>;
}
