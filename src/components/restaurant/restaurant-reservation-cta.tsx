'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { TableReservationModal } from './table-reservation-modal';

interface RestaurantReservationCTAProps {
  venue?: 'restaurant' | 'cafe';
  className?: string;
  label?: string;
}

export const RestaurantReservationCTA: React.FC<RestaurantReservationCTAProps> = ({
  venue = 'restaurant',
  className = '',
  label = 'Reserve a Table',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D8AA67] via-[#E1B46F] to-[#B78A48] text-[#380506] text-xs sm:text-sm font-bold tracking-wide shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#FFF8EB]/50 ${className}`}
      >
        <Calendar className="w-4 h-4 text-[#380506]" />
        <span>{label}</span>
      </button>

      <TableReservationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultVenue={venue}
      />
    </>
  );
};
