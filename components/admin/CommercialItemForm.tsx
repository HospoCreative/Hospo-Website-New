import type { CommercialItem } from "@/types/commercial";

type FormAction = (formData: FormData) => void | Promise<void>;
type FormItem = CommercialItem & { excluded_items?: string[]; excluded_items_pt?: string[]; commercial_terms?: string | null; commercial_terms_pt?: string | null; badge?: string | null; badge_pt?: string | null; featured?: boolean };

const inputClass = "mt-1 w-full rounded-[6px] border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-ink";
const labelClass = "text-[0.63rem] font-black uppercase tracking-[0.12em] text-ink/55";
const lines = (items?: string[]) => items?.join("\n") ?? "";

export function CommercialItemForm({ action, item, kind = "package", submitLabel = "Save" }: { action: FormAction; item?: FormItem; kind?: "package" | "addon"; submitLabel?: string }) {
  const field = (key: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => <label className={labelClass}>{label}<input name={key} defaultValue={String(item?.[key as keyof FormItem] ?? "")} className={inputClass} {...props} /></label>;
  const area = (key: string, label: string, initial = "") => <label className={labelClass}>{label}<textarea name={key} defaultValue={initial} rows={3} className={inputClass} /></label>;
  return <form action={action} className="grid gap-4">
    {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
    <div className="grid gap-4 sm:grid-cols-2">{field("name", "Name", { required: true })}{field("slug", "Slug")}</div>
    <div className="grid gap-4 sm:grid-cols-4"><label className={labelClass}>Market<select name="market" defaultValue={item?.market ?? "general"} className={inputClass}><option value="restaurant">Restaurants & F&B</option><option value="hotel">Hotels & Stays</option><option value="general">General</option></select></label><label className={labelClass}>Category<select name="category" defaultValue={item?.category ?? "marketing"} className={inputClass}><option value="marketing">Marketing</option><option value="content_creation">Content Creation</option></select></label>{field("sort_order", "Sort order", { type: "number", min: 0 })}<label className={`${labelClass} flex items-end gap-2 pb-2`}><input type="checkbox" name="is_active" defaultChecked={item?.is_active ?? true} /> Active</label></div>
    <div className="grid gap-4 sm:grid-cols-3">{field("price_amount", "Price", { type: "number", min: 0, step: "0.01" })}<label className={labelClass}>Currency<select name="price_currency" defaultValue={item?.price_currency ?? "EUR"} className={inputClass}><option value="EUR">EUR</option><option value="GBP">GBP</option></select></label><label className={labelClass}>Price type<select name="price_type" defaultValue={item?.price_type ?? "custom"} className={inputClass}><option value="monthly">Monthly</option><option value="from_monthly">From monthly</option><option value="project">Project</option><option value="from_project">From project</option><option value="custom">Custom</option></select></label></div>
    {area("description", "Description", item?.description ?? "")}
    {area("included_items", "Included items, one per line", lines(item?.included_items))}
    {kind === "package" ? <><div className="grid gap-4 sm:grid-cols-2">{field("badge", "Badge")}<label className={`${labelClass} flex items-end gap-2 pb-2`}><input type="checkbox" name="featured" defaultChecked={item?.featured ?? false} /> Featured</label></div>{area("excluded_items", "Not included, one per line", lines(item?.excluded_items))}</> : null}
    <details className="rounded-[6px] border border-ink/10 p-3"><summary className="cursor-pointer text-sm font-bold text-ink/70">Portuguese content</summary><div className="mt-4 grid gap-4">{field("name_pt", "Name in Portuguese")}{area("description_pt", "Description in Portuguese", item?.description_pt ?? "")}{area("included_items_pt", "Included items in Portuguese, one per line", lines(item?.included_items_pt))}{kind === "package" ? <>{field("badge_pt", "Badge in Portuguese")}{area("excluded_items_pt", "Not included in Portuguese, one per line", lines(item?.excluded_items_pt))}</> : null}</div></details>
    <button className="justify-self-start rounded-full bg-ink px-5 py-3 text-[0.67rem] font-black uppercase tracking-[0.14em] text-white transition hover:bg-ink/85">{submitLabel}</button>
  </form>;
}
