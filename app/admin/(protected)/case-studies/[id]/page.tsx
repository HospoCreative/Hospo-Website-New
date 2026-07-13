import { notFound } from "next/navigation";
import { CaseStudyForm } from "@/components/admin/AdminForms";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateCaseStudyAction } from "../../actions";

type EditCaseStudyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCaseStudyPage({ params }: EditCaseStudyPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("case_studies")
    .select(
      "id,title,slug,client_name,location,sector,summary,challenge,solution,result,services,hero_image,hero_image_alt,featured,display_order,status,case_study_media(id,media_type,src,alt,caption,sort_order,published)"
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
    </div>
  );
}
