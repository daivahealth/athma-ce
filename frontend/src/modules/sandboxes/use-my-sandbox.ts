'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DEPLOYMENT_MODE } from '@/lib/config/deployment';
import { getMySandbox, MY_SANDBOX_QUERY_KEY } from './api';

function hasStoredSession(): boolean {
  try {
    return !!window.localStorage.getItem('accessToken');
  } catch {
    return false;
  }
}

/**
 * The signed-in user's sandbox status. Only asked on demo deployments, and
 * polled while a sandbox is being created or removed.
 */
export function useMySandbox(options: { enabled?: boolean } = {}) {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => setSignedIn(hasStoredSession()), []);

  return useQuery({
    queryKey: MY_SANDBOX_QUERY_KEY,
    queryFn: getMySandbox,
    enabled: DEPLOYMENT_MODE === 'demo' && signedIn && (options.enabled ?? true),
    staleTime: 60_000,
    retry: false,
    refetchInterval: (query) => {
      const status = query.state.data?.sandbox?.status;
      return status === 'provisioning' || status === 'deleting' || status === 'expired' ? 2_000 : false;
    },
  });
}
