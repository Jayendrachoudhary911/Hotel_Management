'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Unlock,
  X,
  Dog,
  Check,
  CalendarRange,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type TabType = 'rooms' | 'hall';
type DialogViewType = 'dates' | 'guests' | 'hallDate' | 'hallCapacity' | 'hallOccasion';

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

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('rooms');

  // Rooms Booking State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);

  // Rooms state:
  // Rule:
  // 1. When guests/adults is only 1 -> locked at 1.
  // 2. When adults > 1 -> user can select number of rooms (min 1, max adults).
  // 3. Do not auto-update to 2 rooms until guests reach 4, but user can update on preference regardlessly.
  const [rooms, setRooms] = useState(1);

  // Party Hall Booking State
  const [hallEventType, setHallEventType] = useState('Birthday Party');
  const [hallDate, setHallDate] = useState('');
  const [hallCapacity, setHallCapacity] = useState('35 – 50 Guests');

  // Master Dialog State (Both Desktop and Mobile use the expanding/collapsing dialog)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [dialogView, setDialogView] = useState<DialogViewType>('dates');

  // Calendar State
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  // 'in' = selecting check-in date; 'out' = selecting check-out date
  const [selectingField, setSelectingField] = useState<'in' | 'out'>('in');
  const [isCustomDateActive, setIsCustomDateActive] = useState(false);

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

  // ── Open Dialog with specific view ──
  const openDialog = (view: DialogViewType, targetField?: 'in' | 'out') => {
    if (targetField) {
      setSelectingField(targetField);
    }
    setDialogView(view);
    setIsClosing(false);
    setDialogOpen(true);
  };

  // ── Close Dialog with Collapsing Animation ──
  const closeDialog = () => {
    setIsClosing(true);
    setTimeout(() => {
      setDialogOpen(false);
      setIsClosing(false);
    }, 250); // Matches the 240ms dialogCollapse animation
  };

  // ── Adult Stepper Handler (Implements custom Room rules) ──
  const updateAdults = (newAdults: number) => {
    if (newAdults < 1) return;
    setAdults(newAdults);

    if (newAdults === 1) {
      // Rule 1: Locked only when guest is only 1
      setRooms(1);
    } else if (newAdults >= 4 && rooms < 2) {
      // Rule 3: Auto-update to 2 rooms when guests reach 4
      setRooms(2);
    } else if (rooms > newAdults) {
      // Cannot exceed number of adults
      setRooms(newAdults);
    }
  };

  // ── Rooms Stepper Handler ──
  const isRoomsLocked = adults === 1;
  const updateRooms = (newRooms: number) => {
    if (isRoomsLocked) return;
    const clamped = Math.max(1, Math.min(adults, newRooms));
    setRooms(clamped);
  };

  // ── Apply Stay Suggestion ──
  const applyStaySuggestion = (nights: number) => {
    const baseDate = checkIn ? parseYMD(checkIn) : new Date();
    const newCheckIn = toYMD(baseDate);
    const newCheckOut = toYMD(addDays(baseDate, nights));
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
    setIsCustomDateActive(false);
    setSelectingField('out');
  };

  // ── Date Selection Click Logic ──
  // Rule:
  // 1. If clicking a date before the checkin date, it counts as checkin date.
  // 2. After clicking that date, it auto switches to checkout date mode, and the next click will be checkout date.
  const handleDateClick = (dateStr: string) => {
    const todayStr = toYMD(new Date());
    if (dateStr < todayStr) return; // Disallow past dates

    if (activeTab === 'hall' || dialogView === 'hallDate') {
      setHallDate(dateStr);
      return;
    }

    // Rooms mode
    if (selectingField === 'in') {
      setCheckIn(dateStr);
      // If current checkOut is before or same as new checkIn, clear checkOut
      if (checkOut && dateStr >= checkOut) {
        setCheckOut('');
      }
      // Auto-switch to checkout date mode!
      setSelectingField('out');
    } else {
      // In checkout selection mode:
      if (dateStr > checkIn) {
        // Valid checkout date!
        setCheckOut(dateStr);
        // Completed range selection!
      } else {
        // User clicked a date before or equal to checkin date:
        // Counts as new check-in date, then auto-switches to check-out mode!
        setCheckIn(dateStr);
        setCheckOut('');
        setSelectingField('out');
      }
    }
  };

  // ── Submit Handlers ──
  const handleRoomsSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeDialog();
    router.push(
      `/rooms?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}&pets=${pets}&rooms=${rooms}&guests=${encodeURIComponent(
        guestsSummary
      )}`
    );
  };

  const handleHallSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeDialog();
    const el = document.getElementById('party-hall-enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(
        `/hotel#party-hall-enquiry?date=${hallDate}&type=${encodeURIComponent(
          hallEventType
        )}&capacity=${encodeURIComponent(hallCapacity)}`
      );
    }
  };

  // ── Days Generator for Custom Calendar ──
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

    // Next month filler
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ dayNumber: i, dateStr: toYMD(nextDate), isCurrentMonth: false });
    }

    return days;
  };

  const nextMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
  const todayStr = toYMD(new Date());

  // ── Render Shared Calendar Content ──
  const renderCalendarContent = () => {
    const monthsToDisplay = isMobile ? [calendarMonth] : [calendarMonth, nextMonth];

    return (
      <div className="flex flex-col space-y-4 animate-panel-fade-in">
        {/* Quick Stay Suggestions & Custom Dates Option */}
        {activeTab === 'rooms' && (
          <div className="flex flex-col space-y-2 pb-3 border-b border-[#DFD3C3]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F7245] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D8AA67]" />
                <span>Stay Duration Suggestions</span>
              </span>
              <span className="text-xs text-[#670E10] font-semibold">
                {checkIn && checkOut ? `${nightsCount} ${nightsCount === 1 ? 'Night' : 'Nights'} Selected` : 'Select dates'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {STAY_SUGGESTIONS.map((sug) => {
                const isSelected = !isCustomDateActive && nightsCount === sug.nights && checkOut;
                return (
                  <button
                    key={sug.nights}
                    type="button"
                    onClick={() => applyStaySuggestion(sug.nights)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#670E10] text-[#FFF8EB] border-[#D8AA67] shadow-sm scale-[1.02]'
                        : 'bg-[#FFF8EB] text-[#4A0A0C] border-[#DFD3C3] hover:border-[#D8AA67] hover:bg-[#F5F0E6]'
                    }`}
                  >
                    <span>{sug.label}</span>
                    <span className="opacity-75 text-[10px] ml-1 hidden sm:inline">({sug.sublabel})</span>
                  </button>
                );
              })}

              {/* Custom Dates Option Button */}
              <button
                type="button"
                onClick={() => {
                  setIsCustomDateActive(true);
                  setSelectingField('in');
                }}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer flex items-center space-x-1 ${
                  isCustomDateActive
                    ? 'bg-[#670E10] text-[#FFF8EB] border-[#D8AA67] shadow-sm'
                    : 'bg-[#FFF8EB] text-[#4A0A0C] border-[#DFD3C3] hover:border-[#D8AA67]'
                }`}
              >
                <CalendarRange className="w-3.5 h-3.5 mr-1" />
                <span>Custom Dates</span>
              </button>
            </div>

            {/* Selection Guidance Helper Pill */}
            <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-[#FAF5EB] border border-[#E8DFC9]">
              <span className="text-[#670E10] font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#670E10] animate-pulse" />
                {selectingField === 'in' ? (
                  <span>
                    <strong>Step 1:</strong> Click on your <strong>Check-In Date</strong>
                  </span>
                ) : (
                  <span>
                    <strong>Step 2:</strong> Next click will be your <strong>Check-Out Date</strong> (or click earlier date to reset Check-In)
                  </span>
                )}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectingField('in')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                    selectingField === 'in' ? 'bg-[#670E10] text-white' : 'text-[#8F7245] hover:underline'
                  }`}
                >
                  Check In: {formattedCheckIn.day} {formattedCheckIn.monthYear}
                </button>
                <span className="text-gray-400">&rarr;</span>
                <button
                  type="button"
                  onClick={() => setSelectingField('out')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                    selectingField === 'out' ? 'bg-[#670E10] text-white' : 'text-[#8F7245] hover:underline'
                  }`}
                >
                  Check Out: {checkOut ? `${formattedCheckOut.day} ${formattedCheckOut.monthYear}` : 'Select Date'}
                </button>
              </div>
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

                {/* Day labels */}
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
                    const isHallSelected = (activeTab === 'hall' || dialogView === 'hallDate') && d.dateStr === hallDate;

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
      </div>
    );
  };

  // ── Render Guests Stepper Content (With Custom Room Locking Rules) ──
  const renderGuestsStepperContent = () => {
    return (
      <div className="flex flex-col space-y-4 animate-panel-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 1. Adults Stepper */}
          <div className="p-4 rounded-2xl bg-white border border-[#DFD3C3] flex items-center justify-between shadow-2xs hover:border-[#D8AA67] transition">
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-[#241F1A]">Adults</span>
              <span className="text-[11px] text-[#7A6F62]">Ages 13 and above</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={adults <= 1}
                onClick={() => updateAdults(adults - 1)}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Decrease adults"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-[#241F1A]">{adults}</span>
              <button
                type="button"
                disabled={adults >= 10}
                onClick={() => updateAdults(adults + 1)}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Increase adults"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Children Stepper */}
          <div className="p-4 rounded-2xl bg-white border border-[#DFD3C3] flex items-center justify-between shadow-2xs hover:border-[#D8AA67] transition">
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
          <div className="p-4 rounded-2xl bg-white border border-[#DFD3C3] flex items-center justify-between shadow-2xs hover:border-[#D8AA67] transition">
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

          {/* 4. Chambers (Rooms) — Custom Room Stepper with Dynamic Locking Rule */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between shadow-2xs transition ${
              isRoomsLocked
                ? 'bg-[#F5EFE6] border-[#D8AA67]/60'
                : 'bg-white border-[#DFD3C3] hover:border-[#D8AA67]'
            }`}
          >
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-[#670E10] flex items-center gap-1.5">
                <span>Chambers (Rooms)</span>
                {isRoomsLocked ? (
                  <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-[#EFE8DD] text-[#8F7245] font-semibold gap-1">
                    <Lock className="w-3 h-3 text-[#8F7245]" />
                    <span>Locked (1 Guest)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#2D6A4F] font-semibold gap-1">
                    <Unlock className="w-3 h-3 text-[#2D6A4F]" />
                    <span>Customizable</span>
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#7A6F62]">
                {isRoomsLocked
                  ? '1 chamber fixed for 1 guest'
                  : `Select 1 to ${adults} chambers based on preference`}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={isRoomsLocked || rooms <= 1}
                onClick={() => updateRooms(rooms - 1)}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Decrease rooms"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-[#670E10]">{rooms}</span>
              <button
                type="button"
                disabled={isRoomsLocked || rooms >= adults}
                onClick={() => updateRooms(rooms + 1)}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Increase rooms"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-[#7A6F62] italic px-1">
          {adults === 1
            ? '* For single travelers, 1 dedicated deluxe chamber is automatically reserved.'
            : adults < 4
            ? '* 1 Chamber accommodates up to 3 guests comfortably. You can add extra chambers per your preference above.'
            : '* 2 Chambers recommended for 4 or more guests. Adjust count per your party’s preferences.'}
        </div>
      </div>
    );
  };

  // ── Render Party Hall Capacity Chips Content ──
  const renderHallCapacityContent = () => {
    return (
      <div className="flex flex-col space-y-4 animate-panel-fade-in">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8F7245]">
            Select Guest Capacity for Celebration Hall
          </span>
          <span className="text-xs font-semibold text-[#670E10]">Selected: {hallCapacity}</span>
        </div>

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
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1080px] mx-auto relative pt-4">
      {/* ── 1. Popping-Out Tabs with Inset Fillet Curves ── */}
      <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between px-0">
        <div
          className="relative inline-flex items-center px-1.5 sm:px-2 pt-1.5 sm:pt-2 pb-1 rounded-t-[16px] sm:rounded-t-[22px] border-t-2 border-x-2 transition-all mx-auto sm:mx-0 sm:ml-16 md:ml-20 lg:ml-24 shadow-2xs"
          style={{
            backgroundColor: '#FAF7F2',
            borderColor: '#D8AA67',
            marginBottom: '-2px',
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

          <div
            className="absolute -bottom-[2px] -left-[1px] -right-[1px] h-[4px] pointer-events-none"
            style={{ backgroundColor: '#FAF7F2' }}
          />

          {/* Segmented Control Capsule */}
          <div className="relative z-10 inline-flex p-1 rounded-[13px] sm:rounded-[18px] bg-[#EFE8DD]/85 border border-[#DFD3C3] shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('rooms')}
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
              onClick={() => setActiveTab('hall')}
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

      {/* ── 2. Master Booking Details Card (Clicking opens the expanding dialog) ── */}
      <div
        onClick={() => openDialog(activeTab === 'rooms' ? 'dates' : 'hallDate')}
        className="relative z-10 w-full rounded-[22px] sm:rounded-[32px] pt-6 sm:pt-7 pb-4 sm:pb-5 px-3.5 sm:px-5 transition-all duration-300 border-2 shadow-[0_26px_65px_-10px_rgba(35,12,14,0.32),0_4px_16px_rgba(0,0,0,0.06)] cursor-pointer group hover:shadow-[0_30px_70px_-10px_rgba(35,12,14,0.4)]"
        style={{
          backgroundColor: '#FAF7F2',
          borderColor: '#D8AA67',
        }}
      >
        {activeTab === 'rooms' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1.25fr_auto] gap-2.5 sm:gap-3 items-center">
            {/* 1. Check In Tile */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                openDialog('dates', 'in');
              }}
              className="relative flex items-center justify-between px-4 py-3 rounded-[18px] border border-[#DFD3C3] bg-white group-hover:border-[#B08D57] transition-all h-[64px]"
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
              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0">
                <CalendarIcon className="w-4 h-4 text-[#670E10]" />
              </div>
            </div>

            {/* 2. Nights Separator Pill */}
            <div className="hidden lg:flex flex-col items-center justify-center px-0.5">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] text-[#670E10] whitespace-nowrap shadow-2xs flex items-center gap-1">
                <span>🌙</span>
                <span>
                  {nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'}
                </span>
              </span>
            </div>

            {/* 3. Check Out Tile */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                openDialog('dates', 'out');
              }}
              className="relative flex items-center justify-between px-4 py-3 rounded-[18px] border border-[#DFD3C3] bg-white group-hover:border-[#B08D57] transition-all h-[64px]"
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
              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0">
                <CalendarIcon className="w-4 h-4 text-[#670E10]" />
              </div>
            </div>

            {/* 4. Guests & Chambers Tile */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                openDialog('guests');
              }}
              className="relative flex items-center justify-between px-4 py-3 rounded-[18px] border border-[#DFD3C3] bg-white group-hover:border-[#B08D57] transition-all h-[64px]"
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
              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-[#670E10]" />
              </div>
            </div>

            {/* 5. Search Chambers Button */}
            <div className="sm:col-span-2 lg:col-span-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openDialog('dates');
                }}
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
          </div>
        ) : (
          /* Party Hall Card View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.2fr_auto] gap-2.5 sm:gap-3 items-center">
            {/* Occasion */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                openDialog('hallOccasion');
              }}
              className="relative flex items-center justify-between px-4 py-3 rounded-[18px] border border-[#DFD3C3] bg-white group-hover:border-[#B08D57] transition-all h-[64px]"
            >
              <div className="flex flex-col text-left flex-1 min-w-0 mr-2">
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
              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0">
                <PartyPopper className="w-4 h-4 text-[#670E10]" />
              </div>
            </div>

            {/* Event Date */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                openDialog('hallDate');
              }}
              className="relative flex items-center justify-between px-4 py-3 rounded-[18px] border border-[#DFD3C3] bg-white group-hover:border-[#B08D57] transition-all h-[64px]"
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
              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0">
                <CalendarIcon className="w-4 h-4 text-[#670E10]" />
              </div>
            </div>

            {/* Hall Capacity */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                openDialog('hallCapacity');
              }}
              className="relative flex items-center justify-between px-4 py-3 rounded-[18px] border border-[#DFD3C3] bg-white group-hover:border-[#B08D57] transition-all h-[64px]"
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
              <div className="w-8 h-8 rounded-[12px] bg-[#FAF7F2] border border-[#DFD3C3] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-[#670E10]" />
              </div>
            </div>

            {/* Check Hall Button */}
            <div className="sm:col-span-2 lg:col-span-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openDialog('hallDate');
                }}
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
          </div>
        )}
      </div>

      {/* ── 3. Master Expanding & Collapsing Dialog (Triggered on Desktop & Mobile) ── */}
      {dialogOpen &&
        mounted &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) closeDialog();
            }}
            className={`fixed inset-0 z-[120] bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 lg:p-8 transition-opacity duration-250 ${
              isClosing ? 'opacity-0' : 'animate-fade-in-backdrop'
            }`}
          >
            <div
              className={`relative w-full max-w-[1080px] bg-[#FAF7F2] rounded-[24px] sm:rounded-[32px] border-2 border-[#D8AA67] shadow-[0_30px_90px_rgba(30,8,10,0.65)] flex flex-col overflow-hidden max-h-[92vh] ${
                isClosing ? 'animate-dialog-collapse' : 'animate-dialog-expand'
              }`}
              style={{ backgroundColor: '#FAF7F2' }}
            >
              {/* Dialog Top Bar / Header */}
              <div className="px-5 sm:px-8 pt-5 pb-4 border-b border-[#DFD3C3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] shrink-0">
                {/* Segmented Tab Switcher inside Dialog */}
                <div className="inline-flex p-1 rounded-[14px] bg-[#EFE8DD] border border-[#DFD3C3] self-start">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('rooms');
                      setDialogView('dates');
                    }}
                    className={`flex items-center space-x-2 px-4 py-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'rooms'
                        ? 'bg-gradient-to-r from-[#670E10] to-[#801417] text-[#FFF8EB] shadow-sm'
                        : 'text-[#6B5E4F] hover:text-[#241F1A]'
                    }`}
                  >
                    <BedDouble className="w-3.5 h-3.5 text-[#D8AA67]" />
                    <span>Rooms &amp; Suites</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('hall');
                      setDialogView('hallDate');
                    }}
                    className={`flex items-center space-x-2 px-4 py-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'hall'
                        ? 'bg-gradient-to-r from-[#670E10] to-[#801417] text-[#FFF8EB] shadow-sm'
                        : 'text-[#6B5E4F] hover:text-[#241F1A]'
                    }`}
                  >
                    <PartyPopper className="w-3.5 h-3.5 text-[#D8AA67]" />
                    <span>Party Hall (25–50 Pax)</span>
                  </button>
                </div>

                {/* Sub-View Navigation Pills inside Dialog with Animated Indicator */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {activeTab === 'rooms' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setDialogView('dates')}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          dialogView === 'dates'
                            ? 'bg-[#670E10] text-[#FFF8EB] border-[#D8AA67] shadow-xs'
                            : 'bg-white text-[#7A6F62] border-[#DFD3C3] hover:border-[#D8AA67]'
                        }`}
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-[#D8AA67]" />
                        <span>Stay Dates</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDialogView('guests')}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          dialogView === 'guests'
                            ? 'bg-[#670E10] text-[#FFF8EB] border-[#D8AA67] shadow-xs'
                            : 'bg-white text-[#7A6F62] border-[#DFD3C3] hover:border-[#D8AA67]'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5 text-[#D8AA67]" />
                        <span>Guests &amp; Chambers</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setDialogView('hallDate')}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          dialogView === 'hallDate'
                            ? 'bg-[#670E10] text-[#FFF8EB] border-[#D8AA67] shadow-xs'
                            : 'bg-white text-[#7A6F62] border-[#DFD3C3] hover:border-[#D8AA67]'
                        }`}
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-[#D8AA67]" />
                        <span>Event Date</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDialogView('hallCapacity')}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          dialogView === 'hallCapacity'
                            ? 'bg-[#670E10] text-[#FFF8EB] border-[#D8AA67] shadow-xs'
                            : 'bg-white text-[#7A6F62] border-[#DFD3C3] hover:border-[#D8AA67]'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5 text-[#D8AA67]" />
                        <span>Hall Capacity</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDialogView('hallOccasion')}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          dialogView === 'hallOccasion'
                            ? 'bg-[#670E10] text-[#FFF8EB] border-[#D8AA67] shadow-xs'
                            : 'bg-white text-[#7A6F62] border-[#DFD3C3] hover:border-[#D8AA67]'
                        }`}
                      >
                        <PartyPopper className="w-3.5 h-3.5 text-[#D8AA67]" />
                        <span>Occasion</span>
                      </button>
                    </>
                  )}

                  {/* Close (X) Button */}
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="p-1.5 rounded-full hover:bg-black/5 text-[#7A6F62] hover:text-[#241F1A] transition cursor-pointer ml-2"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Dialog Scrollable Interactive Body */}
              <div className="p-4 sm:p-7 overflow-y-auto flex-1 max-h-[66vh]">
                {(dialogView === 'dates' || dialogView === 'hallDate') && renderCalendarContent()}
                {dialogView === 'guests' && renderGuestsStepperContent()}
                {dialogView === 'hallCapacity' && renderHallCapacityContent()}
                {dialogView === 'hallOccasion' && (
                  <div className="flex flex-col space-y-4 animate-panel-fade-in">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8F7245]">
                      Choose Occasion for Royal Celebration
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: 'Birthday Party', desc: 'Decorated banquet setup with royal Mewari dessert service' },
                        { title: 'Anniversary & Milestone Party', desc: 'Candlelit courtyard setup with live instrumental sitar' },
                        { title: 'Romantic Candlelight Dinner', desc: 'Private rooftop pavilion dinner overlooking lake Pichola' },
                        { title: 'Corporate Event / Conference', desc: 'Audio-visual setup with palace high tea & catering' },
                        { title: 'Pre-Wedding & Sangeet Gathering', desc: 'Starlit amphitheatre with folk dance & music setup' },
                      ].map((item) => (
                        <div
                          key={item.title}
                          onClick={() => {
                            setHallEventType(item.title);
                            setDialogView('hallDate');
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            hallEventType === item.title
                              ? 'bg-[#FFF8EB] border-[#670E10] ring-2 ring-[#D8AA67] shadow-sm'
                              : 'bg-white border-[#DFD3C3] hover:border-[#D8AA67]'
                          }`}
                        >
                          <span
                            className="text-base font-bold text-[#670E10] mb-1"
                            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                          >
                            {item.title}
                          </span>
                          <span className="text-xs text-[#7A6F62]">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dialog Bottom Action Summary Bar */}
              <div className="p-4 sm:p-5 border-t border-[#DFD3C3] bg-[#F5EFE6] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs text-[#241F1A] text-center sm:text-left">
                  {activeTab === 'rooms' ? (
                    <div>
                      <span className="font-semibold text-[#8F7245]">Stay: </span>
                      <span className="font-bold text-[#670E10]">
                        {formattedCheckIn.day} {formattedCheckIn.monthYear} &rarr; {formattedCheckOut.day}{' '}
                        {formattedCheckOut.monthYear} ({nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'})
                      </span>
                      <span className="mx-2 text-gray-400 hidden sm:inline">&bull;</span>
                      <span className="font-semibold text-[#8F7245]">Chambers: </span>
                      <span className="font-bold text-[#670E10]">{guestsSummary}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-semibold text-[#8F7245]">Event: </span>
                      <span className="font-bold text-[#670E10]">
                        {hallEventType} &bull; {formattedHallDate.day} {formattedHallDate.monthYear} &bull; {hallCapacity}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-[#D8AA67] bg-white text-[#670E10] text-xs font-bold tracking-wide hover:bg-[#FFF8EB] transition cursor-pointer"
                  >
                    Done &bull; Save Selection
                  </button>

                  <button
                    type="button"
                    onClick={activeTab === 'rooms' ? handleRoomsSearchSubmit : handleHallSearchSubmit}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#670E10] via-[#7E1418] to-[#550B0D] text-[#FFF8EB] text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <span>{activeTab === 'rooms' ? 'Search Chambers' : 'Check Hall Availability'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D8AA67]" />
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
