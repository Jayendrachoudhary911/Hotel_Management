import { NextResponse } from 'next/server';
import { promotionsService } from '@/lib/services/promotions-service';

export async function GET() {
  try {
    const promotions = await promotionsService.getPromotions();
    return NextResponse.json({ success: true, promotions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const promo = await promotionsService.createPromotion({
      title: body.title,
      description: body.description,
      badge_text: body.badge_text || 'OFFER',
      status: body.status || 'active',
      discount_type: body.discount_type || 'percentage',
      discount_value: body.discount_value || 10,
      start_date: body.start_date || 'Today',
      end_date: body.end_date || 'End of Month',
      applicable_category: body.applicable_category || 'All Items',
      applicable_items_count: body.applicable_items_count || 10,
      image_url: body.image_url || '/images/food/dal-baati.jpg',
    });
    return NextResponse.json({ success: true, promotion: promo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
