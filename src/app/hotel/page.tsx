import { Suspense } from 'react';
import Image from 'next/image';
import { BookingBar } from '@/components/home/booking-bar';
import { DeluxeRoomsSection } from '@/components/home/deluxe-rooms-section';
import { PartyHallSection } from '@/components/home/party-hall-section';
import {
  Sparkles,
  Landmark,
  Armchair,
  Crown,
  Play,
} from 'lucide-react';

export const metadata = {
  title: 'Hotel | Rajmahal Heritage Grand — Deluxe Rooms & Grand Celebration Hall',
  description:
    'Experience a royal stay in the heart of Rajasthan at Rajmahal Heritage Grand. Heritage Deluxe Rooms with Wi-Fi, AC, 24x7 room service, in-room dining, and valet parking. Grand Party Hall for 25-50 guests with customizable décor.',
};

export default function HotelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbf5e9]" />}>
      <div className="flex flex-col w-full text-[#151c1a]" style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}>
        {/* ── 1. HOTEL HERO SECTION (EXACT MOCKUP MATCH) ── */}
        <section className="relative z-20 min-h-[640px] lg:min-h-[720px] flex flex-col justify-between -mt-[82px] sm:-mt-[88px]">
          {/* Background Palace Image with warm overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src="/images/palace-interior.jpg"
              alt="Rajmahal Heritage Grand Palace Suite"
              fill
              priority
              className="object-cover object-center scale-105"
              style={{ filter: 'saturate(1.08) sepia(0.08)' }}
            />
            <div className="hero-warmth pointer-events-none" />
            <div className="hero-shade pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30 pointer-events-none" />
          </div>

          {/* Hero Content Left Aligned */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-36 sm:pt-44 md:pt-48 pb-16 sm:pb-20 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-2xl text-left">
                {/* Hotel Pill */}
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d8aa67]/20 border border-[#d8aa67]/60 text-[#d8aa67] text-xs font-bold tracking-[0.22em] uppercase mb-4 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hotel</span>
                </div>

                {/* Main Heading matching Mockup */}
                <h1
                  className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#fff8eb] mb-5 leading-[0.96] drop-shadow-2xl"
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  }}
                >
                  A Royal Stay in the <br />
                  Heart of Rajasthan
                </h1>

                {/* Subtitle matching Mockup */}
                <p className="text-sm sm:text-base text-[#fff8eb]/90 mb-8 font-normal leading-relaxed max-w-xl drop-shadow">
                  Luxurious rooms and a grand banquet hall crafted for unforgettable experiences in Udaipur.
                </p>

                {/* 3 Heritage Feature Badges (Matching Mockup) */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-[#fff8eb] bg-black/40 border border-[#d8aa67]/40 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                    <Landmark className="w-4 h-4 text-[#d8aa67]" />
                    <span>Heritage Ambience</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-[#fff8eb] bg-black/40 border border-[#d8aa67]/40 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                    <Armchair className="w-4 h-4 text-[#d8aa67]" />
                    <span>Modern Comforts</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-[#fff8eb] bg-black/40 border border-[#d8aa67]/40 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                    <Crown className="w-4 h-4 text-[#d8aa67]" />
                    <span>Personalized Service</span>
                  </div>
                </div>
              </div>

              {/* Right: Watch Video Action Button */}
              <div className="lg:mb-12">
                <a
                  href="#party-hall-enquiry"
                  className="inline-flex items-center space-x-3 px-5 py-3 rounded-full bg-black/40 border border-[#d8aa67]/70 text-[#fff8eb] hover:bg-[#d8aa67] hover:text-[#4f0809] transition-all backdrop-blur-sm group shadow-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-[#d8aa67] text-[#4f0809] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <span
                    className="text-sm font-semibold tracking-wide"
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                      fontSize: '16px',
                    }}
                  >
                    Watch Video
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Overlapping Floating Booking Widget with Rooms & Party Hall tabs */}
          <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mb-12 sm:-mb-14">
            <BookingBar />
          </div>
        </section>

        {/* ── 2. OUR ROOMS & SUITES SECTION (DELUXE ONLY, WIFI, AC, 24X7 ROOM SERVICE, IN-ROOM DINING, VALET PARKING) ── */}
        <DeluxeRoomsSection />

        {/* ── 3. GRAND PARTY HALL (25-50 GUESTS, BIRTHDAY, ANNIVERSARY, DATE NIGHT, CORPORATE, SOCIAL FUNCTIONS, CUSTOMIZABLE DÉCOR) ── */}
        <PartyHallSection />
      </div>
    </Suspense>
  );
}
