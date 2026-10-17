import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { dataRepository } from '@/lib/data/repository';
import { formatMoney } from '@/lib/utils/money';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BedDouble, Check, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Clock } from 'lucide-react';

interface RoomDetailPageProps {
  params: Promise<{ roomTypeId: string }>;
}

export function generateStaticParams() {
  const rooms = dataRepository.getRoomTypes();
  return rooms.map((r) => ({ roomTypeId: r.id }));
}

export async function generateMetadata({ params }: RoomDetailPageProps) {
  const resolved = await params;
  const room = dataRepository.getRoomTypeById(resolved.roomTypeId);
  if (!room) return { title: 'Chamber Not Found' };

  return {
    title: `${room.name} | Aura Grand Palace Udaipur`,
    description: room.description,
  };
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const resolved = await params;
  const room = dataRepository.getRoomTypeById(resolved.roomTypeId);

  if (!room) {
    notFound();
  }

  const allRooms = dataRepository.getRoomTypes();
  const otherRooms = allRooms.filter((r) => r.id !== room.id).slice(0, 3);

  return (
    <div className="bg-[#F5F1E8] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/rooms"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#670E10] hover:text-[#8A1518] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to All Palatial Chambers
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Left: Gallery & Story */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative h-96 sm:h-[480px] rounded-3xl overflow-hidden border-2 border-[#B08D57]/40 shadow-xl">
              <Image
                src={room.photos[0] || '/images/hero_resort.jpg'}
                alt={room.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="px-4 py-2 rounded-xl bg-[#670E10] text-white font-bold text-sm shadow-md">
                  {formatMoney(room.base_rate_minor)} <span className="font-normal text-xs opacity-80">/ night</span>
                </span>
              </div>
            </div>

            <div className="heritage-card bg-white p-6 sm:p-8 rounded-2xl border border-[#D4CBBB] shadow-sm">
              <Badge variant="maroon" className="mb-3">Palace Architecture & Heritage</Badge>
              <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#241F1A] mb-4">
                The Heritage Story of {room.name}
              </h2>
              <p className="text-[#6B6155] text-sm leading-relaxed mb-6">
                {room.description} Handcrafted by master artisans from Mewar, this chamber preserves authentic stone lattice work (jali), antique brass fittings, and pure cotton linens woven in local villages.
              </p>

              <h3 className="font-heritage text-lg font-bold text-[#241F1A] mb-3">
                Chamber Inclusions & Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center text-xs text-[#3D352C] font-medium">
                    <Check className="w-4 h-4 text-[#670E10] mr-2 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-[#D4CBBB] flex flex-wrap items-center gap-6 text-xs text-[#8F7245] font-semibold">
                <span className="flex items-center">
                  <ShieldCheck className="w-4 h-4 text-[#670E10] mr-1.5" /> Best Rate Guaranteed
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 text-[#670E10] mr-1.5" /> Check-in: 2 PM | Check-out: 11 AM
                </span>
                <span className="flex items-center">
                  <Sparkles className="w-4 h-4 text-[#670E10] mr-1.5" /> Evening High-Tea Included
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Reserve Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 heritage-card bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#B08D57]/40 shadow-lg space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#8F7245]">Instant Direct Booking</span>
                <h1 className="font-heritage text-3xl font-bold text-[#241F1A] mt-1 mb-2">
                  {room.name}
                </h1>
                <div className="flex items-center space-x-3 text-xs text-[#6B6155]">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-[#670E10]" /> Up to {room.capacity} Guests
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <BedDouble className="w-4 h-4 mr-1 text-[#670E10]" /> King Size Bed
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#D4CBBB] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B6155]">Daily Tariff:</span>
                  <span className="font-bold text-[#241F1A]">{formatMoney(room.base_rate_minor)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6155]">Taxes & Fees:</span>
                  <span className="font-bold text-[#2D6A4F]">Calculated at Checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6155]">Cancellation Policy:</span>
                  <span className="font-semibold text-[#241F1A]">Free up to 48h before arrival</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href={`/book?roomTypeId=${room.id}`} className="block">
                  <Button size="lg" className="w-full shadow-md flex items-center justify-center space-x-2">
                    <span>Reserve This Chamber Now</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                <p className="text-[11px] text-[#6B6155] text-center">
                  Instant confirmation • No booking fees • Pay at check-in available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Other Chambers to Explore */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="font-heritage text-2xl font-bold text-[#241F1A]">Other Royal Chambers</h3>
            <p className="text-xs text-[#6B6155] mt-1">Discover other distinctive architectural styles in the palace.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherRooms.map((r) => (
              <div
                key={r.id}
                className="heritage-card bg-white rounded-2xl overflow-hidden border border-[#D4CBBB] shadow-sm hover:border-[#670E10] transition-all"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={r.photos[0] || '/images/hero_resort.jpg'}
                    alt={r.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded bg-[#670E10] text-white text-[11px] font-bold">
                      {formatMoney(r.base_rate_minor)}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-heritage text-lg font-bold text-[#241F1A] mb-1">{r.name}</h4>
                  <p className="text-xs text-[#6B6155] line-clamp-2 mb-4">{r.description}</p>
                  <Link href={`/rooms/${r.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Chamber Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
