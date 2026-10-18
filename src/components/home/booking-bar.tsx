'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Search } from 'lucide-react';

export function BookingBar() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const fourDaysLater = new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0];
    setCheckIn(today);
    setCheckOut(fourDaysLater);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-[#D4CBBB]/70 p-3 sm:p-4">
      <form action="/rooms" method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        {/* Check In */}
        <div className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/60 hover:border-[#B08D57] transition-colors">
          <Calendar className="w-5 h-5 text-[#8F7245] shrink-0" />
          <div className="text-left w-full">
            <span className="block text-[11px] text-[#7A6F62] font-medium leading-none mb-1">
              Check In
            </span>
            <input
              type="date"
              name="checkIn"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-sm text-[#670E10] font-semibold focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Check Out */}
        <div className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/60 hover:border-[#B08D57] transition-colors">
          <Calendar className="w-5 h-5 text-[#8F7245] shrink-0" />
          <div className="text-left w-full">
            <span className="block text-[11px] text-[#7A6F62] font-medium leading-none mb-1">
              Check Out
            </span>
            <input
              type="date"
              name="checkOut"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-sm text-[#670E10] font-semibold focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F3]/60 hover:border-[#B08D57] transition-colors">
          <Users className="w-5 h-5 text-[#8F7245] shrink-0" />
          <div className="text-left w-full">
            <span className="block text-[11px] text-[#7A6F62] font-medium leading-none mb-1">
              Guests
            </span>
            <select
              name="guests"
              defaultValue="2"
              className="w-full bg-transparent text-sm text-[#670E10] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
              <option value="4">4+ Adults</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div>
          <button
            type="submit"
            className="w-full h-full py-3.5 px-6 rounded-lg bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] font-medium text-sm tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Search className="w-4 h-4 mr-1 text-[#C9A96E]" />
            <span>Search Rooms</span>
          </button>
        </div>
      </form>
    </div>
  );
}
