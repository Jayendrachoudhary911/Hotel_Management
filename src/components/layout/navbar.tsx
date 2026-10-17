'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles, Utensils, BedDouble, Calendar, Coffee, Shield, Phone, MapPin } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Suites & Villas', href: '/rooms', icon: BedDouble },
    { label: 'Royal Dining', href: '/restaurant', icon: Utensils },
    { label: 'Courtyard Cafe', href: '/cafe', icon: Coffee },
    { label: 'Crystal Ballroom', href: '/hall', icon: Sparkles },
    { label: 'Order Food', href: '/order/pickup', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all shadow-sm">
      {/* Top Heritage Utility Bar */}
      <div className="bg-[#670E10] text-[#FAF8F3] px-4 py-1.5 text-xs border-b border-[#B08D57]/30 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-[#EBE5D6]">
              <MapPin className="w-3.5 h-3.5 text-[#B08D57] mr-1.5" />
              Heritage Enclave, Near Lake Pichola, Udaipur, Rajasthan
            </span>
            <span className="flex items-center text-[#EBE5D6]">
              <Phone className="w-3.5 h-3.5 text-[#B08D57] mr-1.5" />
              +91 294 288 9000
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[#C9A96E] font-medium tracking-wide">
              ✦ Royal Rajputana Hospitality
            </span>
            <Link
              href="/dashboard"
              className="text-[#FAF8F3] hover:text-[#C9A96E] font-medium flex items-center transition-colors text-xs"
            >
              <Shield className="w-3 h-3 mr-1 text-[#B08D57]" /> Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#D4CBBB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo with Heritage Crest */}
            <Link href="/" className="flex items-center space-x-3.5 group">
              <div className="w-11 h-11 rounded-lg bg-[#670E10] border border-[#B08D57] p-0.5 flex items-center justify-center shadow-md shadow-[#670E10]/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full border border-[#B08D57]/40 rounded-md flex items-center justify-center bg-[#4A0A0C]">
                  <Sparkles className="w-5 h-5 text-[#B08D57]" />
                </div>
              </div>
              <div>
                <span className="font-heritage text-xl sm:text-2xl font-bold tracking-wider text-[#670E10]">
                  AURA GRAND
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-[#6B6155] font-semibold uppercase">
                  Heritage Resort & Palace • Udaipur
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? 'text-[#670E10] bg-[#670E10]/10 font-semibold border-b-2 border-[#670E10]'
                        : 'text-[#241F1A] hover:text-[#670E10] hover:bg-[#EBE5D6]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Book Now & Staff */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link href="/rooms">
                <Button size="sm" variant="primary">
                  Book a Stay
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <Link href="/rooms">
                <Button size="sm" className="text-xs px-3 py-1.5">
                  Book
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#241F1A] hover:text-[#670E10] hover:bg-[#EBE5D6]"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#D4CBBB] bg-[#FAF8F3] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#670E10] text-white'
                      : 'text-[#241F1A] hover:bg-[#EBE5D6] hover:text-[#670E10]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#B08D57]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-[#D4CBBB] flex flex-col space-y-2">
              <Link href="/rooms" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Reserve Room / Suite</Button>
              </Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  <Shield className="w-4 h-4 mr-1.5" /> Staff Portal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
