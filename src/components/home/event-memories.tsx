'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function EventMemories() {
  return (
    <section
      className="relative py-14 sm:py-16 lg:py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}
      aria-label="Event Memories"
    >
      {/* ── PROMINENT RAJASTHANI ARCHITECTURAL SKETCHES (FLANKING LEFT & RIGHT) ── */}
      <div className="absolute left-[-40px] sm:left-[-20px] lg:left-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 w-64 sm:w-80 lg:w-[420px] xl:w-[460px] opacity-35">
        <img
          src="/images/heritage-elements/palace-line-art.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="absolute right-[-40px] sm:right-[-20px] lg:right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 w-64 sm:w-80 lg:w-[420px] xl:w-[460px] opacity-35 scale-x-[-1]">
        <img
          src="/images/heritage-elements/palace-line-art.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION HEADER (CLEAN CENTERED WITHOUT SIDE BUTTON) ── */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          {/* Eyebrow with gold flanking lines */}
          <div className="inline-flex items-center justify-center space-x-3 mb-2.5">
            <span className="w-8 sm:w-10 h-[1px] bg-[#d8aa67]/80" />
            <span
              className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase"
              style={{ color: 'var(--antique-gold, #d8aa67)' }}
            >
              Celebrations That Matter
            </span>
            <span className="w-8 sm:w-10 h-[1px] bg-[#d8aa67]/80" />
          </div>

          {/* Main Heading */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2.5 leading-tight"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              color: 'var(--burgundy, #781c1c)',
            }}
          >
            Event Memories
          </h2>

          {/* Description */}
          <p
            className="text-xs sm:text-sm font-normal max-w-xl mx-auto leading-relaxed"
            style={{ color: 'var(--forest, #4f0809)' }}
          >
            A glimpse of royal weddings, cultural evenings and magnificent celebrations at Rajmahal Heritage Hotel.
          </p>
        </div>

        {/* ── EDITORIAL COLLAGE GALLERY (EXACT 7-PHOTO RECREATION) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-3.5 h-auto md:h-[440px] lg:h-[480px]">
          {/* Column 1 (Leftmost): Tall Prominent Photo (Wedding Mandap) */}
          <div className="md:col-span-3 h-72 md:h-full relative rounded-[8px] overflow-hidden shadow-md group border border-[#d8aa67]/40 bg-[#fffaf1]">
            <Image
              src="/images/events/wedding-mandap.jpg"
              alt="Illuminated royal Indian wedding mandap at Rajmahal palace"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Column 2 (Middle-Left & Middle-Right combined 6 cols): 4 Photos with balanced asymmetry */}
          <div className="md:col-span-6 flex flex-col gap-3 sm:gap-3.5 h-full">
            {/* Top Row: Palace Dining (approx 48%) + Folk Dance (approx 52%) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-3.5 flex-1 min-h-[160px] md:min-h-0">
              {/* Photo 02: Luxurious palace dining overlooking lake */}
              <div className="sm:col-span-6 relative rounded-[8px] overflow-hidden shadow-md group border border-[#d8aa67]/40 bg-[#fffaf1] min-h-[160px] md:min-h-0">
                <Image
                  src="/images/events/palace-dining.jpg"
                  alt="Luxurious heritage palace dining setup with lake view"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Photo 04: Rajasthani folk dancer spinning with musicians */}
              <div className="sm:col-span-6 relative rounded-[8px] overflow-hidden shadow-md group border border-[#d8aa67]/40 bg-[#fffaf1] min-h-[160px] md:min-h-0">
                <Image
                  src="/images/events/folk-dance.jpg"
                  alt="Rajasthani folk dancer performing with traditional musicians in palace courtyard"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Bottom Row: Floral Garland Decor (approx 36%) + Grand Banquet Hall (approx 64%) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-3.5 flex-1 min-h-[160px] md:min-h-0">
              {/* Photo 03: Floral Garlands & Brass Hanging Bells */}
              <div className="sm:col-span-4 relative rounded-[8px] overflow-hidden shadow-md group border border-[#d8aa67]/40 bg-[#fffaf1] min-h-[160px] md:min-h-0">
                <Image
                  src="/images/events/floral-decor.jpg"
                  alt="Traditional Indian wedding marigold garlands and brass bells"
                  fill
                  sizes="(max-width: 768px) 100vw, 18vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Photo 05: Grand Banquet Hall with warm amber chandeliers */}
              <div className="sm:col-span-8 relative rounded-[8px] overflow-hidden shadow-md group border border-[#d8aa67]/40 bg-[#fffaf1] min-h-[160px] md:min-h-0">
                <Image
                  src="/images/events/grand-banquet.jpg"
                  alt="Grand royal banquet hall inside Udaipur heritage palace"
                  fill
                  sizes="(max-width: 768px) 100vw, 32vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          {/* Column 3 (Rightmost 3 cols): 2 Stacked Photos */}
          <div className="md:col-span-3 flex flex-col gap-3 sm:gap-3.5 h-full">
            {/* Photo 06 (Top): Lakeside celebration venue at dusk */}
            <div className="flex-1 relative rounded-[8px] overflow-hidden shadow-md group border border-[#d8aa67]/40 bg-[#fffaf1] min-h-[160px] md:min-h-0">
              <Image
                src="/images/events/lakeside-reception.jpg"
                alt="Outdoor lakeside palace wedding reception at twilight in Udaipur"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Photo 07 (Bottom): Royal night courtyard performance */}
            <div className="flex-1 relative rounded-[8px] overflow-hidden shadow-md group border border-[#d8aa67]/40 bg-[#fffaf1] min-h-[160px] md:min-h-0">
              <Image
                src="/images/events/courtyard-night.jpg"
                alt="Royal palace courtyard celebration with folk musicians at night"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* ── VIEW GALLERY BUTTON (PLACED AFTER ALL IMAGES) ── */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <Link
            href="/hotel#party-hall-enquiry"
            className="inline-flex items-center space-x-2 px-8 py-3 rounded-[6px] text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
            style={{
              backgroundColor: 'var(--antique-gold, #d8aa67)',
              color: 'var(--forest-ink, #380506)',
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              fontSize: '16px',
            }}
          >
            <span>View Gallery</span>
            <ArrowRight className="w-4 h-4 ml-1 stroke-[1.8] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── DELICATE ANTIQUE-GOLD BOTTOM DIVIDER WITH CENTER LOTUS MOTIF ── */}
        <div className="relative flex items-center justify-center w-full max-w-5xl mx-auto mt-10 sm:mt-12">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#d8aa67]/60 to-[#d8aa67]" />
          <div className="px-4 shrink-0 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-[#d8aa67] opacity-80"
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
            >
              {/* Symmetrical Rajasthani Lotus Motif matching original artwork */}
              <path d="M16 4C16.8 8.5 19 12 22 14C19 15 17 17.5 16 21C15 17.5 13 15 10 14C13 12 15.2 8.5 16 4Z" />
              <path d="M16 21C17.5 17 21 14 26 14C23 16 22 19 22 23C19.5 22.5 17.5 22 16 21Z" />
              <path d="M16 21C14.5 17 11 14 6 14C9 16 10 19 10 23C12.5 22.5 14.5 22 16 21Z" />
              <circle cx="16" cy="24" r="1.5" />
              <circle cx="10" cy="24.5" r="1" />
              <circle cx="22" cy="24.5" r="1" />
            </svg>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#d8aa67]/60 to-[#d8aa67]" />
        </div>
      </div>
    </section>
  );
}
