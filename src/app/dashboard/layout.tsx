'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  ChefHat,
  Receipt,
  Sparkles,
  Utensils,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Operations Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Reservations', href: '/dashboard/reservations', icon: CalendarCheck },
    { label: 'Rooms & Housekeeping', href: '/dashboard/rooms', icon: BedDouble },
    { label: 'Kitchen Display (KDS)', href: '/dashboard/kitchen', icon: ChefHat },
    { label: 'POS & Billing', href: '/dashboard/pos', icon: Receipt },
    { label: 'Party Hall Enquiries', href: '/dashboard/hall', icon: Sparkles },
    { label: 'Menu Management', href: '/dashboard/menu', icon: Utensils },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full bg-[#1C1814] text-[#FAF8F3]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#3D352C] bg-[#241F1A] p-4 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-6">
          <div className="px-3 pt-2">
            <span className="text-[10px] uppercase tracking-widest text-[#B08D57] font-bold block">
              Heritage Operations Console
            </span>
            <span className="font-heritage text-base font-bold text-[#FAF8F3] block mt-0.5">
              Aura Grand Staff Portal
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#670E10] text-white border border-[#B08D57]/50 shadow-sm'
                      : 'text-[#D4CBBB] hover:text-white hover:bg-[#2A2420]'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-[#B08D57]' : 'text-[#8F7245]'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#3D352C] px-2 space-y-3">
          <div className="flex items-center space-x-2 text-xs text-[#D4CBBB]">
            <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
            <span className="truncate">Duty Manager: Ranveer Singh</span>
          </div>
          <Link
            href="/"
            className="flex items-center text-xs text-[#B08D57] hover:text-[#C9A96E] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Return to Public Portal
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Mobile Subnav Strip */}
        <div className="md:hidden flex overflow-x-auto p-2 bg-[#241F1A] border-b border-[#3D352C] space-x-2 shrink-0">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  isActive ? 'bg-[#670E10] text-white border border-[#B08D57]' : 'bg-[#2A2420] text-[#D4CBBB]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 sm:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#B08D57] font-bold">Loading staff console...</div>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
