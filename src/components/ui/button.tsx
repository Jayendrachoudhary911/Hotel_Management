import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#670E10]/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer';

    const sizeStyles = {
      sm: 'px-4 py-2 text-xs tracking-wider uppercase',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base font-semibold',
    }[size];

    const variantStyles = {
      primary:
        'bg-[#670E10] text-white font-semibold shadow-md hover:bg-[#8A1518] hover:shadow-lg hover:shadow-[#670E10]/20',
      secondary:
        'bg-[#EBE5D6] text-[#241F1A] hover:bg-[#D4CBBB] border border-[#D4CBBB]',
      outline:
        'border-2 border-[#670E10] text-[#670E10] hover:bg-[#670E10] hover:text-white',
      ghost:
        'text-[#241F1A] hover:bg-[#EBE5D6] hover:text-[#670E10]',
      danger:
        'bg-[#9B2226] text-white hover:bg-[#7B1A1D] shadow-md',
      gold:
        'bg-[#B08D57] text-white font-semibold hover:bg-[#8F7245] shadow-md hover:shadow-lg',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
