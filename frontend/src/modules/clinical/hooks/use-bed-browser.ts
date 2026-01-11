import { useQuery } from '@tanstack/react-query';
import { bedBrowserService } from '@/modules/clinical/services/bed-browser-service';
import type { BedBrowserFilters, BedBrowserResponse } from '@/modules/clinical/types/bed-browser';

export function useBedBrowser(filters: BedBrowserFilters) {
  return useQuery<BedBrowserResponse>({
    queryKey: ['inpatient', 'bed-browser', filters],
    queryFn: () => bedBrowserService.getBeds(filters),
    staleTime: 30 * 1000,
  });
}
