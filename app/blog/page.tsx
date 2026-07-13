import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";
import { getPublishedBlogPosts } from "@/lib/supabase/queries";

export const metadata = {
  title: "Hospitality Marketing Insights | Hospo Creative",
  description: "Practical hospitality marketing articles from Hospo Creative."
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const [featuredPost, ...otherPosts] = posts;

  return (
    <>
      <Header />
      <main className="bg-white pt-16 text-ink">
        <section className="bg-ink px-5 py-16 text-white sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="section-eyebrow text-yellow">Insights</p>
            <h1 className="mt-5 max-w-5xl font-serif text-[clamp(3.2rem,10vw,6.6rem)] font-semibold leading-[0.93]">
              Hospitality marketing notes.
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-white/72 sm:text-2xl sm:leading-10">
              Practical articles on visibility, content, campaigns, websites and guest journey improvements.
            </p>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            {featuredPost ? (
              <>
                <article className="grid gap-8 border-b border-ink/12 pb-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.72fr)] lg:items-end">
                  {featuredPost.coverImage ? (
                    <a
                      href={`/blog/${featuredPost.slug}`}
                      className="group relative aspect-[16/11] overflow-hidden rounded-[8px] bg-ink shadow-soft"
                    >
                      <SmartImage
                        src={featuredPost.coverImage}
                        alt={featuredPost.coverImageAlt ?? featuredPost.title}
                        fill
                        sizes="(min-width: 1024px) 56vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        fallbackLabel={featuredPost.title}
                      />
                    </a>
                  ) : null}
                  <div>
                    <p className="section-eyebrow text-ink/50">Featured article</p>
                    <h2 className="mt-4 font-serif text-[clamp(2.5rem,7vw,4.8rem)] font-semibold leading-[0.96]">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-5 text-xl leading-9 text-ink/72">
                      {featuredPost.excerpt}
                    </p>
                    <a
                      href={`/blog/${featuredPost.slug}`}
                      className="mt-7 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] text-ink transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
                    >
                      Read article
                      <ArrowUpRight aria-hidden="true" size={18} />
                    </a>
                  </div>
                </article>

                {otherPosts.length ? (
                  <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {otherPosts.map((post) => (
                      <article key={post.slug} className="rounded-[8px] border border-ink/10 bg-white p-4 shadow-soft">
                        {post.coverImage ? (
                          <a
                            href={`/blog/${post.slug}`}
                            className="group relative mb-5 block aspect-[4/3] overflow-hidden rounded-[8px] bg-ink"
                          >
                            <SmartImage
                              src={post.coverImage}
                              alt={post.coverImageAlt ?? post.title}
                              fill
                              sizes="(min-width: 1024px) 31vw, (min-width: 768px) 50vw, 100vw"
                              className="object-cover transition duration-700 group-hover:scale-[1.03]"
                              fallbackLabel={post.title}
                            />
                          </a>
                        ) : null}
                        <h2 className="font-serif text-3xl font-semibold leading-none">{post.title}</h2>
                        <p className="mt-4 text-base leading-7 text-ink/70">{post.excerpt}</p>
                        <a
                          href={`/blog/${post.slug}`}
                          className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-ink transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
                        >
                          Read
                          <ArrowUpRight aria-hidden="true" size={16} />
                        </a>
                      </article>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="rounded-[8px] border border-ink/12 bg-ink/[0.03] p-8">
                <p className="text-lg leading-8 text-ink/72">
                  Articles will appear here once they are published in the CMS.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
