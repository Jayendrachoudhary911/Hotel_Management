import { NextResponse } from 'next/server';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const leads = dataRepository.getEventLeads();
  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contactName, contactPhone, contactEmail, eventType, expectedGuests, seatingLayout, setupNeeds, notes } = body;

    if (!contactName || !contactPhone) {
      return NextResponse.json({ error: 'Name and contact phone are required' }, { status: 400 });
    }

    const lead = dataRepository.createEventLead({
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
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
