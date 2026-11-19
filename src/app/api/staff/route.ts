import { NextResponse } from 'next/server';
import { dataRepository } from '@/lib/data/repository';
import { getSupabaseClient, getSupabaseAdminClient } from '@/lib/services/supabase-helper';
import type { StaffMember } from '@/lib/types';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    let staffList: StaffMember[] = [];

    if (supabase) {
      try {
        const { data: dbUsers, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (!error && dbUsers && dbUsers.length > 0) {
          staffList = dbUsers.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || '',
            role: u.role || 'manager',
            status: u.is_active ? 'active' : 'on_leave',
            is_active: u.is_active ?? true,
            created_at: u.created_at || new Date().toISOString(),
          }));
          return NextResponse.json({
            success: true,
            staff: staffList,
            totalCount: staffList.length,
            activeCount: staffList.filter((s) => s.status === 'active').length,
          });
        }
      } catch {
        // Fallback to local repository
      }
    }

    const memoryStaff = dataRepository.getStaff();
    return NextResponse.json({
      success: true,
      staff: memoryStaff,
      totalCount: memoryStaff.length,
      activeCount: memoryStaff.filter((s) => s.status === 'active').length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, role, password } = body;

    // Strict validation as requested by user
    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!phone?.trim()) {
      return NextResponse.json({ success: false, error: 'Mobile number is required' }, { status: 400 });
    }
    if (!email?.trim()) {
      return NextResponse.json({ success: false, error: 'Email address is required' }, { status: 400 });
    }
    if (!role?.trim()) {
      return NextResponse.json({ success: false, error: 'Role is required' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Save in memory repository
    const newStaff = dataRepository.addStaff({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      role: role.trim(),
      status: 'active',
      is_active: true,
      password: password,
    });

    // Sync with Supabase Auth and users table if connected
    const admin = getSupabaseAdminClient();
    let authUserId: string | null = null;

    if (admin) {
      try {
        const { data: existingUsers } = await admin.auth.admin.listUsers();
        const existingAuthUser = existingUsers?.users?.find(
          (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
        );

        if (existingAuthUser) {
          authUserId = existingAuthUser.id;
          await admin.auth.admin.updateUserById(authUserId, {
            password: password,
            user_metadata: {
              full_name: name.trim(),
              name: name.trim(),
              phone: phone.trim(),
              role: role.trim().toLowerCase(),
              is_staff: true,
            },
          });
        } else {
          const { data: createdAuthUser, error: createAuthError } = await admin.auth.admin.createUser({
            email: email.trim().toLowerCase(),
            password: password,
            email_confirm: true,
            user_metadata: {
              full_name: name.trim(),
              name: name.trim(),
              phone: phone.trim(),
              role: role.trim().toLowerCase(),
              is_staff: true,
            },
          });
          if (createdAuthUser?.user) {
            authUserId = createdAuthUser.user.id;
          } else if (createAuthError) {
            console.error('Error creating auth user:', createAuthError);
          }
        }

        // Upsert into public.users table with matching UUID
        const { data: dbUser } = await admin
          .from('users')
          .upsert(
            {
              id: authUserId || undefined,
              property_id: 'd0000000-0000-0000-0000-000000000001',
              name: name.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim(),
              role: role.trim().toLowerCase(),
              is_active: true,
            },
            { onConflict: 'email' }
          )
          .select()
          .maybeSingle();

        if (dbUser) {
          newStaff.id = dbUser.id;
        } else if (authUserId) {
          newStaff.id = authUserId;
        }
      } catch (err) {
        console.error('Supabase auth/user sync error:', err);
      }
    } else {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data: dbUser } = await supabase
            .from('users')
            .insert({
              property_id: 'd0000000-0000-0000-0000-000000000001',
              name: name.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim(),
              role: role.trim().toLowerCase(),
              is_active: true,
            })
            .select()
            .maybeSingle();

          if (dbUser) {
            newStaff.id = dbUser.id;
          }
        } catch (err) {
          console.error('Supabase user insert error:', err);
        }
      }
    }

    return NextResponse.json({ success: true, staff: newStaff }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Staff ID is required' }, { status: 400 });
    }

    const updated = dataRepository.updateStaff(id, {
      status,
      is_active: status === 'active',
    });

    const supabase = getSupabaseAdminClient() || getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('users')
          .update({ is_active: status === 'active' })
          .eq('id', id);
      } catch {
        // Ignored
      }
    }

    return NextResponse.json({ success: true, staff: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll') === 'true';

    const admin = getSupabaseAdminClient();
    const supabase = admin || getSupabaseClient();

    if (clearAll) {
      dataRepository.clearAllStaff();
      if (supabase) {
        try {
          await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        } catch {
          // Ignored
        }
      }
      return NextResponse.json({ success: true, message: 'All staff data cleared.' });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Staff ID is required' }, { status: 400 });
    }

    const deleted = dataRepository.deleteStaff(id);

    if (supabase) {
      try {
        await supabase.from('users').delete().eq('id', id);
      } catch {
        // Ignored
      }
    }

    if (admin) {
      try {
        await admin.auth.admin.deleteUser(id);
      } catch {
        // Ignored
      }
    }

    return NextResponse.json({ success: deleted, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
