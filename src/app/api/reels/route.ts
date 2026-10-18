import { NextResponse } from 'next/server';
import { reelsService } from '@/lib/services/reels-service';

export async function GET() {
  try {
    const reels = await reelsService.getReels();
    return NextResponse.json({ success: true, reels });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { creator_name, handle, title, thumbnail_url, video_url, spot_tag } = body;

    if (!handle || !title) {
      return NextResponse.json(
        { success: false, error: 'handle and title are required' },
        { status: 400 }
      );
    }

    const reel = await reelsService.createReel({
      creator_name: creator_name || handle.replace('@', ''),
      handle,
      title,
      thumbnail_url,
      video_url,
      spot_tag,
    });

    return NextResponse.json({ success: true, reel }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
