import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createInvestmentAccessToken, investmentAccess } from "@/lib/investmentAccess";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  businessName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  website: z.string().trim().max(500).optional().default(""),
  businessType: z.enum(["Hotel", "Boutique Hotel", "Alojamento", "Resort", "Restaurante", "Bar", "Café", "Grupo de Hotelaria / Restauração", "Outro"]),
  privacy: z.literal(true),
  companyWebsite: z.string().max(0).optional().default("")
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !supabaseUrl || !supabasePublishableKey) return NextResponse.json({ error: "O formulário está temporariamente indisponível." }, { status: 503 });
  const token = createInvestmentAccessToken();
  if (!token) return NextResponse.json({ error: "O acesso seguro está temporariamente indisponível." }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Pedido inválido." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Confirme os dados obrigatórios e o consentimento." }, { status: 400 });
  const lead = parsed.data;
  const supabase = createClient(supabaseUrl, supabasePublishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await supabase.from("contact_enquiries").insert({
    name: lead.name,
    business_name: lead.businessName,
    email: lead.email.toLowerCase(),
    website: lead.website || null,
    business_type: lead.businessType,
    services: ["Serviços & Investimento Portugal", "pricing_portugal"],
    challenge: "Acesso solicitado à área privada Serviços & Investimento Portugal.",
    message: "Origem: pricing_portugal.",
    privacy_accepted: true,
    status: "new"
  });
  if (error) {
    console.error("Unable to save Portugal pricing lead", error.message);
    return NextResponse.json({ error: "Não foi possível guardar o pedido. Tente novamente." }, { status: 500 });
  }
  const response = NextResponse.json({ ok: true }, { status: 201 });
  response.cookies.set(investmentAccess.cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: investmentAccess.maxAgeSeconds, path: "/pt/investimento" });
  return response;
}
