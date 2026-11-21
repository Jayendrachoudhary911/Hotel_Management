'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar as CalendarIcon,
  ArrowRight,
  BedDouble,
  PartyPopper,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Lock,
  X,
  Dog,
  Baby,
  Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type TabType = 'rooms' | 'hall';
type ExpandedPanelType = 'calendar' | 'guests' | 'hallCalendar' | 'hallCapacity' | null;

interface StaySuggestion {
  label: string;
  sublabel: string;
  nights: number;
}

const STAY_SUGGESTIONS: StaySuggestion[] = [
  { label: '1 Night', sublabel: 'Quick Day Stay', nights: 1 },
  { label: '2 Nights', sublabel: 'Weekend Getaway', nights: 2 },
  { label: '3 Nights', sublabel: 'Royal Retreat (Popular)', nights: 3 },
  { label: '5 Nights', sublabel: 'Heritage Exploration', nights: 5 },
  { label: '7 Nights', sublabel: 'Full Imperial Week', nights: 7 },
];

interface HallCapacityOption {
  id: string;
  title: string;
  subtext: string;
  badge: string;
}

const HALL_CAPACITY_OPTIONS: HallCapacityOption[] = [
  {
    id: '25-35',
    title: '25 – 35 Guests',
    subtext: 'Intimate Gathering & Family Feasts',
    badge: 'Cozy Royal',
  },
  {
    id: '35-50',
    title: '35 – 50 Guests',
    subtext: 'Party Hall Standard Booking',
    badge: 'Most Popular',
  },
  {
    id: '50-75',
    title: '50 – 75 Guests',
    subtext: 'Celebration Hall & Courtyard Terrace',
    badge: 'Celebrations',
  },
  {
    id: '75-100',
    title: '75 – 100 Guests',
    subtext: 'Grand Mewar Banquet & Sangeet',
    badge: 'Grand Feast',
  },
  {
    id: '100+',
    title: '100+ Guests',
    subtext: 'Full Palace Courtyard & Amphitheatre',
    badge: 'Imperial Gala',
  },
];

