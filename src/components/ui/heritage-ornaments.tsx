'use client';

import React from 'react';

// ==============================================================================
// 1. CHANDRA MANDALA (Circular Royal Concentric Lotus Mandala)
// Exact reference: media_1792316552622.png
// Concentric rings, 16 radiating inner petals, fluted radial teeth, multi-lobed
// lotus petals with vein striations, pearl moti band, and pointed kalash finials.
// ==============================================================================
export interface MandalaOrnamentProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  className?: string;
  color?: string;
  opacity?: number;
  size?: string;
}

export const MandalaOrnament: React.FC<MandalaOrnamentProps> = ({
  position = 'top-left',
  className = '',
  color = '#B08D57',
  opacity = 0.45,
  size,
}) => {
  const positionClasses = {
    'top-left': 'top-0 left-0 -translate-x-[20%] -translate-y-[20%]',
    'top-right': 'top-0 right-0 translate-x-[20%] -translate-y-[20%] rotate-90',
    'bottom-right': 'bottom-0 right-0 translate-x-[20%] translate-y-[20%] rotate-180',
    'bottom-left': 'bottom-0 left-0 -translate-x-[20%] translate-y-[20%] -rotate-90',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }[position];

  const defaultSize = size || 'clamp(300px, 36vw, 600px)';

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none z-0 select-none overflow-visible transition-opacity duration-700 ${positionClasses} ${className}`}
      style={{
        width: defaultSize,
        height: defaultSize,
        opacity,
      }}
    >
      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full text-[#B08D57]"
        style={{ color }}
      >
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {/* Central Bindu Nucleus */}
          <circle cx="300" cy="300" r="8" fill="currentColor" />
          <circle cx="300" cy="300" r="18" strokeWidth="1.2" />
          <circle cx="300" cy="300" r="32" strokeWidth="1.6" />
          <circle cx="300" cy="300" r="46" strokeWidth="1" strokeDasharray="3 3" />

          {/* Ring 1: 16 Inner Teardrop Lotus Petals (r=46 to r=80) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const deg = i * 22.5;
            return (
              <g key={`m-inner-${i}`} transform={`rotate(${deg} 300 300)`}>
                <path
                  d="M 292 254 C 288 238 296 222 300 216 C 304 222 312 238 308 254 C 304 258 296 258 292 254 Z"
                  strokeWidth="1.2"
                />
                <line x1="300" y1="254" x2="300" y2="224" strokeWidth="0.8" />
                <circle cx="300" cy="216" r="1.8" fill="currentColor" />
              </g>
            );
          })}

          <circle cx="300" cy="300" r="92" strokeWidth="1.4" />
          <circle cx="300" cy="300" r="102" strokeWidth="0.9" />

          {/* Ring 2: 32 Scalloped Connecting Arcs */}
          {Array.from({ length: 32 }).map((_, i) => {
            const deg = i * 11.25;
            return (
              <g key={`m-scallop-${i}`} transform={`rotate(${deg} 300 300)`}>
                <path d="M 293 198 Q 300 190 307 198" strokeWidth="1.1" />
                <circle cx="300" cy="189" r="1.5" fill="currentColor" />
              </g>
            );
          })}

          <circle cx="300" cy="300" r="118" strokeWidth="1.5" />

          {/* Ring 3: 16 Flowering Veined Lotus Petals (r=118 to r=170) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const deg = i * 22.5 + 11.25;
            return (
              <g key={`m-petal-${i}`} transform={`rotate(${deg} 300 300)`}>
                {/* Outer petal contour */}
                <path
                  d="M 282 182 C 274 156 292 136 300 126 C 308 136 326 156 318 182"
                  strokeWidth="1.5"
                />
                {/* Inner contour */}
                <path
                  d="M 288 182 C 284 162 296 146 300 138 C 304 146 316 162 312 182"
                  strokeWidth="0.9"
                />
                {/* Center vein and pearl drop */}
                <line x1="300" y1="182" x2="300" y2="142" strokeWidth="0.8" />
                <circle cx="300" cy="154" r="2.2" fill="currentColor" />
                <circle cx="300" cy="126" r="2" fill="currentColor" />
              </g>
            );
          })}

          <circle cx="300" cy="300" r="184" strokeWidth="1.6" />
          <circle cx="300" cy="300" r="192" strokeWidth="0.9" />

          {/* Ring 4: Dense Radial Spokes / Fine Fluted Teeth (64 spokes) */}
          {Array.from({ length: 64 }).map((_, i) => {
            const deg = i * 5.625;
            return (
              <g key={`m-spoke-${i}`} transform={`rotate(${deg} 300 300)`}>
                <line x1="300" y1="108" x2="300" y2="116" strokeWidth={i % 2 === 0 ? '1.2' : '0.7'} />
              </g>
            );
          })}

          <circle cx="300" cy="300" r="208" strokeWidth="1.8" />
          <circle cx="300" cy="300" r="218" strokeWidth="0.9" strokeDasharray="3 3" />

          {/* Ring 5: Pearl Moti Garland (32 pearls) */}
          {Array.from({ length: 32 }).map((_, i) => {
            const deg = i * 11.25;
            return (
              <circle
                key={`m-pearl-${i}`}
                cx="300"
                cy="82"
                r="3"
                transform={`rotate(${deg} 300 300)`}
                fill="#FAF8F3"
                stroke="currentColor"
                strokeWidth="1"
              />
            );
          })}

          <circle cx="300" cy="300" r="228" strokeWidth="1.6" />

          {/* Ring 6: 16 Grand Pointed Rajput Lotus Petals with Kalash Peaks (r=228 to r=285) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const deg = i * 22.5;
            return (
              <g key={`m-grand-${i}`} transform={`rotate(${deg} 300 300)`}>
                {/* Grand outer petal contour */}
                <path
                  d="M 270 74 C 255 42 285 24 300 14 C 315 24 345 42 330 74"
                  strokeWidth="1.8"
                />
                {/* Secondary inner contour */}
                <path
                  d="M 278 74 C 268 48 290 32 300 24 C 310 32 332 48 322 74"
                  strokeWidth="1"
                />
                {/* Interior flowering spear */}
                <path
                  d="M 292 74 C 290 58 298 44 300 38 C 302 44 310 58 308 74"
                  strokeWidth="0.9"
                />
                <circle cx="300" cy="56" r="2.5" fill="currentColor" />

                {/* Kalash Needle Finial on Tip */}
                <line x1="300" y1="14" x2="300" y2="2" strokeWidth="1.4" />
                <circle cx="300" cy="2" r="2" fill="currentColor" />

                {/* Micro Kundan Drops flanking the petal */}
                <circle cx="260" cy="62" r="2" fill="currentColor" />
                <circle cx="340" cy="62" r="2" fill="currentColor" />
              </g>
            );
          })}

          {/* Outermost Scalloped Radiating Halo Ring */}
          <circle cx="300" cy="300" r="290" strokeWidth="1" strokeDasharray="4 3" />
          <circle cx="300" cy="300" r="296" strokeWidth="1.4" />
        </g>
      </svg>
    </div>
  );
};


// ==============================================================================
// 2. ROYAL TORAN JHAROKHA ARCHWAY (Grand Architectural Gate Frame)
// Exact reference: media_1792316567308.png
// Features: Carved wavy chhajja cornice, floral acanthus frieze (bel-boota),
// scalloped kangura fringe, multi-foil cusped arch with suspended potli/jhumka
// tassels, and dual pilasters with padma urns, sun roundels, and bead strings.
// ==============================================================================
export interface ToranJharokhaArchProps {
  className?: string;
  color?: string;
  opacity?: number;
  showContentArea?: boolean;
  children?: React.ReactNode;
}

export const ToranJharokhaArch: React.FC<ToranJharokhaArchProps> = ({
  className = '',
  color = '#B08D57',
  opacity = 0.85,
  showContentArea = true,
  children,
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Background Architectural Vector */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none w-full"
        style={{ opacity }}
      >
        <svg
          viewBox="0 0 600 720"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto text-[#B08D57]"
          style={{ color }}
        >
          <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* ── 1. TOP CARVED CORNICE & CHHAJJA (y: 10 to 65) ── */}
            {/* Upper crown line */}
            <rect x="20" y="14" width="560" height="12" rx="3" strokeWidth="2.2" />
            <line x1="26" y1="20" x2="574" y2="20" strokeWidth="0.9" strokeDasharray="3 3" />

            {/* Wavy Carved Chhajja Shadow Line */}
            <path
              d="M 30 38 Q 45 32 60 38 T 90 38 T 120 38 T 150 38 T 180 38 T 210 38 T 240 38 T 270 38 T 300 38 T 330 38 T 360 38 T 390 38 T 420 38 T 450 38 T 480 38 T 510 38 T 540 38 T 570 38"
              strokeWidth="2"
            />
            {/* Lower cornice baseline */}
            <rect x="40" y="44" width="520" height="14" rx="2" strokeWidth="2.2" />
            <line x1="46" y1="51" x2="554" y2="51" strokeWidth="0.8" />

            {/* ── 2. ACANTHUS FLORAL ARABESQUE FRIEZE (BEL-BOOTA) (y: 65 to 135) ── */}
            <rect x="52" y="62" width="496" height="72" strokeWidth="2" />
            <rect x="58" y="68" width="484" height="60" strokeWidth="0.9" strokeDasharray="4 2" />

            {/* Center Royal Palmette Flower */}
            <g transform="translate(300, 98)">
              {/* Central vertical flame/lotus petal */}
              <path d="M 0 -22 C -6 -12 -5 -4 0 4 C 5 -4 6 -12 0 -22 Z" fill="currentColor" />
              {/* Flanking side petals */}
              <path d="M -2 -14 C -12 -12 -16 -4 -12 4 C -6 4 -2 -2 -2 -14 Z" fill="currentColor" />
              <path d="M 2 -14 C 12 -12 16 -4 12 4 C 6 4 2 -2 2 -14 Z" fill="currentColor" />
              {/* Lower calyx */}
              <circle cx="0" cy="8" r="3.5" fill="currentColor" />
              <line x1="-16" y1="12" x2="16" y2="12" strokeWidth="1.5" />
            </g>

            {/* Symmetrical Left Scrolling Foliage */}
            <path
              d="M 276 96 C 240 76 210 114 170 88 C 146 72 120 100 86 86 M 168 90 C 180 115 210 116 230 102 M 116 92 C 128 112 148 110 156 102"
              strokeWidth="1.8"
            />
            {/* Left Leaf details */}
            <path d="M 226 86 C 218 78 228 72 236 80 Z" fill="currentColor" />
            <path d="M 148 80 C 140 72 150 66 158 74 Z" fill="currentColor" />
            <path d="M 100 84 C 92 76 102 70 110 78 Z" fill="currentColor" />

            {/* Symmetrical Right Scrolling Foliage */}
            <path
              d="M 324 96 C 360 76 390 114 430 88 C 454 72 480 100 514 86 M 432 90 C 420 115 390 116 370 102 M 484 92 C 472 112 452 110 444 102"
              strokeWidth="1.8"
            />
            {/* Right Leaf details */}
            <path d="M 374 86 C 382 78 372 72 364 80 Z" fill="currentColor" />
            <path d="M 452 80 C 460 72 450 66 442 74 Z" fill="currentColor" />
            <path d="M 500 84 C 508 76 498 70 490 78 Z" fill="currentColor" />

            {/* ── 3. SCALLOPED KANGURA BATTLEMENT FRINGE (y: 134 to 175) ── */}
            <line x1="52" y1="138" x2="548" y2="138" strokeWidth="2" />
            {/* Kangura Crenellations */}
            {Array.from({ length: 24 }).map((_, i) => {
              const x = 62 + i * 20.5;
              return (
                <g key={`kangura-fringe-${i}`}>
                  <path
                    d={`M ${x} 138 C ${x} 154 ${x + 18} 154 ${x + 18} 138`}
                    strokeWidth="1.3"
                  />
                  <line x1={x + 9} y1="138" x2={x + 9} y2="152" strokeWidth="0.8" />
                </g>
              );
            })}
            <line x1="52" y1="156" x2="548" y2="156" strokeWidth="1.8" />

            {/* Fluted Vertical Spoke Band */}
            {Array.from({ length: 48 }).map((_, i) => {
              const x = 58 + i * 10.3;
              return <line key={`flute-${i}`} x1={x} y1="156" x2={x} y2="172" strokeWidth="0.85" />;
            })}
            <line x1="52" y1="172" x2="548" y2="172" strokeWidth="2.2" />

            {/* ── 4. CUSPED MULTI-FOIL ARCHWAY WITH POTLI TASSELS (y: 172 to 680) ── */}
            {/* Outer cusped profile */}
            <path
              d="M 124 680 V 310
                 C 124 280 148 266 168 250
                 C 188 234 220 220 238 190
                 C 256 160 286 148 300 134
                 C 314 148 344 160 362 190
                 C 380 220 412 234 432 250
                 C 452 266 476 280 476 310
                 V 680"
              strokeWidth="2.6"
            />

            {/* Inner parallel moulding */}
            <path
              d="M 134 680 V 315
                 C 134 288 156 274 174 260
                 C 192 246 222 232 240 204
                 C 258 176 286 162 300 150
                 C 314 162 342 176 360 204
                 C 378 232 408 246 426 260
                 C 444 274 466 288 466 315
                 V 680"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />

            {/* Hanging Royal Potli / Jhumka Tassels suspended from Cusps */}
            {/* Left Outer Tassel */}
            <g transform="translate(168, 252)">
              <line x1="0" y1="0" x2="0" y2="42" strokeWidth="1.2" />
              <circle cx="0" cy="18" r="2.5" fill="currentColor" />
              <path d="M -4 42 C -6 48 6 48 4 42 Z" fill="currentColor" />
              <line x1="0" y1="48" x2="0" y2="58" strokeWidth="1" />
              <circle cx="0" cy="58" r="2" fill="currentColor" />
            </g>

            {/* Left Inner Tassel */}
            <g transform="translate(238, 192)">
              <line x1="0" y1="0" x2="0" y2="50" strokeWidth="1.2" />
              <circle cx="0" cy="22" r="2.5" fill="currentColor" />
              <path d="M -5 50 C -7 58 7 58 5 50 Z" fill="currentColor" />
              <line x1="0" y1="58" x2="0" y2="70" strokeWidth="1" />
              <circle cx="0" cy="70" r="2.2" fill="currentColor" />
            </g>

            {/* Right Inner Tassel */}
            <g transform="translate(362, 192)">
              <line x1="0" y1="0" x2="0" y2="50" strokeWidth="1.2" />
              <circle cx="0" cy="22" r="2.5" fill="currentColor" />
              <path d="M -5 50 C -7 58 7 58 5 50 Z" fill="currentColor" />
              <line x1="0" y1="58" x2="0" y2="70" strokeWidth="1" />
              <circle cx="0" cy="70" r="2.2" fill="currentColor" />
            </g>

            {/* Right Outer Tassel */}
            <g transform="translate(432, 252)">
              <line x1="0" y1="0" x2="0" y2="42" strokeWidth="1.2" />
              <circle cx="0" cy="18" r="2.5" fill="currentColor" />
              <path d="M -4 42 C -6 48 6 48 4 42 Z" fill="currentColor" />
              <line x1="0" y1="48" x2="0" y2="58" strokeWidth="1" />
              <circle cx="0" cy="58" r="2" fill="currentColor" />
            </g>

            {/* ── 5. LEFT & RIGHT CARVED PILASTER COLUMNS (x: 52 to 124 & 476 to 548) ── */}
            {/* Left Column Shaft */}
            <rect x="52" y="172" width="72" height="508" strokeWidth="2.2" />
            <rect x="58" y="178" width="60" height="496" strokeWidth="0.9" />

            {/* Left Column Detail 1: Triple Leaf Lotus Band (y: 200) */}
            <g transform="translate(88, 210)">
              <path d="M 0 -12 C -4 -4 -2 0 0 4 C 2 0 4 -4 0 -12 Z" fill="currentColor" />
              <path d="M -8 -8 C -10 -2 -6 2 -2 4" strokeWidth="1.4" />
              <path d="M 8 -8 C 10 -2 6 2 2 4" strokeWidth="1.4" />
              <circle cx="0" cy="8" r="2" fill="currentColor" />
            </g>
            <line x1="62" y1="230" x2="114" y2="230" strokeWidth="1.2" strokeDasharray="3 2" />

            {/* Left Column Detail 2: Royal Sunburst Roundel (y: 280) */}
            <g transform="translate(88, 280)">
              <circle cx="0" cy="0" r="18" strokeWidth="1.8" />
              <circle cx="0" cy="0" r="14" strokeWidth="0.9" strokeDasharray="2 2" />
              <circle cx="0" cy="0" r="7" strokeWidth="1.2" fill="#FAF8F3" />
              <circle cx="0" cy="0" r="2.5" fill="currentColor" />
            </g>
            <line x1="62" y1="330" x2="114" y2="330" strokeWidth="1.2" strokeDasharray="3 2" />

            {/* Left Column Detail 3: Vertical Moti Bead Chain (y: 350 to 440) */}
            <g transform="translate(88, 350)">
              <line x1="0" y1="0" x2="0" y2="80" strokeWidth="1" strokeDasharray="2 4" />
              {[0, 16, 32, 48, 64, 80].map((y, idx) => (
                <circle key={`l-bead-${idx}`} cx="0" cy={y} r={idx % 2 === 0 ? '3' : '2'} fill="currentColor" />
              ))}
            </g>
            <line x1="62" y1="450" x2="114" y2="450" strokeWidth="1.4" />

            {/* Left Column Detail 4: Base Plinth Cusped Arch Niche (y: 470 to 650) */}
            <path
              d="M 68 640 V 510 C 68 490 88 474 88 464 C 88 474 108 490 108 510 V 640 Z"
              strokeWidth="1.6"
            />
            <circle cx="88" cy="510" r="4" fill="currentColor" />
            <rect x="60" y="650" width="56" height="24" rx="2" strokeWidth="1.8" />

            {/* Right Column Shaft */}
            <rect x="476" y="172" width="72" height="508" strokeWidth="2.2" />
            <rect x="482" y="178" width="60" height="496" strokeWidth="0.9" />

            {/* Right Column Detail 1: Triple Leaf Lotus Band (y: 200) */}
            <g transform="translate(512, 210)">
              <path d="M 0 -12 C -4 -4 -2 0 0 4 C 2 0 4 -4 0 -12 Z" fill="currentColor" />
              <path d="M -8 -8 C -10 -2 -6 2 -2 4" strokeWidth="1.4" />
              <path d="M 8 -8 C 10 -2 6 2 2 4" strokeWidth="1.4" />
              <circle cx="0" cy="8" r="2" fill="currentColor" />
            </g>
            <line x1="486" y1="230" x2="538" y2="230" strokeWidth="1.2" strokeDasharray="3 2" />

            {/* Right Column Detail 2: Royal Sunburst Roundel (y: 280) */}
            <g transform="translate(512, 280)">
              <circle cx="0" cy="0" r="18" strokeWidth="1.8" />
              <circle cx="0" cy="0" r="14" strokeWidth="0.9" strokeDasharray="2 2" />
              <circle cx="0" cy="0" r="7" strokeWidth="1.2" fill="#FAF8F3" />
              <circle cx="0" cy="0" r="2.5" fill="currentColor" />
            </g>
            <line x1="486" y1="330" x2="538" y2="330" strokeWidth="1.2" strokeDasharray="3 2" />

            {/* Right Column Detail 3: Vertical Moti Bead Chain (y: 350 to 440) */}
            <g transform="translate(512, 350)">
              <line x1="0" y1="0" x2="0" y2="80" strokeWidth="1" strokeDasharray="2 4" />
              {[0, 16, 32, 48, 64, 80].map((y, idx) => (
                <circle key={`r-bead-${idx}`} cx="0" cy={y} r={idx % 2 === 0 ? '3' : '2'} fill="currentColor" />
              ))}
            </g>
            <line x1="486" y1="450" x2="538" y2="450" strokeWidth="1.4" />

            {/* Right Column Detail 4: Base Plinth Cusped Arch Niche (y: 470 to 650) */}
            <path
              d="M 492 640 V 510 C 492 490 512 474 512 464 C 512 474 532 490 532 510 V 640 Z"
              strokeWidth="1.6"
            />
            <circle cx="512" cy="510" r="4" fill="currentColor" />
            <rect x="484" y="650" width="56" height="24" rx="2" strokeWidth="1.8" />
          </g>
        </svg>
      </div>

      {/* Optional Inner Content Overlay placed neatly inside the archway */}
      {showContentArea && children && (
        <div className="relative z-10 -mt-[78%] sm:-mt-[74%] px-8 sm:px-16 pb-12 w-full flex flex-col items-center">
          {children}
        </div>
      )}
    </div>
  );
};


// ==============================================================================
// 3. LATA JAALI RUNNER (Vertical Symmetrical Floral Column Border)
// Exact reference: media_1792316581269.jpg
// Features: Scalloped lace borders, 16-petal radiating sunburst lotus medallion,
// symmetrical climbing jasmine vines (lata), buds, and acanthus lily leaves.
// ==============================================================================
export interface LataJaaliRunnerProps {
  className?: string;
  color?: string;
  opacity?: number;
  side?: 'left' | 'right' | 'center';
}

export const LataJaaliRunner: React.FC<LataJaaliRunnerProps> = ({
  className = '',
  color = '#B08D57',
  opacity = 0.55,
  side = 'left',
}) => {
  const sideClass = {
    left: 'left-0 top-0',
    right: 'right-0 top-0 scale-x-[-1]',
    center: 'left-1/2 -translate-x-1/2 top-0',
  }[side];

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none z-0 select-none overflow-hidden h-full ${sideClass} ${className}`}
      style={{
        width: 'clamp(120px, 16vw, 240px)',
        opacity,
      }}
    >
      <svg
        viewBox="0 0 240 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMid slice"
        className="w-full h-full text-[#B08D57]"
        style={{ color }}
      >
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {/* Outer Scalloped Lace Edge */}
          {Array.from({ length: 40 }).map((_, i) => {
            const y = i * 20;
            return (
              <path
                key={`scallop-edge-${i}`}
                d={`M 12 ${y} C 2 ${y + 5} 2 ${y + 15} 12 ${y + 20}`}
                strokeWidth="1.2"
              />
            );
          })}

          {/* Dual Parallel Border Frame Lines */}
          <line x1="16" y1="0" x2="16" y2="800" strokeWidth="1.8" />
          <line x1="24" y1="0" x2="24" y2="800" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="220" y1="0" x2="220" y2="800" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="228" y1="0" x2="228" y2="800" strokeWidth="1.8" />

          {/* Right Scalloped Lace Edge */}
          {Array.from({ length: 40 }).map((_, i) => {
            const y = i * 20;
            return (
              <path
                key={`scallop-edge-r-${i}`}
                d={`M 232 ${y} C 242 ${y + 5} 242 ${y + 15} 232 ${y + 20}`}
                strokeWidth="1.2"
              />
            );
          })}

          {/* ── CENTRAL 16-PETAL LOTUS SUNBURST MEDALLION (y: 400) ── */}
          <g transform="translate(122, 400)">
            {/* Core Bindu */}
            <circle cx="0" cy="0" r="16" fill="#FAF8F3" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="0" cy="0" r="7" strokeWidth="1" />
            <circle cx="0" cy="0" r="2.5" fill="currentColor" />

            {/* 16 Radiating Lotus Petals */}
            {Array.from({ length: 16 }).map((_, idx) => {
              const deg = idx * 22.5;
              return (
                <g key={`lata-petal-${idx}`} transform={`rotate(${deg})`}>
                  <path
                    d="M -4 20 C -6 32 0 44 0 50 C 0 44 6 32 4 20 Z"
                    strokeWidth="1.2"
                    fill="#FAF8F3"
                  />
                  <line x1="0" y1="20" x2="0" y2="42" strokeWidth="0.75" />
                  <circle cx="0" cy="50" r="1.5" fill="currentColor" />
                </g>
              );
            })}

            {/* Outer Flourishing Fleur-de-lis Tendrils */}
            {Array.from({ length: 8 }).map((_, idx) => {
              const deg = idx * 45;
              return (
                <g key={`lata-fleur-${idx}`} transform={`rotate(${deg})`}>
                  <path
                    d="M 0 52 C -15 62 -20 80 -10 92 C 0 82 -2 68 0 52"
                    strokeWidth="1.1"
                  />
                  <path
                    d="M 0 52 C 15 62 20 80 10 92 C 0 82 2 68 0 52"
                    strokeWidth="1.1"
                  />
                  <circle cx="-10" cy="92" r="2.2" fill="currentColor" />
                  <circle cx="10" cy="92" r="2.2" fill="currentColor" />
                </g>
              );
            })}
          </g>

          {/* ── TOP S-CURVING JASMINE VINES (y: 0 to 280) ── */}
          <path
            d="M 122 280 
               C 80 240 50 180 90 130 
               C 130 80 70 30 122 0"
            strokeWidth="1.8"
          />
          <path
            d="M 122 280 
               C 164 240 194 180 154 130 
               C 114 80 174 30 122 0"
            strokeWidth="1.8"
          />

          {/* Top Jasmine Blossoms & Buds */}
          {[
            [122, 60],
            [76, 150],
            [168, 150],
            [90, 220],
            [154, 220],
          ].map(([x, y], idx) => (
            <g key={`top-blossom-${idx}`} transform={`translate(${x}, ${y})`}>
              <circle cx="0" cy="0" r="4.5" fill="#FAF8F3" strokeWidth="1" />
              <circle cx="0" cy="0" r="1.5" fill="currentColor" />
              {/* 5 Petals */}
              {[0, 72, 144, 216, 288].map((ang, pIdx) => {
                const rad = (ang * Math.PI) / 180;
                const px = Math.cos(rad) * 9;
                const py = Math.sin(rad) * 9;
                return (
                  <circle
                    key={`p-${pIdx}`}
                    cx={px}
                    cy={py}
                    r="2.8"
                    fill="#FAF8F3"
                    stroke="currentColor"
                    strokeWidth="0.9"
                  />
                );
              })}
            </g>
          ))}

          {/* ── BOTTOM S-CURVING JASMINE VINES (y: 520 to 800) ── */}
          <path
            d="M 122 520 
               C 80 560 50 620 90 670 
               C 130 720 70 770 122 800"
            strokeWidth="1.8"
          />
          <path
            d="M 122 520 
               C 164 560 194 620 154 670 
               C 114 720 174 770 122 800"
            strokeWidth="1.8"
          />

          {/* Bottom Jasmine Blossoms & Buds */}
          {[
            [90, 580],
            [154, 580],
            [76, 650],
            [168, 650],
            [122, 740],
          ].map(([x, y], idx) => (
            <g key={`bot-blossom-${idx}`} transform={`translate(${x}, ${y})`}>
              <circle cx="0" cy="0" r="4.5" fill="#FAF8F3" strokeWidth="1" />
              <circle cx="0" cy="0" r="1.5" fill="currentColor" />
              {[0, 72, 144, 216, 288].map((ang, pIdx) => {
                const rad = (ang * Math.PI) / 180;
                const px = Math.cos(rad) * 9;
                const py = Math.sin(rad) * 9;
                return (
                  <circle
                    key={`p-bot-${pIdx}`}
                    cx={px}
                    cy={py}
                    r="2.8"
                    fill="#FAF8F3"
                    stroke="currentColor"
                    strokeWidth="0.9"
                  />
                );
              })}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};


// ==============================================================================
// 4. ROYAL PROCESSION BANNER (Shahi Sawari - Elephant, Camel, Chhatri)
// Reference: media_1792262895991.jpg (Screen 4 Bottom "Dine Like Royalty")
// Features: Caparisoned royal elephant with howdah, royal standard, ceremonial
// royal camel with tassel reins, and palace chhatri pavilions.
// Dedicated to: Restaurant page & Banquet dining cards.
// ==============================================================================
export interface RoyalProcessionBannerProps {
  className?: string;
  color?: string;
  opacity?: number;
}

export const RoyalProcessionBanner: React.FC<RoyalProcessionBannerProps> = ({
  className = '',
  color = '#B08D57',
  opacity = 0.9,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`w-full max-w-4xl mx-auto pointer-events-none select-none py-4 ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 900 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto text-[#B08D57]"
        style={{ color }}
      >
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {/* Groundline & Rajput Border Band */}
          <line x1="20" y1="140" x2="880" y2="140" strokeWidth="2.2" />
          <line x1="30" y1="148" x2="870" y2="148" strokeWidth="0.9" strokeDasharray="4 3" />
          <line x1="40" y1="154" x2="860" y2="154" strokeWidth="1.4" />

          {/* ── LEFT FLANK: RAJASTHANI PALACE CHHATRI (x: 40 to 120) ── */}
          <g transform="translate(60, 20)">
            {/* Kalash Pinnacle */}
            <line x1="40" y1="4" x2="40" y2="22" strokeWidth="1.6" />
            <circle cx="40" cy="4" r="2" fill="currentColor" />
            <circle cx="40" cy="14" r="3.5" fill="currentColor" />
            {/* Fluted Dome */}
            <path d="M 16 46 C 16 26 64 26 64 46 Z" strokeWidth="1.8" />
            <line x1="28" y1="36" x2="40" y2="24" strokeWidth="0.9" />
            <line x1="52" y1="36" x2="40" y2="24" strokeWidth="0.9" />
            {/* Eaves & Columns */}
            <line x1="10" y1="48" x2="70" y2="48" strokeWidth="2" />
            <line x1="20" y1="48" x2="20" y2="120" strokeWidth="1.5" />
            <line x1="60" y1="48" x2="60" y2="120" strokeWidth="1.5" />
            {/* Cusped Arch inside Chhatri */}
            <path d="M 20 80 Q 40 60 60 80" strokeWidth="1.4" />
          </g>

          {/* ── CENTER-LEFT: ROYAL CAPARISONED ELEPHANT WITH HOWDAH (x: 180 to 420) ── */}
          <g transform="translate(200, 16)">
            {/* Royal Standard Flag */}
            <line x1="130" y1="6" x2="130" y2="52" strokeWidth="1.4" />
            <path d="M 130 6 L 158 16 L 130 26 Z" fill="currentColor" />

            {/* Howdah (Royal Seat) */}
            <rect x="86" y="24" width="70" height="28" rx="3" strokeWidth="1.8" />
            <path d="M 86 24 Q 121 14 156 24" strokeWidth="1.2" />
            <line x1="94" y1="34" x2="148" y2="34" strokeWidth="0.8" strokeDasharray="2 2" />
            {/* Parasol (Chhatra) over King/Howdah */}
            <path d="M 98 12 Q 121 2 144 12 Z" strokeWidth="1.4" fill="currentColor" />
            <line x1="121" y1="2" x2="121" y2="24" strokeWidth="1.2" />

            {/* Elephant Body Contour */}
            {/* Head and Crown Forehead Plate */}
            <path
              d="M 180 82 
                 C 192 70 196 52 184 44 
                 C 172 36 150 42 140 48 
                 L 80 48 
                 C 54 48 42 70 42 100 
                 L 46 124 
                 L 58 124 
                 L 64 98 
                 L 86 98 
                 L 82 124 
                 L 96 124 
                 L 104 86 
                 L 140 86 
                 L 142 124 
                 L 156 124 
                 L 160 92 
                 L 172 92 
                 L 174 124 
                 L 186 124 
                 L 190 76"
              strokeWidth="2.2"
            />
            {/* Raised Trunk (Sign of Welcome & Good Fortune) */}
            <path
              d="M 184 64 
                 C 208 60 220 46 226 28 
                 C 230 18 222 14 218 22 
                 C 214 30 204 46 186 52"
              strokeWidth="2"
            />
            {/* Pointed Tusk */}
            <path d="M 188 74 C 208 76 216 68 218 64 C 206 68 194 70 186 70" strokeWidth="1.6" fill="#FAF8F3" />
            {/* Ear */}
            <path d="M 166 48 C 150 56 154 78 168 80" strokeWidth="1.6" />
            <circle cx="178" cy="54" r="2" fill="currentColor" />

            {/* Embroidered Jhool (Elephant Saddle Cloth) */}
            <path
              d="M 88 56 H 146 V 96 C 146 102 140 106 117 106 C 94 106 88 102 88 96 Z"
              strokeWidth="1.6"
            />
            <circle cx="117" cy="80" r="10" strokeWidth="1.2" />
            <circle cx="117" cy="80" r="3" fill="currentColor" />
            {/* Hanging Jhool Bells/Tassels */}
            {[94, 106, 117, 128, 140].map((bx, bIdx) => (
              <circle key={`e-bell-${bIdx}`} cx={bx} cy="109" r="1.8" fill="currentColor" />
            ))}
          </g>

          {/* ── CENTER-RIGHT: ROYAL RAJASTHANI DESERT CAMEL (x: 480 to 680) ── */}
          <g transform="translate(480, 24)">
            {/* Camel Head & Bridle */}
            <path
              d="M 188 32 
                 C 186 24 174 20 166 22 
                 C 158 24 154 34 158 44 
                 C 162 56 164 72 154 84 
                 C 142 94 126 94 116 94 
                 L 112 116 L 102 116 L 108 94 
                 L 90 94 
                 L 84 116 L 74 116 L 80 84 
                 C 74 80 62 76 56 64 
                 C 50 50 64 42 76 46 
                 L 46 116 L 36 116 L 50 68 
                 L 26 116 L 16 116 L 36 60 
                 C 32 48 40 40 50 36 
                 C 66 30 76 40 90 40 
                 C 106 40 114 26 130 26 
                 C 146 26 156 50 164 50 
                 C 174 50 178 36 188 32 Z"
              strokeWidth="2"
            />
            {/* Camel Hump contour */}
            <path d="M 86 40 C 96 16 122 16 132 40" strokeWidth="2.2" />
            {/* Saddle & Tassels */}
            <rect x="92" y="36" width="34" height="22" rx="2" strokeWidth="1.4" />
            <line x1="98" y1="44" x2="120" y2="44" strokeWidth="0.8" />
            <circle cx="109" cy="48" r="2.5" fill="currentColor" />
            {/* Bridle rein */}
            <path d="M 174 30 Q 150 48 110 44" strokeWidth="1" strokeDasharray="3 2" />
          </g>

          {/* ── RIGHT FLANK: RAJASTHANI PALACE GATEWAY (x: 740 to 860) ── */}
          <g transform="translate(760, 20)">
            <line x1="40" y1="4" x2="40" y2="22" strokeWidth="1.6" />
            <circle cx="40" cy="4" r="2" fill="currentColor" />
            <circle cx="40" cy="14" r="3.5" fill="currentColor" />
            <path d="M 16 46 C 16 26 64 26 64 46 Z" strokeWidth="1.8" />
            <line x1="10" y1="48" x2="70" y2="48" strokeWidth="2" />
            <line x1="20" y1="48" x2="20" y2="120" strokeWidth="1.5" />
            <line x1="60" y1="48" x2="60" y2="120" strokeWidth="1.5" />
            <path d="M 20 80 Q 40 60 60 80" strokeWidth="1.4" />
          </g>
        </g>
      </svg>
    </div>
  );
};


// ==============================================================================
// 5. PAISLEY BUTA ORNAMENT (Rajasthani Kalka Mango Motif)
// Dedicated to: Café & Lounge page, artisan beverages, and confectionery.
// Features: The iconic curved mango leaf motif with interior floral vines,
// radiating teardrops, and flowering calyx.
// ==============================================================================
export interface PaisleyButaProps {
  className?: string;
  color?: string;
  opacity?: number;
  size?: string;
}

export const PaisleyButaOrnament: React.FC<PaisleyButaProps> = ({
  className = '',
  color = '#B08D57',
  opacity = 0.5,
  size = '260px',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size, opacity }}
    >
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full text-[#B08D57]"
        style={{ color }}
      >
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {/* Main Outer Paisley Swirl (Kalka) */}
          <path
            d="M 140 260 
               C 80 260 40 210 40 150 
               C 40 90 85 46 140 26 
               C 174 14 214 20 236 44 
               C 254 64 250 90 230 102 
               C 210 114 184 100 188 80 
               C 192 64 210 60 218 68 
               C 222 72 216 80 210 80 
               C 204 80 200 74 204 68"
            strokeWidth="2.2"
          />

          {/* Secondary Parallel Inner Contour */}
          <path
            d="M 140 248 
               C 92 248 56 206 56 152 
               C 56 100 96 60 142 42 
               C 170 32 204 38 222 56 
               C 234 68 232 86 218 94 
               C 204 102 188 92 192 78"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />

          {/* Base Calyx & Lotus Roots */}
          <path d="M 108 260 C 124 274 156 274 172 260" strokeWidth="1.8" />
          <circle cx="140" cy="272" r="3" fill="currentColor" />

          {/* Interior Blooming Lotus & Vine */}
          <g transform="translate(130, 160)">
            <circle cx="0" cy="0" r="14" strokeWidth="1.4" />
            <circle cx="0" cy="0" r="5" fill="currentColor" />
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <circle
                key={`kalka-p-${i}`}
                cx={Math.cos((deg * Math.PI) / 180) * 22}
                cy={Math.sin((deg * Math.PI) / 180) * 22}
                r="3.5"
                fill="#FAF8F3"
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
            {/* Interior Vine S-Curve */}
            <path d="M 0 -22 C -20 -44 10 -60 26 -80" strokeWidth="1.4" />
            <circle cx="26" cy="-80" r="3" fill="currentColor" />
          </g>

          {/* Scalloped Outer Fringe Beads along the Spine */}
          {Array.from({ length: 18 }).map((_, i) => {
            const rad = (i * 11 * Math.PI) / 180;
            const x = 140 - Math.cos(rad) * 98;
            const y = 150 + Math.sin(rad) * 98;
            return <circle key={`moti-spine-${i}`} cx={x} cy={y} r="2" fill="currentColor" />;
          })}
        </g>
      </svg>
    </div>
  );
};


// ==============================================================================
// 6. DARBAR CHHATRI ORNAMENT (Grand Royal Cupola Pavilion)
// Dedicated to: Party Hall (Events & Weddings) page.
// Features: Fluted Mewar cupola, sacred Kalash pinnacle, carved toda brackets,
// and royal wedding/durbar pavilion pillars.
// ==============================================================================
export interface DarbarChhatriProps {
  className?: string;
  color?: string;
  opacity?: number;
}

export const DarbarChhatriOrnament: React.FC<DarbarChhatriProps> = ({
  className = '',
  color = '#B08D57',
  opacity = 0.5,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto text-[#B08D57]"
        style={{ color }}
      >
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {/* Kalash Pinnacle Spire */}
          <line x1="250" y1="10" x2="250" y2="48" strokeWidth="2.2" />
          <circle cx="250" cy="10" r="3" fill="currentColor" />
          <circle cx="250" cy="24" r="5" fill="#FAF8F3" strokeWidth="1.4" />
          <ellipse cx="250" cy="40" rx="9" ry="4" strokeWidth="1.4" fill="currentColor" />

          {/* Grand Bangaldar Fluted Dome */}
          <path
            d="M 120 120 
               C 120 62 250 48 250 48 
               C 250 48 380 62 380 120 Z"
            strokeWidth="2.4"
          />
          {/* Dome Fluting Ribs */}
          {[-90, -60, -30, 0, 30, 60, 90].map((offset, idx) => (
            <line
              key={`dome-rib-${idx}`}
              x1={250 + offset}
              y1={120 - Math.cos((offset / 100) * (Math.PI / 2)) * 32}
              x2={250 + offset * 0.25}
              y2="48"
              strokeWidth="1"
            />
          ))}

          {/* Projecting Chhajja Eaves */}
          <path d="M 100 134 Q 250 110 400 134" strokeWidth="2.8" />
          <path d="M 110 142 Q 250 120 390 142" strokeWidth="1.4" />
          {/* Eave Drops */}
          {Array.from({ length: 15 }).map((_, i) => {
            const x = 120 + i * 18.5;
            return <circle key={`eave-d-${i}`} cx={x} cy="144" r="2" fill="currentColor" />;
          })}

          {/* Cusped Darbar Archway */}
          <path
            d="M 160 320 V 220 
               C 160 188 190 178 210 168 
               C 230 158 245 152 250 146 
               C 255 152 270 158 290 168 
               C 310 178 340 188 340 220 
               V 320"
            strokeWidth="2.2"
          />
          {/* Hanging Bell in Center Arch */}
          <line x1="250" y1="146" x2="250" y2="190" strokeWidth="1.2" />
          <path d="M 244 190 C 242 198 258 198 256 190 Z" fill="currentColor" />
          <circle cx="250" cy="202" r="2" fill="currentColor" />

          {/* Flanking Fluted Pillars */}
          {/* Left Column */}
          <rect x="140" y="210" width="20" height="130" strokeWidth="1.8" />
          <line x1="147" y1="210" x2="147" y2="340" strokeWidth="0.8" />
          <line x1="153" y1="210" x2="153" y2="340" strokeWidth="0.8" />
          <rect x="134" y="340" width="32" height="14" rx="2" strokeWidth="1.8" />

          {/* Right Column */}
          <rect x="340" y="210" width="20" height="130" strokeWidth="1.8" />
          <line x1="347" y1="210" x2="347" y2="340" strokeWidth="0.8" />
          <line x1="353" y1="210" x2="353" y2="340" strokeWidth="0.8" />
          <rect x="334" y="340" width="32" height="14" rx="2" strokeWidth="1.8" />

          {/* Stone Plinth Baseline */}
          <line x1="80" y1="354" x2="420" y2="354" strokeWidth="2.4" />
          <line x1="100" y1="362" x2="400" y2="362" strokeWidth="1.4" />
        </g>
      </svg>
    </div>
  );
};


// ==============================================================================
// 7. HERITAGE DIVIDER (Symmetrical Horizontal Section Divider)
// Symmetrical horizontal divider with central 8-petal royal lotus medallion,
// flanking acanthus arabesques (bel-boota), and fine tapered rules.
// ==============================================================================
export interface HeritageDividerProps {
  className?: string;
  color?: string;
  opacity?: number;
}

export const HeritageDivider: React.FC<HeritageDividerProps> = ({
  className = '',
  color = '#B08D57',
  opacity = 0.75,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`w-full max-w-3xl mx-auto flex items-center justify-center my-8 pointer-events-none select-none px-4 ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 800 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="w-full text-[#B08D57]"
        style={{ color }}
      >
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {/* Left Rule */}
          <line x1="20" y1="32" x2="260" y2="32" strokeWidth="1.2" />
          <line x1="60" y1="28" x2="230" y2="28" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="20" cy="32" r="2.5" fill="currentColor" />
          <polygon points="120,32 125,28 130,32 125,36" fill="currentColor" />
          <polygon points="210,32 215,28 220,32 215,36" fill="currentColor" />

          {/* Left Arabesque Vine */}
          <path
            d="M 260 32 
               C 285 32 300 20 318 20 
               C 334 20 345 30 354 32
               C 342 36 330 46 314 46
               C 298 46 280 34 260 32 Z"
            strokeWidth="1.1"
            fill="none"
          />
          <circle cx="318" cy="20" r="2.8" fill="#FAF8F3" strokeWidth="1" />
          <circle cx="318" cy="20" r="1.2" fill="currentColor" />
          <circle cx="314" cy="46" r="2.8" fill="#FAF8F3" strokeWidth="1" />
          <circle cx="314" cy="46" r="1.2" fill="currentColor" />
          <path d="M 334 32 C 348 24 366 26 376 32" strokeWidth="1.2" />
          <circle cx="376" cy="32" r="2" fill="currentColor" />

          {/* Center Lotus Medallion Cartouche */}
          <polygon
            points="400,8 432,32 400,56 368,32"
            strokeWidth="1.5"
            fill="#FAF8F3"
          />
          <polygon
            points="400,14 424,32 400,50 376,32"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <circle cx="400" cy="32" r="5" fill="currentColor" />
          <circle cx="400" cy="32" r="10" strokeWidth="1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            const px = 400 + Math.cos(rad) * 16;
            const py = 32 + Math.sin(rad) * 16;
            return (
              <g key={`center-petal-${idx}`}>
                <line x1={400} y1={32} x2={px} y2={py} strokeWidth="1" />
                <circle cx={px} cy={py} r="1.6" fill="currentColor" />
              </g>
            );
          })}
          <circle cx="400" cy="8" r="2.2" fill="currentColor" />
          <circle cx="400" cy="56" r="2.2" fill="currentColor" />

          {/* Right Arabesque Vine */}
          <path d="M 424 32 C 434 26 452 24 466 32" strokeWidth="1.2" />
          <circle cx="424" cy="32" r="2" fill="currentColor" />
          <path
            d="M 540 32 
               C 515 32 500 20 482 20 
               C 466 20 455 30 446 32
               C 458 36 470 46 486 46
               C 502 46 520 34 540 32 Z"
            strokeWidth="1.1"
            fill="none"
          />
          <circle cx="482" cy="20" r="2.8" fill="#FAF8F3" strokeWidth="1" />
          <circle cx="482" cy="20" r="1.2" fill="currentColor" />
          <circle cx="486" cy="46" r="2.8" fill="#FAF8F3" strokeWidth="1" />
          <circle cx="486" cy="46" r="1.2" fill="currentColor" />

          {/* Right Rule */}
          <line x1="540" y1="32" x2="780" y2="32" strokeWidth="1.2" />
          <line x1="570" y1="28" x2="740" y2="28" strokeWidth="0.75" strokeDasharray="3 3" />
          <polygon points="580,32 585,28 590,32 585,36" fill="currentColor" />
          <polygon points="670,32 675,28 680,32 675,36" fill="currentColor" />
          <circle cx="780" cy="32" r="2.5" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
};


// ==============================================================================
// 8. JHAROKHA FRAME (Profile Frame for Images)
// ==============================================================================
export const JharokhaFrame: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => {
  return (
    <div className={`relative p-3 sm:p-5 rounded-t-[120px] sm:rounded-t-[160px] border-2 border-[#B08D57]/50 bg-[#FAF8F3] shadow-xl ${className}`}>
      {/* Upper Pinnacle Crown */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FAF8F3] px-3 py-0.5 rounded-full border border-[#B08D57]/40 shadow-xs flex items-center justify-center">
        <svg width="36" height="18" viewBox="0 0 36 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 18 2 L 23 10 L 18 16 L 13 10 Z" fill="#B08D57" />
          <circle cx="18" cy="2" r="2" fill="#670E10" />
          <line x1="6" y1="12" x2="30" y2="12" stroke="#B08D57" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* Arched Window Cutout */}
      <div className="rounded-t-[105px] sm:rounded-t-[142px] overflow-hidden border border-[#B08D57]/30">
        {children}
      </div>

      {/* Lower Decorative Corner Accents */}
      <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#B08D57]/60" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[#B08D57]/60" />
    </div>
  );
};
