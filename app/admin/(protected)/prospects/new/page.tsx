import Link from "next/link";
import { ProspectForm } from "@/components/admin/ProspectForm";
import { createProspectAction } from "../actions";

export default async function NewProspectPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="section-eyebrow text-ink/55">Prospecting</p><h1 className="mt-3 font-serif text-5xl font-semibold leading-none">New prospect.</h1></div><Link href="/admin/prospects" className="text-sm font-black uppercase tracking-[0.14em] text-ink/65 hover:text-yellow">Back to prospects</Link></div>{error ? <p className="mt-6 rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{error}</p> : null}<div className="mt-8"><ProspectForm action={createProspectAction} submitLabel="Save & open prospect" /></div></div>;
}
