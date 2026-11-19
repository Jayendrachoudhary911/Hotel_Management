'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Tag, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  badge_text: string;
  status: 'active' | 'scheduled' | 'expired';
  discount_type: 'percentage' | 'flat' | 'bogo';
  discount_value: number;
  start_date: string;
  end_date: string;
  applicable_category: string;
  applicable_items_count: number;
  times_used: number;
  image_url: string;
}

function BadgeIcon({ type }: { type: string }) {
  if (type === 'bogo') {
    return <Sparkles className="w-3.5 h-3.5" />;
  }
  return <Tag className="w-3.5 h-3.5" />;
}

function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calcTimeLeft = () => {
      const end = new Date(endDate).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${mins}m left`);
      }
    };

    calcTimeLeft();
    const interval = setInterval(calcTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium tracking-wide opacity-90">
      <Clock className="w-3 h-3" />
      {timeLeft}
    </span>
  );
}

export function Promotions() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/promotions');
        if (res.ok) {
          const data = await res.json();
          const active = (data.promotions || []).filter(
            (p: Promotion) => p.status === 'active'
          );
          setPromos(active);
        }
      } catch {
        // silently fail – promotions are non-critical
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [promos]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('[data-promo-card]')?.clientWidth || 320;
    el.scrollBy({ left: dir === 'left' ? -cardWidth - 16 : cardWidth + 16, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section
        className="relative py-14 sm:py-16 lg:py-20 overflow-hidden"
        style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            {/* Shimmer skeleton */}
            <div className="w-48 h-4 rounded-full bg-[#d8aa67]/20 animate-pulse" />
            <div className="w-72 h-8 rounded-full bg-[#d8aa67]/15 animate-pulse" />
            <div className="flex gap-4 w-full mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[320px] h-[220px] rounded-xl bg-[#d8aa67]/10 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (promos.length === 0) return null;

  return (
    <section
      className="relative py-14 sm:py-16 lg:py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}
      aria-label="Current Promotions"
    >
      {/* ── SUBTLE HERITAGE BACKGROUND PATTERN ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #d8aa67 1px, transparent 1px),
                            radial-gradient(circle at 80% 50%, #d8aa67 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          {/* Eyebrow */}
          <div className="inline-flex items-center justify-center space-x-3 mb-2.5">
            <span className="w-8 sm:w-10 h-[1px] bg-[#d8aa67]/80" />
            <span
              className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase"
              style={{ color: 'var(--antique-gold, #d8aa67)' }}
            >
              Special Offers
            </span>
            <span className="w-8 sm:w-10 h-[1px] bg-[#d8aa67]/80" />
          </div>

          {/* Main heading */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2.5 leading-tight"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              color: 'var(--burgundy, #781c1c)',
            }}
          >
            Royal Promotions
          </h2>

          {/* Description */}
          <p
            className="text-xs sm:text-sm font-normal max-w-xl mx-auto leading-relaxed"
            style={{ color: 'var(--forest, #4f0809)' }}
          >
            Exclusive offers curated for our guests — savour royal flavours at special prices.
          </p>
        </div>

        {/* ── CAROUSEL WRAPPER ── */}
        <div className="relative group/carousel">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll promotions left"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-[#d8aa67]/40 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110"
              style={{ backgroundColor: 'var(--ivory, #fff8eb)' }}
            >
              <ChevronLeft className="w-5 h-5 text-[#781c1c]" />
            </button>
          )}
          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll promotions right"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-[#d8aa67]/40 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110"
              style={{ backgroundColor: 'var(--ivory, #fff8eb)' }}
            >
              <ChevronRight className="w-5 h-5 text-[#781c1c]" />
            </button>
          )}

          {/* ── SCROLLABLE ROW ── */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {promos.map((promo, idx) => (
              <article
                key={promo.id}
                data-promo-card
                className="group flex-shrink-0 w-[300px] sm:w-[340px] rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-[#d8aa67]/30 hover:border-[#d8aa67]/60 transition-all duration-500 snap-start"
                style={{
                  backgroundColor: 'var(--ivory, #fff8eb)',
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                {/* Image area */}
                <div className="relative h-[170px] sm:h-[190px] overflow-hidden">
                  <Image
                    src={promo.image_url}
                    alt={promo.title}
                    fill
                    sizes="340px"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Badge */}
                  <div
                    className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, #d8aa67, #c89a50)',
                      color: '#380506',
                    }}
                  >
                    <BadgeIcon type={promo.discount_type} />
                    {promo.badge_text}
                  </div>

                  {/* Countdown pill at bottom-right of image */}
                  <div
                    className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-white/95 backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(56, 5, 6, 0.7)' }}
                  >
                    <CountdownTimer endDate={promo.end_date} />
                  </div>
                </div>

                {/* Content area */}
                <div className="p-4 sm:p-5 flex flex-col gap-2.5">
                  {/* Title */}
                  <h3
                    className="text-lg sm:text-xl font-bold leading-snug line-clamp-1"
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                      color: 'var(--burgundy, #781c1c)',
                    }}
                  >
                    {promo.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-xs sm:text-[13px] leading-relaxed line-clamp-2"
                    style={{ color: 'var(--forest, #4f0809)' }}
                  >
                    {promo.description}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center justify-between pt-1">
                    <span
                      className="text-[10px] sm:text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full border"
                      style={{
                        borderColor: 'var(--sand-border, #dfcdb1)',
                        color: 'var(--muted-brown, #5a4334)',
                        backgroundColor: 'var(--cream, #fbf5e9)',
                      }}
                    >
                      {promo.applicable_category}
                    </span>
                    <span
                      className="text-[10px] sm:text-[11px] font-medium"
                      style={{ color: 'var(--field-label, #857866)' }}
                    >
                      {promo.applicable_items_count} items
                    </span>
                  </div>

                  {/* CTA Link */}
                  <Link
                    href="/restaurant"
                    className="inline-flex items-center gap-1.5 mt-1 text-xs sm:text-[13px] font-semibold tracking-wide transition-all duration-200 group/link"
                    style={{ color: 'var(--antique-gold, #d8aa67)' }}
                  >
                    <span className="group-hover/link:underline underline-offset-4">Order Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── VIEW ALL PROMOTIONS BUTTON ── */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <Link
            href="/restaurant"
            className="inline-flex items-center space-x-2 px-8 py-3 rounded-[6px] text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
            style={{
              backgroundColor: 'var(--antique-gold, #d8aa67)',
              color: 'var(--forest-ink, #380506)',
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              fontSize: '16px',
            }}
          >
            <span>Explore All Offers</span>
            <ArrowRight className="w-4 h-4 ml-1 stroke-[1.8] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── BOTTOM DIVIDER ── */}
        <div className="relative flex items-center justify-center w-full max-w-5xl mx-auto mt-10 sm:mt-12">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#d8aa67]/60 to-[#d8aa67]" />
          <div className="px-4 shrink-0 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-[#d8aa67] opacity-80"
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16 4C16.8 8.5 19 12 22 14C19 15 17 17.5 16 21C15 17.5 13 15 10 14C13 12 15.2 8.5 16 4Z" />
              <path d="M16 21C17.5 17 21 14 26 14C23 16 22 19 22 23C19.5 22.5 17.5 22 16 21Z" />
              <path d="M16 21C14.5 17 11 14 6 14C9 16 10 19 10 23C12.5 22.5 14.5 22 16 21Z" />
              <circle cx="16" cy="24" r="1.5" />
              <circle cx="10" cy="24.5" r="1" />
              <circle cx="22" cy="24.5" r="1" />
            </svg>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#d8aa67]/60 to-[#d8aa67]" />
        </div>
      </div>
    </section>
  );
}
