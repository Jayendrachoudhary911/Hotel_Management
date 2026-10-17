import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ className = '', glow = false, children, ...props }) => {
  return (
    <div
      className={`heritage-card rounded-2xl p-6 transition-all duration-300 ${
        glow ? 'border-[#B08D57] shadow-lg shadow-[#B08D57]/15' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
  return <div className={`mb-4 flex flex-col space-y-1.5 ${className}`} {...props}>{children}</div>;
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = '', children, ...props }) => {
  return <h3 className={`text-xl font-heritage font-bold tracking-tight text-[#241F1A] ${className}`} {...props}>{children}</h3>;
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className = '', children, ...props }) => {
  return <p className={`text-sm text-[#6B6155] ${className}`} {...props}>{children}</p>;
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
  return <div className={`text-[#3D352C] ${className}`} {...props}>{children}</div>;
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
  return <div className={`mt-6 flex items-center pt-4 border-t border-[#D4CBBB] ${className}`} {...props}>{children}</div>;
};
