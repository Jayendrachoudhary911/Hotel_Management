import { NextResponse } from 'next/server';
import { reservationsService } from '@/lib/services/reservations-service';
import type { ReservationStatus } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reservation = await reservationsService.getReservationByReference(id);
    if (!reservation) {
      return NextResponse.json({ success: false, error: 'Reservation not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, reservation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }

    const updated = await reservationsService.updateReservationStatus(id, status as ReservationStatus);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, reservation: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
