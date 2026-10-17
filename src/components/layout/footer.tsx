'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-[#B08D57]/40 bg-[#241F1A] text-[#EBE5D6] mt-auto">
      {/* Top Gold Filigree Accent Line */}
      <div className="h-1 bg-gradient-to-r from-[#670E10] via-[#B08D57] to-[#670E10]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#670E10] border border-[#B08D57] flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-[#B08D57]" />
              </div>
              <span className="font-heritage text-2xl font-bold tracking-wider text-[#FAF8F3]">
                AURA GRAND
              </span>
            </div>
            <p className="text-sm text-[#D4CBBB] leading-relaxed">
              A timeless sanctuary rooted in the royal splendor of Udaipur, Rajasthan. Experiential palatial suites, royal gastronomy, and heritage celebrations.
            </p>
            <div className="pt-2 text-xs text-[#B08D57] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#B08D57]" />
              <span>Government Certified Heritage Sanctuary</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B08D57] mb-4">
              Explore The Palace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/rooms" className="text-[#EBE5D6] hover:text-[#C9A96E] transition-colors">
                  Heritage Suites & Chambers
                </Link>
              </li>
              <li>
                <Link href="/restaurant" className="text-[#EBE5D6] hover:text-[#C9A96E] transition-colors">
                  Saffron & Spice Fine Dining
                </Link>
              </li>
              <li>
                <Link href="/cafe" className="text-[#EBE5D6] hover:text-[#C9A96E] transition-colors">
                  The Courtyard Artisan Cafe
                </Link>
              </li>
              <li>
                <Link href="/hall" className="text-[#EBE5D6] hover:text-[#C9A96E] transition-colors">
                  Crystal Ballroom & Royal Lawns
                </Link>
              </li>
              <li>
                <Link href="/order/pickup" className="text-[#EBE5D6] hover:text-[#C9A96E] transition-colors">
                  In-Room & Online Dining Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (WEB-02) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B08D57] mb-4">
              Palace Enclave & Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-[#B08D57] mr-2.5 mt-0.5 shrink-0" />
                <span className="text-[#D4CBBB]">124 Palatial Boulevard, Heritage Enclave, Udaipur, Rajasthan 313001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-[#B08D57] mr-2.5 shrink-0" />
                <span className="text-[#D4CBBB]">+91 294 288 9000</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-[#B08D57] mr-2.5 shrink-0" />
                <span className="text-[#D4CBBB]">concierge@auragrandresort.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 text-[#B08D57] mr-2.5 shrink-0" />
                <span className="text-[#D4CBBB]">24/7 Concierge & Front Desk</span>
              </li>
            </ul>
          </div>

          {/* Staff & Guest Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B08D57] mb-4">
              Staff & Operations
            </h4>
            <p className="text-sm text-[#D4CBBB] mb-4">
              Staff console for front-desk reservations, kitchen live orders (KDS), and hall enquiry lead management.
            </p>
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 rounded bg-[#670E10] text-white hover:bg-[#8A1518] border border-[#B08D57]/40 text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Access Staff Portal &rarr;
              </Link>
              <div className="text-xs text-[#9A8E7F]">
                Operating under Rajasthan Heritage Tourism Regulations.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and credits */}
        <div className="mt-12 pt-8 border-t border-[#3D352C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9A8E7F] gap-4">
          <p>© 2026 Aura Grand Luxury Resort & Heritage Suites. All rights reserved.</p>
          <p className="flex items-center text-[#B08D57]">
            Crafted with <Heart className="w-3.5 h-3.5 mx-1 text-[#8A1518] fill-current" /> in Rajasthan
          </p>
        </div>
      </div>
    </footer>
  );
};
