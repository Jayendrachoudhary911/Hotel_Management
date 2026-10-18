import React from 'react';

// ── 1. RAJASTHANI MANDALA CORNER MOTIF ──
export const RajasthaniCornerMandala: React.FC<{ className?: string }> = ({ className = 'w-32 h-32 text-[#B08D57]/30' }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Quarter Mandala from (0,0) */}
    <circle cx="0" cy="0" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <circle cx="0" cy="0" r="160" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="0" cy="0" r="140" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
    <circle cx="0" cy="0" r="120" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="0" cy="0" r="95" stroke="currentColor" strokeWidth="0.8" />
    <circle cx="0" cy="0" r="70" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="0" cy="0" r="45" stroke="currentColor" strokeWidth="1" />
    <circle cx="0" cy="0" r="20" stroke="currentColor" strokeWidth="1.5" />
    
    {/* Radiating Petals & Lotus Motifs */}
    {Array.from({ length: 10 }).map((_, i) => {
      const angle = (i * 10 * Math.PI) / 180;
      const x1 = Math.cos(angle) * 70;
      const y1 = Math.sin(angle) * 70;
      const x2 = Math.cos(angle) * 120;
      const y2 = Math.sin(angle) * 120;
      const x3 = Math.cos(angle) * 160;
      const y3 = Math.sin(angle) * 160;
      return (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" />
          <circle cx={x2} cy={y2} r="2.5" fill="currentColor" />
          <path
            d={`M ${x2} ${y2} Q ${x2 + 8} ${y2 + 8} ${x3} ${y3} Q ${x2 - 8} ${y2 + 8} ${x2} ${y2}`}
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
          />
        </g>
      );
    })}

    {/* Jharokha scalloped arcs */}
    <path
      d="M 120 0 C 120 40 100 80 80 100 C 60 120 20 120 0 120"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <path
      d="M 160 0 C 160 60 120 120 100 140 C 60 160 0 160 0 160"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeDasharray="2 2"
      fill="none"
    />
  </svg>
);

// ── 2. FULL MANDALA ROSETTE ──
export const RajasthaniMandala: React.FC<{ className?: string }> = ({ className = 'w-64 h-64 text-[#B08D57]/20' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
    <circle cx="150" cy="150" r="125" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="150" cy="150" r="100" stroke="currentColor" strokeWidth="0.8" />
    <circle cx="150" cy="150" r="75" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="150" cy="150" r="50" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
    <circle cx="150" cy="150" r="25" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="150" cy="150" r="6" fill="currentColor" />

    {/* 16 radiating petal arches */}
    {Array.from({ length: 16 }).map((_, i) => {
      const rot = i * 22.5;
      return (
        <g key={i} transform={`rotate(${rot} 150 150)`}>
          <path
            d="M 150 75 C 142 95 140 115 150 125 C 160 115 158 95 150 75 Z"
            stroke="currentColor"
            strokeWidth="0.9"
            fill="none"
          />
          <path
            d="M 150 25 C 135 60 130 90 150 100 C 170 90 165 60 150 25 Z"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
          />
          <circle cx="150" cy="20" r="2" fill="currentColor" />
        </g>
      );
    })}
  </svg>
);

// ── 3. JHAROKHA ARCH FRAME BORDER ──
export const JharokhaArchBorder: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`relative p-2.5 sm:p-4 rounded-t-[100px] sm:rounded-t-[140px] border-2 border-[#B08D57]/40 bg-[#FAF8F3] shadow-lg ${className}`}>
    {/* Top decorative arch crest */}
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FAF8F3] px-3">
      <svg width="40" height="18" viewBox="0 0 40 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20 0 L 25 10 L 20 18 L 15 10 Z" fill="#B08D57" />
        <circle cx="20" cy="2" r="2" fill="#670E10" />
      </svg>
    </div>
    <div className="rounded-t-[88px] sm:rounded-t-[125px] overflow-hidden border border-[#B08D57]/30">
      {children}
    </div>
  </div>
);

