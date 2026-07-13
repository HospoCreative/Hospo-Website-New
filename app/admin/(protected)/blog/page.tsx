import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type BlogAdminRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  updated_at: string;
};

export default async function AdminBlogPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id,title,slug,status,updated_at")
    .order("updated_at", { ascending: false });
  const posts = (data ?? []) as BlogAdminRow[];

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="section-eyebrow text-ink/55">Blog</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">
            Manage articles.
          </h1>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-ink px-5 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-ink/88"
        >
          New article
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-[8px] bg-white shadow-soft">
        {posts.length ? (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/admin/blog/${post.id}`}
              className="grid gap-2 border-b border-ink/10 p-5 transition hover:bg-ink/[0.03] md:grid-cols-[1fr_12rem_8rem]"
            >
              <p className="text-lg font-bold">{post.title}</p>
              <p className="text-sm text-ink/55">{post.slug}</p>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-ink/55">
                {post.status}
              </p>
            </Link>
          ))
        ) : (
          <p className="p-6 text-lg leading-8 text-ink/72">No articles yet.</p>
        )}
      </div>
    </div>
  );
}
