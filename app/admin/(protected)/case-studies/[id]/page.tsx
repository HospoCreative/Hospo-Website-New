import { notFound } from "next/navigation";
import { CaseStudyForm } from "@/components/admin/AdminForms";
import { DeleteContentButton } from "@/components/admin/DeleteContentButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteCaseStudyAction, updateCaseStudyAction } from "../../actions";

type EditCaseStudyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCaseStudyPage({ params }: EditCaseStudyPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("case_studies")
    .select(
      "id,title,title_pt,slug,client_name,location,sector,sector_pt,summary,summary_pt,challenge,challenge_pt,solution,solution_pt,result,result_pt,services,services_pt,hero_image,hero_image_alt,hero_image_alt_pt,featured,display_order,status,case_study_media(id,media_type,src,alt,caption,sort_order,published)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  return (
    <div className="max-w-5xl">
      <p className="section-eyebrow text-ink/55">Edit Case Study</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">
        {data.title}
      </h1>
      <div className="mt-8">
        <CaseStudyForm
          action={updateCaseStudyAction}
          initial={data}
          submitLabel="Save case study"
        />
      </div>
      <section className="mt-8 border-t border-red-800/18 pt-8">
        <p className="text-lg font-bold text-ink">Delete this case study</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
          This removes the case study and its attached gallery records. Storage files remain in Media until you delete them there.
        </p>
        <DeleteContentButton action={deleteCaseStudyAction} id={data.id} label={`case study “${data.title}”`} />
      </section>
    </div>
  );
}
