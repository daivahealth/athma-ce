import { useQuery } from '@tanstack/react-query';
import { bedSearchService } from '@/modules/clinical/services/bed-search-service';
import type { BedSearchFilters, BedSearchResponse } from '@/modules/clinical/types/bed-search';

export function useBedSearch(filters: BedSearchFilters, options?: { enabled?: boolean }) {
  return useQuery<BedSearchResponse>({
    queryKey: ['beds', 'search-available', filters],
    queryFn: () => bedSearchService.searchAvailable(filters),
    enabled: Boolean(filters.facilityId) && (options?.enabled ?? true),
    staleTime: 30 * 1000,
  });
}
