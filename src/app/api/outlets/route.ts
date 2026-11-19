import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/services/supabase-helper';
import { dataRepository } from '@/lib/data/repository';
import type { Outlet, Order, Table } from '@/lib/types';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    let outlets: Outlet[] = [];
    let tables: Table[] = [];
    let orders: Order[] = [];

    if (supabase) {
      const [outRes, tblRes, ordRes] = await Promise.all([
        supabase.from('outlets').select('*'),
        supabase.from('tables').select('*'),
        supabase.from('orders').select('*'),
      ]);

      outlets = outRes.data?.length ? outRes.data : dataRepository.getOutlets();
      tables = tblRes.data?.length ? tblRes.data : dataRepository.getTables();
      orders = ordRes.data?.length ? ordRes.data : dataRepository.getOrders();
    } else {
      outlets = dataRepository.getOutlets();
      tables = dataRepository.getTables();
      orders = dataRepository.getOrders();
    }

    outlets.sort((a, b) => (a.type === 'restaurant' ? -1 : 1));

    // Calculate real operational metrics dynamically
    const enrichedOutlets = outlets.map((outlet) => {
      // Ensure palace branding
      let displayName = outlet.name;
      let displayImage = outlet.image_url;
      let roomServiceEnabled = outlet.room_service_enabled ?? (outlet.type === 'restaurant');
      if (outlet.type === 'restaurant') {
        displayName = 'Rajmahal Royal Dining';
        displayImage = '/images/dining/rajasthani-restaurant.png';
        roomServiceEnabled = true;
      } else if (outlet.type === 'cafe') {
        displayName = 'The Palace Courtyard Café & Lounge';
        displayImage = '/images/dining/cafe-lounge.png';
        roomServiceEnabled = false;
      }

      const outletTables = tables.filter(
        (t) =>
          t.outlet_id === outlet.id ||
          (outlet.type === 'restaurant' ? t.table_number.startsWith('T-') : t.table_number.startsWith('C-'))
      );
      const outletOrders = orders.filter(
        (o) =>
          o.outlet_id === outlet.id ||
          (outlet.type === 'restaurant' && (o.outlet_id?.includes('1') || !o.outlet_id)) ||
          (outlet.type === 'cafe' && o.outlet_id?.includes('2'))
      );

      // Active KOTs (orders currently in kitchen flow)
      const activeOrders = outletOrders.filter((o) =>
        ['new', 'accepted', 'preparing', 'ready'].includes(o.status)
      );
      const preparingCount = outletOrders.filter((o) => o.status === 'preparing').length;
      const readyCount = outletOrders.filter((o) => o.status === 'ready').length;
      const newCount = outletOrders.filter((o) => o.status === 'new').length;

      // Occupied tables: tables associated with active dine-in orders
      const occupiedTableIds = new Set(
        outletOrders
          .filter((o) => o.table_id && ['new', 'accepted', 'preparing', 'ready', 'served'].includes(o.status))
          .map((o) => o.table_id)
      );
      const occupiedCount = Math.min(occupiedTableIds.size, outletTables.length);
      const availableCount = Math.max(0, outletTables.length - occupiedCount);

      // Today's Sales: Sum of today's non-cancelled orders
      const today = new Date().toISOString().slice(0, 10);
      const todayOrders = outletOrders.filter(
        (o) => o.status !== 'cancelled' && (o.created_at || '').startsWith(today)
      );
      const todaySalesMinor = todayOrders.reduce(
        (sum, o) => sum + (o.total_minor || o.total_amount_minor || 0),
        0
      );
      const aovMinor = todayOrders.length > 0 ? Math.round(todaySalesMinor / todayOrders.length) : 0;

      return {
        ...outlet,
        name: displayName,
        image_url: displayImage,
        room_service_enabled: roomServiceEnabled,
        operating_days: outlet.operating_days || {
          Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: true,
          Friday: true,
          Saturday: true,
          Sunday: true,
        },
        metrics: {
          totalTables: outletTables.length,
          occupiedTables: occupiedCount,
          availableTables: availableCount,
          reservedTables: 0,
          activeKOT: activeOrders.length,
          preparingKOT: preparingCount,
          readyKOT: readyCount,
          newKOT: newCount,
          todaySalesMinor,
          todaySalesFormatted: `₹${(todaySalesMinor / 100).toLocaleString('en-IN')}`,
          aovMinor,
          aovFormatted: `₹${(aovMinor / 100).toLocaleString('en-IN')}`,
          orderCountToday: todayOrders.length,
        },
      };
    });

    return NextResponse.json({
      success: true,
      outlets: enrichedOutlets,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      operating_hours,
      dine_in_enabled,
      pickup_enabled,
      delivery_enabled,
      room_service_enabled,
      image_url,
    } = body;

    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: 'Outlet name and type are required' },
        { status: 400 }
      );
    }

    const newOutlet = dataRepository.addOutlet({
      name,
      type,
      operating_hours: operating_hours || { all: { open: '08:00', close: '22:00' } },
      dine_in_enabled: dine_in_enabled ?? true,
      pickup_enabled: pickup_enabled ?? true,
      delivery_enabled: delivery_enabled ?? true,
      room_service_enabled: room_service_enabled ?? false,
      image_url: image_url || (type === 'cafe' ? '/images/dining/cafe-lounge.png' : '/images/dining/rajasthani-restaurant.png'),
      pickup_lead_minutes: 20,
      delivery_lead_minutes: 40,
      delivery_fee_minor: 4000,
      min_delivery_order_minor: 20000,
      delivery_estimate: '30-45 mins',
      is_paused: false,
      is_active: true,
      tax_rate_bps: 500,
      service_charge_bps: 250,
      property_id: dataRepository.getProperty().id,
    });

    // Also persist to Supabase if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('outlets').insert({
        id: newOutlet.id,
        property_id: newOutlet.property_id,
        name: newOutlet.name,
        type: newOutlet.type,
        operating_hours: newOutlet.operating_hours,
        dine_in_enabled: newOutlet.dine_in_enabled,
        pickup_enabled: newOutlet.pickup_enabled,
        delivery_enabled: newOutlet.delivery_enabled,
        is_paused: newOutlet.is_paused,
      });

      // Audit event
      await supabase.from('audit_events').insert({
        actor_name: 'Administrator',
        actor_role: 'Administrator',
        action_type: 'PRICE_CHANGE',
        entity_type: 'Outlet',
        entity_id: newOutlet.id,
        details: `Created new palace outlet: ${newOutlet.name} (${newOutlet.type})`,
        ip_address: '127.0.0.1',
      });
    }

    return NextResponse.json({ success: true, outlet: newOutlet }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, patch } = body;

    if (!id || !patch) {
      return NextResponse.json(
        { success: false, error: 'Outlet ID and patch data are required' },
        { status: 400 }
      );
    }

    const updated = dataRepository.updateOutlet(id, patch);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Outlet not found' }, { status: 404 });
    }

    // Persist to Supabase if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const dbPatch: Record<string, any> = {};
        const allowedColumns = [
          'name',
          'type',
          'operating_hours',
          'dine_in_enabled',
          'pickup_enabled',
          'delivery_enabled',
          'pickup_lead_minutes',
          'delivery_lead_minutes',
          'delivery_fee_minor',
          'min_delivery_order_minor',
          'delivery_estimate',
          'is_paused',
          'tax_rate_bps',
          'service_charge_bps',
        ];

        for (const col of allowedColumns) {
          if (col in patch) {
            dbPatch[col] = (patch as any)[col];
          }
        }
        dbPatch.updated_at = new Date().toISOString();

        await supabase.from('outlets').update(dbPatch).eq('id', id);

        // Log genuine operational audit event
        let detailDesc = `Updated outlet ${updated.name} settings`;
        if ('is_paused' in patch || 'is_active' in patch) {
          detailDesc = `${updated.name} marked ${patch.is_paused ? 'closed' : 'open'}`;
        } else if (
          'dine_in_enabled' in patch ||
          'room_service_enabled' in patch ||
          'delivery_enabled' in patch ||
          'pickup_enabled' in patch
        ) {
          detailDesc = `Channel availability updated for ${updated.name}`;
        } else if ('operating_hours' in patch) {
          detailDesc = `Operating schedule updated for ${updated.name}`;
        } else if ('operating_days' in patch) {
          detailDesc = `Operating days updated for ${updated.name}`;
        }

        await supabase.from('audit_events').insert({
          actor_name: 'Administrator',
          actor_role: 'Administrator',
          action_type: 'PRICE_CHANGE',
          entity_type: 'Outlet',
          entity_id: id,
          details: detailDesc,
          ip_address: '127.0.0.1',
        });
      } catch (dbErr) {
        console.warn('Supabase update warning:', dbErr);
      }
    }

    return NextResponse.json({ success: true, outlet: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Outlet ID is required' }, { status: 400 });
    }
    const deleted = dataRepository.deleteOutlet(id);
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('outlets').delete().eq('id', id);
    }
    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
