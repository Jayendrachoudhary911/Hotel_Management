'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconPalaceCrest } from '@/components/ui/heritage-art';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide footer on dashboard and dedicated auth pages
  if (
    pathname.startsWith('/dashboard') ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/auth')
  ) {
    return null;
  }

  return (
    <footer
      className="relative border-t border-[#d8aa67]/40 text-[#FAF8F3] mt-auto overflow-hidden transition-colors selection:bg-[#d8aa67] selection:text-[#4f0809]"
      style={{
        backgroundColor: '#320406',
        backgroundImage:
          'radial-gradient(circle at 50% 0%, rgba(103, 14, 16, 0.55) 0%, rgba(50, 4, 6, 0.95) 65%, #240203 100%)',
      }}
    >
      {/* ── 1. TOP GOLD ORNAMENTAL FILIGREE ARCH ── */}
      <div className="relative h-1.5 w-full bg-gradient-to-r from-[#320406] via-[#D8AA67] to-[#320406]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#320406] border border-[#D8AA67] flex items-center justify-center shadow-md">
          <Sparkles className="w-4 h-4 text-[#D8AA67]" />
        </div>
      </div>

      {/* Background Subtle Floral Ornaments */}
      <div className="absolute top-0 left-0 w-44 sm:w-64 opacity-10 pointer-events-none select-none z-0">
        <img src="/images/ornaments/floral-left.png" alt="" aria-hidden="true" className="w-full h-auto" />
      </div>
      <div className="absolute top-0 right-0 w-44 sm:w-64 opacity-10 pointer-events-none select-none z-0">
        <img src="/images/ornaments/floral-right.png" alt="" aria-hidden="true" className="w-full h-auto" />
      </div>

      {/* Subtle Royal Gold Radial Glow in Peak Bottom Right Background */}
      <div
        className="absolute right-0 bottom-0 w-[450px] sm:w-[650px] h-[250px] sm:h-[350px] rounded-full opacity-20 pointer-events-none select-none z-0"
        style={{
          background:
            'radial-gradient(circle at 100% 100%, rgba(216, 170, 103, 0.4) 0%, rgba(103, 14, 16, 0.15) 50%, transparent 75%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-24 sm:pb-12 md:pb-12">
        {/* ── 3. FOUR-COLUMN CORE CONTENT (CLEAN & UNOBSTRUCTED) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-10 sm:pb-12 border-b border-[#D8AA67]/25">
          {/* Column 1: Royal Legacy Brand Card (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F0809] to-[#250203] border-2 border-[#D8AA67] flex items-center justify-center shadow-[0_4px_16px_rgba(216,170,103,0.25)]">
                <IconPalaceCrest className="w-8 h-8 text-[#D8AA67]" />
              </div>
              <div>
                <span
                  className="text-2xl font-bold tracking-widest text-[#FFF8EB] uppercase block leading-none"
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  }}
                >
                  RAJMAHAL
                </span>
                <span className="text-[10px] tracking-[0.28em] text-[#D8AA67] uppercase block mt-1 font-medium">
                  Heritage Hotel &bull; Udaipur
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-[#E7DEC8] leading-relaxed font-light max-w-sm">
              Where four centuries of regal Rajputana grandeur embrace Lake Pichola&apos;s tranquil waters. Six restored imperial suites, candlelit dining courtyards, and timeless palace hospitality.
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/40 border border-[#D8AA67]/45 text-[11px] text-[#F7E5C3] shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D8AA67] shrink-0" />
              <span>Certified Rajasthan Heritage Sanctuary</span>
            </div>

            {/* Social Connect Icons */}
            <div className="pt-2">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#D8AA67] mb-3">
                Connect With The Palace
              </h5>
              <div className="flex items-center space-x-3">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-[#240203] border border-[#D8AA67]/50 flex items-center justify-center text-[#D8AA67] hover:bg-[#D8AA67] hover:text-[#4F0809] hover:border-[#D8AA67] hover:shadow-[0_0_15px_rgba(216,170,103,0.5)] transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-[#240203] border border-[#D8AA67]/50 flex items-center justify-center text-[#D8AA67] hover:bg-[#D8AA67] hover:text-[#4F0809] hover:border-[#D8AA67] hover:shadow-[0_0_15px_rgba(216,170,103,0.5)] transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919829012345"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full bg-[#240203] border border-[#D8AA67]/50 flex items-center justify-center text-[#D8AA67] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.24 3.67 16.31 4.53 17.87 6.09C19.42 7.64 20.28 9.71 20.28 11.91C20.28 16.46 16.58 20.16 12.04 20.16C10.61 20.16 9.22 19.79 8 19.07L7.71 18.9L4.59 19.72L5.42 16.68L5.23 16.37C4.43 15.1 4.01 13.53 4.01 11.92C4.01 7.37 7.71 3.67 12.04 3.67ZM8.94 7.33C8.76 7.33 8.47 7.4 8.23 7.66C7.99 7.92 7.31 8.56 7.31 9.86C7.31 11.16 8.26 12.41 8.39 12.59C8.52 12.76 10.25 15.43 12.9 16.57C13.53 16.84 14.02 17 14.41 17.12C15.04 17.32 15.62 17.29 16.07 17.23C16.58 17.15 17.63 16.59 17.85 15.97C18.07 15.36 18.07 14.83 18.01 14.73C17.94 14.62 17.77 14.56 17.5 14.43C17.24 14.3 15.95 13.66 15.71 13.57C15.47 13.49 15.3 13.44 15.12 13.7C14.95 13.97 14.44 14.56 14.29 14.73C14.14 14.91 13.99 14.93 13.72 14.8C13.46 14.67 12.61 14.39 11.61 13.5C10.83 12.8 10.3 11.94 10.15 11.68C10 11.41 10.13 11.27 10.27 11.14C10.39 11.02 10.53 10.83 10.66 10.68C10.79 10.53 10.84 10.42 10.92 10.25C11.01 10.07 10.97 9.92 10.9 9.79C10.84 9.66 10.25 8.23 10.03 7.71C9.82 7.2 9.6 7.27 9.44 7.26C9.29 7.26 9.11 7.33 8.94 7.33Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Explore The Palace Links (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D8AA67] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8AA67]" />
              <span>Explore</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E7DEC8]">
              <li>
                <Link href="/rooms" className="hover:text-[#D8AA67] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span className="text-[#D8AA67]/60">&rsaquo;</span>
                  <span>Heritage Chambers</span>
                </Link>
              </li>
              <li>
                <Link href="/restaurant" className="hover:text-[#D8AA67] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span className="text-[#D8AA67]/60">&rsaquo;</span>
                  <span>Restaurant &amp; Dining</span>
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#D8AA67] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span className="text-[#D8AA67]/60">&rsaquo;</span>
                  <span>Palace Menu &amp; Order</span>
                </Link>
              </li>
              <li>
                <Link href="/hotel" className="hover:text-[#D8AA67] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span className="text-[#D8AA67]/60">&rsaquo;</span>
                  <span>Weddings &amp; Banquets</span>
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-[#D8AA67] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span className="text-[#D8AA67]/60">&rsaquo;</span>
                  <span>Reserve Direct</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Address (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D8AA67] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8AA67]" />
              <span>Concierge</span>
            </h4>
            <ul className="space-y-3 text-xs text-[#E7DEC8]">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-[#D8AA67] mr-2 mt-0.5 shrink-0" />
                <span className="leading-snug">Lake Palace Road, Pichola, Udaipur, Rajasthan 313001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-[#D8AA67] mr-2 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-[#D8AA67] mr-2 shrink-0" />
                <span>info@rajmahalhotel.in</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 text-[#D8AA67] mr-2 shrink-0" />
                <span>Desk: 24&times;7 &bull; Dining: 12:30 PM &ndash; 11 PM</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Google Maps Location (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D8AA67] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8AA67]" />
                <span>Palace Location</span>
              </h4>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Lake+Palace+Road,+Pichola,+Udaipur,+Rajasthan+313001"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#D8AA67] hover:underline flex items-center gap-0.5"
              >
                <span>Full Map</span>
                <span>&nearr;</span>
              </a>
            </div>

            <div className="relative rounded-xl overflow-hidden border-2 border-[#D8AA67]/60 shadow-[0_6px_20px_rgba(0,0,0,0.45)] h-[130px] w-full bg-[#200203]">
              <iframe
                title="Rajmahal Heritage Hotel Location"
                src="https://maps.google.com/maps?q=Lake+Palace+Road,+Pichola,+Udaipur,+Rajasthan+313001&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.05) saturate(1.15)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            <p className="text-[11px] text-[#D8AA67]/90 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#D8AA67] shrink-0" />
              <span>24.5764&deg; N, 73.6835&deg; E &bull; Waterfront Pichola</span>
            </p>
          </div>
        </div>

        {/* ── 4. LOWER FOOTER BAND: METADATA & PEAK BOTTOM-RIGHT TYPOGRAPHY (ZERO OVERLAP) ── */}
        <div className="pt-8 sm:pt-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 relative">
          {/* Left Side: Heritage Metadata & Legal Links (Clean, readable, unobstructed) */}
          <div className="space-y-3 z-10 max-w-md">
            <div className="flex items-center space-x-2 text-xs text-[#E7DEC8]">
              <ShieldCheck className="w-4 h-4 text-[#D8AA67] shrink-0" />
              <span>Preserved Living Heritage &bull; Udaipur, Rajasthan</span>
            </div>
            <p className="text-xs text-[#E7DEC8]/80 leading-relaxed font-light">
              &copy; {new Date().getFullYear()} Rajmahal Heritage Hotel. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-[11px] text-[#D8AA67] pt-1">
              <Link href="/privacy" className="hover:text-[#FFF8EB] hover:underline transition-colors">
                Privacy Charter
              </Link>
              <span>&bull;</span>
              <Link href="/terms" className="hover:text-[#FFF8EB] hover:underline transition-colors">
                Terms &amp; Tariffs
              </Link>
              <span>&bull;</span>
              <span className="text-[#F7E5C3]">Mewar Sanctuary</span>
            </div>
          </div>

          {/* Right Side: Peak Bottom-Right Monumental "RAJMAHAL" Typography */}
          <div className="relative flex flex-col items-end self-end z-10 select-none overflow-hidden max-w-full">
            {/* Graffiti Paint Splatters & Stencil Effects */}
            <div className="absolute inset-0 pointer-events-none select-none">
              <div className="absolute right-8 top-1 w-2 h-2 rounded-full bg-[#D8AA67]/40 blur-[0.5px]" />
              <div className="absolute right-24 top-4 w-1.5 h-1.5 rounded-full bg-[#FFF8EB]/50" />
              <div className="absolute right-44 top-2 w-2 h-2 rounded-full bg-[#D8AA67]/30 blur-[1px]" />
              <div className="absolute right-14 bottom-3 w-1.5 h-1.5 rounded-full bg-[#FFF8EB]/60" />
            </div>

            {/* Stencil Graffiti Tag */}
            <div className="flex items-center space-x-2 mb-1 opacity-85">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8AA67]/15 border border-[#D8AA67]/45 text-[9px] sm:text-[11px] font-mono tracking-[0.28em] uppercase text-[#D8AA67] shadow-inner backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8AA67] animate-ping" />
                Mewar Royalty &bull; Estd 1842
              </span>
              <div className="hidden sm:flex items-center space-x-1 text-[#D8AA67]/70">
                <span>&#10022;</span>
                <span className="h-0.5 w-8 bg-gradient-to-r from-[#D8AA67]/80 to-transparent" />
              </div>
            </div>

            {/* Monumental RAJMAHAL Wordmark */}
            <div className="relative">
              <span
                role="presentation"
                aria-hidden="true"
                className="block text-[46px] min-[380px]:text-[56px] sm:text-[76px] md:text-[96px] lg:text-[112px] xl:text-[128px] font-black uppercase tracking-[-0.04em] leading-[0.8] text-right select-none"
                style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  WebkitTextStroke: '1.6px rgba(216, 170, 103, 0.42)',
                  color: 'transparent',
                  backgroundImage:
                    'linear-gradient(180deg, rgba(255, 248, 235, 0.28) 0%, rgba(216, 170, 103, 0.18) 50%, rgba(79, 8, 9, 0.04) 100%)',
                  WebkitBackgroundClip: 'text',
                  filter: 'drop-shadow(0 4px 18px rgba(0, 0, 0, 0.8))',
                }}
              >
                RAJMAHAL
              </span>

              {/* Handcrafted Graffiti Brush Slash & Splash Accents */}
              <div
                className="absolute right-0 bottom-0 h-1 sm:h-1.5 w-3/4 sm:w-2/3 rounded-full opacity-70 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(216, 170, 103, 0.55) 40%, rgba(255, 248, 235, 0.8) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
