'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  HeritageDivider,
  DarbarChhatriOrnament,
  ToranJharokhaArch,
  LataJaaliRunner,
} from '@/components/ui/heritage-ornaments';
import {
  IconGuests300,
  IconCustomDecor,
  IconAudioVisual,
  IconCateringSupport,
} from '@/components/ui/heritage-art';
import { CheckCircle2 } from 'lucide-react';

export default function HallPage() {
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [eventType, setEventType] = useState('Royal Wedding / Reception');
  const [expectedGuests, setExpectedGuests] = useState('150');
  const [eventDate, setEventDate] = useState('');
  const [seatingLayout, setSeatingLayout] = useState('Traditional Rajasthani Baithak');
  const [setupNeeds, setSetupNeeds] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setEventDate(new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedEnquiry, setConfirmedEnquiry] = useState<{
    referenceCode: string;
    eventType: string;
    guests: number;
    date: string;
    seatingLayout: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const features = [
    { label: 'Up to 300 Guests', icon: IconGuests300 },
    { label: 'Custom Decor', icon: IconCustomDecor },
    { label: 'Audio Visual', icon: IconAudioVisual },
    { label: 'Catering Support', icon: IconCateringSupport },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!contactName.trim() || !contactPhone.trim()) {
      setErrorMsg('Please enter your contact name and mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/hall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName,
          contactPhone,
          contactEmail,
          eventType,
          expectedGuests: parseInt(expectedGuests, 10) || 50,
          eventDate,
          seatingLayout,
          setupNeeds,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry');

      setConfirmedEnquiry({
        referenceCode: data.lead.reference_code,
        eventType,
        guests: parseInt(expectedGuests, 10),
        date: eventDate,
        seatingLayout,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-[#F5F1E8] min-h-screen py-10 sm:py-16 text-[#241F1A] overflow-hidden">
      {/* ── BESPOKE VERTICAL LATA JAALI BORDERS ── */}
      <LataJaaliRunner side="left" opacity={0.15} color="#B08D57" className="hidden lg:block" />
      <LataJaaliRunner side="right" opacity={0.15} color="#B08D57" className="hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* ── HERO BANNER (Matching Mobile - Party Hall mockup) ── */}
        <div className="relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden shadow-xl border border-[#D4CBBB]">
          <Image
            src="/images/hall/crystal-ballroom.jpg"
            alt="Party Hall at Rajmahal Heritage Hotel"
            fill
            priority
            className="object-cover"
          />

          {/* Dedicated Royal Darbar Chhatri Ornament Watermark with subtle opacity */}
          <div className="absolute top-0 right-4 w-64 h-64 pointer-events-none opacity-10 hidden md:block">
            <DarbarChhatriOrnament color="#C9A96E" opacity={0.3} />
          </div>

          {/* Subtle clear overlay so ballroom photo stays clear and majestic */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/10 flex items-center justify-center p-6 sm:p-12 text-center">
            <div className="max-w-2xl">
              <h1 className="font-heritage text-3xl sm:text-5xl font-bold text-[#FAF8F3] mb-3 leading-tight">
                Party Hall
              </h1>
              <p className="text-base sm:text-xl font-medium text-[#C9A96E] mb-3">
                For Celebrations That Matter
              </p>
              <p className="text-xs sm:text-sm text-[#E0DCD3] max-w-xl mx-auto font-light leading-relaxed mb-8">
                A spacious and elegant venue for weddings, corporate events, birthdays and special occasions.
              </p>

              <div>
                <a
                  href="#enquire"
                  className="px-6 py-3 rounded-md bg-[#670E10] border border-[#B08D57]/60 hover:bg-[#821215] text-[#FAF8F3] font-medium text-sm tracking-wide transition-all shadow"
                >
                  Enquire Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 FEATURE ICONS (Matching image) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center p-5 rounded-xl bg-white border border-[#D4CBBB]/70 shadow-2xs hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-[#FAF8F3] border border-[#B08D57]/50 flex items-center justify-center mb-3">
                  <Icon className="w-7 h-7 text-[#B08D57]" />
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#670E10]">
                  {feat.label}
                </h4>
              </div>
            );
          })}
        </div>

        {/* Symmetrical Jaali Divider */}
        <HeritageDivider className="opacity-35 my-6" color="#B08D57" />

        {/* ── ENQUIRY SECTION (WEB-05) ── */}
        <div id="enquire" className="relative max-w-3xl mx-auto bg-white rounded-2xl border border-[#D4CBBB]/70 p-6 sm:p-10 shadow-lg text-left overflow-hidden">
          {/* Architectural Archway Watermark framing the card with subtle opacity */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-lg h-[650px] pointer-events-none opacity-5">
            <ToranJharokhaArch color="#B08D57" opacity={0.25} showContentArea={false} />
          </div>

          <div className="relative z-10 text-center mb-8">
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#670E10] mb-2">
              Plan Your Celebration
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6356]">
              Share your event dates, guest count, and seating preference. Our royal banquet concierge will generate a personalized proposal.
            </p>
          </div>

          {confirmedEnquiry ? (
            <div className="p-6 rounded-xl bg-[#FAF8F3] border border-[#B08D57]/40 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#2D6A4F] mx-auto" />
              <h3 className="font-heritage text-2xl font-bold text-[#670E10]">
                Enquiry Successfully Registered!
              </h3>
              <p className="text-xs text-[#6E6356]">
                Reference Code: <strong className="text-[#670E10] font-mono">{confirmedEnquiry.referenceCode}</strong>
              </p>
              <div className="p-4 rounded-lg bg-white border border-[#E5DFD5] text-xs space-y-1.5 text-left max-w-md mx-auto">
                <p><strong>Occasion:</strong> {confirmedEnquiry.eventType}</p>
                <p><strong>Estimated Guests:</strong> {confirmedEnquiry.guests} attendees</p>
                <p><strong>Preferred Date:</strong> {confirmedEnquiry.date}</p>
                <p><strong>Seating Layout:</strong> {confirmedEnquiry.seatingLayout}</p>
              </div>
              <button
                onClick={() => setConfirmedEnquiry(null)}
                className="mt-4 px-5 py-2 rounded-md bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] text-xs font-medium transition-all"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#670E10] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Maharaja Vikram Singh"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/50 text-xs text-[#241F1A] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#670E10] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/50 text-xs text-[#241F1A] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#670E10] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/50 text-xs text-[#241F1A] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#670E10] mb-1">
                    Occasion / Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/50 text-xs text-[#241F1A] focus:outline-none focus:border-[#B08D57]"
                  >
                    <option value="Royal Wedding / Reception">Royal Wedding / Reception</option>
                    <option value="Sangeet / Mehendi Ceremony">Sangeet / Mehendi Ceremony</option>
                    <option value="Corporate Gala / Executive Retreat">Corporate Gala / Executive Retreat</option>
                    <option value="Milestone Birthday Celebration">Milestone Birthday Celebration</option>
                    <option value="Private Darbar Banquet">Private Darbar Banquet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#670E10] mb-1">
                    Estimated Guests
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="350"
                    value={expectedGuests}
                    onChange={(e) => setExpectedGuests(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/50 text-xs text-[#241F1A] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#670E10] mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/50 text-xs text-[#241F1A] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#670E10] mb-1">
                    Seating Layout (WEB-05)
                  </label>
                  <select
                    value={seatingLayout}
                    onChange={(e) => setSeatingLayout(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/50 text-xs text-[#241F1A] focus:outline-none focus:border-[#B08D57]"
                  >
                    <option value="Traditional Rajasthani Baithak">Traditional Rajasthani Baithak</option>
                    <option value="Round Banquet Tables (Cluster)">Round Banquet Tables (Cluster)</option>
                    <option value="Auditorium / Theatre Style">Auditorium / Theatre Style</option>
                    <option value="U-Shape Executive Conference">U-Shape Executive Conference</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#670E10] mb-1">
                  Decor, Acoustic & Floral Preferences
                </label>
                <textarea
                  rows={3}
                  value={setupNeeds}
                  onChange={(e) => setSetupNeeds(e.target.value)}
                  placeholder="e.g. Marigold floral mandap, live folk musicians stage, projector screens..."
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/50 text-xs text-[#241F1A] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] font-medium text-sm tracking-wide transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Enquiry...' : 'Submit Banquet Enquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
