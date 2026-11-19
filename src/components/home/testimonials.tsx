import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  city: string;
  avatar: string;
  rating: number;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Priya Sharma',
    city: 'New Delhi',
    avatar: '/images/testimonials/priya-sharma.jpg',
    rating: 5,
    quote:
      'An absolutely magical stay with breathtaking views and royal hospitality. The heritage rooms are a true experience!',
  },
  {
    id: 'test-2',
    name: 'Amit Mehta',
    city: 'Mumbai',
    avatar: '/images/testimonials/amit-mehta.jpg',
    rating: 5,
    quote:
      'The food, ambiance and service were outstanding. It felt like living a royal palace in Udaipur. Highly recommended!',
  },
  {
    id: 'test-3',
    name: 'Neha & Karan',
    city: 'Bengaluru',
    avatar: '/images/testimonials/neha-karan.jpg',
    rating: 5,
    quote:
      'Perfect destination for a heritage getaway. The lake views, traditional decor and warm staff made our trip unforgettable.',
  },
];

export function Testimonials() {
  return (
    <section
      className="relative py-14 sm:py-16 lg:py-20 overflow-hidden"
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* ── TESTIMONIAL CARDS (3 IN ONE HORIZONTAL ROW ON DESKTOP) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              className="relative flex flex-col justify-between p-6 sm:p-7 rounded-[14px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-[#ffffff] border border-[#eadfcb]/90 shadow-[0_4px_20px_rgba(216,170,103,0.06)]"
            >
              {/* Top Row: Avatar, Name/City, and 5 Gold Stars */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#d8aa67]/40 shadow-xs shrink-0">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 text-left">
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#4f0809] truncate leading-tight">
                      {t.name}
                    </h3>
                    <p className="text-xs text-[#8a7b68] mt-0.5 truncate">{t.city}</p>
                  </div>
                </div>

                {/* 5 Gold Star Icons */}
                <div className="flex items-center space-x-0.5 shrink-0 pt-1" aria-label={`${t.rating} out of 5 stars`}>
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
                  className="font-serif text-2xl font-bold leading-none select-none mr-1 inline-block align-top"
                  style={{ color: '#e8be88' }}
                  aria-hidden="true"
                >
                  “
                </span>
                <p className="inline text-[13px] sm:text-[13.5px] leading-relaxed text-[#424d45]">
                  {t.quote}
                </p>
                <span
                  className="font-serif text-2xl font-bold leading-none select-none ml-1 inline-block align-bottom"
                  style={{ color: '#e8be88' }}
                  aria-hidden="true"
                >
                  ”
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
