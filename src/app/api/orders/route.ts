import { NextResponse } from 'next/server';
import { ordersService } from '@/lib/services/orders-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const outletId = searchParams.get('outletId') || undefined;
    const orders = await ordersService.getOrders(outletId);
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      outlet_id,
      table_id,
      channel,
      fulfilment_mode,
      pickup_name,
      pickup_phone,
      delivery_name,
      delivery_phone,
      delivery_address,
      delivery_notes,
      delivery_fee_minor,
      subtotal_minor,
      tax_minor,
      service_charge_minor,
      discount_minor,
      total_minor,
      order_lines,
    } = body;

    if (!outlet_id || !channel || !fulfilment_mode || !order_lines || order_lines.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required order fields or order lines' },
        { status: 400 }
      );
    }

    const order = await ordersService.createOrder({
      outlet_id,
      table_id: table_id || null,
      channel,
      fulfilment_mode,
      pickup_name: pickup_name || null,
      pickup_phone: pickup_phone || null,
      delivery_name: delivery_name || null,
      delivery_phone: delivery_phone || null,
      delivery_address: delivery_address || null,
      delivery_notes: delivery_notes || null,
      delivery_fee_minor: delivery_fee_minor || 0,
      subtotal_minor: subtotal_minor || 0,
      tax_minor: tax_minor || 0,
      service_charge_minor: service_charge_minor || 0,
      discount_minor: discount_minor || 0,
      total_minor: total_minor || 0,
      order_lines,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
