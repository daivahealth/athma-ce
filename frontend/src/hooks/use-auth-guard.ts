'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSession } from '@/lib/api/client';
import { isTokenExpired } from '@/lib/auth/tokens';

export function useAuthGuard(locale: string) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const { accessToken } = getSession();
    if (!accessToken || isTokenExpired(accessToken)) {
      router.replace(`/${locale}/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [router, locale, pathname]);
}
