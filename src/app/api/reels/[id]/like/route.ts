import { NextResponse } from 'next/server';
import { reelsService } from '@/lib/services/reels-service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const likes = await reelsService.likeReel(id);
    if (likes === null) {
      return NextResponse.json({ success: false, error: 'Reel not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, likes_count: likes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
