import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { roomsService } from '@/lib/services/rooms-service';
import { RoomDetailClient } from './room-detail-client';

interface RoomDetailPageProps {
  params: Promise<{ roomTypeId: string }>;
}

export async function generateMetadata({ params }: RoomDetailPageProps) {
  const resolved = await params;
  const room = await roomsService.getRoomTypeById(resolved.roomTypeId);
  if (!room) return { title: 'Room Not Found | Rajmahal Heritage Hotel' };

  return {
    title: `${room.name} | Rajmahal Heritage Hotel`,
    description: room.description,
  };
}

async function RoomDetailLoader({ params }: RoomDetailPageProps) {
  const resolved = await params;
  const room = await roomsService.getRoomTypeById(resolved.roomTypeId);

  if (!room) {
    notFound();
  }

  const allRooms = await roomsService.getRoomTypes();
  return <RoomDetailClient room={room} allRooms={allRooms} />;
}

export default function RoomDetailPage(props: RoomDetailPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">Loading chamber details...</div>}>
      <RoomDetailLoader {...props} />
    </Suspense>
  );
}
