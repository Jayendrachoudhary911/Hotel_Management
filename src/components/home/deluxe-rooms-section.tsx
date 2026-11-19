'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Wifi,
  Wind,
  BellRing,
  Utensils,
  Car,
  Users,
  BedDouble,
  Maximize2,
  X,
  ArrowRight,
} from 'lucide-react';

interface DeluxeRoomItem {
  id: string;
  name: string;
  tag: string;
  shortDesc: string;
  fullDesc: string;
  guests: string;
  bed: string;
  size: string;
  price: string;
  image: string;
}

const DELUXE_ROOMS: DeluxeRoomItem[] = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    name: 'Heritage Deluxe Room',
    tag: 'Popular',
    shortDesc: 'A perfect blend of traditional Rajasthani decor, stone jalis and modern luxury.',
    fullDesc:
      'Immerse yourself in authentic royal heritage. The Heritage Deluxe Room features carved stone jharokhas, handcrafted teakwood furnishings, fine Rajasthani textiles, and modern comforts.',
    guests: '2 Guests',
    bed: '1 King Bed',
    size: '350 sq.ft',
    price: '₹ 6,500',
    image: '/images/rooms/deluxe-garden.jpg',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    name: 'Royal Deluxe Room',
    tag: 'Deluxe',
    shortDesc: 'Spacious deluxe room featuring authentic stone carvings and arched ceilings.',
    fullDesc:
      'Experience royal tranquility in this exquisitely appointed chamber. Designed with warm gold tones, an artisan four-poster king bed, and modern luxury comforts.',
    guests: '2 Guests',
    bed: '1 King Bed',
    size: '380 sq.ft',
    price: '₹ 6,800',
    image: '/images/rooms/jharokha-room.jpg',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000003',
    name: 'Grand Deluxe Room',
    tag: 'Deluxe',
    shortDesc: 'Sun-drenched deluxe room with fine Rajput textiles and artisanal accents.',
    fullDesc:
      'Sunlit and grand, the Grand Deluxe Room captures the romance of Rajputana with handcrafted lanterns, plush king bed, and round-the-clock bespoke hospitality.',
    guests: '2 Guests',
    bed: '1 King Bed',
    size: '360 sq.ft',
    price: '₹ 7,200',
    image: '/images/rooms/lakeview-suite.jpg',
  },
];

const ROOM_FACILITIES = [
  { name: 'Wi-Fi (High-Speed Internet)', icon: Wifi },
  { name: 'Air Conditioning (AC)', icon: Wind },
  { name: '24x7 Room Services Available', icon: BellRing },
  { name: 'In-room Dining', icon: Utensils },
  { name: 'Valet Parking', icon: Car },
];

