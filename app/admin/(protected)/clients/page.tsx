import { ClientLogoForm } from "@/components/admin/AdminForms";
import { DeleteContentButton } from "@/components/admin/DeleteContentButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createClientLogoAction,
  deleteClientLogoAction,
  updateClientLogoAction
} from "../actions";

type ClientLogoAdminRow = {
  id: string;
  logo_url: string;
  published: boolean;
  sort_order: number;
};

export default async function AdminClientsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("client_logos")
    .select("id,logo_url,published,sort_order")
    .order("sort_order", { ascending: true });
  const logos = (data ?? []) as ClientLogoAdminRow[];

  return (
    <div>
      <p className="section-eyebrow text-ink/55">Logo Pool</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">
        Client logos.
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
        Upload or choose a white logo from the pool, choose its order and publish it.
        The website displays the logo artwork only.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(340px,0.48fr)]">
        <div className="overflow-hidden rounded-[8px] bg-white shadow-soft">
          {logos.length ? (
            logos.map((logo) => (
              <div key={logo.id} className="border-b border-ink/10 p-5 last:border-b-0">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_7rem_8rem_auto] md:items-center">
                  <div className="flex h-20 items-center justify-center rounded-[6px] bg-ink p-5">
                    <img
                      src={logo.logo_url}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-ink/55">Order {logo.sort_order}</p>
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-ink/55">
                    {logo.published ? "Published" : "Hidden"}
                  </p>
                  <DeleteContentButton
                    action={deleteClientLogoAction}
                    id={logo.id}
                    label="this logo"
                    compact
                  />
                </div>
                <details className="mt-4 rounded-[8px] border border-ink/10 bg-ink/[0.02] p-4">
                  <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.16em] text-ink/70">
                    Edit logo
                  </summary>
                  <div className="mt-4">
                    <ClientLogoForm
                      action={updateClientLogoAction}
                      initial={logo}
                      submitLabel="Save logo"
                    />
                  </div>
                </details>
              </div>
            ))
          ) : (
            <p className="p-6 text-lg leading-8 text-ink/72">
              No logos yet. Add your first logo from the pool.
            </p>
          )}
        </div>

        <ClientLogoForm action={createClientLogoAction} />
      </div>
    </div>
  );
}
