import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { runDigitalScan } from "@/lib/digitalScan";
import { emailDigitalScan } from "@/lib/scanEmail";
import {
  supabaseUrl
} from "@/lib/supabase/env";

export const runtime = "nodejs";
export const maxDuration = 60;

const scanSchema = z.object({
  websiteUrl: z.string().trim().min(4).max(500),
  businessName: z.string().trim().max(160).optional().default(""),
  location: z.string().trim().max(160).optional().default(""),
  email: z.string().trim().email().max(254),
  locale: z.enum(["en", "pt"]).default("en"),
  privacy: z.literal(true),
  companyWebsite: z.string().max(0).optional().default("")
});

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 3;

function rateLimited(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const existing = attempts.get(key);
  if (!existing || existing.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (existing.count >= MAX_ATTEMPTS) return true;
  existing.count += 1;
  return false;
}

export async function POST(request: Request) {
  if (rateLimited(request)) {
    return NextResponse.json(
      { error: "Too many scan requests. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = scanSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the website and contact details." },
      { status: 400 }
    );
  }

  const input = parsed.data;
  let report;
  try {
    report = await runDigitalScan({
      websiteUrl: input.websiteUrl,
      businessName: input.businessName || new URL(
        /^https?:\/\//i.test(input.websiteUrl) ? input.websiteUrl : `https://${input.websiteUrl}`
      ).hostname.replace(/^www\./, ""),
      location: input.location,
      locale: input.locale
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The website could not be scanned.";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  let stored = false;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceRoleKey) {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data, error } = await supabase
      .from("digital_scans")
      .insert({
        website_url: report.websiteUrl,
        final_url: report.finalUrl,
        business_name: input.businessName || null,
        location: input.location || null,
        email: input.email.toLowerCase(),
        locale: input.locale,
        overall_score: report.overallScore,
        report,
        status: "new",
        consent_at: new Date().toISOString()
      })
      .select("id")
      .single();

    if (!error && data?.id) {
      report.id = data.id;
      stored = true;
    } else if (error) {
      console.error("Unable to save digital scan", error.message);
    }
  }

  let emailSent = false;
  try {
    emailSent = await emailDigitalScan({
      email: input.email.toLowerCase(),
      locale: input.locale,
      report
    });
  } catch (error) {
    console.error("Unable to email digital scan", error instanceof Error ? error.message : "Unknown email error");
  }

  return NextResponse.json({ report, stored, emailSent }, { status: 201 });
}
