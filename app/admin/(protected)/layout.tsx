import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireAdminUser();

  return <AdminShell profile={profile}>{children}</AdminShell>;
}
