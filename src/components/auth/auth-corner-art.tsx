import React from 'react';

export const AuthCornerArt: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* ── Left Authentic Side Artwork: Rajasthani Jharokha Pavilion & Watercolor Foliage ── */}
      <div className="absolute left-0 top-0 bottom-0 h-full flex items-center justify-start [mask-image:linear-gradient(to_right,black_60%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_right,black_60%,transparent_98%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/auth-side-art-left@2x.png"
          alt=""
          className="h-full w-auto max-w-[80px] sm:max-w-[115px] md:max-w-[140px] lg:max-w-[165px] xl:max-w-[185px] object-contain object-left pointer-events-none select-none opacity-60 sm:opacity-90 md:opacity-100 mix-blend-multiply transition-opacity"
        />
      </div>

      {/* ── Right Authentic Side Artwork: Mirrored Jharokha Pavilion & Watercolor Foliage ── */}
      <div className="absolute right-0 top-0 bottom-0 h-full flex items-center justify-end [mask-image:linear-gradient(to_left,black_60%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_left,black_60%,transparent_98%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/auth-side-art-right@2x.png"
          alt=""
          className="h-full w-auto max-w-[80px] sm:max-w-[115px] md:max-w-[140px] lg:max-w-[165px] xl:max-w-[185px] object-contain object-right pointer-events-none select-none opacity-60 sm:opacity-90 md:opacity-100 mix-blend-multiply transition-opacity"
        />
      </div>
    </div>
  );
};

