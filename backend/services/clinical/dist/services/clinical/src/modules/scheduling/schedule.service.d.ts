/**
 * Schedule Service
 *
 * Manages resource schedules (staff, equipment, space) and one-time blocks
 */
import { PrismaService } from '@zeal/database-clinical';
export interface RequestContext {
    userId: string;
    tenantId: string;
    facilityId: string;
    userRole: string;
}
export interface CreateStaffScheduleDto {
    staffId: string;
    facilityId?: string;
    staffDisplayName?: string;
    staffCode?: string;
    facilityCode?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    scheduleType?: string;
    notes?: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
}
export interface UpdateStaffScheduleDto {
    staffDisplayName?: string;
    staffCode?: string;
    facilityCode?: string;
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    scheduleType?: string;
    notes?: string;
    effectiveFrom?: Date;
    effectiveTo?: Date;
}
export interface CreateEquipmentScheduleDto {
    equipmentId: string;
    facilityId?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    maintenanceType?: string;
    notes?: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
}
export interface UpdateEquipmentScheduleDto {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    maintenanceType?: string;
    notes?: string;
    effectiveFrom?: Date;
    effectiveTo?: Date;
}
export interface CreateSpaceScheduleDto {
    spaceId: string;
    facilityId?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    blockReason?: string;
    notes?: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
}
export interface UpdateSpaceScheduleDto {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    blockReason?: string;
    notes?: string;
    effectiveFrom?: Date;
    effectiveTo?: Date;
}
export interface CreateResourceBlockDto {
    resourceType: 'staff' | 'equipment' | 'space';
    resourceId: string;
    facilityId?: string;
    blockType: 'vacation' | 'sick_leave' | 'maintenance' | 'emergency' | 'special_event';
    startDatetime: Date;
    endDatetime: Date;
    isAvailable: boolean;
    reason?: string;
}
export interface UpdateResourceBlockDto {
    blockType?: 'vacation' | 'sick_leave' | 'maintenance' | 'emergency' | 'special_event';
    startDatetime?: Date;
    endDatetime?: Date;
    isAvailable?: boolean;
    reason?: string;
}
export declare class ScheduleService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Create a new staff schedule
     */
    createStaffSchedule(dto: CreateStaffScheduleDto, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        staffId: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        staffDisplayName: string | null;
        staffCode: string | null;
        facilityCode: string | null;
        dayOfWeek: number;
        isAvailable: boolean;
        scheduleType: string;
        effectiveTo: Date | null;
    }>;
    /**
     * Get staff schedules
     */
    getStaffSchedules(staffId: string, context: RequestContext, options?: {
        effectiveDate?: Date;
        includeExpired?: boolean;
        facilityId?: string;
    }): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        staffId: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        staffDisplayName: string | null;
        staffCode: string | null;
        facilityCode: string | null;
        dayOfWeek: number;
        isAvailable: boolean;
        scheduleType: string;
        effectiveTo: Date | null;
    }[]>;
    /**
     * Update staff schedule
     */
    updateStaffSchedule(id: string, dto: UpdateStaffScheduleDto, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        staffId: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        staffDisplayName: string | null;
        staffCode: string | null;
        facilityCode: string | null;
        dayOfWeek: number;
        isAvailable: boolean;
        scheduleType: string;
        effectiveTo: Date | null;
    }>;
    /**
     * Delete staff schedule
     */
    deleteStaffSchedule(id: string, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        staffId: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        staffDisplayName: string | null;
        staffCode: string | null;
        facilityCode: string | null;
        dayOfWeek: number;
        isAvailable: boolean;
        scheduleType: string;
        effectiveTo: Date | null;
    }>;
    /**
     * Create equipment schedule
     */
    createEquipmentSchedule(dto: CreateEquipmentScheduleDto, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        dayOfWeek: number;
        isAvailable: boolean;
        effectiveTo: Date | null;
        equipmentId: string;
        maintenanceType: string | null;
    }>;
    /**
     * Get equipment schedules
     */
    getEquipmentSchedules(equipmentId: string, context: RequestContext, options?: {
        effectiveDate?: Date;
        includeExpired?: boolean;
    }): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        dayOfWeek: number;
        isAvailable: boolean;
        effectiveTo: Date | null;
        equipmentId: string;
        maintenanceType: string | null;
    }[]>;
    /**
     * Update equipment schedule
     */
    updateEquipmentSchedule(id: string, dto: UpdateEquipmentScheduleDto, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        dayOfWeek: number;
        isAvailable: boolean;
        effectiveTo: Date | null;
        equipmentId: string;
        maintenanceType: string | null;
    }>;
    /**
     * Delete equipment schedule
     */
    deleteEquipmentSchedule(id: string, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        dayOfWeek: number;
        isAvailable: boolean;
        effectiveTo: Date | null;
        equipmentId: string;
        maintenanceType: string | null;
    }>;
    /**
     * Create space schedule
     */
    createSpaceSchedule(dto: CreateSpaceScheduleDto, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        spaceId: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        dayOfWeek: number;
        isAvailable: boolean;
        effectiveTo: Date | null;
        blockReason: string | null;
    }>;
    /**
     * Get space schedules
     */
    getSpaceSchedules(spaceId: string, context: RequestContext, options?: {
        effectiveDate?: Date;
        includeExpired?: boolean;
    }): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        spaceId: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        dayOfWeek: number;
        isAvailable: boolean;
        effectiveTo: Date | null;
        blockReason: string | null;
    }[]>;
    /**
     * Update space schedule
     */
    updateSpaceSchedule(id: string, dto: UpdateSpaceScheduleDto, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        spaceId: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        dayOfWeek: number;
        isAvailable: boolean;
        effectiveTo: Date | null;
        blockReason: string | null;
    }>;
    /**
     * Delete space schedule
     */
    deleteSpaceSchedule(id: string, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        spaceId: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        dayOfWeek: number;
        isAvailable: boolean;
        effectiveTo: Date | null;
        blockReason: string | null;
    }>;
    /**
     * Create resource block
     */
    createResourceBlock(dto: CreateResourceBlockDto, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        approvedBy: string | null;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        reason: string | null;
        isAvailable: boolean;
        resourceType: string;
        resourceId: string;
        blockType: string;
        startDatetime: Date;
        endDatetime: Date;
        approvalStatus: string;
        approvedAt: Date | null;
    }>;
    /**
     * Get resource blocks
     */
    getResourceBlocks(context: RequestContext, options?: {
        resourceType?: 'staff' | 'equipment' | 'space';
        resourceId?: string;
        startDate?: Date;
        endDate?: Date;
        approvalStatus?: 'pending' | 'approved' | 'rejected';
        facilityId?: string;
    }): Promise<{
        id: string;
        tenantId: string;
        approvedBy: string | null;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        reason: string | null;
        isAvailable: boolean;
        resourceType: string;
        resourceId: string;
        blockType: string;
        startDatetime: Date;
        endDatetime: Date;
        approvalStatus: string;
        approvedAt: Date | null;
    }[]>;
    /**
     * Get pending approval blocks
     */
    getPendingBlocks(context: RequestContext, facilityId?: string): Promise<{
        id: string;
        tenantId: string;
        approvedBy: string | null;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        reason: string | null;
        isAvailable: boolean;
        resourceType: string;
        resourceId: string;
        blockType: string;
        startDatetime: Date;
        endDatetime: Date;
        approvalStatus: string;
        approvedAt: Date | null;
    }[]>;
    /**
     * Approve resource block
     */
    approveResourceBlock(id: string, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        approvedBy: string | null;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        reason: string | null;
        isAvailable: boolean;
        resourceType: string;
        resourceId: string;
        blockType: string;
        startDatetime: Date;
        endDatetime: Date;
        approvalStatus: string;
        approvedAt: Date | null;
    }>;
    /**
     * Reject resource block
     */
    rejectResourceBlock(id: string, reason: string, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        approvedBy: string | null;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        reason: string | null;
        isAvailable: boolean;
        resourceType: string;
        resourceId: string;
        blockType: string;
        startDatetime: Date;
        endDatetime: Date;
        approvalStatus: string;
        approvedAt: Date | null;
    }>;
    /**
     * Update resource block
     */
    updateResourceBlock(id: string, dto: UpdateResourceBlockDto, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        approvedBy: string | null;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        reason: string | null;
        isAvailable: boolean;
        resourceType: string;
        resourceId: string;
        blockType: string;
        startDatetime: Date;
        endDatetime: Date;
        approvalStatus: string;
        approvedAt: Date | null;
    }>;
    /**
     * Delete resource block
     */
    deleteResourceBlock(id: string, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        approvedBy: string | null;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        reason: string | null;
        isAvailable: boolean;
        resourceType: string;
        resourceId: string;
        blockType: string;
        startDatetime: Date;
        endDatetime: Date;
        approvalStatus: string;
        approvedAt: Date | null;
    }>;
    /**
     * Create weekly staff schedule (Monday-Friday same times)
     */
    createWeeklyStaffSchedule(staff: {
        staffId: string;
        staffCode?: string;
        staffDisplayName?: string;
    }, days: number[], // Array of day numbers, e.g., [1, 2, 3, 4, 5] for Mon-Fri
    startTime: string, endTime: string, options: {
        isAvailable: boolean;
        scheduleType?: string;
        facilityId?: string;
        effectiveFrom: Date;
        effectiveTo?: Date;
        notes?: string;
        staffCode?: string;
        staffDisplayName?: string;
    }, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string | null;
        startTime: string;
        staffId: string;
        endTime: string;
        notes: string | null;
        effectiveFrom: Date;
        staffDisplayName: string | null;
        staffCode: string | null;
        facilityCode: string | null;
        dayOfWeek: number;
        isAvailable: boolean;
        scheduleType: string;
        effectiveTo: Date | null;
    }[]>;
    /**
     * Get all schedules for a resource on a specific date
     */
    getResourceSchedulesForDate(resourceType: 'staff' | 'equipment' | 'space', resourceId: string, date: Date, context: RequestContext): Promise<{
        recurringSchedules: any[];
        blocks: {
            id: string;
            tenantId: string;
            approvedBy: string | null;
            createdBy: string | null;
            updatedBy: string | null;
            createdAt: Date;
            updatedAt: Date;
            facilityId: string | null;
            reason: string | null;
            isAvailable: boolean;
            resourceType: string;
            resourceId: string;
            blockType: string;
            startDatetime: Date;
            endDatetime: Date;
            approvalStatus: string;
            approvedAt: Date | null;
        }[];
    }>;
}
//# sourceMappingURL=schedule.service.d.ts.map