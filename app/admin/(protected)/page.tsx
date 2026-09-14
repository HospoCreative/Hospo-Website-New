import { getAdminContentCounts } from "@/lib/supabase/queries";
import { ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const counts = await getAdminContentCounts();
  const stats = [
    { label: "Case studies", value: counts.caseStudies },
    { label: "Blog articles", value: counts.blogPosts },
    { label: "Client logos", value: counts.clientLogos }
  ];
  const privatePages = [
    { label: "Serviços & Investimento", href: "/pt/investimento", description: "Valores de referência para Portugal." },
    { label: "Pacotes de marketing", href: "/packages", description: "Landing comercial geral." },
    { label: "Pacotes para hotéis", href: "/hotels/packages", description: "Landing comercial para hotéis e alojamentos." },
    { label: "Pacotes para restaurantes", href: "/restaurants/packages", description: "Landing comercial para restauração e F&B." }
  ];
  const publicLandings = [
    { label: "Content Creation Packages", href: "/content-creation-packages", description: "Landing autónoma para mercados em inglês." },
    { label: "Pacotes de Criação de Conteúdo", href: "/pt/content-creation-packages", description: "Landing autónoma para mercados em português." }
  ];

  return (
    <div>
      <p className="section-eyebrow text-ink/55">Overview</p>
      <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none">
        Website content dashboard.
      </h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border-t-2 border-yellow bg-ink p-6 text-white shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-white/55">
              {stat.label}
            </p>
            <p className="mt-4 font-serif text-5xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
      <section className="mt-8 border border-ink/12 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-eyebrow text-ink/55">Acesso rápido</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">Páginas não indexadas</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">Links diretos para as páginas comerciais e para as landings de conteúdo.</p>
          </div>
          <Link href="/admin/proposals" className="inline-flex min-h-11 items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-ink transition hover:text-ink/60"><FileText size={16} aria-hidden="true" />Gerir propostas<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {privatePages.map((page) => <a key={page.href} href={page.href} target="_blank" rel="noreferrer" className="group rounded-[6px] border border-ink/12 p-5 transition hover:-translate-y-0.5 hover:border-ink/45 hover:shadow-soft"><div className="flex items-start justify-between gap-4"><h3 className="font-serif text-2xl leading-tight">{page.label}</h3><ArrowUpRight size={17} aria-hidden="true" className="mt-1 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div><p className="mt-3 text-sm leading-6 text-ink/62">{page.description}</p><p className="mt-4 break-all text-xs font-bold text-ink/50">{page.href}</p></a>)}
        </div>
        <p className="mt-6 border-t border-ink/10 pt-5 text-sm leading-6 text-ink/60">As propostas têm URLs privadas individuais. Abra o gestor de propostas para aceder ao link de cada proposta.</p>
        <div className="mt-6 border-t border-ink/10 pt-6">
          <p className="section-eyebrow text-ink/55">Landings públicas</p>
          <p className="mt-2 text-sm leading-6 text-ink/60">Estas duas landings têm URLs e metadados próprios, mas não estão ligadas entre si.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">{publicLandings.map((page) => <a key={page.href} href={page.href} target="_blank" rel="noreferrer" className="group rounded-[6px] border border-ink/12 p-5 transition hover:-translate-y-0.5 hover:border-ink/45 hover:shadow-soft"><div className="flex items-start justify-between gap-4"><h3 className="font-serif text-2xl leading-tight">{page.label}</h3><ArrowUpRight size={17} aria-hidden="true" className="mt-1 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div><p className="mt-3 text-sm leading-6 text-ink/62">{page.description}</p><p className="mt-4 break-all text-xs font-bold text-ink/50">{page.href}</p></a>)}</div>
        </div>
      </section>
    </div>
  );
}
