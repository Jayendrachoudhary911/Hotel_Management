'use client';

import React from 'react';
import Image from 'next/image';
import { Star, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  city: string;
  avatar?: string;
  initials?: string;
  rating: number;
  tag: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Priya Sharma',
    city: 'New Delhi',
    avatar: '/images/testimonials/priya-sharma.jpg',
    rating: 5,
    tag: 'Heritage Suite Stay',
    quote:
      'An absolutely magical stay with breathtaking views and royal hospitality. The heritage rooms are a true experience!',
  },
  {
    id: 'test-2',
    name: 'Amit Mehta',
    city: 'Mumbai',
    avatar: '/images/testimonials/amit-mehta.jpg',
    rating: 5,
    tag: 'Dining & Celebrations',
    quote:
      'The food, ambiance and service were outstanding. It felt like living a royal palace in Udaipur. Highly recommended!',
  },
  {
    id: 'test-3',
    name: 'Neha & Karan',
    city: 'Bengaluru',
    avatar: '/images/testimonials/neha-karan.jpg',
    rating: 5,
    tag: 'Anniversary Getaway',
    quote:
      'Perfect destination for a heritage getaway. The lake views, traditional decor and warm staff made our trip unforgettable.',
  },
  {
    id: 'test-4',
    name: 'Vikramaditya Rathore',
    city: 'Jaipur',
    initials: 'VR',
    rating: 5,
    tag: 'Royal Courtyard Suite',
    quote:
      'Authentic Mewari grandeur at its best. From the evening courtyard folk melodies to the royal thali, every single detail was impeccable.',
  },
  {
    id: 'test-5',
    name: 'Sarah & David Jenkins',
    city: 'London, UK',
    initials: 'SJ',
    rating: 5,
    tag: 'International Travelers',
    quote:
      'A fairytale heritage stay. Waking up to the morning mist over Lake Pichola from the Jharokha suite was truly an unforgettable memory.',
  },
  {
    id: 'test-6',
    name: 'Ananya Deshmukh',
    city: 'Pune',
    initials: 'AD',
    rating: 5,
    tag: 'Family Palace Holiday',
    quote:
      'The architectural beauty and warmth of the staff made our family holiday pure magic. Dining under the palace stars is a must!',
  },
];

