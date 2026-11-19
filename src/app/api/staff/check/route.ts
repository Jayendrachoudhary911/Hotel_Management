import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseClient, getSupabaseAdminClient } from '@/lib/services/supabase-helper';
import { dataRepository } from '@/lib/data/repository';

const STAFF_ROLES = [
  'admin',
  'administrator',
  'manager',
  'receptionist',
  'kitchen',
  'waiter',
  'housekeeping',
  'accountant',
  'staff',
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get('email')?.trim().toLowerCase();

    let targetEmail = emailParam;

    if (targetEmail) {
      // 1. Check in Supabase DB users table (primary source of truth)
      const supabase = getSupabaseAdminClient() || getSupabaseClient();
      if (supabase) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', targetEmail)
          .maybeSingle();

        if (dbUser && dbUser.is_active !== false) {
          const roleLower = (dbUser.role || '').toLowerCase();
          const isStaff = STAFF_ROLES.includes(roleLower) || Boolean(dbUser.property_id);
          return NextResponse.json({
            isStaff,
            role: dbUser.role || 'staff',
            name: dbUser.name || 'Staff Member',
            email: dbUser.email,
          });
        }
        // If Supabase is connected and user is not in DB users table
        return NextResponse.json({ isStaff: false });
      }

      // 2. Fallback to memory repository only when Supabase is not connected
      const memoryStaff = dataRepository.getStaff().find(
        (s) => s.email.toLowerCase() === targetEmail && s.status === 'active'
      );

      if (memoryStaff) {
        return NextResponse.json({
          isStaff: true,
          role: memoryStaff.role,
          name: memoryStaff.name,
          email: memoryStaff.email,
        });
      }
    }

    return NextResponse.json({ isStaff: false });
  } catch (err: any) {
    return NextResponse.json({ isStaff: false, error: err.message }, { status: 500 });
  }
}
