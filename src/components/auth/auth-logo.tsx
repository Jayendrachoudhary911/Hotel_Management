import React from 'react';
import Link from 'next/link';

export const AuthLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Link href="/" className={`flex flex-col items-center group cursor-pointer select-none ${className}`}>
      {/* Golden Three-Tiered Rajput Jharokha Gateway */}
      <div className="relative mb-2 transition-transform duration-300 group-hover:scale-105">
        <svg
          className="w-11 h-13 sm:w-12 sm:h-14 text-[#B89047]"
          viewBox="0 0 52 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Top Kalash Finial */}
          <circle cx="26" cy="3" r="1.8" fill="currentColor" />
          <path d="M26 3 V7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M22 7 Q26 5 30 7" stroke="currentColor" strokeWidth="1.2" />

          {/* Tier 1: Outer Rajputana Cusped Arch */}
          <path
            d="M 6 56 V 30 C 6 16 16 7 26 7 C 36 7 46 16 46 30 V 56"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Tier 2: Layered Scalloped Arches */}
          <path
            d="M 11 56 V 32 C 11 26 15 22 19 18 C 23 14 26 10 26 10 C 26 10 29 14 33 18 C 37 22 41 26 41 32 V 56"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Tier 3: Inner Sanctum Arch */}
          <path
            d="M 16 56 V 36 C 16 32 20 28 26 21 C 32 28 36 32 36 36 V 56"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Innermost Doorway Arch */}
          <path
            d="M 21 56 V 42 C 21 39 23 37 26 33 C 29 37 31 39 31 42 V 56"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* Base Plinth Steps */}
          <line x1="3" y1="56" x2="49" y2="56" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="6" y1="59" x2="46" y2="59" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />

          {/* Transom horizontal bar */}
          <line x1="11" y1="35" x2="41" y2="35" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col items-center text-center">
        <span
          className="text-[21px] sm:text-[23px] font-bold tracking-[0.24em] uppercase leading-none"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#0B3830',
          }}
        >
          Rajmahal
        </span>
        <span
          className="text-[9px] sm:text-[9.5px] font-semibold tracking-[0.32em] uppercase mt-1"
          style={{ color: '#0B3830' }}
        >
          Heritage Hotel
        </span>

        {/* Small Delicate Gold Filigree Divider */}
        <div className="flex items-center space-x-2 mt-1.5 opacity-90">
          <div className="w-5 h-[0.75px] bg-[#B89047]" />
          <svg className="w-3.5 h-3 text-[#B89047]" viewBox="0 0 16 12" fill="currentColor">
            <path d="M8 0 C6.5 2.5 4 4 1 5 C4 6 6.5 7.5 8 10 C9.5 7.5 12 6 15 5 C12 4 9.5 2.5 8 0 Z" />
            <circle cx="8" cy="5" r="1.2" fill="#0B3830" />
          </svg>
          <div className="w-5 h-[0.75px] bg-[#B89047]" />
        </div>
      </div>
    </Link>
  );
};
