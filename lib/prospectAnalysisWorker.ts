import "server-only";

import { runProspectWebsiteScan, type Evidence } from "@/lib/prospectWebsiteScanner";
import { createProspectAnalysisWorkerClient } from "@/lib/prospectAnalysisWorkerSupabase";

const MAX_ATTEMPTS = 2;

type Analysis = { id: string; prospect_id: string; attempt_count: number };
type Prospect = { id: string; website_url: string; business_type: string };

async function lifecycle(prospectId: string, analysisId: string, activityType: string, description: string) {
  const supabase = createProspectAnalysisWorkerClient();
  await supabase.from("prospect_activity").insert({ prospect_id: prospectId, activity_type: activityType, description: `${description} (${analysisId.slice(0, 8)}).` });
}

function rows(prospectId: string, analysisId: string, evidence: Evidence[]) {
  return evidence.map((item) => ({ ...item, prospect_id: prospectId, analysis_id: analysisId }));
}

export async function runNextProspectAnalysisJob() {
  const supabase = createProspectAnalysisWorkerClient();
  await supabase.from("prospect_analyses").update({ status: "failed", current_stage: "finalisation", last_error: "Retry limit reached after an interrupted worker.", completed_at: new Date().toISOString() }).eq("status", "processing").gte("attempt_count", MAX_ATTEMPTS).lt("heartbeat_at", new Date(Date.now() - 10 * 60_000).toISOString());
  const { data, error } = await supabase.rpc("claim_next_prospect_analysis_job");
  if (error) throw new Error("Unable to claim analysis job.");
  const analysis = (Array.isArray(data) ? data[0] : data) as Analysis | null;
  if (!analysis) return { processed: false };
  const { data: prospect } = await supabase.from("prospects").select("id,website_url,business_type").eq("id", analysis.prospect_id).maybeSingle();
  if (!prospect) {
    await supabase.from("prospect_analyses").update({ status: "failed", current_stage: "finalisation", last_error: "Prospect was not found.", completed_at: new Date().toISOString() }).eq("id", analysis.id);
    return { processed: true, status: "failed" };
  }
  const target = prospect as Prospect;
  await supabase.from("prospect_evidence").delete().eq("analysis_id", analysis.id);
  await lifecycle(target.id, analysis.id, "website_analysis_started", "Website analysis started");
  let evidenceCount = 0;
  try {
    const result = await runProspectWebsiteScan({
      websiteUrl: target.website_url,
      businessType: target.business_type,
      onPageCollected: async (progress) => {
        const { error: insertError } = await supabase.from("prospect_evidence").insert(rows(target.id, analysis.id, progress.evidence));
        if (insertError) throw new Error("Page evidence could not be stored.");
        evidenceCount += progress.evidence.length;
        await supabase.from("prospect_analyses").update({ pages_discovered: progress.pagesDiscovered, pages_scanned: progress.pagesScanned, evidence_count: evidenceCount, heartbeat_at: new Date().toISOString() }).eq("id", analysis.id);
      }
    });
    const incremental = new Set(result.incrementalEvidence.map((item) => `${item.evidence_key}|${item.page_url ?? ""}|${JSON.stringify(item.value)}`));
    const finalEvidence = result.evidence.filter((item) => !incremental.has(`${item.evidence_key}|${item.page_url ?? ""}|${JSON.stringify(item.value)}`));
    if (finalEvidence.length) {
      const { error: finalError } = await supabase.from("prospect_evidence").insert(rows(target.id, analysis.id, finalEvidence));
      if (finalError) throw new Error("Final evidence could not be stored.");
      evidenceCount += finalEvidence.length;
    }
    const status = result.failures.length ? "partial" : "completed";
    await supabase.from("prospect_analyses").update({ status, current_stage: "finalisation", final_url: result.finalUrl, pages_discovered: result.pagesDiscovered, pages_scanned: result.pagesScanned, evidence_count: evidenceCount, error_message: result.failures.length ? result.failures.slice(0, 4).join(" | ") : null, last_error: null, heartbeat_at: new Date().toISOString(), completed_at: new Date().toISOString() }).eq("id", analysis.id);
    await lifecycle(target.id, analysis.id, status === "completed" ? "website_analysis_completed" : "website_analysis_partial", status === "completed" ? "Website analysis completed" : "Website analysis completed with partial page coverage");
    return { processed: true, status };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "Website analysis failed.";
    const retrying = analysis.attempt_count < MAX_ATTEMPTS;
    await supabase.from("prospect_analyses").update({ status: retrying ? "retrying" : "failed", current_stage: "finalisation", last_error: message, error_message: message, next_attempt_at: retrying ? new Date(Date.now() + 5 * 60_000).toISOString() : null, heartbeat_at: new Date().toISOString(), completed_at: retrying ? null : new Date().toISOString() }).eq("id", analysis.id);
    if (!retrying) await lifecycle(target.id, analysis.id, "website_analysis_failed", "Website analysis failed");
    return { processed: true, status: retrying ? "retrying" : "failed" };
  }
}