export function DeluxeRoomsSection() {
  const [selectedRoom, setSelectedRoom] = useState<DeluxeRoomItem | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedRoom) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedRoom]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedRoom(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden" style={{ backgroundColor: '#fffaf1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#dfcdb1]/60">
          <div className="max-w-2xl text-left">
            <span
              className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#d8aa67] block mb-1"
              style={{ letterSpacing: '0.22em' }}
            >
              Our Rooms
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#781c1c] leading-[1.05] mb-2"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              }}
            >
              Stay in Timeless Elegance
            </h2>
            <p className="text-xs sm:text-sm text-[#4f0809]/80 font-normal leading-relaxed">
              Experience a perfect blend of royal charm and modern luxury with our beautifully designed Deluxe Rooms.
            </p>
          </div>
        </div>

        {/* 3 Rectangular Cards in a Single Row (3 Cards Per Line) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 mb-4">
          {DELUXE_ROOMS.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="group flex flex-col justify-between bg-white rounded-2xl overflow-hidden border border-[#dfcdb1] hover:border-[#d8aa67] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer text-left"
            >
              {/* Rectangular Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#4f0809]/90 text-[#d8aa67] border border-[#d8aa67]/60 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                  {room.tag}
                </span>
                <span className="absolute bottom-3 right-3 bg-white/95 text-[#4f0809] text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                  Deluxe Room
                </span>
              </div>

              {/* Rectangular Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    className="text-xl font-bold text-[#781c1c] mb-1.5 group-hover:text-[#d8aa67] transition-colors"
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    }}
                  >
                    {room.name}
                  </h3>

                  <p className="text-xs text-[#4f0809]/75 line-clamp-2 leading-relaxed mb-4">
                    {room.shortDesc}
                  </p>

                  {/* Clean Specs Row */}
                  <div className="flex items-center justify-between text-xs text-[#857866] pt-3 border-t border-[#dfcdb1]/50 mb-4">
                    <span className="flex items-center">
                      <Users className="w-3.5 h-3.5 text-[#d8aa67] mr-1.5" />
                      {room.guests}
                    </span>
                    <span className="flex items-center">
                      <BedDouble className="w-3.5 h-3.5 text-[#d8aa67] mr-1.5" />
                      {room.bed}
                    </span>
                    <span className="flex items-center">
                      <Maximize2 className="w-3.5 h-3.5 text-[#d8aa67] mr-1.5" />
                      {room.size}
                    </span>
                  </div>
                </div>

                {/* Price and Action Buttons */}
                <div className="pt-3 border-t border-[#dfcdb1]/60 flex items-center justify-between">
                  <div>
                    <span
                      className="text-xl font-bold text-[#781c1c]"
                      style={{
                        fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                      }}
                    >
                      {room.price}
                      <span className="text-xs font-normal text-[#857866]"> / night</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoom(room);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#781c1c] border border-[#dfcdb1] hover:border-[#d8aa67] hover:bg-[#fffaf1] transition-all cursor-pointer"
                    >
                      Details
                    </button>
                    <Link
                      href={`/book?roomTypeId=${room.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold text-[#fff8eb] bg-[#4f0809] hover:bg-[#781c1c] transition-all shadow cursor-pointer"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AMENITIES MODAL (OPENS ON CARD CLICK) ── */}
      {selectedRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedRoom(null)}
        >
          <div
            className="relative w-full max-w-xl bg-[#fffaf1] rounded-3xl border border-[#d8aa67]/60 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left text-[#151c1a]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-56 sm:h-64 w-full shrink-0">
              <Image
                src={selectedRoom.image}
                alt={selectedRoom.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-[#4f0809] text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all cursor-pointer shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Badge */}
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8aa67] bg-[#4f0809]/80 px-2.5 py-0.5 rounded-full border border-[#d8aa67]/50 inline-block mb-1">
                  Deluxe Room
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-bold text-[#fff8eb]"
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  }}
                >
                  {selectedRoom.name}
                </h3>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-5">
              {/* Specs */}
              <div className="flex items-center justify-between text-xs sm:text-sm text-[#4f0809] bg-white p-3 rounded-xl border border-[#dfcdb1]/70">
                <span className="flex items-center font-medium">
                  <Users className="w-4 h-4 text-[#d8aa67] mr-1.5" />
                  {selectedRoom.guests}
                </span>
                <span className="text-[#dfcdb1]">•</span>
                <span className="flex items-center font-medium">
                  <BedDouble className="w-4 h-4 text-[#d8aa67] mr-1.5" />
                  {selectedRoom.bed}
                </span>
                <span className="text-[#dfcdb1]">•</span>
                <span className="flex items-center font-medium">
                  <Maximize2 className="w-4 h-4 text-[#d8aa67] mr-1.5" />
                  {selectedRoom.size}
                </span>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs sm:text-sm text-[#4f0809]/90 leading-relaxed font-light">
                  {selectedRoom.fullDesc}
                </p>
              </div>

              {/* Room Facilities (Exact 5 facilities requested by user) */}
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#857866] mb-3">
                  Room Facilities
                </h4>
                <div className="space-y-2">
                  {ROOM_FACILITIES.map((facility, idx) => {
                    const Icon = facility.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-[#dfcdb1]/70 shadow-xs"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#fffaf1] border border-[#d8aa67]/50 flex items-center justify-center text-[#781c1c] shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-[#241F1A]">
                          {facility.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 sm:p-5 bg-white border-t border-[#dfcdb1] flex items-center justify-between shrink-0">
              <div>
                <span className="text-[11px] text-[#857866] block">Tariff</span>
                <span
                  className="text-xl sm:text-2xl font-bold text-[#781c1c]"
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  }}
                >
                  {selectedRoom.price}
                  <span className="text-xs font-normal text-[#857866]"> / night</span>
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#4f0809] hover:bg-[#fffaf1] border border-[#dfcdb1] transition-all cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href={`/book?roomTypeId=${selectedRoom.id}`}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#fff8eb] bg-[#4f0809] hover:bg-[#781c1c] transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    fontSize: '16px',
                  }}
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
