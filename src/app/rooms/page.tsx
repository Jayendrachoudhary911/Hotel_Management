import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { dataRepository } from '@/lib/data/repository';
import { formatMoney } from '@/lib/utils/money';
import { IconKingBed, IconGuests } from '@/components/ui/heritage-art';
import { LataJaaliRunner, HeritageDivider } from '@/components/ui/heritage-ornaments';
import { ArrowRight, Calendar, Users, Search } from 'lucide-react';

interface RoomsPageProps {
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}

export const metadata = {
  title: 'Our Heritage Rooms | Rajmahal Heritage Hotel',
  description:
    'Six unique Rajasthani experiences, each with its own story, architecture and charm. Haveli Suite, Jharokha Room, Meenakari Room, Thar Heritage Room, Royal Courtyard Room, Sheesh Mahal Room.',
};

import { roomsService } from '@/lib/services/rooms-service';

async function RoomsContent({ searchParams }: RoomsPageProps) {
  const resolvedParams = await searchParams;
  const checkIn = resolvedParams.checkIn || '2026-10-18';
  const checkOut = resolvedParams.checkOut || '2026-10-22';
  const guests = parseInt(resolvedParams.guests || '2', 10);

  const allRooms = await roomsService.getRoomTypes();

  return (
    <div className="relative bg-[#F5F1E8] min-h-screen py-12 sm:py-16 text-[#241F1A] overflow-hidden">
      {/* ── BESPOKE VERTICAL LATA JAALI RUNNERS (Flanking Left & Right) ── */}
      <LataJaaliRunner side="left" opacity={0.15} color="#B08D57" className="hidden lg:block" />
      <LataJaaliRunner side="right" opacity={0.15} color="#B08D57" className="hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching image */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="font-heritage text-3xl sm:text-4xl lg:text-5xl font-bold text-[#670E10] mb-3">
            Our Heritage Rooms
          </h1>
          <p className="text-sm sm:text-base text-[#6E6356] font-light">
            Six unique Rajasthani experiences, each with its own story, architecture and charm.
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="bg-white rounded-xl border border-[#D4CBBB]/70 shadow-sm p-4 mb-12 max-w-4xl mx-auto">
          <form method="GET" action="/rooms" className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
            <div className="flex items-center space-x-2.5 px-3 py-2 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/60">
              <Calendar className="w-4 h-4 text-[#8F7245]" />
              <div className="w-full text-left">
                <span className="block text-[10px] uppercase font-bold text-[#7A6F62]">Check In</span>
                <input
                  type="date"
                  name="checkIn"
                  defaultValue={checkIn}
                  className="w-full bg-transparent text-xs text-[#670E10] font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2.5 px-3 py-2 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/60">
              <Calendar className="w-4 h-4 text-[#8F7245]" />
              <div className="w-full text-left">
                <span className="block text-[10px] uppercase font-bold text-[#7A6F62]">Check Out</span>
                <input
                  type="date"
                  name="checkOut"
                  defaultValue={checkOut}
                  className="w-full bg-transparent text-xs text-[#670E10] font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2.5 px-3 py-2 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/60">
              <Users className="w-4 h-4 text-[#8F7245]" />
              <div className="w-full text-left">
                <span className="block text-[10px] uppercase font-bold text-[#7A6F62]">Guests</span>
                <select
                  name="guests"
                  defaultValue={guests}
                  className="w-full bg-transparent text-xs text-[#670E10] font-semibold focus:outline-none"
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] font-medium text-xs tracking-wide transition-all shadow flex items-center justify-center space-x-1.5"
              >
                <Search className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>Search Rooms</span>
              </button>
            </div>
          </form>
        </div>

        {/* 6 Room Cards (3x2 Grid) matching image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {allRooms.map((room) => {
            const roomImage = room.photos?.[0] || '/images/rooms/haveli-suite.jpg';
            return (
              <div
                key={room.id}
                className="bg-white rounded-xl border border-[#D4CBBB]/70 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#B08D57] transition-all flex flex-col group"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={roomImage}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#670E10]/92 backdrop-blur-xs text-[#FAF8F3] px-3 py-1 rounded-md text-xs font-semibold border border-[#B08D57]/40">
                    {formatMoney(room.base_rate_minor)} <span className="text-[10px] text-[#C9A96E] font-normal">/ night</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heritage text-xl font-bold text-[#670E10] mb-2 group-hover:text-[#B08D57] transition-colors">
                      {room.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-xs text-[#7A6F62] mb-4">
                      <span className="flex items-center">
                        <IconKingBed className="w-4 h-4 text-[#8F7245] mr-1.5" />
                        <span>King Bed</span>
                      </span>
                      <span className="flex items-center">
                        <IconGuests className="w-4 h-4 text-[#8F7245] mr-1.5" />
                        <span>{room.capacity} Guests</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                    <Link
                      href={`/rooms/${room.id}`}
                      className="inline-flex items-center text-xs font-semibold text-[#670E10] hover:text-[#C59B63] transition-colors group/link"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href={`/book?roomTypeId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                      className="px-4 py-1.5 rounded bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] text-xs font-medium transition-all shadow-xs"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Symmetrical Jaali Divider */}
        <HeritageDivider className="opacity-35 mt-12 mb-8" color="#B08D57" />

        {/* Bottom Recommendation Dark Banner matching image */}
        <div className="bg-[#4A0A0C] text-[#FAF8F3] rounded-xl p-6 sm:p-8 border border-[#B08D57]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-left max-w-xl">
            <h3 className="font-heritage text-xl sm:text-2xl font-bold text-[#FAF8F3] mb-2">
              Not sure which room to choose?
            </h3>
            <p className="text-sm text-[#D8D2C4] font-light">
              Get personalized recommendations from our team to find the perfect suite for your stay.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/#contact"
              className="px-6 py-3 rounded-md bg-[#380608] border border-[#B08D57]/60 hover:bg-[#C59B63] hover:text-[#4A0A0C] text-[#FAF8F3] font-medium text-sm tracking-wide transition-all flex items-center space-x-2"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomsPage(props: RoomsPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">Loading chambers...</div>}>
      <RoomsContent {...props} />
    </Suspense>
  );
}
