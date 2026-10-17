'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/utils/money';
import { INITIAL_HALL } from '@/lib/data/initial-data';
import { Sparkles, Users, Calendar, CheckCircle2, Music, Wine, Award, ArrowRight, ShieldCheck, MapPin, Phone } from 'lucide-react';

export default function HallPage() {
  const hall = INITIAL_HALL;

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [eventType, setEventType] = useState('Royal Wedding / Reception');
  const [expectedGuests, setExpectedGuests] = useState('150');
  const [eventDate, setEventDate] = useState('');
  const [seatingLayout, setSeatingLayout] = useState('Round Banquet Tables (Cluster)');
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
    <div className="bg-[#F5F1E8] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero banner */}
        <div className="relative h-[440px] rounded-3xl overflow-hidden mb-16 border-2 border-[#B08D57]/40 shadow-xl">
          <Image
            src="/images/hall/crystal-ballroom.jpg"
            alt="The Grand Crystal Ballroom & Starlit Lawn"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241F1A] via-[#241F1A]/50 to-transparent flex items-end p-8 sm:p-14">
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-3">
                Majestic Banquets & Celebrations
              </Badge>
              <h1 className="font-heritage text-3xl sm:text-5xl font-bold text-[#FAF8F3] mb-3 leading-tight drop-shadow-md">
                {hall.name}
              </h1>
              <p className="text-[#EBE5D6] text-sm sm:text-base font-normal leading-relaxed">
                Pillarless Rajputana ballroom for up to {hall.capacity} guests with Bohemian crystal chandeliers, adjoining illuminated starlit lawn, gourmet banquet catering, and dedicated royal event khansamas.
              </p>
            </div>
          </div>
        </div>

        {/* Curated Packages */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="maroon" className="mb-2">Bespoke Curation</Badge>
            <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-[#241F1A]">
              Palace Event Packages & Guidance
            </h2>
            <div className="w-16 h-0.5 bg-[#B08D57] mx-auto mt-3 mb-2" />
            <p className="text-[#6B6155] text-sm mt-2">
              Tailored event curations featuring grand royal entry, live shehnai & acoustics, and multi-course Awadhi feasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hall.packages.map((pkg, idx) => (
              <div
                key={idx}
                className="heritage-card bg-white p-6 sm:p-8 rounded-2xl border border-[#D4CBBB] flex flex-col justify-between hover:border-[#670E10] shadow-md transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#670E10]/10 border border-[#670E10]/30 flex items-center justify-center mb-5 text-[#670E10]">
                    <Sparkles className="w-6 h-6 text-[#670E10]" />
                  </div>
                  <h3 className="font-heritage text-xl font-bold text-[#241F1A] mb-2">{pkg.name}</h3>
                  <p className="text-xs text-[#6B6155] mb-6 leading-relaxed">{pkg.description}</p>
                </div>

                <div className="pt-5 border-t border-[#D4CBBB]">
                  <span className="text-[10px] uppercase tracking-wider text-[#8F7245] font-bold block mb-1">
                    Guidance Tariff Starting From
                  </span>
                  <span className="text-2xl font-heritage font-bold text-[#670E10]">
                    {formatMoney(pkg.price_guidance_minor)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry Form (WEB-05) */}
        <div className="max-w-4xl mx-auto">
          <div className="heritage-card bg-white p-8 sm:p-12 rounded-2xl border-2 border-[#B08D57]/40 shadow-lg">
            {confirmedEnquiry ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#670E10]/10 border-2 border-[#670E10] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[#670E10]" />
                </div>
                <Badge variant="emerald">Lead Registered for Staff Follow-up</Badge>
                <h2 className="font-heritage text-3xl font-bold text-[#241F1A]">
                  Enquiry Successfully Registered
                </h2>
                <p className="text-[#6B6155] text-sm max-w-md mx-auto">
                  Thank you for choosing Aura Grand. Our banquet director will contact you within 24 hours with an itemized royal proposal.
                </p>

                <div className="p-6 rounded-2xl bg-[#FAF8F3] border border-[#D4CBBB] max-w-md mx-auto text-left space-y-2.5">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-[#D4CBBB]">
                    <span className="text-[#8F7245] font-bold uppercase tracking-wider">Reference Code</span>
                    <span className="font-mono font-bold text-base text-[#670E10]">{confirmedEnquiry.referenceCode}</span>
                  </div>
                  <div className="text-xs text-[#3D352C] flex justify-between">
                    <span className="text-[#6B6155]">Event Type</span>
                    <span className="font-semibold">{confirmedEnquiry.eventType}</span>
                  </div>
                  <div className="text-xs text-[#3D352C] flex justify-between">
                    <span className="text-[#6B6155]">Preferred Date</span>
                    <span className="font-semibold">{confirmedEnquiry.date}</span>
                  </div>
                  <div className="text-xs text-[#3D352C] flex justify-between">
                    <span className="text-[#6B6155]">Expected Guests</span>
                    <span className="font-semibold">{confirmedEnquiry.guests} Attendees</span>
                  </div>
                  <div className="text-xs text-[#3D352C] flex justify-between">
                    <span className="text-[#6B6155]">Seating Layout</span>
                    <span className="font-semibold">{confirmedEnquiry.seatingLayout}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-center gap-4">
                  <Button onClick={() => setConfirmedEnquiry(null)} variant="outline">
                    Submit Another Enquiry
                  </Button>
                  <Link href="/dashboard">
                    <Button variant="secondary">View in Staff Console &rarr;</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-8">
                  <Badge variant="maroon" className="mb-2">Event Concierge Enquiry</Badge>
                  <h2 className="font-heritage text-3xl font-bold text-[#241F1A]">
                    Request a Bespoke Proposal & Quote
                  </h2>
                  <div className="w-16 h-0.5 bg-[#B08D57] mx-auto mt-3 mb-2" />
                  <p className="text-[#6B6155] text-sm">
                    Fill in your event preferences and seating layout to receive a customized banquet quote.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-6">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Your Name / Organization"
                      placeholder="e.g. Thakur Ranvijay Singh"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />

                    <Input
                      label="Mobile Contact"
                      placeholder="+91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#3D352C] mb-2">
                        Event Type
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full bg-white border border-[#D4CBBB] rounded-xl px-4 py-3 text-sm text-[#241F1A] font-medium focus:outline-none focus:border-[#670E10]"
                      >
                        <option value="Royal Wedding / Reception">Royal Wedding / Reception</option>
                        <option value="Sangeet & Mehendi Night">Sangeet & Mehendi Night</option>
                        <option value="Corporate Leadership Summit">Corporate Leadership Summit</option>
                        <option value="Cocktail Gala Dinner">Cocktail Gala Dinner</option>
                        <option value="Royal Anniversary Celebration">Royal Anniversary Celebration</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center text-xs font-bold uppercase tracking-wider text-[#8F7245] mb-2">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-[#670E10]" /> Preferred Date
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-white border border-[#D4CBBB] rounded-xl px-4 py-2.5 text-sm text-[#241F1A] font-medium focus:outline-none focus:border-[#670E10]"
                      />
                    </div>

                    <Input
                      label="Expected Guests"
                      type="number"
                      min="10"
                      max="400"
                      value={expectedGuests}
                      onChange={(e) => setExpectedGuests(e.target.value)}
                      required
                    />
                  </div>

                  {/* Seating Layout Choice (WEB-05 Acceptance criteria) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3D352C] mb-2">
                      Seating Layout Preference (WEB-05)
                    </label>
                    <select
                      value={seatingLayout}
                      onChange={(e) => setSeatingLayout(e.target.value)}
                      className="w-full bg-white border border-[#D4CBBB] rounded-xl px-4 py-3 text-sm text-[#241F1A] font-medium focus:outline-none focus:border-[#670E10]"
                    >
                      <option value="Round Banquet Tables (Cluster)">Round Banquet Tables (Cluster) — Best for Weddings & Galas</option>
                      <option value="Theater / Auditorium Style">Theater / Auditorium Style — Max capacity, Keynotes</option>
                      <option value="Traditional Rajasthani Baithak (Diwans)">Traditional Rajasthani Baithak (Diwans & Floor Bolsters)</option>
                      <option value="Cocktail Standing & High-Top Lounge">Cocktail Standing & High-Top Lounge</option>
                      <option value="Classroom / Workshop Style">Classroom / Workshop Style with Note Tables</option>
                      <option value="U-Shape Executive Boardroom">U-Shape Executive Boardroom</option>
                    </select>
                  </div>

                  <Input
                    label="Email (For Proposal PDF Delivery)"
                    type="email"
                    placeholder="ranvijay@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3D352C] mb-1.5">
                      Stage, AV, Decor & Royal Catering Specifics
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Need DJ sound stage with live Dhol, pure vegetarian Awadhi buffet, bridal greenroom access, floral mandap setup"
                      value={setupNeeds}
                      onChange={(e) => setSetupNeeds(e.target.value)}
                      className="w-full bg-white border border-[#D4CBBB] rounded-xl px-4 py-2.5 text-sm text-[#241F1A] placeholder-[#9A8E7F] focus:outline-none focus:border-[#670E10]"
                    />
                  </div>

                  <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full shadow-md">
                    Submit Enquiry & Request Royal Quote &rarr;
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
