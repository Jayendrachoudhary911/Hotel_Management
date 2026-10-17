import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'maroon' | 'gold' | 'emerald' | 'amber' | 'rose' | 'slate' | 'blue' | 'ivory';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'maroon',
  size = 'md',
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
  }[size];

  const variantStyles = {
    maroon: 'bg-[#670E10]/10 text-[#670E10] border border-[#670E10]/20',
    gold: 'bg-[#B08D57]/10 text-[#8F7245] border border-[#B08D57]/25',
    emerald: 'bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20',
    amber: 'bg-[#CC8A00]/10 text-[#CC8A00] border border-[#CC8A00]/20',
    rose: 'bg-[#9B2226]/10 text-[#9B2226] border border-[#9B2226]/20',
    slate: 'bg-[#EBE5D6] text-[#6B6155] border border-[#D4CBBB]',
    blue: 'bg-[#2B6CB0]/10 text-[#2B6CB0] border border-[#2B6CB0]/20',
    ivory: 'bg-white text-[#241F1A] border border-[#D4CBBB]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full tracking-wide uppercase ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
