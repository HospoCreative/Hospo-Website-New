import { BookOpen, BriefcaseBusiness, ImageIcon, Inbox, LayoutDashboard, LogOut, ScanSearch, UsersRound } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/admin/login/actions";
import { Logo } from "@/components/Logo";
import type { Profile } from "@/types/profile";

const adminNav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Inbox", href: "/admin/inbox", icon: Inbox },
  { label: "Scans", href: "/admin/scans", icon: ScanSearch },
  { label: "Case Studies", href: "/admin/case-studies", icon: BriefcaseBusiness },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Clients", href: "/admin/clients", icon: UsersRound },
  { label: "Media", href: "/admin/media", icon: ImageIcon }
];

export function AdminShell({ profile, children }: { profile: Profile; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-white/10 bg-ink p-6 text-white lg:flex">
        <Link href="/" aria-label="Hospo Creative home" className="inline-flex min-h-11 items-center"><Logo variant="white" className="h-9 w-auto" priority /></Link>
        <p className="mt-7 text-[0.62rem] font-black uppercase tracking-[0.2em] text-yellow">Content management</p>
        <nav className="mt-5 space-y-1">
          {adminNav.map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} className="flex min-h-12 items-center gap-3 border-l-2 border-transparent px-4 py-3 text-sm font-bold text-white/72 transition hover:border-yellow hover:bg-white/[0.06] hover:text-white"><Icon aria-hidden="true" size={18} />{item.label}</Link>; })}
        </nav>
        <form action={signOutAction} className="mt-auto"><button className="flex min-h-12 w-full items-center gap-3 px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/[0.06] hover:text-white"><LogOut aria-hidden="true" size={18} />Log out</button></form>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-ink px-5 text-white sm:px-8">
          <div className="flex min-h-[4.5rem] items-center justify-between gap-4">
            <Link href="/" aria-label="Hospo Creative home" className="inline-flex min-h-11 items-center lg:hidden"><Logo variant="white" className="h-7 w-auto" /></Link>
            <div className="hidden lg:block"><p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-yellow">Hospo CMS</p><p className="mt-1 text-sm text-white/65">{profile.email}</p></div>
            <form action={signOutAction}><button className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.15em] transition hover:border-yellow hover:text-yellow">Log out</button></form>
          </div>
          <nav className="grid grid-cols-3 border-t border-white/10 pb-2 pt-2 sm:grid-cols-6 lg:hidden">
            {adminNav.map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} className="flex min-h-12 flex-col items-center justify-center gap-1 px-1 text-center text-[0.58rem] font-bold uppercase tracking-[0.08em] text-white/70 transition hover:text-yellow"><Icon aria-hidden="true" size={17} />{item.label}</Link>; })}
          </nav>
        </header>
        <main className="mx-auto max-w-[92rem] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
