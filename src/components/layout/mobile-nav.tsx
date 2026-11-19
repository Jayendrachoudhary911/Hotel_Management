'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BedDouble, Utensils, Coffee, Calendar } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  // Hide on staff dashboard and dedicated auth pages
  if (pathname.startsWith('/dashboard') || pathname === '/login' || pathname === '/signup' || pathname.startsWith('/auth')) {
    return null;
  }

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Hotel', href: '/hotel', icon: BedDouble },
    { label: 'Dining', href: '/restaurant', icon: Utensils },
    { label: 'Book', href: '/book', icon: Calendar },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F3] border-t border-[#D4CBBB] shadow-lg px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#13251E] font-bold' : 'text-[#7A6F62] hover:text-[#13251E]'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#C59B63]' : 'text-[#7A6F62]'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
