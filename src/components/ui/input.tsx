import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold uppercase tracking-wider text-[#3D352C]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-xl bg-white border px-4 py-3 text-sm text-[#241F1A] placeholder-[#9A8E7F] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#670E10]/30 focus:border-[#670E10] disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-rose-500/80 focus:ring-rose-400' : 'border-[#D4CBBB] hover:border-[#8F7245]'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#6B6155] mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
