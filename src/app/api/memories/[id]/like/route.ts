import { NextResponse } from 'next/server';
import { memoriesService } from '@/lib/services/memories-service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const likes = await memoriesService.likeMemory(id);
    if (likes === null) {
      return NextResponse.json({ success: false, error: 'Memory not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, likes_count: likes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
