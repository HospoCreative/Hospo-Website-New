export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isValidSupabaseUrl(value: string | undefined) {
  if (!value || /^\[.*\]$/.test(value.trim())) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isUsablePublicKey(value: string | undefined) {
  return Boolean(value?.trim() && !/^\[.*\]$/.test(value.trim()));
}

export function isSupabaseConfigured() {
  return isValidSupabaseUrl(supabaseUrl) && isUsablePublicKey(supabasePublishableKey);
}
