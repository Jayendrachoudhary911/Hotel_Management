import { NextResponse } from 'next/server';
import { hallService } from '@/lib/services/hall-service';

export async function GET() {
  try {
    const [hall, leads] = await Promise.all([
      hallService.getHall(),
      hallService.getEventLeads(),
    ]);
    return NextResponse.json({ success: true, hall, leads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contactName, contactPhone, contactEmail, eventType, expectedGuests, seatingLayout, setupNeeds, notes } = body;

    if (!contactName || !contactPhone) {
      return NextResponse.json({ success: false, error: 'Name and contact phone are required' }, { status: 400 });
    }

    const lead = await hallService.createEventLead({
      contactName,
      contactPhone,
      contactEmail,
      eventType: eventType || 'General Event',
      expectedGuests: Number(expectedGuests) || 50,
      seatingLayout,
      setupNeeds,
      notes,
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
