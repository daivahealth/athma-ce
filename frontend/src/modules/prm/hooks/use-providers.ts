import { useMutation, useQuery } from '@tanstack/react-query';
import { providersService, type ProviderCallbackFilters } from '../services/providers-service';
import type { ProviderCallback } from '../types/provider';

const PROVIDER_KEYS = {
  all: ['prm', 'providers'] as const,
  callbacks: (filters: ProviderCallbackFilters | undefined) => [...PROVIDER_KEYS.all, 'callbacks', filters] as const,
};

export function useProviderCallbacks(filters?: ProviderCallbackFilters) {
  return useQuery<ProviderCallback[]>({
    queryKey: PROVIDER_KEYS.callbacks(filters),
    queryFn: () => providersService.listCallbacks(filters),
  });
}

export function useSendProviderWebhook() {
  return useMutation({
    mutationFn: ({ channel, payload }: { channel: string; payload: Record<string, unknown> }) =>
      providersService.sendWebhook(channel, payload),
  });
}
