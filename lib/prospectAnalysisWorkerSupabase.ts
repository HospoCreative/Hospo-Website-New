import "server-only";

import { createClient } from "@supabase/supabase-js";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

export function createProspectAnalysisWorkerClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabasePublishableKey || !key) {
    throw new Error("Analysis worker is not configured.");
  }
  return createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
