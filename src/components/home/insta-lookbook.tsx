'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Play, Eye, X, Volume2, VolumeX } from 'lucide-react';

interface LookbookReel {
  id: string;
  title: string;
  views: string;
  image: string;
  video: string;
  alt: string;
  duration?: string;
}

const REELS_DATA: LookbookReel[] = [
  {
    id: 'reel-1',
    title: 'Serene Mornings at Rajmahal',
    views: '12.4K',
    image: '/images/reels/serene-mornings.jpg',
    video: '/images/reels/reel-1.webm',
    alt: 'Golden morning sunrise along lake arches at Rajmahal Heritage Hotel',
    duration: '0:21',
  },
  {
    id: 'reel-2',
    title: 'Royal Dining Experience',
    views: '8.9K',
    image: '/images/reels/royal-dining.jpg',
    video: '/images/reels/reel-dining.webm',
    alt: 'Traditional Rajasthani royal 56-bhog thali feast with oil lamps',
    duration: '0:35',
  },
  {
    id: 'reel-3',
    title: 'Heritage Rooms Inside Look',
    views: '15.2K',
    image: '/images/reels/heritage-rooms.jpg',
    video: '/images/reels/reel-dance.webm',
    alt: 'Inside look of luxurious Sheesh Mahal palace suite with stained glass and chandelier',
    duration: '0:42',
  },
  {
    id: 'reel-4',
    title: 'Destination Weddings',
    views: '23.1K',
    image: '/images/reels/destination-weddings.jpg',
    video: '/images/reels/reel-wedding.webm',
    alt: 'Royal Rajasthani bride in deep red and gold bridal lehenga in palace jharokha',
    duration: '0:18',
  },
  {
    id: 'reel-5',
    title: 'Udaipur Views from Rajmahal',
    views: '18.7K',
    image: '/images/reels/udaipur-views.jpg',
    video: '/images/reels/reel-udaipur.webm',
    alt: 'Illuminated night panorama of Udaipur palace reflecting across Lake Pichola',
    duration: '0:31',
  },
];

export function InstaLookbook() {
  const [activeReel, setActiveReel] = useState<LookbookReel | null>(null);
  const [hoveredReelId, setHoveredReelId] = useState<string | null>(null);
  const [modalMuted, setModalMuted] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleMouseEnter = (id: string) => {
    setHoveredReelId(id);
    const video = videoRefs.current[id];
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented (e.g. browser policy)
        });
      }
    }
  };

  const handleMouseLeave = (id: string) => {
    setHoveredReelId(null);
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
<section
      className="relative py-12 sm:py-16 lg:py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--cream, #fbf5e9)' }}
      aria-label="Instagram Lookbook and Reels"
    >
      {/* ── BACKGROUND CHHATRI ORNAMENTS (HIDDEN ON MOBILE TO PREVENT CLUTTER) ── */}
      <div className="hidden md:flex absolute left-0 top-0 bottom-0 w-[180px] lg:w-[230px] xl:w-[260px] pointer-events-none z-0 items-center justify-start select-none opacity-60">
        <img
          src="/images/ornaments/lookbook-left-transparent-2x.png"
          alt=""
          aria-hidden="true"
          className="h-full w-auto max-h-[500px] object-contain object-left"
        />
      </div>

      <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-[180px] lg:w-[230px] xl:w-[260px] pointer-events-none z-0 items-center justify-end select-none opacity-60">
        <img
          src="/images/ornaments/lookbook-right-transparent-2x.png"
          alt=""
          aria-hidden="true"
          className="h-full w-auto max-h-[500px] object-contain object-right"
        />
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10">
          <span
            className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase block mb-1"
            style={{ color: '#ba905e' }}
          >
            Curated for Moments
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-bold mb-1.5 leading-tight tracking-tight"
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

        {/* ── REELS GRID: HORIZONTAL SNAP CAROUSEL ON MOBILE, 5-COL GRID ON DESKTOP ── */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 lg:gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {REELS_DATA.map((reel) => {
            const isHovered = hoveredReelId === reel.id;
            const isOtherHovered = hoveredReelId !== null && !isHovered;

            return (
              <div
                key={reel.id}
                onMouseEnter={() => handleMouseEnter(reel.id)}
                onMouseLeave={() => handleMouseLeave(reel.id)}
                onClick={() => setActiveReel(reel)}
                className={`relative shrink-0 w-[68vw] max-w-[240px] sm:w-auto sm:max-w-none snap-center h-[320px] sm:h-[340px] lg:h-[370px] rounded-[22px] overflow-hidden cursor-pointer bg-[#1a1a1a] transition-all duration-300 ease-out ${
                  isHovered
                    ? 'z-30 sm:scale-[1.06] lg:scale-[1.08] sm:-translate-y-2'
                    : isOtherHovered
                    ? 'z-10 opacity-80 sm:scale-[0.98]'
                    : 'z-10'
                }`}
              >
                {/* 1. Base Photo Poster */}
                <Image
                  src={reel.image}
                  alt={reel.alt}
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 20vw"
                  className={`object-cover transition-transform duration-700 ${
                    isHovered ? 'scale-105' : 'scale-100'
                  }`}
                />

                {/* 2. HTML5 Video Element (Muted loop playing on hover) */}
                <video
                  ref={(el) => {
                    videoRefs.current[reel.id] = el;
                  }}
                  src={reel.video}
                  poster={reel.image}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* 3. Shading Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* 4. Minimal Center Play Button (Fades out on hover) */}
                <div
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${
                    isHovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center text-white">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                {/* 5. Clean Bottom Title & Views */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 text-left z-20">
                  <h3
                    className="text-sm sm:text-[15px] font-bold text-white mb-1 leading-snug line-clamp-2"
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    }}
                  >
                    {reel.title}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-[11px] text-white/85 font-medium">
                    <Eye className="w-3.5 h-3.5 text-[#D8AA67]" />
                    <span>{reel.views}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CLEAN, BORDERLESS MODAL FOR FULL REEL PLAYBACK ── */}
      {activeReel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in-up"
          onClick={() => setActiveReel(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Controls: Sound toggle & Close */}
            <div className="absolute top-3.5 inset-x-3.5 z-30 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setModalMuted(!modalMuted)}
                className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#d8aa67] hover:text-[#4f0809] transition-colors cursor-pointer"
                aria-label={modalMuted ? 'Unmute video' : 'Mute video'}
              >
                {modalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setActiveReel(null)}
                className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#d8aa67] hover:text-[#4f0809] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reel Video Player */}
            <div className="relative h-[75vh] max-h-[540px] w-full bg-black">
              <video
                src={activeReel.video}
                poster={activeReel.image}
                autoPlay
                loop
                muted={modalMuted}
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-left text-white z-20">
                <h4
                  className="text-xl font-bold mb-1"
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  }}
                >
                  {activeReel.title}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-white/80">
                  <Eye className="w-3.5 h-3.5 text-[#d8aa67]" />
                  <span>{activeReel.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
