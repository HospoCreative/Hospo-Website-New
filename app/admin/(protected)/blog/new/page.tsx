import { BlogPostForm } from "@/components/admin/AdminForms";
import { createBlogPostAction } from "../../actions";

export default function NewBlogPostPage() {
  return (
    <div className="max-w-5xl">
      <p className="section-eyebrow text-ink/55">New Article</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">
        Create blog content.
      </h1>
      <div className="mt-8">
        <BlogPostForm action={createBlogPostAction} submitLabel="Create article" />
      </div>
    </div>
  );
}
