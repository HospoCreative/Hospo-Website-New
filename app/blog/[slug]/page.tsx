import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/supabase/queries";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

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
      <main className="bg-white pt-28 text-ink">
        <article className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="section-eyebrow text-ink/55">Insight</p>
          <h1 className="mt-5 font-serif text-[clamp(3rem,10vw,5.8rem)] font-semibold leading-[0.95]">
            {post.title}
          </h1>
          <p className="mt-7 text-xl leading-9 text-ink/72 sm:text-2xl sm:leading-10">
            {post.excerpt}
          </p>

          {post.coverImage ? (
            <div className="relative mt-12 aspect-[16/10] overflow-hidden rounded-[8px] bg-ink">
              <SmartImage
                src={post.coverImage}
                alt={post.coverImageAlt ?? post.title}
                fill
                sizes="(min-width: 1024px) 860px, 100vw"
                className="object-cover"
                fallbackLabel={post.title}
              />
            </div>
          ) : null}

          <div className="prose-hospo mt-12 space-y-7">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-xl leading-9 text-ink/78">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
