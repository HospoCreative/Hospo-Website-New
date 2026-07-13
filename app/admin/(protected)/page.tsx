import { getAdminContentCounts } from "@/lib/supabase/queries";

export default async function AdminDashboardPage() {
  const counts = await getAdminContentCounts();
  const stats = [
    { label: "Case studies", value: counts.caseStudies },
    { label: "Blog articles", value: counts.blogPosts },
    { label: "Client logos", value: counts.clientLogos }
  ];

  return (
    <div>
      <p className="section-eyebrow text-ink/55">Overview</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">
        Website content dashboard.
      </h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[8px] bg-white p-6 shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink/45">
              {stat.label}
            </p>
            <p className="mt-4 font-serif text-5xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-[8px] bg-white p-6 shadow-soft">
        <h2 className="font-serif text-3xl font-semibold">CMS priorities</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-lg leading-8 text-ink/72">
          <li>Publish case studies only when the text and image set are final.</li>
          <li>Add only genuine client logos supplied by Hospo Creative.</li>
          <li>Keep portfolio images clean: no text, captions or labels over the photos.</li>
        </ul>
      </div>
    </div>
  );
}
