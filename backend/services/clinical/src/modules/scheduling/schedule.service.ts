/**
 * Schedule Service
 *
 * Manages resource schedules (staff, equipment, space) and one-time blocks
 */

import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

export interface RequestContext {
  userId: string;
  tenantId: string;
  facilityId: string;
  userRole: string;
}

// ========================================
// STAFF SCHEDULE DTOs
// ========================================

export interface CreateStaffScheduleDto {
  staffId: string;
  facilityId?: string;
  staffDisplayName?: string;
  employeeId?: string;
  staffType?: string;
  dayOfWeek: number; // 0-6
  startTime: string; // "HH:MM:SS"
  endTime: string; // "HH:MM:SS"
  isAvailable: boolean;
  scheduleType?: string; // 'regular', 'on-call', 'special'
  notes?: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export interface UpdateStaffScheduleDto {
  staffDisplayName?: string;
  employeeId?: string;
  staffType?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
  scheduleType?: string;
  notes?: string;
  effectiveFrom?: Date;
  effectiveTo?: Date;
}

// ========================================
// EQUIPMENT SCHEDULE DTOs
// ========================================

export interface CreateEquipmentScheduleDto {
  equipmentId: string;
  facilityId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maintenanceType?: string; // 'scheduled_maintenance', 'emergency_repair', 'calibration'
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

// ========================================
// SPACE SCHEDULE DTOs
// ========================================

export interface CreateSpaceScheduleDto {
  spaceId: string;
  facilityId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  blockReason?: string; // 'maintenance', 'cleaning', 'renovation'
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

// ========================================
// RESOURCE BLOCK DTOs
// ========================================

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

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  // ========================================
  // STAFF SCHEDULES
  // ========================================

  /**
   * Create a new staff schedule
   */
  async createStaffSchedule(
    dto: CreateStaffScheduleDto,
    context: RequestContext
  ) {
    // Validate time order
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('End time must be after start time');
    }

    // Validate day of week
    if (dto.dayOfWeek < 0 || dto.dayOfWeek > 6) {
      throw new BadRequestException('Day of week must be between 0 (Sunday) and 6 (Saturday)');
    }

