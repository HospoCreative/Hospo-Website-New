import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";
import { getBlogPostBySlug } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Hospo Creative`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Hospo Creative`,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <Header />
      <main className="bg-white pt-16 text-ink">
        <article>
          <section className="bg-ink px-5 py-16 text-white sm:px-8 lg:py-24">
            <div className="mx-auto max-w-5xl">
              <Link
                href="/blog"
                className="text-xs font-black uppercase tracking-[0.2em] text-white/62 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
              >
                Back to insights
              </Link>
              <p className="section-eyebrow mt-8 text-yellow">Insight</p>
              <h1 className="mt-5 font-serif text-[clamp(3rem,10vw,6rem)] font-semibold leading-[0.94]">
                {post.title}
              </h1>
              <p className="mt-7 text-xl leading-9 text-white/74 sm:text-2xl sm:leading-10">
                {post.excerpt}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/22 px-3 py-1.5 text-[0.66rem] font-black uppercase tracking-[0.16em] text-white/72"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
            {post.coverImage ? (
              <div className="relative mb-12 aspect-[16/10] overflow-hidden rounded-[8px] bg-ink shadow-soft">
                <SmartImage
                  src={post.coverImage}
                  alt={post.coverImageAlt ?? post.title}
                  fill
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="object-cover"
                  fallbackLabel={post.title}
                />
              </div>
            ) : null}

            <div className="mx-auto max-w-3xl space-y-7">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-xl leading-9 text-ink/78">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
