import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { dataRepository } from '@/lib/data/repository';
import { formatMoney } from '@/lib/utils/money';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BedDouble, Check, Calendar, ArrowRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

interface RoomsPageProps {
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}

export const metadata = {
  title: 'Heritage Suites & Royal Chambers | Aura Grand Palace Udaipur',
  description:
    'Browse our curated collection of Rajasthani palatial suites: Haveli Suite, Jharokha Regal Chamber, Meenakari Suite, and Sheesh Mahal Presidential Villa.',
};

async function RoomsContent({ searchParams }: RoomsPageProps) {
  const resolvedParams = await searchParams;
  const checkIn = resolvedParams.checkIn || '2026-10-18';
  const checkOut = resolvedParams.checkOut || '2026-10-20';
  const guests = parseInt(resolvedParams.guests || '2', 10);

  const availability = dataRepository.searchAvailability(checkIn, checkOut, guests);
  const allRooms = dataRepository.getRoomTypes();

  // If search was performed, use availability results; else show all active rooms
  const roomsToShow = availability.length > 0 ? availability.map((a) => a.roomType) : allRooms;

  return (
    <div className="bg-[#F5F1E8] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="maroon" className="mb-3">Palace Accommodations</Badge>
          <h1 className="font-heritage text-4xl sm:text-5xl font-bold text-[#241F1A] tracking-tight">
            Heritage Suites & Royal Chambers
          </h1>
          <div className="w-20 h-0.5 bg-[#B08D57] mx-auto mt-4 mb-3" />
          <p className="text-[#6B6155] text-sm sm:text-base">
            Each royal chamber at Aura Grand is architecturally unique — adorned with hand-carved sandstone jharokhas, antique Mewar woodwork, and sweeping vistas over Lake Pichola.
          </p>
        </div>

        {/* Date Search Filter Bar */}
        <div className="bg-[#FAF8F3] p-5 sm:p-6 rounded-2xl border border-[#D4CBBB] shadow-md mb-12">
          <form method="GET" action="/rooms" className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="flex items-center text-xs font-bold uppercase tracking-wider text-[#8F7245] mb-2">
                <Calendar className="w-3.5 h-3.5 mr-1 text-[#670E10]" /> Check-in Date
              </label>
              <input
                type="date"
                name="checkIn"
                defaultValue={checkIn}
                className="w-full bg-white border border-[#D4CBBB] rounded-xl px-4 py-2.5 text-sm text-[#241F1A] font-medium focus:outline-none focus:border-[#670E10]"
              />
            </div>

            <div>
              <label className="flex items-center text-xs font-bold uppercase tracking-wider text-[#8F7245] mb-2">
                <Calendar className="w-3.5 h-3.5 mr-1 text-[#670E10]" /> Check-out Date
              </label>
              <input
                type="date"
                name="checkOut"
                defaultValue={checkOut}
                className="w-full bg-white border border-[#D4CBBB] rounded-xl px-4 py-2.5 text-sm text-[#241F1A] font-medium focus:outline-none focus:border-[#670E10]"
              />
            </div>

            <div>
              <label className="flex items-center text-xs font-bold uppercase tracking-wider text-[#8F7245] mb-2">
                <Users className="w-3.5 h-3.5 mr-1 text-[#670E10]" /> Number of Guests
              </label>
              <select
                name="guests"
                defaultValue={guests}
                className="w-full bg-white border border-[#D4CBBB] rounded-xl px-4 py-2.5 text-sm text-[#241F1A] font-medium focus:outline-none focus:border-[#670E10]"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>

            <div>
              <Button type="submit" className="w-full py-2.5 shadow-md">
                Update Dates
              </Button>
            </div>
          </form>
        </div>

        {/* Rooms Listing (WEB-01, WEB-04) */}
        <div className="space-y-8">
          {roomsToShow.map((room) => {
            const availResult = availability.find((a) => a.roomType.id === room.id);
            const nights = availResult ? availResult.nightCount : 2;
            const totalPrice = availResult ? availResult.totalPrice : room.base_rate_minor * nights;
            const availableCount = availResult ? availResult.availableCount : room.total_rooms;

            return (
              <div
                key={room.id}
                className="heritage-card bg-white rounded-2xl overflow-hidden border border-[#D4CBBB] grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-md hover:border-[#670E10] transition-all duration-300"
              >
                <div className="relative h-72 lg:h-auto lg:col-span-5 overflow-hidden">
                  <Image
                    src={room.photos[0] || '/images/hero_resort.jpg'}
                    alt={room.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-md bg-[#670E10] text-white text-xs font-bold tracking-wide shadow-md">
                      {availableCount} Available
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-4 text-xs text-[#8F7245] font-semibold">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-[#670E10]" /> Capacity: {room.capacity} Guests
                        </span>
                        <span className="flex items-center">
                          <BedDouble className="w-4 h-4 mr-1 text-[#670E10]" /> Royal King Bed
                        </span>
                      </div>

                      <Badge variant="emerald">Instant Royal Confirmation</Badge>
                    </div>

                    <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#241F1A] mb-2">
                      {room.name}
                    </h2>

                    <p className="text-[#6B6155] text-sm mb-6 leading-relaxed">
                      {room.description}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                      {room.amenities.map((amenity, i) => (
                        <div key={i} className="flex items-center text-xs text-[#3D352C] font-medium">
                          <Check className="w-3.5 h-3.5 text-[#670E10] mr-2 shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#D4CBBB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-[#8F7245] font-bold">
                        Tariff for {nights} Night{nights > 1 ? 's' : ''} (Excl. taxes)
                      </span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl sm:text-3xl font-heritage font-bold text-[#670E10]">
                          {formatMoney(totalPrice)}
                        </span>
                        <span className="text-xs text-[#6B6155]">
                          ({formatMoney(room.base_rate_minor)} / night)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Link href={`/rooms/${room.id}`}>
                        <Button variant="outline" size="md">
                          Chamber Details
                        </Button>
                      </Link>
                      <Link
                        href={`/book?roomTypeId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                      >
                        <Button size="md" className="shadow-md flex items-center space-x-1.5">
                          <span>Reserve Suite</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function RoomsPage({ searchParams }: RoomsPageProps) {
  return (
    <Suspense fallback={<div className="bg-[#F5F1E8] min-h-screen p-12 text-center text-[#670E10] font-bold">Loading royal suites...</div>}>
      <RoomsContent searchParams={searchParams} />
    </Suspense>
  );
}
