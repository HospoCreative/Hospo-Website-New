"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";
import { getHomepageContent } from "@/data/homepage";
import { translate, type Locale } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

type ReviewForm = { name: string; businessName: string; email: string; website: string; challenge: string; privacy: boolean };
const initialForm: ReviewForm = { name: "", businessName: "", email: "", website: "", challenge: "", privacy: false };

export function ServiceEnquiry({ locale = "en" }: { locale?: Locale }) {
  const content = getHomepageContent(locale).review;
  const [form, setForm] = useState(initialForm);
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  function updateField<K extends keyof ReviewForm>(field: K, value: ReviewForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => { const next = { ...current }; delete next[field]; return next; });
  }

  function validate() {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = translate(locale, "Please add your name.");
    if (form.businessName.trim().length < 2) next.businessName = translate(locale, "Please add your business name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = translate(locale, "Please add a valid email address.");
    if (form.challenge.trim().length < 10) next.challenge = translate(locale, "Please tell us a little more about the main challenge.");
    if (!form.privacy) next.privacy = translate(locale, "Please confirm that we may reply to your request.");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setStatus("loading"); setSubmitError("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          companyWebsite,
          businessType: "",
          location: "",
          services: ["Complimentary Digital Presence Review"],
          timeframe: "",
          message: "Digital Presence Review request"
        })
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || translate(locale, "Unable to send your request."));
      setStatus("success"); setForm(initialForm); setCompanyWebsite("");
    } catch (error) {
      setStatus("error"); setSubmitError(error instanceof Error ? error.message : translate(locale, "Unable to send your request."));
    }
  }

  const inputClass = "mt-2 min-h-12 w-full rounded-[8px] border border-ink/18 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink/38 focus:border-yellow focus:ring-2 focus:ring-yellow/40";
  const labelClass = "text-sm font-bold text-ink";

  return (
    <section id="digital-review" className="border-y border-ink/10 bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={content.eyebrow} title={content.title} body={content.body} />
          <ul className="mt-7 grid gap-2 sm:grid-cols-2">
            {content.areas.map((area) => <li key={area} className="flex items-center gap-2 text-sm font-semibold"><Check size={15} aria-hidden="true" />{area}</li>)}
          </ul>
          <p className="mt-7 border-l border-ink/35 pl-4 text-sm leading-6 text-ink/72">{content.clarification}</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="rounded-[8px] border border-ink/15 bg-white p-5 shadow-editorial sm:p-7">
          <label className="sr-only" aria-hidden="true">{translate(locale, "Company website confirmation")}<input tabIndex={-1} autoComplete="off" value={companyWebsite} onChange={(event) => setCompanyWebsite(event.target.value)} /></label>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={translate(locale, "Name")} error={errors.name}><input autoComplete="name" className={inputClass} value={form.name} onChange={(e) => updateField("name", e.target.value)} aria-invalid={Boolean(errors.name)} /></Field>
            <Field label={translate(locale, "Business name")} error={errors.businessName}><input autoComplete="organization" className={inputClass} value={form.businessName} onChange={(e) => updateField("businessName", e.target.value)} aria-invalid={Boolean(errors.businessName)} /></Field>
            <Field label="Email" error={errors.email}><input type="email" autoComplete="email" className={inputClass} value={form.email} onChange={(e) => updateField("email", e.target.value)} aria-invalid={Boolean(errors.email)} /></Field>
            <Field label={translate(locale, "Website or booking link")}><input type="url" inputMode="url" className={inputClass} value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://" /></Field>
            <label className={`${labelClass} sm:col-span-2`}>{translate(locale, "Main challenge")}<textarea className={`${inputClass} min-h-32 resize-y`} value={form.challenge} onChange={(e) => updateField("challenge", e.target.value)} aria-invalid={Boolean(errors.challenge)} />{errors.challenge ? <span className="mt-2 block text-sm text-ink" role="alert">{errors.challenge}</span> : null}</label>
          </div>
          <label className="mt-5 flex min-h-11 items-start gap-3 text-sm leading-6 text-ink/72"><input type="checkbox" checked={form.privacy} onChange={(e) => updateField("privacy", e.target.checked)} className="mt-1 size-4 accent-ink" /><span>{translate(locale, "I am happy for Hospo Creative to use these details to reply to this request.")}{errors.privacy ? <span className="mt-1 block font-semibold text-ink" role="alert">{errors.privacy}</span> : null}</span></label>
          <button type="submit" disabled={status === "loading"} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 disabled:opacity-60">{translate(locale, status === "loading" ? "Sending request" : "Request Your Digital Review")}<ArrowUpRight size={17} aria-hidden="true" /></button>
          {status === "success" ? <p className="mt-4 text-sm font-bold leading-6 text-ink" role="status">{translate(locale, "Thank you. Your review request has been sent and we will reply by email.")}</p> : null}
          {status === "error" ? <p className="mt-4 text-sm font-bold leading-6 text-ink" role="alert">{submitError} {translate(locale, "You can also email info@hospoagency.com.")}</p> : null}
        </form>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="text-sm font-bold text-ink">{label}{children}{error ? <span className="mt-2 block text-sm text-ink" role="alert">{error}</span> : null}</label>;
}
