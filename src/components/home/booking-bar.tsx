'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, ArrowRight, BedDouble, PartyPopper } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BookingBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rooms' | 'hall'>('rooms');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Adults, 0 Children • 1 Room');

  // Hall fields
  const [hallEventType, setHallEventType] = useState('Birthday Party');
  const [hallDate, setHallDate] = useState('');
  const [hallGuests, setHallGuests] = useState('25 - 50 Guests');

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);
  const hallDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const fourDaysLater = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
    const fourteenDaysLater = new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0];
    setCheckIn(today);
    setCheckOut(fourDaysLater);
    setHallDate(fourteenDaysLater);
  }, []);

  const openCheckInPicker = () => {
    try {
      checkInRef.current?.showPicker?.();
    } catch {}
  };

  const openCheckOutPicker = () => {
    try {
      checkOutRef.current?.showPicker?.();
    } catch {}
  };

  const openHallDatePicker = () => {
    try {
      hallDateRef.current?.showPicker?.();
    } catch {}
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

  return (
    <div className="w-full max-w-[1020px] mx-auto">
      {/* Floating Pill Switcher Tabs */}
      <div className="flex items-center space-x-2 mb-2 pl-2 sm:pl-3">
        <button
          type="button"
          onClick={() => setActiveTab('rooms')}
          className={`flex items-center space-x-2.5 px-5 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md cursor-pointer ${
            activeTab === 'rooms'
              ? 'bg-[#4f0809] text-[#fff8eb] border-t border-x border-[#d8aa67]/60'
              : 'bg-[#fffaf1]/90 text-[#4f0809] hover:bg-[#fffaf1] backdrop-blur'
          }`}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontSize: '16px',
          }}
        >
          <BedDouble className="w-4 h-4 text-[#d8aa67]" />
          <span>Rooms &amp; Suites</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hall')}
          className={`flex items-center space-x-2.5 px-5 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md cursor-pointer ${
            activeTab === 'hall'
              ? 'bg-[#4f0809] text-[#fff8eb] border-t border-x border-[#d8aa67]/60'
              : 'bg-[#fffaf1]/90 text-[#4f0809] hover:bg-[#fffaf1] backdrop-blur'
          }`}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontSize: '16px',
          }}
        >
          <PartyPopper className="w-4 h-4 text-[#d8aa67]" />
          <span>Party Hall (25-50 Pax)</span>
        </button>
      </div>

      {/* Main Form Body */}
      <div
        className="w-full rounded-2xl p-3.5 sm:p-4.5 transition-all shadow-2xl border"
        style={{
          backgroundColor: '#fffaf1',
          borderColor: 'rgba(216, 170, 103, 0.55)',
          boxShadow: '0 20px 48px rgba(35, 12, 14, 0.22)',
        }}
      >
        {activeTab === 'rooms' ? (
          <form
            action="/rooms"
            method="GET"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.1fr_210px] gap-2.5 sm:gap-3 items-center"
          >
            {/* Check In */}
            <div
              onClick={openCheckInPicker}
              className="relative flex items-center justify-between px-4 py-2.5 rounded-xl border border-[#dfcdb1] bg-white hover:border-[#d8aa67] transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex flex-col text-left flex-1 min-w-0 mr-2">
                <span
                  className="text-[12px] font-medium leading-none mb-1 text-[#857866]"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  Check In
                </span>
                <input
                  ref={checkInRef}
                  type="date"
                  name="checkIn"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    try {
                      e.currentTarget.showPicker?.();
                    } catch {}
                  }}
                  className="bg-transparent text-sm font-semibold text-[#151c1a] focus:outline-none cursor-pointer w-full [&::-webkit-calendar-picker-indicator]:hidden"
                />
              </div>
              <Calendar className="w-4 h-4 text-[#781c1c] shrink-0 group-hover:text-[#d8aa67] transition-colors pointer-events-none" />
            </div>

            {/* Check Out */}
            <div
              onClick={openCheckOutPicker}
              className="relative flex items-center justify-between px-4 py-2.5 rounded-xl border border-[#dfcdb1] bg-white hover:border-[#d8aa67] transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex flex-col text-left flex-1 min-w-0 mr-2">
                <span
                  className="text-[12px] font-medium leading-none mb-1 text-[#857866]"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  Check Out
                </span>
                <input
                  ref={checkOutRef}
                  type="date"
                  name="checkOut"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    try {
                      e.currentTarget.showPicker?.();
                    } catch {}
                  }}
                  className="bg-transparent text-sm font-semibold text-[#151c1a] focus:outline-none cursor-pointer w-full [&::-webkit-calendar-picker-indicator]:hidden"
                />
              </div>
              <Calendar className="w-4 h-4 text-[#781c1c] shrink-0 group-hover:text-[#d8aa67] transition-colors pointer-events-none" />
            </div>

            {/* Guests & Rooms */}
            <div className="relative flex items-center justify-between px-4 py-2.5 rounded-xl border border-[#dfcdb1] bg-white hover:border-[#d8aa67] transition-all shadow-sm">
              <div className="flex flex-col text-left w-full mr-2">
                <span
                  className="text-[12px] font-medium leading-none mb-1 text-[#857866]"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  Guests &amp; Rooms
                </span>
                <select
                  name="guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#151c1a] focus:outline-none cursor-pointer appearance-none truncate"
                >
                  <option value="1 Adult, 0 Children • 1 Deluxe Room">1 Adult • 1 Deluxe Room</option>
                  <option value="2 Adults, 0 Children • 1 Room">2 Adults • 1 Deluxe Room</option>
                  <option value="2 Adults, 1 Child • 1 Room">2 Adults, 1 Child • 1 Deluxe Room</option>
                  <option value="3 Adults, 0 Children • 1 Room">3 Adults • 1 Deluxe Room</option>
                  <option value="4 Adults, 0 Children • 2 Rooms">4 Adults • 2 Deluxe Rooms</option>
                </select>
              </div>
              <ChevronDown className="w-4 h-4 text-[#781c1c] shrink-0 pointer-events-none" />
            </div>

            {/* Search Rooms Button */}
            <div>
              <button
                type="submit"
                className="w-full h-[52px] px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2.5 cursor-pointer text-[#fff8eb]"
                style={{
                  backgroundColor: 'var(--forest-deep, #4f0809)',
                  border: '1px solid #d8aa67',
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  fontSize: '18px',
                }}
              >
                <span>Search Rooms</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleHallSearch}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.1fr_210px] gap-2.5 sm:gap-3 items-center"
          >
            {/* Event Type */}
            <div className="relative flex items-center justify-between px-4 py-2.5 rounded-xl border border-[#dfcdb1] bg-white hover:border-[#d8aa67] transition-all shadow-sm">
              <div className="flex flex-col text-left w-full mr-2">
                <span
                  className="text-[12px] font-medium leading-none mb-1 text-[#857866]"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  Event Type
                </span>
                <select
                  value={hallEventType}
                  onChange={(e) => setHallEventType(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#151c1a] focus:outline-none cursor-pointer appearance-none truncate"
                >
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Anniversary Party">Anniversary Party</option>
                  <option value="Romantic Date & Private Dining">Book for a Date (Private)</option>
                  <option value="Corporate Event / Meeting">Corporate Event / Meeting</option>
                  <option value="Social Function / Gathering">Social Function / Gathering</option>
                </select>
              </div>
              <ChevronDown className="w-4 h-4 text-[#781c1c] shrink-0 pointer-events-none" />
            </div>

            {/* Event Date */}
            <div
              onClick={openHallDatePicker}
              className="relative flex items-center justify-between px-4 py-2.5 rounded-xl border border-[#dfcdb1] bg-white hover:border-[#d8aa67] transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex flex-col text-left flex-1 min-w-0 mr-2">
                <span
                  className="text-[12px] font-medium leading-none mb-1 text-[#857866]"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  Event Date
                </span>
                <input
                  ref={hallDateRef}
                  type="date"
                  value={hallDate}
                  onChange={(e) => setHallDate(e.target.value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    try {
                      e.currentTarget.showPicker?.();
                    } catch {}
                  }}
                  className="bg-transparent text-sm font-semibold text-[#151c1a] focus:outline-none cursor-pointer w-full [&::-webkit-calendar-picker-indicator]:hidden"
                />
              </div>
              <Calendar className="w-4 h-4 text-[#781c1c] shrink-0 group-hover:text-[#d8aa67] transition-colors pointer-events-none" />
            </div>

            {/* Expected Capacity */}
            <div className="relative flex items-center justify-between px-4 py-2.5 rounded-xl border border-[#dfcdb1] bg-white hover:border-[#d8aa67] transition-all shadow-sm">
              <div className="flex flex-col text-left w-full mr-2">
                <span
                  className="text-[12px] font-medium leading-none mb-1 text-[#857866]"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  Capacity (25-50 People)
                </span>
                <select
                  value={hallGuests}
                  onChange={(e) => setHallGuests(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#151c1a] focus:outline-none cursor-pointer appearance-none truncate"
                >
                  <option value="2 Guests (Romantic Date)">2 Guests (Romantic Date Night)</option>
                  <option value="15 - 25 Guests">15 - 25 Guests (Intimate Gathering)</option>
                  <option value="25 - 50 Guests">25 - 50 Guests (Party Hall Standard)</option>
                  <option value="35 - 50 Guests">35 - 50 Guests (Full Hall Booking)</option>
                </select>
              </div>
              <ChevronDown className="w-4 h-4 text-[#781c1c] shrink-0 pointer-events-none" />
            </div>

            {/* Enquire Hall Button */}
            <div>
              <button
                type="submit"
                className="w-full h-[52px] px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2.5 cursor-pointer text-[#fff8eb]"
                style={{
                  backgroundColor: 'var(--forest-deep, #4f0809)',
                  border: '1px solid #d8aa67',
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  fontSize: '18px',
                }}
              >
                <span>Check Hall</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
