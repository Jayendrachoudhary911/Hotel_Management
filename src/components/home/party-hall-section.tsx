'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Cake,
  Heart,
  Briefcase,
  PartyPopper,
  Palette,
  UtensilsCrossed,
  Volume2,
  UserCheck,
  Car,
  BedDouble,
  ShieldCheck,
} from 'lucide-react';

const HALL_IMAGES = [
  {
    src: '/images/hall/crystal-ballroom.jpg',
    title: 'The Grand Party Hall',
    caption: 'Ornate royal chandeliers, carved arches, and elegant seating for 25-50 guests.',
  },
  {
    src: '/images/events/grand-banquet.jpg',
    title: 'Birthday & Anniversary Setup',
    caption: 'Customizable theme décor, festive lighting, cake table, and grand dining.',
  },
  {
    src: '/images/events/palace-dining.jpg',
    title: 'Romantic Date & Private Dining',
    caption: 'Intimate candlelight dining, rose petal table styling, and dedicated private server.',
  },
  {
    src: '/images/events/floral-decor.jpg',
    title: 'Customizable Décor & Floral Styling',
    caption: 'Bespoke floral backdrops, fairy lights, and themed stage arrangements.',
  },
];

export function PartyHallSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [eventType, setEventType] = useState('Birthday Party');
  const [expectedGuests, setExpectedGuests] = useState('25 - 50 Guests');
  const [eventDate, setEventDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<{
    referenceCode: string;
    eventType: string;
    guests: string;
    date: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HALL_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HALL_IMAGES.length) % HALL_IMAGES.length);
  };

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
          expectedGuests: 40,
          notes: `Capacity: 25-50 people | Décor: Customizable | Message: ${message}`,
          eventDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry');

      setSubmittedLead({
        referenceCode: data.lead?.reference_code || `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
        eventType,
        guests: expectedGuests,
        date: eventDate,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="party-hall-enquiry" className="relative py-20 sm:py-24 text-[#fff8eb] overflow-hidden" style={{ backgroundColor: '#210405' }}>
      {/* Background Palace Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#d8aa67_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Banner Row: Headline & Hall Specifications Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Left: Titles & Event Types */}
          <div className="lg:col-span-7 text-left">
            <span
              className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#d8aa67] block mb-2"
              style={{ letterSpacing: '0.22em' }}
            >
              Grand Party Hall
            </span>
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-[1.02] text-[#fff8eb]"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              }}
            >
              A Majestic Space for <br />
              Every Occasion
            </h2>
            <p className="text-sm sm:text-base text-[#eee1cc]/90 max-w-xl font-light leading-relaxed mb-8">
              Host your special moments in our elegant banquet hall with royal architecture, modern facilities, customizable décor, and personalized hospitality crafted for 25 to 50 guests.
            </p>

            {/* Event Tags (6 highlights requested by user) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Birthday Parties', icon: Cake },
                { label: 'Anniversary Parties', icon: Heart },
                { label: 'Book for a Date (Private)', icon: Sparkles },
                { label: 'Corporate Events', icon: Briefcase },
                { label: 'Social Functions', icon: PartyPopper },
                { label: 'Customizable Décor', icon: Palette },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-[#d8aa67]/30 hover:border-[#d8aa67] hover:bg-white/10 transition-all text-xs sm:text-sm text-[#eee1cc]"
                  >
                    <Icon className="w-4 h-4 text-[#d8aa67] shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Hall Specifications Card (Matching dark brown framed card in mockup) */}
          <div className="lg:col-span-5">
            <div
              className="rounded-2xl p-6 sm:p-7 border transition-all shadow-2xl relative overflow-hidden"
              style={{
                backgroundColor: '#35080a',
                borderColor: 'rgba(216, 170, 103, 0.45)',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-[#d8aa67]/30">
                <div className="w-10 h-10 rounded-full bg-[#d8aa67]/20 flex items-center justify-center text-[#d8aa67]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className="text-2xl font-bold text-[#d8aa67]"
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    }}
                  >
                    Grand Party Hall
                  </h3>
                  <span className="text-xs text-[#eee1cc]/70">Exclusive Boutique Banquet</span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-left">
                <div className="flex items-start space-x-3">
                  <Users className="w-4 h-4 text-[#d8aa67] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[#fff8eb] block">Capacity:</span>
                    <span className="text-[#d8aa67] font-bold">25 – 50 Guests</span>
                    <span className="text-[#eee1cc]/70 block text-[11px]">
                      Ideal for intimate celebrations, date nights &amp; private gatherings
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <PartyPopper className="w-4 h-4 text-[#d8aa67] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[#fff8eb] block">Ideal For:</span>
                    <span className="text-[#eee1cc]/90 text-[11px] leading-relaxed block">
                      Birthdays, Anniversaries, Romantic Dates, Corporate Meets &amp; Social Functions
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Palette className="w-4 h-4 text-[#d8aa67] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[#fff8eb] block">Customizable Décor:</span>
                    <span className="text-[#eee1cc]/90 text-[11px] leading-relaxed block">
                      Floral backdrops, fairy lights, balloon styling, romantic candlelight &amp; stage setup
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <UtensilsCrossed className="w-4 h-4 text-[#d8aa67] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[#fff8eb] block">Catering:</span>
                    <span className="text-[#eee1cc]/90 text-[11px] block">
                      Multi-Cuisine &amp; Authentic Royal Rajasthani Banqueting
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#d8aa67]/30 flex items-center justify-between">
                <span className="text-[11px] text-[#eee1cc]/70">Private bookings open</span>
                <span className="inline-flex items-center text-xs font-semibold text-[#d8aa67]">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  Direct Booking Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN AREA: CHECK AVAILABILITY FORM + PHOTO CAROUSEL ── */}
        <div className="bg-[#fffaf1] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl text-[#151c1a] border border-[#dfcdb1] mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Form */}
            <div className="lg:col-span-6 text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8aa67] block mb-1">
                Reserve Your Date
              </span>
              <h3
                className="text-2xl sm:text-3xl font-bold text-[#781c1c] mb-2"
                style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                }}
              >
                Check Availability &amp; Enquire
              </h3>
              <p className="text-xs sm:text-sm text-[#4f0809]/80 mb-6">
                Send us your celebration requirements and our event manager will confirm availability for your 25–50 guests event.
              </p>

              {submittedLead ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Enquiry Received Successfully!</span>
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-800">
                    Thank you! Your reference code is{' '}
                    <strong className="font-mono text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                      {submittedLead.referenceCode}
                    </strong>
                    . Our dedicated event coordinator will call you shortly to discuss your custom décor, date, and guest arrangements.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedLead(null)}
                    className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950 pt-2"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Event Type */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#857866] mb-1">
                        Event Type
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-[#dfcdb1] bg-white text-xs sm:text-sm font-semibold text-[#151c1a] focus:border-[#d8aa67] focus:outline-none"
                      >
                        <option value="Birthday Party">Birthday Party</option>
                        <option value="Anniversary Party">Anniversary Party</option>
                        <option value="Romantic Date & Private Dining">Book for a Date (Private)</option>
                        <option value="Corporate Event / Meeting">Corporate Event</option>
                        <option value="Social Function / Gathering">Social Function</option>
                      </select>
                    </div>

                    {/* Event Date */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#857866] mb-1">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-[#dfcdb1] bg-white text-xs sm:text-sm font-semibold text-[#151c1a] focus:border-[#d8aa67] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Expected Guests */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#857866] mb-1">
                        Expected Guests (25-50 People)
                      </label>
                      <select
                        value={expectedGuests}
                        onChange={(e) => setExpectedGuests(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-[#dfcdb1] bg-white text-xs sm:text-sm font-semibold text-[#151c1a] focus:border-[#d8aa67] focus:outline-none"
                      >
                        <option value="Romantic Date (2 Guests)">Romantic Date (2 Guests)</option>
                        <option value="25 - 35 Guests">25 - 35 Guests</option>
                        <option value="35 - 50 Guests">35 - 50 Guests (Hall Capacity)</option>
                        <option value="25 - 50 Guests">Custom 25 - 50 Guests</option>
                      </select>
                    </div>

                    {/* Your Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#857866] mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Vikramaditya Singh"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-[#dfcdb1] bg-white text-xs sm:text-sm text-[#151c1a] focus:border-[#d8aa67] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#857866] mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-[#dfcdb1] bg-white text-xs sm:text-sm text-[#151c1a] focus:border-[#d8aa67] focus:outline-none"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#857866] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-[#dfcdb1] bg-white text-xs sm:text-sm text-[#151c1a] focus:border-[#d8aa67] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Message (Optional) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#857866] mb-1">
                      Customizable Décor &amp; Event Requirements (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your celebration theme, cake, floral styling, romantic table setup..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#dfcdb1] bg-white text-xs sm:text-sm text-[#151c1a] focus:border-[#d8aa67] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 h-12 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-xl cursor-pointer flex items-center justify-center space-x-2 text-[#fff8eb]"
                    style={{
                      backgroundColor: '#4f0809',
                      border: '1px solid #d8aa67',
                      fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                      fontSize: '17px',
                    }}
                  >
                    <span>{isSubmitting ? 'Sending Enquiry...' : 'Check Availability & Send Enquiry'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Right: Interactive Hall Photo Carousel */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-[#dfcdb1] shadow-lg group">
                <Image
                  src={HALL_IMAGES[currentSlide].src}
                  alt={HALL_IMAGES[currentSlide].title}
                  fill
                  className="object-cover transition-all duration-700"
                />

                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Carousel Controls */}
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-[#d8aa67] text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-[#d8aa67] text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Slide Caption */}
                <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                  <span className="text-[10px] font-bold text-[#d8aa67] uppercase tracking-wider block">
                    Capacity 25-50 People
                  </span>
                  <h4
                    className="text-lg sm:text-xl font-bold text-white mb-1"
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    }}
                  >
                    {HALL_IMAGES[currentSlide].title}
                  </h4>
                  <p className="text-xs text-white/80 line-clamp-1">
                    {HALL_IMAGES[currentSlide].caption}
                  </p>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2.5 mt-3">
                {HALL_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`relative h-18 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      currentSlide === idx ? 'border-[#d8aa67] shadow-md scale-[1.03]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.src} alt={img.title} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FACILITIES & AMENITIES FOR EVENTS (Matching 6 cards in mockup) ── */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8aa67] block mb-2">
            Facilities &amp; Amenities
          </span>
          <h3
            className="text-3xl sm:text-4xl font-bold text-[#fff8eb] mb-10"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            }}
          >
            Everything for a Perfect Event
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                title: 'Customizable Décor',
                desc: 'Themes, flowers & fairy lights',
                icon: Palette,
              },
              {
                title: 'Premium Catering',
                desc: 'Royal Rajasthani & multi-cuisine',
                icon: UtensilsCrossed,
              },
              {
                title: 'Audio-Visual Setup',
                desc: 'Surround sound & projection',
                icon: Volume2,
              },
              {
                title: 'Dedicated Event Manager',
                desc: 'Seamless coordination',
                icon: UserCheck,
              },
              {
                title: 'Parking Facility',
                desc: 'Complimentary valet parking',
                icon: Car,
              },
              {
                title: 'Deluxe Rooms for Guests',
                desc: 'Comfortable stay on property',
                icon: BedDouble,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-[#d8aa67]/30 hover:border-[#d8aa67] hover:bg-white/10 transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#d8aa67]/15 flex items-center justify-center text-[#d8aa67] mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 stroke-[1.6]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#fff8eb] mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#eee1cc]/70 leading-tight">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── GALLERY - MOMENTS THAT MAKE MEMORIES ── */}
        <div className="text-left mb-16">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#d8aa67]/30">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8aa67] block mb-1">
                Gallery
              </span>
              <h3
                className="text-3xl sm:text-4xl font-bold text-[#fff8eb]"
                style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                }}
              >
                Moments that Make Memories
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={prevSlide}
                className="w-9 h-9 rounded-full border border-[#d8aa67]/50 flex items-center justify-center text-[#d8aa67] hover:bg-[#d8aa67] hover:text-[#4f0809] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="w-9 h-9 rounded-full border border-[#d8aa67]/50 flex items-center justify-center text-[#d8aa67] hover:bg-[#d8aa67] hover:text-[#4f0809] transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                src: '/images/events/wedding-mandap.jpg',
                title: 'Royal Stage & Floral Arch',
              },
              {
                src: '/images/events/grand-banquet.jpg',
                title: 'Celebration Dining Table',
              },
              {
                src: '/images/events/palace-dining.jpg',
                title: 'Candlelight Date Arrangement',
              },
              {
                src: '/images/events/courtyard-night.jpg',
                title: 'Evening Illumination & Courtyard',
              },
            ].map((gal, idx) => (
              <div
                key={idx}
                className="relative h-64 rounded-2xl overflow-hidden border border-[#d8aa67]/30 shadow-md group"
              >
                <Image
                  src={gal.src}
                  alt={gal.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-[#fff8eb]">
                  {gal.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA BANNER (Matching bottom card in mockup) ── */}
        <div
          className="rounded-3xl p-8 sm:p-12 text-center text-[#151c1a] border relative overflow-hidden"
          style={{
            backgroundColor: '#fffaf1',
            borderColor: 'rgba(216, 170, 103, 0.6)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d8aa67] block mb-2">
            Experience Rajmahal
          </span>
          <h3
            className="text-3xl sm:text-5xl font-bold text-[#781c1c] mb-3"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            }}
          >
            Plan Your Stay or Celebration Today
          </h3>
          <p className="text-sm sm:text-base text-[#4f0809]/80 max-w-xl mx-auto mb-8 font-normal">
            Whether it's a luxurious stay in our Deluxe Rooms or an intimate celebration in our 25–50 guests party hall, we are here to make it unforgettable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/rooms"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide text-[#fff8eb] bg-[#4f0809] hover:bg-[#781c1c] transition-all shadow-lg flex items-center justify-center space-x-2"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                fontSize: '17px',
              }}
            >
              <BedDouble className="w-4 h-4 text-[#d8aa67]" />
              <span>Book a Deluxe Room</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#party-hall-enquiry"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide text-[#781c1c] border-2 border-[#781c1c] hover:bg-[#781c1c] hover:text-[#fff8eb] transition-all shadow flex items-center justify-center space-x-2"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                fontSize: '17px',
              }}
            >
              <Sparkles className="w-4 h-4 text-[#d8aa67]" />
              <span>Enquire for Party Hall (25-50 Pax)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
