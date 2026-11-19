'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RedirectToLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirect = searchParams?.get('redirect') || searchParams?.get('next') || '';
    if (redirect) {
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    } else {
      router.replace('/login');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F3EB]">
      <div className="w-10 h-10 border-2 border-[#073B34] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function AuthLoginRedirect() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F3EB]" />}>
      <RedirectToLogin />
    </Suspense>
  );
}
