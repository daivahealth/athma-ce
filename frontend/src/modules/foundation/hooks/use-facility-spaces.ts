import { useQuery } from '@tanstack/react-query';
import { spaceService } from '../services/space-service';

export function useFacilitySpaces(facilityId: string | undefined) {
  return useQuery({
    queryKey: ['spaces', 'facility', facilityId],
    queryFn: () => {
      if (!facilityId) {
        throw new Error('Facility ID is required');
      }
      return spaceService.listByFacility(facilityId);
    },
    enabled: !!facilityId,
  });
}
