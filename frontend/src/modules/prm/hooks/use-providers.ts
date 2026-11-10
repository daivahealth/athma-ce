import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import {
  providersService,
  type ListProviderCallbacksResponse,
  type ProviderCallbackFilters,
} from '../services/providers-service';

const PROVIDER_KEYS = {
  all: ['prm', 'providers'] as const,
  callbacks: (filters: ProviderCallbackFilters | undefined) => [...PROVIDER_KEYS.all, 'callbacks', filters] as const,
};

export function useProviderCallbacks(filters?: ProviderCallbackFilters) {
  return useQuery<ListProviderCallbacksResponse>({
    queryKey: PROVIDER_KEYS.callbacks(filters),
    queryFn: () => providersService.listCallbacks(filters),
    placeholderData: keepPreviousData,
  });
}

export function useSendProviderWebhook() {
  return useMutation({
    mutationFn: ({ channel, payload }: { channel: string; payload: Record<string, unknown> }) =>
      providersService.sendWebhook(channel, payload),
  });
}
