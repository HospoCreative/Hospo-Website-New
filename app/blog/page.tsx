import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";
import { getPublishedBlogPosts } from "@/lib/supabase/queries";

export const metadata = {
  title: "Hospitality Marketing Insights | Hospo Creative",
  description: "Practical hospitality marketing articles from Hospo Creative."
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <Header />
      <main className="bg-white pt-28 text-ink">
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="section-eyebrow text-ink/55">Insights</p>
          <h1 className="mt-5 max-w-5xl font-serif text-[clamp(3rem,10vw,6rem)] font-semibold leading-[0.95]">
            Hospitality marketing notes.
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-9 text-ink/72 sm:text-2xl sm:leading-10">
            Practical articles on visibility, content, campaigns, websites and guest journey improvements.
          </p>

          {posts.length ? (
            <div className="mt-14 grid gap-8 md:grid-cols-2">
              {posts.map((post) => (
                <article key={post.slug} className="border-t border-ink/12 pt-6">
                  {post.coverImage ? (
                    <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[8px] bg-ink">
                      <SmartImage
                        src={post.coverImage}
                        alt={post.coverImageAlt ?? post.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                        fallbackLabel={post.title}
                      />
                    </div>
                  ) : null}
                  <h2 className="font-serif text-4xl font-semibold leading-none">{post.title}</h2>
                  <p className="mt-4 text-lg leading-8 text-ink/72">{post.excerpt}</p>
                  <a
                    href={`/blog/${post.slug}`}
                    className="mt-6 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] text-ink transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
                  >
                    Read article
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-14 rounded-[8px] border border-ink/12 bg-ink/[0.03] p-8">
              <p className="text-lg leading-8 text-ink/72">
                Articles will appear here once they are published in the CMS.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
