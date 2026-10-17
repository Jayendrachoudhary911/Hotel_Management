import { NextResponse } from 'next/server';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const reservations = dataRepository.getReservations();
  return NextResponse.json({ reservations });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomTypeId, checkIn, checkOut, partySize, guestName, guestPhone, guestEmail, notes } = body;

    if (!roomTypeId || !checkIn || !checkOut || !guestName || !guestPhone) {
      return NextResponse.json({ error: 'Missing required reservation fields' }, { status: 400 });
    }

    const reservation = dataRepository.createReservation({
      roomTypeId,
      checkIn,
      checkOut,
      partySize: Number(partySize) || 2,
      guestName,
      guestPhone,
      guestEmail,
      notes,
    });

    return NextResponse.json({ success: true, reservation }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error creating reservation';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
