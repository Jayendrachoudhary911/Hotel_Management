'use client';

import React from 'react';

// ── 1. BESPOKE RAJASTHANI CORNER MANDALA ORNAMENT ──
// Mathematical, multi-layered geometric & floral line art rooted in Mewar & Shekhawati palace architecture.
// Designed for responsive corner watermarks with fine champagne-gold strokes and negative space.
export interface MandalaOrnamentProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  className?: string;
  color?: string;
  opacity?: number;
}

export const MandalaOrnament: React.FC<MandalaOrnamentProps> = ({
  position = 'top-left',
  className = '',
  color = '#B08D57',
  opacity = 0.5,
}) => {
  // Placement coordinate & rotation transforms
  const positionClasses = {
    'top-left': 'top-0 left-0 -translate-x-[15%] -translate-y-[15%]',
    'top-right': 'top-0 right-0 translate-x-[15%] -translate-y-[15%] rotate-90',
    'bottom-right': 'bottom-0 right-0 translate-x-[15%] translate-y-[15%] rotate-180',
    'bottom-left': 'bottom-0 left-0 -translate-x-[15%] translate-y-[15%] -rotate-90',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }[position];

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none z-0 select-none overflow-visible transition-opacity duration-700 ${positionClasses} ${className}`}
      style={{
        width: 'clamp(280px, 32vw, 540px)',
        height: 'clamp(280px, 32vw, 540px)',
        opacity,
      }}
    >
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full text-[#B08D57]"
        style={{ color }}
      >
        <defs>
          {/* Radial mask for gentle falloff towards corner edges */}
          <radialGradient id="mandala-glow" cx="0%" cy="0%" r="90%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="65%" stopColor="currentColor" stopOpacity="0.85" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* ── CONCENTRIC FRAMEWORK & ASTRONOMICAL RINGS (From origin 0,0) ── */}
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {/* Inner Bindu Nucleus */}
          <circle cx="0" cy="0" r="14" strokeWidth="1.6" />
          <circle cx="0" cy="0" r="8" fill="currentColor" fillOpacity="0.3" strokeWidth="1" />
          <circle cx="0" cy="0" r="28" strokeWidth="1.2" strokeDasharray="2 3" />
          <circle cx="0" cy="0" r="44" strokeWidth="1.4" />
          <circle cx="0" cy="0" r="62" strokeWidth="0.9" />

          {/* Tier 1: 8-Fold Radiating Lotus Petals with Central Striae */}
          {Array.from({ length: 9 }).map((_, i) => {
            const deg = i * 11.25; // 90 degree quadrant / 8 segments
            const rad = (deg * Math.PI) / 180;
            const x1 = Math.cos(rad) * 44;
            const y1 = Math.sin(rad) * 44;
            const x2 = Math.cos(rad) * 92;
            const y2 = Math.sin(rad) * 92;
            const xTip = Math.cos(rad) * 110;
            const yTip = Math.sin(rad) * 110;
            return (
              <g key={`t1-${i}`}>
                {/* Rib line */}
                <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.8" />
                {/* Micro Pearl (Bindu) */}
                <circle cx={xTip} cy={yTip} r="2.2" fill="currentColor" strokeWidth="0.8" />
              </g>
            );
          })}

          {/* Scalloped Lotus Arc Boundary (r=92) */}
          <path
            d="M 92 0 C 92 25 80 50 65 65 C 50 80 25 92 0 92"
            strokeWidth="1.6"
            strokeDasharray="4 2"
          />

          {/* Tier 2: Geometric Diamond Jaali Interlocking Band (r=116 to r=150) */}
          <circle cx="0" cy="0" r="116" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="134" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r="150" strokeWidth="1.4" />

          {/* Diamonds & Chevron Weave in Jaali Band */}
          {Array.from({ length: 16 }).map((_, i) => {
            const deg = i * 5.625;
            const rad = (deg * Math.PI) / 180;
            const xInner = Math.cos(rad) * 116;
            const yInner = Math.sin(rad) * 116;
            const xMid = Math.cos(rad + 0.045) * 134;
            const yMid = Math.sin(rad + 0.045) * 134;
            const xOuter = Math.cos(rad) * 150;
            const yOuter = Math.sin(rad) * 150;
            return (
              <g key={`jaali-${i}`}>
                <line x1={xInner} y1={yInner} x2={xMid} y2={yMid} strokeWidth="0.75" />
                <line x1={xMid} y1={yMid} x2={xOuter} y2={yOuter} strokeWidth="0.75" />
              </g>
            );
          })}

          {/* Tier 3: Kangura Rajput Crenellated Battlement Triangles (r=150 to r=192) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const deg1 = i * 7.5;
            const degMid = deg1 + 3.75;
            const deg2 = deg1 + 7.5;
            const r1 = (deg1 * Math.PI) / 180;
            const rm = (degMid * Math.PI) / 180;
            const r2 = (deg2 * Math.PI) / 180;
            const p1x = Math.cos(r1) * 150;
            const p1y = Math.sin(r1) * 150;
            const pmx = Math.cos(rm) * 192;
            const pmy = Math.sin(rm) * 192;
            const p2x = Math.cos(r2) * 150;
            const p2y = Math.sin(r2) * 150;
            return (
              <g key={`kangura-${i}`}>
                <path d={`M ${p1x} ${p1y} L ${pmx} ${pmy} L ${p2x} ${p2y} Z`} strokeWidth="1.1" fill="none" />
                {/* Center teardrop drop inside triangle */}
                <circle cx={Math.cos(rm) * 170} cy={Math.sin(rm) * 170} r="1.8" fill="currentColor" />
                <circle cx={pmx} cy={pmy} r="2.4" strokeWidth="0.8" fill="#FAF8F3" />
              </g>
            );
          })}

          {/* Outer Register Separation Rings (r=196, r=218) */}
          <circle cx="0" cy="0" r="196" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="218" strokeWidth="1.5" strokeDasharray="5 3" />

          {/* Tier 4: Grand Jharokha Cusped Multi-foil Arches (r=224 to r=300) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const deg1 = i * 11.25;
            const deg2 = deg1 + 11.25;
            const degC = deg1 + 5.625;
            const a1 = (deg1 * Math.PI) / 180;
            const a2 = (deg2 * Math.PI) / 180;
            const ac = (degC * Math.PI) / 180;
            const p1x = Math.cos(a1) * 224;
            const p1y = Math.sin(a1) * 224;
            const p2x = Math.cos(a2) * 224;
            const p2y = Math.sin(a2) * 224;
            const peakX = Math.cos(ac) * 296;
            const peakY = Math.sin(ac) * 296;
            const cusp1X = Math.cos((deg1 + 2.5) * Math.PI / 180) * 260;
            const cusp1Y = Math.sin((deg1 + 2.5) * Math.PI / 180) * 260;
            const cusp2X = Math.cos((deg2 - 2.5) * Math.PI / 180) * 260;
            const cusp2Y = Math.sin((deg2 - 2.5) * Math.PI / 180) * 260;
            return (
              <g key={`jharokha-arch-${i}`}>
                {/* 3-cusp foil profile */}
                <path
                  d={`M ${p1x} ${p1y} Q ${cusp1X} ${cusp1Y} ${Math.cos((deg1 + 3.8) * Math.PI / 180) * 255} ${Math.sin((deg1 + 3.8) * Math.PI / 180) * 255} Q ${Math.cos((deg1 + 4.5) * Math.PI / 180) * 285} ${Math.sin((deg1 + 4.5) * Math.PI / 180) * 285} ${peakX} ${peakY} Q ${Math.cos((deg2 - 4.5) * Math.PI / 180) * 285} ${Math.sin((deg2 - 4.5) * Math.PI / 180) * 285} ${Math.cos((deg2 - 3.8) * Math.PI / 180) * 255} ${Math.sin((deg2 - 3.8) * Math.PI / 180) * 255} Q ${cusp2X} ${cusp2Y} ${p2x} ${p2y}`}
                  strokeWidth="1.4"
                  fill="none"
                />
                {/* Spire apex pearl */}
                <circle cx={Math.cos(ac) * 312} cy={Math.sin(ac) * 312} r="3" strokeWidth="1" fill="#FAF8F3" />
                <line
                  x1={peakX}
                  y1={peakY}
                  x2={Math.cos(ac) * 308}
                  y2={Math.sin(ac) * 308}
                  strokeWidth="1.2"
                />
                {/* Internal stylized lotus palmette petal */}
                <path
                  d={`M ${Math.cos(ac) * 230} ${Math.sin(ac) * 230} Q ${Math.cos(ac - 0.03) * 258} ${Math.sin(ac - 0.03) * 258} ${Math.cos(ac) * 275} ${Math.sin(ac) * 275} Q ${Math.cos(ac + 0.03) * 258} ${Math.sin(ac + 0.03) * 258} ${Math.cos(ac) * 230} ${Math.sin(ac) * 230} Z`}
                  strokeWidth="0.8"
                  fill="none"
                />
              </g>
            );
          })}

          {/* Tier 5: Outer Celestial Rays & Kundan Teardrops (r=320 to r=460) */}
          <circle cx="0" cy="0" r="328" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="350" strokeWidth="0.9" strokeDasharray="3 4" />
          <circle cx="0" cy="0" r="380" strokeWidth="1.5" />

          {/* Radiating fine rays terminating in royal kundan pear-drop pendants */}
          {Array.from({ length: 24 }).map((_, i) => {
            const deg = i * 3.75;
            const a = (deg * Math.PI) / 180;
            const isMajor = i % 2 === 0;
            const rStart = 380;
            const rEnd = isMajor ? 450 : 420;
            const xS = Math.cos(a) * rStart;
            const yS = Math.sin(a) * rStart;
            const xE = Math.cos(a) * rEnd;
            const yE = Math.sin(a) * rEnd;
            return (
              <g key={`ray-${i}`}>
                <line x1={xS} y1={yS} x2={xE} y2={yE} strokeWidth={isMajor ? '1.1' : '0.75'} />
                {isMajor ? (
                  // Kundan teardrop gem
                  <g transform={`translate(${xE}, ${yE}) rotate(${deg + 90})`}>
                    <path
                      d="M 0 -8 C 4 -4 5 1 0 7 C -5 1 -4 -4 0 -8 Z"
                      strokeWidth="0.9"
                      fill="#FAF8F3"
                    />
                    <circle cx="0" cy="1" r="1.5" fill="currentColor" />
                  </g>
                ) : (
                  <circle cx={xE} cy={yE} r="1.6" fill="currentColor" />
                )}
              </g>
            );
          })}

          {/* Outermost Perimeter Scallop Ring */}
          <circle cx="0" cy="0" r="472" strokeWidth="0.9" strokeDasharray="6 4" />
          <circle cx="0" cy="0" r="486" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
};

// ── 2. BESPOKE JHAROKHA ARCHITECTURAL LINE-ART ORNAMENT ──
// Authentic multi-foil cusped arch elevation with curved bangaldar eaves, kalash finial,
// fluted pillars, and geometric jaali balustrade based on Udaipur's City Palace architecture.
export interface JharokhaOrnamentProps {
  className?: string;
  color?: string;
  opacity?: number;
}

export const JharokhaOrnament: React.FC<JharokhaOrnamentProps> = ({
  className = '',
  color = '#B08D57',
  opacity = 0.45,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 380 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full text-[#B08D57]"
        style={{ color }}
      >
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {/* ── TOP CROWNING FINIAL & CHHATRI DOME (y: 20 to 110) ── */}
          {/* Kalash Pinnacle Needle & Amrit Ghata */}
          <line x1="190" y1="16" x2="190" y2="42" strokeWidth="1.8" />
          <circle cx="190" cy="16" r="2.5" fill="currentColor" />
          <path d="M 183 38 C 183 32 197 32 197 38 C 197 45 183 45 183 38 Z" strokeWidth="1.2" fill="#FAF8F3" />
          <circle cx="190" cy="48" r="4.5" strokeWidth="1.2" />
          <ellipse cx="190" cy="56" rx="9" ry="3.5" strokeWidth="1.4" />

          {/* Bangaldar Curved Canopy Eaves (Chhajja) */}
          {/* Top curve */}
          <path
            d="M 68 110 Q 190 62 312 110"
            strokeWidth="2.2"
          />
          {/* Lower overhang shadow curve */}
          <path
            d="M 60 120 Q 190 70 320 120"
            strokeWidth="1.4"
          />
          {/* Eave rib fluting */}
          {[-100, -75, -50, -25, 0, 25, 50, 75, 100].map((offset, i) => {
            const x = 190 + offset;
            const y1 = 110 - Math.cos((offset / 120) * (Math.PI / 2)) * 36;
            const y2 = y1 + 14;
            return <line key={`rib-${i}`} x1={x} y1={y1} x2={x} y2={y2} strokeWidth="0.9" />;
          })}

          {/* Hanging Jhumka Drops Under Eaves */}
          {[75, 115, 155, 190, 225, 265, 305].map((x, i) => (
            <g key={`drop-${i}`}>
              <line x1={x} y1="120" x2={x} y2="132" strokeWidth="1" />
              <circle cx={x} cy="134" r="2.2" fill="currentColor" />
            </g>
          ))}

          {/* ── UPPER ENTABLATURE & MEHRAAB SPANDRELS (y: 138 to 220) ── */}
          <rect x="76" y="136" width="228" height="12" rx="2" strokeWidth="1.4" />
          <line x1="84" y1="142" x2="296" y2="142" strokeWidth="0.8" strokeDasharray="3 3" />

          {/* Outer rectangular arch frame */}
          <rect x="76" y="148" width="228" height="270" strokeWidth="1.6" />
          <rect x="84" y="156" width="212" height="254" strokeWidth="0.9" strokeDasharray="4 2" />

          {/* Symmetrical Arabesque Tracery (Corner Spandrels) */}
          {/* Left Spandrel */}
          <path
            d="M 94 166 Q 115 170 126 185 Q 118 200 100 195 M 115 174 Q 135 175 140 195"
            strokeWidth="0.85"
            fill="none"
          />
          <circle cx="106" cy="180" r="2" fill="currentColor" />
          <circle cx="132" cy="186" r="2" fill="currentColor" />

          {/* Right Spandrel */}
          <path
            d="M 286 166 Q 265 170 254 185 Q 262 200 280 195 M 265 174 Q 245 175 240 195"
            strokeWidth="0.85"
            fill="none"
          />
          <circle cx="274" cy="180" r="2" fill="currentColor" />
          <circle cx="248" cy="186" r="2" fill="currentColor" />

          {/* ── 9-CUSPED RAJASTHANI MULTI-FOIL ARCHWAY (y: 200 to 418) ── */}
          {/* Outer Cusped Arch Contour */}
          <path
            d="M 112 410 V 300 
               C 112 284 124 278 128 266 
               C 134 252 144 248 152 238 
               C 160 228 172 222 178 210 
               C 184 198 188 190 190 184 
               C 192 190 196 198 202 210 
               C 208 222 220 228 228 238 
               C 236 248 246 252 252 266 
               C 256 278 268 284 268 300 
               V 410"
            strokeWidth="2"
          />

          {/* Inner Parallel Contour for Deep Moulding Effect */}
          <path
            d="M 120 410 V 304 
               C 120 292 130 285 134 275 
               C 140 263 150 259 157 250 
               C 164 241 176 235 181 224 
               C 186 213 189 204 190 196 
               C 191 204 194 213 199 224 
               C 204 235 216 241 223 250 
               C 230 259 240 263 246 275 
               C 250 285 260 292 260 304 
               V 410"
            strokeWidth="1"
            strokeDasharray="3 2"
          />

          {/* Apex Lotus Pendant Hanging in Center */}
          <line x1="190" y1="184" x2="190" y2="236" strokeWidth="1" />
          <circle cx="190" cy="240" r="3.5" fill="#FAF8F3" strokeWidth="1.2" />
          <path d="M 186 244 L 190 252 L 194 244 Z" fill="currentColor" strokeWidth="0.8" />

          {/* Small Lotus Bud Cusps */}
          {[[128, 266], [152, 238], [178, 210], [202, 210], [228, 238], [252, 266]].map(([cx, cy], i) => (
            <circle key={`cusp-bud-${i}`} cx={cx} cy={cy} r="2.2" fill="currentColor" />
          ))}

          {/* ── PAIRED FLUTED COLUMNS WITH LOTUS CAPITALS ── */}
          {/* Left Column */}
          <g>
            {/* Capital */}
            <path d="M 98 296 L 126 296 L 122 310 L 102 310 Z" strokeWidth="1.2" fill="#FAF8F3" />
            <circle cx="112" cy="303" r="2" fill="currentColor" />
            {/* Fluted Shaft */}
            <line x1="102" y1="310" x2="102" y2="410" strokeWidth="1.4" />
            <line x1="107" y1="310" x2="107" y2="410" strokeWidth="0.8" />
            <line x1="112" y1="310" x2="112" y2="410" strokeWidth="0.8" />
            <line x1="117" y1="310" x2="117" y2="410" strokeWidth="0.8" />
            <line x1="122" y1="310" x2="122" y2="410" strokeWidth="1.4" />
            {/* Base Plinth */}
            <rect x="98" y="410" width="26" height="12" rx="1.5" strokeWidth="1.2" />
          </g>

          {/* Right Column */}
          <g>
            {/* Capital */}
            <path d="M 254 296 L 282 296 L 278 310 L 258 310 Z" strokeWidth="1.2" fill="#FAF8F3" />
            <circle cx="268" cy="303" r="2" fill="currentColor" />
            {/* Fluted Shaft */}
            <line x1="258" y1="310" x2="258" y2="410" strokeWidth="1.4" />
            <line x1="263" y1="310" x2="263" y2="410" strokeWidth="0.8" />
            <line x1="268" y1="310" x2="268" y2="410" strokeWidth="0.8" />
            <line x1="273" y1="310" x2="273" y2="410" strokeWidth="0.8" />
            <line x1="278" y1="310" x2="278" y2="410" strokeWidth="1.4" />
            {/* Base Plinth */}
            <rect x="254" y="410" width="26" height="12" rx="1.5" strokeWidth="1.2" />
          </g>

          {/* ── PROJECTING BALCONY PARAPET & GEOMETRIC JAALI (y: 422 to 500) ── */}
          {/* Main Balustrade Rail */}
          <rect x="68" y="422" width="244" height="14" rx="2" strokeWidth="1.6" />
          <line x1="74" y1="429" x2="306" y2="429" strokeWidth="0.8" strokeDasharray="3 3" />

          {/* Pierced Geometric Jaali Lattice Box */}
          <rect x="74" y="436" width="232" height="64" strokeWidth="1.4" />

          {/* Authentic Hexagonal & Star Jaali Weave */}
          {Array.from({ length: 9 }).map((_, col) => {
            const x = 86 + col * 24;
            return (
              <g key={`jaali-col-${col}`}>
                <line x1={x} y1="436" x2={x} y2="500" strokeWidth="0.8" strokeDasharray="2 3" />
                <polygon
                  points={`${x},446 ${x + 6},452 ${x + 6},464 ${x},470 ${x - 6},464 ${x - 6},452`}
                  strokeWidth="0.8"
                  fill="none"
                />
                <polygon
                  points={`${x},472 ${x + 6},478 ${x + 6},490 ${x},496 ${x - 6},490 ${x - 6},478`}
                  strokeWidth="0.8"
                  fill="none"
                />
                <circle cx={x} cy="458" r="1.5" fill="currentColor" />
                <circle cx={x} cy="484" r="1.5" fill="currentColor" />
              </g>
            );
          })}

          <rect x="68" y="500" width="244" height="12" rx="2" strokeWidth="1.6" />

          {/* ── CORBELLED STONE BRACKETS (TODAS / MAKARA CORBELS) (y: 512 to 610) ── */}
          {/* Left Corbel Bracket */}
          <path
            d="M 94 512 
               C 94 535 80 550 84 570 
               C 88 586 102 596 112 605 
               L 118 605 
               C 118 575 128 555 128 512 Z"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="106" cy="558" r="2.5" fill="currentColor" />

          {/* Center Cantilever Console */}
          <path
            d="M 172 512 
               C 172 540 180 565 190 590 
               C 200 565 208 540 208 512 Z"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="190" cy="546" r="3" fill="#FAF8F3" strokeWidth="1" />
          <circle cx="190" cy="546" r="1.2" fill="currentColor" />

          {/* Bottom Drop Pendant Finial */}
          <path d="M 186 592 L 190 608 L 194 592 Z" fill="currentColor" strokeWidth="1" />
          <circle cx="190" cy="612" r="2" fill="currentColor" />

          {/* Right Corbel Bracket */}
          <path
            d="M 286 512 
               C 286 535 300 550 296 570 
               C 292 586 278 596 268 605 
               L 262 605 
               C 262 575 252 555 252 512 Z"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="274" cy="558" r="2.5" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
};

// ── 3. SYMMETRICAL FLORAL JAALI ORNAMENTAL SECTION DIVIDER ──
// High-precision horizontal divider with central 8-petal royal lotus,
// symmetrical Rajput arabesque vines (bel-boota), and tapering rules.
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
          {/* ── LEFT TAPERED RULE ── */}
          <line x1="20" y1="32" x2="260" y2="32" strokeWidth="1.2" />
          <line x1="60" y1="28" x2="230" y2="28" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="20" cy="32" r="2.5" fill="currentColor" />
          <polygon points="120,32 125,28 130,32 125,36" fill="currentColor" />
          <polygon points="210,32 215,28 220,32 215,36" fill="currentColor" />

          {/* ── LEFT ARABESQUE VINE & FLORAL SCROLL ── */}
          <path
            d="M 260 32 
               C 285 32 300 20 318 20 
               C 334 20 345 30 354 32
               C 342 36 330 46 314 46
               C 298 46 280 34 260 32 Z"
            strokeWidth="1.1"
            fill="none"
          />
          {/* Lotus bud drop on left */}
          <circle cx="318" cy="20" r="2.8" fill="#FAF8F3" strokeWidth="1" />
          <circle cx="318" cy="20" r="1.2" fill="currentColor" />
          <circle cx="314" cy="46" r="2.8" fill="#FAF8F3" strokeWidth="1" />
          <circle cx="314" cy="46" r="1.2" fill="currentColor" />

          {/* Left inner tendril */}
          <path
            d="M 334 32 C 348 24 366 26 376 32"
            strokeWidth="1.2"
          />
          <circle cx="376" cy="32" r="2" fill="currentColor" />

          {/* ── CENTER ROYAL LOTUS MEDALLION (x: 376 to 424) ── */}
          {/* Diamond Cartouche */}
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

          {/* Central 8-Petal Royal Lotus */}
          <circle cx="400" cy="32" r="5" fill="currentColor" />
          <circle cx="400" cy="32" r="10" strokeWidth="1" />
          {/* 8 Cardinal & Diagonal Lotus Petals */}
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
          {/* Cartouche Corner Bindus */}
          <circle cx="400" cy="8" r="2.2" fill="currentColor" />
          <circle cx="400" cy="56" r="2.2" fill="currentColor" />

          {/* ── RIGHT ARABESQUE VINE & FLORAL SCROLL ── */}
          <path
            d="M 424 32 C 434 26 452 24 466 32"
            strokeWidth="1.2"
          />
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

          {/* ── RIGHT TAPERED RULE ── */}
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

// ── 4. JHAROKHA ARCH PROFILE FRAME ──
// Seamless SVG arch silhouette for framing imagery with authentic Rajput multi-foil cusping.
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
          <circle cx="18" cy="2" r="2" fill="#173B35" />
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
