'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RoomType } from '@/lib/types';
import { formatMoney } from '@/lib/utils/money';
import {
  IconKingBed,
  IconGuests,
  IconCityView,
  IconFreeWiFi,
  IconAC,
  IconSmartTV,
  IconLuxuryBath,
  IconMiniBar,
  IconInRoomDining,
  IconWorkDesk,
  IconRoomService24,
  RajasthaniCornerMandala,
} from '@/components/ui/heritage-art';
import { Calendar, Users, ChevronRight, Check } from 'lucide-react';

interface RoomDetailClientProps {
  room: RoomType;
  allRooms: RoomType[];
}

export function RoomDetailClient({ room, allRooms }: RoomDetailClientProps) {
  const images: string[] = room.photos && room.photos.length > 0 ? room.photos : ['/images/rooms/haveli-suite.jpg'];
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'gallery' | 'location'>('overview');

  const [checkIn, setCheckIn] = useState('2024-08-12');
  const [checkOut, setCheckOut] = useState('2024-08-16');
  const [guests, setGuests] = useState('2 Adults');

  const amenitiesList = [
    { label: 'Air Conditioning', icon: IconAC },
    { label: 'Smart TV', icon: IconSmartTV },
    { label: 'Luxury Bathroom', icon: IconLuxuryBath },
    { label: 'Complimentary WiFi', icon: IconFreeWiFi },
    { label: 'Mini Bar', icon: IconMiniBar },
    { label: 'In-room Dining', icon: IconInRoomDining },
    { label: 'Work Desk', icon: IconWorkDesk },
    { label: '24-hour Room Service', icon: IconRoomService24 },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12 text-[#1E1A17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb matching image */}
        <nav className="flex items-center space-x-2 text-xs text-[#7A6F62] mb-6">
          <Link href="/" className="hover:text-[#13251E] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B08D57]" />
          <Link href="/rooms" className="hover:text-[#13251E] transition-colors">
            Rooms
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B08D57]" />
          <span className="text-[#13251E] font-medium">{room.name}</span>
        </nav>

        {/* Top Header & Quick Specs Row matching image */}
        <div className="mb-8">
          <h1 className="font-heritage text-3xl sm:text-4xl lg:text-5xl font-bold text-[#13251E] mb-2">
            {room.name}
          </h1>
          <p className="text-sm sm:text-base text-[#6E6356] font-light max-w-2xl mb-4">
            A regal escape inspired by traditional Rajasthani havelis, with handcrafted details and modern comfort.
          </p>

          {/* Quick Pill Badges with Icons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-[#4A4237]">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-[#E5DFD5] shadow-2xs">
              <IconKingBed className="w-4 h-4 text-[#8F7245] mr-1.5" />
              <span>King Bed</span>
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-[#E5DFD5] shadow-2xs">
              <IconGuests className="w-4 h-4 text-[#8F7245] mr-1.5" />
              <span>{room.capacity} Guests</span>
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-[#E5DFD5] shadow-2xs">
              <IconCityView className="w-4 h-4 text-[#8F7245] mr-1.5" />
              <span>City View</span>
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-[#E5DFD5] shadow-2xs">
              <IconFreeWiFi className="w-4 h-4 text-[#8F7245] mr-1.5" />
              <span>Free WiFi</span>
            </span>
          </div>
        </div>

        {/* Main Grid: Gallery & Details on Left, Booking Sticky on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Main Image */}
            <div className="relative h-[340px] sm:h-[460px] w-full rounded-2xl overflow-hidden border border-[#E5DFD5] shadow-md bg-white">
              <Image
                src={selectedImage}
                alt={room.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#B08D57] ring-2 ring-[#B08D57]/30 scale-102'
                      : 'border-[#E5DFD5] opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Interactive Tabs: Overview, Amenities, Gallery, Location */}
            <div className="border-b border-[#E5DFD5] flex space-x-6 text-sm font-medium pt-4">
              {(['overview', 'amenities', 'gallery', 'location'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 capitalize transition-all relative ${
                    activeTab === tab
                      ? 'text-[#13251E] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#13251E]'
                      : 'text-[#7A6F62] hover:text-[#13251E]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content with decorative jharokha watermark */}
            <div className="relative bg-white rounded-xl border border-[#E5DFD5] p-6 sm:p-8 shadow-xs overflow-hidden">
              {/* Corner Mandala Watermark in background */}
              <div className="absolute -top-6 -right-6 pointer-events-none opacity-20">
                <RajasthaniCornerMandala className="w-40 h-40 text-[#B08D57]" />
              </div>

              {activeTab === 'overview' && (
                <div className="relative z-10 space-y-6 text-left">
                  <p className="text-sm sm:text-base text-[#4A4237] leading-relaxed font-light">
                    Step into a world of royal elegance. The {room.name} captures the timeless beauty of Rajasthani architecture with carved arches, traditional motifs and contemporary luxury for a comfortable stay.
                  </p>
                  <p className="text-xs sm:text-sm text-[#6E6356] leading-relaxed font-light">
                    {room.description}
                  </p>

                  <div className="pt-4 border-t border-[#F2ECE1]">
                    <h4 className="font-heritage text-base font-bold text-[#13251E] mb-4">
                      Chamber Highlights & Features
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {amenitiesList.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div key={idx} className="flex items-center space-x-3 text-xs text-[#3D352C]">
                            <div className="w-7 h-7 rounded-md bg-[#FAF8F3] border border-[#E5DFD5] flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-[#8F7245]" />
                            </div>
                            <span className="font-medium">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'amenities' && (
                <div className="relative z-10 space-y-4">
                  <h4 className="font-heritage text-base font-bold text-[#13251E]">
                    All Included Amenities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {amenitiesList.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex items-center space-x-3 text-xs text-[#3D352C]">
                          <div className="w-8 h-8 rounded-md bg-[#FAF8F3] border border-[#E5DFD5] flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-[#8F7245]" />
                          </div>
                          <span>{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img: string, idx: number) => (
                    <div key={idx} className="relative h-28 rounded-lg overflow-hidden border border-[#E5DFD5]">
                      <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'location' && (
                <div className="relative z-10 text-xs text-[#4A4237] leading-relaxed">
                  <h4 className="font-heritage text-base font-bold text-[#13251E] mb-2">
                    Prime Lake Palace Road, Udaipur
                  </h4>
                  <p>
                    Positioned overlooking Lake Pichola and the City Palace of Udaipur. Complimentary royal heritage transfers are available upon request.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Booking Card matching image */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white rounded-xl border border-[#E5DFD5] p-6 shadow-lg text-left">
              <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-[#F2ECE1]">
                <div>
                  <span className="font-heritage text-3xl font-bold text-[#13251E]">
                    {formatMoney(room.base_rate_minor)}
                  </span>
                  <span className="text-xs text-[#7A6F62] ml-1.5 font-normal">/ night</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#2D6A4F] bg-[#D8F3DC] px-2 py-0.5 rounded">
                  Available
                </span>
              </div>

              {/* Date pickers */}
              <div className="space-y-4 mb-6">
                <div className="p-3 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/60">
                  <span className="block text-[11px] text-[#7A6F62] font-semibold mb-1">
                    Check In
                  </span>
                  <div className="flex items-center justify-between">
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="bg-transparent text-sm text-[#13251E] font-medium focus:outline-none w-full"
                    />
                    <Calendar className="w-4 h-4 text-[#8F7245]" />
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/60">
                  <span className="block text-[11px] text-[#7A6F62] font-semibold mb-1">
                    Check Out
                  </span>
                  <div className="flex items-center justify-between">
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="bg-transparent text-sm text-[#13251E] font-medium focus:outline-none w-full"
                    />
                    <Calendar className="w-4 h-4 text-[#8F7245]" />
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/60">
                  <span className="block text-[11px] text-[#7A6F62] font-semibold mb-1">
                    Guests
                  </span>
                  <div className="flex items-center justify-between">
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="bg-transparent text-sm text-[#13251E] font-medium focus:outline-none w-full"
                    >
                      <option value="1 Adult">1 Adult</option>
                      <option value="2 Adults">2 Adults</option>
                      <option value="3 Adults">3 Adults</option>
                      <option value="4 Adults">4 Adults</option>
                    </select>
                    <Users className="w-4 h-4 text-[#8F7245]" />
                  </div>
                </div>
              </div>

              {/* Action Buttons matching image: Book Now (dark) & Enquire Now (outline) */}
              <div className="space-y-3">
                <Link
                  href={`/book?roomTypeId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`}
                  className="w-full py-3.5 px-4 rounded-lg bg-[#13251E] hover:bg-[#1C382D] text-[#FAF8F3] font-medium text-sm tracking-wide transition-all shadow-md block text-center"
                >
                  Book Now
                </Link>
                <Link
                  href="/#contact"
                  className="w-full py-3 px-4 rounded-lg border border-[#B08D57]/70 bg-transparent hover:bg-[#FAF8F3] text-[#13251E] font-medium text-sm tracking-wide transition-all block text-center"
                >
                  Enquire Now
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-[#F2ECE1] text-[11px] text-[#7A6F62] space-y-1">
                <p className="flex items-center">
                  <Check className="w-3.5 h-3.5 text-[#2D6A4F] mr-1.5" /> Free cancellation up to 48 hours
                </p>
                <p className="flex items-center">
                  <Check className="w-3.5 h-3.5 text-[#2D6A4F] mr-1.5" /> Royal breakfast buffet included
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