// ── 4. DINE LIKE ROYALTY ELEPHANTS BANNER ──
export const DineLikeRoyaltyBanner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative bg-[#4A0A0C] text-[#FAF8F3] rounded-xl overflow-hidden p-6 sm:p-8 border border-[#B08D57]/40 shadow-xl ${className}`}>
    {/* Subtle backdrop pattern */}
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B08D57_1px,transparent_1px)] [background-size:16px_16px]" />

    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
      {/* Left Elephant Illustration */}
      <div className="hidden lg:block w-36 h-28 opacity-90">
        <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#B08D57]">
          {/* Caparisoned Elephant Facing Right */}
          <path
            d="M 120 75 C 130 65 140 45 130 35 C 120 25 105 25 95 30 C 85 20 60 25 45 35 C 30 45 25 65 30 90 L 40 90 L 45 75 L 60 75 L 65 90 L 85 90 L 90 70 L 105 70 L 110 90 L 120 90 L 125 70 C 135 75 140 85 145 75 C 148 68 140 60 135 60"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Howdah on back */}
          <rect x="55" y="16" width="35" height="15" rx="3" stroke="currentColor" strokeWidth="1.8" fill="#380608" />
          <path d="M 50 16 C 72 6 72 6 95 16 Z" stroke="currentColor" strokeWidth="1.8" fill="#B08D57" fillOpacity="0.3" />
          <circle cx="72" cy="6" r="3" fill="currentColor" />
          {/* Royal Blanket / Jhool */}
          <path d="M 50 40 Q 72 55 95 40 L 95 65 Q 72 72 50 65 Z" stroke="currentColor" strokeWidth="1.5" fill="#B08D57" fillOpacity="0.2" />
          {/* Tusk */}
          <path d="M 115 52 C 125 55 130 48 128 44" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Center Text & Crest */}
      <div className="text-center flex-1 px-4">
        <div className="inline-flex items-center justify-center space-x-3 mb-2">
          <div className="h-px w-10 sm:w-16 bg-[#B08D57]/60" />
          <span className="text-[#C9A96E] text-xs font-semibold tracking-[0.25em] uppercase">
            ✦ Royal Mewari Heritage ✦
          </span>
          <div className="h-px w-10 sm:w-16 bg-[#B08D57]/60" />
        </div>
        <h3 className="font-heritage text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FAF8F3] mb-2 tracking-wide">
          Dine Like Royalty
        </h3>
        <p className="text-[#D8D2C4] text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
          A culinary journey through the rich heritage of Rajasthan, served in a regal setting with recipes passed down through royal palace kitchens.
        </p>
      </div>

      {/* Right Elephant Illustration */}
      <div className="hidden lg:block w-36 h-28 opacity-90 transform -scale-x-100">
        <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#B08D57]">
          <path
            d="M 120 75 C 130 65 140 45 130 35 C 120 25 105 25 95 30 C 85 20 60 25 45 35 C 30 45 25 65 30 90 L 40 90 L 45 75 L 60 75 L 65 90 L 85 90 L 90 70 L 105 70 L 110 90 L 120 90 L 125 70 C 135 75 140 85 145 75 C 148 68 140 60 135 60"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="55" y="16" width="35" height="15" rx="3" stroke="currentColor" strokeWidth="1.8" fill="#380608" />
          <path d="M 50 16 C 72 6 72 6 95 16 Z" stroke="currentColor" strokeWidth="1.8" fill="#B08D57" fillOpacity="0.3" />
          <circle cx="72" cy="6" r="3" fill="currentColor" />
          <path d="M 50 40 Q 72 55 95 40 L 95 65 Q 72 72 50 65 Z" stroke="currentColor" strokeWidth="1.5" fill="#B08D57" fillOpacity="0.2" />
          <path d="M 115 52 C 125 55 130 48 128 44" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  </div>
);

// ── 5. CUSTOM HERITAGE LINE-ART ICONS (Exact match to design mockup) ──

// 5.1 Themed Rooms Icon (Ornate Four-Poster Bed with Drapes)
export const IconThemedRooms: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 8 V26" />
    <path d="M28 8 V26" />
    <path d="M4 14 H28" />
    <path d="M4 22 H28" />
    <path d="M6 14 C10 11 22 11 26 14" />
    <rect x="8" y="16" width="7" height="4" rx="1" />
    <rect x="17" y="16" width="7" height="4" rx="1" />
    <path d="M4 8 Q16 4 28 8" />
  </svg>
);

