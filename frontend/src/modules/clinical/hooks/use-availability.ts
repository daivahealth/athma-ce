import { useQuery } from '@tanstack/react-query';
import { availabilityService, type FindAvailableSlotsParams } from '../services/availability-service';

export function useAvailableSlots(params: FindAvailableSlotsParams | null, enabled = true) {
  return useQuery({
    queryKey: ['available-slots', params],
    queryFn: () => availabilityService.findAvailableSlots(params!),
    enabled: enabled && params !== null,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useCheckSlotAvailability(
  resourceType: 'staff' | 'equipment' | 'space',
  resourceId: string,
  startTime: string,
  endTime: string,
  enabled = true
) {
  return useQuery({
    queryKey: ['check-slot-availability', resourceType, resourceId, startTime, endTime],
    queryFn: () =>
      availabilityService.checkSlotAvailability({
        resourceType,
        resourceId,
        startTime,
        endTime,
      }),
    enabled,
    staleTime: 1000 * 30, // 30 seconds
  });
}
