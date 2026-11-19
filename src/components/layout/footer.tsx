'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconPalaceCrest } from '@/components/ui/heritage-art';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide footer on dashboard and dedicated auth pages
  if (
    pathname.startsWith('/dashboard') ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/auth')
  ) {
    return null;
  }

  return (
    <footer
      className="border-t border-[#d8aa67]/30 text-[#FAF8F3] mt-auto transition-colors"
      style={{ backgroundColor: '#4f0809' }}
    >
      {/* Top Gold Filigree Accent Line */}
      <div className="h-0.5 bg-gradient-to-r from-[#4f0809] via-[#d8aa67] to-[#4f0809]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 pb-24 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-md bg-[#380506] border border-[#d8aa67]/60 flex items-center justify-center shadow">
                <IconPalaceCrest className="w-7 h-7 text-[#d8aa67]" />
              </div>
              <div>
                <span
                  className="text-xl font-bold tracking-widest text-[#FAF8F3] uppercase block leading-none"
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  }}
                >
                  RAJMAHAL
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#d8aa67] uppercase block mt-1">
                  Heritage Hotel
                </span>
              </div>
            </div>
            <p className="text-xs text-[#d8d2c4] leading-relaxed font-light">
              A royal stay rooted in Rajasthan. Six authentic heritage rooms, traditional Rajasthani restaurant, café &amp; lounge, and party hall.
            </p>
            <div className="pt-1 text-xs text-[#d8aa67] flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#d8aa67] shrink-0" />
              <span>Certified Rajasthan Heritage Sanctuary</span>
            </div>

            {/* Connect With Us */}
            <div className="pt-3">
              <h5 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d8aa67] mb-2.5">
                Connect With Us
              </h5>
              <div className="flex items-center space-x-2.5">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-[#380506] border border-[#d8aa67]/40 flex items-center justify-center text-[#d8aa67] hover:bg-[#d8aa67] hover:text-[#4f0809] transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-[#380506] border border-[#d8aa67]/40 flex items-center justify-center text-[#d8aa67] hover:bg-[#d8aa67] hover:text-[#4f0809] transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-full bg-[#380506] border border-[#d8aa67]/40 flex items-center justify-center text-[#d8aa67] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.24 3.67 16.31 4.53 17.87 6.09C19.42 7.64 20.28 9.71 20.28 11.91C20.28 16.46 16.58 20.16 12.04 20.16C10.61 20.16 9.22 19.79 8 19.07L7.71 18.9L4.59 19.72L5.42 16.68L5.23 16.37C4.43 15.1 4.01 13.53 4.01 11.92C4.01 7.37 7.71 3.67 12.04 3.67ZM8.94 7.33C8.76 7.33 8.47 7.4 8.23 7.66C7.99 7.92 7.31 8.56 7.31 9.86C7.31 11.16 8.26 12.41 8.39 12.59C8.52 12.76 10.25 15.43 12.9 16.57C13.53 16.84 14.02 17 14.41 17.12C15.04 17.32 15.62 17.29 16.07 17.23C16.58 17.15 17.63 16.59 17.85 15.97C18.07 15.36 18.07 14.83 18.01 14.73C17.94 14.62 17.77 14.56 17.5 14.43C17.24 14.3 15.95 13.66 15.71 13.57C15.47 13.49 15.3 13.44 15.12 13.7C14.95 13.97 14.44 14.56 14.29 14.73C14.14 14.91 13.99 14.93 13.72 14.8C13.46 14.67 12.61 14.39 11.61 13.5C10.83 12.8 10.3 11.94 10.15 11.68C10 11.41 10.13 11.27 10.27 11.14C10.39 11.02 10.53 10.83 10.66 10.68C10.79 10.53 10.84 10.42 10.92 10.25C11.01 10.07 10.97 9.92 10.9 9.79C10.84 9.66 10.25 8.23 10.03 7.71C9.82 7.2 9.6 7.27 9.44 7.26C9.29 7.26 9.11 7.33 8.94 7.33Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#d8aa67] mb-4">
              Explore The Property
            </h4>
            <ul className="space-y-2.5 text-xs text-[#d8d2c4]">
              <li>
                <Link href="/rooms" className="hover:text-[#d8aa67] transition-colors">
                  Our Heritage Rooms
                </Link>
              </li>
              <li>
                <Link href="/restaurant" className="hover:text-[#d8aa67] transition-colors">
                  Restaurant &amp; Café
                </Link>
              </li>
              <li>
                <Link href="/hotel" className="hover:text-[#d8aa67] transition-colors">
                  Hotel &amp; Celebrations
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-[#d8aa67] transition-colors">
                  Book Your Stay
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#d8aa67] mb-4">
              Contact &amp; Address
            </h4>
            <ul className="space-y-3 text-xs text-[#d8d2c4]">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-[#d8aa67] mr-2 mt-0.5 shrink-0" />
                <span>Lake Palace Road, Pichola, Udaipur, Rajasthan 313001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-[#d8aa67] mr-2 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-[#d8aa67] mr-2 shrink-0" />
                <span>info@rajmahalhotel.in</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 text-[#d8aa67] mr-2 shrink-0" />
                <span>Hotel: 24 x 7 | Dining: 12:30 PM – 11 PM</span>
              </li>
            </ul>
          </div>

          {/* Google Maps Exact Location Embed */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#d8aa67] mb-3 flex items-center justify-between">
              <span>Hotel Location</span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Lake+Palace+Road,+Pichola,+Udaipur,+Rajasthan+313001"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] lowercase text-[#d8aa67] hover:underline flex items-center gap-1 font-normal"
              >
                view full map ↗
              </a>
            </h4>

            {/* Interactive Google Map iframe */}
            <div className="relative rounded-[10px] overflow-hidden border border-[#d8aa67]/40 shadow-md h-[135px] w-full bg-[#380506]">
              <iframe
                title="Rajmahal Heritage Hotel Google Map Location"
                src="https://maps.google.com/maps?q=Lake+Palace+Road,+Pichola,+Udaipur,+Rajasthan+313001&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            <p className="text-[11px] text-[#d8d2c4]/80 mt-2 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#d8aa67] shrink-0" />
              <span>Lake Palace Road, Pichola, Udaipur</span>
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#d8aa67]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#d8d2c4]/70">
          <p>© 2026 Rajmahal Heritage Hotel. All rights reserved.</p>
          <div className="flex space-x-6 mt-3 sm:mt-0 text-[#d8aa67]">
            <span>Udaipur, Rajasthan, India</span>
            <span>✦ Rajputana Hospitality</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
