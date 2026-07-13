import { MediaUploader } from "@/components/admin/MediaUploader";

const buckets = [
  {
    name: "case-study-media",
    label: "Case study media",
    purpose: "Portfolio photography, campaign assets and case-study images or videos",
    accepts: "JPG, PNG, WebP, AVIF, MP4, WebM"
  },
  {
    name: "blog-media",
    label: "Blog media",
    purpose: "Article cover images and supporting blog visuals",
    accepts: "JPG, PNG, WebP, AVIF"
  },
  {
    name: "client-logos",
    label: "Client logos",
    purpose: "Client logo files for the logo strip",
    accepts: "SVG, PNG, JPG, WebP"
  }
];

export default function AdminMediaPage() {
  return (
    <div>
      <p className="section-eyebrow text-ink/55">Media</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-none sm:text-6xl">
        Upload media.
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
        Upload files directly to Supabase Storage, copy the public URL, then paste it into the relevant
        case study, blog or client logo form.
      </p>

      <MediaUploader buckets={buckets} />

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {buckets.map((bucket) => (
          <div key={bucket.name} className="rounded-[8px] bg-white p-6 shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink/45">
              Bucket
            </p>
            <h2 className="mt-3 text-xl font-bold">{bucket.label}</h2>
            <p className="mt-1 text-sm font-bold text-ink/50">{bucket.name}</p>
            <p className="mt-4 text-base leading-7 text-ink/68">{bucket.purpose}</p>
            <p className="mt-4 rounded-[8px] bg-ink/[0.04] px-3 py-2 text-xs font-black uppercase tracking-[0.13em] text-ink/55">
              {bucket.accepts}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
