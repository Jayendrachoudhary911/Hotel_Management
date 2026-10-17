'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/utils/money';
import { INITIAL_ROOM_TYPES, INITIAL_PROPERTY } from '@/lib/data/initial-data';
import { CheckCircle2, ShieldCheck, ArrowRight, BedDouble, Calendar, Sparkles, MapPin, Users, Phone } from 'lucide-react';
import { Suspense } from 'react';

function BookRoomForm() {
  const searchParams = useSearchParams();
  const preselectedRoomTypeId = searchParams.get('roomTypeId') || INITIAL_ROOM_TYPES[0].id;
  const preselectedCheckIn = searchParams.get('checkIn') || '2026-10-18';
  const preselectedCheckOut = searchParams.get('checkOut') || '2026-10-20';
  const preselectedGuests = parseInt(searchParams.get('guests') || '2', 10);

  const [roomTypeId, setRoomTypeId] = useState(preselectedRoomTypeId);
  const [checkIn, setCheckIn] = useState(preselectedCheckIn);
  const [checkOut, setCheckOut] = useState(preselectedCheckOut);
  const [partySize, setPartySize] = useState(preselectedGuests);

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

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
  const totalMinor = selectedRoom.base_rate_minor * nights;
  const depositMinor = Math.round((totalMinor * INITIAL_PROPERTY.deposit_percent) / 100);

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
    if (!termsAccepted) {
      setErrorMsg('Please agree to the booking and cancellation policy.');
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
        totalAmount: totalMinor,
        nights,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reservation failed. Please try again.';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedReservation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="heritage-card bg-white p-8 sm:p-12 border-2 border-[#B08D57] shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-[#670E10]/10 border-2 border-[#670E10] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#670E10]" />
          </div>

          <Badge variant="emerald" className="mb-3">
            Royal Reservation Confirmed
          </Badge>

          <h1 className="font-heritage text-3xl sm:text-4xl font-bold text-[#241F1A] mb-2">
            We Look Forward to Welcoming You
          </h1>
          <p className="text-[#6B6155] text-sm mb-8">
            Your palatial retreat at Aura Grand Luxury Resort & Suites has been successfully booked.
          </p>

          <div className="p-6 rounded-2xl bg-[#FAF8F3] border border-[#D4CBBB] text-left space-y-4 mb-8">
            <div className="flex justify-between items-center pb-4 border-b border-[#D4CBBB]">
              <span className="text-xs uppercase tracking-wider text-[#8F7245] font-bold">
                Booking Reference
              </span>
              <span className="font-mono text-base font-bold text-[#670E10]">
                {confirmedReservation.referenceCode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#3D352C]">
              <div>
                <span className="text-[#8F7245] font-semibold block mb-0.5">Chamber Reserved</span>
                <span className="font-bold text-[#241F1A] text-sm">{confirmedReservation.roomName}</span>
              </div>
              <div>
                <span className="text-[#8F7245] font-semibold block mb-0.5">Stay Duration</span>
                <span className="font-bold text-[#241F1A] text-sm">
                  {nights} Night{nights > 1 ? 's' : ''} ({checkIn} to {checkOut})
                </span>
              </div>
              <div>
                <span className="text-[#8F7245] font-semibold block mb-0.5">Primary Guest</span>
                <span className="font-bold text-[#241F1A]">{guestName} ({guestPhone})</span>
              </div>
              <div>
                <span className="text-[#8F7245] font-semibold block mb-0.5">Total Estimated Tariff</span>
                <span className="font-bold text-[#670E10] text-base">
                  {formatMoney(confirmedReservation.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
            <Link href="/restaurant">
              <Button>Pre-book Table at Saffron & Spice &rarr;</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <Badge variant="maroon" className="mb-2">Direct Reservation</Badge>
        <h1 className="font-heritage text-3xl sm:text-4xl font-bold text-[#241F1A] tracking-tight">
          Reserve Your Royal Stay
        </h1>
        <div className="w-16 h-0.5 bg-[#B08D57] mx-auto mt-3 mb-2" />
        <p className="text-[#6B6155] text-sm">
          Guaranteed direct booking with zero reservation fees and dedicated royal concierge handling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Booking Form */}
        <div className="lg:col-span-7">
          <div className="heritage-card bg-white p-6 sm:p-8 rounded-2xl border border-[#D4CBBB] shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Room Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D352C] mb-2">
                  Select Royal Chamber
                </label>
                <select
                  value={roomTypeId}
                  onChange={(e) => setRoomTypeId(e.target.value)}
                  className="w-full bg-white border border-[#D4CBBB] rounded-xl px-4 py-3 text-sm text-[#241F1A] font-medium focus:outline-none focus:border-[#670E10]"
                >
                  {INITIAL_ROOM_TYPES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {formatMoney(r.base_rate_minor)} / night (Capacity {r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center text-xs font-bold uppercase tracking-wider text-[#8F7245] mb-1.5">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-[#670E10]" /> Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-white border border-[#D4CBBB] rounded-xl px-3 py-2.5 text-sm text-[#241F1A] font-medium focus:outline-none focus:border-[#670E10]"
                  />
                </div>
                <div>
                  <label className="flex items-center text-xs font-bold uppercase tracking-wider text-[#8F7245] mb-1.5">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-[#670E10]" /> Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-white border border-[#D4CBBB] rounded-xl px-3 py-2.5 text-sm text-[#241F1A] font-medium focus:outline-none focus:border-[#670E10]"
                  />
                </div>
                <div>
                  <label className="flex items-center text-xs font-bold uppercase tracking-wider text-[#8F7245] mb-1.5">
                    <Users className="w-3.5 h-3.5 mr-1 text-[#670E10]" /> Guests
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
                    className="w-full bg-white border border-[#D4CBBB] rounded-xl px-3 py-2.5 text-sm text-[#241F1A] font-medium focus:outline-none focus:border-[#670E10]"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </div>
              </div>

              {/* Guest Information */}
              <div className="pt-4 border-t border-[#D4CBBB] space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#670E10]">
                  Primary Guest Contact
                </h3>

                <Input
                  label="Full Name"
                  placeholder="e.g. Maharaja Vikram Singh"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile Phone"
                    placeholder="+91 98765 43210"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                  />

                  <Input
                    label="Email Address (Optional)"
                    type="email"
                    placeholder="vikram@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3D352C] mb-1.5">
                    Special Requests or Arrival Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Vintage car airport transfer requested, anniversary flowers, non-smoking chamber"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white border border-[#D4CBBB] rounded-xl px-4 py-2.5 text-sm text-[#241F1A] placeholder-[#9A8E7F] focus:outline-none focus:border-[#670E10]"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2 flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#D4CBBB] text-[#670E10] focus:ring-[#670E10]"
                />
                <label htmlFor="terms" className="text-xs text-[#6B6155] leading-relaxed cursor-pointer">
                  I agree to the property booking rules, check-in policy (2:00 PM check-in), and free cancellation terms up to 48 hours prior to check-in.
                </label>
              </div>

              <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full shadow-md">
                Confirm Royal Reservation <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Right: Booking Summary Card */}
        <div className="lg:col-span-5">
          <div className="heritage-card bg-white border-2 border-[#B08D57]/40 p-6 sm:p-8 rounded-2xl space-y-6 shadow-md">
            <h3 className="font-heritage text-xl font-bold text-[#241F1A] pb-4 border-b border-[#D4CBBB]">
              Chamber Stay Summary
            </h3>

            {/* Room Preview Thumbnail */}
            <div className="relative h-44 rounded-xl overflow-hidden border border-[#D4CBBB]">
              <Image
                src={selectedRoom.photos[0] || '/images/hero_resort.jpg'}
                alt={selectedRoom.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded bg-[#670E10] text-white text-[11px] font-bold">
                  {formatMoney(selectedRoom.base_rate_minor)} / night
                </span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-[#3D352C]">
              <div className="flex justify-between items-center">
                <span className="text-[#6B6155]">Chamber Style:</span>
                <span className="font-bold text-[#241F1A]">{selectedRoom.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#6B6155]">Duration:</span>
                <span className="font-bold text-[#241F1A]">
                  {nights} Night{nights > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#6B6155]">Dates:</span>
                <span className="font-bold text-[#241F1A]">
                  {checkIn} &rarr; {checkOut}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#6B6155]">Guests:</span>
                <span className="font-bold text-[#241F1A]">{partySize} Persons</span>
              </div>

              <div className="pt-3 border-t border-[#D4CBBB] flex justify-between items-center">
                <span className="text-[#6B6155]">Base Stay Tariff:</span>
                <span className="font-bold text-[#241F1A]">{formatMoney(totalMinor)}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B6155]">Estimated Deposit ({INITIAL_PROPERTY.deposit_percent}%):</span>
                <span className="font-bold text-[#670E10]">{formatMoney(depositMinor)}</span>
              </div>

              <div className="pt-3 border-t-2 border-[#D4CBBB] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#241F1A]">Total Payable at Check-in:</span>
                <span className="text-2xl font-heritage font-bold text-[#670E10]">
                  {formatMoney(totalMinor)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#D4CBBB] space-y-2 text-[11px] text-[#6B6155]">
              <div className="flex items-center text-[#2D6A4F] font-semibold">
                <ShieldCheck className="w-4 h-4 mr-1.5 shrink-0" />
                <span>Free cancellation up to 48 hours prior to check-in</span>
              </div>
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5 text-[#B08D57] shrink-0" />
                <span>Complimentary royal high-tea & welcome drink</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <div className="bg-[#F5F1E8] min-h-screen">
      <Suspense fallback={<div className="p-12 text-center text-[#670E10] font-bold">Loading booking sanctuary...</div>}>
        <BookRoomForm />
      </Suspense>
    </div>
  );
}
