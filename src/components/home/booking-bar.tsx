'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Search } from 'lucide-react';

export function BookingBar() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const dayAfter = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    setCheckIn(today);
    setCheckOut(dayAfter);
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-[#FAF8F3]/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border-2 border-[#B08D57]/40 mb-8">
      <form action="/rooms" method="GET" className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
        <div className="text-left px-3 py-2.5 bg-white rounded-xl border border-[#D4CBBB] shadow-xs">
          <label className="flex items-center text-[10px] uppercase tracking-widest text-[#8F7245] font-bold mb-1">
            <Calendar className="w-3 h-3 mr-1 text-[#670E10]" /> Check-in Date
          </label>
          <input
            type="date"
            name="checkIn"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent text-sm text-[#241F1A] font-medium focus:outline-none cursor-pointer"
          />
        </div>

        <div className="text-left px-3 py-2.5 bg-white rounded-xl border border-[#D4CBBB] shadow-xs">
          <label className="flex items-center text-[10px] uppercase tracking-widest text-[#8F7245] font-bold mb-1">
            <Calendar className="w-3 h-3 mr-1 text-[#670E10]" /> Check-out Date
          </label>
          <input
            type="date"
            name="checkOut"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-sm text-[#241F1A] font-medium focus:outline-none cursor-pointer"
          />
        </div>

        <div className="text-left px-3 py-2.5 bg-white rounded-xl border border-[#D4CBBB] shadow-xs">
          <label className="flex items-center text-[10px] uppercase tracking-widest text-[#8F7245] font-bold mb-1">
            <Users className="w-3 h-3 mr-1 text-[#670E10]" /> Guests
          </label>
          <select
            name="guests"
            defaultValue="2"
            className="w-full bg-transparent text-sm text-[#241F1A] font-medium focus:outline-none cursor-pointer"
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4+ Guests</option>
          </select>
        </div>

        <div>
          <Button type="submit" size="lg" className="w-full h-full py-3.5 shadow-md flex items-center justify-center space-x-2">
            <Search className="w-4 h-4 mr-1.5" />
            <span>Check Availability</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