export function Testimonials() {
  // Duplicate reviews to create a mathematically seamless infinite scroll loop
  const infiniteReviews = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      className="relative py-14 sm:py-18 lg:py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}
      aria-label="Guest Experiences — What Our Guests Say"
    >
      {/* ── SUBTLE FLANKING ANTIQUE-GOLD PALACE & CHHATRI LINE ART ── */}
      {/* Left Artwork */}
      <div className="absolute left-0 top-0 bottom-0 w-[100px] sm:w-[130px] md:w-[160px] lg:w-[200px] pointer-events-none z-0 flex items-center justify-start select-none opacity-70">
        <img
          src="/images/ornaments/testimonials-left-art.png"
          alt=""
          aria-hidden="true"
          className="h-full w-auto max-h-[460px] object-contain object-left"
        />
      </div>

      {/* Right Artwork */}
      <div className="absolute right-0 top-0 bottom-0 w-[100px] sm:w-[130px] md:w-[160px] lg:w-[200px] pointer-events-none z-0 flex items-center justify-end select-none opacity-70">
        <img
          src="/images/ornaments/testimonials-right-art.png"
          alt=""
          aria-hidden="true"
          className="h-full w-auto max-h-[460px] object-contain object-right"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          {/* Eyebrow with subtle horizontal lines */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="w-8 sm:w-12 h-[1px] bg-[#d8aa67]/70" />
            <span
              className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase"
              style={{ color: '#ba905e' }}
            >
              Guest Experiences
            </span>
            <span className="w-8 sm:w-12 h-[1px] bg-[#d8aa67]/70" />
          </div>

          {/* Burgundy Serif Heading */}
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-bold mb-2.5 leading-tight tracking-tight"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              color: '#751c26',
            }}
          >
            What Our Guests Say
          </h2>

          {/* Subtitle */}
          <p
            className="text-xs sm:text-[14px] font-normal leading-relaxed text-balance"
            style={{ color: '#4f0809' }}
          >
            Real stories from travelers who have experienced the royal charm of Rajmahal.
          </p>
        </div>
      </div>

      {/* ── THREE-COLUMN INFINITE SCROLL TRACK WITH DUAL MASK GRADIENTS ── */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Left Mask Gradient Overlay (ambient background fade) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #FBF5E9 25%, rgba(251, 245, 233, 0) 100%)',
          }}
        />

        {/* Right Mask Gradient Overlay (ambient background fade) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #FBF5E9 25%, rgba(251, 245, 233, 0) 100%)',
          }}
        />

        {/* Infinite Marquee Track with CSS mask-image for true edge transparency */}
        <div className="w-full overflow-hidden mask-gradient-x">
          <div className="animate-marquee-infinite flex items-stretch gap-5 sm:gap-6 px-4">
            {infiniteReviews.map((t, index) => (
              <article
                key={`${t.id}-${index}`}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-[18px] sm:rounded-[20px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 bg-[#ffffff] border border-[#eadfcb]/90 hover:border-[#D8AA67] shadow-[0_4px_22px_rgba(216,170,103,0.06)] w-[300px] sm:w-[360px] lg:w-[410px] shrink-0 text-left select-none"
              >
                {/* Top Row: Avatar, Name/City, and 5 Gold Stars */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      {t.avatar ? (
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#d8aa67]/50 shadow-xs shrink-0">
                          <Image
                            src={t.avatar}
                            alt={t.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#670E10] to-[#8A1A1E] text-[#FFF8EB] font-bold text-sm flex items-center justify-center border border-[#d8aa67]/50 shadow-xs shrink-0">
                          {t.initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-[15px] font-bold text-[#4f0809] truncate leading-tight group-hover:text-[#670E10] transition-colors">
                          {t.name}
                        </h3>
                        <p className="text-xs text-[#8a7b68] mt-0.5 truncate">{t.city}</p>
                      </div>
                    </div>

                    {/* 5 Gold Star Icons */}
                    <div
                      className="flex items-center space-x-0.5 shrink-0 pt-1"
                      aria-label={`${t.rating} out of 5 stars`}
                    >
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#e5a93b] text-[#e5a93b]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  <div className="relative mt-2 text-left">
                    <span
                      className="font-serif text-2xl sm:text-3xl font-bold leading-none select-none mr-1 inline-block align-top"
                      style={{ color: '#e8be88' }}
                      aria-hidden="true"
                    >
                      “
                    </span>
                    <p className="inline text-[13px] sm:text-[14px] leading-relaxed text-[#424d45] font-normal">
                      {t.quote}
                    </p>
                    <span
                      className="font-serif text-2xl sm:text-3xl font-bold leading-none select-none ml-1 inline-block align-bottom"
                      style={{ color: '#e8be88' }}
                      aria-hidden="true"
                    >
                      ”
                    </span>
                  </div>
                </div>

                {/* Bottom Verified Guest Badge */}
                <div className="pt-4 mt-4 border-t border-[#f0e7d8] flex items-center justify-between text-[11px] text-[#8a7b68]">
                  <span className="flex items-center space-x-1.5 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Guest Stay</span>
                  </span>
                  <span className="font-serif italic text-[#ba905e]">{t.tag}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUST & REPUTATION BADGE BELOW MARQUEE ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium text-[#4f0809]">
          <div className="inline-flex items-center space-x-2 bg-white/70 px-4 py-2 rounded-full border border-[#d8aa67]/50 shadow-2xs">
            <div className="flex items-center space-x-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#e5a93b] text-[#e5a93b]" />
              ))}
            </div>
            <span className="font-bold text-[#670E10]">4.9 / 5.0 Rating</span>
            <span className="text-[#8a7b68]">&bull;</span>
            <span className="text-[#6B5E4F]">Over 450+ Verified Traveler Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}