import Link from "next/link";
import { Logo } from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { resetPasswordAction, signInAction } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    setup?: string;
  }>;
};

export const metadata = {
  title: "Admin Login | Hospo Creative"
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();
  const error = params.error ? decodeURIComponent(params.error) : null;
  const setupRequired = params.setup === "1" || !configured;

  return (
    <main className="min-h-screen bg-ink px-5 py-10 text-white sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <Link href="/" className="mb-10 inline-flex w-fit" aria-label="Hospo Creative home">
          <Logo variant="white" className="h-10 w-auto" />
        </Link>

        <section className="rounded-[8px] border border-white/12 bg-white p-6 text-ink shadow-soft sm:p-8">
          <p className="section-eyebrow text-ink/55">CMS Admin</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-none">
            Sign in to manage content.
          </h1>

          {setupRequired ? (
            <div className="mt-6 rounded-[8px] border border-yellow/50 bg-yellow/10 p-4 text-sm leading-6 text-ink/78">
              Add your Supabase environment variables in Vercel before using the live admin.
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
              {error}
            </div>
          ) : null}

          {params.message === "reset-sent" ? (
            <div className="mt-6 rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
              Password reset email sent.
            </div>
          ) : null}

          <form action={signInAction} className="mt-7 space-y-4">
            <label className="block text-sm font-bold text-ink">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-[8px] border border-ink/14 px-4 py-3 text-base text-ink outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/30"
                placeholder="admin@hospoagency.com"
              />
            </label>
            <label className="block text-sm font-bold text-ink">
              Password
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-[8px] border border-ink/14 px-4 py-3 text-base text-ink outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/30"
              />
            </label>
            <button
              type="submit"
              disabled={!configured}
              className="w-full rounded-full bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.17em] text-white transition hover:bg-ink/88 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Log in
            </button>
          </form>

          <form action={resetPasswordAction} className="mt-5 border-t border-ink/10 pt-5">
            <label className="block text-sm font-bold text-ink">
              Forgot password?
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-[8px] border border-ink/14 px-4 py-3 text-base text-ink outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/30"
                placeholder="admin@hospoagency.com"
              />
            </label>
            <button
              type="submit"
              disabled={!configured}
              className="mt-3 text-sm font-black uppercase tracking-[0.16em] text-ink transition hover:text-yellow disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send reset email
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
