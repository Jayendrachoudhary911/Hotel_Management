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

const REVIEWS_ROW_1: Testimonial[] = [
  {
    id: 'r1-1',
    name: 'Priya Sharma',
    city: 'New Delhi',
    avatar: '/images/testimonials/priya-sharma.jpg',
    rating: 5,
    tag: 'Heritage Suite Stay',
    quote:
      'An absolutely magical stay with breathtaking views and royal hospitality. The heritage rooms are a true experience!',
  },
  {
    id: 'r1-2',
    name: 'Amit Mehta',
    city: 'Mumbai',
    avatar: '/images/testimonials/amit-mehta.jpg',
    rating: 5,
    tag: 'Dining & Celebrations',
    quote:
      'The food, ambiance and service were outstanding. It felt like living in a royal palace in Udaipur. Highly recommended!',
  },
  {
    id: 'r1-3',
    name: 'Neha & Karan',
    city: 'Bengaluru',
    avatar: '/images/testimonials/neha-karan.jpg',
    rating: 5,
    tag: 'Anniversary Getaway',
    quote:
      'Perfect destination for a heritage getaway. The lake views, traditional decor and warm staff made our trip unforgettable.',
  },
  {
    id: 'r1-4',
    name: 'Vikramaditya Rathore',
    city: 'Jaipur',
    initials: 'VR',
    rating: 5,
    tag: 'Royal Courtyard Suite',
    quote:
      'Authentic Mewari grandeur at its best. From the evening courtyard folk melodies to the royal thali, every single detail was impeccable.',
  },
];

const REVIEWS_ROW_2: Testimonial[] = [
  {
    id: 'r2-1',
    name: 'Sarah & David Jenkins',
    city: 'London, UK',
    initials: 'SJ',
    rating: 5,
    tag: 'International Travelers',
    quote:
      'A fairytale heritage stay. Waking up to the morning mist over Lake Pichola from the Jharokha suite was truly an unforgettable memory.',
  },
  {
    id: 'r2-2',
    name: 'Ananya Deshmukh',
    city: 'Pune',
    initials: 'AD',
    rating: 5,
    tag: 'Family Palace Holiday',
    quote:
      'The architectural beauty and warmth of the staff made our family holiday pure magic. Dining under the palace stars is a must!',
  },
  {
    id: 'r2-3',
    name: 'Rohan & Meera Kapoor',
    city: 'Kolkata',
    initials: 'RK',
    rating: 5,
    tag: 'Destination Wedding',
    quote:
      'We hosted our destination wedding ceremony here. The hospitality, royal decor, and food left every single guest in awe.',
  },
  {
    id: 'r2-4',
    name: 'Dr. Rajesh Singhal',
    city: 'Ahmedabad',
    initials: 'RS',
    rating: 5,
    tag: 'Executive Retreat',
    quote:
      'Quiet luxury combined with centuries of living history. The tranquility of the lake courtyards is unmatched anywhere in Rajasthan.',
  },
];

const REVIEWS_ROW_3: Testimonial[] = [
  {
    id: 'r3-1',
    name: 'Elena & Marco Rossi',
    city: 'Milan, Italy',
    initials: 'MR',
    rating: 5,
    tag: 'Cultural Heritage Tour',
    quote:
      'The intricate jharokhas, stained glass suites, and personalized butler service made us feel like honored royal guests.',
  },
  {
    id: 'r3-2',
    name: 'Kavita Krishnamurthy',
    city: 'Chennai',
    initials: 'KK',
    rating: 5,
    tag: 'Weekend Luxury Stay',
    quote:
      'Exceptional warmth and hospitality. The sunset boat pickup and lakeside candlelit dinner were the highlights of our holiday.',
  },
  {
    id: 'r3-3',
    name: 'Aditya & Sunita Verma',
    city: 'Hyderabad',
    initials: 'AV',
    rating: 5,
    tag: 'Courtyard Dining',
    quote:
      'The dal baati churma and royal laal maas at the restaurant are world class. Truly a culinary journey fit for Mewar royalty.',
  },
  {
    id: 'r3-4',
    name: 'Kabir Saxena',
    city: 'Chandigarh',
    initials: 'KS',
    rating: 5,
    tag: 'Heritage Photography Trip',
    quote:
      'Every corner of this palace hotel is a masterpiece of Rajputana architecture. Sunrise from the royal terrace was pure poetry.',
  },
];

