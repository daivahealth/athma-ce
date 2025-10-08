'use client';

import { useQuery } from '@tanstack/react-query';
import { foundationClient } from '@/lib/api/client';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: string;
  settings: {
    language?: string;
    timezone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

async function fetchTenants() {
  const { data } = await foundationClient.get('/tenants');
  return data as Tenant[];
}

export function useTenants() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: fetchTenants,
    staleTime: 1000 * 30,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
