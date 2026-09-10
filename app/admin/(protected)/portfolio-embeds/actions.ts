"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { PORTFOLIO_EMBED_SECTIONS, type PortfolioEmbedSection } from "@/types/portfolioEmbed";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const idSchema = z.string().uuid();
const sectionSchema = z.enum(PORTFOLIO_EMBED_SECTIONS);
const orderSchema = z.coerce.number().int().min(0).max(10000);

const field = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

function normaliseInstagramUrl(value: string) {
  const url = new URL(z.string().url().parse(value));
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  if (hostname !== "instagram.com") throw new Error("Use a public Instagram post or reel link.");

  const [kind, id] = url.pathname.split("/").filter(Boolean);
  if (!kind || !id || !["p", "reel", "tv"].includes(kind)) {
    throw new Error("Use a public Instagram post or reel link.");
  }

  return `https://www.instagram.com/${kind}/${id}/`;
}

function payload(formData: FormData) {
  return {
    section: sectionSchema.parse(field(formData, "section")) as PortfolioEmbedSection,
    instagram_url: normaliseInstagramUrl(field(formData, "instagram_url")),
    sort_order: orderSchema.parse(field(formData, "sort_order") || "0"),
    published: formData.get("published") === "on"
  };
}

function refresh() {
  revalidatePath("/admin/portfolio-embeds");
  revalidatePath("/");
  revalidatePath("/pt");
  revalidatePath("/services/photography-video");
  revalidatePath("/pt/services/photography-video");
  revalidatePath("/services/social-media");
  revalidatePath("/pt/services/social-media");
}

async function context() {
  await requireAdminUser();
  return createSupabaseServerClient();
}

export async function createPortfolioEmbedAction(formData: FormData) {
  const input = payload(formData);
  const supabase = await context();
  const { error } = await supabase.from("portfolio_embeds").insert(input);
  if (error) redirect(`/admin/portfolio-embeds?error=${encodeURIComponent(error.message)}`);
  refresh();
  redirect("/admin/portfolio-embeds?message=embed-added");
}

export async function updatePortfolioEmbedAction(formData: FormData) {
  const id = idSchema.parse(field(formData, "id"));
  const input = payload(formData);
  const supabase = await context();
  const { error } = await supabase.from("portfolio_embeds").update(input).eq("id", id);
  if (error) redirect(`/admin/portfolio-embeds?error=${encodeURIComponent(error.message)}`);
  refresh();
  redirect("/admin/portfolio-embeds?message=embed-saved");
}

export async function deletePortfolioEmbedAction(formData: FormData) {
  const id = idSchema.parse(field(formData, "id"));
  const supabase = await context();
  const { error } = await supabase.from("portfolio_embeds").delete().eq("id", id);
  if (error) redirect(`/admin/portfolio-embeds?error=${encodeURIComponent(error.message)}`);
  refresh();
  redirect("/admin/portfolio-embeds?message=embed-deleted");
}
