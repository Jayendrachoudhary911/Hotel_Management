'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  UtensilsCrossed,
  Coffee,
  CheckCircle2,
  Sparkles,
  X,
  Phone,
  User,
  MessageCircle,
} from 'lucide-react';

interface TableReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultVenue?: 'restaurant' | 'cafe';
}

const TIME_SLOTS = [
  '12:30 PM (Lunch)',
  '01:15 PM (Lunch)',
  '02:00 PM (Lunch)',
  '02:45 PM (Late Lunch)',
  '07:00 PM (Dinner)',
  '07:45 PM (Dinner)',
  '08:30 PM (Dinner)',
  '09:15 PM (Royal Dinner)',
  '10:00 PM (Late Dinner)',
];

const SEATING_PREFERENCES = [
  { id: 'courtyard', label: 'Royal Open Courtyard', desc: 'Folk music & star-lit dining' },
  { id: 'jharokha', label: 'Palace Jharokha Window', desc: 'Private palace view alcove' },
  { id: 'hall', label: 'Imperial AC Dining Hall', desc: 'Cool aristocratic ambiance' },
];

export const TableReservationModal: React.FC<TableReservationModalProps> = ({
  isOpen,
  onClose,
  defaultVenue = 'restaurant',
}) => {
  const [mounted, setMounted] = useState(false);
  const [venue, setVenue] = useState<'restaurant' | 'cafe'>(defaultVenue);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[4]); // 7:00 PM
  const [partySize, setPartySize] = useState('2');
  const [seating, setSeating] = useState('courtyard');
  const [dietary, setDietary] = useState('pure_veg');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState<{
    id: string;
    guestName: string;
    venueName: string;
    date: string;
    time: string;
    partySize: string;
  } | null>(null);

  // Mount check for client-side portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync venue and reset state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setVenue(defaultVenue);
      setErrorMsg('');
      setConfirmedReservation(null);
    }
  }, [isOpen, defaultVenue]);

  // Lock background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!guestName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile contact number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const venueName = venue === 'restaurant' ? 'Rajmahal Royal Dining' : 'Jharokha Artisan Café';
      const formattedTime = `${date} at ${timeSlot}`;
      const dietaryText = dietary === 'jain' ? 'Jain (No Root Veg)' : dietary === 'pure_veg' ? 'Pure Vegetarian' : 'Non-Vegetarian';
      const completeNotes = `Seating: ${seating} | Diet: ${dietaryText}${notes ? ` | Request: ${notes}` : ''}`;

      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reserve',
          guest_name: guestName.trim(),
          phone: guestPhone.trim(),
          outlet_id: venue === 'restaurant' ? 'outlet-restaurant-01' : 'outlet-cafe-02',
          outlet_name: venueName,
          table_number: `T-${venue === 'restaurant' ? 'RES' : 'CAF'}-${Math.floor(Math.random() * 20) + 1}`,
          reservation_time: formattedTime,
          party_size: parseInt(partySize, 10),
          notes: completeNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmedReservation({
          id: data.reservation?.id || `RES-${Date.now().toString().slice(-4)}`,
          guestName: guestName.trim(),
          venueName,
          date,
          time: timeSlot,
          partySize,
        });
      } else {
        setErrorMsg(data.error || 'Failed to confirm table booking. Please retry or contact concierge.');
      }
    } catch {
      setErrorMsg('Network error while booking table. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareOnWhatsApp = () => {
    if (!confirmedReservation) return;
    const msg = `*Rajmahal Palace Table Reservation Confirmed* 🪷\nGuest: ${confirmedReservation.guestName}\nVenue: ${confirmedReservation.venueName}\nDate: ${confirmedReservation.date}\nTime Slot: ${confirmedReservation.time}\nParty: ${confirmedReservation.partySize} Guests\nRef: #${confirmedReservation.id.slice(-6).toUpperCase()}\n\nWe look forward to hosting you in royal Rajputana style!`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#FFFDF9] rounded-3xl border border-[#D8AA67]/60 shadow-[0_25px_60px_rgba(40,5,6,0.6)] p-5 sm:p-7 text-[#241F1A]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          aria-label="Close reservation modal"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedReservation ? (
          /* ── Confirmation View ── */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#D8AA67]/20 border border-[#D8AA67] mx-auto flex items-center justify-center text-[#4F0809]">
              <CheckCircle2 className="w-9 h-9 text-[#2E7D32]" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-[#9C7A45] font-bold">
                Table Reserved Successfully
              </p>
              <h3
                className="text-2xl sm:text-3xl font-bold text-[#4F0809] mt-1"
                style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
              >
                Padharo, {confirmedReservation.guestName}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Your royal table booking at <span className="font-semibold text-[#4F0809]">{confirmedReservation.venueName}</span> is confirmed.
              </p>
            </div>

            <div className="bg-[#F5EFE6] rounded-2xl p-4 border border-[#D8AA67]/30 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#E8DFCE] pb-2">
                <span className="text-stone-500">Date &amp; Time:</span>
                <span className="font-bold text-[#4F0809]">
                  {confirmedReservation.date} • {confirmedReservation.time}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#E8DFCE] pb-2">
                <span className="text-stone-500">Party Size:</span>
                <span className="font-bold text-[#4F0809]">{confirmedReservation.partySize} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Confirmation Ref:</span>
                <span className="font-mono font-bold text-[#D8AA67]">
                  #{confirmedReservation.id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Share Confirmation on WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-6 rounded-xl bg-[#4F0809] hover:bg-[#680E10] text-[#FFF8EB] font-bold text-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ── Reservation Form ── */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#D8AA67]/20 border border-[#D8AA67]/50 text-[#4F0809] text-[11px] font-bold tracking-widest uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#B08D57]" />
                <span>Instant Palace Dining Reservation</span>
              </div>
              <h3
                className="text-2xl sm:text-3xl font-bold text-[#4F0809] leading-tight"
                style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
              >
                Reserve a Table
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Confirm your table in 30 seconds. No advance deposit required for standard dining.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Venue Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F5EFE6] rounded-2xl border border-[#D8AA67]/30">
              <button
                type="button"
                onClick={() => setVenue('restaurant')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                  venue === 'restaurant'
                    ? 'bg-[#4F0809] text-[#FFF8EB] shadow-md'
                    : 'text-[#4F0809] hover:bg-white/60'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#D8AA67]" />
                <span>Royal Dining</span>
              </button>
              <button
                type="button"
                onClick={() => setVenue('cafe')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                  venue === 'cafe'
                    ? 'bg-[#4F0809] text-[#FFF8EB] shadow-md'
                    : 'text-[#4F0809] hover:bg-white/60'
                }`}
              >
                <Coffee className="w-3.5 h-3.5 text-[#D8AA67]" />
                <span>Jharokha Café</span>
              </button>
            </div>

            {/* Date, Time Slot, and Party Size */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full py-2 px-3 bg-white border border-[#DFCDB1] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#D8AA67]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-[#DFCDB1] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#D8AA67]"
                >
                  {TIME_SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Guests</label>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-[#DFCDB1] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#D8AA67]"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Seating Preference */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1.5">
                Seating Atmosphere
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SEATING_PREFERENCES.map((pref) => (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setSeating(pref.id)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      seating === pref.id
                        ? 'border-[#D8AA67] bg-[#F5EFE6] ring-1 ring-[#D8AA67]'
                        : 'border-[#DFCDB1] bg-white hover:border-[#D8AA67]/60'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#4F0809]">{pref.label}</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">{pref.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1.5">
                Dietary Preference
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { id: 'pure_veg', label: '🟢 Pure Vegetarian' },
                  { id: 'jain', label: '🟡 Jain (No Root Veg)' },
                  { id: 'regular', label: '🔴 Regular / Non-Veg' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDietary(d.id)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition cursor-pointer ${
                      dietary === d.id
                        ? 'bg-[#4F0809] text-[#FFF8EB] border-[#4F0809]'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#E8DFCE]">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Vikramaditya Singh"
                    className="w-full py-2 pl-9 pr-3 bg-white border border-[#DFCDB1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#D8AA67]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                  Mobile Number (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full py-2 pl-9 pr-3 bg-white border border-[#DFCDB1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#D8AA67]"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                Special Occasion / Table Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 10th Wedding Anniversary, Birthday decoration, high chair for infant"
                className="w-full py-2 px-3 bg-white border border-[#DFCDB1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#D8AA67]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D8AA67] via-[#E1B46F] to-[#B78A48] text-[#380506] font-bold text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-[#380506]" />
              <span>{isSubmitting ? 'Confirming Reservation...' : 'Confirm Table Reservation (Free)'}</span>
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
