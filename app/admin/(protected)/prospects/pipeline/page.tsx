import Link from "next/link";
import { PIPELINE_STATUSES } from "@/lib/prospecting";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updatePipelineStatusAction } from "../actions";

type Prospect = { id: string; name: string; business_type: string; priority: string; opportunity_score: number | null; primary_service: string | null; next_followup_at: string | null; pipeline_status: string };
const priority = (value: string) => ({ HOT: "bg-red-100 text-red-800", WARM: "bg-yellow text-ink", WATCH: "bg-sky-100 text-sky-900", LOW: "bg-ink/10 text-ink" } as Record<string, string>)[value] ?? "bg-ink/10 text-ink";
const shortDate = (value: string | null) => value ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(value)) : "No follow-up";

export default async function ProspectPipelinePage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("prospects").select("id,name,business_type,priority,opportunity_score,primary_service,next_followup_at,pipeline_status").order("opportunity_score", { ascending: false, nullsFirst: false });
  const prospects = (data ?? []) as Prospect[];
  return <div>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="section-eyebrow text-ink/55">Prospecting</p><h1 className="mt-3 font-serif text-5xl font-semibold leading-none">Pipeline.</h1></div><Link href="/admin/prospects" className="text-xs font-black uppercase tracking-[0.14em] text-ink/60 hover:text-yellow">View prospects</Link></div>
    {error ? <p className="mt-6 rounded-[8px] border border-red-200 bg-red-50 p-4 font-bold text-red-800">{error.message}</p> : null}
    <p className="mt-5 max-w-3xl text-sm leading-6 text-ink/62">Use the status selector on each card to move prospects through the pipeline. This keeps the workflow reliable and accessible.</p>
    <div className="mt-7 flex gap-4 overflow-x-auto pb-5">{PIPELINE_STATUSES.map((status) => {
      const items = prospects.filter((item) => item.pipeline_status === status);
      return <section key={status} className="w-72 shrink-0"><div className="flex items-center justify-between border-b-2 border-yellow pb-3"><h2 className="font-serif text-xl font-semibold">{status}</h2><span className="rounded-full bg-white px-2.5 py-1 text-xs font-black shadow-soft">{items.length}</span></div><div className="mt-4 space-y-3">{items.map((item) => <article key={item.id} className="rounded-[8px] bg-white p-4 shadow-soft"><div className="flex items-start justify-between gap-2"><Link href={`/admin/prospects/${item.id}`} className="font-bold leading-tight hover:text-yellow">{item.name}</Link><span className={`rounded-full px-2 py-1 text-[0.58rem] font-black tracking-[0.1em] ${priority(item.priority)}`}>{item.priority}</span></div><p className="mt-2 text-xs text-ink/58">{item.business_type} · {item.opportunity_score ?? "Incomplete"}</p><p className="mt-3 text-xs font-bold text-ink/70">{item.primary_service || "Opportunity not selected"}</p><p className="mt-2 text-xs text-ink/50">{shortDate(item.next_followup_at)}</p><form action={updatePipelineStatusAction} className="mt-4 flex gap-2"><input type="hidden" name="id" value={item.id}/><select aria-label={`Move ${item.name}`} name="pipeline_status" defaultValue={item.pipeline_status} className="min-h-10 min-w-0 flex-1 rounded-[8px] border border-ink/14 px-2 text-xs font-bold">{PIPELINE_STATUSES.map((option) => <option key={option}>{option}</option>)}</select><button className="rounded-full border border-ink/15 px-3 text-[0.58rem] font-black uppercase tracking-[0.1em] hover:border-yellow">Move</button></form></article>)}{!items.length ? <p className="rounded-[8px] border border-dashed border-ink/15 p-4 text-sm text-ink/45">No prospects</p> : null}</div></section>;
    })}</div>
  </div>;
}
