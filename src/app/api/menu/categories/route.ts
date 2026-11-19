import { NextResponse } from 'next/server';
import { menuService } from '@/lib/services/menu-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, outlet_id, image_url } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const category = await menuService.addCategory({
      name: name.trim(),
      outlet_id,
      image_url,
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category id is required' }, { status: 400 });
    }

    const deleted = await menuService.deleteCategory(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
