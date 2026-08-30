"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { asPriceType, COMMERCIAL_CATEGORIES, COMMERCIAL_MARKETS } from "@/lib/commercial";
import { commercialItemSnapshot } from "@/lib/commercial";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const idSchema = z.string().uuid();
const marketSchema = z.enum(COMMERCIAL_MARKETS);
const categorySchema = z.enum(COMMERCIAL_CATEGORIES);

const value = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
const nullable = (item: string) => item || null;
const list = (formData: FormData, key: string) => value(formData, key).split(/\n|,/).map((item) => item.trim()).filter(Boolean);
const amount = (formData: FormData) => {
  const raw = value(formData, "price_amount");
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};
const slug = (name: string) => name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function payload(formData: FormData) {
  const name = z.string().min(2).max(120).parse(value(formData, "name"));
  const priceType = asPriceType(value(formData, "price_type"));
  return {
    slug: z.string().min(2).max(140).parse(value(formData, "slug") || slug(name)),
    name,
    name_pt: nullable(value(formData, "name_pt")),
    market: marketSchema.parse(value(formData, "market") || "general"),
    category: categorySchema.parse(value(formData, "category") || "marketing"),
    description: nullable(value(formData, "description")),
    description_pt: nullable(value(formData, "description_pt")),
    price_amount: amount(formData),
    price_currency: value(formData, "price_currency") === "GBP" ? "GBP" : "EUR",
    price_type: priceType,
    price_note: nullable(value(formData, "price_note")),
    price_note_pt: nullable(value(formData, "price_note_pt")),
    included_items: list(formData, "included_items"),
    included_items_pt: list(formData, "included_items_pt"),
    excluded_items: list(formData, "excluded_items"),
    excluded_items_pt: list(formData, "excluded_items_pt"),
    commercial_terms: nullable(value(formData, "commercial_terms")),
    commercial_terms_pt: nullable(value(formData, "commercial_terms_pt")),
    badge: nullable(value(formData, "badge")),
    badge_pt: nullable(value(formData, "badge_pt")),
    featured: formData.get("featured") === "on",
    is_active: formData.get("is_active") === "on",
    sort_order: Number(value(formData, "sort_order") || 0),
  };
}

function addonPayload(formData: FormData) {
  const item = payload(formData);
  return {
    slug: item.slug,
    name: item.name,
    name_pt: item.name_pt,
    market: item.market,
    category: item.category,
    description: item.description,
    description_pt: item.description_pt,
    price_amount: item.price_amount,
    price_currency: item.price_currency,
    price_type: item.price_type,
    price_note: item.price_note,
    price_note_pt: item.price_note_pt,
    included_items: item.included_items,
    included_items_pt: item.included_items_pt,
    is_active: item.is_active,
    sort_order: item.sort_order,
  };
}

async function context() {
  const { profile } = await requireAdminUser();
  return { supabase: await createSupabaseServerClient(), userId: profile.id };
}
function refresh() {
  revalidatePath("/admin/commercial");
  revalidatePath("/packages");
  revalidatePath("/pt/packages");
  revalidatePath("/restaurants/packages");
  revalidatePath("/hotels/packages");
}

function proposalSlug(name: string) {
  return `${slug(name) || "proposal"}-${crypto.randomUUID().slice(0, 8)}`;
}

async function logProposalEvent(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, proposal: { id: string; prospect_id: string | null }, userId: string, eventType: "created" | "package_selected" | "ready" | "sent" | "accepted" | "declined" | "archived", description: string) {
  await supabase.from("proposal_events").insert({ proposal_id: proposal.id, event_type: eventType, actor_user_id: userId });
  if (proposal.prospect_id) await supabase.from("prospect_activity").insert({ prospect_id: proposal.prospect_id, activity_type: `proposal_${eventType}`, description, created_by: userId, metadata: { proposal_id: proposal.id } });
}

