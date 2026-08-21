import type { ReactNode } from "react";
import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { BUSINESS_TYPES, HOSPO_SERVICES, LEAD_FITS, MARKETS, PIPELINE_STATUSES, formatLeadFit } from "@/lib/prospecting";

export type ProspectFormValues = {
  id?: string; name: string; business_type: string; website_url: string; market: string; location: string | null; city: string | null; country: string | null; google_url: string | null; instagram_url: string | null; facebook_url: string | null; tiktok_url: string | null; booking_url: string | null; expedia_url: string | null; tripadvisor_url: string | null; reservation_url: string | null; lead_fit: string; pipeline_status: string; primary_service: string | null; secondary_service: string | null; notes: string | null; next_followup_at: string | null; commercial_fit: number | null; contactability: number | null; commercial_trigger: number | null; evidence_quality: number | null;
};

const input = "mt-2 min-h-11 w-full rounded-[8px] border border-ink/14 bg-white px-3 text-sm text-ink outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/25";
const label = "block text-sm font-bold text-ink";
const section = "rounded-[8px] bg-white p-5 shadow-soft sm:p-6";

function Select({ name, value, options, placeholder }: { name: string; value?: string | null; options: readonly string[]; placeholder?: string }) {
  return <select name={name} defaultValue={value ?? ""} className={input}>{placeholder ? <option value="">{placeholder}</option> : null}{options.map((option) => <option key={option} value={option}>{name === "lead_fit" ? formatLeadFit(option) : option}</option>)}</select>;
}

function RatingSelect({ name, value }: { name: string; value?: number | null }) {
  return <select name={name} defaultValue={value ?? ""} className={input}><option value="">Not assessed</option>{[1, 2, 3, 4, 5].map((number) => <option key={number} value={number}>{number}</option>)}</select>;
}

export function ProspectForm({ action, prospect, submitLabel, children }: { action: (formData: FormData) => void | Promise<void>; prospect?: ProspectFormValues; submitLabel: string; children?: ReactNode }) {
  const value = (key: keyof ProspectFormValues) => prospect?.[key] ?? "";
  return <form action={action} className="space-y-6">{prospect?.id ? <input type="hidden" name="id" value={prospect.id} /> : null}
    <section className={section}><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="section-eyebrow text-ink/55">Prospect details</p><h2 className="mt-2 font-serif text-3xl font-semibold">Business profile</h2></div></div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4"><label className={label}>Business name<input required name="name" defaultValue={value("name") as string} className={input} /></label><label className={label}>Business type<Select name="business_type" value={value("business_type") as string} options={BUSINESS_TYPES} /></label><label className={label}>Website<input required type="url" name="website_url" defaultValue={value("website_url") as string} className={input} placeholder="https://" /></label><label className={label}>Market<Select name="market" value={value("market") as string} options={MARKETS} /></label></div>
      <div className="mt-5 grid gap-5 md:grid-cols-3"><label className={label}>Location<input name="location" defaultValue={value("location") as string} className={input} /></label><label className={label}>City<input name="city" defaultValue={value("city") as string} className={input} /></label><label className={label}>Country<input name="country" defaultValue={value("country") as string} className={input} /></label></div>
    </section>
    <section className={section}><p className="section-eyebrow text-ink/55">Commercial qualification</p><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4"><label className={label}>Lead Fit<Select name="lead_fit" value={value("lead_fit") as string || "B"} options={LEAD_FITS} /></label><label className={label}>Pipeline status<Select name="pipeline_status" value={value("pipeline_status") as string || "New"} options={PIPELINE_STATUSES} /></label><label className={label}>Primary opportunity<Select name="primary_service" value={value("primary_service") as string} options={HOSPO_SERVICES} placeholder="Select service" /></label><label className={label}>Secondary opportunity<Select name="secondary_service" value={value("secondary_service") as string} options={HOSPO_SERVICES} placeholder="Optional" /></label></div>
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4"><label className={label}>Commercial Fit<RatingSelect name="commercial_fit" value={value("commercial_fit") as number} /></label><label className={label}>Contactability<RatingSelect name="contactability" value={value("contactability") as number} /></label><label className={label}>Commercial trigger<RatingSelect name="commercial_trigger" value={value("commercial_trigger") as number} /></label><label className={label}>Evidence quality<RatingSelect name="evidence_quality" value={value("evidence_quality") as number} /></label></div>
      <label className={`mt-5 ${label}`}>Next follow-up<input type="date" name="next_followup_at" defaultValue={typeof value("next_followup_at") === "string" ? (value("next_followup_at") as string).slice(0, 10) : ""} className={input} /></label>
    </section>
    <section className={section}><p className="section-eyebrow text-ink/55">Digital links</p><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{[["google_url", "Google URL"], ["instagram_url", "Instagram URL"], ["facebook_url", "Facebook URL"], ["tiktok_url", "TikTok URL"], ["booking_url", "Booking.com URL"], ["expedia_url", "Expedia URL"], ["tripadvisor_url", "Tripadvisor URL"], ["reservation_url", "Reservation URL"]].map(([name, title]) => <label key={name} className={label}>{title}<input type="url" name={name} defaultValue={value(name as keyof ProspectFormValues) as string} className={input} placeholder="https://" /></label>)}</div></section>
    <section className={section}><label className={label}>Internal notes<textarea name="notes" rows={7} defaultValue={value("notes") as string} className={`${input} py-3`} /></label></section>
    {children}<PendingSubmitButton label={submitLabel} pendingLabel="Saving prospect..." />
  </form>;
}
