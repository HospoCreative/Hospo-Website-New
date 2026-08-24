"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { runProspectWebsiteScan, SCANNER_VERSION } from "@/lib/prospectWebsiteScanner";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  BUSINESS_TYPES,
  HOSPO_SERVICES,
  LEAD_FITS,
  MARKETS,
  PIPELINE_STATUSES,
  assessmentCategories,
  calculateDigitalPresenceScore,
  calculateOpportunityScore,
  priorityFromScore,
} from "@/lib/prospecting";

const prospectSchema = z.object({
  name: z.string().min(2).max(180),
  business_type: z.enum(BUSINESS_TYPES),
  website_url: z.string().url().max(2000),
  market: z.enum(MARKETS),
  lead_fit: z.enum(LEAD_FITS),
  pipeline_status: z.enum(PIPELINE_STATUSES),
  location: z.string().max(240).optional(),
  city: z.string().max(120).optional(),
  country: z.string().max(120).optional(),
  google_url: z.string().url().optional().or(z.literal("")),
  instagram_url: z.string().url().optional().or(z.literal("")),
  facebook_url: z.string().url().optional().or(z.literal("")),
  tiktok_url: z.string().url().optional().or(z.literal("")),
  booking_url: z.string().url().optional().or(z.literal("")),
  expedia_url: z.string().url().optional().or(z.literal("")),
  tripadvisor_url: z.string().url().optional().or(z.literal("")),
  reservation_url: z.string().url().optional().or(z.literal("")),
  primary_service: z.enum(HOSPO_SERVICES).optional().or(z.literal("")),
  secondary_service: z.enum(HOSPO_SERVICES).optional().or(z.literal("")),
  notes: z.string().max(12000).optional(),
  next_followup_at: z.string().optional(),
  commercial_fit: z.coerce.number().int().min(1).max(5).optional(),
  contactability: z.coerce.number().int().min(1).max(5).optional(),
  commercial_trigger: z.coerce.number().int().min(1).max(5).optional(),
  evidence_quality: z.coerce.number().int().min(1).max(5).optional(),
});

const contactSchema = z.object({
  name: z.string().min(2).max(180),
  job_title: z.string().max(180).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(80).optional(),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  contact_type: z.string().max(120).optional(),
  source: z.string().max(160).optional(),
  verified_at: z.string().optional(),
});

const text = (formData: FormData, name: string) =>
  String(formData.get(name) ?? "").trim();
const optional = (value: string | undefined) => value?.trim() || null;
const rating = (formData: FormData, name: string) => {
  const value = text(formData, name);
  return value ? Number(value) : undefined;
};
const dateValue = (value: string) =>
  value ? new Date(`${value}T09:00:00`).toISOString() : null;

async function context() {
  const session = await requireAdminUser();
  return {
    supabase: await createSupabaseServerClient(),
    userId: session.profile.id,
  };
}
async function activity(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  prospectId: string,
  userId: string,
  activityType: string,
  description: string,
) {
  await supabase
    .from("prospect_activity")
    .insert({
      prospect_id: prospectId,
      created_by: userId,
      activity_type: activityType,
      description,
    });
}
function refresh(id?: string) {
  revalidatePath("/admin/prospects");
  revalidatePath("/admin/prospects/pipeline");
  revalidatePath("/admin/prospects/follow-ups");
  if (id) revalidatePath(`/admin/prospects/${id}`);
}

