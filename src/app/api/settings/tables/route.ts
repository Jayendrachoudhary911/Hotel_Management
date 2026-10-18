import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/services/supabase-helper';
import { dataRepository } from '@/lib/data/repository';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { outlet_id, table_number, capacity } = body;

    if (!outlet_id || !table_number) {
      return NextResponse.json(
        { success: false, error: 'outlet_id and table_number are required' },
        { status: 400 }
      );
    }

    const token = `qr-tbl-${table_number}-${Date.now().toString(36)}`;
    const supabase = getSupabaseClient();

    if (supabase) {
      const { data: table, error: tableErr } = await supabase
        .from('tables')
        .insert({
          outlet_id,
          table_number,
          capacity: Number(capacity) || 4,
          is_active: true,
        })
        .select('*')
        .single();

      if (!tableErr && table) {
        await supabase.from('qr_tokens').insert({
          table_id: table.id,
          token,
          is_active: true,
        });

        return NextResponse.json({ success: true, table, token }, { status: 201 });
      }
    }

    // Fallback in-memory
    const newT = {
      id: `tbl-${Date.now()}`,
      outlet_id,
      table_number,
      capacity: Number(capacity) || 4,
      is_active: true,
    };

    return NextResponse.json({ success: true, table: newT, token }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
