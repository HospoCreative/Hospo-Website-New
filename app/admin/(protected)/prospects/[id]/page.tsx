import { ArrowUpRight, ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ProspectForm,
  type ProspectFormValues,
} from "@/components/admin/ProspectForm";
import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import {
  PIPELINE_STATUSES,
  assessmentCategories,
  assessmentProfile,
  formatLeadFit,
} from "@/lib/prospecting";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createContactAction,
  deleteContactAction,
  saveAssessmentAction,
  setPrimaryContactAction,
  updateContactAction,
  updatePipelineStatusAction,
  updateProspectAction,
  startWebsiteAnalysisAction,
} from "../actions";
import { createProposalFromProspectAction } from "../../commercial/actions";

type Contact = {
  id: string;
  name: string;
  job_title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  contact_type: string | null;
  source: string | null;
  verified_at: string | null;
  is_primary: boolean;
};
type Activity = {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  author:
    | ({ full_name: string | null; email: string }[] & {
        full_name?: string | null;
        email?: string;
      })
    | null;
};
type Score = { category: string; score: number | null; notes: string | null; is_not_applicable?: boolean };
type Analysis = { id: string; status: string; current_stage: string | null; scanner_version: string; pages_discovered: number; pages_scanned: number; evidence_count: number; error_message: string | null; created_at: string; completed_at: string | null };
type Evidence = { id: string; evidence_key: string; evidence_group: string; confidence: string; page_url: string | null; value: Record<string, unknown> };
const input =
  "mt-2 min-h-11 w-full rounded-[8px] border border-ink/14 bg-white px-3 text-sm text-ink outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/25";
const label = "block text-sm font-bold text-ink";
const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Not scheduled";

