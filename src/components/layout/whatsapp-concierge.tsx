'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Sparkles } from 'lucide-react';

const CONCIERGE_PHONE = '919829012345'; // Rajmahal Palace Front Desk & Concierge WhatsApp

export const WhatsAppConcierge: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [bottomOffset, setBottomOffset] = useState<number>(24);

  // Dynamic positioning: stops floating when reaching the footer so it never overlaps footer content
  useEffect(() => {
    let rafId: number | null = null;

    const updatePosition = () => {
      const footer = document.querySelector('footer');
      // On mobile (<640px), keep above the 56px mobile nav bar (56 + 16 = 72px)
      const baseBottom = window.innerWidth >= 640 ? 32 : 72;

      if (!footer) {
        setBottomOffset(baseBottom);
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Distance from top of viewport to top of footer
      // When footerRect.top < viewportHeight, the top of the footer has entered the viewport
      const overlap = viewportHeight - footerRect.top;

      if (overlap > 0) {
        // Stop floating over the footer: lift button by overlap amount so it stays parked above the footer top
        setBottomOffset(overlap + baseBottom);
      } else {
        setBottomOffset(baseBottom);
      }
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updatePosition();
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updatePosition();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Hide on staff dashboard and dedicated auth screens
  if (
    pathname.startsWith('/dashboard') ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/auth')
  ) {
    return null;
  }

  const getContextualMessage = (): string => {
    if (pathname.startsWith('/rooms/')) {
      return 'Namaste! I am currently viewing room suites at Rajmahal and would like to check availability and direct booking packages.';
    }
    if (pathname === '/rooms') {
      return 'Namaste! I am exploring heritage chambers at Rajmahal Heritage Hotel and would like assistance choosing a room.';
    }
    if (pathname === '/book') {
      return 'Namaste! I am booking a stay at Rajmahal and have a quick question regarding check-in timings and payment options.';
    }
    if (pathname === '/hotel') {
      return 'Namaste! I would like to inquire about hosting a royal wedding/celebration banquet at Rajmahal Palace Hall.';
    }
    if (pathname === '/restaurant' || pathname === '/menu') {
      return 'Namaste! I would like to reserve a table / ask about today’s traditional Rajasthani thali and Jharokha Café menu.';
    }
    return 'Namaste! I am planning a visit to Rajmahal Heritage Hotel, Udaipur and would like royal concierge assistance.';
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(getContextualMessage());
    const url = `https://wa.me/${CONCIERGE_PHONE}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div
      className="fixed right-5 sm:right-7 z-40 flex flex-col items-end transition-[bottom] duration-150 ease-out"
      style={{ bottom: `${bottomOffset}px` }}
    >
      {/* Expanded Quick Card */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 rounded-2xl bg-[#FFFDF9] border border-[#D8AA67]/60 shadow-[0_12px_40px_rgba(40,5,6,0.35)] p-4 text-[#241F1A] animate-fade-in-up">
          <div className="flex items-start justify-between pb-3 border-b border-[#E8DFCE]">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F0809] to-[#781C1C] flex items-center justify-center text-[#D8AA67] shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4
                  className="font-bold text-sm text-[#4F0809] leading-tight"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  Royal Concierge Desk
                </h4>
                <p className="text-[10px] text-[#2E7D32] font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
                  Live Palace Steward (Online)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              aria-label="Close concierge preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-xs text-[#5A4B3C] leading-relaxed">
            <p className="font-medium text-[#4F0809] mb-1">Padharo Mhare Desh! 🪷</p>
            <p>
              Direct assistance with room reservations, palace dining, banquet inquiries, or local Udaipur heritage excursions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs tracking-wide shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center space-x-2 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#1EBE5D] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-white/30"
        aria-label="Chat with Royal Concierge on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-white shrink-0" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide pr-1">
          Royal Concierge
        </span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E1B46F] border-2 border-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E1B46F] border-2 border-white rounded-full" />
      </button>
    </div>
  );
};
