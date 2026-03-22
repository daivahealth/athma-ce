/**
 * Catalog Population Hooks
 * React Query hooks for the AI-powered catalog population feature.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogPopulationService } from '../services/catalog-population-service';
import type {
  StartCatalogPopulationRequest,
  CatalogPopulationStatus,
  CountryInfo,
} from '../types/catalog-population';

const QUERY_KEYS = {
  status: (jobId: string) => ['catalog-population', 'status', jobId] as const,
  history: ['catalog-population', 'history'] as const,
  countries: ['catalog-population', 'countries'] as const,
};

/**
 * Mutation hook to start a catalog population job
 */
export function useCatalogPopulationStart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: StartCatalogPopulationRequest) =>
      catalogPopulationService.start(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history });
    },
  });
}

/**
 * Query hook to poll job status (auto-refreshes every 2s while running)
 */
export function useCatalogPopulationStatus(jobId: string | null) {
  return useQuery<CatalogPopulationStatus>({
    queryKey: QUERY_KEYS.status(jobId ?? ''),
    queryFn: () => catalogPopulationService.getStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Poll every 2s while running, stop when finished
      if (status === 'running' || status === 'pending') return 2000;
      return false;
    },
    staleTime: 1000,
  });
}

/**
 * Mutation hook to cancel a running job
 */
export function useCatalogPopulationCancel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => catalogPopulationService.cancel(jobId),
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.status(jobId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history });
    },
  });
}

/**
 * Query hook to fetch job history for the current tenant
 */
export function useCatalogPopulationHistory() {
  return useQuery<CatalogPopulationStatus[]>({
    queryKey: QUERY_KEYS.history,
    queryFn: () => catalogPopulationService.getHistory(),
    staleTime: 30000,
  });
}

/**
 * Query hook to fetch available countries with template info
 */
export function useCatalogPopulationCountries() {
  return useQuery<CountryInfo[]>({
    queryKey: QUERY_KEYS.countries,
    queryFn: () => catalogPopulationService.getCountries(),
    staleTime: 300000, // 5 min cache
  });
}
