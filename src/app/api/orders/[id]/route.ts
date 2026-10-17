import { NextResponse } from 'next/server';
import { dataRepository } from '@/lib/data/repository';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolved = await params;
  const order = dataRepository.getOrderByNumber(resolved.id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolved = await params;
    const body = await request.json();
    const { status, cancel_reason } = body;

    const updated = dataRepository.updateOrderStatus(resolved.id, status, cancel_reason);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
