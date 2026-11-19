import { NextResponse } from 'next/server';
import { reviewsService } from '@/lib/services/reviews-service';

export async function GET() {
  try {
    const reviews = await reviewsService.getReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const review = await reviewsService.createReview({
      customer_name: body.customer_name,
      customer_source: body.customer_source || 'Dine-in Guest',
      customer_avatar_color: body.customer_avatar_color || '#10B981',
      rating: body.rating || 5,
      comment: body.comment,
      menu_item_name: body.menu_item_name || 'Royal Special',
      menu_item_image: body.menu_item_image || '/images/food/dal-baati.jpg',
      status: body.status || 'published',
    });
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