// 5.2 Rajasthani Restaurant Icon (Royal Thali with Katoris)
export const IconRajasthaniRestaurant: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="16" cy="16" r="13" />
    <circle cx="16" cy="16" r="10.5" strokeDasharray="1.5 2" />
    <circle cx="12" cy="12" r="2.8" />
    <circle cx="20" cy="12" r="2.8" />
    <circle cx="12" cy="20" r="2.8" />
    <circle cx="20" cy="20" r="2.8" />
  </svg>
);

// 5.3 Café & Lounge Icon (Steaming Cup on Saucer)
export const IconCafeLounge: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 14 H22 V20 C22 23 19 25 14 25 C9 25 6 23 6 20 Z" />
    <path d="M22 16 H24 C25.5 16 26.5 17 26.5 18.5 C26.5 20 25.5 21 24 21 H22" />
    <path d="M4 27 H24" />
    <path d="M10 6 Q11 9 10 11" strokeWidth="1.4" />
    <path d="M14 5 Q15 8 14 11" strokeWidth="1.4" />
    <path d="M18 6 Q19 9 18 11" strokeWidth="1.4" />
  </svg>
);

// 5.4 Party Hall Icon (Palace Chandelier & Arch)
export const IconPartyHall: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 28 V12 C4 8 10 4 16 4 C22 4 28 8 28 12 V28" />
    <path d="M8 28 V14 C8 11 12 8 16 8 C20 8 24 11 24 14 V28" strokeDasharray="2 2" />
    <path d="M16 8 V16" />
    <path d="M12 16 H20" />
    <path d="M10 18 Q16 22 22 18" />
    <circle cx="16" cy="20" r="1.5" fill="currentColor" />
  </svg>
);

// 5.5 Events & Weddings Icon (Traditional Kalash / Garland)
export const IconEventsWeddings: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 14 C11 11 13 8 16 6 C19 8 21 11 21 14" />
    <path d="M10 14 H22 L20 26 H12 Z" />
    <path d="M16 3 L16 6" />
    <circle cx="16" cy="3" r="1" fill="currentColor" />
    <path d="M7 10 Q16 13 25 10" strokeDasharray="1.5 2" />
    <path d="M6 6 L8 8 M26 6 L24 8" />
  </svg>
);

// 5.6 Traditional Cuisine Icon (Kadhai / Thali)
export const IconTraditionalCuisine: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="16" cy="16" r="12" />
    <circle cx="16" cy="16" r="7" />
    <path d="M16 9 V11 M16 21 V23 M9 16 H11 M21 16 H23" />
  </svg>
);

// 5.7 Indoor & Outdoor Seating Icon (Haveli Pavilion)
export const IconIndoorOutdoor: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 14 L16 5 L29 14" />
    <path d="M7 14 V26 M25 14 V26" />
    <path d="M13 26 V18 C13 16 15 15 16 15 C17 15 19 16 19 18 V26" />
    <path d="M3 26 H29" />
  </svg>
);

// 5.8 Live Folk Music Icon (Sitar / Tanpura)
export const IconLiveFolkMusic: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 24 C8 21 10 19 13 19 C14 19 15 19.5 16 20 L24 6 L26 7 L18 21 C18.5 22 19 23 19 24 C19 27 16 29 13 29 C10 29 8 27 8 24 Z" />
    <circle cx="13.5" cy="24" r="2" />
    <path d="M21 11 L23 12" />
    <path d="M24 16 C26 15 28 17 27 19" strokeDasharray="1.5 1.5" />
  </svg>
);

// 5.9 Special Thali Experiences Icon (Royal Crown & Platter)
export const IconSpecialThali: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 14 L9 7 L16 11 L23 7 L26 14 H6 Z" />
    <circle cx="9" cy="6" r="1" fill="currentColor" />
    <circle cx="16" cy="10" r="1" fill="currentColor" />
    <circle cx="23" cy="6" r="1" fill="currentColor" />
    <path d="M4 22 H28" />
    <path d="M6 22 C6 25 10 27 16 27 C22 27 26 25 26 22" />
  </svg>
);

