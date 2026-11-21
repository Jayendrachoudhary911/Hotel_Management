'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sparkles, MapPin, Compass } from 'lucide-react';
import { BookingBar } from '@/components/home/booking-bar';

export function HeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const updateScrollProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      // Scroll distance over which the full-screen hero shrinks to framed card (0 to 360px)
      const maxScroll = 360;
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      setScrollProgress(progress);
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        updateScrollProgress();
        rafIdRef.current = null;
      });
    };

    // Initial update
    updateScrollProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  // Compute dynamic insets & radius based on scrollProgress
  // At scrollProgress = 0: Full Screen Edge-to-Edge (0 insets, 0 radius, 0 border, 0 shadow)
  // At scrollProgress = 1: Framed Card (padded insets, rounded corners, gold border, luxury shadow)
  const insetX = scrollProgress * (isMobile ? 12 : 24); // px
  const insetTop = scrollProgress * (isMobile ? 8 : 20); // px
  const insetBottom = scrollProgress * (isMobile ? 4 : 12); // px
  const borderRadius = scrollProgress * (isMobile ? 24 : 40); // px
  const borderOpacity = scrollProgress * 0.45;
  const shadowOpacity = scrollProgress * 0.28;

  // Text content subtle parallax & fade
  const textTranslateY = scrollProgress * -25;
  const textOpacity = 1 - scrollProgress * 0.25;

  return (
    <section className="relative z-20 min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex flex-col justify-between -mt-[72px] sm:-mt-[84px] overflow-visible">
      {/* ── Scroll-Aware Background Image Frame ── */}
      <div
        className="absolute z-0 overflow-hidden will-change-[transform,inset,border-radius]"
        style={{
          top: `${insetTop}px`,
          left: `${insetX}px`,
          right: `${insetX}px`,
          bottom: `${insetBottom}px`,
          borderRadius: `${borderRadius}px`,
          borderColor: `rgba(216, 170, 103, ${borderOpacity})`,
          borderWidth: scrollProgress > 0.05 ? '1px' : '0px',
          borderStyle: 'solid',
          transition:
            'top 0.12s ease-out, left 0.12s ease-out, right 0.12s ease-out, bottom 0.12s ease-out, border-radius 0.15s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out',
          boxShadow:
            scrollProgress > 0.05
              ? `0 ${24 * scrollProgress}px ${60 * scrollProgress}px -10px rgba(20, 8, 10, ${shadowOpacity}), 0 ${6 * scrollProgress}px ${20 * scrollProgress}px rgba(0,0,0,0.06)`
              : 'none',
        }}
      >
        <Image
          src="/images/palace-interior.jpg"
          alt="Rajmahal Heritage Hotel Grand Palace Courtyard and Lakeview"
          fill
          priority
          className="object-cover object-center transition-transform duration-500 ease-out"
          style={{
            transform: `scale(${1.08 - scrollProgress * 0.05})`,
            filter: 'saturate(1.08) sepia(0.08)',
          }}
        />

        {/* Hero Warmth overlay */}
        <div className="hero-warmth pointer-events-none" />
        {/* Hero Shade overlay */}
        <div className="hero-shade pointer-events-none" />
        {/* Gradient vignette for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0203]/75 via-transparent to-[#0A0203]/35 pointer-events-none" />
      </div>

      {/* ── Hero Content (Typography & Luxury Badges) ── */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-36 sm:pt-44 md:pt-48 pb-14 sm:pb-18 w-full will-change-transform"
        style={{
          transform: `translateY(${textTranslateY}px)`,
          opacity: textOpacity,
        }}
      >
        <div className="max-w-2xl text-left">
          {/* 1. Royal Crest Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#D8AA67]/60 text-[#F5E0B8] shadow-lg mb-4 sm:mb-5 group cursor-default">
            <Sparkles className="w-3.5 h-3.5 text-[#E1B46F] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-[#E1B46F]">
              Mewar Palace Heritage &bull; Udaipur
            </span>
          </div>

          {/* 2. Majestic Title */}
          <h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-semibold tracking-tight text-[#FFF8EB] mb-4 sm:mb-6 leading-[0.92] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            }}
          >
            Rooted in{' '}
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#F7E5C3] via-[#E1B46F] to-[#C99A52]">
              Rajasthan
            </span>
          </h1>

          {/* 3. Refined Palace Description */}
          <p className="text-sm sm:text-base lg:text-lg text-[#FFF8EB]/95 mb-5 sm:mb-7 font-light leading-relaxed max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
            Where four centuries of regal Rajputana grandeur embrace Lake Pichola&apos;s serene waters. Six restored imperial suites, candlelit dining courtyards, and timeless palace hospitality.
          </p>

          {/* 4. Luxury Micro-Badges / Trust Affordances */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-[#D8AA67]/40 text-[11px] sm:text-xs font-medium text-[#FFF8EB] shadow-xs">
              <span className="text-[#D8AA67]">🏰</span> 6 Imperial Suites
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-[#D8AA67]/40 text-[11px] sm:text-xs font-medium text-[#FFF8EB] shadow-xs">
              <span className="text-[#D8AA67]">🌊</span> Lake Pichola Vistas
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-[#D8AA67]/40 text-[11px] sm:text-xs font-medium text-[#FFF8EB] shadow-xs">
              <span className="text-[#D8AA67]">👑</span> Aristocratic Dining
            </span>
          </div>
        </div>
      </div>

      {/* ── 5. Overlapping Floating Booking Widget (Maintains complete operability) ── */}
      <div className="relative z-30 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full -mb-10 sm:-mb-14">
        <BookingBar />
      </div>
    </section>
  );
}
