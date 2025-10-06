'use client';

import { useQuery } from '@tanstack/react-query';
import { foundationClient } from '@/lib/api/client';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: string;
  createdAt: string;
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
  });
}
