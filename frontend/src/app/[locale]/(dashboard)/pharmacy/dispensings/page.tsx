'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// The dispensing history list is now embedded in the Queue page (History tab).
// This redirect keeps any bookmarks / direct links working.
export default function DispensingHistoryRedirect() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    router.replace(`/${locale}/pharmacy/queue`);
  }, [router, locale]);

  return null;
}
