'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { INITIAL_ROOM_TYPES } from '@/lib/data/initial-data';
import { formatMoney } from '@/lib/utils/money';
import { IconKingBed, IconGuests, IconFreeWiFi } from '@/components/ui/heritage-art';
import { Calendar, Users, CheckCircle2, ArrowRight } from 'lucide-react';

function BookRoomForm() {
  const searchParams = useSearchParams();
  const preselectedRoomTypeId = searchParams.get('roomTypeId') || INITIAL_ROOM_TYPES[0].id;
  const preselectedCheckIn = searchParams.get('checkIn') || '2024-08-12';
  const preselectedCheckOut = searchParams.get('checkOut') || '2024-08-16';
  const preselectedGuests = parseInt(searchParams.get('guests') || '2', 10);

  const [roomTypeId, setRoomTypeId] = useState(preselectedRoomTypeId);
  const [checkIn, setCheckIn] = useState(preselectedCheckIn);
  const [checkOut, setCheckOut] = useState(preselectedCheckOut);
  const [partySize, setPartySize] = useState(preselectedGuests);

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<{
    referenceCode: string;
    roomName: string;
    totalAmount: number;
    nights: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedRoom = INITIAL_ROOM_TYPES.find((r) => r.id === roomTypeId) || INITIAL_ROOM_TYPES[0];

  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  const totalAmount = selectedRoom.base_rate_minor * nights;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!guestName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.length < 10) {
      setErrorMsg('Please enter a valid 10+ digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomTypeId,
          checkIn,
          checkOut,
          partySize,
          guestName,
          guestPhone,
          guestEmail,
          notes,
          termsAccepted: true,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to complete reservation');
      }

      setConfirmedReservation({
        referenceCode: resData.reservation.reference_code,
        roomName: selectedRoom.name,
        totalAmount,
        nights,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reservation failed';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16 text-[#1E1A17]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching Mobile - Booking mockup */}
        <div className="text-center mb-10">
          <h1 className="font-heritage text-3xl sm:text-4xl font-bold text-[#13251E] mb-2">
            Book Your Stay
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6356] font-light">
            Reserve your royal chamber at Rajmahal Heritage Hotel with direct instant confirmation
          </p>
        </div>

        {confirmedReservation ? (
          <div className="bg-white rounded-2xl border border-[#B08D57]/40 p-8 text-center space-y-6 shadow-xl">
            <CheckCircle2 className="w-14 h-14 text-[#2D6A4F] mx-auto" />
            <h2 className="font-heritage text-3xl font-bold text-[#13251E]">
              Reservation Confirmed!
            </h2>
            <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E5DFD5] max-w-md mx-auto text-xs space-y-2 text-left">
              <p>
                <strong>Booking Reference:</strong>{' '}
                <span className="font-mono text-sm text-[#8F7245] font-bold">
                  {confirmedReservation.referenceCode}
                </span>
              </p>
              <p><strong>Suite:</strong> {confirmedReservation.roomName}</p>
              <p><strong>Dates:</strong> {checkIn} to {checkOut} ({confirmedReservation.nights} night{confirmedReservation.nights > 1 ? 's' : ''})</p>
              <p><strong>Total Tariff:</strong> {formatMoney(confirmedReservation.totalAmount)}</p>
              <p><strong>Guest:</strong> {guestName} ({guestPhone})</p>
            </div>
            <p className="text-xs text-[#7A6F62]">
              A confirmation dispatch has been logged. Our royal concierge looks forward to welcoming you to Udaipur.
            </p>
            <div className="pt-2 flex justify-center space-x-4">
              <Link
                href="/rooms"
                className="px-6 py-2.5 rounded-lg bg-[#13251E] text-[#FAF8F3] text-xs font-medium"
              >
                Back to Chambers
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 1. Date & Guest Selector Box matching reference mockup */}
            <div className="bg-white rounded-2xl border border-[#E5DFD5] p-6 shadow-sm text-left">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
                      value={`${partySize} Adults`}
                      onChange={(e) => setPartySize(parseInt(e.target.value.split(' ')[0], 10))}
                      className="bg-transparent text-sm text-[#13251E] font-medium focus:outline-none w-full"
                    >
                      <option value="1 Adults">1 Adult</option>
                      <option value="2 Adults">2 Adults</option>
                      <option value="3 Adults">3 Adults</option>
                      <option value="4 Adults">4 Adults</option>
                    </select>
                    <Users className="w-4 h-4 text-[#8F7245]" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#7A6F62] font-semibold mb-1">
                  Selected Chamber
                </label>
                <select
                  value={roomTypeId}
                  onChange={(e) => setRoomTypeId(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/60 text-sm font-semibold text-[#13251E] focus:outline-none focus:border-[#B08D57]"
                >
                  {INITIAL_ROOM_TYPES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {formatMoney(r.base_rate_minor)} / night
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Selected Chamber Preview */}
            <div className="bg-white rounded-2xl border border-[#E5DFD5] overflow-hidden shadow-sm flex flex-col sm:flex-row items-center">
              <div className="relative w-full sm:w-1/2 h-52 sm:h-56">
                <Image
                  src={selectedRoom.photos?.[0] || '/images/rooms/haveli-suite.jpg'}
                  alt={selectedRoom.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 w-full sm:w-1/2 text-left space-y-3">
                <h3 className="font-heritage text-2xl font-bold text-[#13251E]">
                  {selectedRoom.name}
                </h3>
                <div className="flex items-center space-x-4 text-xs text-[#7A6F62]">
                  <span className="flex items-center">
                    <IconKingBed className="w-4 h-4 text-[#8F7245] mr-1" /> King Bed
                  </span>
                  <span className="flex items-center">
                    <IconGuests className="w-4 h-4 text-[#8F7245] mr-1" /> {selectedRoom.capacity} Guests
                  </span>
                  <span className="flex items-center">
                    <IconFreeWiFi className="w-4 h-4 text-[#8F7245] mr-1" /> WiFi
                  </span>
                </div>
                <div className="pt-2 border-t border-[#F2ECE1] flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-[#7A6F62]">Tariff:</span>
                    <span className="font-heritage text-xl font-bold text-[#13251E] ml-1.5">
                      {formatMoney(totalAmount)}
                    </span>
                    <span className="text-[11px] text-[#7A6F62] ml-1">
                      ({nights} night{nights > 1 ? 's' : ''})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Guest Details & Confirmation Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5DFD5] p-6 sm:p-8 shadow-sm text-left space-y-4">
              <h3 className="font-heritage text-xl font-bold text-[#13251E] mb-2">
                Guest Information
              </h3>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#13251E] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Vikramaditya Rathore"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/50 text-xs text-[#13251E] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#13251E] mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/50 text-xs text-[#13251E] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#13251E] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/50 text-xs text-[#13251E] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#13251E] mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Lake view preferred, late evening check-in, extra pillows..."
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/50 text-xs text-[#13251E] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg bg-[#13251E] hover:bg-[#1C382D] text-[#FAF8F3] font-medium text-sm tracking-wide transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming Reservation...' : 'Confirm Royal Reservation'}
                </button>
              </div>
            </form>

            {/* 4. Need Help Card matching Mobile - Booking mockup */}
            <div className="bg-[#FAF8F3] rounded-xl border border-[#E5DFD5] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div>
                <h4 className="font-semibold text-sm text-[#13251E]">Need Help?</h4>
                <p className="text-xs text-[#7A6F62]">
                  Contact our team for special requests, royal transfers, or group bookings.
                </p>
              </div>
              <Link
                href="/#contact"
                className="px-5 py-2 rounded-lg border border-[#B08D57] bg-white hover:bg-[#13251E] hover:text-[#FAF8F3] text-[#13251E] font-medium text-xs tracking-wide transition-all shrink-0"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">Loading booking terminal...</div>}>
      <BookRoomForm />
    </Suspense>
  );
}
