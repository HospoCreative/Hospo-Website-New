import { ArrowUpRight, ScanSearch } from "lucide-react";
import Link from "next/link";
import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DigitalScanReport } from "@/types/digitalScan";
import { updateDigitalScanAction } from "../actions";

type ScanStatus = "new" | "reviewed" | "contacted" | "archived";
type StoredScan = {
  id: string;
  website_url: string;
  final_url: string;
  business_name: string | null;
  location: string | null;
  email: string;
  locale: "en" | "pt";
  overall_score: number;
  report: DigitalScanReport;
  status: ScanStatus;
  created_at: string;
};

const filters = ["all", "new", "reviewed", "contacted", "archived"] as const;
const statusStyles: Record<ScanStatus, string> = {
  new: "bg-yellow text-ink",
  reviewed: "bg-sky-100 text-sky-900",
  contacted: "bg-emerald-100 text-emerald-900",
  archived: "bg-ink/10 text-ink"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

type PageProps = {
  searchParams: Promise<{ id?: string; status?: string; message?: string; error?: string }>;
};

export default async function AdminScansPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeFilter = filters.includes(params.status as (typeof filters)[number])
    ? (params.status as (typeof filters)[number])
    : "all";
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("digital_scans")
    .select("id,website_url,final_url,business_name,location,email,locale,overall_score,report,status,created_at")
    .order("created_at", { ascending: false });

  if (activeFilter !== "all") query = query.eq("status", activeFilter);

  const { data, error } = await query;
  const scans = (data ?? []) as StoredScan[];
  const selected = scans.find((item) => item.id === params.id) ?? scans[0] ?? null;
  const newCount = scans.filter((item) => item.status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="section-eyebrow text-ink/55">Lead capture</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">Digital scans.</h1>
        </div>
        <p className="rounded-full bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-soft">{newCount} new</p>
      </div>

      {(error || params.error) && <p className="mt-6 border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{params.error || error?.message}</p>}
      {params.message === "saved" && <p className="mt-6 border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">Scan updated.</p>}

      <div className="mt-7 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link key={filter} href={filter === "all" ? "/admin/scans" : `/admin/scans?status=${filter}`} className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${activeFilter === filter ? "border-ink bg-ink text-white" : "border-ink/12 bg-white text-ink/65 hover:border-yellow"}`}>{filter}</Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.35fr)]">
        <div className="overflow-hidden bg-white shadow-soft">
          {scans.length ? scans.map((scan) => (
            <Link key={scan.id} href={`/admin/scans?id=${scan.id}${activeFilter !== "all" ? `&status=${activeFilter}` : ""}`} className={`block border-b border-ink/10 p-5 transition hover:bg-yellow/10 ${selected?.id === scan.id ? "bg-yellow/10" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><p className="truncate text-lg font-bold">{scan.business_name || new URL(scan.final_url).hostname}</p><p className="mt-1 truncate text-sm text-ink/60">{scan.email}</p></div>
                <span className={`rounded-full px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] ${statusStyles[scan.status]}`}>{scan.status}</span>
              </div>
              <div className="mt-3 flex items-center justify-between"><p className="text-xs font-bold text-ink/42">{formatDate(scan.created_at)}</p><p className="font-black text-ink">{scan.overall_score}/100</p></div>
            </Link>
          )) : <div className="p-8 text-center"><ScanSearch className="mx-auto text-ink/25" size={34} /><p className="mt-4 text-lg font-bold">No scans here yet.</p></div>}
        </div>

        {selected ? (
          <article className="bg-white p-6 shadow-soft sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div><p className="text-sm font-black uppercase tracking-[0.15em] text-ink/45">{formatDate(selected.created_at)} · {selected.locale.toUpperCase()}</p><h2 className="mt-3 font-serif text-4xl font-semibold leading-none">{selected.business_name || new URL(selected.final_url).hostname}</h2><p className="mt-3 text-lg text-ink/65">{selected.location || "Location not supplied"}</p></div>
              <div className="flex size-28 flex-col items-center justify-center rounded-full border-4 border-yellow bg-ink text-white"><span className="text-3xl font-black">{selected.overall_score}</span><span className="text-[0.58rem] font-black uppercase tracking-[0.12em] text-white/60">Overall</span></div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 border-y border-ink/10 py-5">
              <a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Your Hospo Creative digital scan: ${selected.business_name || selected.final_url}`)}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-xs font-black uppercase tracking-[0.14em] text-white">Email lead <ArrowUpRight size={15} /></a>
              <a href={selected.final_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/20 px-5 text-xs font-black uppercase tracking-[0.14em]">Open website <ArrowUpRight size={15} /></a>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {selected.report.areas.map((area) => <div key={area.key} className="border-t-2 border-yellow bg-ink p-5 text-white"><div className="flex items-start justify-between gap-3"><h3 className="font-serif text-xl font-semibold">{area.title}</h3><span className="text-2xl font-black text-yellow">{area.score}</span></div><p className="mt-3 text-sm leading-6 text-white/65">{area.summary}</p></div>)}
            </div>

            <div className="mt-8"><h3 className="font-serif text-2xl font-semibold">Immediate priorities</h3><ul className="mt-4 space-y-3">{selected.report.priorities.map((priority) => <li key={priority} className="border-l-2 border-yellow pl-4 leading-7 text-ink/72">{priority}</li>)}</ul></div>

            <form action={updateDigitalScanAction} className="mt-8 bg-yellow/10 p-5">
              <input type="hidden" name="id" value={selected.id} />
              <label className="block max-w-xs text-sm font-bold">Status<select name="status" defaultValue={selected.status} className="mt-2 min-h-12 w-full border border-ink/14 bg-white px-3"><option value="new">New</option><option value="reviewed">Reviewed</option><option value="contacted">Contacted</option><option value="archived">Archived</option></select></label>
              <PendingSubmitButton label="Save scan" pendingLabel="Saving scan..." className="mt-5 px-5 py-3 text-xs tracking-[0.15em]" />
            </form>
          </article>
        ) : <div className="bg-white p-10 text-center shadow-soft"><ScanSearch className="mx-auto text-ink/25" size={40} /><p className="mt-4 text-xl font-bold">Select a scan to review it.</p></div>}
      </div>
    </div>
  );
}
