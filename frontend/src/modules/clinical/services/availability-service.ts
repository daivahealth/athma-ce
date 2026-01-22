import { clinicalClient } from '@/lib/api/client';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
  status?: string;
  availability?: string;
}

export interface FindAvailableSlotsParams {
  resourceType: 'staff' | 'equipment' | 'space';
  resourceId: string;
  startDate: string;
  endDate: string;
  durationMinutes: number;
  slotInterval?: number;
}

export interface CheckSlotAvailabilityParams {
  resourceType: 'staff' | 'equipment' | 'space';
  resourceId: string;
  startTime: string;
  endTime: string;
}

class AvailabilityService {
  /**
   * Find available time slots for a resource
   */
  async findAvailableSlots(params: FindAvailableSlotsParams): Promise<TimeSlot[]> {
    const response = await clinicalClient.post<TimeSlot[]>('/scheduling/availability/find-slots', params);
    return response.data;
  }

  /**
   * Check if a specific slot is available
   */
  async checkSlotAvailability(params: CheckSlotAvailabilityParams): Promise<{ isAvailable: boolean }> {
    const response = await clinicalClient.post<{ isAvailable: boolean }>(
      '/scheduling/availability/check-slot',
      params
    );
    return response.data;
  }

  /**
   * Find next available slot for a resource
   */
  async findNextAvailableSlot(
    resourceType: 'staff' | 'equipment' | 'space',
    resourceId: string,
    durationMinutes: number,
    startFrom?: string
  ): Promise<{ slot: TimeSlot | null }> {
    const response = await clinicalClient.post<{ slot: TimeSlot | null }>(
      '/scheduling/availability/next-available',
      {
        resourceType,
        resourceId,
        durationMinutes,
        ...(startFrom && { startFrom }),
      }
    );
    return response.data;
  }
}

export const availabilityService = new AvailabilityService();
