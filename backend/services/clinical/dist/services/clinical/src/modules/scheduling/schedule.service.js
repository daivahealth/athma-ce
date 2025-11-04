"use strict";
/**
 * Schedule Service
 *
 * Manages resource schedules (staff, equipment, space) and one-time blocks
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
let ScheduleService = class ScheduleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ========================================
    // STAFF SCHEDULES
    // ========================================
    /**
     * Create a new staff schedule
     */
    async createStaffSchedule(dto, context) {
        // Validate time order
        if (dto.startTime >= dto.endTime) {
            throw new common_1.BadRequestException('End time must be after start time');
        }
        // Validate day of week
        if (dto.dayOfWeek < 0 || dto.dayOfWeek > 6) {
            throw new common_1.BadRequestException('Day of week must be between 0 (Sunday) and 6 (Saturday)');
        }
        // Validate effective dates
        if (dto.effectiveTo && dto.effectiveTo < dto.effectiveFrom) {
            throw new common_1.BadRequestException('Effective to date must be after effective from date');
        }
        // Check for conflicting schedules
        const conflict = await this.prisma.staffSchedule.findFirst({
            where: {
                tenantId: context.tenantId,
                staffId: dto.staffId,
                dayOfWeek: dto.dayOfWeek,
                OR: [
                    {
                        effectiveTo: null,
                        effectiveFrom: { lte: dto.effectiveTo || new Date('2100-01-01') }
                    },
                    {
                        effectiveTo: { gte: dto.effectiveFrom },
                        effectiveFrom: { lte: dto.effectiveTo || new Date('2100-01-01') }
                    }
                ]
            }
        });
        if (conflict) {
            throw new common_1.BadRequestException(`Conflicting schedule exists for this staff member on this day of week`);
        }
        const schedule = await this.prisma.staffSchedule.create({
            data: {
                tenantId: context.tenantId,
                staffId: dto.staffId,
                facilityId: dto.facilityId || context.facilityId,
                staffDisplayName: dto.staffDisplayName || null,
                employeeId: dto.employeeId || null,
                staffType: dto.staffType || null,
                dayOfWeek: dto.dayOfWeek,
                startTime: dto.startTime,
                endTime: dto.endTime,
                isAvailable: dto.isAvailable,
                scheduleType: dto.scheduleType || 'regular',
                notes: dto.notes || null,
                effectiveFrom: dto.effectiveFrom,
                effectiveTo: dto.effectiveTo || null,
                createdBy: context.userId,
                updatedBy: context.userId,
            },
        });
        return schedule;
    }
    /**
     * Get staff schedules
     */
    async getStaffSchedules(staffId, context, options) {
        const where = {
            tenantId: context.tenantId,
            staffId,
        };
        if (options?.facilityId) {
            where.facilityId = options.facilityId;
        }
        if (options?.effectiveDate && !options.includeExpired) {
            where.effectiveFrom = { lte: options.effectiveDate };
            where.OR = [
                { effectiveTo: null },
                { effectiveTo: { gte: options.effectiveDate } }
            ];
        }
        return this.prisma.staffSchedule.findMany({
            where,
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ],
        });
    }
    /**
     * Update staff schedule
     */
    async updateStaffSchedule(id, dto, context) {
        const schedule = await this.prisma.staffSchedule.findUnique({
            where: { id },
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Staff schedule not found');
        }
        if (schedule.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        // Validate time order if times are being updated
        const startTime = dto.startTime || schedule.startTime;
        const endTime = dto.endTime || schedule.endTime;
        if (startTime >= endTime) {
            throw new common_1.BadRequestException('End time must be after start time');
        }
        return this.prisma.staffSchedule.update({
            where: { id },
            data: {
                ...dto,
                updatedBy: context.userId,
            },
        });
    }
    /**
     * Delete staff schedule
     */
    async deleteStaffSchedule(id, context) {
        const schedule = await this.prisma.staffSchedule.findUnique({
            where: { id },
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Staff schedule not found');
        }
        if (schedule.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.staffSchedule.delete({
            where: { id },
        });
    }
    /**
     * List scheduled staff summaries
     */
    async listScheduledStaff(context, options) {
        const where = {
            tenantId: context.tenantId,
        };
        if (options?.facilityId) {
            where.facilityId = options.facilityId;
        }
        const schedules = await this.prisma.staffSchedule.findMany({
            where,
            distinct: ['staffId'],
            orderBy: [
                { staffDisplayName: 'asc' },
                { staffType: 'asc' },
            ],
            select: {
                staffId: true,
                staffDisplayName: true,
                staffType: true,
                employeeId: true,
            },
        });
        return schedules;
    }
    // ========================================
    // EQUIPMENT SCHEDULES
    // ========================================
    /**
     * Create equipment schedule
     */
    async createEquipmentSchedule(dto, context) {
        // Validate time order
        if (dto.startTime >= dto.endTime) {
            throw new common_1.BadRequestException('End time must be after start time');
        }
        // Validate day of week
        if (dto.dayOfWeek < 0 || dto.dayOfWeek > 6) {
            throw new common_1.BadRequestException('Day of week must be between 0 and 6');
        }
        const schedule = await this.prisma.equipmentSchedule.create({
            data: {
                tenantId: context.tenantId,
                equipmentId: dto.equipmentId,
                facilityId: dto.facilityId || context.facilityId,
                dayOfWeek: dto.dayOfWeek,
                startTime: dto.startTime,
                endTime: dto.endTime,
                isAvailable: dto.isAvailable,
                maintenanceType: dto.maintenanceType || null,
                notes: dto.notes || null,
                effectiveFrom: dto.effectiveFrom,
                effectiveTo: dto.effectiveTo || null,
                createdBy: context.userId,
                updatedBy: context.userId,
            },
        });
        return schedule;
    }
    /**
     * Get equipment schedules
     */
    async getEquipmentSchedules(equipmentId, context, options) {
        const where = {
            tenantId: context.tenantId,
            equipmentId,
        };
        if (options?.effectiveDate && !options.includeExpired) {
            where.effectiveFrom = { lte: options.effectiveDate };
            where.OR = [
                { effectiveTo: null },
                { effectiveTo: { gte: options.effectiveDate } }
            ];
        }
        return this.prisma.equipmentSchedule.findMany({
            where,
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ],
        });
    }
    /**
     * Update equipment schedule
     */
    async updateEquipmentSchedule(id, dto, context) {
        const schedule = await this.prisma.equipmentSchedule.findUnique({
            where: { id },
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Equipment schedule not found');
        }
        if (schedule.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.equipmentSchedule.update({
            where: { id },
            data: {
                ...dto,
                updatedBy: context.userId,
            },
        });
    }
    /**
     * Delete equipment schedule
     */
    async deleteEquipmentSchedule(id, context) {
        const schedule = await this.prisma.equipmentSchedule.findUnique({
            where: { id },
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Equipment schedule not found');
        }
        if (schedule.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.equipmentSchedule.delete({
            where: { id },
        });
    }
    // ========================================
    // SPACE SCHEDULES
    // ========================================
    /**
     * Create space schedule
     */
    async createSpaceSchedule(dto, context) {
        // Validate time order
        if (dto.startTime >= dto.endTime) {
            throw new common_1.BadRequestException('End time must be after start time');
        }
        // Validate day of week
        if (dto.dayOfWeek < 0 || dto.dayOfWeek > 6) {
            throw new common_1.BadRequestException('Day of week must be between 0 and 6');
        }
        const schedule = await this.prisma.spaceSchedule.create({
            data: {
                tenantId: context.tenantId,
                spaceId: dto.spaceId,
                facilityId: dto.facilityId || context.facilityId,
                dayOfWeek: dto.dayOfWeek,
                startTime: dto.startTime,
                endTime: dto.endTime,
                isAvailable: dto.isAvailable,
                blockReason: dto.blockReason || null,
                notes: dto.notes || null,
                effectiveFrom: dto.effectiveFrom,
                effectiveTo: dto.effectiveTo || null,
                createdBy: context.userId,
                updatedBy: context.userId,
            },
        });
        return schedule;
    }
    /**
     * Get space schedules
     */
    async getSpaceSchedules(spaceId, context, options) {
        const where = {
            tenantId: context.tenantId,
            spaceId,
        };
        if (options?.effectiveDate && !options.includeExpired) {
            where.effectiveFrom = { lte: options.effectiveDate };
            where.OR = [
                { effectiveTo: null },
                { effectiveTo: { gte: options.effectiveDate } }
            ];
        }
        return this.prisma.spaceSchedule.findMany({
            where,
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ],
        });
    }
    /**
     * Update space schedule
     */
    async updateSpaceSchedule(id, dto, context) {
        const schedule = await this.prisma.spaceSchedule.findUnique({
            where: { id },
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Space schedule not found');
        }
        if (schedule.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.spaceSchedule.update({
            where: { id },
            data: {
                ...dto,
                updatedBy: context.userId,
            },
        });
    }
    /**
     * Delete space schedule
     */
    async deleteSpaceSchedule(id, context) {
        const schedule = await this.prisma.spaceSchedule.findUnique({
            where: { id },
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Space schedule not found');
        }
        if (schedule.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.spaceSchedule.delete({
            where: { id },
        });
    }
    // ========================================
    // RESOURCE BLOCKS
    // ========================================
    /**
     * Create resource block
     */
    async createResourceBlock(dto, context) {
        // Validate time order
        if (dto.startDatetime >= dto.endDatetime) {
            throw new common_1.BadRequestException('End datetime must be after start datetime');
        }
        // Auto-approve emergency blocks, others pending
        const approvalStatus = dto.blockType === 'emergency' ? 'approved' : 'pending';
        const approvedBy = dto.blockType === 'emergency' ? context.userId : null;
        const approvedAt = dto.blockType === 'emergency' ? new Date() : null;
        const block = await this.prisma.resourceBlock.create({
            data: {
                tenantId: context.tenantId,
                resourceType: dto.resourceType,
                resourceId: dto.resourceId,
                facilityId: dto.facilityId || context.facilityId,
                blockType: dto.blockType,
                startDatetime: dto.startDatetime,
                endDatetime: dto.endDatetime,
                isAvailable: dto.isAvailable,
                reason: dto.reason || null,
                approvalStatus,
                approvedBy,
                approvedAt,
                createdBy: context.userId,
                updatedBy: context.userId,
            },
        });
        return block;
    }
    /**
     * Get resource blocks
     */
    async getResourceBlocks(context, options) {
        const where = {
            tenantId: context.tenantId,
        };
        if (options?.resourceType) {
            where.resourceType = options.resourceType;
        }
        if (options?.resourceId) {
            where.resourceId = options.resourceId;
        }
        if (options?.approvalStatus) {
            where.approvalStatus = options.approvalStatus;
        }
        if (options?.facilityId) {
            where.facilityId = options.facilityId;
        }
        if (options?.startDate || options?.endDate) {
            where.AND = [];
            if (options.startDate) {
                where.AND.push({ endDatetime: { gte: options.startDate } });
            }
            if (options.endDate) {
                where.AND.push({ startDatetime: { lte: options.endDate } });
            }
        }
        return this.prisma.resourceBlock.findMany({
            where,
            orderBy: { startDatetime: 'asc' },
        });
    }
    /**
     * Get pending approval blocks
     */
    async getPendingBlocks(context, facilityId) {
        const where = {
            tenantId: context.tenantId,
            approvalStatus: 'pending',
        };
        if (facilityId) {
            where.facilityId = facilityId;
        }
        return this.prisma.resourceBlock.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    /**
     * Approve resource block
     */
    async approveResourceBlock(id, context) {
        const block = await this.prisma.resourceBlock.findUnique({
            where: { id },
        });
        if (!block) {
            throw new common_1.NotFoundException('Resource block not found');
        }
        if (block.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (block.approvalStatus !== 'pending') {
            throw new common_1.BadRequestException('Block is not pending approval');
        }
        return this.prisma.resourceBlock.update({
            where: { id },
            data: {
                approvalStatus: 'approved',
                approvedBy: context.userId,
                approvedAt: new Date(),
                updatedBy: context.userId,
            },
        });
    }
    /**
     * Reject resource block
     */
    async rejectResourceBlock(id, reason, context) {
        const block = await this.prisma.resourceBlock.findUnique({
            where: { id },
        });
        if (!block) {
            throw new common_1.NotFoundException('Resource block not found');
        }
        if (block.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (block.approvalStatus !== 'pending') {
            throw new common_1.BadRequestException('Block is not pending approval');
        }
        return this.prisma.resourceBlock.update({
            where: { id },
            data: {
                approvalStatus: 'rejected',
                approvedBy: context.userId,
                approvedAt: new Date(),
                reason: reason,
                updatedBy: context.userId,
            },
        });
    }
    /**
     * Update resource block
     */
    async updateResourceBlock(id, dto, context) {
        const block = await this.prisma.resourceBlock.findUnique({
            where: { id },
        });
        if (!block) {
            throw new common_1.NotFoundException('Resource block not found');
        }
        if (block.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        // Validate time order if dates are being updated
        const startDatetime = dto.startDatetime || block.startDatetime;
        const endDatetime = dto.endDatetime || block.endDatetime;
        if (startDatetime >= endDatetime) {
            throw new common_1.BadRequestException('End datetime must be after start datetime');
        }
        return this.prisma.resourceBlock.update({
            where: { id },
            data: {
                ...dto,
                updatedBy: context.userId,
            },
        });
    }
    /**
     * Delete resource block
     */
    async deleteResourceBlock(id, context) {
        const block = await this.prisma.resourceBlock.findUnique({
            where: { id },
        });
        if (!block) {
            throw new common_1.NotFoundException('Resource block not found');
        }
        if (block.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.resourceBlock.delete({
            where: { id },
        });
    }
    // ========================================
    // BULK OPERATIONS
    // ========================================
    /**
     * Create weekly staff schedule (Monday-Friday same times)
     */
    async createWeeklyStaffSchedule(staff, days, // Array of day numbers, e.g., [1, 2, 3, 4, 5] for Mon-Fri
    startTime, endTime, options, context) {
        const schedules = [];
        for (const dayOfWeek of days) {
            const employeeIdValue = staff.employeeId ?? options.employeeId;
            const staffDisplayNameValue = staff.staffDisplayName ?? options.staffDisplayName;
            const staffTypeValue = staff.staffType ?? options.staffType;
            const facilityIdValue = options.facilityId ?? context.facilityId;
            const scheduleData = {
                staffId: staff.staffId,
                dayOfWeek,
                startTime,
                endTime,
                isAvailable: options.isAvailable,
                effectiveFrom: options.effectiveFrom,
            };
            if (facilityIdValue) {
                scheduleData.facilityId = facilityIdValue;
            }
            if (options.scheduleType) {
                scheduleData.scheduleType = options.scheduleType;
            }
            if (options.notes) {
                scheduleData.notes = options.notes;
            }
            if (options.effectiveTo) {
                scheduleData.effectiveTo = options.effectiveTo;
            }
            if (staffDisplayNameValue) {
                scheduleData.staffDisplayName = staffDisplayNameValue;
            }
            if (employeeIdValue) {
                scheduleData.employeeId = employeeIdValue;
            }
            if (staffTypeValue) {
                scheduleData.staffType = staffTypeValue;
            }
            const schedule = await this.createStaffSchedule(scheduleData, context);
            schedules.push(schedule);
        }
        return schedules;
    }
    /**
     * Get all schedules for a resource on a specific date
     */
    async getResourceSchedulesForDate(resourceType, resourceId, date, context) {
        const dayOfWeek = date.getDay();
        let recurringSchedules = [];
        // Get recurring schedule
        if (resourceType === 'staff') {
            recurringSchedules = await this.prisma.staffSchedule.findMany({
                where: {
                    tenantId: context.tenantId,
                    staffId: resourceId,
                    dayOfWeek,
                    effectiveFrom: { lte: date },
                    OR: [
                        { effectiveTo: null },
                        { effectiveTo: { gte: date } }
                    ]
                },
                orderBy: { startTime: 'asc' }
            });
        }
        else if (resourceType === 'equipment') {
            recurringSchedules = await this.prisma.equipmentSchedule.findMany({
                where: {
                    tenantId: context.tenantId,
                    equipmentId: resourceId,
                    dayOfWeek,
                    effectiveFrom: { lte: date },
                    OR: [
                        { effectiveTo: null },
                        { effectiveTo: { gte: date } }
                    ]
                },
                orderBy: { startTime: 'asc' }
            });
        }
        else if (resourceType === 'space') {
            recurringSchedules = await this.prisma.spaceSchedule.findMany({
                where: {
                    tenantId: context.tenantId,
                    spaceId: resourceId,
                    dayOfWeek,
                    effectiveFrom: { lte: date },
                    OR: [
                        { effectiveTo: null },
                        { effectiveTo: { gte: date } }
                    ]
                },
                orderBy: { startTime: 'asc' }
            });
        }
        // Get one-time blocks
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const blocks = await this.prisma.resourceBlock.findMany({
            where: {
                tenantId: context.tenantId,
                resourceType,
                resourceId,
                approvalStatus: 'approved',
                startDatetime: { lte: endOfDay },
                endDatetime: { gte: startOfDay }
            },
            orderBy: { startDatetime: 'asc' }
        });
        return {
            recurringSchedules,
            blocks,
        };
    }
};
exports.ScheduleService = ScheduleService;
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map