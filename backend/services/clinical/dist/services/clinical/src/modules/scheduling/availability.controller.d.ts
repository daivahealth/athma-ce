/**
 * Availability Controller
 *
 * REST API endpoints for checking resource availability and finding time slots
 */
import { AvailabilityService } from './availability.service';
import { FindAvailableSlotsDto, CheckSlotAvailabilityDto, FindSlotsForAppointmentTypeDto, GetResourceUtilizationDto, FindNextAvailableSlotDto, SuggestAlternativeSlotsDto } from './dto/availability.dto';
export declare class AvailabilityController {
    private readonly availabilityService;
    constructor(availabilityService: AvailabilityService);
    private getContext;
    /**
     * POST /scheduling/availability/find-slots - Find available slots for a resource
     */
    findAvailableSlots(dto: FindAvailableSlotsDto, req: any): Promise<import("./availability.service").TimeSlot[]>;
    /**
     * POST /scheduling/availability/check-slot - Check if a specific slot is available
     */
    checkSlotAvailability(dto: CheckSlotAvailabilityDto, req: any): Promise<{
        isAvailable: boolean;
    }>;
    /**
     * POST /scheduling/availability/detect-conflicts - Detect conflicts for a resource at a specific time
     */
    detectConflicts(dto: CheckSlotAvailabilityDto, req: any): Promise<{
        conflicts: import("./availability.service").ConflictInfo[];
    }>;
    /**
     * POST /scheduling/availability/find-slots-for-appointment-type
     * Find available slots that satisfy all resource requirements for an appointment type
     */
    findSlotsForAppointmentType(dto: FindSlotsForAppointmentTypeDto, req: any): Promise<import("./availability.service").MultiResourceSlot[]>;
    /**
     * POST /scheduling/availability/utilization - Get resource utilization statistics
     */
    getResourceUtilization(dto: GetResourceUtilizationDto, req: any): Promise<{
        totalMinutes: number;
        bookedMinutes: number;
        blockedMinutes: number;
        availableMinutes: number;
        utilizationPercentage: number;
    }>;
    /**
     * POST /scheduling/availability/next-available - Find next available slot for a resource
     */
    findNextAvailableSlot(dto: FindNextAvailableSlotDto, req: any): Promise<{
        slot: import("./availability.service").TimeSlot | null;
    }>;
    /**
     * POST /scheduling/availability/suggest-alternatives - Suggest alternative time slots
     */
    suggestAlternativeSlots(dto: SuggestAlternativeSlotsDto, req: any): Promise<import("./availability.service").TimeSlot[]>;
    /**
     * GET /scheduling/availability/resources/:resourceType/:resourceId/utilization
     * Get resource utilization (convenience GET endpoint)
     */
    getResourceUtilizationByParams(resourceType: 'staff' | 'equipment' | 'space', resourceId: string, startDate: string, endDate: string, req: any): Promise<{
        totalMinutes: number;
        bookedMinutes: number;
        blockedMinutes: number;
        availableMinutes: number;
        utilizationPercentage: number;
    }>;
}
//# sourceMappingURL=availability.controller.d.ts.map