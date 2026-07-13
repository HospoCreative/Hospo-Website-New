import { ClientLogoForm } from "@/components/admin/AdminForms";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createClientLogoAction } from "../actions";

type ClientLogoAdminRow = {
  id: string;
  client_name: string;
  logo_url: string;
  published: boolean;
  sort_order: number;
};

export default async function AdminClientsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("client_logos")
    .select("id,client_name,logo_url,published,sort_order")
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
                className="grid gap-2 border-b border-ink/10 p-5 md:grid-cols-[1fr_8rem_8rem]"
              >
                <div>
                  <p className="text-lg font-bold">{logo.client_name}</p>
                  <p className="mt-1 truncate text-sm text-ink/55">{logo.logo_url}</p>
                </div>
                <p className="text-sm text-ink/55">Order {logo.sort_order}</p>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-ink/55">
                  {logo.published ? "Published" : "Hidden"}
                </p>
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
