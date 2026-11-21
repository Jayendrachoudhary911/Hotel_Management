'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  ArrowRight,
  BedDouble,
  PartyPopper,
  Users,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BookingBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rooms' | 'hall'>('rooms');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Adults • 1 Deluxe Chamber');

  // Hall fields
  const [hallEventType, setHallEventType] = useState('Birthday Party');
  const [hallDate, setHallDate] = useState('');
  const [hallGuests, setHallGuests] = useState('25 - 50 Guests (Party Hall Standard)');

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);
  const hallDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const toYMD = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const today = toYMD(now);
    const threeDaysLater = new Date(now.getTime() + 86400000 * 3);
    const fourteenDaysLater = new Date(now.getTime() + 86400000 * 14);

    setCheckIn(today);
    setCheckOut(toYMD(threeDaysLater));
    setHallDate(toYMD(fourteenDaysLater));
  }, []);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return { day: '--', monthYear: 'Select Date', weekday: '' };
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        const dayStr = d.getDate().toString().padStart(2, '0');
        const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
        const yearStr = d.getFullYear();
        const weekdayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        return {
          day: dayStr,
          monthYear: `${monthStr} ${yearStr}`,
          weekday: weekdayStr,
        };
      }
    } catch {
      // Fallback
    }
    return { day: '--', monthYear: dateStr, weekday: '' };
  };

  const calculateNights = (inStr: string, outStr: string) => {
    if (!inStr || !outStr) return 1;
    try {
      const p1 = inStr.split('-').map(Number);
      const p2 = outStr.split('-').map(Number);
      const d1 = new Date(p1[0], p1[1] - 1, p1[2]);
      const d2 = new Date(p2[0], p2[1] - 1, p2[2]);
      const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const openCheckInPicker = () => {
    try {
      checkInRef.current?.showPicker?.();
    } catch {
      // Ignore
    }
  };

  const openCheckOutPicker = () => {
    try {
      checkOutRef.current?.showPicker?.();
    } catch {
      // Ignore
    }
  };

  const openHallDatePicker = () => {
    try {
      hallDateRef.current?.showPicker?.();
    } catch {
      // Ignore
    }
  };

  const handleHallSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById('party-hall-enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/hotel#party-hall-enquiry');
    }
  };

  const formattedCheckIn = formatDisplayDate(checkIn);
  const formattedCheckOut = formatDisplayDate(checkOut);
  const formattedHallDate = formatDisplayDate(hallDate);
  const nightsCount = calculateNights(checkIn, checkOut);

  return (
    <div className="w-full max-w-[1080px] mx-auto">
      {/* ── Unified Single Apple-Style Luxury Section ── */}
      <div
        className="w-full rounded-[26px] sm:rounded-[34px] p-3 sm:p-5 transition-all border shadow-[0_24px_64px_-12px_rgba(30,10,12,0.3),0_4px_16px_rgba(0,0,0,0.06)]"
        style={{
          backgroundColor: 'rgba(250, 247, 242, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: 'rgba(216, 170, 103, 0.65)',
        }}
      >
        {/* Integrated Top Row: Segmented Switcher & Palace Privilege */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 sm:mb-4 px-1">
          {/* Apple-Style Segmented Control */}
          <div className="inline-flex p-1 rounded-[16px] bg-[#EFE8DD]/90 border border-[#E2D8C7] shadow-inner self-start">
            <button
              type="button"
              onClick={() => setActiveTab('rooms')}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2 rounded-[13px] text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'rooms'
                  ? 'bg-gradient-to-r from-[#670E10] to-[#7E1418] text-[#FAF8F3] shadow-md border border-[#D8AA67]/50'
                  : 'text-[#6B5E4F] hover:text-[#241F1A] hover:bg-black/5'
              }`}
            >
              <BedDouble className="w-4 h-4 text-[#D8AA67]" />
              <span style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)", fontSize: '16px' }}>
                Rooms &amp; Suites
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hall')}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2 rounded-[13px] text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'hall'
                  ? 'bg-gradient-to-r from-[#670E10] to-[#7E1418] text-[#FAF8F3] shadow-md border border-[#D8AA67]/50'
                  : 'text-[#6B5E4F] hover:text-[#241F1A] hover:bg-black/5'
              }`}
            >
              <PartyPopper className="w-4 h-4 text-[#D8AA67]" />
              <span style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)", fontSize: '16px' }}>
                Party Hall (25–50 Pax)
              </span>
            </button>
          </div>

          {/* Luxury Reassurance Tag */}
          <div className="hidden sm:inline-flex items-center space-x-2 text-[11px] font-semibold text-[#670E10] bg-[#FAF3E6] px-3.5 py-1.5 rounded-[12px] border border-[#E6D7BE] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B08D57]" />
            <span>Direct Palace Booking &bull; Best Tariff &bull; Welcome Drink</span>
          </div>
        </div>

        {/* Delicate Hairline Inset Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#E2D8C7] to-transparent mb-3.5 sm:mb-4" />

        {/* ── Content Area: Rooms & Suites ── */}
        {activeTab === 'rooms' ? (
          <form
            action="/rooms"
            method="GET"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1.25fr_auto] gap-2.5 sm:gap-3 items-center"
          >
            {/* 1. Check In Tile */}
            <div
              onClick={openCheckInPicker}
              className="relative flex items-center justify-between px-4 py-3 rounded-[18px] border border-[#DFD3C3] bg-white hover:border-[#B08D57] hover:shadow-md transition-all cursor-pointer group h-[64px]"
            >
              <div className="flex flex-col text-left flex-1 min-w-0 mr-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8F7245] leading-none mb-1">
                  Check In
                </span>
                <div className="flex items-baseline space-x-1.5">
                  <span
                    className="text-base sm:text-lg font-bold text-[#241F1A] leading-none"
                    style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                  >
                    {formattedCheckIn.day} {formattedCheckIn.monthYear}
                  </span>
                  <span className="text-[11px] font-medium text-[#7A6F62] leading-none">
                    {formattedCheckIn.weekday}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0 group-hover:border-[#B08D57] group-hover:bg-[#FFF8EB] transition-colors">
                <Calendar className="w-4 h-4 text-[#670E10] group-hover:text-[#B08D57] transition-colors" />
              </div>

              {/* Native Date Input Overlay */}
              <input
                ref={checkInRef}
                type="date"
                name="checkIn"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckIn(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
            </div>

            {/* 2. Nights Separator Pill (Desktop only) */}
            <div className="hidden lg:flex flex-col items-center justify-center px-0.5">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] text-[#670E10] whitespace-nowrap shadow-2xs flex items-center gap-1">
                <span>🌙</span>
                <span>{nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'}</span>
              </span>
            </div>

            {/* 3. Check Out Tile */}
            <div
              onClick={openCheckOutPicker}
              className="relative flex items-center justify-between px-4 py-3 rounded-[18px] border border-[#DFD3C3] bg-white hover:border-[#B08D57] hover:shadow-md transition-all cursor-pointer group h-[64px]"
            >
              <div className="flex flex-col text-left flex-1 min-w-0 mr-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8F7245] leading-none mb-1">
                  Check Out
                </span>
                <div className="flex items-baseline space-x-1.5">
                  <span
                    className="text-base sm:text-lg font-bold text-[#241F1A] leading-none"
                    style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                  >
                    {formattedCheckOut.day} {formattedCheckOut.monthYear}
                  </span>
                  <span className="text-[11px] font-medium text-[#7A6F62] leading-none">
                    {formattedCheckOut.weekday}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0 group-hover:border-[#B08D57] group-hover:bg-[#FFF8EB] transition-colors">
                <Calendar className="w-4 h-4 text-[#670E10] group-hover:text-[#B08D57] transition-colors" />
              </div>

              {/* Native Date Input Overlay */}
              <input
                ref={checkOutRef}
                type="date"
                name="checkOut"
                value={checkOut}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckOut(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
            </div>

            {/* 4. Guests & Chambers Tile */}
            <div className="relative flex items-center justify-between px-4 py-3 rounded-[18px] border border-[#DFD3C3] bg-white hover:border-[#B08D57] hover:shadow-md transition-all h-[64px] group">
              <div className="flex flex-col text-left flex-1 min-w-0 mr-2 pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8F7245] leading-none mb-1">
                  Guests &amp; Chambers
                </span>
                <span
                  className="text-sm sm:text-base font-bold text-[#241F1A] leading-none truncate"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  {guests}
                </span>
              </div>

              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0 group-hover:border-[#B08D57] group-hover:bg-[#FFF8EB] transition-colors">
                <Users className="w-4 h-4 text-[#670E10] group-hover:text-[#B08D57] transition-colors" />
              </div>

              {/* Native Select Overlay */}
              <select
                name="guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 text-sm font-semibold"
              >
                <option value="1 Adult • 1 Deluxe Chamber">1 Adult • 1 Deluxe Chamber</option>
                <option value="2 Adults • 1 Deluxe Chamber">2 Adults • 1 Deluxe Chamber (Popular)</option>
                <option value="2 Adults, 1 Child • 1 Deluxe Chamber">2 Adults, 1 Child • 1 Deluxe Chamber</option>
                <option value="3 Adults • 1 Royal Chamber">3 Adults • 1 Royal Chamber</option>
                <option value="4 Adults • 2 Deluxe Chambers">4 Adults • 2 Deluxe Chambers</option>
                <option value="5+ Guests • Royal Palace Suite">5+ Guests • Royal Palace Suite</option>
              </select>
            </div>

            {/* 5. Search Rooms Button */}
            <div className="sm:col-span-2 lg:col-span-1">
              <button
                type="submit"
                className="w-full h-[64px] px-8 rounded-[18px] font-bold tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2.5 cursor-pointer text-[#FFF8EB] border border-[#D8AA67]/80 group"
                style={{
                  background: 'linear-gradient(135deg, #670E10 0%, #7E1418 50%, #52090B 100%)',
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  fontSize: '18px',
                }}
              >
                <span className="whitespace-nowrap font-bold">Search Chambers</span>
                <ArrowRight className="w-4 h-4 text-[#D8AA67] group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
              </button>
            </div>
          </form>
        ) : (
          /* ── Content Area: Party Hall Form ── */
          <form
            onSubmit={handleHallSearch}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.2fr_auto] gap-2.5 sm:gap-3 items-center"
          >
            {/* Event Occasion */}
            <div className="relative flex items-center justify-between px-4 py-3 rounded-[18px] border border-[#DFD3C3] bg-white hover:border-[#B08D57] hover:shadow-md transition-all h-[64px] group">
              <div className="flex flex-col text-left flex-1 min-w-0 mr-2 pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8F7245] leading-none mb-1">
                  Event Occasion
                </span>
                <span
                  className="text-sm sm:text-base font-bold text-[#241F1A] leading-none truncate"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  {hallEventType}
                </span>
              </div>
              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0 group-hover:border-[#B08D57] group-hover:bg-[#FFF8EB] transition-colors">
                <PartyPopper className="w-4 h-4 text-[#670E10] group-hover:text-[#B08D57] transition-colors" />
              </div>

              <select
                value={hallEventType}
                onChange={(e) => setHallEventType(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 text-sm font-semibold"
              >
                <option value="Birthday Party">Birthday Party</option>
                <option value="Anniversary & Milestone">Anniversary &amp; Milestone Party</option>
                <option value="Romantic Candlelight Dinner">Book for a Date (Private Dining)</option>
                <option value="Corporate Retreat & Conference">Corporate Event / Conference</option>
                <option value="Pre-Wedding & Sangeet Gathering">Pre-Wedding &amp; Sangeet Gathering</option>
              </select>
            </div>

            {/* Event Date */}
            <div
              onClick={openHallDatePicker}
              className="relative flex items-center justify-between px-4 py-3 rounded-[18px] border border-[#DFD3C3] bg-white hover:border-[#B08D57] hover:shadow-md transition-all cursor-pointer group h-[64px]"
            >
              <div className="flex flex-col text-left flex-1 min-w-0 mr-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8F7245] leading-none mb-1">
                  Event Date
                </span>
                <div className="flex items-baseline space-x-1.5">
                  <span
                    className="text-base sm:text-lg font-bold text-[#241F1A] leading-none"
                    style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                  >
                    {formattedHallDate.day} {formattedHallDate.monthYear}
                  </span>
                  <span className="text-[11px] font-medium text-[#7A6F62] leading-none">
                    {formattedHallDate.weekday}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0 group-hover:border-[#B08D57] group-hover:bg-[#FFF8EB] transition-colors">
                <Calendar className="w-4 h-4 text-[#670E10] group-hover:text-[#B08D57] transition-colors" />
              </div>

              <input
                ref={hallDateRef}
                type="date"
                value={hallDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setHallDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
            </div>

            {/* Hall Capacity */}
            <div className="relative flex items-center justify-between px-4 py-3 rounded-[18px] border border-[#DFD3C3] bg-white hover:border-[#B08D57] hover:shadow-md transition-all h-[64px] group">
              <div className="flex flex-col text-left flex-1 min-w-0 mr-2 pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8F7245] leading-none mb-1">
                  Capacity (25–50 People)
                </span>
                <span
                  className="text-sm sm:text-base font-bold text-[#241F1A] leading-none truncate"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  {hallGuests}
                </span>
              </div>
              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0 group-hover:border-[#B08D57] group-hover:bg-[#FFF8EB] transition-colors">
                <Users className="w-4 h-4 text-[#670E10] group-hover:text-[#B08D57] transition-colors" />
              </div>

              <select
                value={hallGuests}
                onChange={(e) => setHallGuests(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 text-sm font-semibold"
              >
                <option value="2 Guests (Romantic Date)">2 Guests (Romantic Candlelight Date)</option>
                <option value="15 - 25 Guests (Intimate Gathering)">15 - 25 Guests (Intimate Gathering)</option>
                <option value="25 - 50 Guests (Party Hall Standard)">25 - 50 Guests (Standard Hall Booking)</option>
                <option value="35 - 50 Guests (Full Hall Booking)">35 - 50 Guests (Full Banquet Hall)</option>
              </select>
            </div>

            {/* Check Hall Button */}
            <div className="sm:col-span-2 lg:col-span-1">
              <button
                type="submit"
                className="w-full h-[64px] px-8 rounded-[18px] font-bold tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2.5 cursor-pointer text-[#FFF8EB] border border-[#D8AA67]/80 group"
                style={{
                  background: 'linear-gradient(135deg, #670E10 0%, #7E1418 50%, #52090B 100%)',
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  fontSize: '18px',
                }}
              >
                <span className="whitespace-nowrap font-bold">Check Hall</span>
                <ArrowRight className="w-4 h-4 text-[#D8AA67] group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