export async function createProposalFromProspectAction(formData: FormData) {
  const { supabase, userId } = await context();
  const prospectId = idSchema.parse(value(formData, "prospect_id"));
  const [{ data: prospect }, { data: contact }] = await Promise.all([
    supabase.from("prospects").select("id,name,business_type,website_url,market,location,city").eq("id", prospectId).single(),
    supabase.from("prospect_contacts").select("name,email").eq("prospect_id", prospectId).eq("is_primary", true).maybeSingle(),
  ]);
  if (!prospect) redirect(`/admin/prospects/${prospectId}?error=Prospect%20not%20found`);
  const template = ["Hotel", "Boutique Hotel", "Guesthouse", "Aparthotel", "Accommodation"].includes(prospect.business_type) ? "hotel" : ["Restaurant", "Cafe", "Bar", "F&B Group"].includes(prospect.business_type) ? "restaurant" : "custom";
  const { data: proposal, error } = await supabase.from("proposals").insert({ slug: proposalSlug(prospect.name), prospect_id: prospect.id, template_type: template, client_name: prospect.name, business_name: prospect.name, business_type: prospect.business_type, website_url: prospect.website_url, market: prospect.market, location: prospect.location || prospect.city, contact_name: contact?.name || null, contact_email: contact?.email || null, prepared_for: prospect.name, created_by: userId }).select("id,prospect_id").single();
  if (error || !proposal) redirect(`/admin/prospects/${prospectId}?error=${encodeURIComponent(error?.message ?? "Unable to create proposal")}`);
  await logProposalEvent(supabase, proposal, userId, "created", "Proposal draft created.");
  refresh(); revalidatePath(`/admin/prospects/${prospectId}`);
  redirect(`/admin/proposals/${proposal.id}?message=draft-created`);
}

export async function selectProposalPackageAction(formData: FormData) {
  const { supabase, userId } = await context();
  const proposalId = idSchema.parse(value(formData, "proposal_id"));
  const packageId = idSchema.parse(value(formData, "package_id"));
  const { data: item } = await supabase.from("packages").select("*").eq("id", packageId).single();
  if (!item) redirect(`/admin/proposals/${proposalId}?error=Package%20not%20found`);
  const { data: proposal, error } = await supabase.from("proposals").update({ package_id: item.id, package_snapshot: commercialItemSnapshot(item) }).eq("id", proposalId).select("id,prospect_id").single();
  if (error || !proposal) redirect(`/admin/proposals/${proposalId}?error=${encodeURIComponent(error?.message ?? "Unable to select package")}`);
  await logProposalEvent(supabase, proposal, userId, "package_selected", "Proposal package selected and commercial snapshot created.");
  refresh(); revalidatePath(`/admin/proposals/${proposalId}`);
  redirect(`/admin/proposals/${proposalId}?section=package&message=package-selected`);
}

export async function markProposalSentAction(formData: FormData) {
  const { supabase, userId } = await context(); const id = idSchema.parse(value(formData, "proposal_id"));
  const { data: proposal, error } = await supabase.from("proposals").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", id).neq("status", "archived").select("id,prospect_id").single();
  if (error || !proposal) redirect(`/admin/proposals/${id}?error=${encodeURIComponent(error?.message ?? "Unable to mark as sent")}`);
  await logProposalEvent(supabase, proposal, userId, "sent", "Proposal marked as sent.");
  refresh(); revalidatePath(`/admin/proposals/${id}`); revalidatePath(`/p/${value(formData, "slug")}`);
  redirect(`/admin/proposals/${id}?message=marked-sent`);
}

export async function createPackageAction(formData: FormData) {
  const { supabase, userId } = await context();
  const { error } = await supabase.from("packages").insert({ ...payload(formData), created_by: userId });
  if (error) redirect(`/admin/commercial?error=${encodeURIComponent(error.message)}`);
  refresh();
  redirect("/admin/commercial?message=package-created");
}

export async function updatePackageAction(formData: FormData) {
  const { supabase } = await context();
  const id = idSchema.parse(value(formData, "id"));
  const { error } = await supabase.from("packages").update(payload(formData)).eq("id", id);
  if (error) redirect(`/admin/commercial?error=${encodeURIComponent(error.message)}`);
  refresh();
  redirect("/admin/commercial?message=package-saved");
}

