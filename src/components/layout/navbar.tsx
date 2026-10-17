'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield } from 'lucide-react';
import { IconPalaceCrest } from '@/components/ui/heritage-art';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Rooms', href: '/rooms' },
    { label: 'Restaurant', href: '/restaurant' },
    { label: 'Café', href: '/cafe' },
    { label: 'Party Hall', href: '/hall' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-[#13251E] border-b border-[#B08D57]/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Arch Crest matching image */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-md border border-[#B08D57]/60 flex items-center justify-center bg-[#1B362B] group-hover:scale-105 transition-transform shadow-inner">
              <IconPalaceCrest className="w-7 h-7 text-[#C9A96E]" />
            </div>
            <div>
              <span className="font-heritage text-xl sm:text-2xl font-bold tracking-widest text-[#FAF8F3] uppercase block leading-none">
                RAJMAHAL
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-[#C9A96E] font-medium uppercase block mt-1">
                Heritage Hotel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm tracking-wide font-normal transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#C9A96E] font-medium after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#C9A96E]'
                      : 'text-[#E0DCD3] hover:text-[#C9A96E]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Book Now Button matching image */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-xs text-[#A89E90] hover:text-[#C9A96E] flex items-center transition-colors"
            >
              <Shield className="w-3.5 h-3.5 mr-1 text-[#B08D57]" /> Staff
            </Link>
            <Link
              href="/book"
              className="px-5 py-2 rounded-md bg-[#C59B63] hover:bg-[#B88E55] text-[#13251E] font-medium text-sm tracking-wide transition-all shadow hover:shadow-md active:scale-95"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <Link
              href="/book"
              className="px-3.5 py-1.5 rounded-md bg-[#C59B63] text-[#13251E] font-medium text-xs tracking-wide shadow"
            >
              Book Now
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#FAF8F3] hover:text-[#C9A96E] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#182F26] border-b border-[#B08D57]/40 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base text-[#FAF8F3] hover:text-[#C9A96E] hover:bg-[#13251E]/80"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#B08D57]/20 flex items-center justify-between">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-[#A89E90] hover:text-[#C9A96E] flex items-center py-2"
            >
              <Shield className="w-3.5 h-3.5 mr-1 text-[#B08D57]" /> Staff Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