function ReviewCard({ review }: { review: Testimonial }) {
  return (
    <article className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-[16px] sm:rounded-[18px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-[#ffffff] border border-[#eadfcb]/90 hover:border-[#D8AA67] shadow-[0_4px_18px_rgba(216,170,103,0.06)] w-[280px] sm:w-[330px] lg:w-[370px] shrink-0 text-left select-none">
      {/* Top Row: Avatar, Name/City, and 5 Gold Stars */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            {review.avatar ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#d8aa67]/50 shadow-xs shrink-0">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#670E10] to-[#8A1A1E] text-[#FFF8EB] font-bold text-xs flex items-center justify-center border border-[#d8aa67]/50 shadow-xs shrink-0">
                {review.initials}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#4f0809] truncate leading-tight group-hover:text-[#670E10] transition-colors">
                {review.name}
              </h3>
              <p className="text-xs text-[#8a7b68] mt-0.5 truncate">{review.city}</p>
            </div>
          </div>

          {/* 5 Gold Star Icons */}
          <div
            className="flex items-center space-x-0.5 shrink-0 pt-0.5"
            aria-label={`${review.rating} out of 5 stars`}
          >
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-[#e5a93b] text-[#e5a93b]"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="relative mt-1 text-left">
          <span
            className="font-serif text-2xl font-bold leading-none select-none mr-1 inline-block align-top"
            style={{ color: '#e8be88' }}
            aria-hidden="true"
          >
            “
          </span>
          <p className="inline text-[13px] leading-relaxed text-[#424d45] font-normal">
            {review.quote}
          </p>
          <span
            className="font-serif text-2xl font-bold leading-none select-none ml-1 inline-block align-bottom"
            style={{ color: '#e8be88' }}
            aria-hidden="true"
          >
            ”
          </span>
        </div>
      </div>

      {/* Bottom Verified Guest Badge */}
      <div className="pt-3 mt-3 border-t border-[#f0e7d8] flex items-center justify-between text-[11px] text-[#8a7b68]">
        <span className="flex items-center space-x-1.5 text-emerald-800 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Verified Guest Stay</span>
        </span>
        <span className="font-serif italic text-[#ba905e] truncate ml-2">{review.tag}</span>
      </div>
    </article>
  );
}

export function Testimonials() {
  // Duplicate reviews to create mathematically seamless infinite scroll loops
  const row1Reviews = [...REVIEWS_ROW_1, ...REVIEWS_ROW_1];
  const row2Reviews = [...REVIEWS_ROW_2, ...REVIEWS_ROW_2];
  const row3Reviews = [...REVIEWS_ROW_3, ...REVIEWS_ROW_3];

  return (
    <section
      className="relative py-14 sm:py-18 lg:py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}
      aria-label="Guest Experiences — What Our Guests Say"
    >
      {/* ── SUBTLE FLANKING ANTIQUE-GOLD PALACE & CHHATRI LINE ART ── */}
      {/* Left Artwork */}
      <div className="absolute left-0 top-0 bottom-0 w-[100px] sm:w-[130px] md:w-[160px] lg:w-[200px] pointer-events-none z-0 flex items-center justify-start select-none opacity-60">
        <img
          src="/images/ornaments/testimonials-left-art.png"
          alt=""
          aria-hidden="true"
          className="h-full w-auto max-h-[580px] object-contain object-left"
        />
      </div>

      {/* Right Artwork */}
      <div className="absolute right-0 top-0 bottom-0 w-[100px] sm:w-[130px] md:w-[160px] lg:w-[200px] pointer-events-none z-0 flex items-center justify-end select-none opacity-60">
        <img
          src="/images/ornaments/testimonials-right-art.png"
          alt=""
          aria-hidden="true"
          className="h-full w-auto max-h-[580px] object-contain object-right"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
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

      {/* ── EMBEDDED MARQUEE ANIMATION KEYFRAMES (Guarantees HMR & Zero CSS caching issues) ── */}
      <style>{`
        @keyframes marqueeReviewsRTL {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes marqueeReviewsLTR {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-marquee-infinite {
          display: flex !important;
          width: max-content !important;
          animation: marqueeReviewsRTL 42s linear infinite !important;
          will-change: transform;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused !important;
        }
        .animate-marquee-infinite-reverse {
          display: flex !important;
          width: max-content !important;
          animation: marqueeReviewsLTR 46s linear infinite !important;
          will-change: transform;
        }
        .animate-marquee-infinite-reverse:hover {
          animation-play-state: paused !important;
        }
        .animate-marquee-infinite-fast {
          display: flex !important;
          width: max-content !important;
          animation: marqueeReviewsRTL 36s linear infinite !important;
          will-change: transform;
        }
        .animate-marquee-infinite-fast:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* ── THREE-COLUMN INFINITE SCROLL TRACKS WITH DUAL MASK GRADIENTS ── */}
      {/* 1st Column / Row: Right to Left */}
      {/* 2nd Column / Row: Left to Right */}
      {/* 3rd Column / Row: Right to Left */}
      <div className="relative w-full overflow-hidden py-2 space-y-4 sm:space-y-5">
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

        {/* ── Column 1: Right to Left (←) ── */}
        <div className="w-full overflow-hidden mask-gradient-x">
          <div
            className="animate-marquee-infinite flex items-stretch gap-4 sm:gap-5 px-4"
            style={{
              animation: 'marqueeReviewsRTL 42s linear infinite',
              width: 'max-content',
              display: 'flex',
            }}
          >
            {row1Reviews.map((t, index) => (
              <ReviewCard key={`col1-${t.id}-${index}`} review={t} />
            ))}
          </div>
        </div>

        {/* ── Column 2: Left to Right (→) ── */}
        <div className="w-full overflow-hidden mask-gradient-x">
          <div
            className="animate-marquee-infinite-reverse flex items-stretch gap-4 sm:gap-5 px-4"
            style={{
              animation: 'marqueeReviewsLTR 46s linear infinite',
              width: 'max-content',
              display: 'flex',
            }}
          >
            {row2Reviews.map((t, index) => (
              <ReviewCard key={`col2-${t.id}-${index}`} review={t} />
            ))}
          </div>
        </div>

        {/* ── Column 3: Right to Left (←) ── */}
        <div className="w-full overflow-hidden mask-gradient-x">
          <div
            className="animate-marquee-infinite-fast flex items-stretch gap-4 sm:gap-5 px-4"
            style={{
              animation: 'marqueeReviewsRTL 36s linear infinite',
              width: 'max-content',
              display: 'flex',
            }}
          >
            {row3Reviews.map((t, index) => (
              <ReviewCard key={`col3-${t.id}-${index}`} review={t} />
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
