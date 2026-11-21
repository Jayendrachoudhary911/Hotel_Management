'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { TableReservationModal } from './table-reservation-modal';

interface RestaurantReservationCTAProps {
  venue?: 'restaurant' | 'cafe';
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  variant?: 'pill' | 'card';
  showIcon?: boolean;
  children?: React.ReactNode;
}

export const RestaurantReservationCTA: React.FC<RestaurantReservationCTAProps> = ({
  venue = 'restaurant',
  className = '',
  style,
  label = 'Reserve a Table',
  variant = 'pill',
  showIcon,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const shouldShowIcon = showIcon !== undefined ? showIcon : variant === 'pill';

  const buttonClasses =
    variant === 'card'
      ? `flex items-center justify-center space-x-2 h-11 rounded-[6px] text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:bg-[#680b0c] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${className}`
      : `inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D8AA67] via-[#E1B46F] to-[#B78A48] text-[#380506] text-xs sm:text-sm font-bold tracking-wide shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#FFF8EB]/50 ${className}`;

  const defaultStyle: React.CSSProperties =
    variant === 'card'
      ? {
          backgroundColor: 'var(--forest-deep, #4f0809)',
          color: 'var(--ivory, #fff8eb)',
          ...style,
        }
      : (style || {});

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={buttonClasses}
        style={defaultStyle}
      >
        {children ? (
          children
        ) : (
          <>
            {shouldShowIcon && (
              <Calendar
                className={
                  variant === 'card'
                    ? 'w-3.5 h-3.5 text-[#D8AA67]'
                    : 'w-4 h-4 text-[#380506]'
                }
              />
            )}
            <span>{label}</span>
          </>
        )}
      </button>

      <TableReservationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultVenue={venue}
      />
    </>
  );
};
