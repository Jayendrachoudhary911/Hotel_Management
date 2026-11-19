'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Eye, ArrowRight, X } from 'lucide-react';

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

interface LookbookReel {
  id: string;
  title: string;
  views: string;
  image: string;
  alt: string;
  duration?: string;
}

const REELS_DATA: LookbookReel[] = [
  {
    id: 'reel-1',
    title: 'Serene Mornings at Rajmahal',
    views: '12.4K',
    image: '/images/reels/serene-mornings.jpg',
    alt: 'Golden morning sunrise along lake arches at Rajmahal Heritage Hotel',
    duration: '0:28',
  },
  {
    id: 'reel-2',
    title: 'Royal Dining Experience',
    views: '8.9K',
    image: '/images/reels/royal-dining.jpg',
    alt: 'Traditional Rajasthani royal 56-bhog thali feast with oil lamps',
    duration: '0:35',
  },
  {
    id: 'reel-3',
    title: 'Heritage Rooms Inside Look',
    views: '15.2K',
    image: '/images/reels/heritage-rooms.jpg',
    alt: 'Inside look of luxurious Sheesh Mahal palace suite with stained glass and chandelier',
    duration: '0:42',
  },
  {
    id: 'reel-4',
    title: 'Destination Weddings',
    views: '23.1K',
    image: '/images/reels/destination-weddings.jpg',
    alt: 'Royal Rajasthani bride in deep red and gold bridal lehenga in palace jharokha',
    duration: '0:50',
  },
  {
    id: 'reel-5',
    title: 'Udaipur Views from Rajmahal',
    views: '18.7K',
    image: '/images/reels/udaipur-views.jpg',
    alt: 'Illuminated night panorama of Udaipur palace reflecting across Lake Pichola',
    duration: '0:31',
  },
];

export function InstaLookbook() {
  const [activeReel, setActiveReel] = useState<LookbookReel | null>(null);

  return (
    <section
      className="relative py-14 sm:py-16 lg:py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}
      aria-label="Instagram Lookbook and Reels"
    >
      {/* ── AUTHENTIC RAJASTHANI CHHATRI, PEACOCK & FLORAL ORNAMENT PANELS ── */}
      {/* Left Decoration: Rajasthani Sandstone Chhatri with Climbing Floral Vine */}
      <div className="absolute left-0 top-0 bottom-0 w-[120px] sm:w-[160px] md:w-[190px] lg:w-[230px] xl:w-[260px] pointer-events-none z-0 flex items-center justify-start select-none opacity-75">
        <img
          src="/images/ornaments/lookbook-left-transparent-2x.png"
          alt=""
          aria-hidden="true"
          className="h-full w-auto max-h-[500px] object-contain object-left"
        />
      </div>

      {/* Right Decoration: Rajasthani Sandstone Chhatri with Royal Peacock on Pedestal and Floral Vine */}
      <div className="absolute right-0 top-0 bottom-0 w-[120px] sm:w-[160px] md:w-[190px] lg:w-[230px] xl:w-[260px] pointer-events-none z-0 flex items-center justify-end select-none opacity-75">
        <img
          src="/images/ornaments/lookbook-right-transparent-2x.png"
          alt=""
          aria-hidden="true"
          className="h-full w-auto max-h-[500px] object-contain object-right"
        />
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION HEADER (CENTERED WITHOUT BUTTON) ── */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span
            className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase block mb-1.5"
            style={{ color: '#ba905e' }}
          >
            Curated for Moments
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-bold mb-2 leading-tight tracking-tight"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              color: '#751c26',
            }}
          >
            Instalookbook &amp; Reels
          </h2>
          <p
            className="text-xs sm:text-[14px] font-normal leading-relaxed text-balance"
            style={{ color: '#4f0809' }}
          >
            Discover our royal moments, behind-the-scenes and beautiful experiences.
          </p>
        </div>

        {/* ── 5 REELS / LOOKBOOK VERTICAL CARDS GRID ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 lg:gap-4">
          {REELS_DATA.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              className="relative h-[300px] sm:h-[340px] lg:h-[370px] rounded-[10px] overflow-hidden shadow-md group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-[#1a1a1a]"
            >
              {/* Photo Background */}
              <Image
                src={reel.image}
                alt={reel.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Shading Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              {/* Center Play Button Overlay matching reference */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/90 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-[#d8aa67] group-hover:border-[#d8aa67] group-hover:text-[#4f0809] transition-all duration-300">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom Details (Title + Views) */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 text-left z-10">
                <h3
                  className="text-sm sm:text-[15px] font-bold text-white mb-1.5 leading-snug line-clamp-2 drop-shadow"
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  }}
                >
                  {reel.title}
                </h3>
                <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-white/90 font-medium">
                  <Eye className="w-3.5 h-3.5 text-white/90 stroke-[2]" />
                  <span>{reel.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── INTERACTIVE MODAL FOR REEL PLAYBACK ── */}
      {activeReel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up"
          onClick={() => setActiveReel(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-[#d8aa67]/50"
            style={{ backgroundColor: 'var(--forest-deep, #4f0809)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveReel(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#d8aa67] hover:text-[#4f0809] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Reel Video Simulation / Image Display */}
            <div className="relative h-[480px] w-full">
              <Image
                src={activeReel.image}
                alt={activeReel.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md border border-white/60 flex items-center justify-center text-white animate-pulse">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-left text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d8aa67] block mb-1">
                  Rajmahal Moments
                </span>
                <h4 className="text-lg font-bold font-heritage mb-1">{activeReel.title}</h4>
                <div className="flex items-center space-x-2 text-xs text-white/70">
                  <Eye className="w-3.5 h-3.5 text-[#d8aa67]" />
                  <span>{activeReel.views} views</span>
                  <span>•</span>
                  <span>Udaipur, Rajasthan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
