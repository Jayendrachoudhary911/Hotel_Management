'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  X,
  Calendar,
  Users,
} from 'lucide-react';

interface EventMemory {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  alt: string;
  description: string;
  capacity?: string;
}

const EVENT_MEMORIES: EventMemory[] = [
  {
    id: 'wedding-mandap',
    title: 'Imperial Wedding Mandap',
    subtitle: 'Illuminated Palace Courtyard',
    category: 'Royal Weddings',
    image: '/images/events/wedding-mandap.jpg',
    alt: 'Illuminated royal Indian wedding mandap at Rajmahal palace',
    description: 'Grand mandap framed by palace arches, fragrant red marigold carpets, and oil lanterns under starlit Udaipur skies.',
    capacity: '200–500 Guests',
  },
  {
    id: 'palace-dining',
    title: 'Lakeview Jharokha Dining',
    subtitle: 'Aristocratic Silver Service',
    category: 'Palace Dining',
    image: '/images/events/palace-dining.jpg',
    alt: 'Luxurious heritage palace dining setup with lake view',
    description: 'Intimate candlelit dining overlooking Lake Pichola with authentic Rajasthani heritage recipes and private butlers.',
    capacity: '25–60 Guests',
  },
  {
    id: 'folk-dance',
    title: 'Ghoomar & Folk Melodies',
    subtitle: 'Courtyard Cultural Soirée',
    category: 'Cultural Nights',
    image: '/images/events/folk-dance.jpg',
    alt: 'Rajasthani folk dancer performing with traditional musicians in palace courtyard',
    description: 'Vibrant swirling Ghoomar performances accompanied by live Sarangi, Dholak, and soulful Rajasthani folk bards.',
    capacity: '50–150 Guests',
  },
  {
    id: 'grand-banquet',
    title: 'The Durbar Banquet Hall',
    subtitle: 'Crystal Chandeliers & Gold Arches',
    category: 'Grand Celebrations',
    image: '/images/events/grand-banquet.jpg',
    alt: 'Grand royal banquet hall inside Udaipur heritage palace',
    description: 'Sumptuous banquet hall adorned with Belgian crystal chandeliers, hand-carved sandstone arches, and royal seating.',
    capacity: '25–50 Guests',
  },
  {
    id: 'floral-decor',
    title: 'Heirloom Floral Artistry',
    subtitle: 'Marigolds & Hanging Brass Bells',
    category: 'Heritage Decor',
    image: '/images/events/floral-decor.jpg',
    alt: 'Traditional Indian wedding marigold garlands and brass bells',
    description: 'Handcrafted marigold cascades, antique temple bells, and royal bronze urlis floating with scented rose petals.',
    capacity: 'Artisan Bespoke',
  },
  {
    id: 'lakeside-reception',
    title: 'Twilight Lakeside Reception',
    subtitle: 'Panoramic Palace Waterway',
    category: 'Evening Galas',
    image: '/images/events/lakeside-reception.jpg',
    alt: 'Outdoor lakeside palace wedding reception at twilight in Udaipur',
    description: 'Open-air festivities along the edge of Lake Pichola as the sun sets behind the Aravalli hills in shimmering gold.',
    capacity: '150–400 Guests',
  },
  {
    id: 'courtyard-night',
    title: 'Sangeet Under The Stars',
    subtitle: 'Moonlit Heritage Amphitheatre',
    category: 'Music & Sangeet',
    image: '/images/events/courtyard-night.jpg',
    alt: 'Royal palace courtyard celebration with folk musicians at night',
    description: 'Lively pre-wedding celebrations with sitar ensembles, royal fireworks, and starlit banquets in the palace square.',
    capacity: '100–300 Guests',
  },
];

