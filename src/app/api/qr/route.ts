import { NextResponse } from 'next/server';
import { dataRepository } from '@/lib/data/repository';
import { getSupabaseClient } from '@/lib/services/supabase-helper';

const OUTLET_MAPPINGS: Record<string, string> = {
  restaurant: 'e0000000-0000-0000-0000-000000000001',
  cafe: 'e0000000-0000-0000-0000-000000000002',
  'out-restaurant': 'e0000000-0000-0000-0000-000000000001',
  'out-cafe': 'e0000000-0000-0000-0000-000000000002',
  'e0000000-0000-0000-0000-000000000001': 'e0000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000002': 'e0000000-0000-0000-0000-000000000002',
};

export async function GET() {
  try {
    const outlets = dataRepository.getOutlets();
    const supabase = getSupabaseClient();

    let tableRecords: any[] = [];

    if (supabase) {
      try {
        const { data: dbTables } = await supabase.from('tables').select('*');
        const { data: dbQRs } = await supabase.from('qr_tokens').select('*');

        if (dbTables && dbTables.length > 0) {
          tableRecords = dbTables.map((t: any) => {
            const qrObj = dbQRs?.find((q: any) => q.table_id === t.id);
            const cleanNum = t.table_number.toLowerCase().replace(/[^a-z0-9]/g, '');
            const token = qrObj?.token || `table-${cleanNum}`;
            const outlet = outlets.find((o) => o.id === t.outlet_id || OUTLET_MAPPINGS[o.type] === t.outlet_id) || outlets[0];

            return {
              id: qrObj?.id || `qr-${t.id}`,
              table_id: t.id,
              type: 'table' as const,
              label: `Table ${t.table_number}`,
              location: `${outlet?.name || 'Palace Dining'} (Area)`,
              outletName: outlet?.name || 'Rajmahal Royal Dining',
              token,
              targetUrl: `/qr/${token}`,
              isActive: qrObj?.is_active ?? t.is_active ?? true,
              capacity: t.capacity || 4,
              tableStatus: 'available',
            };
          });

          return NextResponse.json({
            success: true,
            records: tableRecords,
            totalCount: tableRecords.length,
            tableCount: tableRecords.length,
            roomCount: 0,
          });
        } else if (dbTables && dbTables.length === 0) {
          // Supabase has zero tables: clean state
          dataRepository.clearAllTables();
          return NextResponse.json({
            success: true,
            records: [],
            totalCount: 0,
            tableCount: 0,
            roomCount: 0,
          });
        }
      } catch {
        // Fallback to in-memory store
      }
    }

    // Fallback if Supabase is offline
    const memoryTables = dataRepository.getTables();
    const memoryQRs = dataRepository.getQRTokens();

    tableRecords = memoryTables.map((table) => {
      const outlet = outlets.find((o) => o.id === table.outlet_id) || outlets[0];
      const cleanNum = table.table_number.toLowerCase().replace(/[^a-z0-9]/g, '');
      const qrObj = memoryQRs.find((q) => q.table_id === table.id);
      const token = qrObj?.token || table.code || `table-${cleanNum}`;

      return {
        id: qrObj?.id || `qr-${table.id}`,
        table_id: table.id,
        type: 'table' as const,
        label: `Table ${table.table_number}`,
        location: `${outlet?.name || 'Palace Dining'} (${table.location || 'Dining Area'})`,
        outletName: outlet?.name || 'Rajmahal Royal Dining',
        token,
        targetUrl: `/qr/${token}`,
        isActive: qrObj?.is_active ?? table.is_active ?? true,
        capacity: table.capacity || 4,
        tableStatus: table.status || 'available',
      };
    });

    return NextResponse.json({
      success: true,
      records: tableRecords,
      totalCount: tableRecords.length,
      tableCount: tableRecords.length,
      roomCount: 0,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table_number, outlet_id, capacity, location } = body;

    if (!table_number) {
      return NextResponse.json({ success: false, error: 'Table number is required' }, { status: 400 });
    }

    const cleanNum = table_number.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const tokenStr = `table-${cleanNum}`;
    const targetOutletUUID =
      OUTLET_MAPPINGS[outlet_id] ||
      (outlet_id?.includes('cafe') || outlet_id?.includes('Café')
        ? 'e0000000-0000-0000-0000-000000000002'
        : 'e0000000-0000-0000-0000-000000000001');

    const supabase = getSupabaseClient();
    let createdTableId = `tab-${Date.now()}`;

    if (supabase) {
      try {
        const { data: dbTable, error: tableErr } = await supabase
          .from('tables')
          .insert({
            outlet_id: targetOutletUUID,
            table_number: table_number.trim().toUpperCase(),
            capacity: Number(capacity) || 4,
            is_active: true,
          })
          .select()
          .single();

        if (tableErr) {
          console.error('Supabase table insert error:', tableErr);
        } else if (dbTable) {
          createdTableId = dbTable.id;
          await supabase.from('qr_tokens').insert({
            table_id: dbTable.id,
            token: tokenStr,
            is_active: true,
          });
        }
      } catch (err) {
        console.error('Error inserting table to Supabase:', err);
      }
    }

    // Save in memory repository
    const newTable = dataRepository.addTable({
      outlet_id: targetOutletUUID,
      table_number: table_number.trim().toUpperCase(),
      capacity: Number(capacity) || 4,
      location: location || 'Dining Area',
      status: 'available',
      is_active: true,
    });
    newTable.id = createdTableId;
    newTable.code = tokenStr;

    return NextResponse.json({
      success: true,
      table: newTable,
      token: tokenStr,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const updated = dataRepository.toggleQRTokenActive(id);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('qr_tokens')
          .update({ is_active: updated?.is_active ?? true })
          .or(`id.eq.${id},table_id.eq.${id}`);
      } catch {
        // Ignored
      }
    }

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll') === 'true';

    const supabase = getSupabaseClient();

    if (clearAll) {
      dataRepository.clearAllTables();
      if (supabase) {
        try {
          await supabase.from('qr_tokens').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          await supabase.from('tables').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        } catch {
          // Ignored
        }
      }
      return NextResponse.json({ success: true, message: 'All QR codes and tables cleared.' });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'id parameter is required' }, { status: 400 });
    }

    dataRepository.deleteQRToken(id);

    if (supabase) {
      try {
        await supabase.from('qr_tokens').delete().or(`id.eq.${id},table_id.eq.${id}`);
        await supabase.from('tables').delete().eq('id', id);
      } catch {
        // Ignored
      }
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
