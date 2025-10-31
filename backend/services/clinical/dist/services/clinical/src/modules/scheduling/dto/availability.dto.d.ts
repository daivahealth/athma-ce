/**
 * Availability DTOs
 */
export declare class FindAvailableSlotsDto {
    resourceType: 'staff' | 'equipment' | 'space';
    resourceId: string;
    startDate: Date;
    endDate: Date;
    durationMinutes: number;
    facilityId?: string;
    slotInterval?: number;
    includePreparationTime?: boolean;
    preparationMinutes?: number;
    cleanupMinutes?: number;
}
export declare class CheckSlotAvailabilityDto {
    resourceType: 'staff' | 'equipment' | 'space';
    resourceId: string;
    startTime: Date;
    endTime: Date;
    preparationStart?: Date;
    cleanupEnd?: Date;
}
export declare class FindSlotsForAppointmentTypeDto {
    appointmentType: string;
    startDate: Date;
    endDate: Date;
    facilityId?: string;
    preferredStaffIds?: string[];
    preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
    slotInterval?: number;
}
export declare class GetResourceUtilizationDto {
    resourceType: 'staff' | 'equipment' | 'space';
    resourceId: string;
    startDate: Date;
    endDate: Date;
}
export declare class FindNextAvailableSlotDto {
    resourceType: 'staff' | 'equipment' | 'space';
    resourceId: string;
    durationMinutes: number;
    startFrom?: Date;
    maxDaysToSearch?: number;
}
export declare class SuggestAlternativeSlotsDto {
    resourceType: 'staff' | 'equipment' | 'space';
    resourceId: string;
    preferredStartTime: Date;
    durationMinutes: number;
    maxAlternatives?: number;
    searchWindowDays?: number;
}
//# sourceMappingURL=availability.dto.d.ts.map