'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div
        className={`relative w-full ${maxWidthStyles} glass-panel rounded-2xl shadow-2xl z-10 border border-zinc-700/60 p-6 sm:p-8 animate-in zoom-in-95 duration-200`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg transition-colors hover:bg-zinc-800"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {title && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};
