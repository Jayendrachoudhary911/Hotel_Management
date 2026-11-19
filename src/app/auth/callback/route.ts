import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore in Server Component context
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.session?.user) {
      const user = data.session.user;
      const email = user.email?.toLowerCase();

      // If logging in as soninamanp7@gmail.com, ensure admin role in database
      if (email === 'soninamanp7@gmail.com') {
        try {
          const { getSupabaseAdminClient } = await import('@/lib/services/supabase-helper');
          const admin = getSupabaseAdminClient();
          if (admin) {
            await admin.auth.admin.updateUserById(user.id, {
              user_metadata: {
                ...user.user_metadata,
                role: 'admin',
                is_staff: true,
              },
            });
            await admin.from('users').upsert(
              {
                id: user.id,
                property_id: 'd0000000-0000-0000-0000-000000000001',
                name: user.user_metadata?.full_name || 'Naman Soni',
                email: email,
                role: 'admin',
                is_active: true,
              },
              { onConflict: 'email' }
            );
          }
        } catch (syncErr) {
          console.error('Error syncing admin on OAuth callback:', syncErr);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Fallback if code exchange fails or is missing
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