async function runWebsiteAnalysisJob(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  analysisId: string,
  prospect: { id: string; website_url: string; business_type: string },
  userId: string,
) {
  await supabase.from("prospect_analyses").update({ status: "running", started_at: new Date().toISOString() }).eq("id", analysisId);
  try {
    const result = await runProspectWebsiteScan({ websiteUrl: prospect.website_url, businessType: prospect.business_type });
    if (result.evidence.length) {
      const { error } = await supabase.from("prospect_evidence").insert(result.evidence.map((item) => ({ ...item, prospect_id: prospect.id, analysis_id: analysisId })));
      if (error) throw new Error("Evidence could not be stored.");
    }
    const status = result.failures.length ? "partial" : "completed";
    await supabase.from("prospect_analyses").update({ status, final_url: result.finalUrl, pages_discovered: result.pagesDiscovered, pages_scanned: result.pagesScanned, evidence_count: result.evidence.length, error_message: result.failures.length ? result.failures.slice(0, 4).join(" | ") : null, completed_at: new Date().toISOString() }).eq("id", analysisId);
    await activity(supabase, prospect.id, userId, status === "completed" ? "website_analysis_completed" : "website_analysis_partial", status === "completed" ? "Website analysis completed." : "Website analysis completed with partial page coverage.");
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "Website analysis failed.";
    await supabase.from("prospect_analyses").update({ status: "failed", error_message: message, completed_at: new Date().toISOString() }).eq("id", analysisId);
    await activity(supabase, prospect.id, userId, "website_analysis_failed", "Website analysis failed.");
  } finally {
    refresh(prospect.id);
  }
}

function parseProspect(formData: FormData) {
  return prospectSchema.parse({
    name: text(formData, "name"),
    business_type: text(formData, "business_type"),
    website_url: text(formData, "website_url"),
    market: text(formData, "market"),
    lead_fit: text(formData, "lead_fit") || "B",
    pipeline_status: text(formData, "pipeline_status") || "New",
    location: text(formData, "location"),
    city: text(formData, "city"),
    country: text(formData, "country"),
    google_url: text(formData, "google_url"),
    instagram_url: text(formData, "instagram_url"),
    facebook_url: text(formData, "facebook_url"),
    tiktok_url: text(formData, "tiktok_url"),
    booking_url: text(formData, "booking_url"),
    expedia_url: text(formData, "expedia_url"),
    tripadvisor_url: text(formData, "tripadvisor_url"),
    reservation_url: text(formData, "reservation_url"),
    primary_service: text(formData, "primary_service"),
    secondary_service: text(formData, "secondary_service"),
    notes: text(formData, "notes"),
    next_followup_at: text(formData, "next_followup_at"),
    commercial_fit: rating(formData, "commercial_fit"),
    contactability: rating(formData, "contactability"),
    commercial_trigger: rating(formData, "commercial_trigger"),
    evidence_quality: rating(formData, "evidence_quality"),
  });
}

function databasePayload(
  parsed: z.infer<typeof prospectSchema>,
  ownerId: string,
  digitalPresenceScore: number | null = null,
) {
  const opportunityScore = calculateOpportunityScore({
    digitalPresenceScore,
    commercialFit: parsed.commercial_fit ?? null,
    contactability: parsed.contactability ?? null,
    commercialTrigger: parsed.commercial_trigger ?? null,
    evidenceQuality: parsed.evidence_quality ?? null,
  });
  return {
    ...parsed,
    location: optional(parsed.location),
    city: optional(parsed.city),
    country: optional(parsed.country),
    google_url: optional(parsed.google_url),
    instagram_url: optional(parsed.instagram_url),
    facebook_url: optional(parsed.facebook_url),
    tiktok_url: optional(parsed.tiktok_url),
    booking_url: optional(parsed.booking_url),
    expedia_url: optional(parsed.expedia_url),
    tripadvisor_url: optional(parsed.tripadvisor_url),
    reservation_url: optional(parsed.reservation_url),
    primary_service: optional(parsed.primary_service),
    secondary_service: optional(parsed.secondary_service),
    notes: optional(parsed.notes),
    next_followup_at: dateValue(parsed.next_followup_at ?? ""),
    owner_user_id: ownerId,
    opportunity_score: opportunityScore,
    priority: priorityFromScore(opportunityScore, parsed.lead_fit),
  };
}

