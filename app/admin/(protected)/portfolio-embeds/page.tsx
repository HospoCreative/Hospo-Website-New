import Link from "next/link";
import type { PortfolioEmbed, PortfolioEmbedSection } from "@/types/portfolioEmbed";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createPortfolioEmbedAction, deletePortfolioEmbedAction, updatePortfolioEmbedAction } from "./actions";

type PortfolioEmbedRow = {
  id: string;
  section: PortfolioEmbedSection;
  instagram_url: string;
  sort_order: number;
  published: boolean;
};

function mapEmbed(row: PortfolioEmbedRow): PortfolioEmbed {
  return { id: row.id, section: row.section, instagramUrl: row.instagram_url, sortOrder: row.sort_order, published: row.published };
}

const sectionContent: Record<PortfolioEmbedSection, { eyebrow: string; title: string; description: string }> = {
  selected_work: {
    eyebrow: "Selected work",
    title: "Instagram post embeds",
    description: "Full Instagram post previews shown in the Selected Work gallery."
  },
  reels: {
    eyebrow: "Reels gallery",
    title: "Instagram reel embeds",
    description: "Full Instagram reel previews shown in the Reels Gallery."
  }
};

function EmbedForm({ embed, section }: { embed?: PortfolioEmbed; section: PortfolioEmbedSection }) {
  const action = embed ? updatePortfolioEmbedAction : createPortfolioEmbedAction;
  return (
    <form action={action} className="grid gap-4 rounded-[8px] border border-ink/10 bg-white p-5 shadow-soft">
      {embed ? <input type="hidden" name="id" value={embed.id} /> : null}
      <input type="hidden" name="section" value={section} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold">{embed ? "Edit embed" : "Add an Instagram link"}</p>
        {embed ? <span className="text-xs font-bold text-ink/50">{embed.published ? "Published" : "Hidden"}</span> : null}
      </div>
      <label className="text-xs font-bold">Instagram post or reel URL
        <input name="instagram_url" type="url" required defaultValue={embed?.instagramUrl ?? ""} placeholder="https://www.instagram.com/p/.../" className="mt-1.5 min-h-11 w-full rounded border border-ink/15 px-3 py-2 text-sm font-normal" />
      </label>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <label className="text-xs font-bold">Order
          <input name="sort_order" type="number" min="0" step="10" defaultValue={embed?.sortOrder ?? 10} className="mt-1.5 block min-h-11 w-28 rounded border border-ink/15 px-3 py-2 text-sm font-normal" />
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm font-bold"><input name="published" type="checkbox" defaultChecked={embed?.published ?? true} /> Show on the website</label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="min-h-11 rounded-full bg-ink px-5 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">{embed ? "Save changes" : "Add embed"}</button>
        {embed ? <button formAction={deletePortfolioEmbedAction} className="min-h-11 rounded-full border border-red-700/30 px-5 py-2 text-xs font-black uppercase tracking-[0.12em] text-red-800">Delete</button> : null}
      </div>
    </form>
  );
}

export default async function PortfolioEmbedsAdminPage({ searchParams }: { searchParams: Promise<{ message?: string; error?: string }> }) {
  const [{ data }, params] = await Promise.all([
    (await createSupabaseServerClient()).from("portfolio_embeds").select("id,section,instagram_url,sort_order,published").order("section").order("sort_order"),
    searchParams
  ]);
  const embeds = ((data ?? []) as PortfolioEmbedRow[]).map(mapEmbed);

  return <div>
    <p className="section-eyebrow text-ink/55">Website gallery</p>
    <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">Portfolio embeds.</h1>
    <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">Manage the Instagram links used in Selected Work and Reels Gallery. The same library is shown on the homepage, Photography & Video and Social Media pages.</p>
    <div className="mt-5 flex flex-wrap gap-3"><Link href="/#selected-work" target="_blank" className="rounded-full border border-ink/20 px-4 py-2 text-xs font-black uppercase tracking-[0.12em]">Preview Selected Work</Link><Link href="/#reels-gallery" target="_blank" className="rounded-full border border-ink/20 px-4 py-2 text-xs font-black uppercase tracking-[0.12em]">Preview Reels</Link></div>
    {params.message ? <p className="mt-6 rounded-[6px] bg-green-50 px-4 py-3 text-sm font-bold text-green-800">Gallery updated.</p> : null}
    {params.error ? <p className="mt-6 rounded-[6px] bg-red-50 px-4 py-3 text-sm font-bold text-red-800">{params.error}</p> : null}
    <div className="mt-10 grid gap-10 xl:grid-cols-2">
      {(["selected_work", "reels"] as const).map((section) => {
        const content = sectionContent[section];
        const sectionEmbeds = embeds.filter((embed) => embed.section === section);
        return <section key={section} className="rounded-[10px] bg-stone-50 p-5 sm:p-7"><p className="section-eyebrow text-ink/55">{content.eyebrow}</p><h2 className="mt-3 font-serif text-3xl">{content.title}</h2><p className="mt-3 text-sm leading-6 text-ink/65">{content.description}</p><div className="mt-6 space-y-4">{sectionEmbeds.map((embed) => <EmbedForm key={embed.id} embed={embed} section={section} />)}</div><div className="mt-5 border-t border-ink/10 pt-5"><EmbedForm section={section} /></div></section>;
      })}
    </div>
  </div>;
}
