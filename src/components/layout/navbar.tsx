'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  ArrowRight,
  User as UserIcon,
  LogOut,
  Sparkles,
  BedDouble,
  UtensilsCrossed,
  ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

function PalaceMark() {
  return (
    <svg
      className="palace-mark w-9 h-10 sm:w-10 sm:h-11 shrink-0"
      viewBox="0 0 52 58"
      aria-hidden="true"
      fill="none"
      stroke="#D8AA67"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 53V24L26 5l21 19v29" />
      <path d="M11 53V27L26 13l15 14v26M17 53V30l9-9 9 9v23" />
      <path d="M22 53V36c0-4 1.8-6.7 4-8.8 2.2 2.1 4 4.8 4 8.8v17M2 53h48" />
      <path d="M9 22 26 7l17 15M13 20 26 9l13 11" />
    </svg>
  );
}

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'Eng' | 'हिन्दी'>('Eng');
  const [user, setUser] = useState<User | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Subscribe to auth state
  useEffect(() => {
    const supabase = createClient();

    // Initial check
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    // Listen for realtime auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check if authenticated user is registered staff
  useEffect(() => {
    if (!user || !user.email) {
      setIsStaff(false);
      return;
    }

    const verifyStaffRole = async () => {
      const metaRole = (user.user_metadata?.role || '').toLowerCase();
      const metaIsStaff = Boolean(user.user_metadata?.is_staff);
      const staffRoles = [
        'admin',
        'administrator',
        'manager',
        'receptionist',
        'kitchen',
        'waiter',
        'housekeeping',
        'accountant',
        'staff',
      ];

      if (metaIsStaff || staffRoles.includes(metaRole)) {
        setIsStaff(true);
      }

      try {
        const res = await fetch(`/api/staff/check?email=${encodeURIComponent(user.email!)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.isStaff) {
            setIsStaff(true);
          } else if (!metaIsStaff && !staffRoles.includes(metaRole)) {
            setIsStaff(false);
          }
        }
      } catch {
        // Fallback to metadata check
      }
    };

    verifyStaffRole();
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  // Hide public header on dashboard and dedicated auth pages
  if (
    pathname.startsWith('/dashboard') ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/auth')
  ) {
    return null;
  }

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfileOpen(false);
    setMobileMenuOpen(false);
    router.refresh();
    router.push('/');
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Royal Guest';
  const initial = displayName.charAt(0).toUpperCase();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Hotel', href: '/hotel' },
    { label: 'Restaurants', href: '/restaurant' },
    { label: 'Café', href: '/cafe' },
    { label: 'Party Hall', href: '/hotel#party-hall-enquiry' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full h-[80px] sm:h-[86px] px-4 sm:px-8 md:px-12 lg:px-16 shadow-2xl transition-all flex items-center"
      style={{
        backgroundColor: 'var(--forest-deep, #4f0809)',
        boxShadow: '0 4px 24px rgba(40, 5, 6, 0.4)',
        borderBottom: '1px solid rgba(216, 170, 103, 0.25)',
      }}
    >
      <div className="w-full flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center space-x-3 sm:space-x-4 group shrink-0">
          <PalaceMark />
          <div className="flex flex-col text-left">
            <span
              className="text-xl sm:text-2xl font-bold tracking-[0.11em] uppercase leading-none"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                color: 'var(--gold-bright, #e1b46f)',
              }}
            >
              Rajmahal
            </span>
            <span
              className="text-[8px] sm:text-[9px] font-semibold tracking-[0.34em] uppercase mt-1"
              style={{ color: 'var(--gold-bright, #e1b46f)' }}
            >
              Heritage Hotel.
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-7 xl:space-x-8">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[13px] font-medium tracking-wide transition-all relative py-2 ${
                  isActive
                    ? 'text-[#FFF8EB] font-semibold'
                    : 'text-[#FFF8EB]/80 hover:text-[#D8AA67]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                    style={{ backgroundColor: 'var(--antique-gold, #d8aa67)' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Language + Staff Admin Badge + Auth State Button */}
        <div className="hidden sm:flex items-center space-x-4 md:space-x-5 shrink-0">
          {/* Language selector toggle */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'Eng' ? 'हिन्दी' : 'Eng')}
            className="flex items-center space-x-1.5 text-xs text-[#FFF8EB]/90 hover:text-[#D8AA67] cursor-pointer transition-colors py-1 focus:outline-none"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#D8AA67]" />
            <span className="font-medium">{language}</span>
            <ChevronDown className="w-3 h-3 text-[#FFF8EB]/60" />
          </button>

          {/* ADMIN PANEL LOGO BUTTON - SHOWN STRICTLY AFTER LOGIN FOR REGISTERED STAFF */}
          {user && isStaff && (
            <Link
              href="/dashboard"
              id="navbar-admin-panel-btn"
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D8AA67] via-[#E1B46F] to-[#B78A48] text-[#380506] font-bold text-xs tracking-wide shadow-[0_2px_14px_rgba(216,170,103,0.45)] hover:shadow-[0_4px_20px_rgba(216,170,103,0.65)] hover:scale-105 active:scale-95 transition-all duration-200 border border-[#FFF8EB]/60 group"
              title="Access Hotel & Outlets Admin Panel"
            >
              <div className="w-5 h-5 rounded-full bg-[#4F0809] text-[#D8AA67] flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="tracking-wider uppercase text-[11px] font-bold whitespace-nowrap">
                Admin Panel
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#380506] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          {/* Conditional Auth Rendering: Profile Dropdown or Sign Up / Login */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-[#3d0607]/80 hover:bg-[#380506] border border-[#D8AA67]/40 hover:border-[#D8AA67] transition-all cursor-pointer focus:outline-none group shadow-md"
                aria-label="User profile menu"
                aria-expanded={profileOpen}
              >
                {/* Monogram Avatar */}
                <div className="w-8 h-8 rounded-full bg-[#D8AA67] text-[#380506] font-bold text-xs flex items-center justify-center shadow-inner ring-1 ring-[#FFF8EB]/30">
                  {initial}
                </div>
                <div className="flex flex-col text-left pr-1">
                  <span className="text-[12px] font-medium text-[#FFF8EB] leading-tight max-w-[110px] truncate">
                    {displayName}
                  </span>
                  <span className="text-[9px] text-[#D8AA67] leading-none uppercase tracking-wider flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-[#D8AA67]" />
                    {isStaff ? 'Staff' : 'Profile'}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#D8AA67] transition-transform duration-200 ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FFFBF4] rounded-2xl shadow-[0_12px_40px_rgba(20,5,5,0.35)] border border-[#E8DFCE] py-2 z-50 animate-fade-in-up divide-y divide-[#EFE7D8]">
                  {/* Guest Header */}
                  <div className="px-4 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-[#9C7A45] font-semibold">
                      {isStaff ? 'Rajmahal Staff Member' : 'Rajmahal Guest'}
                    </p>
                    <p className="text-sm font-bold text-[#380506] truncate mt-0.5">
                      {displayName}
                    </p>
                    <p className="text-xs text-[#6B5E51] truncate mt-0.5">
                      {user.email || 'Verified User'}
                    </p>
                  </div>

                  {/* Staff Admin Panel Quick Link */}
                  {isStaff && (
                    <div className="p-2 bg-gradient-to-r from-[#4F0809]/10 via-[#D8AA67]/15 to-[#4F0809]/10">
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#4F0809] text-[#D8AA67] hover:bg-[#680b0c] font-semibold text-xs transition shadow-sm group"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#D8AA67]" />
                          <span>Enter Admin Panel</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  )}

                  {/* Menu Links */}
                  <div className="py-1.5 text-xs">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-[#380506] hover:bg-[#F5EFE6] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#D8AA67]" />
                      <span className="font-medium">My Profile &amp; Account</span>
                    </Link>

                    <Link
                      href="/rooms"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-[#380506] hover:bg-[#F5EFE6] transition-colors"
                    >
                      <BedDouble className="w-4 h-4 text-[#D8AA67]" />
                      <span className="font-medium">Book a Suite</span>
                    </Link>

                    <Link
                      href="/cafe"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-[#380506] hover:bg-[#F5EFE6] transition-colors"
                    >
                      <UtensilsCrossed className="w-4 h-4 text-[#D8AA67]" />
                      <span className="font-medium">Dining &amp; Table Booking</span>
                    </Link>
                  </div>

                  {/* Sign Out Action */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-xs font-semibold text-red-700 hover:bg-red-50/80 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-[6px] text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              style={{
                backgroundColor: 'var(--antique-gold, #d8aa67)',
                color: 'var(--forest-ink, #380506)',
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                fontSize: '15px',
              }}
            >
              <span>Sign Up / Login</span>
              <ArrowRight className="w-4 h-4 ml-1 stroke-[1.75]" />
            </Link>
          )}
        </div>

        {/* Mobile menu button & quick profile */}
        <div className="flex sm:hidden items-center space-x-2">
          {user && isStaff && (
            <Link
              href="/dashboard"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#D8AA67] to-[#B78A48] text-[#380506] text-xs font-bold shadow-md active:scale-95 transition"
              title="Admin Panel"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold">Admin</span>
            </Link>
          )}

          {user ? (
            <Link
              href="/profile"
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#3d0607] border border-[#D8AA67]/40 text-[#FFF8EB] text-xs font-medium"
            >
              <div className="w-5 h-5 rounded-full bg-[#D8AA67] text-[#380506] font-bold text-[10px] flex items-center justify-center">
                {initial}
              </div>
              <span className="text-[11px] text-[#D8AA67] font-semibold">Profile</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-[5px] text-xs font-semibold tracking-wide shadow"
              style={{
                backgroundColor: 'var(--antique-gold, #d8aa67)',
                color: 'var(--forest-ink, #380506)',
              }}
            >
              Login
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-[#FFF8EB] hover:text-[#D8AA67] focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="absolute top-full left-0 right-0 w-full p-4 sm:hidden shadow-2xl border-b transition-all z-50 animate-fade-in-up"
          style={{
            backgroundColor: 'var(--forest-deep, #4f0809)',
            borderColor: 'rgba(216, 170, 103, 0.4)',
          }}
        >
          {user && isStaff && (
            <div className="mb-3 px-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#D8AA67] via-[#E1B46F] to-[#B78A48] text-[#380506] font-bold text-xs shadow-md transition group"
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#380506]" />
                  <span className="uppercase tracking-wider">Access Admin Panel</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

          {user && (
            <div className="mb-3 pb-3 border-b border-[#D8AA67]/25 flex items-center justify-between px-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#D8AA67] text-[#380506] font-bold text-xs flex items-center justify-center">
                  {initial}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#FFF8EB] leading-tight">{displayName}</p>
                  <p className="text-[10px] text-[#D8AA67]">{user.email}</p>
                </div>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-[#D8AA67] underline font-semibold"
              >
                View
              </Link>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm text-[#FFF8EB] hover:bg-[#680b0c] hover:text-[#D8AA67] font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-[#D8AA67]/20 flex items-center justify-between text-xs px-2">
            <button
              onClick={() => setLanguage(language === 'Eng' ? 'हिन्दी' : 'Eng')}
              className="flex items-center space-x-1.5 text-[#FFF8EB]/90 py-1"
            >
              <Globe className="w-3.5 h-3.5 text-[#D8AA67]" />
              <span>Language: {language}</span>
            </button>
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="text-red-300 hover:text-red-200 font-semibold flex items-center py-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#D8AA67] font-semibold flex items-center py-1"
              >
                <span>Sign Up / Login</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
