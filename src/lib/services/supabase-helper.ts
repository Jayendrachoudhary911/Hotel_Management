import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Checks whether valid Supabase credentials have been configured in .env.local
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return false;
  if (url.includes('your_supabase_url_here') || anonKey.includes('your_supabase_anon_key_here')) {
    return false;
  }
  if (!url.startsWith('https://')) return false;

  return true;
}

/**
 * Returns a configured Supabase client or null if not yet configured.
 */
export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(url, anonKey);
}

/**
 * Returns a configured Supabase Service Role admin client or null.
 */
export function getSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!isSupabaseConfigured() || !serviceRoleKey || serviceRoleKey.includes('your_service_role_key_here')) {
    return null;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
