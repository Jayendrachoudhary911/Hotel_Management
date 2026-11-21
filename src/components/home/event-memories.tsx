'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import {
  Play,
  Eye,
  Maximize2,
  X,
  Sparkles,
  Calendar,
  Volume2,
  VolumeX,
  ArrowRight,
} from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface CanvasItem {
  id: string;
  type: 'photo' | 'reel';
  title: string;
  subtitle?: string;
  category: string;
  image: string;
  alt: string;
  videoUrl?: string;
  views?: string;
  duration?: string;
  aspectSpan: string; // Tailwind grid span classes
  details?: string;
}

const CANVAS_ITEMS: CanvasItem[] = [
  // 1. Reel: Destination Weddings (Large Hero Reel)
  {
    id: 'reel-dest-wedding',
    type: 'reel',
    title: 'Destination Weddings at the Palace',
    subtitle: 'Royal Rajputana Bride',
    category: 'Reels',
    image: '/images/reels/destination-weddings.jpg',
    alt: 'Royal Rajasthani bride in deep red and gold bridal lehenga in palace jharokha',
    videoUrl: 'https://assets.mixkit.co/videos/42407/42407-720.mp4',
    views: '23.1K',
    duration: '0:50',
    aspectSpan: 'col-span-2 row-span-2',
    details: 'A regal destination wedding unfolds along the marble corridors and sunset terraces of Rajmahal.',
  },

  // 2. Photo: Imperial Wedding Mandap (Tall Portrait)
  {
    id: 'photo-mandap',
    type: 'photo',
    title: 'Imperial Wedding Mandap',
    category: 'Celebration',
    image: '/images/events/wedding-mandap.jpg',
    alt: 'Illuminated royal Indian wedding mandap at Rajmahal palace',
    aspectSpan: 'col-span-1 sm:col-span-1 row-span-2',
    details: 'Grand floral mandap set under the starlit skies of Lake Pichola with candle-lit chandeliers.',
  },

  // 3. Photo: Lakeview Jharokha Dining (Wide Landscape)
  {
    id: 'photo-dining',
    type: 'photo',
    title: 'Lakeview Jharokha Dining',
    category: 'Celebration',
    image: '/images/events/palace-dining.jpg',
    alt: 'Luxurious heritage palace dining setup with lake view',
    aspectSpan: 'col-span-2 row-span-1',
    details: 'Intimate candlelit dining overlooking Lake Pichola with authentic Rajasthani heritage silver service.',
  },

  // 4. Reel: Serene Mornings (Square)
  {
    id: 'reel-morning',
    type: 'reel',
    title: 'Serene Mornings by the Lake',
    subtitle: 'Golden Sunrise Glow',
    category: 'Reels',
    image: '/images/reels/serene-mornings.jpg',
    alt: 'Golden morning sunrise along lake arches at Rajmahal Heritage Hotel',
    videoUrl: 'https://assets.mixkit.co/videos/42407/42407-720.mp4',
    views: '12.4K',
    duration: '0:28',
    aspectSpan: 'col-span-1 row-span-1',
    details: 'Sunlight washing through century-old stone jharokhas onto tranquil Udaipur waters.',
  },

  // 5. Photo: Ghoomar & Folk Melodies (Landscape)
  {
    id: 'photo-dance',
    type: 'photo',
    title: 'Ghoomar & Folk Melodies',
    category: 'Celebration',
    image: '/images/events/folk-dance.jpg',
    alt: 'Rajasthani folk dancer performing with traditional musicians in palace courtyard',
    aspectSpan: 'col-span-2 sm:col-span-1 row-span-1',
    details: 'Vibrant swirling Ghoomar performances accompanied by live Sarangi, Dholak, and folk bards.',
  },

  // 6. Reel: Royal Dining Experience (Square)
  {
    id: 'reel-dining',
    type: 'reel',
    title: 'Royal Dining Experience',
    subtitle: '56-Bhog Heritage Feast',
    category: 'Reels',
    image: '/images/reels/royal-dining.jpg',
    alt: 'Traditional Rajasthani royal 56-bhog thali feast with oil lamps',
    videoUrl: 'https://assets.mixkit.co/videos/42407/42407-720.mp4',
    views: '8.9K',
    duration: '0:35',
    aspectSpan: 'col-span-1 row-span-1',
    details: 'Authentic Mewari royal thali prepared with heirloom spices and served in pure bell metal.',
  },

  // 7. Photo: The Durbar Banquet Hall (Large Hero Photo)
  {
    id: 'photo-banquet',
    type: 'photo',
    title: 'The Durbar Banquet Hall',
    category: 'Celebration',
    image: '/images/events/grand-banquet.jpg',
    alt: 'Grand royal banquet hall inside Udaipur heritage palace',
    aspectSpan: 'col-span-2 row-span-2',
    details: 'Sumptuous banquet hall adorned with Belgian crystal chandeliers and hand-carved arches.',
  },

  // 8. Reel: Udaipur Views from Rajmahal (Wide Landscape Reel)
  {
    id: 'reel-views',
    type: 'reel',
    title: 'Udaipur Views from Rajmahal',
    subtitle: 'Moonlit Lake Pichola',
    category: 'Reels',
    image: '/images/reels/udaipur-views.jpg',
    alt: 'Illuminated night panorama of Udaipur palace reflecting across Lake Pichola',
    videoUrl: 'https://assets.mixkit.co/videos/42407/42407-720.mp4',
    views: '18.7K',
    duration: '0:31',
    aspectSpan: 'col-span-2 row-span-1',
    details: 'Twilight panoramics sweeping over city palace domes and shimmering tranquil waters.',
  },

  // 9. Photo: Heirloom Floral Artistry (Tall Portrait)
  {
    id: 'photo-decor',
    type: 'photo',
    title: 'Heirloom Floral Artistry',
    category: 'Celebration',
    image: '/images/events/floral-decor.jpg',
    alt: 'Traditional Indian wedding marigold garlands and brass bells',
    aspectSpan: 'col-span-1 row-span-2',
    details: 'Cascades of fragrant yellow marigolds, temple brass bells, and floating rose urli bowls.',
  },

  // 10. Reel: Heritage Rooms Inside Look (Tall Vertical Reel)
  {
    id: 'reel-rooms',
    type: 'reel',
    title: 'Heritage Rooms Inside Look',
    subtitle: 'Sheesh Mahal Suites',
    category: 'Reels',
    image: '/images/reels/heritage-rooms.jpg',
    alt: 'Inside look of luxurious Sheesh Mahal palace suite with stained glass and chandelier',
    videoUrl: 'https://assets.mixkit.co/videos/42407/42407-720.mp4',
    views: '15.2K',
    duration: '0:42',
    aspectSpan: 'col-span-1 row-span-2',
    details: 'Intricate stained glass windows, four-poster teakwood beds, and antique Rajputana murals.',
  },

  // 11. Photo: Twilight Lakeside Reception (Wide Landscape)
  {
    id: 'photo-reception',
    type: 'photo',
    title: 'Twilight Lakeside Reception',
    category: 'Celebration',
    image: '/images/events/lakeside-reception.jpg',
    alt: 'Outdoor lakeside palace wedding reception at twilight in Udaipur',
    aspectSpan: 'col-span-2 row-span-1',
    details: 'Open-air festivities along the edge of Lake Pichola as the sunset paints the sky in amber.',
  },

  // 12. Photo: Sangeet Under The Stars (Wide Landscape)
  {
    id: 'photo-sangeet',
    type: 'photo',
    title: 'Sangeet Under The Stars',
    category: 'Celebration',
    image: '/images/events/courtyard-night.jpg',
    alt: 'Royal palace courtyard celebration with folk musicians at night',
    aspectSpan: 'col-span-2 row-span-1',
    details: 'Lively pre-wedding celebrations with sitar ensembles and royal fireworks in the palace square.',
  },
];

