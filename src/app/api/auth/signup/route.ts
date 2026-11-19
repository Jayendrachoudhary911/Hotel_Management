import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const normalizedEmail = String(email).trim().toLowerCase();

    // Create user with email_confirm: true so NO verification link is sent to Gmail!
    const { data, error } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password: String(password),
      email_confirm: true,
      user_metadata: {
        full_name: fullName ? String(fullName).trim() : '',
        phone: phone ? String(phone).trim() : '',
      },
    });

    if (error) {
      if (
        error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already exists') ||
        error.message.toLowerCase().includes('duplicate')
      ) {
        return NextResponse.json(
          { error: 'An account with this email address already exists. Please Sign In.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: error.message || 'Failed to create account.' },
        { status: 400 }
      );
    }

    if (!data?.user) {
      return NextResponse.json(
        { error: 'Failed to create user record.' },
        { status: 500 }
      );
    }

    // Try to record user in public.users table as a guest if possible
    try {
      await admin.from('users').insert({
        auth_id: data.user.id,
        name: fullName ? String(fullName).trim() : normalizedEmail.split('@')[0],
        email: normalizedEmail,
        phone: phone ? String(phone).trim() : null,
        property_id: 'd0000000-0000-0000-0000-000000000001',
        role: 'guest',
        is_active: true,
      });
    } catch {
      // Ignore if user record insert fails, auth account is already created
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      },
      message: 'Account created successfully without email verification requirement.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error occurred.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