    // Validate effective dates
    if (dto.effectiveTo && dto.effectiveTo < dto.effectiveFrom) {
      throw new BadRequestException('Effective to date must be after effective from date');
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
      throw new BadRequestException(
        `Conflicting schedule exists for this staff member on this day of week`
      );
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
  async getStaffSchedules(
    staffId: string,
    context: RequestContext,
    options?: {
      effectiveDate?: Date;
      includeExpired?: boolean;
      facilityId?: string;
    }
  ) {
    const where: any = {
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
  async updateStaffSchedule(
    id: string,
    dto: UpdateStaffScheduleDto,
    context: RequestContext
  ) {
    const schedule = await this.prisma.staffSchedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Staff schedule not found');
    }

    if (schedule.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    // Validate time order if times are being updated
    const startTime = dto.startTime || schedule.startTime;
    const endTime = dto.endTime || schedule.endTime;
    if (startTime >= endTime) {
      throw new BadRequestException('End time must be after start time');
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
  async deleteStaffSchedule(id: string, context: RequestContext) {
    const schedule = await this.prisma.staffSchedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Staff schedule not found');
    }

    if (schedule.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.staffSchedule.delete({
      where: { id },
    });
  }

  /**
   * List scheduled staff summaries
   */
  async listScheduledStaff(
    context: RequestContext,
    options?: { facilityId?: string }
  ) {
    const where: any = {
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
  async createEquipmentSchedule(
    dto: CreateEquipmentScheduleDto,
    context: RequestContext
  ) {
    // Validate time order
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('End time must be after start time');
    }

    // Validate day of week
    if (dto.dayOfWeek < 0 || dto.dayOfWeek > 6) {
      throw new BadRequestException('Day of week must be between 0 and 6');
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
  async getEquipmentSchedules(
    equipmentId: string,
    context: RequestContext,
    options?: {
      effectiveDate?: Date;
      includeExpired?: boolean;
    }
  ) {
    const where: any = {
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
  async updateEquipmentSchedule(
    id: string,
    dto: UpdateEquipmentScheduleDto,
    context: RequestContext
  ) {
    const schedule = await this.prisma.equipmentSchedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Equipment schedule not found');
    }

    if (schedule.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
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
  async deleteEquipmentSchedule(id: string, context: RequestContext) {
    const schedule = await this.prisma.equipmentSchedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Equipment schedule not found');
    }

    if (schedule.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
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
  async createSpaceSchedule(
    dto: CreateSpaceScheduleDto,
    context: RequestContext
  ) {
    // Validate time order
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('End time must be after start time');
    }

    // Validate day of week
    if (dto.dayOfWeek < 0 || dto.dayOfWeek > 6) {
      throw new BadRequestException('Day of week must be between 0 and 6');
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
  async getSpaceSchedules(
    spaceId: string,
    context: RequestContext,
    options?: {
      effectiveDate?: Date;
      includeExpired?: boolean;
    }
  ) {
    const where: any = {
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
  async updateSpaceSchedule(
    id: string,
    dto: UpdateSpaceScheduleDto,
    context: RequestContext
  ) {
    const schedule = await this.prisma.spaceSchedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Space schedule not found');
    }

    if (schedule.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
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
  async deleteSpaceSchedule(id: string, context: RequestContext) {
    const schedule = await this.prisma.spaceSchedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Space schedule not found');
    }

    if (schedule.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
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
  async createResourceBlock(
    dto: CreateResourceBlockDto,
    context: RequestContext
  ) {
    // Validate time order
    if (dto.startDatetime >= dto.endDatetime) {
      throw new BadRequestException('End datetime must be after start datetime');
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
  async getResourceBlocks(
    context: RequestContext,
    options?: {
      resourceType?: 'staff' | 'equipment' | 'space';
      resourceId?: string;
      startDate?: Date;
      endDate?: Date;
      approvalStatus?: 'pending' | 'approved' | 'rejected';
      facilityId?: string;
    }
  ) {
    const where: any = {
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
  async getPendingBlocks(context: RequestContext, facilityId?: string) {
    const where: any = {
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
  async approveResourceBlock(
    id: string,
    context: RequestContext
  ) {
    const block = await this.prisma.resourceBlock.findUnique({
      where: { id },
    });

    if (!block) {
      throw new NotFoundException('Resource block not found');
    }

    if (block.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    if (block.approvalStatus !== 'pending') {
      throw new BadRequestException('Block is not pending approval');
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
  async rejectResourceBlock(
    id: string,
    reason: string,
    context: RequestContext
  ) {
    const block = await this.prisma.resourceBlock.findUnique({
      where: { id },
    });

    if (!block) {
      throw new NotFoundException('Resource block not found');
    }

    if (block.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    if (block.approvalStatus !== 'pending') {
      throw new BadRequestException('Block is not pending approval');
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
  async updateResourceBlock(
    id: string,
    dto: UpdateResourceBlockDto,
    context: RequestContext
  ) {
    const block = await this.prisma.resourceBlock.findUnique({
      where: { id },
    });

    if (!block) {
      throw new NotFoundException('Resource block not found');
    }

    if (block.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    // Validate time order if dates are being updated
    const startDatetime = dto.startDatetime || block.startDatetime;
    const endDatetime = dto.endDatetime || block.endDatetime;
    if (startDatetime >= endDatetime) {
      throw new BadRequestException('End datetime must be after start datetime');
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
  async deleteResourceBlock(id: string, context: RequestContext) {
    const block = await this.prisma.resourceBlock.findUnique({
      where: { id },
    });

    if (!block) {
      throw new NotFoundException('Resource block not found');
    }

    if (block.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
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
  async createWeeklyStaffSchedule(
    staff: { staffId: string; staffDisplayName?: string; employeeId?: string; staffType?: string },
    days: number[], // Array of day numbers, e.g., [1, 2, 3, 4, 5] for Mon-Fri
    startTime: string,
    endTime: string,
    options: {
      isAvailable: boolean;
      scheduleType?: string;
      facilityId?: string;
      effectiveFrom: Date;
      effectiveTo?: Date;
      notes?: string;
      staffDisplayName?: string;
      employeeId?: string;
      staffType?: string;
    },
    context: RequestContext
  ) {
    const schedules = [];

    for (const dayOfWeek of days) {
      const employeeIdValue = staff.employeeId ?? options.employeeId;
      const staffDisplayNameValue = staff.staffDisplayName ?? options.staffDisplayName;
      const staffTypeValue = staff.staffType ?? options.staffType;
      const facilityIdValue = options.facilityId ?? context.facilityId;

      const scheduleData: CreateStaffScheduleDto = {
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

      const schedule = await this.createStaffSchedule(
        scheduleData,
        context
      );
      schedules.push(schedule);
    }

    return schedules;
  }

  /**
   * Get all schedules for a resource on a specific date
   */
  async getResourceSchedulesForDate(
    resourceType: 'staff' | 'equipment' | 'space',
    resourceId: string,
    date: Date,
    context: RequestContext
  ) {
    const dayOfWeek = date.getDay();

    let recurringSchedules: any[] = [];

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
    } else if (resourceType === 'equipment') {
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
    } else if (resourceType === 'space') {
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
}
