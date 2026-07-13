import { ClientLogoForm } from "@/components/admin/AdminForms";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createClientLogoAction,
  deleteClientLogoAction,
  updateClientLogoAction
} from "../actions";

type ClientLogoAdminRow = {
  id: string;
  client_name: string;
  logo_url: string;
  alternate_logo_url: string | null;
  alt: string;
  url: string | null;
  published: boolean;
  sort_order: number;
  related_case_study_id: string | null;
};

export default async function AdminClientsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("client_logos")
    .select(
      "id,client_name,logo_url,alternate_logo_url,alt,url,published,sort_order,related_case_study_id"
    )
    .order("sort_order", { ascending: true });
  const logos = (data ?? []) as ClientLogoAdminRow[];

  return (
    <div>
      <p className="section-eyebrow text-ink/55">Client Logos</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">
        Manage selected clients.
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
        The public logo section stays hidden until at least three published real client logos are added.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(340px,0.48fr)]">
        <div className="overflow-hidden rounded-[8px] bg-white shadow-soft">
          {logos.length ? (
            logos.map((logo) => (
              <div
                key={logo.id}
                className="border-b border-ink/10 p-5"
              >
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_8rem_8rem_auto] md:items-start">
                  <div className="min-w-0">
                    <p className="text-lg font-bold">{logo.client_name}</p>
                    <p className="mt-1 truncate text-sm text-ink/55">{logo.logo_url}</p>
                  </div>
                  <p className="text-sm text-ink/55">Order {logo.sort_order}</p>
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-ink/55">
                    {logo.published ? "Published" : "Hidden"}
                  </p>
                  <form action={deleteClientLogoAction}>
                    <input type="hidden" name="id" value={logo.id} />
                    <button className="rounded-full border border-red-300 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-50">
                      Delete
                    </button>
                  </form>
                </div>
                <details className="mt-4 rounded-[8px] border border-ink/10 bg-ink/[0.02] p-4">
                  <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.16em] text-ink/70">
                    Edit client
                  </summary>
                  <div className="mt-4">
                    <ClientLogoForm
                      action={updateClientLogoAction}
                      initial={logo}
                      submitLabel="Save client"
                    />
                  </div>
                </details>
              </div>
            ))
          ) : (
            <p className="p-6 text-lg leading-8 text-ink/72">No client logos yet.</p>
          )}
        </div>

        <ClientLogoForm action={createClientLogoAction} />
      </div>
    </div>
  );
}