// 5.10 King Bed Icon
export const IconKingBed: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#B08D57]' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 5v14M22 5v14M2 11h20M2 17h20" />
    <path d="M5 11V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M13 11V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
  </svg>
);

// 5.11 Guests Icon
export const IconGuests: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#B08D57]' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
  </svg>
);

// 5.12 City View (Arched Window)
export const IconCityView: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#B08D57]' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 21V10C4 6 8 3 12 3C16 3 20 6 20 10V21" />
    <path d="M4 21H20" />
    <path d="M12 3V21" />
    <path d="M4 12H20" />
  </svg>
);

// 5.13 Free WiFi
export const IconFreeWiFi: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#B08D57]' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="20" r="1" fill="currentColor" />
  </svg>
);

// 5.14 Air Conditioning
export const IconAC: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#B08D57]' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="9" rx="2" />
    <path d="M6 17v2M12 17v4M18 17v2" />
    <path d="M6 13h12" />
  </svg>
);

// 5.15 Smart TV
export const IconSmartTV: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#B08D57]' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 18v3" />
  </svg>
);

// 5.16 Luxury Bathroom
export const IconLuxuryBath: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#B08D57]' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12h20v4a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-4z" />
    <path d="M4 12V6a3 3 0 0 1 3-3h1" />
    <path d="M5 21v2M19 21v2" />
  </svg>
);

// 5.17 Mini Bar
export const IconMiniBar: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#B08D57]' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 22h8" />
    <path d="M7 10h10v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10z" />
    <path d="M12 2v8M10 2h4" />
  </svg>
);

// 5.18 In-room Dining
export const IconInRoomDining: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#B08D57]' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 18h18" />
    <path d="M4 18a8 8 0 0 1 16 0" />
    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
  </svg>
);

// 5.19 Work Desk
export const IconWorkDesk: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#B08D57]' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 7h18v4H3z" />
    <path d="M5 11v10M19 11v10M13 11v10" />
    <path d="M15 15h3M15 18h3" />
  </svg>
);

// 5.20 24-hour Room Service
export const IconRoomService24: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#B08D57]' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
    <path d="M3 3l2 2M21 3l-2 2" />
  </svg>
);

// 5.21 Up to 300 Guests Icon
export const IconGuests300: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="16" cy="10" r="4" />
    <path d="M8 26v-3a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v3" />
    <circle cx="7" cy="12" r="3" />
    <path d="M2 26v-2a4 4 0 0 1 4-4h2" />
    <circle cx="25" cy="12" r="3" />
    <path d="M30 26v-2a4 4 0 0 0-4-4h-2" />
  </svg>
);

// 5.22 Custom Decor
export const IconCustomDecor: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 28 L16 6 L27 28" />
    <path d="M9 20 Q16 16 23 20" />
    <circle cx="16" cy="6" r="2" fill="currentColor" />
    <path d="M12 28 V22 M20 28 V22" />
  </svg>
);

// 5.23 Audio Visual
export const IconAudioVisual: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="6" width="24" height="16" rx="2" />
    <path d="M12 26 L16 22 L20 26" />
    <path d="M13 11 L19 14 L13 17 Z" fill="currentColor" />
  </svg>
);

// 5.24 Catering Support
export const IconCateringSupport: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-[#B08D57]' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 22 H26" />
    <path d="M8 22 C8 15 12 12 16 12 C20 12 24 15 24 22" />
    <circle cx="16" cy="9" r="2" fill="currentColor" />
  </svg>
);

// 5.25 Palace Crest / Logo Arch Icon
export const IconPalaceCrest: React.FC<{ className?: string }> = ({ className = 'w-8 h-8 text-[#B08D57]' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M18 3 C22 8 28 12 28 20 C28 26 23.5 31 18 31 C12.5 31 8 26 8 20 C8 12 14 8 18 3 Z"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
    <path
      d="M18 9 C20.5 13 24 16 24 21 C24 24.5 21 27 18 27 C15 27 12 24.5 12 21 C12 16 15.5 13 18 9 Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeDasharray="2 2"
      fill="none"
    />
    <path d="M18 2 V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="2" r="1.2" fill="currentColor" />
    <circle cx="18" cy="20" r="2" fill="currentColor" />
  </svg>
);
