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
  ChevronLeft,
  ChevronRight,
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

  const selectedIndex = selectedMemory
    ? EVENT_MEMORIES.findIndex((m) => m.id === selectedMemory.id)
    : -1;

  const showPrev = useCallback(() => {
    setSelectedMemory((curr) => {
      if (!curr) return null;
      const idx = EVENT_MEMORIES.findIndex((m) => m.id === curr.id);
      const prevIdx = (idx - 1 + EVENT_MEMORIES.length) % EVENT_MEMORIES.length;
      return EVENT_MEMORIES[prevIdx];
    });
  }, []);

  const showNext = useCallback(() => {
    setSelectedMemory((curr) => {
      if (!curr) return null;
      const idx = EVENT_MEMORIES.findIndex((m) => m.id === curr.id);
      const nextIdx = (idx + 1) % EVENT_MEMORIES.length;
      return EVENT_MEMORIES[nextIdx];
    });
  }, []);

  useEffect(() => {
    if (!selectedMemory) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMemory(null);
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMemory, showPrev, showNext]);

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
      className="relative h-[360vh] sm:h-[420vh] lg:h-[460vh]"
      style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}
      aria-label="Event Memories — Sticky Scroll Perspective Gallery"
    >
      {/* ── STICKY PINNED VIEWPORT CONTAINER ── */}
      <div className="sticky top-0 h-[90dvh] sm:h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col justify-between pt-[64px] sm:pt-[72px] lg:pt-[76px] pb-4 sm:pb-5 z-10">
        {/* Architectural Line Art Flanking in Background */}
        <div className="absolute -left-12 sm:-left-5 lg:left-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 w-44 sm:w-80 lg:w-[420px] opacity-20 sm:opacity-25">
          <img
            src="/images/heritage-elements/palace-line-art.png"
            alt=""
            aria-hidden="true"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="absolute -right-12 sm:-right-5 lg:right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 w-44 sm:w-80 lg:w-[420px] opacity-20 sm:opacity-25 scale-x-[-1]">
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
            <div className="text-center md:text-left max-w-2xl mx-auto md:mx-0">
              {/* Eyebrow */}
              <div className="inline-flex items-center justify-center md:justify-start space-x-2.5 sm:space-x-3 mb-0.5 sm:mb-1">
                <span className="w-6 sm:w-10 h-[1px] bg-[#C99A52]" />
                <span className="text-[9px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#9C7A45]">
                  Celebrations That Matter
                </span>
                <span className="w-6 sm:w-10 h-[1px] bg-[#C99A52] md:hidden" />
              </div>

              {/* Main Heading */}
              <h2
                className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight text-[#4F0809]"
                style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                }}
              >
                Event Memories
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-[13px] font-normal max-w-xl leading-relaxed hidden sm:block mt-0.5 text-[#4F0809]/85">
                Scroll page to journey through royal weddings, lakeside galas, and magnificent celebrations.
              </p>
            </div>

            {/* Active Celebration Indicator (Compact Pill on Mobile, Full Readout on Desktop) */}
            <div className="flex md:flex-col items-center justify-center md:items-end text-center md:text-right mt-1 md:mt-0">
              <div className="inline-flex md:flex md:flex-col items-center md:items-end gap-2 md:gap-0.5 px-3 py-1 md:p-0 rounded-full bg-[#FDF8EE] md:bg-transparent border border-[#C99A52]/50 md:border-none">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#4F0809] tracking-wider uppercase flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-[#D8AA67]" />
                  <span>
                    0{activeIndex + 1} / 0{EVENT_MEMORIES.length}
                  </span>
                </span>
                <span className="text-[#C99A52] md:hidden text-[10px]">&#9830;</span>
                <span
                  className="text-xs sm:text-base font-bold text-[#4F0809] truncate max-w-[180px] sm:max-w-none"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  {EVENT_MEMORIES[activeIndex].title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── HORIZONTAL PERSPECTIVE STAGE ── */}
        <div className="relative w-full overflow-visible my-auto py-2 sm:py-6 lg:py-8">
          {/* Subtle Left & Right Edge Vignette Fades (Narrow on Mobile so Cards Stay Crisp) */}
          <div
            className="absolute left-0 top-0 bottom-0 w-6 sm:w-28 md:w-44 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, #FBF5E9 15%, rgba(251, 245, 233, 0) 100%)',
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-6 sm:w-28 md:w-44 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, #FBF5E9 15%, rgba(251, 245, 233, 0) 100%)',
            }}
          />

          {/* Perspective Track (Centered Initial Offset for 220px Mobile Cards) */}
          <div
            ref={trackRef}
            className="flex items-center space-x-4 sm:space-x-7 md:space-x-9 pl-[calc(50vw-110px)] sm:pl-[20vw] md:pl-[25vw] pr-[calc(50vw-110px)] sm:pr-[25vw]"
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
                  className="group relative shrink-0 w-[220px] sm:w-[275px] md:w-[310px] lg:w-[335px] xl:w-[360px] h-[270px] min-[400px]:h-[295px] sm:h-[340px] md:h-[370px] lg:h-[395px] xl:h-[420px] rounded-t-3xl rounded-b-2xl sm:rounded-[26px] overflow-hidden border transition-colors duration-200 cursor-pointer"
                  style={{
                    backgroundColor: '#1b0608',
                    borderColor: isCenter ? '#D8AA67' : 'rgba(201, 154, 82, 0.45)',
                    willChange: 'transform, opacity',
                    transformStyle: 'preserve-3d',
                  }}
                  aria-label={memory.title}
                >
                  {/* Full-Bleed Image */}
                  <Image
                    src={memory.image}
                    alt={memory.alt}
                    fill
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 335px, 360px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                    priority={index < 3}
                  />

                  {/* Top-Right Expand Button */}
                  <div
                    className="absolute top-2.5 sm:top-3.5 right-2.5 sm:right-3.5 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#4F0809]/80 backdrop-blur-md border border-[#D8AA67]/70 flex items-center justify-center text-[#FFF8EB] group-hover:scale-110 group-hover:bg-[#4F0809] transition-all duration-300 pointer-events-none"
                    aria-hidden="true"
                  >
                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D8AA67]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER CONTROLS & PROGRESS BAR AT BOTTOM OF PINNED VIEWPORT ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
            {/* Scroll Progress Bar & Dots */}
            <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4 w-full sm:w-auto">
              <div className="w-28 sm:w-56 h-1.5 bg-[#D8AA67]/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D8AA67] to-[#4F0809] rounded-full transition-all duration-75"
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
                        ? 'w-5 sm:w-6 h-2 bg-[#4F0809] border border-[#D8AA67]'
                        : 'w-2 h-2 bg-[#C99A52]/40 hover:bg-[#D8AA67]'
                    }`}
                    aria-label={`Jump to ${m.title}`}
                  />
                ))}
              </div>
            </div>

            {/* Scroll Hint & View Full Gallery */}
            <div className="flex items-center justify-center sm:justify-end space-x-4 w-full sm:w-auto">
              <span className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-[#6B533B] font-medium">
                {scrollProgress >= 0.88 ? (
                  <span className="text-[#4F0809] font-bold flex items-center space-x-1">
                    <span>Celebrations Complete &bull; Continue Scrolling</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#4F0809]" />
                  </span>
                ) : (
                  <>
                    <span>Scroll down to explore celebrations</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#C99A52] animate-bounce" />
                  </>
                )}
              </span>

              <Link
                href="/hotel"
                className="inline-flex items-center justify-center space-x-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#4F0809] hover:bg-[#680b0c] border border-[#D8AA67]/70 text-[#FFF8EB] text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-200 cursor-pointer group"
              >
                <span>View Full Gallery</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D8AA67] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── FULLSCREEN IMAGE-ONLY LIGHTBOX GALLERY (PORTAL TO DOCUMENT.BODY) ── */}
      {selectedMemory &&
        mounted &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedMemory(null);
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md animate-fade-in select-none"
          >
            {/* Top Bar with Counter and Close Button */}
            <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/60 border border-[#D8AA67]/30 text-[#FFF8EB] text-[11px] sm:text-sm font-semibold tracking-wider uppercase truncate max-w-[75%]">
                {selectedIndex + 1} / {EVENT_MEMORIES.length} &bull; {selectedMemory.title}
              </span>
              <button
                type="button"
                onClick={() => setSelectedMemory(null)}
                className="pointer-events-auto shrink-0 p-2 rounded-full bg-black/60 border border-[#D8AA67]/40 text-white/90 hover:text-white hover:bg-black/90 transition-all cursor-pointer active:scale-95"
                aria-label="Close image gallery"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Left Prev Navigation Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              className="absolute left-2.5 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3.5 rounded-full bg-black/65 border border-[#D8AA67]/40 text-[#FFF8EB] hover:text-white hover:bg-black/90 active:scale-95 transition-all cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Next Navigation Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              className="absolute right-2.5 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3.5 rounded-full bg-black/65 border border-[#D8AA67]/40 text-[#FFF8EB] hover:text-white hover:bg-black/90 active:scale-95 transition-all cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Main Pure Image Frame */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl h-[65vh] sm:h-[80vh] md:h-[86vh] rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center"
            >
              <Image
                src={selectedMemory.image}
                alt={selectedMemory.alt}
                fill
                className="object-contain rounded-2xl sm:rounded-3xl"
                sizes="(max-width: 1280px) 95vw, 1200px"
                priority
              />
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}