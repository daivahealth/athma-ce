/**
 * Schedule Controller
 *
 * REST API endpoints for managing resource schedules and blocks
 */
import { ScheduleService } from './schedule.service';
import { CreateStaffScheduleDto, UpdateStaffScheduleDto, CreateEquipmentScheduleDto, UpdateEquipmentScheduleDto, CreateSpaceScheduleDto, UpdateSpaceScheduleDto, CreateResourceBlockDto, UpdateResourceBlockDto, RejectResourceBlockDto, CreateWeeklyScheduleDto } from './dto/schedule.dto';
export declare class ScheduleController {
    private readonly scheduleService;
    constructor(scheduleService: ScheduleService);
    private getContext;
    /**
     * POST /scheduling/staff-schedules - Create staff schedule
     */
    createStaffSchedule(dto: CreateStaffScheduleDto, req: any): Promise<{
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
     * GET /scheduling/staff-schedules/:staffId - Get staff schedules
     */
    getStaffSchedules(staffId: string, effectiveDate?: string, includeExpired?: string, facilityId?: string, req?: any): Promise<{
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
     * PUT /scheduling/staff-schedules/:id - Update staff schedule
     */
    updateStaffSchedule(id: string, dto: UpdateStaffScheduleDto, req: any): Promise<{
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
     * DELETE /scheduling/staff-schedules/:id - Delete staff schedule
     */
    deleteStaffSchedule(id: string, req: any): Promise<void>;
    /**
     * POST /scheduling/staff-schedules/weekly - Create weekly schedule (bulk)
     */
    createWeeklyStaffSchedule(dto: CreateWeeklyScheduleDto, req: any): Promise<{
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
     * POST /scheduling/equipment-schedules - Create equipment schedule
     */
    createEquipmentSchedule(dto: CreateEquipmentScheduleDto, req: any): Promise<{
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
     * GET /scheduling/equipment-schedules/:equipmentId - Get equipment schedules
     */
    getEquipmentSchedules(equipmentId: string, effectiveDate?: string, includeExpired?: string, req?: any): Promise<{
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
     * PUT /scheduling/equipment-schedules/:id - Update equipment schedule
     */
    updateEquipmentSchedule(id: string, dto: UpdateEquipmentScheduleDto, req: any): Promise<{
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
     * DELETE /scheduling/equipment-schedules/:id - Delete equipment schedule
     */
    deleteEquipmentSchedule(id: string, req: any): Promise<void>;
    /**
     * POST /scheduling/space-schedules - Create space schedule
     */
    createSpaceSchedule(dto: CreateSpaceScheduleDto, req: any): Promise<{
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
     * GET /scheduling/space-schedules/:spaceId - Get space schedules
     */
    getSpaceSchedules(spaceId: string, effectiveDate?: string, includeExpired?: string, req?: any): Promise<{
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
     * PUT /scheduling/space-schedules/:id - Update space schedule
     */
    updateSpaceSchedule(id: string, dto: UpdateSpaceScheduleDto, req: any): Promise<{
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
     * DELETE /scheduling/space-schedules/:id - Delete space schedule
     */
    deleteSpaceSchedule(id: string, req: any): Promise<void>;
    /**
     * POST /scheduling/resource-blocks - Create resource block
     */
    createResourceBlock(dto: CreateResourceBlockDto, req: any): Promise<{
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
     * GET /scheduling/resource-blocks - Get resource blocks
     */
    getResourceBlocks(resourceType?: 'staff' | 'equipment' | 'space', resourceId?: string, startDate?: string, endDate?: string, approvalStatus?: 'pending' | 'approved' | 'rejected', facilityId?: string, req?: any): Promise<{
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
     * GET /scheduling/resource-blocks/pending - Get pending approval blocks
     */
    getPendingBlocks(facilityId?: string, req?: any): Promise<{
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
     * PUT /scheduling/resource-blocks/:id - Update resource block
     */
    updateResourceBlock(id: string, dto: UpdateResourceBlockDto, req: any): Promise<{
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
     * POST /scheduling/resource-blocks/:id/approve - Approve resource block
     */
    approveResourceBlock(id: string, req: any): Promise<{
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
     * POST /scheduling/resource-blocks/:id/reject - Reject resource block
     */
    rejectResourceBlock(id: string, dto: RejectResourceBlockDto, req: any): Promise<{
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
     * DELETE /scheduling/resource-blocks/:id - Delete resource block
     */
    deleteResourceBlock(id: string, req: any): Promise<void>;
    /**
     * GET /scheduling/resources/:resourceType/:resourceId/schedules/:date
     * Get all schedules for a resource on a specific date
     */
    getResourceSchedulesForDate(resourceType: 'staff' | 'equipment' | 'space', resourceId: string, date: string, req: any): Promise<{
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
//# sourceMappingURL=schedule.controller.d.ts.map