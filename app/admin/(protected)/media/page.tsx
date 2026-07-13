const buckets = [
  {
    name: "case-study-media",
    purpose: "Portfolio and case-study photography or campaign assets"
  },
  {
    name: "blog-media",
    purpose: "Article cover images and supporting blog media"
  },
  {
    name: "client-logos",
    purpose: "Supplied client logo files"
  }
];

export default function AdminMediaPage() {
  return (
    <div>
      <p className="section-eyebrow text-ink/55">Media</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">
        Supabase Storage buckets.
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
        Upload files in Supabase Storage, copy the public URL, then paste it into the relevant CMS form.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {buckets.map((bucket) => (
          <div key={bucket.name} className="rounded-[8px] bg-white p-6 shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink/45">
              Bucket
            </p>
            <h2 className="mt-3 text-xl font-bold">{bucket.name}</h2>
            <p className="mt-4 text-base leading-7 text-ink/68">{bucket.purpose}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