export function EventMemories() {
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'photos' | 'reels'>('all');
  const [hoveredReelId, setHoveredReelId] = useState<string | null>(null);
  const [activeModalItem, setActiveModalItem] = useState<CanvasItem | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter items
  const filteredItems = CANVAS_ITEMS.filter((item) => {
    if (activeFilter === 'photos') return item.type === 'photo';
    if (activeFilter === 'reels') return item.type === 'reel';
    return true;
  });

  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}
      aria-label="Event Memories and Royal Reels Canvas"
    >
      {/* ── SUBTLE FLANKING PALACE SKETCHES IN BACKGROUND ── */}
      <div className="absolute left-[-40px] sm:left-[-20px] lg:left-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 w-64 sm:w-80 lg:w-[420px] xl:w-[460px] opacity-25">
        <img
          src="/images/heritage-elements/palace-line-art.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="absolute right-[-40px] sm:right-[-20px] lg:right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 w-64 sm:w-80 lg:w-[420px] xl:w-[460px] opacity-25 scale-x-[-1]">
        <img
          src="/images/heritage-elements/palace-line-art.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* Eyebrow with gold flanking lines */}
          <div className="inline-flex items-center justify-center space-x-3 mb-2.5">
            <span className="w-8 sm:w-12 h-[1px] bg-[#d8aa67]/80" />
            <span
              className="text-[11px] sm:text-xs font-semibold tracking-[0.24em] uppercase"
              style={{ color: 'var(--antique-gold, #d8aa67)' }}
            >
              Curated Moments &amp; Reels
            </span>
            <span className="w-8 sm:w-12 h-[1px] bg-[#d8aa67]/80" />
          </div>

          {/* Main Heading */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              color: 'var(--burgundy, #781c1c)',
            }}
          >
            Palace Canvas &amp; Reels
          </h2>

          {/* Subtitle */}
          <p
            className="text-xs sm:text-sm font-normal max-w-xl mx-auto leading-relaxed text-[#4f0809]"
          >
            An organic visual canvas combining high-resolution wedding memories and cinematic palace reels. Hover to preview reels in autoplay.
          </p>

          {/* Filter Pills */}
          <div className="inline-flex items-center p-1 bg-white/70 backdrop-blur-xs rounded-full border border-[#D8AA67]/40 shadow-xs mt-6">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#670E10] text-[#FFF8EB] shadow-xs'
                  : 'text-[#6B5E4F] hover:text-[#241F1A]'
              }`}
            >
              All Moments (12)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('photos')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeFilter === 'photos'
                  ? 'bg-[#670E10] text-[#FFF8EB] shadow-xs'
                  : 'text-[#6B5E4F] hover:text-[#241F1A]'
              }`}
            >
              Event Memories (7)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('reels')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeFilter === 'reels'
                  ? 'bg-[#670E10] text-[#FFF8EB] shadow-xs'
                  : 'text-[#6B5E4F] hover:text-[#241F1A]'
              }`}
            >
              Palace Reels (5)
            </button>
          </div>
        </div>

        {/* ── ASYMMETRIC MASONRY / BENTO CANVAS GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5 auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-[240px]">
          {filteredItems.map((item) => {
            const isReel = item.type === 'reel';
            const isHovered = hoveredReelId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                onMouseEnter={() => {
                  if (isReel) setHoveredReelId(item.id);
                }}
                onMouseLeave={() => {
                  if (isReel) setHoveredReelId(null);
                }}
                className={`group relative rounded-[18px] sm:rounded-[24px] overflow-hidden border border-[#D8AA67]/40 bg-[#1A1512] transition-all duration-500 ease-out cursor-pointer shadow-[0_8px_24px_rgba(40,8,12,0.12)] hover:shadow-[0_25px_60px_-10px_rgba(40,8,12,0.45)] hover:border-[#D8AA67] hover:-translate-y-1.5 hover:scale-[1.025] hover:z-30 ${item.aspectSpan}`}
              >
                {/* ── PHOTO CONTENT: PURE PHOTOGRAPHY ── */}
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-transform duration-700 ease-out ${
                    isHovered ? 'scale-110' : 'group-hover:scale-108'
                  }`}
                />

                {/* Shimmer / ambient reflection on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* ── REEL AUTOPLAY OVERLAY ON HOVER ── */}
                {isReel && isHovered && (
                  <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px] flex flex-col justify-between p-4 animate-fade-in">
                    {/* Live Equalizer + Reel Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D8AA67]/60 text-[#FFF8EB] text-[10px] font-bold tracking-wider uppercase">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span>Autoplaying Reel</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[#D8AA67]">
                        <span className="w-1 h-3.5 bg-[#D8AA67] rounded-full animate-pulse" />
                        <span className="w-1 h-5 bg-[#D8AA67] rounded-full animate-pulse delay-75" />
                        <span className="w-1 h-2 bg-[#D8AA67] rounded-full animate-pulse delay-150" />
                      </div>
                    </div>

                    {/* Center Animated Play Orb */}
                    <div className="self-center w-13 h-13 rounded-full bg-[#D8AA67]/90 text-[#380506] flex items-center justify-center shadow-xl scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>

                    {/* Bottom Progress Bar + Views */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-white text-xs font-semibold drop-shadow">
                        <span className="truncate max-w-[80%]">{item.title}</span>
                        <span className="text-[#D8AA67] text-[11px] shrink-0">{item.views}</span>
                      </div>
                      {/* Animated Progress Line */}
                      <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#D8AA67] to-[#FFF8EB] animate-[shimmer_2s_infinite] w-full" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── REEL STATIC BADGES (WHEN NOT HOVERED) ── */}
                {isReel && !isHovered && (
                  <>
                    {/* Top Right Video Pill */}
                    <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold shadow-md">
                      <Play className="w-2.5 h-2.5 fill-white" />
                      <span>{item.duration || 'Reel'}</span>
                    </div>

                    {/* Center Subtle Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-xs border border-white/80 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-[#D8AA67] group-hover:border-[#D8AA67] group-hover:text-[#380506] transition-all duration-300">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Gradient with Title + Views */}
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/85 via-black/35 to-transparent text-left z-10">
                      <h4
                        className="text-white text-sm sm:text-base font-bold leading-tight line-clamp-1 drop-shadow"
                        style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                      >
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-1.5 text-[11px] text-white/85 font-medium mt-0.5">
                        <Eye className="w-3 h-3 text-[#D8AA67]" />
                        <span>{item.views}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* ── PHOTO HOVER EFFECT: MINIMAL CHIP OVERLAY ── */}
                {!isReel && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Title chip appearing smoothly on hover */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between text-white">
                      <span
                        className="text-sm font-bold truncate drop-shadow-md text-[#FFF8EB]"
                        style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                      >
                        {item.title}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[#D8AA67] shrink-0 ml-2">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* ── FOOTER CALL TO ACTION ── */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/hotel"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-[8px] text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
            style={{
              backgroundColor: 'var(--antique-gold, #d8aa67)',
              color: 'var(--forest-ink, #380506)',
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              fontSize: '16px',
            }}
          >
            <span>Explore All Celebrations</span>
            <ArrowRight className="w-4 h-4 ml-1 stroke-[1.8] group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-[8px] bg-white border border-[#D8AA67]/60 text-[#670E10] text-xs sm:text-sm font-semibold hover:bg-[#FAF8F3] hover:border-[#D8AA67] transition-all shadow-xs"
          >
            <InstagramIcon className="w-4 h-4 text-[#D8AA67]" />
            <span>Follow @RajmahalUdaipur</span>
          </a>
        </div>

        {/* ── DELICATE ANTIQUE-GOLD BOTTOM DIVIDER WITH CENTER LOTUS MOTIF ── */}
        <div className="relative flex items-center justify-center w-full max-w-5xl mx-auto mt-12 sm:mt-16">
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

      {/* ── IMMERSIVE POPUP MODAL (PORTALED TO DOCUMENT.BODY) ── */}
      {activeModalItem && mounted && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalItem(null);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-[24px] bg-[#FFFDF9] border border-[#D8AA67]/70 shadow-[0_30px_70px_rgba(30,5,8,0.7)] flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition cursor-pointer"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Area */}
            <div className="relative w-full md:w-3/5 h-72 sm:h-96 md:h-[540px] bg-black flex items-center justify-center">
              <Image
                src={activeModalItem.image}
                alt={activeModalItem.alt}
                fill
                className="object-cover"
                priority
              />

              {activeModalItem.type === 'reel' && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#D8AA67] text-[#380506] flex items-center justify-center shadow-2xl animate-pulse">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>
              )}

              {/* Category Pill */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-[#FFF8EB] border border-[#D8AA67]/60 text-xs font-semibold backdrop-blur-xs flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D8AA67]" />
                <span>{activeModalItem.category}</span>
              </div>
            </div>

            {/* Content Sidebar */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between text-left bg-[#FFFDF9]">
              <div>
                {activeModalItem.subtitle && (
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D8AA67] block mb-1">
                    {activeModalItem.subtitle}
                  </span>
                )}
                <h3
                  className="text-2xl sm:text-3xl font-bold text-[#670E10] mb-3 leading-tight"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  {activeModalItem.title}
                </h3>
                <p className="text-sm text-[#4F0809] leading-relaxed mb-6 font-normal">
                  {activeModalItem.details}
                </p>

                {activeModalItem.type === 'reel' && (
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC9] space-y-2 mb-6 text-xs text-[#6B5E4F]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#241F1A]">Reel Reach:</span>
                      <span className="text-[#670E10] font-bold">{activeModalItem.views} Views</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#241F1A]">Location:</span>
                      <span>Rajmahal Heritage Hotel &bull; Udaipur</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#241F1A]">Audio:</span>
                      <span>Original Mewari Court Music</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#DFD3C3]">
                <Link
                  href="/hotel#party-hall-enquiry"
                  onClick={() => setActiveModalItem(null)}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-[8px] bg-gradient-to-r from-[#670E10] to-[#801417] text-[#FFF8EB] text-xs sm:text-sm font-bold tracking-wide shadow hover:shadow-md transition-all text-center"
                >
                  <Calendar className="w-4 h-4 text-[#D8AA67]" />
                  <span>Enquire for Celebrations</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
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
