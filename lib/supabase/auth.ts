import { redirect } from "next/navigation";
import type { AdminRole, Profile } from "@/types/profile";
import { isSupabaseConfigured } from "./env";
import { createSupabaseServerClient } from "./server";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
  created_at: string;
  updated_at: string;
};

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getCurrentAdminProfile() {
  if (!isSupabaseConfigured()) {
    return { user: null, profile: null, setupRequired: true };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, setupRequired: false };
  }

  const { data } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,created_at,updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!data) {
    return { user, profile: null, setupRequired: false };
  }

  return { user, profile: mapProfile(data as ProfileRow), setupRequired: false };
}

export async function requireAdminUser() {
  const session = await getCurrentAdminProfile();

  if (session.setupRequired) {
    redirect("/admin/login?setup=1");
  }

  if (!session.user) {
    redirect("/admin/login");
  }

  if (!session.profile || !["admin", "editor"].includes(session.profile.role)) {
    redirect("/admin/login?error=unauthorised");
  }

  return session;
}