export async function createProspectAction(formData: FormData) {
  const { supabase, userId } = await context();
  const parsed = parseProspect(formData);
  const { data, error } = await supabase
    .from("prospects")
    .insert(databasePayload(parsed, userId))
    .select("id")
    .single();
  if (error)
    redirect(`/admin/prospects/new?error=${encodeURIComponent(error.message)}`);
  await activity(
    supabase,
    data.id,
    userId,
    "prospect_created",
    "Prospect created.",
  );
  refresh(data.id);
  redirect(`/admin/prospects/${data.id}?message=created`);
}

export async function startWebsiteAnalysisAction(formData: FormData) {
  const { supabase, userId } = await context();
  const id = z.string().uuid().parse(text(formData, "prospect_id"));
  const { data: prospect } = await supabase.from("prospects").select("id,website_url,business_type").eq("id", id).maybeSingle();
  if (!prospect) redirect(`/admin/prospects/${id}?tab=analysis&error=Prospect%20was%20not%20found`);
  const { data: active } = await supabase.from("prospect_analyses").select("id").eq("prospect_id", id).eq("analysis_type", "website").in("status", ["queued", "running"]).maybeSingle();
  if (active) redirect(`/admin/prospects/${id}?tab=analysis&error=An%20analysis%20is%20already%20in%20progress`);
  const { data: analysis, error } = await supabase.from("prospect_analyses").insert({ prospect_id: id, website_url: prospect.website_url, created_by: userId, scanner_version: SCANNER_VERSION }).select("id").single();
  if (error || !analysis) redirect(`/admin/prospects/${id}?tab=analysis&error=${encodeURIComponent(error?.message ?? "Unable to start analysis")}`);
  await activity(supabase, id, userId, "website_analysis_started", "Website analysis started.");
  after(() => runWebsiteAnalysisJob(supabase, analysis.id, prospect, userId));
  refresh(id);
  redirect(`/admin/prospects/${id}?tab=analysis&message=analysis-started`);
}

export async function updateProspectAction(formData: FormData) {
  const { supabase, userId } = await context();
  const id = z.string().uuid().parse(text(formData, "id"));
  const parsed = parseProspect(formData);
  const { data: previous } = await supabase
    .from("prospects")
    .select("lead_fit,pipeline_status,owner_user_id,digital_presence_score")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase
    .from("prospects")
    .update(
      databasePayload(
        parsed,
        previous?.owner_user_id ?? userId,
        previous?.digital_presence_score ?? null,
      ),
    )
    .eq("id", id);
  if (error)
    redirect(
      `/admin/prospects/${id}?error=${encodeURIComponent(error.message)}`,
    );
  await activity(
    supabase,
    id,
    userId,
    "prospect_updated",
    "Prospect details updated.",
  );
  if (previous?.lead_fit !== parsed.lead_fit)
    await activity(
      supabase,
      id,
      userId,
      "lead_fit_changed",
      `Lead Fit changed from ${previous?.lead_fit ?? "unset"} to ${parsed.lead_fit}.`,
    );
  if (previous?.pipeline_status !== parsed.pipeline_status)
    await activity(
      supabase,
      id,
      userId,
      "status_changed",
      `Pipeline status changed from ${previous?.pipeline_status ?? "unset"} to ${parsed.pipeline_status}.`,
    );
  refresh(id);
  redirect(`/admin/prospects/${id}?message=saved`);
}

