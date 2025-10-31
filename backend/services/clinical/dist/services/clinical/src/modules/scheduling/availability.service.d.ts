/**
 * Availability Service
 *
 * Finds available time slots considering schedules, blocks, and existing appointments
 */
import { PrismaService } from '@zeal/database-clinical';
export interface RequestContext {
    userId: string;
    tenantId: string;
    facilityId: string;
    userRole: string;
}
export interface TimeSlot {
    startTime: Date;
    endTime: Date;
}
export interface ResourceAvailability {
    resourceType: 'staff' | 'equipment' | 'space';
    resourceId: string;
    availableSlots: TimeSlot[];
}
export interface MultiResourceSlot {
    startTime: Date;
    endTime: Date;
    resources: Array<{
        type: 'staff' | 'equipment' | 'space';
        id: string;
        role?: string;
    }>;
}
export interface ConflictInfo {
    type: 'SCHEDULE_UNAVAILABLE' | 'BLOCKED' | 'DOUBLE_BOOKING' | 'OUTSIDE_WORKING_HOURS';
    message: string;
    details?: any;
}
export declare class AvailabilityService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Find available slots for a specific resource
     */
    findAvailableSlots(resourceType: 'staff' | 'equipment' | 'space', resourceId: string, startDate: Date, endDate: Date, durationMinutes: number, context: RequestContext, options?: {
        facilityId?: string;
        slotInterval?: number;
        includePreparationTime?: boolean;
        preparationMinutes?: number;
        cleanupMinutes?: number;
    }): Promise<TimeSlot[]>;
    /**
     * Find available slots for a single day
     */
    private findAvailableSlotsForDay;
    /**
     * Get recurring schedules for a specific day
     */
    private getRecurringSchedulesForDay;
    /**
     * Check if a specific slot is available for a resource
     */
    isSlotAvailable(resourceType: 'staff' | 'equipment' | 'space', resourceId: string, startTime: Date, endTime: Date, context: RequestContext, options?: {
        includePreparationTime?: boolean;
        preparationStart?: Date;
        cleanupEnd?: Date;
    }): Promise<boolean>;
    /**
     * Detect conflicts for a resource at a specific time
     */
    detectConflicts(resourceType: 'staff' | 'equipment' | 'space', resourceId: string, startTime: Date, endTime: Date, context: RequestContext, options?: {
        preparationStart?: Date;
        cleanupEnd?: Date;
    }): Promise<ConflictInfo[]>;
    /**
     * Find available slots that satisfy all resource requirements for an appointment type
     */
    findAvailableSlotsForAppointmentType(appointmentType: string, startDate: Date, endDate: Date, context: RequestContext, options?: {
        facilityId?: string;
        preferredStaffIds?: string[];
        preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
        slotInterval?: number;
    }): Promise<MultiResourceSlot[]>;
    /**
     * Get resource utilization statistics
     */
    getResourceUtilization(resourceType: 'staff' | 'equipment' | 'space', resourceId: string, startDate: Date, endDate: Date, context: RequestContext): Promise<{
        totalMinutes: number;
        bookedMinutes: number;
        blockedMinutes: number;
        availableMinutes: number;
        utilizationPercentage: number;
    }>;
    /**
     * Find next available slot for a resource
     */
    findNextAvailableSlot(resourceType: 'staff' | 'equipment' | 'space', resourceId: string, durationMinutes: number, context: RequestContext, options?: {
        startFrom?: Date;
        maxDaysToSearch?: number;
    }): Promise<TimeSlot | null>;
    /**
     * Suggest alternative time slots when preferred slot is unavailable
     */
    suggestAlternativeSlots(resourceType: 'staff' | 'equipment' | 'space', resourceId: string, preferredStartTime: Date, durationMinutes: number, context: RequestContext, options?: {
        maxAlternatives?: number;
        searchWindowDays?: number;
    }): Promise<TimeSlot[]>;
}
//# sourceMappingURL=availability.service.d.ts.map