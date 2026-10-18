'use client';

import React from 'react';
import Link from 'next/link';
import { IconPalaceCrest } from '@/components/ui/heritage-art';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#B08D57]/40 bg-[#4A0A0C] text-[#FAF8F3] mt-auto">
      {/* Top Gold Filigree Accent Line */}
      <div className="h-0.5 bg-gradient-to-r from-[#4A0A0C] via-[#B08D57] to-[#4A0A0C]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-md bg-[#380608] border border-[#B08D57]/60 flex items-center justify-center shadow">
                <IconPalaceCrest className="w-7 h-7 text-[#C9A96E]" />
              </div>
              <div>
                <span className="font-heritage text-xl font-bold tracking-widest text-[#FAF8F3] uppercase block leading-none">
                  RAJMAHAL
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#C9A96E] uppercase block mt-0.5">
                  Heritage Hotel
                </span>
              </div>
            </div>
            <p className="text-xs text-[#D8D2C4] leading-relaxed font-light">
              A royal stay rooted in Rajasthan. Six authentic heritage rooms, traditional Rajasthani restaurant, café & lounge, and party hall.
            </p>
            <div className="pt-2 text-xs text-[#C9A96E] flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C9A96E]" />
              <span>Certified Rajasthan Heritage Sanctuary</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C9A96E] mb-4">
              Explore The Property
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D8D2C4]">
              <li>
                <Link href="/rooms" className="hover:text-[#C9A96E] transition-colors">
                  Our Heritage Rooms
                </Link>
              </li>
              <li>
                <Link href="/restaurant" className="hover:text-[#C9A96E] transition-colors">
                  Rajasthani Restaurant
                </Link>
              </li>
              <li>
                <Link href="/cafe" className="hover:text-[#C9A96E] transition-colors">
                  Café & Lounge
                </Link>
              </li>
              <li>
                <Link href="/hall" className="hover:text-[#C9A96E] transition-colors">
                  Party Hall & Celebrations
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-[#C9A96E] transition-colors">
                  Book Your Stay
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (WEB-02) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C9A96E] mb-4">
              Contact & Address
            </h4>
            <ul className="space-y-3 text-xs text-[#D8D2C4]">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-[#C9A96E] mr-2 mt-0.5 shrink-0" />
                <span>Lake Palace Road, Pichola, Udaipur, Rajasthan 313001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-[#C9A96E] mr-2 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-[#C9A96E] mr-2 shrink-0" />
                <span>info@rajmahalhotel.in</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 text-[#C9A96E] mr-2 shrink-0" />
                <span>Hotel: 24 x 7 | Dining: 12:30 PM – 11 PM</span>
              </li>
            </ul>
          </div>

          {/* Operations & Staff Portal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C9A96E] mb-4">
              Operations & Staff
            </h4>
            <p className="text-xs text-[#D8D2C4] mb-4 font-light leading-relaxed">
              Staff console for front-desk reservations, kitchen live orders (KDS), and banquet enquiry leads.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 rounded-md bg-[#380608] border border-[#B08D57]/60 text-xs font-medium text-[#FAF8F3] hover:bg-[#C59B63] hover:text-[#4A0A0C] transition-all shadow"
            >
              Access Staff Cockpit
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#B08D57]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A89E90]">
          <p>© 2026 Rajmahal Heritage Hotel. All rights reserved.</p>
          <div className="flex space-x-6 mt-3 sm:mt-0">
            <span>Udaipur, Rajasthan, India</span>
            <span>✦ Rajputana Hospitality</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