export async function saveAssessmentAction(formData: FormData) {
  const { supabase, userId } = await context();
  const id = z.string().uuid().parse(text(formData, "id"));
  const businessType = text(formData, "business_type");
  const scores: Record<string, number | null | undefined> = {};
  const rows = assessmentCategories(businessType).flatMap((category) => {
    const value = text(formData, `score_${category.key}`);
    const isNotApplicable = value === "not_applicable";
    const score = isNotApplicable ? null : rating(formData, `score_${category.key}`);
    scores[category.key] = score;
    return value
      ? [{ prospect_id: id, category: category.key, score, is_not_applicable: isNotApplicable, notes: optional(text(formData, `note_${category.key}`)) }]
      : [];
  });
  const categoryKeys = assessmentCategories(businessType).map((category) => category.key);
  const notAssessed = categoryKeys.filter((category) => !text(formData, `score_${category}`));
  if (notAssessed.length) {
    const { error: clearError } = await supabase
      .from("prospect_scores")
      .delete()
      .eq("prospect_id", id)
      .in("category", notAssessed);
    if (clearError)
      redirect(`/admin/prospects/${id}?error=${encodeURIComponent(clearError.message)}`);
  }
  if (rows.length) {
    const { error } = await supabase.from("prospect_scores").upsert(rows, { onConflict: "prospect_id,category" });
    if (error)
      redirect(
        `/admin/prospects/${id}?error=${encodeURIComponent(error.message)}`,
      );
  }
  const { data: prospect } = await supabase
    .from("prospects")
    .select(
      "lead_fit,commercial_fit,contactability,commercial_trigger,evidence_quality",
    )
    .eq("id", id)
    .single();
  if (!prospect)
    redirect(`/admin/prospects/${id}?error=Prospect%20was%20not%20found`);
  const digitalPresenceScore = calculateDigitalPresenceScore(
    businessType,
    scores,
  );
  const opportunityScore = calculateOpportunityScore({
    digitalPresenceScore,
    commercialFit: prospect.commercial_fit,
    contactability: prospect.contactability,
    commercialTrigger: prospect.commercial_trigger,
    evidenceQuality: prospect.evidence_quality,
  });
  const { error } = await supabase
    .from("prospects")
    .update({
      digital_presence_score: digitalPresenceScore,
      opportunity_score: opportunityScore,
      priority: priorityFromScore(opportunityScore, prospect.lead_fit),
    })
    .eq("id", id);
  if (error)
    redirect(
      `/admin/prospects/${id}?error=${encodeURIComponent(error.message)}`,
    );
  await activity(
    supabase,
    id,
    userId,
    "assessment_updated",
    digitalPresenceScore === null
      ? "Assessment saved. Digital Presence Score is incomplete."
      : `Assessment updated. Digital Presence Score: ${digitalPresenceScore}/100.`,
  );
  refresh(id);
  redirect(`/admin/prospects/${id}?tab=assessment&message=assessment-saved`);
}

export async function updatePipelineStatusAction(formData: FormData) {
  const { supabase, userId } = await context();
  const id = z.string().uuid().parse(text(formData, "id"));
  const status = z
    .enum(PIPELINE_STATUSES)
    .parse(text(formData, "pipeline_status"));
  const { data: previous } = await supabase
    .from("prospects")
    .select("pipeline_status")
    .eq("id", id)
    .single();
  const { error } = await supabase
    .from("prospects")
    .update({
      pipeline_status: status,
      last_contact_at: [
        "Contacted",
        "Follow-up 1",
        "Follow-up 2",
        "Replied",
      ].includes(status)
        ? new Date().toISOString()
        : undefined,
    })
    .eq("id", id);
  if (error)
    redirect(
      `/admin/prospects/${id}?error=${encodeURIComponent(error.message)}`,
    );
  await activity(
    supabase,
    id,
    userId,
    "status_changed",
    `Pipeline status changed from ${previous?.pipeline_status ?? "unset"} to ${status}.`,
  );
  refresh(id);
  redirect(`/admin/prospects/${id}?message=status-saved`);
}

