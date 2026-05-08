'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSession } from '@/lib/api/client';
import { isTokenExpired } from '@/lib/auth/tokens';

export function useAuthGuard(locale: string) {
  const router = useRouter();
  const pathname = usePathname();
  // Start as false on both server and client — localStorage is not available during SSR.
  // useEffect below sets the real value after mount, eliminating the hydration mismatch.
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const { accessToken } = getSession();
    const authorized = !!accessToken && !isTokenExpired(accessToken);
    setIsAuthorized(authorized);

    if (!authorized) {
      router.replace(`/${locale}/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [router, locale, pathname]);

  return isAuthorized;
}
