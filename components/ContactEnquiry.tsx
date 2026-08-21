"use client";

import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { type FormEvent, type ReactNode, useState } from "react";
import { localizedPath, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    eyebrow: "Contact Hospo", title: "Let’s talk about what you’re working on.",
    body: "Tell us what you would like to improve, launch or promote. We’ll come back to you with the most relevant way Hospo can support your business.",
    name: "Name", business: "Business name", email: "Email", website: "Website", type: "Business type", help: "What can we help with?", priority: "Project or priority description",
    typeOptions: ["Hotel / accommodation", "Restaurant / F&B", "Hospitality group", "Other"], helpOptions: ["Website / Direct Booking", "OTA Optimisation", "Strategy / Campaign", "Photography / Video", "Social Media", "SEO / Google Visibility", "Ongoing Marketing Support", "Multiple areas", "Not sure"],
    consent: "I am happy for Hospo Creative to use these details to reply to this request.", send: "Send enquiry", sending: "Sending enquiry", success: "Thank you. Your enquiry has been sent and we will reply by email.",
    reviewTitle: "Not sure what needs improving first?", reviewBody: "Start with a Digital Presence Review for a practical view of the touchpoints shaping discovery, trust and action.", reviewCta: "Get a Digital Presence Review",
    choose: "Choose one", error: "Please complete the required fields and confirm that we may reply to your request."
  },
  pt: {
    eyebrow: "Contacto Hospo", title: "Fale-nos sobre o que está a planear.",
    body: "Conte-nos o que pretende melhorar, lançar ou promover. Entraremos em contacto consigo para perceber qual a forma mais adequada de a Hospo apoiar o seu negócio.",
    name: "Nome", business: "Nome do negócio", email: "Email", website: "Website", type: "Tipo de negócio", help: "Como podemos ajudar?", priority: "Descrição do projeto ou prioridade",
    typeOptions: ["Hotel / alojamento", "Restaurante / F&B", "Grupo de hotelaria", "Outro"], helpOptions: ["Website / reservas diretas", "Otimização de OTAs", "Estratégia / campanha", "Fotografia / vídeo", "Redes sociais", "SEO / visibilidade no Google", "Apoio contínuo de marketing", "Várias áreas", "Não tenho a certeza"],
    consent: "Autorizo a Hospo Creative a utilizar estes dados para responder a este pedido.", send: "Enviar pedido", sending: "A enviar pedido", success: "Obrigado. O seu pedido foi enviado e responderemos por email.",
    reviewTitle: "Não sabe o que melhorar primeiro?", reviewBody: "Comece com uma Análise da Presença Digital para obter uma visão prática dos pontos de contacto que influenciam a descoberta, a confiança e a ação.", reviewCta: "Pedir uma Análise da Presença Digital",
    choose: "Escolha uma opção", error: "Preencha os campos obrigatórios e confirme que podemos responder ao seu pedido."
  }
} as const;

const initial = { name: "", businessName: "", email: "", website: "", businessType: "", service: "", message: "", privacy: false };

export function ContactEnquiry({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [form, setForm] = useState(initial);
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const update = (field: keyof typeof initial, value: string | boolean) => setForm((current) => ({ ...current, [field]: value }));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.businessName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.businessType || !form.service || form.message.trim().length < 10 || !form.privacy) { setStatus("error"); return; }
    setStatus("loading");
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, businessName: form.businessName, email: form.email, website: form.website, businessType: form.businessType, location: "", services: [form.service], timeframe: "", message: form.message, challenge: form.message, privacy: form.privacy, companyWebsite }) });
      if (!response.ok) throw new Error();
      setForm(initial); setCompanyWebsite(""); setStatus("success");
    } catch { setStatus("error"); }
  }
  const inputClass = "mt-2 min-h-12 w-full rounded-[8px] border border-ink/18 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/40";
  return <section className="bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="section-eyebrow text-yellow">{t.eyebrow}</p><h1 className="mt-5 max-w-xl font-serif text-[clamp(2.8rem,5vw,4.7rem)] font-semibold leading-[0.96]">{t.title}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-ink/72">{t.body}</p><div className="mt-10 border-l-2 border-yellow pl-5"><h2 className="font-serif text-3xl font-semibold leading-none">{t.reviewTitle}</h2><p className="mt-3 max-w-lg text-sm leading-7 text-ink/70">{t.reviewBody}</p><Link href={localizedPath("/digital-scan", locale)} className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] hover:text-yellow">{t.reviewCta}<ArrowUpRight size={16} aria-hidden="true" /></Link></div></div><form onSubmit={submit} noValidate className="rounded-[8px] border border-ink/15 bg-white p-5 shadow-editorial sm:p-8"><label className="sr-only" aria-hidden="true">Company website<input tabIndex={-1} autoComplete="off" value={companyWebsite} onChange={(event) => setCompanyWebsite(event.target.value)} /></label><div className="grid gap-5 sm:grid-cols-2"><Field label={t.name}><input required autoComplete="name" className={inputClass} value={form.name} onChange={(event) => update("name", event.target.value)} /></Field><Field label={t.business}><input required autoComplete="organization" className={inputClass} value={form.businessName} onChange={(event) => update("businessName", event.target.value)} /></Field><Field label={t.email}><input required type="email" autoComplete="email" className={inputClass} value={form.email} onChange={(event) => update("email", event.target.value)} /></Field><Field label={t.website}><input type="url" inputMode="url" placeholder="https://" className={inputClass} value={form.website} onChange={(event) => update("website", event.target.value)} /></Field><Field label={t.type}><select required className={inputClass} value={form.businessType} onChange={(event) => update("businessType", event.target.value)}><option value="" disabled>{t.choose}</option>{t.typeOptions.map((option) => <option key={option}>{option}</option>)}</select></Field><Field label={t.help}><select required className={inputClass} value={form.service} onChange={(event) => update("service", event.target.value)}><option value="" disabled>{t.choose}</option>{t.helpOptions.map((option) => <option key={option}>{option}</option>)}</select></Field><label className="text-sm font-bold text-ink sm:col-span-2">{t.priority}<textarea required className={`${inputClass} min-h-32 resize-y`} value={form.message} onChange={(event) => update("message", event.target.value)} /></label></div><label className="mt-5 flex items-start gap-3 text-sm leading-6 text-ink/72"><input required type="checkbox" checked={form.privacy} onChange={(event) => update("privacy", event.target.checked)} className="mt-1 size-4 accent-ink" /><span>{t.consent}</span></label><button type="submit" disabled={status === "loading"} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:-translate-y-0.5 disabled:opacity-60">{status === "loading" ? t.sending : t.send}<ArrowUpRight size={17} aria-hidden="true" /></button>{status === "success" ? <p className="mt-4 flex gap-2 text-sm font-bold leading-6" role="status"><Check size={17} className="mt-0.5 text-yellow" />{t.success}</p> : null}{status === "error" ? <p className="mt-4 text-sm font-bold leading-6" role="alert">{t.error}</p> : null}</form></div></section>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="text-sm font-bold text-ink">{label}{children}</label>; }