export function EventMemories() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState<EventMemory | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse drag to scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Calculate 3D perspective transforms for every card on scroll
  const updatePerspective = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = cardCenter - containerCenter;

      if (Math.abs(distance) < minDistance) {
        minDistance = Math.abs(distance);
        closestIdx = idx;
      }

      // Normalized distance from center (-1 to 1 across visible viewport)
      const normalized = distance / (containerRect.width * 0.42);
      const clamped = Math.max(-1.5, Math.min(1.5, normalized));

      // 3D Perspective math
      const rotateY = -clamped * 18; // Degrees: curves backwards towards horizon
      const scale = Math.max(0.86, 1.04 - Math.abs(clamped) * 0.12);
      const translateZ = (1 - Math.min(1, Math.abs(clamped))) * 45; // Pops towards viewer in center
      const opacity = Math.max(0.55, 1 - Math.abs(clamped) * 0.28);
      const shadowX = -clamped * 16;

      card.style.transform = `perspective(1200px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)}) translateZ(${translateZ.toFixed(1)}px)`;
      card.style.opacity = `${opacity.toFixed(2)}`;
      card.style.boxShadow = `${shadowX.toFixed(1)}px 24px 50px -10px rgba(35, 10, 14, ${(0.28 + (1 - Math.min(1, Math.abs(clamped))) * 0.18).toFixed(2)})`;
    });

    setActiveIndex(closestIdx);
    setCanScrollLeft(container.scrollLeft > 10);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  }, []);

  // Update on mount and resize
  useEffect(() => {
    updatePerspective();
    const handleResize = () => updatePerspective();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updatePerspective]);

  // Scroll to index
  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    const containerWidth = container.clientWidth;
    const cardLeft = card.offsetLeft;
    const cardWidth = card.clientWidth;
    const targetScroll = cardLeft - containerWidth / 2 + cardWidth / 2;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const handlePrev = () => {
    const newIdx = Math.max(0, activeIndex - 1);
    scrollToIndex(newIdx);
  };

  const handleNext = () => {
    const newIdx = Math.min(EVENT_MEMORIES.length - 1, activeIndex + 1);
    scrollToIndex(newIdx);
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDraggingRef.current = true;
    setIsDraggingState(true);
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDraggingState(false);
    }
  };

  return (
    <section
      className="relative py-14 sm:py-18 lg:py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}
      aria-label="Event Memories — Horizontal Perspective Gallery"
    >
      {/* ── PROMINENT RAJASTHANI ARCHITECTURAL SKETCHES (FLANKING LEFT & RIGHT) ── */}
      <div className="absolute left-[-40px] sm:left-[-20px] lg:left-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 w-64 sm:w-80 lg:w-[420px] xl:w-[460px] opacity-35">
        <img
          src="/images/heritage-elements/palace-line-art.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="absolute right-[-40px] sm:right-[-20px] lg:right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 w-64 sm:w-80 lg:w-[420px] xl:w-[460px] opacity-35 scale-x-[-1]">
        <img
          src="/images/heritage-elements/palace-line-art.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div className="text-center md:text-left max-w-2xl">
            {/* Eyebrow with gold flanking lines */}
            <div className="inline-flex items-center space-x-3 mb-2.5">
              <span className="w-8 sm:w-10 h-[1px] bg-[#d8aa67]/80" />
              <span
                className="text-[11px] sm:text-xs font-semibold tracking-[0.24em] uppercase"
                style={{ color: 'var(--antique-gold, #d8aa67)' }}
              >
                Celebrations That Matter
              </span>
              <span className="w-8 sm:w-10 h-[1px] bg-[#d8aa67]/80 md:hidden" />
            </div>

            {/* Main Heading */}
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2.5 leading-tight"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                color: 'var(--burgundy, #781c1c)',
              }}
            >
              Event Memories
            </h2>

            {/* Description */}
            <p
              className="text-xs sm:text-sm font-normal max-w-xl leading-relaxed"
              style={{ color: 'var(--forest, #4f0809)' }}
            >
              A horizontal perspective journey through royal weddings, lakeside galas, and magnificent celebrations at Rajmahal Heritage Hotel.
            </p>
          </div>

          {/* Desktop Navigation Chevrons */}
          <div className="hidden md:flex items-center space-x-3 mt-4 md:mt-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-full border border-[#D8AA67]/80 flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? 'bg-[#FFFDF9] text-[#670E10] hover:bg-[#670E10] hover:text-[#FFF8EB] hover:scale-105 shadow-md'
                  : 'bg-white/40 text-[#D8AA67]/40 border-[#D8AA67]/30 cursor-not-allowed opacity-50'
              }`}
              aria-label="Previous event memory"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-full border border-[#D8AA67]/80 flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? 'bg-[#FFFDF9] text-[#670E10] hover:bg-[#670E10] hover:text-[#FFF8EB] hover:scale-105 shadow-md'
                  : 'bg-white/40 text-[#D8AA67]/40 border-[#D8AA67]/30 cursor-not-allowed opacity-50'
              }`}
              aria-label="Next event memory"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>

      {/* ── HORIZONTAL PERSPECTIVE STAGE WITH EDGE GRADIENT VIGNETTES ── */}
      <div className="relative w-full overflow-hidden py-4 sm:py-6">
        {/* Ambient Left & Right Edge Vignette Fades */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 md:w-40 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #FBF5E9 15%, rgba(251, 245, 233, 0) 100%)',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 md:w-40 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #FBF5E9 15%, rgba(251, 245, 233, 0) 100%)',
          }}
        />

        {/* 3D Perspective Scroll Track */}
        <div
          ref={containerRef}
          onScroll={updatePerspective}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex items-center space-x-5 sm:space-x-8 md:space-x-10 px-8 sm:px-24 md:px-36 lg:px-48 overflow-x-auto select-none ${
            isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            perspective: '1200px',
            perspectiveOrigin: 'center center',
            transformStyle: 'preserve-3d',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            paddingTop: '20px',
            paddingBottom: '35px',
          }}
        >
          {EVENT_MEMORIES.map((memory, index) => {
            const isCenter = index === activeIndex;

            return (
              <div
                key={memory.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onClick={() => setSelectedMemory(memory)}
                className="group relative shrink-0 w-[275px] sm:w-[330px] md:w-[380px] lg:w-[410px] h-[410px] sm:h-[480px] md:h-[510px] rounded-[22px] sm:rounded-[28px] overflow-hidden border-2 transition-all duration-300 ease-out cursor-pointer"
                style={{
                  backgroundColor: '#FFFDF9',
                  borderColor: isCenter ? '#D8AA67' : 'rgba(216, 170, 103, 0.6)',
                  willChange: 'transform, opacity, box-shadow',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Background Image with Smooth Parallax Zoom */}
                <Image
                  src={memory.image}
                  alt={memory.alt}
                  fill
                  sizes="(max-width: 640px) 275px, (max-width: 1024px) 380px, 410px"
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out pointer-events-none"
                  priority={index < 3}
                />

                {/* Shimmer / Glass reflection layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity" />

                {/* Top Category Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-[#D8AA67]/60 text-[#FFF8EB] text-[11px] font-semibold tracking-wide shadow-md">
                  <Sparkles className="w-3 h-3 text-[#D8AA67]" />
                  <span>{memory.category}</span>
                </div>

                {/* Top-Right Expand Icon on Hover */}
                <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:text-[#FFF8EB] group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {/* Bottom Dark Gradient Card Deck */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 bg-gradient-to-t from-black/92 via-black/60 to-transparent flex flex-col justify-end text-left pointer-events-none">
                  {/* Subtitle / Location */}
                  <span
                    className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#E1B46F] mb-1 drop-shadow"
                    style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                  >
                    {memory.subtitle}
                  </span>

                  {/* Title */}
                  <h3
                    className="text-2xl sm:text-3xl font-bold text-[#FFF8EB] leading-tight mb-2 group-hover:text-[#E1B46F] transition-colors drop-shadow-md"
                    style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                  >
                    {memory.title}
                  </h3>

                  {/* 1-Line Description */}
                  <p className="text-xs text-[#EAE4D9]/90 font-light leading-relaxed line-clamp-2 mb-3 drop-shadow">
                    {memory.description}
                  </p>

                  {/* Action Link Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[11px] sm:text-xs font-medium text-[#FAF7F2]">
                    <span className="flex items-center space-x-1.5 text-[#E1B46F]">
                      <Users className="w-3.5 h-3.5" />
                      <span>{memory.capacity}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1 text-[#FFF8EB] font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D8AA67]" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── INTERACTIVE SLIDE INDICATORS & CONTROLS ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Mobile Chevrons */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border border-[#D8AA67]/80 ${
                canScrollLeft ? 'bg-[#FFFDF9] text-[#670E10]' : 'opacity-40'
              }`}
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border border-[#D8AA67]/80 ${
                canScrollRight ? 'bg-[#FFFDF9] text-[#670E10]' : 'opacity-40'
              }`}
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Dots Indicator */}
          <div className="flex items-center space-x-2">
            {EVENT_MEMORIES.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => scrollToIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === activeIndex
                    ? 'w-7 sm:w-9 h-2 bg-[#670E10] border border-[#D8AA67]'
                    : 'w-2 h-2 bg-[#D8AA67]/40 hover:bg-[#D8AA67]'
                }`}
                aria-label={`Jump to ${m.title}`}
              />
            ))}
          </div>

          {/* View Gallery Link */}
          <Link
            href="/hotel"
            className="inline-flex items-center space-x-2 px-6 sm:px-7 py-2.5 rounded-[6px] text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
            style={{
              backgroundColor: 'var(--antique-gold, #d8aa67)',
              color: 'var(--forest-ink, #380506)',
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              fontSize: '15px',
            }}
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4 ml-1 stroke-[1.8] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── DELICATE ANTIQUE-GOLD BOTTOM DIVIDER WITH CENTER LOTUS MOTIF ── */}
        <div className="relative flex items-center justify-center w-full max-w-5xl mx-auto mt-10 sm:mt-12">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#d8aa67]/60 to-[#d8aa67]" />
          <div className="px-4 shrink-0 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-[#d8aa67] opacity-80"
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
            >
              {/* Symmetrical Rajasthani Lotus Motif */}
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

      {/* ── FULLSCREEN IMMERSIVE LIGHTBOX MODAL ── */}
      {selectedMemory && mounted && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMemory(null);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-[24px] bg-[#FFFDF9] border border-[#D8AA67]/60 shadow-[0_25px_60px_rgba(40,5,8,0.6)] flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left/Top Image in Lightbox */}
            <div className="relative w-full md:w-3/5 h-64 sm:h-80 md:h-[520px] bg-black">
              <Image
                src={selectedMemory.image}
                alt={selectedMemory.alt}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 text-[#FFF8EB] border border-[#D8AA67]/50 text-xs font-semibold backdrop-blur-xs">
                {selectedMemory.category}
              </div>
            </div>

            {/* Right/Bottom Story & Details in Lightbox */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between text-left bg-[#FFFDF9]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D8AA67] block mb-1">
                  {selectedMemory.subtitle}
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-bold text-[#670E10] mb-3 leading-tight"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  {selectedMemory.title}
                </h3>
                <p className="text-sm text-[#4F0809] leading-relaxed mb-6 font-normal">
                  {selectedMemory.description}
                </p>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC9] space-y-2 mb-6 text-xs text-[#6B5E4F]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#241F1A]">Celebration Capacity:</span>
                    <span className="text-[#670E10] font-bold">{selectedMemory.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#241F1A]">Location:</span>
                    <span>Palace Courtyard &amp; Terrace</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#241F1A]">Cuisine Available:</span>
                    <span>Royal Mewari &bull; Pure Veg &bull; Multi-Cuisine</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#DFD3C3]">
                <Link
                  href="/hotel#party-hall-enquiry"
                  onClick={() => setSelectedMemory(null)}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-[8px] bg-gradient-to-r from-[#670E10] to-[#801417] text-[#FFF8EB] text-xs sm:text-sm font-bold tracking-wide shadow hover:shadow-md transition-all text-center"
                >
                  <Calendar className="w-4 h-4 text-[#D8AA67]" />
                  <span>Enquire for Celebration</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedMemory(null)}
                  className="py-3 px-4 rounded-[8px] border border-[#D8AA67] text-[#670E10] text-xs sm:text-sm font-semibold hover:bg-[#FAF7F2] transition text-center cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}