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
  Calendar,
  PhoneCall,
  Home as HomeIcon,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

function PalaceMark() {
  return (
<svg
  className="palace-mark w-5 h-5 sm:w-6 sm:h-6 shrink-0"
  viewBox="0 0 52 58"
  aria-hidden="true"
  fill="none"
  stroke="#D8AA67"
  strokeWidth="1.75"
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

export interface NavbarProps {
  isScrolled?: boolean;
  className?: string;
}

interface DropdownItem {
  label: string;
  href: string;
  desc?: string;
}

interface NavLinkItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  isScrolled: propIsScrolled,
  className = '',
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [internalScrolled, setInternalScrolled] = useState(false);
  const isScrolled = propIsScrolled !== undefined ? propIsScrolled : internalScrolled;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'Eng' | 'हिन्दी'>('Eng');
  const [user, setUser] = useState<User | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Window scroll event listener to track scrolled status
  useEffect(() => {
    if (propIsScrolled !== undefined) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setInternalScrolled(scrollY > 15);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [propIsScrolled]);

  // Subscribe to auth state
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (!data.user) {
        setIsStaff(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsStaff(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check if authenticated user is registered staff
  useEffect(() => {
    if (!user || !user.email) {
      return;
    }

    let isMounted = true;
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
        if (isMounted) setIsStaff(true);
      }

      try {
        const res = await fetch(`/api/staff/check?email=${encodeURIComponent(user.email!)}`);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.isStaff) {
            setIsStaff(true);
          } else if (!metaIsStaff && !staffRoles.includes(metaRole)) {
            setIsStaff(false);
          }
        }
      } catch {
        // Fallback to metadata
      }
    };

    verifyStaffRole();
    return () => {
      isMounted = false;
    };
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

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  const navLinks: NavLinkItem[] = [
    { label: 'HOME', href: '/' },
    {
      label: 'HOTEL',
      href: '/hotel',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Rooms & Chambers', href: '/rooms', desc: 'Luxury heritage suites with lake views' },
        { label: 'Party Hall (25–50 Pax)', href: '/hotel#party-hall-enquiry', desc: 'Royal banquet, gatherings & celebrations' },
        { label: 'Heritage & Palace Grounds', href: '/hotel', desc: 'Architecture, royal courtyards & history' },
      ],
    },
    {
      label: 'RESTAURANT & CAFÉ',
      href: '/restaurant',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Royal Dining Courtyard', href: '/restaurant', desc: 'Authentic Rajasthani fine dining' },
        { label: 'Jharokha Café & Lounge', href: '/restaurant#cafe', desc: 'Artisanal coffee, tea & lake sunset' },
        { label: 'Palace Menu & Thali', href: '/menu', desc: 'Curated royal culinary delicacies' },
        { label: 'Reserve A Table', href: '/restaurant#reserve', desc: 'Book your private dining experience' },
      ],
    },
    { label: 'MENU', href: '/menu' },
    { label: 'CONTACT', href: '/#contact' },
  ];

  return (
    <>
      <header
        data-scrolled={isScrolled}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out flex items-center ${
          isScrolled
            ? 'h-[66px] sm:h-[70px] bg-[#0A0203]/00'
            : 'h-[72px] sm:h-[78px] bg-[#0E0304]/00'
        } px-3.5 sm:px-6 lg:px-8 xl:px-10 ${className}`}
      >
        <div className="w-full max-w-8xl mx-auto flex items-center justify-between">
          {/* ── 1. Left: Brand Capsule Pill (Matches reference [BunkMates] capsule) ── */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D8AA67]/60 backdrop-blur-md transition-all shadow-sm group shrink-0 active:scale-95"
          >
            <PalaceMark />
            <div className="flex flex-col text-left">
              <span
                className="font-bold tracking-[0.01em] uppercase text-xs sm:text-base text-[#FFF8EB] group-hover:text-[#D8AA67] transition-colors leading-none"
                style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
              >
                Rajmahal
              </span>
              <span className="text-[5.5px] sm:text-[8px] font-semibold tracking-[0.28em] uppercase text-[#D8AA67] leading-none mt-0.5">
                Heritage Hotel
              </span>
            </div>
          </Link>

          {/* ── 2. Center: Nav Island Capsule (Matches reference pill island with [HOME] active pill) ── */}
          <nav className="hidden lg:inline-flex items-center p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner space-x-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname.startsWith(link.href + '/');

              return (
                <div key={link.label} className="relative group">
                  <Link
                    href={link.href}
                    className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white/15 text-[#FFF8EB] shadow-xs ring-1 ring-white/15'
                        : 'text-[#FFF8EB]/75 hover:text-[#FFF8EB] hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown && (
                      <ChevronDown className="w-3 h-3 text-[#FFF8EB]/60 group-hover:text-[#D8AA67] transition-transform group-hover:rotate-180 duration-200 ml-0.5" />
                    )}
                  </Link>

                  {/* Dropdown Menu on Hover */}
                  {link.hasDropdown && link.dropdownItems && (
                    <div className="absolute top-full left-0 mt-2.5 w-64 rounded-2xl bg-[#140304]/98 backdrop-blur-md border border-[#D8AA67]/30 shadow-[0_16px_40px_rgba(0,0,0,0.6)] p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex flex-col p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors group/item"
                        >
                          <span className="text-xs font-bold text-[#FFF8EB] group-hover/item:text-[#D8AA67] transition-colors flex items-center justify-between">
                            <span>{item.label}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all text-[#D8AA67]" />
                          </span>
                          {item.desc && (
                            <span className="text-[10px] text-[#C5B8A5]/80 mt-0.5 line-clamp-1">
                              {item.desc}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── 3. Right: Desktop Action Pills (Matches reference [DOWNLOAD APP] & [SIGN IN]) ── */}
          <div className="hidden sm:flex items-center space-x-2.5 md:space-x-3 shrink-0">
            {/* Primary Accent CTA Pill: Book A Stay */}
            <Link
              href="/rooms"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#D8AA67] via-[#E1B46F] to-[#C89B55] hover:brightness-110 text-[#2B0507] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <BedDouble className="w-3.5 h-3.5 text-[#2B0507]" />
              <span>Book A Stay</span>
            </Link>

            {/* Language Selector Pill */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'Eng' ? 'हिन्दी' : 'Eng')}
              className="hidden xl:inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#FFF8EB]/80 hover:text-[#D8AA67] transition cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3 h-3 text-[#D8AA67]" />
              <span>{language}</span>
            </button>

            {/* Staff Admin Panel Badge Button */}
            {user && isStaff && (
              <Link
                href="/dashboard"
                id="navbar-admin-panel-btn"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D8AA67] to-[#B78A48] text-[#2B0507] font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition shrink-0"
                title="Enter Staff Admin Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#2B0507]" />
                <span>Admin</span>
              </Link>
            )}

            {/* Secondary Capsule Pill: Sign In / Profile */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#D8AA67]/60 text-xs font-bold uppercase tracking-wider text-[#FFF8EB] transition cursor-pointer"
                  aria-label="User profile menu"
                  aria-expanded={profileOpen}
                >
                  <div className="w-5 h-5 rounded-full bg-[#D8AA67] text-[#2B0507] font-bold text-[10px] flex items-center justify-center">
                    {initial}
                  </div>
                  <span className="max-w-[85px] truncate text-[11px] font-medium text-[#FFF8EB] capitalize">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-[#D8AA67] transition-transform duration-200 ${
                      profileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#FFFBF4] rounded-2xl shadow-[0_12px_40px_rgba(20,5,5,0.35)] border border-[#E8DFCE] py-2 z-50 animate-fade-in-up divide-y divide-[#EFE7D8]">
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
                        href="/restaurant"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-[#380506] hover:bg-[#F5EFE6] transition-colors"
                      >
                        <UtensilsCrossed className="w-4 h-4 text-[#D8AA67]" />
                        <span className="font-medium">Dining &amp; Table Booking</span>
                      </Link>
                    </div>

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
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[#FFF8EB] font-bold text-xs uppercase tracking-wider transition-all hover:border-[#D8AA67]/60 active:scale-95 cursor-pointer shrink-0"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#D8AA67]" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* ── 4. Mobile Displays: Show Login Button AND Menu Button with Menu Icon ── */}
          <div className="flex sm:hidden items-center space-x-2">
            {/* Mobile Login / Profile Button Capsule */}
            {user ? (
              <Link
                href="/profile"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-bold text-[#FFF8EB] active:scale-95 transition"
              >
                <div className="w-4 h-4 rounded-full bg-[#D8AA67] text-[#2B0507] font-bold text-[9px] flex items-center justify-center">
                  {initial}
                </div>
                <span className="text-[10px] uppercase font-bold text-[#D8AA67]">Profile</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-bold uppercase tracking-wider text-[#FFF8EB] active:scale-95 transition cursor-pointer"
              >
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button with Menu Icon Capsule (Matches Reference Image 2) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-bold uppercase tracking-wider text-[#FFF8EB] active:scale-95 transition cursor-pointer focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <>
                  <X className="w-3.5 h-3.5 text-[#D8AA67]" />
                  <span>Close</span>
                </>
              ) : (
                <>
                  <Menu className="w-3.5 h-3.5 text-[#D8AA67]" />
                  <span>Menu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── 5. Mobile Menu Drawer ── */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 w-full p-4 sm:hidden bg-[#0F0304]/98 backdrop-blur-xl border-b border-[#D8AA67]/35 shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 animate-fade-in-up">
            {/* Staff Admin Panel Link */}
            {user && isStaff && (
              <div className="mb-3">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#D8AA67] via-[#E1B46F] to-[#B78A48] text-[#2B0507] font-bold text-xs uppercase tracking-wider shadow-md transition group"
                >
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#2B0507]" />
                    <span>Access Admin Panel</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

            {/* User Profile Quick Info */}
            {user && (
              <div className="mb-3 pb-3 border-b border-[#D8AA67]/20 flex items-center justify-between px-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#D8AA67] text-[#2B0507] font-bold text-xs flex items-center justify-center">
                    {initial}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#FFF8EB] leading-tight">{displayName}</p>
                    <p className="text-[10px] text-[#D8AA67] truncate max-w-[200px]">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-[#D8AA67] underline font-semibold"
                >
                  View Profile
                </Link>
              </div>
            )}

            {/* Primary Action Button on Mobile */}
            <div className="mb-3">
              <Link
                href="/rooms"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D8AA67] to-[#C89B55] text-[#2B0507] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md active:scale-98 transition"
              >
                <BedDouble className="w-3.5 h-3.5 text-[#2B0507]" />
                <span>Book A Stay &bull; Suites &amp; Rooms</span>
              </Link>
            </div>

            {/* Nav Links Stack */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname === link.href || pathname.startsWith(link.href + '/');

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'bg-white/15 text-[#D8AA67] font-bold'
                        : 'text-[#FFF8EB]/80 hover:bg-white/5 hover:text-[#FFF8EB]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Footer in Mobile Menu */}
            <div className="mt-3.5 pt-3.5 border-t border-[#D8AA67]/20 flex items-center justify-between text-xs px-2">
              <button
                type="button"
                onClick={() => setLanguage(language === 'Eng' ? 'हिन्दी' : 'Eng')}
                className="flex items-center space-x-1.5 text-[#FFF8EB]/80 py-1"
              >
                <Globe className="w-3.5 h-3.5 text-[#D8AA67]" />
                <span>Language: {language}</span>
              </button>

              {user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-red-400 hover:text-red-300 font-semibold flex items-center py-1 cursor-pointer"
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

      {/* Structural spacer so non-hero pages are never covered by the fixed floating header */}
      <div
        className={`w-full shrink-0 pointer-events-none transition-all duration-300 ${
          isScrolled ? 'h-[66px] sm:h-[70px]' : 'h-[72px] sm:h-[78px]'
        }`}
        aria-hidden="true"
      />
    </>
  );
};
