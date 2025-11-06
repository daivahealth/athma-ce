import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user-service';

export function useFacilityUsers(facilityId: string | undefined) {
  return useQuery({
    queryKey: ['users', 'facility', facilityId],
    queryFn: () => {
      if (!facilityId) {
        throw new Error('Facility ID is required');
      }
      return userService.listByFacility(facilityId);
    },
    enabled: !!facilityId,
  });
}