// Helper: Format YYYY-MM-DD
function toYMD(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Helper: Parse YYYY-MM-DD to Date
function parseYMD(str: string): Date {
  const parts = str.split('-').map(Number);
  if (parts.length === 3) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date();
}

// Helper: Add days
function addDays(d: Date, days: number): Date {
  const res = new Date(d);
  res.setDate(res.getDate() + days);
  return res;
}

export function BookingBar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<TabType>('rooms');

  // Rooms Booking State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);

  // Rule: 1 room for 1 adult member by default, locked
  const rooms = adults;

  // Party Hall Booking State
  const [hallEventType, setHallEventType] = useState('Birthday Party');
  const [hallDate, setHallDate] = useState('');
  const [hallCapacity, setHallCapacity] = useState('35 – 50 Guests');

  // Active Expanded Panel (Desktop inline expansion & Mobile Dialog)
  const [expandedPanel, setExpandedPanel] = useState<ExpandedPanelType>(null);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  // Calendar Navigation Month State
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  // Date selection mode when clicking: 'in' or 'out'
  const [selectingField, setSelectingField] = useState<'in' | 'out'>('in');

  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Initialize dates & screen size
  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const today = toYMD(now);
    const threeDaysLater = toYMD(addDays(now, 3));
    const fourteenDaysLater = toYMD(addDays(now, 14));

    setCheckIn(today);
    setCheckOut(threeDaysLater);
    setHallDate(fourteenDaysLater);
    setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Format Display Date Object
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return { day: '--', monthYear: 'Select Date', weekday: '' };
    try {
      const d = parseYMD(dateStr);
      return {
        day: d.getDate().toString().padStart(2, '0'),
        monthYear: `${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getFullYear()}`,
        weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      };
    } catch {
      return { day: '--', monthYear: dateStr, weekday: '' };
    }
  };

  const calculateNights = (inStr: string, outStr: string) => {
    if (!inStr || !outStr) return 1;
    try {
      const d1 = parseYMD(inStr);
      const d2 = parseYMD(outStr);
      const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    } catch {
      return 1;
    }
  };

  const formattedCheckIn = formatDisplayDate(checkIn);
  const formattedCheckOut = formatDisplayDate(checkOut);
  const formattedHallDate = formatDisplayDate(hallDate);
  const nightsCount = calculateNights(checkIn, checkOut);

  // Formatted Guests Summary String
  const guestsSummary = `${adults} ${adults === 1 ? 'Adult' : 'Adults'}${
    children > 0 ? `, ${children} ${children === 1 ? 'Child' : 'Children'}` : ''
  } • ${rooms} ${rooms === 1 ? 'Chamber' : 'Chambers'}${
    pets > 0 ? ` • ${pets} ${pets === 1 ? 'Pet' : 'Pets'}` : ''
  }`;

  // Open / Toggle Panel Handler
  const handleOpenPanel = (panel: ExpandedPanelType, targetField?: 'in' | 'out') => {
    if (targetField) {
      setSelectingField(targetField);
    }

    if (isMobile) {
      setExpandedPanel(panel);
      setMobileModalOpen(true);
    } else {
      if (expandedPanel === panel && (!targetField || targetField === selectingField)) {
        setExpandedPanel(null); // Toggle close if already open
      } else {
        setExpandedPanel(panel);
      }
    }
  };

  // Close panel
  const handleClosePanel = () => {
    setExpandedPanel(null);
    setMobileModalOpen(false);
  };

  // Apply Stay Suggestion (e.g., 2 Nights)
  const applyStaySuggestion = (nights: number) => {
    const baseDate = checkIn ? parseYMD(checkIn) : new Date();
    const newCheckIn = toYMD(baseDate);
    const newCheckOut = toYMD(addDays(baseDate, nights));
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
    setSelectingField('out');
  };

  // Date selection inside common calendar
  const handleDateClick = (dateStr: string) => {
    const todayStr = toYMD(new Date());
    if (dateStr < todayStr) return; // Prevent selecting past dates

    if (activeTab === 'hall' || expandedPanel === 'hallCalendar') {
      setHallDate(dateStr);
      return;
    }

    // Rooms mode (Check-in & Check-out range)
    if (selectingField === 'in') {
      setCheckIn(dateStr);
      // If new checkIn is after existing checkOut, adjust checkOut to +2 nights
      if (!checkOut || dateStr >= checkOut) {
        setCheckOut(toYMD(addDays(parseYMD(dateStr), 2)));
      }
      setSelectingField('out');
    } else {
      // Selecting Check-Out
      if (dateStr > checkIn) {
        setCheckOut(dateStr);
      } else {
        // If clicked date is before or same as checkIn, treat as new checkIn
        setCheckIn(dateStr);
        setCheckOut(toYMD(addDays(parseYMD(dateStr), 1)));
      }
      setSelectingField('in');
    }
  };

  // Hall search submit
  const handleHallSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById('party-hall-enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/hotel#party-hall-enquiry?date=${hallDate}&type=${encodeURIComponent(hallEventType)}&capacity=${encodeURIComponent(hallCapacity)}`);
    }
  };

  // ── Month Days Generator for Custom Calendar ──
  const getMonthDays = (baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { dayNumber: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    // Previous month filler days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, d);
      days.push({ dayNumber: d, dateStr: toYMD(prevDate), isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currDate = new Date(year, month, i);
      days.push({ dayNumber: i, dateStr: toYMD(currDate), isCurrentMonth: true });
    }

    // Next month filler to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ dayNumber: i, dateStr: toYMD(nextDate), isCurrentMonth: false });
    }

    return days;
  };

  const nextMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
  const todayStr = toYMD(new Date());

  // ── Render Shared Calendar Component ──
  const renderCalendarContent = () => {
    const monthsToDisplay = isMobile ? [calendarMonth] : [calendarMonth, nextMonth];

    return (
      <div className="flex flex-col space-y-4">
        {/* Quick Stay Suggestions Pills */}
        {activeTab === 'rooms' && (
          <div className="flex flex-col space-y-1.5 pb-2 border-b border-[#DFD3C3]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F7245]">
                Quick Stay Suggestions
              </span>
              <span className="text-xs text-[#670E10] font-medium">
                {nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'} Selected
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {STAY_SUGGESTIONS.map((sug) => {
                const isSelected = nightsCount === sug.nights;
                return (
                  <button
                    key={sug.nights}
                    type="button"
                    onClick={() => applyStaySuggestion(sug.nights)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#670E10] text-[#FFF8EB] border-[#D8AA67] shadow-sm'
                        : 'bg-[#FFF8EB] text-[#4A0A0C] border-[#DFD3C3] hover:border-[#D8AA67] hover:bg-[#F5F0E6]'
                    }`}
                  >
                    <span>{sug.label}</span>
                    <span className="opacity-75 text-[10px] ml-1 hidden sm:inline">({sug.sublabel})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Calendar Months Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {monthsToDisplay.map((mDate, mIdx) => {
            const days = getMonthDays(mDate);
            const monthName = mDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            return (
              <div key={monthName} className="flex flex-col">
                {/* Month Navigation Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  {mIdx === 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
                      }
                      className="p-1.5 rounded-full hover:bg-black/5 text-[#670E10] transition cursor-pointer"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="w-7" />
                  )}

                  <h4
                    className="text-base font-bold text-[#670E10]"
                    style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                  >
                    {monthName}
                  </h4>

                  {mIdx === monthsToDisplay.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
                      }
                      className="p-1.5 rounded-full hover:bg-black/5 text-[#670E10] transition cursor-pointer"
                      aria-label="Next month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="w-7" />
                  )}
                </div>

                {/* Day of week labels */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-semibold text-[#8F7245]">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-center">
                  {days.map((d, dIdx) => {
                    const isPast = d.dateStr < todayStr;
                    const isCurrentMonth = d.isCurrentMonth;

                    if (!isCurrentMonth) {
                      return <div key={`${d.dateStr}-${dIdx}`} className="h-8" />;
                    }

                    const isCheckInDay = activeTab === 'rooms' && d.dateStr === checkIn;
                    const isCheckOutDay = activeTab === 'rooms' && d.dateStr === checkOut;
                    const isBetween =
                      activeTab === 'rooms' && checkIn && checkOut && d.dateStr > checkIn && d.dateStr < checkOut;
                    const isHallSelected = (activeTab === 'hall' || expandedPanel === 'hallCalendar') && d.dateStr === hallDate;

                    let bgClass = 'bg-transparent text-[#241F1A] hover:bg-[#D8AA67]/25';
                    if (isCheckInDay || isCheckOutDay || isHallSelected) {
                      bgClass = 'bg-[#670E10] text-[#FFF8EB] font-bold shadow-xs';
                    } else if (isBetween) {
                      bgClass = 'bg-[#670E10]/15 text-[#670E10] font-semibold';
                    }

                    const roundingClass =
                      isCheckInDay && isCheckOutDay
                        ? 'rounded-full'
                        : isCheckInDay
                        ? 'rounded-l-full'
                        : isCheckOutDay
                        ? 'rounded-r-full'
                        : isBetween
                        ? 'rounded-none'
                        : 'rounded-full';

                    return (
                      <button
                        key={d.dateStr}
                        type="button"
                        disabled={isPast}
                        onClick={() => handleDateClick(d.dateStr)}
                        className={`h-8 w-full flex items-center justify-center text-xs font-medium transition-all ${roundingClass} ${bgClass} ${
                          isPast ? 'opacity-25 cursor-not-allowed text-gray-400' : 'cursor-pointer'
                        }`}
                      >
                        {d.dayNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Dates Summary Banner & Apply Button */}
        <div className="pt-3 border-t border-[#DFD3C3] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-[#241F1A]">
            <span className="font-semibold text-[#8F7245]">Selected Period:</span>
            {activeTab === 'rooms' ? (
              <span className="font-bold text-[#670E10]">
                {formattedCheckIn.day} {formattedCheckIn.monthYear} &rarr; {formattedCheckOut.day}{' '}
                {formattedCheckOut.monthYear} ({nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'})
              </span>
            ) : (
              <span className="font-bold text-[#670E10]">
                {formattedHallDate.day} {formattedHallDate.monthYear} ({formattedHallDate.weekday})
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClosePanel}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-gradient-to-r from-[#670E10] to-[#801417] text-[#FFF8EB] text-xs font-bold tracking-wide shadow hover:shadow-md transition cursor-pointer"
            >
              Done &bull; Apply Dates
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Render Guests Stepper Component (Rooms Tab) ──
  const renderGuestsStepperContent = () => {
    return (
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Adults Stepper */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#DFD3C3] flex items-center justify-between shadow-2xs">
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-[#241F1A]">Adults</span>
              <span className="text-[11px] text-[#7A6F62]">Ages 13 and above</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={adults <= 1}
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Decrease adults"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-[#241F1A]">{adults}</span>
              <button
                type="button"
                disabled={adults >= 10}
                onClick={() => setAdults(Math.min(10, adults + 1))}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Increase adults"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Children Stepper */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#DFD3C3] flex items-center justify-between shadow-2xs">
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-[#241F1A]">Children</span>
              <span className="text-[11px] text-[#7A6F62]">Ages 0 to 12</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={children <= 0}
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Decrease children"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-[#241F1A]">{children}</span>
              <button
                type="button"
                disabled={children >= 6}
                onClick={() => setChildren(Math.min(6, children + 1))}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Increase children"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Pets Stepper */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#DFD3C3] flex items-center justify-between shadow-2xs">
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-[#241F1A] flex items-center gap-1.5">
                <span>Pets</span>
                <Dog className="w-3.5 h-3.5 text-[#B08D57]" />
              </span>
              <span className="text-[11px] text-[#7A6F62]">Royal pet-friendly stay</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={pets <= 0}
                onClick={() => setPets(Math.max(0, pets - 1))}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Decrease pets"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-[#241F1A]">{pets}</span>
              <button
                type="button"
                disabled={pets >= 3}
                onClick={() => setPets(Math.min(3, pets + 1))}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Increase pets"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Chambers (Rooms) — Auto Allocated 1 Room per Member (Locked as specified) */}
          <div className="p-3.5 rounded-2xl bg-[#F5EFE6] border border-[#D8AA67]/60 flex items-center justify-between shadow-2xs">
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-[#670E10] flex items-center gap-1.5">
                <span>Chambers (Rooms)</span>
                <Lock className="w-3.5 h-3.5 text-[#D8AA67]" />
              </span>
              <span className="text-[11px] text-[#7A6F62]">1 Room / Member standard</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-white border border-[#D8AA67] text-xs font-bold text-[#670E10]">
                {rooms} {rooms === 1 ? 'Chamber' : 'Chambers'} (Auto)
              </span>
            </div>
          </div>
        </div>

        {/* Policy note & apply button */}
        <div className="pt-3 border-t border-[#DFD3C3] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#7A6F62] italic text-center sm:text-left">
            * Royal policy automatically allocates 1 private heritage chamber per adult guest for absolute privacy.
          </span>
          <button
            type="button"
            onClick={handleClosePanel}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-[#670E10] to-[#801417] text-[#FFF8EB] text-xs font-bold tracking-wide shadow hover:shadow-md transition cursor-pointer"
          >
            Apply Guests &amp; Chambers
          </button>
        </div>
      </div>
    );
  };

  // ── Render Party Hall Capacity Chips Component ──
  const renderHallCapacityContent = () => {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8F7245]">
            Select Guest Capacity for Celebration Hall
          </span>
          <span className="text-xs font-semibold text-[#670E10]">
            Selected: {hallCapacity}
          </span>
        </div>

        {/* Capacity Chips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {HALL_CAPACITY_OPTIONS.map((opt) => {
            const isSelected = hallCapacity.startsWith(opt.title.split(' ')[0]);
            return (
              <div
                key={opt.id}
                onClick={() => {
                  setHallCapacity(`${opt.title} (${opt.badge})`);
                }}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FFF8EB] border-[#670E10] shadow-md ring-2 ring-[#D8AA67]'
                    : 'bg-white border-[#DFD3C3] hover:border-[#D8AA67] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-base font-bold text-[#670E10]"
                    style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                  >
                    {opt.title}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EFE8DD] text-[#7A6F62]">
                    {opt.badge}
                  </span>
                </div>
                <span className="text-xs text-[#7A6F62] leading-tight mb-2">{opt.subtext}</span>
                <div className="flex items-center justify-end">
                  {isSelected ? (
                    <span className="flex items-center text-xs font-bold text-[#670E10]">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Selected
                    </span>
                  ) : (
                    <span className="text-xs text-[#8F7245] font-semibold">Select &rarr;</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Apply footer */}
        <div className="pt-3 border-t border-[#DFD3C3] flex items-center justify-end">
          <button
            type="button"
            onClick={handleClosePanel}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-[#670E10] to-[#801417] text-[#FFF8EB] text-xs font-bold tracking-wide shadow hover:shadow-md transition cursor-pointer"
          >
            Apply Capacity
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1080px] mx-auto relative pt-4">
      {/* ── 1. Popping-Out Tabs with Inset Fillet Curves ── */}
      <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between px-0">
        {/* Popped-Out Chamber Tab Deck */}
        <div
          className="relative inline-flex items-center px-1.5 sm:px-2 pt-1.5 sm:pt-2 pb-1 rounded-t-[16px] sm:rounded-t-[22px] border-t-2 border-x-2 transition-all mx-auto sm:mx-0 sm:ml-16 md:ml-20 lg:ml-24 shadow-2xs"
          style={{
            backgroundColor: '#FAF7F2',
            borderColor: '#D8AA67',
            marginBottom: '-2px', // Flushes seamlessly into the top border of the card
          }}
        >
          {/* Left Inverted Concave Fillet Curve */}
          <div className="absolute -left-[14px] sm:-left-[20px] bottom-0 w-[14px] sm:w-[20px] h-[14px] sm:h-[20px] pointer-events-none">
            <svg viewBox="0 0 20 20" preserveAspectRatio="none" className="w-full h-full block">
              <path d="M 20 0 C 20 11.045 11.045 20 0 20 L 0 23 L 23 23 L 23 0 Z" fill="#FAF7F2" />
              <path
                d="M 20 -1 L 20 0 C 20 11.045 11.045 20 0 20 L -2 20"
                fill="none"
                stroke="#D8AA67"
                strokeWidth="2"
                strokeLinecap="butt"
              />
            </svg>
          </div>

          {/* Right Inverted Concave Fillet Curve */}
          <div className="absolute -right-[14px] sm:-right-[20px] bottom-0 w-[14px] sm:w-[20px] h-[14px] sm:h-[20px] pointer-events-none">
            <svg viewBox="0 0 20 20" preserveAspectRatio="none" className="w-full h-full block">
              <path d="M 0 0 C 0 11.045 8.955 20 20 20 L 20 23 L -3 23 L -3 0 Z" fill="#FAF7F2" />
              <path
                d="M 0 -1 L 0 0 C 0 11.045 8.955 20 20 20 L 22 20"
                fill="none"
                stroke="#D8AA67"
                strokeWidth="2"
                strokeLinecap="butt"
              />
            </svg>
          </div>

          {/* Bottom baseline mask (covers card top line beneath the tab deck) */}
          <div
            className="absolute -bottom-[2px] -left-[1px] -right-[1px] h-[4px] pointer-events-none"
            style={{ backgroundColor: '#FAF7F2' }}
          />

          {/* Segmented Control Capsule */}
          <div className="relative z-10 inline-flex p-1 rounded-[13px] sm:rounded-[18px] bg-[#EFE8DD]/85 border border-[#DFD3C3] shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveTab('rooms');
                setExpandedPanel(null);
              }}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-[10px] sm:rounded-[14px] text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'rooms'
                  ? 'bg-gradient-to-r from-[#670E10] via-[#7B1316] to-[#550B0D] text-[#FFF8EB] shadow-md border border-[#D8AA67]/70 scale-[1.01]'
                  : 'text-[#6B5E4F] hover:text-[#241F1A] hover:bg-black/5'
              }`}
            >
              <BedDouble className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D8AA67] shrink-0" />
              <span style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)", fontSize: '15px' }}>
                <span className="hidden min-[380px]:inline">Rooms &amp; Suites</span>
                <span className="min-[380px]:hidden">Rooms</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('hall');
                setExpandedPanel(null);
              }}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-[10px] sm:rounded-[14px] text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'hall'
                  ? 'bg-gradient-to-r from-[#670E10] via-[#7B1316] to-[#550B0D] text-[#FFF8EB] shadow-md border border-[#D8AA67]/70 scale-[1.01]'
                  : 'text-[#6B5E4F] hover:text-[#241F1A] hover:bg-black/5'
              }`}
            >
              <PartyPopper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D8AA67] shrink-0" />
              <span style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)", fontSize: '15px' }}>
                <span className="hidden lg:inline">Party Hall (25–50 Pax)</span>
                <span className="lg:hidden">Party Hall</span>
              </span>
            </button>
          </div>
        </div>

        {/* Palace Direct Privileges Tag */}
        <div className="hidden md:inline-flex items-center space-x-2 text-xs font-semibold text-[#670E10] bg-[#FFF8EB] px-4 py-2 rounded-full border border-[#D8AA67]/80 shadow-md self-center mb-2 mr-4 sm:mr-8">
          <Sparkles className="w-3.5 h-3.5 text-[#B08D57]" />
          <span>Direct Palace Privilege &bull; Best Tariff Guarantee</span>
        </div>
      </div>

      {/* ── 2. Master Booking Details Card (Expands when clicked on Desktop) ── */}
      <div
        ref={cardContainerRef}
        className="relative z-10 w-full rounded-[22px] sm:rounded-[32px] pt-6 sm:pt-7 pb-4 sm:pb-5 px-3.5 sm:px-5 transition-all duration-300 border-2 shadow-[0_26px_65px_-10px_rgba(35,12,14,0.32),0_4px_16px_rgba(0,0,0,0.06)]"
        style={{
          backgroundColor: '#FAF7F2',
          borderColor: '#D8AA67',
        }}
      >
        {activeTab === 'rooms' ? (
          <form
            action="/rooms"
            method="GET"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1.25fr_auto] gap-2.5 sm:gap-3 items-center"
          >
            {/* Hidden inputs to guarantee query params pass to /rooms */}
            <input type="hidden" name="checkIn" value={checkIn} />
            <input type="hidden" name="checkOut" value={checkOut} />
            <input type="hidden" name="guests" value={guestsSummary} />
            <input type="hidden" name="adults" value={adults} />
            <input type="hidden" name="children" value={children} />
            <input type="hidden" name="pets" value={pets} />
            <input type="hidden" name="rooms" value={rooms} />

            {/* 1. Check In Tile (Click opens shared calendar) */}
            <div
              onClick={() => handleOpenPanel('calendar', 'in')}
              className={`relative flex items-center justify-between px-4 py-3 rounded-[18px] border bg-white transition-all cursor-pointer group h-[64px] ${
                expandedPanel === 'calendar' && selectingField === 'in'
                  ? 'border-[#670E10] ring-2 ring-[#D8AA67] shadow-md bg-[#FFF8EB]'
                  : 'border-[#DFD3C3] hover:border-[#B08D57] hover:shadow-md'
              }`}
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
                <CalendarIcon className="w-4 h-4 text-[#670E10] group-hover:text-[#B08D57] transition-colors" />
              </div>
            </div>

            {/* 2. Nights Separator Pill (Desktop only, clicks also toggle calendar) */}
            <div
              onClick={() => handleOpenPanel('calendar')}
              className="hidden lg:flex flex-col items-center justify-center px-0.5 cursor-pointer group"
            >
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] text-[#670E10] whitespace-nowrap shadow-2xs flex items-center gap-1 group-hover:border-[#B08D57] group-hover:bg-[#FFF8EB] transition">
                <span>🌙</span>
                <span>{nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'}</span>
              </span>
            </div>

            {/* 3. Check Out Tile (Click opens shared calendar) */}
            <div
              onClick={() => handleOpenPanel('calendar', 'out')}
              className={`relative flex items-center justify-between px-4 py-3 rounded-[18px] border bg-white transition-all cursor-pointer group h-[64px] ${
                expandedPanel === 'calendar' && selectingField === 'out'
                  ? 'border-[#670E10] ring-2 ring-[#D8AA67] shadow-md bg-[#FFF8EB]'
                  : 'border-[#DFD3C3] hover:border-[#B08D57] hover:shadow-md'
              }`}
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
                <CalendarIcon className="w-4 h-4 text-[#670E10] group-hover:text-[#B08D57] transition-colors" />
              </div>
            </div>

            {/* 4. Guests & Chambers Tile (Click opens stepper) */}
            <div
              onClick={() => handleOpenPanel('guests')}
              className={`relative flex items-center justify-between px-4 py-3 rounded-[18px] border bg-white transition-all cursor-pointer group h-[64px] ${
                expandedPanel === 'guests'
                  ? 'border-[#670E10] ring-2 ring-[#D8AA67] shadow-md bg-[#FFF8EB]'
                  : 'border-[#DFD3C3] hover:border-[#B08D57] hover:shadow-md'
              }`}
            >
              <div className="flex flex-col text-left flex-1 min-w-0 mr-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8F7245] leading-none mb-1">
                  Guests &amp; Chambers
                </span>
                <span
                  className="text-sm sm:text-base font-bold text-[#241F1A] leading-none truncate"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  {guestsSummary}
                </span>
              </div>

              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0 group-hover:border-[#B08D57] group-hover:bg-[#FFF8EB] transition-colors">
                <Users className="w-4 h-4 text-[#670E10] group-hover:text-[#B08D57] transition-colors" />
              </div>
            </div>

            {/* 5. Search Chambers Button */}
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

            {/* Event Date (Click opens calendar) */}
            <div
              onClick={() => handleOpenPanel('hallCalendar')}
              className={`relative flex items-center justify-between px-4 py-3 rounded-[18px] border bg-white transition-all cursor-pointer group h-[64px] ${
                expandedPanel === 'hallCalendar'
                  ? 'border-[#670E10] ring-2 ring-[#D8AA67] shadow-md bg-[#FFF8EB]'
                  : 'border-[#DFD3C3] hover:border-[#B08D57] hover:shadow-md'
              }`}
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
                <CalendarIcon className="w-4 h-4 text-[#670E10] group-hover:text-[#B08D57] transition-colors" />
              </div>
            </div>

            {/* Hall Capacity (Click opens capacity chips) */}
            <div
              onClick={() => handleOpenPanel('hallCapacity')}
              className={`relative flex items-center justify-between px-4 py-3 rounded-[18px] border bg-white transition-all cursor-pointer group h-[64px] ${
                expandedPanel === 'hallCapacity'
                  ? 'border-[#670E10] ring-2 ring-[#D8AA67] shadow-md bg-[#FFF8EB]'
                  : 'border-[#DFD3C3] hover:border-[#B08D57] hover:shadow-md'
              }`}
            >
              <div className="flex flex-col text-left flex-1 min-w-0 mr-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8F7245] leading-none mb-1">
                  Hall Capacity
                </span>
                <span
                  className="text-sm sm:text-base font-bold text-[#241F1A] leading-none truncate"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  {hallCapacity}
                </span>
              </div>
              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0 group-hover:border-[#B08D57] group-hover:bg-[#FFF8EB] transition-colors">
                <Users className="w-4 h-4 text-[#670E10] group-hover:text-[#B08D57] transition-colors" />
              </div>
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

        {/* ── 3. Desktop Inline Expansion Panel (Expands when clicked on Desktop) ── */}
        {!isMobile && expandedPanel && (
          <div className="mt-5 pt-5 border-t border-[#DFD3C3] animate-fade-in transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#D8AA67]" />
                <h3
                  className="text-lg font-bold text-[#670E10]"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  {expandedPanel === 'calendar' || expandedPanel === 'hallCalendar'
                    ? 'Select Stay & Event Dates'
                    : expandedPanel === 'guests'
                    ? 'Guests & Chambers Selection'
                    : 'Party Hall Guest Capacity'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClosePanel}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#7A6F62] hover:text-[#241F1A] transition cursor-pointer"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(expandedPanel === 'calendar' || expandedPanel === 'hallCalendar') && renderCalendarContent()}
            {expandedPanel === 'guests' && renderGuestsStepperContent()}
            {expandedPanel === 'hallCapacity' && renderHallCapacityContent()}
          </div>
        )}
      </div>

      {/* ── 4. Mobile Dialog / Pop-out Modal (With Opening/Closing Animations) ── */}
      {isMobile &&
        mobileModalOpen &&
        mounted &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClosePanel();
            }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 animate-fade-in-backdrop"
          >
            <div
              className="w-full max-h-[88vh] bg-[#FAF7F2] rounded-t-[28px] border-t-2 border-x-2 border-[#D8AA67] shadow-2xl flex flex-col overflow-hidden animate-slide-up-modal"
              style={{ backgroundColor: '#FAF7F2' }}
            >
              {/* Drag Pill on Mobile */}
              <div className="w-12 h-1 bg-[#D8AA67]/50 rounded-full mx-auto mt-2.5 mb-1" />

              {/* Dialog Header */}
              <div className="px-5 py-3 border-b border-[#DFD3C3] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F7245] block">
                    {activeTab === 'rooms' ? 'Palace Reservation' : 'Celebration Hall'}
                  </span>
                  <h3
                    className="text-xl font-bold text-[#670E10]"
                    style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                  >
                    {expandedPanel === 'calendar' || expandedPanel === 'hallCalendar'
                      ? 'Select Dates'
                      : expandedPanel === 'guests'
                      ? 'Guests & Chambers'
                      : 'Hall Capacity'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleClosePanel}
                  className="p-2 rounded-full bg-black/5 hover:bg-black/10 text-[#670E10] transition cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dialog Scrollable Content */}
              <div className="p-4 sm:p-5 overflow-y-auto max-h-[68vh]">
                {(expandedPanel === 'calendar' || expandedPanel === 'hallCalendar') && renderCalendarContent()}
                {expandedPanel === 'guests' && renderGuestsStepperContent()}
                {expandedPanel === 'hallCapacity' && renderHallCapacityContent()}
              </div>

              {/* Dialog Bottom Action */}
              <div className="p-4 border-t border-[#DFD3C3] bg-[#F5F0E6] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleClosePanel}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#670E10] to-[#801417] text-[#FFF8EB] text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition cursor-pointer text-center"
                >
                  Confirm &bull; Continue
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
