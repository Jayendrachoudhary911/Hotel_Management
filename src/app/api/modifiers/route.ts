import { NextResponse } from 'next/server';
import { modifiersService } from '@/lib/services/modifiers-service';

export async function GET() {
  try {
    const modifiers = await modifiersService.getModifiers();
    return NextResponse.json({ success: true, modifiers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const modifier = await modifiersService.createModifier({
      name: body.name,
      description: body.description || '',
      type: body.type || 'add_on',
      image_url: body.image_url || '/images/food/dal-baati.jpg',
      price_minor: body.price_minor || 0,
      is_active: body.is_active ?? true,
      applicable_items_count: body.applicable_items_count || 5,
      applicable_items: body.applicable_items || [],
      options: body.options || [],
    });
    return NextResponse.json({ success: true, modifier }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
