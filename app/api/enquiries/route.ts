import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  isSupabaseConfigured,
  supabasePublishableKey,
  supabaseUrl
} from "@/lib/supabase/env";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  businessName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  website: z.string().trim().max(500).optional().default(""),
  businessType: z.string().trim().max(100).optional().default(""),
  location: z.string().trim().max(160).optional().default(""),
  services: z.array(z.string().trim().min(1).max(100)).min(1).max(20),
  challenge: z.string().trim().min(10).max(5000),
  timeframe: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
  privacy: z.literal(true),
  companyWebsite: z.string().max(0).optional().default("")
});

function nullable(value: string) {
  return value || null;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !supabaseUrl || !supabasePublishableKey) {
    return NextResponse.json(
      { error: "Enquiries are temporarily unavailable." },
      { status: 503 }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 }
    );
  }

  const enquiry = parsed.data;
  const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { error } = await supabase.from("contact_enquiries").insert({
    name: enquiry.name,
    business_name: enquiry.businessName,
    email: enquiry.email.toLowerCase(),
    website: nullable(enquiry.website),
    business_type: nullable(enquiry.businessType),
    location: nullable(enquiry.location),
    services: enquiry.services,
    challenge: enquiry.challenge,
    timeframe: nullable(enquiry.timeframe),
    message: nullable(enquiry.message),
    privacy_accepted: true,
    status: "new"
  });

  if (error) {
    console.error("Unable to save contact enquiry", error.message);
    return NextResponse.json(
      { error: "We could not send your enquiry. Please try again or email us directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
