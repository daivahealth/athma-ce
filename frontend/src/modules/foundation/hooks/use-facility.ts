import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { facilityService } from '../services/facility-service';
import type { CreateFacilityDTO, UpdateFacilityDTO } from '../types/facility';

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

export function useCreateFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFacilityDTO) => facilityService.create(data),
    onSuccess: (facility) => {
      queryClient.invalidateQueries({ queryKey: ['facilities', 'tenant', facility.tenantId] });
    },
  });
}

export function useUpdateFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFacilityDTO }) =>
      facilityService.update(id, data),
    onSuccess: (facility) => {
      queryClient.invalidateQueries({ queryKey: ['facilities', facility.id] });
      queryClient.invalidateQueries({ queryKey: ['facilities', 'tenant', facility.tenantId] });
    },
  });
}
