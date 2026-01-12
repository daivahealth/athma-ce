import { useQuery } from '@tanstack/react-query';
import { facilityService } from '../services/facility-service';

export function useFacility(facilityId: string | undefined) {
  return useQuery({
    queryKey: ['facilities', facilityId],
    queryFn: () => {
      if (!facilityId) {
        throw new Error('Facility ID is required');
      }
      return facilityService.getById(facilityId);
    },
    enabled: !!facilityId,
  });
}
