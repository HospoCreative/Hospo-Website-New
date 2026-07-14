import { ArrowUpRight, Inbox, MapPin } from "lucide-react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateEnquiryAction } from "../actions";

type EnquiryStatus = "new" | "read" | "replied" | "archived";

type Enquiry = {
  id: string;
  name: string;
  business_name: string;
  email: string;
  website: string | null;
  business_type: string | null;
  location: string | null;
  services: string[];
  challenge: string;
  timeframe: string | null;
  message: string | null;
  status: EnquiryStatus;
  admin_notes: string | null;
  created_at: string;
};

const filters = ["all", "new", "read", "replied", "archived"] as const;

const statusStyles: Record<EnquiryStatus, string> = {
  new: "bg-yellow text-ink",
  read: "bg-sky-100 text-sky-900",
  replied: "bg-emerald-100 text-emerald-900",
  archived: "bg-slate-200 text-slate-700"
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

type InboxPageProps = {
  searchParams: Promise<{ id?: string; status?: string; message?: string; error?: string }>;
};

export default async function AdminInboxPage({ searchParams }: InboxPageProps) {
  const params = await searchParams;
  const activeFilter = filters.includes(params.status as (typeof filters)[number])
    ? (params.status as (typeof filters)[number])
    : "all";
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("contact_enquiries")
    .select(
      "id,name,business_name,email,website,business_type,location,services,challenge,timeframe,message,status,admin_notes,created_at"
    )
    .order("created_at", { ascending: false });

  if (activeFilter !== "all") {
    query = query.eq("status", activeFilter);
  }

  const { data, error } = await query;
  const enquiries = (data ?? []) as Enquiry[];
  const selected = enquiries.find((item) => item.id === params.id) ?? enquiries[0] ?? null;
  const newCount = enquiries.filter((item) => item.status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="section-eyebrow text-ink/55">Inbox</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">
            Website enquiries.
          </h1>
        </div>
        <p className="rounded-full bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-soft">
          {newCount} new
        </p>
      </div>

      {(error || params.error) && (
        <p className="mt-6 rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
          {params.error || error?.message}
        </p>
      )}
      {params.message === "saved" && (
        <p className="mt-6 rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
          Enquiry updated.
        </p>
      )}

      <div className="mt-7 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter}
            href={filter === "all" ? "/admin/inbox" : `/admin/inbox?status=${filter}`}
            className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
              activeFilter === filter
                ? "border-ink bg-ink text-white"
                : "border-ink/12 bg-white text-ink/65 hover:border-yellow"
            }`}
          >
            {filter}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.35fr)]">
        <div className="overflow-hidden rounded-[8px] bg-white shadow-soft">
          {enquiries.length ? (
            enquiries.map((enquiry) => (
              <Link
                key={enquiry.id}
                href={`/admin/inbox?id=${enquiry.id}${activeFilter !== "all" ? `&status=${activeFilter}` : ""}`}
                className={`block border-b border-ink/10 p-5 transition hover:bg-slate-50 ${
                  selected?.id === enquiry.id ? "bg-yellow/10" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold">{enquiry.business_name}</p>
                    <p className="mt-1 truncate text-sm text-ink/60">{enquiry.name}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] ${statusStyles[enquiry.status]}`}>
                    {enquiry.status}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/65">
                  {enquiry.challenge}
                </p>
                <p className="mt-3 text-xs font-bold text-ink/42">{formatDate(enquiry.created_at)}</p>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center">
              <Inbox className="mx-auto text-ink/25" size={34} />
              <p className="mt-4 text-lg font-bold">No enquiries here yet.</p>
            </div>
          )}
        </div>

        {selected ? (
          <article className="rounded-[8px] bg-white p-6 shadow-soft sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.15em] text-ink/45">
                  {formatDate(selected.created_at)}
                </p>
                <h2 className="mt-3 font-serif text-4xl font-semibold leading-none">
                  {selected.business_name}
                </h2>
                <p className="mt-3 text-lg text-ink/70">{selected.name}</p>
              </div>
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(`Your Hospo Creative enquiry - ${selected.business_name}`)}`}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:bg-ink/85"
              >
                Reply by email
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="mt-8 grid gap-4 border-y border-ink/10 py-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-ink/45">Email</p>
                <a href={`mailto:${selected.email}`} className="mt-2 block font-bold hover:text-yellow">
                  {selected.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-ink/45">Business</p>
                <p className="mt-2 font-bold">{selected.business_type || "Not supplied"}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-ink/45">Location</p>
                <p className="mt-2 flex items-center gap-2 font-bold">
                  <MapPin size={15} /> {selected.location || "Not supplied"}
                </p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-ink/45">Timeframe</p>
                <p className="mt-2 font-bold">{selected.timeframe || "Not supplied"}</p>
              </div>
              {selected.website && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-ink/45">Website</p>
                  <a href={selected.website} target="_blank" rel="noreferrer" className="mt-2 block break-all font-bold hover:text-yellow">
                    {selected.website}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-ink/45">Services</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.services.map((service) => (
                  <span key={service} className="rounded-full border border-ink/12 px-3 py-2 text-xs font-bold">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7 grid gap-7 md:grid-cols-2">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-ink/45">Main challenge</p>
                <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-ink/75">{selected.challenge}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-ink/45">Message</p>
                <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-ink/75">
                  {selected.message || "No additional message."}
                </p>
              </div>
            </div>

            <form action={updateEnquiryAction} className="mt-8 rounded-[8px] bg-slate-50 p-5">
              <input type="hidden" name="id" value={selected.id} />
              <div className="grid gap-5 sm:grid-cols-[12rem_minmax(0,1fr)]">
                <label className="text-sm font-bold">
                  Status
                  <select name="status" defaultValue={selected.status} className="mt-2 w-full rounded-[8px] border border-ink/14 bg-white px-3 py-3">
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label className="text-sm font-bold">
                  Internal notes
                  <textarea
                    name="admin_notes"
                    defaultValue={selected.admin_notes ?? ""}
                    className="mt-2 min-h-28 w-full rounded-[8px] border border-ink/14 bg-white px-4 py-3"
                    placeholder="Add follow-up notes for the team"
                  />
                </label>
              </div>
              <button className="mt-5 rounded-full bg-ink px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:bg-ink/85">
                Save enquiry
              </button>
            </form>
          </article>
        ) : (
          <div className="rounded-[8px] bg-white p-10 text-center shadow-soft">
            <Inbox className="mx-auto text-ink/25" size={40} />
            <p className="mt-4 text-xl font-bold">Select an enquiry to read it.</p>
          </div>
        )}
      </div>
    </div>
  );
}
