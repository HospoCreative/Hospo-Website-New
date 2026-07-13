import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CaseStudyAdminRow = {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  status: string;
  updated_at: string;
};

export default async function AdminCaseStudiesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("case_studies")
    .select("id,title,slug,client_name,status,updated_at")
    .order("updated_at", { ascending: false });
  const caseStudies = (data ?? []) as CaseStudyAdminRow[];

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="section-eyebrow text-ink/55">Case Studies</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">
            Manage selected work.
          </h1>
        </div>
        <Link
          href="/admin/case-studies/new"
          className="rounded-full bg-ink px-5 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-ink/88"
        >
          New case study
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-[8px] bg-white shadow-soft">
        {caseStudies.length ? (
          caseStudies.map((caseStudy) => (
            <Link
              key={caseStudy.id}
              href={`/admin/case-studies/${caseStudy.id}`}
              className="grid gap-2 border-b border-ink/10 p-5 transition hover:bg-ink/[0.03] md:grid-cols-[1fr_10rem_8rem]"
            >
              <div>
                <p className="text-lg font-bold">{caseStudy.title}</p>
                <p className="mt-1 text-sm text-ink/55">{caseStudy.client_name}</p>
              </div>
              <p className="text-sm text-ink/55">{caseStudy.slug}</p>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-ink/55">
                {caseStudy.status}
              </p>
            </Link>
          ))
        ) : (
          <p className="p-6 text-lg leading-8 text-ink/72">No case studies yet.</p>
        )}
      </div>
    </div>
  );
}
