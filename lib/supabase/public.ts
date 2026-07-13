import { createClient } from "@supabase/supabase-js";
import { supabasePublishableKey, supabaseUrl } from "./env";

export function createSupabasePublicClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase is not configured.");
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}
