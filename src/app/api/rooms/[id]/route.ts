import { NextResponse } from 'next/server';
import { roomsService } from '@/lib/services/rooms-service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { housekeeping_state } = body;

    if (!housekeeping_state) {
      return NextResponse.json(
        { success: false, error: 'housekeeping_state is required' },
        { status: 400 }
      );
    }

    const updated = await roomsService.updateRoomHousekeeping(id, housekeeping_state);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, room: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
