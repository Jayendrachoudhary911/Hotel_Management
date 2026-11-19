'use client';

import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const isTerms = type === 'terms';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-lg bg-[#FAF8F3] border border-[#EADBCE] rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE]">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-[#D8AA67]" />
            <h3
              className="text-xl font-bold text-[#670E10]"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
            >
              {isTerms ? 'Terms & Conditions' : 'Privacy Policy'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-[#EADBCE]/50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 text-xs sm:text-sm text-zinc-700 space-y-3.5 leading-relaxed pr-1">
          {isTerms ? (
            <>
              <p className="font-semibold text-[#073B34]">Welcome to Rajmahal Heritage Hotel & Sanctuary.</p>
              <p>
                By registering an account or making reservations with Rajmahal Heritage Hotel, you agree to comply with and be bound by our booking, stay, and dining policies.
              </p>
              <h4 className="font-semibold text-zinc-900 pt-1">1. Royal Heritage Experience & Check-In</h4>
              <p>
                Standard check-in time is 2:00 PM and check-out is 11:00 AM. A valid government photo ID is required upon check-in for all staying guests in accordance with local regulations.
              </p>
              <h4 className="font-semibold text-zinc-900 pt-1">2. Reservations & Cancellations</h4>
              <p>
                Cancellations made 72 hours prior to arrival are eligible for full deposit refunds. Custom festival and private royal hall bookings may have specific deposit rules.
              </p>
              <h4 className="font-semibold text-zinc-900 pt-1">3. Guest Code of Conduct</h4>
              <p>
                Rajmahal is a certified heritage sanctuary. Guests are requested to respect the historical artifacts, architecture, and tranquil atmosphere of the palace grounds.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-[#073B34]">Your Privacy is Sacred to Us.</p>
              <p>
                Rajmahal Heritage Hotel respects your privacy and is dedicated to protecting your personal information.
              </p>
              <h4 className="font-semibold text-zinc-900 pt-1">1. Information We Collect</h4>
              <p>
                We collect your name, phone number, email address, and booking preferences solely to provide personalized hospitality, seamless reservations, and room service.
              </p>
              <h4 className="font-semibold text-zinc-900 pt-1">2. Security & Confidentiality</h4>
              <p>
                Your data is stored in enterprise-grade encrypted databases. We do not sell, rent, or trade your personal details with third-party advertising companies.
              </p>
              <h4 className="font-semibold text-zinc-900 pt-1">3. Communication Preferences</h4>
              <p>
                You may opt out of promotional communications at any time. Essential transactional notifications regarding your stay and reservations will still be sent.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#EADBCE] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#073B34] text-white text-xs font-semibold hover:bg-[#0A4B42] transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