export async function duplicatePackageAction(formData: FormData) {
  const { supabase, userId } = await context();
  const id = idSchema.parse(value(formData, "id"));
  const { data, error } = await supabase.from("packages").select("*").eq("id", id).single();
  if (error || !data) redirect("/admin/commercial?error=Package%20not%20found");
  const copy = { ...data };
  delete copy.id;
  delete copy.created_at;
  delete copy.updated_at;
  const { error: insertError } = await supabase.from("packages").insert({ ...copy, slug: `${copy.slug}-copy-${Date.now()}`, name: `${copy.name} copy`, is_active: false, created_by: userId });
  if (insertError) redirect(`/admin/commercial?error=${encodeURIComponent(insertError.message)}`);
  refresh();
  redirect("/admin/commercial?message=package-duplicated");
}

export async function createAddonAction(formData: FormData) {
  const { supabase, userId } = await context();
  const { error } = await supabase.from("addons").insert({ ...addonPayload(formData), created_by: userId });
  if (error) redirect(`/admin/commercial?error=${encodeURIComponent(error.message)}`);
  refresh();
  redirect("/admin/commercial?message=addon-created");
}

export async function updateAddonAction(formData: FormData) {
  const { supabase } = await context();
  const id = idSchema.parse(value(formData, "id"));
  const { error } = await supabase.from("addons").update(addonPayload(formData)).eq("id", id);
  if (error) redirect(`/admin/commercial?error=${encodeURIComponent(error.message)}`);
  refresh();
  redirect("/admin/commercial?message=addon-saved");
}

export async function savePackageMarketValueAction(formData: FormData) {
  const { supabase } = await context();
  const packageId = idSchema.parse(value(formData, "package_id"));
  const marketCode = z.enum(["pt", "uk"]).parse(value(formData, "market_code"));
  const rawPrice = value(formData, "price_amount");
  const price = rawPrice ? Number(rawPrice) : null;
  const { error } = await supabase.from("package_market_values").upsert({
    package_id: packageId,
    market_code: marketCode,
    currency: marketCode === "pt" ? "EUR" : "GBP",
    price_amount: Number.isFinite(price) ? price : null,
    price_type: asPriceType(value(formData, "price_type")),
    description: nullable(value(formData, "description")),
    deliverables: list(formData, "deliverables"),
    excluded_items: list(formData, "excluded_items"),
    production_duration: nullable(value(formData, "production_duration")),
    minimum_commitment: nullable(value(formData, "minimum_commitment")),
    cta_label: nullable(value(formData, "cta_label")),
    cta_destination: nullable(value(formData, "cta_destination")),
    is_active: formData.get("is_active") === "on",
  }, { onConflict: "package_id,market_code" });
  if (error) redirect(`/admin/commercial?error=${encodeURIComponent(error.message)}`);
  refresh();
  redirect("/admin/commercial?message=market-value-saved");
}

export async function saveAddonMarketValueAction(formData: FormData) {
  const { supabase } = await context();
  const addonId = idSchema.parse(value(formData, "addon_id"));
  const marketCode = z.enum(["pt", "uk"]).parse(value(formData, "market_code"));
  const rawPrice = value(formData, "price_amount");
  const price = rawPrice ? Number(rawPrice) : null;
  const { error } = await supabase.from("addon_market_values").upsert({
    addon_id: addonId,
    market_code: marketCode,
    currency: marketCode === "pt" ? "EUR" : "GBP",
    price_amount: Number.isFinite(price) ? price : null,
    price_type: asPriceType(value(formData, "price_type")),
    description: nullable(value(formData, "description")),
    is_active: formData.get("is_active") === "on",
  }, { onConflict: "addon_id,market_code" });
  if (error) redirect(`/admin/commercial?error=${encodeURIComponent(error.message)}`);
  refresh();
  redirect("/admin/commercial?message=addon-market-value-saved");
}
