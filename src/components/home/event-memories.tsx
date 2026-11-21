'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Maximize2,
  X,
  Calendar,
  Users,
  ChevronDown,
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedMemory, setSelectedMemory] = useState<EventMemory | null>(null);

  // Smooth LERP (Linear Interpolation) motion state
  const targetTranslateX = useRef(0);
  const currentTranslateX = useRef(0);
  const isRunningRef = useRef(false);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute target horizontal offset based on current scroll position
  const updateTargetFromScroll = useCallback(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const section = sectionRef.current;
    const rect = section.getBoundingClientRect();
    const windowH = window.innerHeight;
    const windowW = window.innerWidth;

    const scrollableH = rect.height - windowH;
    if (scrollableH <= 0) return;

    const rawProgress = -rect.top / scrollableH;
    const progress = Math.max(0, Math.min(1, rawProgress));
    setScrollProgress(progress);

    const firstCard = cardRefs.current[0];
    const lastCard = cardRefs.current[EVENT_MEMORIES.length - 1];
    const screenCenter = windowW / 2;

    if (firstCard && lastCard) {
      const firstCardCenter = firstCard.offsetLeft + firstCard.offsetWidth / 2;
      const lastCardCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
      const startTranslate = firstCardCenter - screenCenter;
      const endTranslate = lastCardCenter - screenCenter;
      const totalTravel = endTranslate - startTranslate;

      const travelProgress = Math.max(0, Math.min(1, (progress - 0.04) / 0.84));
      targetTranslateX.current = startTranslate + travelProgress * totalTravel;
    }
  }, []);

  // 60–120 FPS continuous render frame with smooth interpolation & 3D perspective transforms
  const renderFrame = useCallback(() => {
    if (!trackRef.current) {
      isRunningRef.current = false;
      return;
    }

    const diff = targetTranslateX.current - currentTranslateX.current;
    // Damping factor 0.1 gives silky smooth inertia without lag
    if (Math.abs(diff) > 0.08) {
      currentTranslateX.current += diff * 0.1;
    } else {
      currentTranslateX.current = targetTranslateX.current;
    }

    trackRef.current.style.transform = `translate3d(${-currentTranslateX.current}px, 0, 0)`;

    // Calculate real-time 3D perspective transforms for each card
    const windowW = window.innerWidth;
    const screenCenter = windowW / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = cardCenter - screenCenter;

      if (Math.abs(distance) < minDistance) {
        minDistance = Math.abs(distance);
        closestIndex = idx;
      }

      // Normalized distance from center (-1 to +1 across visible area)
      const normalized = distance / (windowW * 0.38);
      const clamped = Math.max(-1.5, Math.min(1.5, normalized));

      // Gentle, elegant 3D Perspective transforms (no vertical clipping)
      const rotateY = -clamped * 15;
      const scale = Math.max(0.88, 1.04 - Math.abs(clamped) * 0.10);
      const translateZ = (1 - Math.min(1, Math.abs(clamped))) * 35;
      const opacity = Math.max(0.65, 1 - Math.abs(clamped) * 0.22);
      const shadowX = -clamped * 14;

      card.style.transform = `perspective(1200px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)}) translateZ(${translateZ.toFixed(1)}px)`;
      card.style.opacity = `${opacity.toFixed(2)}`;
      card.style.boxShadow = `${shadowX.toFixed(1)}px 18px 36px -10px rgba(35, 10, 14, ${(0.22 + (1 - Math.min(1, Math.abs(clamped))) * 0.14).toFixed(2)})`;
    });

    setActiveIndex(closestIndex);

    // Keep loop active until difference settles to sub-pixel accuracy
    if (Math.abs(diff) > 0.08) {
      animFrameId.current = requestAnimationFrame(renderFrame);
    } else {
      isRunningRef.current = false;
    }
  }, []);

  const triggerSmoothUpdate = useCallback(() => {
    updateTargetFromScroll();
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      animFrameId.current = requestAnimationFrame(renderFrame);
    }
  }, [updateTargetFromScroll, renderFrame]);

  // Listen to window scroll and resize
  useEffect(() => {
    // Initial calculations across render lifecycle
    updateTargetFromScroll();
    currentTranslateX.current = targetTranslateX.current;
    renderFrame();

    const timer1 = setTimeout(() => {
      updateTargetFromScroll();
      currentTranslateX.current = targetTranslateX.current;
      renderFrame();
    }, 60);

    const timer2 = setTimeout(() => {
      updateTargetFromScroll();
      renderFrame();
    }, 300);

    window.addEventListener('scroll', triggerSmoothUpdate, { passive: true });
    window.addEventListener('resize', triggerSmoothUpdate, { passive: true });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('scroll', triggerSmoothUpdate);
      window.removeEventListener('resize', triggerSmoothUpdate);
    };
  }, [updateTargetFromScroll, renderFrame, triggerSmoothUpdate]);

  // Jump to specific memory card by scrolling page to that progress
  const jumpToMemory = (idx: number) => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;
    const rect = section.getBoundingClientRect();
    const currentScrollY = window.scrollY;
    const sectionTop = currentScrollY + rect.top;
    const totalScrollableH = rect.height - window.innerHeight;

    // Target travelProgress: idx / (N - 1)
    // Inverse formula: rawProgress = 0.04 + travelProgress * 0.84
    const targetTravelProgress = idx / (EVENT_MEMORIES.length - 1);
    const targetRawProgress = 0.04 + targetTravelProgress * 0.84;
    const targetY = sectionTop + targetRawProgress * totalScrollableH;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[420vh] lg:h-[460vh]"
      style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}
      aria-label="Event Memories — Sticky Scroll Perspective Gallery"
    >
      {/* ── STICKY PINNED VIEWPORT CONTAINER (LOCKS ON SCREEN WHILE SCROLLING) ── */}
      <div className="sticky top-0 h-screen h-[100dvh] max-h-screen w-full overflow-hidden flex flex-col justify-between pt-[68px] sm:pt-[72px] lg:pt-[76px] pb-3 sm:pb-4 lg:pb-5 z-10">
        {/* Architectural Line Art Flanking in Background */}
        <div className="absolute left-[-40px] sm:left-[-20px] lg:left-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 w-64 sm:w-80 lg:w-[420px] opacity-25">
          <img
            src="/images/heritage-elements/palace-line-art.png"
            alt=""
            aria-hidden="true"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="absolute right-[-40px] sm:right-[-20px] lg:right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 w-64 sm:w-80 lg:w-[420px] opacity-25 scale-x-[-1]">
          <img
            src="/images/heritage-elements/palace-line-art.png"
            alt=""
            aria-hidden="true"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* ── SECTION HEADER AT TOP OF PINNED VIEWPORT ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full shrink-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-1 sm:gap-2">
            <div className="text-center md:text-left max-w-2xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center space-x-3 mb-1">
                <span className="w-8 sm:w-10 h-[1px] bg-[#d8aa67]/80" />
                <span
                  className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase"
                  style={{ color: 'var(--antique-gold, #d8aa67)' }}
                >
                  Celebrations That Matter
                </span>
                <span className="w-8 sm:w-10 h-[1px] bg-[#d8aa67]/80 md:hidden" />
              </div>

              {/* Main Heading */}
              <h2
                className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight"
                style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  color: 'var(--burgundy, #781c1c)',
                }}
              >
                Event Memories
              </h2>

              {/* Subtitle */}
              <p
                className="text-xs sm:text-[13px] font-normal max-w-xl leading-relaxed hidden sm:block mt-0.5"
                style={{ color: 'var(--forest, #4f0809)' }}
              >
                Scroll page to journey through royal weddings, lakeside galas, and magnificent celebrations.
              </p>
            </div>

            {/* Active Celebration Indicator (Shows current memory and scroll hint) */}
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-[11px] font-bold text-[#670E10] tracking-wider uppercase flex items-center space-x-1.5 mb-0.5">
                <Sparkles className="w-3 h-3 text-[#D8AA67]" />
                <span>
                  0{activeIndex + 1} / 0{EVENT_MEMORIES.length}
                </span>
              </span>
              <span
                className="text-base font-bold text-[#241F1A]"
                style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
              >
                {EVENT_MEMORIES[activeIndex].title}
              </span>
            </div>
          </div>
        </div>

        {/* ── HORIZONTAL PERSPECTIVE STAGE WITH DUAL EDGE VIGNETTES (OVERFLOW VISIBLE TO PREVENT CLIPPING) ── */}
        <div className="relative w-full overflow-visible my-auto py-4 sm:py-6 lg:py-8">
          {/* Ambient Left & Right Edge Vignette Fades */}
          <div
            className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, #FBF5E9 25%, rgba(251, 245, 233, 0) 100%)',
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, #FBF5E9 25%, rgba(251, 245, 233, 0) 100%)',
            }}
          />

          {/* Perspective Track (Translated Horizontally with Smooth LERP as Page Scrolls Vertically) */}
          <div
            ref={trackRef}
            className="flex items-center space-x-5 sm:space-x-7 md:space-x-9 pl-[10vw] sm:pl-[20vw] md:pl-[25vw] pr-[25vw]"
            style={{
              perspective: '1200px',
              perspectiveOrigin: 'center center',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
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
                  className="group relative shrink-0 w-[240px] sm:w-[275px] md:w-[310px] lg:w-[335px] xl:w-[360px] h-[300px] sm:h-[340px] md:h-[370px] lg:h-[395px] xl:h-[420px] rounded-[20px] sm:rounded-[26px] overflow-hidden border-2 transition-colors duration-200 cursor-pointer"
                  style={{
                    backgroundColor: '#FFFDF9',
                    borderColor: isCenter ? '#D8AA67' : 'rgba(216, 170, 103, 0.6)',
                    willChange: 'transform, opacity, box-shadow',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Background Image with Smooth Parallax Zoom on Hover */}
                  <Image
                    src={memory.image}
                    alt={memory.alt}
                    fill
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 335px, 360px"
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out pointer-events-none"
                    priority={index < 3}
                  />

                  {/* Shimmer / Glass reflection layer */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-[#D8AA67]/60 text-[#FFF8EB] text-[10px] font-semibold tracking-wide shadow-md">
                    <Sparkles className="w-2.5 h-2.5 text-[#D8AA67]" />
                    <span>{memory.category}</span>
                  </div>

                  {/* Top-Right Expand Icon on Hover */}
                  <div className="absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:text-[#FFF8EB] group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                    <Maximize2 className="w-3 h-3" />
                  </div>

                  {/* Bottom Dark Gradient Card Deck */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/65 to-transparent flex flex-col justify-end text-left pointer-events-none">
                    {/* Subtitle / Location */}
                    <span
                      className="text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-[#E1B46F] mb-0.5 drop-shadow"
                      style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                    >
                      {memory.subtitle}
                    </span>

                    {/* Title */}
                    <h3
                      className="text-lg sm:text-xl lg:text-2xl font-bold text-[#FFF8EB] leading-tight mb-1 group-hover:text-[#E1B46F] transition-colors drop-shadow-md"
                      style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                    >
                      {memory.title}
                    </h3>

                    {/* 1-Line Description */}
                    <p className="text-[11px] sm:text-xs text-[#EAE4D9]/90 font-light leading-relaxed line-clamp-2 mb-2 drop-shadow">
                      {memory.description}
                    </p>

                    {/* Action Link Row */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-white/15 text-[10px] sm:text-[11px] font-medium text-[#FAF7F2]">
                      <span className="flex items-center space-x-1.5 text-[#E1B46F]">
                        <Users className="w-3 h-3" />
                        <span>{memory.capacity}</span>
                      </span>
                      <span className="inline-flex items-center space-x-1 text-[#FFF8EB] font-semibold group-hover:translate-x-1 transition-transform">
                        <span>Explore</span>
                        <ArrowRight className="w-3 h-3 text-[#D8AA67]" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER CONTROLS & PROGRESS BAR AT BOTTOM OF PINNED VIEWPORT ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Scroll Progress Bar & Dots */}
            <div className="flex items-center space-x-4">
              <div className="w-36 sm:w-56 h-1.5 bg-[#D8AA67]/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D8AA67] to-[#670E10] rounded-full transition-all duration-75"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>

              {/* Jump Dots */}
              <div className="flex items-center space-x-1.5">
                {EVENT_MEMORIES.map((m, idx) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => jumpToMemory(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      idx === activeIndex
                        ? 'w-6 h-2 bg-[#670E10] border border-[#D8AA67]'
                        : 'w-2 h-2 bg-[#D8AA67]/40 hover:bg-[#D8AA67]'
                    }`}
                    aria-label={`Jump to ${m.title}`}
                  />
                ))}
              </div>
            </div>

            {/* Scroll Hint & View Full Gallery */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-[#8A7B68] font-medium">
                {scrollProgress >= 0.88 ? (
                  <span className="text-[#670E10] font-bold flex items-center space-x-1">
                    <span>Celebrations Complete &bull; Continue Scrolling</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#670E10]" />
                  </span>
                ) : (
                  <>
                    <span>Scroll down to explore celebrations</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#D8AA67] animate-bounce" />
                  </>
                )}
              </span>

              <Link
                href="/hotel"
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-[6px] text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
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
          </div>
        </div>
      </div>

      {/* ── FULLSCREEN IMMERSIVE LIGHTBOX MODAL (PORTAL TO DOCUMENT.BODY) ── */}
      {selectedMemory &&
        mounted &&
        createPortal(
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