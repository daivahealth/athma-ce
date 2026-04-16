'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function PharmacyRootPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    router.replace(`/${locale}/pharmacy/queue`);
  }, [router, locale]);

  return null;
}
