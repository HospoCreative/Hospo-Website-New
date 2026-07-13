import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/AdminForms";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateBlogPostAction } from "../../actions";

type EditBlogPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id,title,slug,excerpt,content,cover_image,cover_image_alt,author_name,tags,status")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  return (
    <div className="max-w-5xl">
      <p className="section-eyebrow text-ink/55">Edit Article</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">
        {data.title}
      </h1>
      <div className="mt-8">
        <BlogPostForm action={updateBlogPostAction} initial={data} submitLabel="Save article" />
      </div>
    </div>
  );
}
