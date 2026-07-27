import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/types/blogPost";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

export function BlogPreviewSection({ posts = [] }: { posts?: BlogPost[] }) {
  if (!posts.length) return null;

  return (
    <section className="bg-ink px-5 py-20 text-white sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="section-eyebrow text-yellow">Latest insights</p>
            <h2 className="mt-5 font-serif text-[clamp(2.7rem,7vw,5rem)] font-semibold leading-[0.96]">
              Ideas for a stronger hospitality presence.
            </h2>
          </div>
          <Link href="/blog" className="inline-flex shrink-0 items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:text-yellow">
            All articles <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.slice(0, 3).map((post, index) => (
            <Reveal key={post.id} delay={index * 0.05}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block h-full overflow-hidden rounded-[8px] bg-white text-ink transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
              >
                {post.coverImage ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink/90">
                    <SmartImage
                      src={post.coverImage}
                      alt={post.coverImageAlt || post.title}
                      fill
                      sizes="(min-width: 1280px) 31vw, (min-width: 768px) 45vw, 90vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      fallbackLabel={post.title}
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-ink/52">Article</p>
                  <h3 className="mt-3 font-serif text-3xl font-semibold leading-[0.98]">{post.title}</h3>
                  <p className="mt-4 line-clamp-3 text-base leading-7 text-ink/70">{post.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em]">
                    Read article <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
