import {
  BookOpen,
  BriefcaseBusiness,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/admin/login/actions";
import { Logo } from "@/components/Logo";
import type { Profile } from "@/types/profile";

const adminNav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Inbox", href: "/admin/inbox", icon: Inbox },
  { label: "Case Studies", href: "/admin/case-studies", icon: BriefcaseBusiness },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Clients", href: "/admin/clients", icon: UsersRound },
  { label: "Media", href: "/admin/media", icon: ImageIcon }
];

type AdminShellProps = {
  profile: Profile;
  children: ReactNode;
};

export function AdminShell({ profile, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-ink p-6 text-white lg:flex">
        <Link href="/" aria-label="Hospo Creative home">
          <Logo variant="white" className="h-10 w-auto" priority />
        </Link>
        <nav className="mt-10 space-y-2">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-bold text-white/76 transition hover:bg-white/10 hover:text-white"
              >
                <Icon aria-hidden="true" size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form action={signOutAction} className="mt-auto">
          <button className="flex w-full items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white">
            <LogOut aria-hidden="true" size={18} />
            Log out
          </button>
        </form>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/92 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/45">
                Hospo CMS
              </p>
              <p className="mt-1 text-sm font-bold text-ink/72">{profile.email}</p>
            </div>
            <form action={signOutAction}>
              <button className="rounded-full border border-ink/12 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-ink transition hover:border-yellow hover:text-yellow">
                Log out
              </button>
            </form>
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