export async function createContactAction(formData: FormData) {
  const { supabase, userId } = await context();
  const prospectId = z.string().uuid().parse(text(formData, "prospect_id"));
  const parsed = contactSchema.parse({
    name: text(formData, "name"),
    job_title: text(formData, "job_title"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    linkedin_url: text(formData, "linkedin_url"),
    contact_type: text(formData, "contact_type"),
    source: text(formData, "source"),
    verified_at: text(formData, "verified_at"),
  });
  const isPrimary = formData.get("is_primary") === "on";
  if (isPrimary)
    await supabase
      .from("prospect_contacts")
      .update({ is_primary: false })
      .eq("prospect_id", prospectId);
  const { error } = await supabase
    .from("prospect_contacts")
    .insert({
      ...parsed,
      prospect_id: prospectId,
      job_title: optional(parsed.job_title),
      email: optional(parsed.email),
      phone: optional(parsed.phone),
      linkedin_url: optional(parsed.linkedin_url),
      contact_type: optional(parsed.contact_type),
      source: optional(parsed.source),
      verified_at: dateValue(parsed.verified_at ?? ""),
      is_primary: isPrimary,
    });
  if (error)
    redirect(
      `/admin/prospects/${prospectId}?tab=contacts&error=${encodeURIComponent(error.message)}`,
    );
  await activity(
    supabase,
    prospectId,
    userId,
    "contact_added",
    `Contact ${parsed.name} added.`,
  );
  refresh(prospectId);
  redirect(`/admin/prospects/${prospectId}?tab=contacts&message=contact-saved`);
}

export async function updateContactAction(formData: FormData) {
  const { supabase, userId } = await context();
  const prospectId = z.string().uuid().parse(text(formData, "prospect_id"));
  const contactId = z.string().uuid().parse(text(formData, "contact_id"));
  const parsed = contactSchema.parse({
    name: text(formData, "name"),
    job_title: text(formData, "job_title"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    linkedin_url: text(formData, "linkedin_url"),
    contact_type: text(formData, "contact_type"),
    source: text(formData, "source"),
    verified_at: text(formData, "verified_at"),
  });
  const { error } = await supabase
    .from("prospect_contacts")
    .update({
      ...parsed,
      job_title: optional(parsed.job_title),
      email: optional(parsed.email),
      phone: optional(parsed.phone),
      linkedin_url: optional(parsed.linkedin_url),
      contact_type: optional(parsed.contact_type),
      source: optional(parsed.source),
      verified_at: dateValue(parsed.verified_at ?? ""),
    })
    .eq("id", contactId);
  if (error)
    redirect(
      `/admin/prospects/${prospectId}?tab=contacts&error=${encodeURIComponent(error.message)}`,
    );
  await activity(
    supabase,
    prospectId,
    userId,
    "contact_updated",
    `Contact ${parsed.name} updated.`,
  );
  refresh(prospectId);
  redirect(`/admin/prospects/${prospectId}?tab=contacts&message=contact-saved`);
}

export async function setPrimaryContactAction(formData: FormData) {
  const { supabase, userId } = await context();
  const prospectId = z.string().uuid().parse(text(formData, "prospect_id"));
  const contactId = z.string().uuid().parse(text(formData, "contact_id"));
  await supabase
    .from("prospect_contacts")
    .update({ is_primary: false })
    .eq("prospect_id", prospectId);
  const { error } = await supabase
    .from("prospect_contacts")
    .update({ is_primary: true })
    .eq("id", contactId);
  if (error)
    redirect(
      `/admin/prospects/${prospectId}?tab=contacts&error=${encodeURIComponent(error.message)}`,
    );
  await activity(
    supabase,
    prospectId,
    userId,
    "contact_updated",
    "Primary contact updated.",
  );
  refresh(prospectId);
  redirect(`/admin/prospects/${prospectId}?tab=contacts&message=contact-saved`);
}

export async function deleteContactAction(formData: FormData) {
  const { supabase, userId } = await context();
  const prospectId = z.string().uuid().parse(text(formData, "prospect_id"));
  const contactId = z.string().uuid().parse(text(formData, "contact_id"));
  const { error } = await supabase
    .from("prospect_contacts")
    .delete()
    .eq("id", contactId);
  if (error)
    redirect(
      `/admin/prospects/${prospectId}?tab=contacts&error=${encodeURIComponent(error.message)}`,
    );
  await activity(
    supabase,
    prospectId,
    userId,
    "contact_deleted",
    "Contact removed.",
  );
  refresh(prospectId);
  redirect(
    `/admin/prospects/${prospectId}?tab=contacts&message=contact-deleted`,
  );
}
