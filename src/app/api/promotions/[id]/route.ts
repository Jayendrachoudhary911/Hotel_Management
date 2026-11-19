import { NextResponse } from 'next/server';
import { promotionsService } from '@/lib/services/promotions-service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await promotionsService.updatePromotion(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Promotion not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, promotion: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await promotionsService.deletePromotion(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
