'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar as CalendarIcon,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Lock,
  X,
  Dog,
  ChevronDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type PanelType = 'calendar' | 'guests';

interface StaySuggestion {
  label: string;
  sublabel: string;
  nights: number;
}

const STAY_SUGGESTIONS: StaySuggestion[] = [
  { label: '✨ Custom Dates', sublabel: 'Pick Any Range', nights: 0 },
  { label: '1 Night', sublabel: 'Quick Day Stay', nights: 1 },
  { label: '2 Nights', sublabel: 'Weekend Getaway', nights: 2 },
  { label: '3 Nights', sublabel: 'Royal Retreat (Popular)', nights: 3 },
  { label: '5 Nights', sublabel: 'Heritage Exploration', nights: 5 },
  { label: '7 Nights', sublabel: 'Full Imperial Week', nights: 7 },
];

function toYMD(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseYMD(str: string): Date {
  const parts = str.split('-').map(Number);
  if (parts.length === 3) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date();
}

function addDays(d: Date, days: number): Date {
  const res = new Date(d);
  res.setDate(res.getDate() + days);
  return res;
}

interface RoomsFilterBarProps {
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export function RoomsFilterBar({
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
}: RoomsFilterBarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Filter State
  const [checkIn, setCheckIn] = useState(initialCheckIn || '');
  const [checkOut, setCheckOut] = useState(initialCheckOut || '');
  const [adults, setAdults] = useState(initialGuests || 2);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [userHasCustomizedRooms, setUserHasCustomizedRooms] = useState(false);

  // Dialog & Drawer state
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>('calendar');
  const [beakLeftPx, setBeakLeftPx] = useState<number>(100);

  // Display Awareness State
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
  const [maxContentHeight, setMaxContentHeight] = useState<number>(440);

  // Calendar State
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [selectingField, setSelectingField] = useState<'in' | 'out'>('in');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Refs
  const barRootRef = useRef<HTMLDivElement>(null);
  const checkInTileRef = useRef<HTMLDivElement>(null);
  const checkOutTileRef = useRef<HTMLDivElement>(null);
  const guestsTileRef = useRef<HTMLDivElement>(null);
  const dialogCardRef = useRef<HTMLDivElement>(null);
  const activeTileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    if (!checkIn) {
      setCheckIn(toYMD(now));
    }
    if (!checkOut) {
      setCheckOut(toYMD(addDays(now, 3)));
    }
    setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [checkIn, checkOut]);

  // Format Display Date Object
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return { day: '--', monthYear: 'Select Date', weekday: '', dateFormatted: '--' };
    try {
      const d = parseYMD(dateStr);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return {
        day: pad(d.getDate()),
        monthYear: `${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getFullYear()}`,
        weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateFormatted: `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`,
      };
    } catch {
      return { day: '--', monthYear: dateStr, weekday: '', dateFormatted: dateStr };
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
  const nightsCount = calculateNights(checkIn, checkOut);

  const guestsSummary = `${adults} ${adults === 1 ? 'Adult' : 'Adults'}${
    children > 0 ? `, ${children} ${children === 1 ? 'Child' : 'Children'}` : ''
  } • ${rooms} ${rooms === 1 ? 'Chamber' : 'Chambers'}${
    pets > 0 ? ` • ${pets} ${pets === 1 ? 'Pet' : 'Pets'}` : ''
  }`;

  // ── Display Awareness Calculation ──
  const updateDisplayAwareness = useCallback(() => {
    if (!barRootRef.current) return;
    const barRect = barRootRef.current.getBoundingClientRect();
    const windowH = window.innerHeight;
    const spaceBelow = windowH - barRect.bottom;
    const spaceAbove = barRect.top;

    const flipToTop = spaceBelow < 370 && spaceAbove > spaceBelow;
    setPlacement(flipToTop ? 'top' : 'bottom');

    const availableH = flipToTop
      ? Math.max(260, Math.min(480, spaceAbove - 28))
      : Math.max(260, Math.min(480, spaceBelow - 28));

    setMaxContentHeight(availableH);
  }, []);

  // ── Calibrate Beak / Arrow Position (Sub-pixel exact tile alignment) ──
  const calibrateBeak = useCallback((targetTile: HTMLDivElement | null) => {
    if (targetTile) {
      activeTileRef.current = targetTile;
    }
    requestAnimationFrame(() => {
      const tile = activeTileRef.current;
      if (tile && dialogCardRef.current) {
        const tileRect = tile.getBoundingClientRect();
        const dialogRect = dialogCardRef.current.getBoundingClientRect();
        const tileCenterX = tileRect.left + tileRect.width / 2;
        const leftInDialog = tileCenterX - dialogRect.left;
        const clampedPx = Math.max(20, Math.min(dialogRect.width - 20, leftInDialog));
        setBeakLeftPx(clampedPx);
      }
    });
  }, []);

  // ── Open Tooltip Dialog with Beak Alignment (No page scroll) ──
  const openTooltip = (
    panel: PanelType,
    targetTileRef: React.RefObject<HTMLDivElement | null>,
    targetDateField?: 'in' | 'out'
  ) => {
    setActivePanel(panel);
    if (targetDateField) {
      setSelectingField(targetDateField);
    }

    if (targetTileRef.current) {
      activeTileRef.current = targetTileRef.current;
    }

    updateDisplayAwareness();
    setIsClosing(false);
    setTooltipOpen(true);

    calibrateBeak(targetTileRef.current);
  };

  const closeTooltipWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      setTooltipOpen(false);
      setIsClosing(false);
    }, 180);
  };

  // Re-calibrate beak whenever open state, panel, or field changes
  useEffect(() => {
    if (tooltipOpen) {
      calibrateBeak(activeTileRef.current);
    }
  }, [tooltipOpen, activePanel, selectingField, calibrateBeak]);

  // Handle outside clicks: Keep bar operatable, only close when clicking outside both bar & dialog
  useEffect(() => {
    if (!tooltipOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dialogCardRef.current && dialogCardRef.current.contains(target)) {
        return;
      }
      if (barRootRef.current && barRootRef.current.contains(target)) {
        return;
      }
      closeTooltipWithAnimation();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [tooltipOpen]);

  // Keep tooltip aligned & check scroll bounds
  useEffect(() => {
    if (!tooltipOpen) return;

    const handleScrollOrResize = () => {
      if (!barRootRef.current) return;
      const barRect = barRootRef.current.getBoundingClientRect();
      if (barRect.bottom < 40 || barRect.top > window.innerHeight - 40) {
        setTooltipOpen(false);
        return;
      }
      updateDisplayAwareness();
      calibrateBeak(activeTileRef.current);
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [tooltipOpen, updateDisplayAwareness, calibrateBeak]);

  // ── Adults & Rooms Logic ──
  const handleAdultsChange = (newAdults: number) => {
    if (newAdults < 1 || newAdults > 10) return;
    setAdults(newAdults);

    if (newAdults === 1) {
      setRooms(1);
    } else if (!userHasCustomizedRooms) {
      if (newAdults < 4) {
        setRooms(1);
      } else {
        setRooms(2);
      }
    } else {
      setRooms((prev) => Math.min(prev, newAdults));
    }
  };

  const handleRoomsChange = (delta: number) => {
    if (adults === 1) return;
    const newRooms = rooms + delta;
    if (newRooms >= 1 && newRooms <= adults) {
      setUserHasCustomizedRooms(true);
      setRooms(newRooms);
    }
  };

  // ── Stay Suggestions Handler ──
  const applyStaySuggestion = (nights: number) => {
    if (nights === 0) {
      setIsCustomMode(true);
      setSelectingField('in');
      calibrateBeak(checkInTileRef.current);
      return;
    }

    setIsCustomMode(false);
    const baseDate = checkIn ? parseYMD(checkIn) : new Date();
    const newCheckIn = toYMD(baseDate);
    const newCheckOut = toYMD(addDays(baseDate, nights));
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
    setSelectingField('out');
    calibrateBeak(checkOutTileRef.current);
  };

  // ── Date Picking State Machine with Bar Auto-Switching ──
  const handleDateClick = (dateStr: string) => {
    const todayStr = toYMD(new Date());
    if (dateStr < todayStr) return;

    if (selectingField === 'in') {
      setCheckIn(dateStr);
      setIsCustomMode(true);
      if (checkOut && dateStr >= checkOut) {
        const nextDay = toYMD(addDays(parseYMD(dateStr), 1));
        setCheckOut(nextDay);
      }
      setSelectingField('out');
      calibrateBeak(checkOutTileRef.current);
    } else {
      if (dateStr > checkIn) {
        setCheckOut(dateStr);
        setIsCustomMode(true);
      } else {
        setCheckIn(dateStr);
        const nextDay = toYMD(addDays(parseYMD(dateStr), 1));
        setCheckOut(nextDay);
        setIsCustomMode(true);
        setSelectingField('out');
        calibrateBeak(checkOutTileRef.current);
      }
    }
  };

  // Form Submit Handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${adults}&rooms=${rooms}`);
  };

  // Calendar Day Matrix Generator
  const getMonthDays = (baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { dayNumber: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, d);
      days.push({ dayNumber: d, dateStr: toYMD(prevDate), isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currDate = new Date(year, month, i);
      days.push({ dayNumber: i, dateStr: toYMD(currDate), isCurrentMonth: true });
    }

    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ dayNumber: i, dateStr: toYMD(nextDate), isCurrentMonth: false });
    }

    return days;
  };

  const nextMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
  const todayStr = toYMD(new Date());

  // ── Render Calendar Content ──
  const renderCalendarContent = () => {
    const monthsToDisplay = isMobile ? [calendarMonth] : [calendarMonth, nextMonth];

    return (
      <div className="flex flex-col space-y-3.5">
        {/* Quick Stay Suggestions Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {STAY_SUGGESTIONS.map((sug) => {
            const isSelected =
              sug.nights === 0 ? isCustomMode : !isCustomMode && nightsCount === sug.nights;
            return (
              <button
                key={sug.label}
                type="button"
                onClick={() => applyStaySuggestion(sug.nights)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#670E10] text-[#FFF8EB] border-[#D8AA67] shadow-xs'
                    : 'bg-[#FFF8EB] text-[#4A0A0C] border-[#DFD3C3] hover:border-[#D8AA67] hover:bg-[#F5F0E6]'
                }`}
              >
                <span>{sug.label}</span>
                <span className="opacity-75 text-[10px] ml-1 hidden sm:inline">({sug.sublabel})</span>
              </button>
            );
          })}
        </div>

        {/* Dual Calendar Months Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {monthsToDisplay.map((mDate, mIdx) => {
            const days = getMonthDays(mDate);
            const monthName = mDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            return (
              <div key={monthName} className="flex flex-col">
                <div className="flex items-center justify-between mb-2.5 px-1">
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

                <div className="grid grid-cols-7 text-center mb-1 text-[11px] font-semibold text-[#8F7245]">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                {/* Days Grid with Continuous Ribbon Design */}
                <div className="grid grid-cols-7 gap-y-1 text-center">
                  {days.map((d, dIdx) => {
                    const isPast = d.dateStr < todayStr;
                    const isCheckInDay = d.dateStr === checkIn;
                    const isCheckOutDay = d.dateStr === checkOut;
                    const isInRange = checkIn && checkOut && d.dateStr > checkIn && d.dateStr < checkOut;
                    const hasRange = Boolean(checkIn && checkOut && checkOut > checkIn);

                    return (
                      <div key={`${d.dateStr}-${dIdx}`} className="relative h-8 flex items-center justify-center">
                        {/* Continuous connected range ribbon background */}
                        {hasRange && isCheckInDay && (
                          <div className="absolute inset-y-0.5 right-0 w-1/2 bg-[#EBDDC7] pointer-events-none" />
                        )}
                        {hasRange && isCheckOutDay && (
                          <div className="absolute inset-y-0.5 left-0 w-1/2 bg-[#EBDDC7] pointer-events-none" />
                        )}
                        {hasRange && isInRange && (
                          <div className="absolute inset-y-0.5 inset-x-0 bg-[#EBDDC7] pointer-events-none" />
                        )}

                        {/* Interactive Day Cell Button */}
                        <button
                          type="button"
                          disabled={isPast}
                          onClick={() => handleDateClick(d.dateStr)}
                          className={`relative z-10 text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                            isPast
                              ? 'h-8 w-8 rounded-full text-[#C5B8A5] opacity-40 cursor-not-allowed'
                              : isCheckInDay || isCheckOutDay
                              ? 'h-8 w-8 rounded-full bg-[#670E10] text-[#FFF8EB] font-bold shadow-xs ring-2 ring-[#D8AA67] scale-105'
                              : isInRange
                              ? 'w-full h-8 text-[#4A0A0C] font-bold hover:bg-[#D8AA67]/40'
                              : !d.isCurrentMonth
                              ? 'h-8 w-8 rounded-full text-[#B0A290] hover:bg-black/5'
                              : 'h-8 w-8 rounded-full text-[#241F1A] hover:bg-[#FFF8EB] hover:text-[#670E10] hover:ring-1 hover:ring-[#D8AA67]'
                          }`}
                        >
                          {d.dayNumber}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Dates Summary Banner & Apply Button */}
        <div className="pt-3 border-t border-[#DFD3C3] flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-[#241F1A]">
            <span className="font-semibold text-[#8F7245]">Stay Duration:</span>
            <span className="font-bold text-[#670E10]">
              {formattedCheckIn.day} {formattedCheckIn.monthYear} &rarr;{' '}
              {checkOut ? `${formattedCheckOut.day} ${formattedCheckOut.monthYear}` : 'Select Departure'}{' '}
              {checkOut && `(${nightsCount} ${nightsCount === 1 ? 'Night' : 'Nights'})`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => openTooltip('guests', guestsTileRef)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#670E10] to-[#801417] text-[#FFF8EB] text-xs font-bold tracking-wide shadow hover:shadow-md transition cursor-pointer flex items-center space-x-1.5"
          >
            <span>Confirm Dates &bull; Select Guests &rarr;</span>
          </button>
        </div>
      </div>
    );
  };

  // ── Render Guests Stepper Content ──
  const renderGuestsStepperContent = () => {
    const isSoloGuest = adults === 1;

    return (
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Adults Stepper */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#DFD3C3] flex items-center justify-between shadow-2xs">
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-[#241F1A]">Adults</span>
              <span className="text-[11px] text-[#7A6F62]">Ages 13 and above</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={adults <= 1}
                onClick={() => handleAdultsChange(adults - 1)}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Decrease adults"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-[#241F1A]">{adults}</span>
              <button
                type="button"
                disabled={adults >= 10}
                onClick={() => handleAdultsChange(adults + 1)}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Increase adults"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Children Stepper */}
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

          {/* Pets Stepper */}
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

          {/* Chambers Stepper */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between shadow-2xs transition-colors ${
              isSoloGuest ? 'bg-[#F5EFE6] border-[#D8AA67]/60' : 'bg-white border-[#DFD3C3]'
            }`}
          >
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-[#241F1A] flex items-center gap-1.5">
                <span>Chambers (Rooms)</span>
                {isSoloGuest && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#D8AA67]/20 text-[#670E10]">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#7A6F62]">
                {isSoloGuest
                  ? '1 guest = 1 chamber (locked)'
                  : adults < 4
                  ? '1 chamber default (customizable)'
                  : '2 chambers recommended'}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={isSoloGuest || rooms <= 1}
                onClick={() => handleRoomsChange(-1)}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Decrease chambers"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-[#241F1A]">{rooms}</span>
              <button
                type="button"
                disabled={isSoloGuest || rooms >= adults}
                onClick={() => handleRoomsChange(1)}
                className="w-8 h-8 rounded-full border border-[#D8AA67] flex items-center justify-center text-[#670E10] hover:bg-[#FFF8EB] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Increase chambers"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#DFD3C3] flex items-center justify-between gap-3">
          <span className="text-xs text-[#7A6F62] italic">
            * 1 chamber is reserved by default for up to 3 guests; 2 chambers auto-suggested for 4+ guests.
          </span>
          <button
            type="button"
            onClick={closeTooltipWithAnimation}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#670E10] to-[#801417] text-[#FFF8EB] text-xs font-bold tracking-wide shadow hover:shadow-md transition cursor-pointer"
          >
            Apply Guests &amp; Chambers
          </button>
        </div>
      </div>
    );
  };

  const getPanelHeader = () => {
    if (activePanel === 'calendar') {
      return {
        icon: <CalendarIcon className="w-4 h-4 text-[#670E10]" />,
        title: selectingField === 'in' ? 'Select Check-In Date' : 'Select Check-Out Date',
        subtitle:
          selectingField === 'in'
            ? 'Click your arrival date in the calendar'
            : `${formattedCheckIn.day} ${formattedCheckIn.monthYear} selected • Choose departure date`,
      };
    }
    return {
      icon: <Users className="w-4 h-4 text-[#670E10]" />,
      title: 'Guests & Chambers',
      subtitle: 'Tailor adults, children, pets & room allocation',
    };
  };

  const panelHeader = getPanelHeader();

  return (
    <div ref={barRootRef} className="relative w-full max-w-4xl mx-auto mb-12">
      {/* ── Filter Bar Card (Styled to match rooms page image) ── */}
      <div className="bg-white rounded-xl border border-[#D4CBBB]/70 shadow-sm p-3 sm:p-4">
        <form onSubmit={handleFormSubmit} className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 items-center">
          {/* 1. Check In Tile (Col-span 1 on mobile: Check In & Check Out in a row) */}
          <div
            ref={checkInTileRef}
            onClick={() => {
              if (tooltipOpen && activePanel === 'calendar' && selectingField === 'in') {
                closeTooltipWithAnimation();
              } else {
                openTooltip('calendar', checkInTileRef, 'in');
              }
            }}
            className={`col-span-1 flex items-center space-x-2.5 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
              tooltipOpen && activePanel === 'calendar' && selectingField === 'in'
                ? 'border-[#670E10] ring-2 ring-[#D8AA67] bg-[#FFF8EB] shadow-xs'
                : 'border-[#E5DFD5] bg-[#FAF8F3]/60 hover:border-[#D8AA67]'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-[#8F7245] shrink-0" />
            <div className="w-full text-left min-w-0">
              <span className="block text-[10px] uppercase font-bold text-[#7A6F62] leading-none mb-1">
                Check In
              </span>
              <span className="block text-xs text-[#670E10] font-semibold leading-tight truncate">
                {formattedCheckIn.dateFormatted}
              </span>
            </div>
            <CalendarIcon className="w-3.5 h-3.5 text-[#B08D57]/60 ml-auto hidden min-[360px]:block" />
          </div>

          {/* 2. Check Out Tile (Col-span 1 on mobile: Check In & Check Out in a row) */}
          <div
            ref={checkOutTileRef}
            onClick={() => {
              if (tooltipOpen && activePanel === 'calendar' && selectingField === 'out') {
                closeTooltipWithAnimation();
              } else {
                openTooltip('calendar', checkOutTileRef, 'out');
              }
            }}
            className={`col-span-1 flex items-center space-x-2.5 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
              tooltipOpen && activePanel === 'calendar' && selectingField === 'out'
                ? 'border-[#670E10] ring-2 ring-[#D8AA67] bg-[#FFF8EB] shadow-xs'
                : 'border-[#E5DFD5] bg-[#FAF8F3]/60 hover:border-[#D8AA67]'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-[#8F7245] shrink-0" />
            <div className="w-full text-left min-w-0">
              <span className="block text-[10px] uppercase font-bold text-[#7A6F62] leading-none mb-1">
                Check Out
              </span>
              <span className="block text-xs text-[#670E10] font-semibold leading-tight truncate">
                {formattedCheckOut.dateFormatted}
              </span>
            </div>
            <CalendarIcon className="w-3.5 h-3.5 text-[#B08D57]/60 ml-auto hidden min-[360px]:block" />
          </div>

          {/* 3. Guests Tile (Col-span 2 on mobile: full width row) */}
          <div
            ref={guestsTileRef}
            onClick={() => {
              if (tooltipOpen && activePanel === 'guests') {
                closeTooltipWithAnimation();
              } else {
                openTooltip('guests', guestsTileRef);
              }
            }}
            className={`col-span-2 sm:col-span-1 flex items-center space-x-2.5 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
              tooltipOpen && activePanel === 'guests'
                ? 'border-[#670E10] ring-2 ring-[#D8AA67] bg-[#FFF8EB] shadow-xs'
                : 'border-[#E5DFD5] bg-[#FAF8F3]/60 hover:border-[#D8AA67]'
            }`}
          >
            <Users className="w-4 h-4 text-[#8F7245] shrink-0" />
            <div className="w-full text-left">
              <span className="block text-[10px] uppercase font-bold text-[#7A6F62] leading-none mb-1">
                Guests
              </span>
              <span className="block text-xs text-[#670E10] font-semibold leading-tight truncate">
                {adults} {adults === 1 ? 'Adult' : 'Adults'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#670E10] ml-auto shrink-0" />
          </div>

          {/* 4. Search Rooms Button (Col-span 2 on mobile: full width row) */}
          <div className="col-span-2 sm:col-span-1">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] font-medium text-xs tracking-wide transition-all shadow flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
            >
              <Search className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>Search Rooms</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── Desktop Floating Tooltip Popover (Anchored with pixel-precision beak) ── */}
      {!isMobile && tooltipOpen && (
        <div
          ref={dialogCardRef}
          className={`absolute z-50 ${
            placement === 'top'
              ? 'bottom-[calc(100%+12px)] origin-bottom'
              : 'top-[calc(100%+12px)] origin-top'
          } ${
            activePanel === 'guests'
              ? 'right-0 sm:right-2 w-full max-w-[540px]'
              : 'left-0 sm:left-2 w-full max-w-[700px]'
          } rounded-[22px] border-2 border-[#D8AA67] bg-[#FAF7F2] shadow-[0_24px_70px_-10px_rgba(35,10,14,0.38),0_6px_20px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden ${
            placement === 'top'
              ? isClosing
                ? 'animate-tooltip-collapse-top'
                : 'animate-tooltip-expand-top'
              : isClosing
              ? 'animate-tooltip-collapse'
              : 'animate-tooltip-expand'
          }`}
        >
          {/* Beak Arrow */}
          {placement === 'bottom' ? (
            <div
              className="absolute -top-[9px] w-4 h-4 rotate-45 border-t-2 border-l-2 border-[#D8AA67] bg-[#FAF7F2] -translate-x-1/2 pointer-events-none z-20 shadow-xs transition-all duration-200"
              style={{ left: `${beakLeftPx}px` }}
            />
          ) : (
            <div
              className="absolute -bottom-[9px] w-4 h-4 rotate-45 border-b-2 border-r-2 border-[#D8AA67] bg-[#FAF7F2] -translate-x-1/2 pointer-events-none z-20 shadow-xs transition-all duration-200"
              style={{ left: `${beakLeftPx}px` }}
            />
          )}

            {/* Header */}
            <div className="px-5 py-3 border-b border-[#DFD3C3] flex items-center justify-between bg-[#F5F0E6]/90">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#D8AA67]/60 flex items-center justify-center shrink-0">
                  {panelHeader.icon}
                </div>
                <div className="flex flex-col text-left">
                  <span
                    className="text-base font-bold text-[#670E10] leading-none"
                    style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                  >
                    {panelHeader.title}
                  </span>
                  <span className="text-[11px] text-[#7A6F62] mt-0.5">
                    {panelHeader.subtitle}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeTooltipWithAnimation}
                className="p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-[#670E10] transition cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              className="p-5 overflow-y-auto"
              style={{ maxHeight: `${maxContentHeight}px` }}
            >
              {activePanel === 'calendar' && renderCalendarContent()}
              {activePanel === 'guests' && renderGuestsStepperContent()}
            </div>
          </div>
        )
      }

      {/* ── Mobile Bottom Sheet Drawer ── */}
      {isMobile &&
        tooltipOpen &&
        mounted &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) closeTooltipWithAnimation();
            }}
            className={`fixed inset-0 z-[150] bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 ${
              isClosing ? 'animate-fade-out-backdrop' : 'animate-fade-in-backdrop'
            }`}
          >
            <div
              className={`w-full max-h-[88vh] rounded-t-[28px] border-t-2 border-x-2 border-[#D8AA67] bg-[#FAF7F2] flex flex-col overflow-hidden ${
                isClosing ? 'animate-slide-down-modal' : 'animate-slide-up-modal'
              }`}
            >
              {/* Drag Handle */}
              <div className="w-12 h-1 bg-[#D8AA67]/50 rounded-full mx-auto mt-2.5 mb-1" />

              {/* Mobile Header */}
              <div className="px-5 py-3 border-b border-[#DFD3C3] flex items-center justify-between bg-[#F5F0E6]/90">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#D8AA67]/60 flex items-center justify-center shrink-0">
                    {panelHeader.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <span
                      className="text-base font-bold text-[#670E10] leading-none"
                      style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                    >
                      {panelHeader.title}
                    </span>
                    <span className="text-[11px] text-[#7A6F62] mt-0.5 truncate max-w-[240px]">
                      {panelHeader.subtitle}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeTooltipWithAnimation}
                  className="p-2 rounded-full bg-black/5 text-[#670E10]"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 overflow-y-auto max-h-[68vh]">
                {activePanel === 'calendar' && renderCalendarContent()}
                {activePanel === 'guests' && renderGuestsStepperContent()}
              </div>

              {/* Mobile Action Bottom Bar */}
              <div className="p-3.5 border-t border-[#DFD3C3] bg-[#F5F0E6] flex items-center justify-between">
                <button
                  type="button"
                  onClick={closeTooltipWithAnimation}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#670E10] to-[#801417] text-[#FFF8EB] text-sm font-bold tracking-wide shadow-md transition text-center cursor-pointer"
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