export default async function ProspectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; analysis?: string; message?: string; error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const tab = ["overview", "assessment", "analysis", "contacts", "activity"].includes(
    query.tab ?? "",
  )
    ? query.tab!
    : "overview";
  const supabase = await createSupabaseServerClient();
  const [
    { data: prospect, error },
    { data: contacts },
    { data: scores },
    { data: activities },
    { data: analyses },
  ] = await Promise.all([
    supabase.from("prospects").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("prospect_contacts")
      .select("*")
      .eq("prospect_id", id)
      .order("is_primary", { ascending: false })
      .order("name"),
    supabase
      .from("prospect_scores")
      .select("category,score,notes")
      .eq("prospect_id", id),
    supabase
      .from("prospect_activity")
      .select(
        "id,activity_type,description,created_at,author:profiles!prospect_activity_created_by_fkey(full_name,email)",
      )
      .eq("prospect_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("prospect_analyses").select("id,status,current_stage,scanner_version,pages_discovered,pages_scanned,evidence_count,error_message,created_at,completed_at").eq("prospect_id", id).order("created_at", { ascending: false }),
  ]);
  if (error || !prospect) notFound();
  const scoreByCategory = Object.fromEntries(
    ((scores ?? []) as Score[]).map((score) => [score.category, score]),
  );
  const profile = assessmentProfile(prospect.business_type);
  const prospectValue = prospect as ProspectFormValues & {
    digital_presence_score: number | null;
    opportunity_score: number | null;
    priority: string;
    updated_at: string;
  };
  const links = [
    ["Website", prospect.website_url],
    ["Google", prospect.google_url],
    ["Instagram", prospect.instagram_url],
    ["Facebook", prospect.facebook_url],
    ["TikTok", prospect.tiktok_url],
    ["Booking", prospect.booking_url],
    ["Expedia", prospect.expedia_url],
    ["Tripadvisor", prospect.tripadvisor_url],
    ["Reservations", prospect.reservation_url],
  ].filter(([, value]) => Boolean(value));
  const tabs = [
    ["overview", "Overview"],
    ["assessment", "Assessment"],
    ["analysis", "Analysis"],
    ["contacts", `Contacts (${contacts?.length ?? 0})`],
    ["activity", "Activity"],
  ];
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <Link
            href="/admin/prospects"
            className="text-xs font-black uppercase tracking-[0.14em] text-ink/55 hover:text-yellow"
          >
            Prospects
          </Link>
          <p className="mt-5 section-eyebrow text-ink/55">
            {prospect.business_type} · {prospect.market}
          </p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">
            {prospect.name}
          </h1>
          <p className="mt-3 text-lg text-ink/65">
            {prospect.location || prospect.city || "Location not supplied"}
          </p>
        </div>
        <div className="flex flex-col gap-3"><form action={createProposalFromProspectAction}><input type="hidden" name="prospect_id" value={id}/><button className="w-full rounded-full bg-ink px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white">Create Proposal</button></form><form
          action={updatePipelineStatusAction}
          className="min-w-60 rounded-[8px] bg-white p-4 shadow-soft"
        >
          <input type="hidden" name="id" value={id} />
          <label className={label}>
            Pipeline status
            <select
              name="pipeline_status"
              defaultValue={prospect.pipeline_status}
              className={input}
            >
              {PIPELINE_STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
          <PendingSubmitButton
            label="Update status"
            pendingLabel="Updating..."
            className="mt-3 w-full px-4 py-3 text-xs"
          />
        </form></div>
      </div>
      {query.error ? (
        <p className="mt-6 rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
          {query.error}
        </p>
      ) : null}
      {query.message ? (
        <p className="mt-6 rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
          Saved.
        </p>
      ) : null}
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-[8px] bg-ink p-5 text-white shadow-soft">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-yellow">
            Opportunity
          </p>
          <p className="mt-2 text-3xl font-black">
            {prospect.opportunity_score ?? "Incomplete"}
          </p>
        </div>
        <div className="rounded-[8px] bg-white p-5 shadow-soft">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-ink/45">
            Digital Presence
          </p>
          <p className="mt-2 text-3xl font-black">
            {prospect.digital_presence_score ?? "Incomplete"}
          </p>
        </div>
        <div className="rounded-[8px] bg-white p-5 shadow-soft">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-ink/45">
            Priority
          </p>
          <p className="mt-2 text-2xl font-black">{prospect.priority}</p>
        </div>
        <div className="rounded-[8px] bg-white p-5 shadow-soft">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-ink/45">
            Lead Fit
          </p>
          <p className="mt-2 text-xl font-black">
            {formatLeadFit(prospect.lead_fit)}
          </p>
        </div>
        <div className="rounded-[8px] bg-white p-5 shadow-soft">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-ink/45">
            Next follow-up
          </p>
          <p className="mt-2 font-black">
            {formatDate(prospect.next_followup_at)}
          </p>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap gap-2 border-b border-ink/10">
        {tabs.map(([key, title]) => (
          <Link
            key={key}
            href={`/admin/prospects/${id}?tab=${key}`}
            className={`border-b-2 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] ${tab === key ? "border-yellow text-ink" : "border-transparent text-ink/55 hover:text-ink"}`}
          >
            {title}
          </Link>
        ))}
      </div>
      {tab === "overview" ? (
        <div className="mt-7 space-y-6">
          <div className="flex flex-wrap gap-3">
            {links.map(([name, href]) => (
              <a
                key={name}
                href={href!}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/15 bg-white px-4 text-xs font-black uppercase tracking-[0.12em] hover:border-yellow"
              >
                {name}
                <ExternalLink size={14} />
              </a>
            ))}
          </div>
          <ProspectForm
            action={updateProspectAction}
            prospect={prospectValue}
            submitLabel="Save prospect"
          />
        </div>
      ) : null}
      {tab === "assessment" ? (
        <form action={saveAssessmentAction} className="mt-7 space-y-5">
          <input type="hidden" name="id" value={id} />
          <input
            type="hidden"
            name="business_type"
            value={prospect.business_type}
          />
          <div className="rounded-[8px] bg-ink p-6 text-white shadow-soft">
            <p className="section-eyebrow text-yellow">
              Digital Presence Assessment
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">
              {profile.label} profile
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
              Score each applicable area from 1 to 5, where 1 indicates a clear gap and 5 indicates a strong current presence. Use Not applicable only when the category genuinely does not apply. The score stays incomplete until every applicable category has a score.
            </p>
          </div>
          {assessmentCategories(prospect.business_type).map((category) => {
            const score = scoreByCategory[category.key] ?? category.legacyKeys?.map((key) => scoreByCategory[key]).find(Boolean);
            const selectedValue = score?.is_not_applicable ? "not_applicable" : score?.score?.toString() ?? "";
            return (
              <section
                key={category.key}
                className="rounded-[8px] bg-white p-5 shadow-soft"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold">
                      {category.label}
                    </h3>
                    <p className="mt-1 text-sm text-ink/55">
                      Weight: {category.weight}%
                    </p>
                  </div>
                  <label className="text-sm font-bold text-ink/70">
                    Score
                    <select name={`score_${category.key}`} defaultValue={selectedValue} className={`${input} mt-1 min-w-48`}>
                      <option value="">Not assessed</option>
                      <option value="not_applicable">Not applicable</option>
                      {[1, 2, 3, 4, 5].map((number) => <option key={number} value={number}>{number}</option>)}
                    </select>
                  </label>
                </div>
                <label className="mt-4 block text-sm font-bold">
                  Internal note
                  <textarea
                    name={`note_${category.key}`}
                    rows={3}
                    defaultValue={score?.notes ?? ""}
                    className={`${input} py-3`}
                  />
                </label>
              </section>
            );
          })}
          <PendingSubmitButton
            label="Save assessment"
            pendingLabel="Calculating..."
          />
        </form>
      ) : null}
      {tab === "analysis" ? (
        <AnalysisPanel prospectId={id} analyses={(analyses ?? []) as Analysis[]} selectedAnalysisId={query.analysis} />
      ) : null}
      {tab === "contacts" ? (
        <div className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
          <div className="space-y-4">
            {(contacts ?? []).map((contact: Contact) => (
              <article
                key={contact.id}
                className="rounded-[8px] bg-white p-5 shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{contact.name}</h3>
                      {contact.is_primary ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.12em]">
                          <Star size={11} fill="currentColor" />
                          Primary
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-ink/60">
                      {contact.job_title ||
                        contact.contact_type ||
                        "Role not supplied"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form action={setPrimaryContactAction}>
                      <input type="hidden" name="prospect_id" value={id} />
                      <input
                        type="hidden"
                        name="contact_id"
                        value={contact.id}
                      />
                      <button className="rounded-full border border-ink/15 px-3 py-2 text-[0.6rem] font-black uppercase tracking-[0.1em] hover:border-yellow">
                        Primary
                      </button>
                    </form>
                    <form action={deleteContactAction}>
                      <input type="hidden" name="prospect_id" value={id} />
                      <input
                        type="hidden"
                        name="contact_id"
                        value={contact.id}
                      />
                      <button className="rounded-full border border-red-200 px-3 py-2 text-[0.6rem] font-black uppercase tracking-[0.1em] text-red-700">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-ink/68 sm:grid-cols-2">
                  <p>{contact.email || "No email"}</p>
                  <p>{contact.phone || "No phone"}</p>
                  <p>
                    {contact.source
                      ? `Source: ${contact.source}`
                      : "Source not supplied"}
                  </p>
                  {contact.linkedin_url ? (
                    <a
                      className="font-bold hover:text-yellow"
                      href={contact.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn <ArrowUpRight className="inline" size={13} />
                    </a>
                  ) : null}
                </div>
                <details className="mt-4 border-t border-ink/10 pt-4">
                  <summary className="cursor-pointer text-xs font-black uppercase tracking-[0.12em] text-ink/65 hover:text-yellow">
                    Edit contact
                  </summary>
                  <form action={updateContactAction} className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input type="hidden" name="prospect_id" value={id} />
                    <input type="hidden" name="contact_id" value={contact.id} />
                    <label className={label}>Name<input required name="name" defaultValue={contact.name} className={input} /></label>
                    <label className={label}>Job title<input name="job_title" defaultValue={contact.job_title ?? ""} className={input} /></label>
                    <label className={label}>Email<input type="email" name="email" defaultValue={contact.email ?? ""} className={input} /></label>
                    <label className={label}>Phone<input name="phone" defaultValue={contact.phone ?? ""} className={input} /></label>
                    <label className={label}>LinkedIn URL<input type="url" name="linkedin_url" defaultValue={contact.linkedin_url ?? ""} className={input} /></label>
                    <label className={label}>Contact type<input name="contact_type" defaultValue={contact.contact_type ?? ""} className={input} /></label>
                    <label className={label}>Source<input name="source" defaultValue={contact.source ?? ""} className={input} /></label>
                    <label className={label}>Verified date<input type="date" name="verified_at" defaultValue={contact.verified_at?.slice(0, 10) ?? ""} className={input} /></label>
                    <PendingSubmitButton label="Save contact" pendingLabel="Saving..." className="sm:col-span-2 w-fit px-4 py-3 text-xs" />
                  </form>
                </details>
              </article>
            ))}
            {!contacts?.length ? (
              <div className="rounded-[8px] bg-white p-10 text-center shadow-soft">
                <p className="text-lg font-bold">No contacts yet.</p>
              </div>
            ) : null}
          </div>
          <form
            action={createContactAction}
            className="h-fit rounded-[8px] bg-white p-5 shadow-soft"
          >
            <input type="hidden" name="prospect_id" value={id} />
            <p className="section-eyebrow text-ink/55">Contacts</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">
              Add contact
            </h2>
            <div className="mt-5 space-y-4">
              <label className={label}>
                Name
                <input required name="name" className={input} />
              </label>
              <label className={label}>
                Job title
                <input name="job_title" className={input} />
              </label>
              <label className={label}>
                Email
                <input type="email" name="email" className={input} />
              </label>
              <label className={label}>
                Phone
                <input name="phone" className={input} />
              </label>
              <label className={label}>
                LinkedIn URL
                <input type="url" name="linkedin_url" className={input} />
              </label>
              <label className={label}>
                Contact type
                <input
                  name="contact_type"
                  placeholder="Owner, General Manager..."
                  className={input}
                />
              </label>
              <label className={label}>
                Source
                <input
                  name="source"
                  placeholder="Manual research"
                  className={input}
                />
              </label>
              <label className={label}>
                Verified date
                <input type="date" name="verified_at" className={input} />
              </label>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input type="checkbox" name="is_primary" />
                Primary contact
              </label>
            </div>
            <PendingSubmitButton
              label="Add contact"
              pendingLabel="Adding..."
              className="mt-5 w-full px-4 py-3 text-xs"
            />
          </form>
        </div>
      ) : null}
      {tab === "activity" ? (
        <div className="mt-7 max-w-4xl space-y-3">
          {(activities ?? []).map((item: Activity) => (
            <article
              key={item.id}
              className="border-l-2 border-yellow bg-white p-5 shadow-soft"
            >
              <p className="text-[0.62rem] font-black uppercase tracking-[0.13em] text-ink/48">
                {formatDate(item.created_at)} ·{" "}
                {item.activity_type.replaceAll("_", " ")}
              </p>
              <p className="mt-2 font-bold">{item.description}</p>
              <p className="mt-2 text-xs text-ink/50">
                {item.author?.full_name || item.author?.email || "CMS user"}
              </p>
            </article>
          ))}
          {!activities?.length ? (
            <p className="rounded-[8px] bg-white p-8 text-center font-bold shadow-soft">
              No activity yet.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

async function AnalysisPanel({ prospectId, analyses, selectedAnalysisId }: { prospectId: string; analyses: Analysis[]; selectedAnalysisId?: string }) {
  const latest = analyses.find((analysis) => analysis.id === selectedAnalysisId) ?? analyses[0];
  const supabase = await createSupabaseServerClient();
  const { data } = latest
    ? await supabase.from("prospect_evidence").select("id,evidence_key,evidence_group,confidence,page_url,value").eq("analysis_id", latest.id).order("evidence_group").order("evidence_key")
    : { data: [] };
  const evidence = (data ?? []) as Evidence[];
  const busy = ["queued", "running", "processing", "retrying"].includes(latest?.status ?? "");
  const groups = [["overview", "Overview"], ["conversion", "Conversion"], ["pages", "Pages"], ["contact_discovery", "Contact & Discovery"], ["technical", "Technical"], ["rendering", "Rendering"], ["performance", "Performance"]] as const;
  return <div className="mt-7 space-y-6">
    <section className="rounded-[8px] bg-ink p-6 text-white shadow-soft">
      <p className="section-eyebrow text-yellow">Website intelligence</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold">Latest Website Analysis</h2>
      {latest ? <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-6"><p><span className="block text-xs uppercase tracking-[0.12em] text-white/55">Status</span><strong>{latest.status}</strong></p><p><span className="block text-xs uppercase tracking-[0.12em] text-white/55">Stage</span><strong>{["queued", "processing", "retrying"].includes(latest.status) ? latest.current_stage?.replaceAll("_", " ") ?? latest.status : "Complete"}</strong></p><p><span className="block text-xs uppercase tracking-[0.12em] text-white/55">Date</span><strong>{formatDate(latest.created_at)}</strong></p><p><span className="block text-xs uppercase tracking-[0.12em] text-white/55">Version</span><strong>{latest.scanner_version}</strong></p><p><span className="block text-xs uppercase tracking-[0.12em] text-white/55">Pages</span><strong>{latest.pages_scanned}/{latest.pages_discovered}</strong></p><p><span className="block text-xs uppercase tracking-[0.12em] text-white/55">Evidence</span><strong>{latest.evidence_count}</strong></p></div> : <p className="mt-3 text-sm text-white/70">No website analysis has been run for this prospect.</p>}
      {latest?.error_message ? <p className="mt-4 rounded bg-white/10 p-3 text-sm text-white/80">{latest.error_message}</p> : null}
      <form action={startWebsiteAnalysisAction} className="mt-6"><input type="hidden" name="prospect_id" value={prospectId} /><PendingSubmitButton disabled={busy} label={latest ? "Run New Website Analysis" : "Run Website Analysis"} pendingLabel="Starting..." className="px-5 py-3 text-xs" /></form>
      {busy ? <p className="mt-3 text-xs text-white/60">This analysis is running. Refresh this page shortly for its saved evidence.</p> : null}
    </section>
    {evidence.length ? <section className="space-y-4">{groups.map(([key, title]) => { const items = evidence.filter((item) => item.evidence_group === key); return items.length ? <div key={key} className="rounded-[8px] bg-white p-5 shadow-soft"><h3 className="font-serif text-2xl font-semibold">{title}</h3><div className="mt-4 grid gap-3">{items.map((item) => <details key={item.id} className="rounded border border-ink/10 p-3"><summary className="cursor-pointer text-sm font-bold">{item.evidence_key.replace(/^WEB_/, "").replaceAll("_", " ")} <span className="ml-2 text-xs font-normal text-ink/50">{item.confidence} confidence</span></summary><pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-ink/65">{JSON.stringify(item.value, null, 2)}</pre>{item.page_url ? <a className="mt-2 inline-block text-xs font-bold text-ink/60 hover:text-yellow" href={item.page_url} target="_blank" rel="noreferrer">Source page</a> : null}</details>)}</div></div> : null; })}</section> : null}
    {analyses.length > 1 ? <section className="rounded-[8px] bg-white p-5 shadow-soft"><p className="section-eyebrow text-ink/55">History</p><h3 className="mt-2 font-serif text-2xl font-semibold">Previous analyses</h3><div className="mt-4 space-y-3">{analyses.filter((analysis) => analysis.id !== latest?.id).map((analysis) => <Link key={analysis.id} href={`/admin/prospects/${prospectId}?tab=analysis&analysis=${analysis.id}`} className="block border-t border-ink/10 pt-3 text-sm hover:text-yellow"><strong>{formatDate(analysis.created_at)}</strong> · Website Analysis · {analysis.status} · {analysis.pages_scanned} pages · {analysis.evidence_count} evidence items</Link>)}</div></section> : null}
  </div>;
}
