import { NextResponse } from 'next/server';
import { menuService } from '@/lib/services/menu-service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.toggleAvailability) {
      const newState = await menuService.toggleItemAvailability(id);
      return NextResponse.json({ success: true, is_available: newState });
    }

    const updated = await menuService.updateMenuItem(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
