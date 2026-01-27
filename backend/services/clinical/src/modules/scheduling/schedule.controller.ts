/**
 * Schedule Controller
 *
 * REST API endpoints for managing resource schedules and blocks
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import {
  CreateStaffScheduleDto,
  UpdateStaffScheduleDto,
  CreateEquipmentScheduleDto,
  UpdateEquipmentScheduleDto,
  CreateSpaceScheduleDto,
  UpdateSpaceScheduleDto,
  CreateResourceBlockDto,
  UpdateResourceBlockDto,
  RejectResourceBlockDto,
  CreateWeeklyScheduleDto,
} from './dto/schedule.dto';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  SCHEDULE_READ,
  SCHEDULE_CREATE,
  SCHEDULE_UPDATE,
  SCHEDULE_DELETE,
} from '@zeal/contracts';

@Controller('scheduling')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  private getContext(req: any) {
    // Context is set by TenantContextMiddleware in req.context
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    return req.context;
  }

  // ========================================
  // STAFF SCHEDULES
  // ========================================

  /**
   * POST /scheduling/staff-schedules - Create staff schedule
   */
  @Post('staff-schedules')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(SCHEDULE_CREATE)
  async createStaffSchedule(
    @Body() dto: CreateStaffScheduleDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.createStaffSchedule(dto, context);
  }

  /**
   * GET /scheduling/staff-schedules - List scheduled staff
   */
  @Get('staff-schedules')
  @Permissions(SCHEDULE_READ)
  async listScheduledStaff(
    @Query('facilityId') facilityId: string | undefined,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    const options = facilityId ? { facilityId } : undefined;
    return this.scheduleService.listScheduledStaff(context, options);
  }

  /**
   * GET /scheduling/staff-schedules/:staffId - Get staff schedules
   */
  @Get('staff-schedules/:staffId')
  @Permissions(SCHEDULE_READ)
  async getStaffSchedules(
    @Param('staffId') staffId: string,
    @Query('effectiveDate') effectiveDate?: string,
    @Query('includeExpired') includeExpired?: string,
    @Query('facilityId') facilityId?: string,
    @Req() req?: any
  ) {
    const context = this.getContext(req);
    const filters: {
      effectiveDate?: Date;
      includeExpired?: boolean;
      facilityId?: string;
    } = {
      includeExpired: includeExpired === 'true',
    };

    if (effectiveDate) {
      filters.effectiveDate = new Date(effectiveDate);
    }
    if (facilityId) {
      filters.facilityId = facilityId;
    }

    return this.scheduleService.getStaffSchedules(staffId, context, filters);
  }

  /**
   * PUT /scheduling/staff-schedules/:id - Update staff schedule
   */
  @Put('staff-schedules/:id')
  @Permissions(SCHEDULE_UPDATE)
  async updateStaffSchedule(
    @Param('id') id: string,
    @Body() dto: UpdateStaffScheduleDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.updateStaffSchedule(id, dto, context);
  }

  /**
   * DELETE /scheduling/staff-schedules/:id - Delete staff schedule
   */
  @Delete('staff-schedules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(SCHEDULE_DELETE)
  async deleteStaffSchedule(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    await this.scheduleService.deleteStaffSchedule(id, context);
  }

  /**
   * POST /scheduling/staff-schedules/weekly - Create weekly schedule (bulk)
   */
  @Post('staff-schedules/weekly')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(SCHEDULE_CREATE)
  async createWeeklyStaffSchedule(
    @Body() dto: CreateWeeklyScheduleDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    const scheduleOptions: {
      isAvailable: boolean;
      scheduleType?: string;
      facilityId?: string;
      effectiveFrom: Date;
      effectiveTo?: Date;
      notes?: string;
      staffDisplayName?: string;
      employeeId?: string;
      staffType?: string;
    } = {
      isAvailable: dto.isAvailable,
      effectiveFrom: dto.effectiveFrom,
    };

    if (dto.staffDisplayName) {
      scheduleOptions.staffDisplayName = dto.staffDisplayName;
    }
    if (dto.employeeId) {
      scheduleOptions.employeeId = dto.employeeId;
    }
    if (dto.staffType) {
      scheduleOptions.staffType = dto.staffType;
    }
    if (dto.scheduleType) {
      scheduleOptions.scheduleType = dto.scheduleType;
    }
    if (dto.facilityId) {
      scheduleOptions.facilityId = dto.facilityId;
    }
    if (dto.effectiveTo) {
      scheduleOptions.effectiveTo = dto.effectiveTo;
    }
    if (dto.notes) {
      scheduleOptions.notes = dto.notes;
    }

    const staffPayload = {
      staffId: dto.staffId,
      ...(dto.staffDisplayName ? { staffDisplayName: dto.staffDisplayName } : {}),
      ...(dto.employeeId ? { employeeId: dto.employeeId } : {}),
      ...(dto.staffType ? { staffType: dto.staffType } : {}),
    };

    return this.scheduleService.createWeeklyStaffSchedule(
      staffPayload,
      dto.days,
      dto.startTime,
      dto.endTime,
      scheduleOptions,
      context
    );
  }

  // ========================================
  // EQUIPMENT SCHEDULES
  // ========================================

  /**
   * POST /scheduling/equipment-schedules - Create equipment schedule
   */
  @Post('equipment-schedules')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(SCHEDULE_CREATE)
  async createEquipmentSchedule(
    @Body() dto: CreateEquipmentScheduleDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.createEquipmentSchedule(dto, context);
  }

  /**
   * GET /scheduling/equipment-schedules/:equipmentId - Get equipment schedules
   */
  @Get('equipment-schedules/:equipmentId')
  @Permissions(SCHEDULE_READ)
  async getEquipmentSchedules(
    @Param('equipmentId') equipmentId: string,
    @Query('effectiveDate') effectiveDate?: string,
    @Query('includeExpired') includeExpired?: string,
    @Req() req?: any
  ) {
    const context = this.getContext(req);
    const filters: {
      effectiveDate?: Date;
      includeExpired?: boolean;
    } = {
      includeExpired: includeExpired === 'true',
    };

    if (effectiveDate) {
      filters.effectiveDate = new Date(effectiveDate);
    }

    return this.scheduleService.getEquipmentSchedules(equipmentId, context, filters);
  }

  /**
   * PUT /scheduling/equipment-schedules/:id - Update equipment schedule
   */
  @Put('equipment-schedules/:id')
  @Permissions(SCHEDULE_UPDATE)
  async updateEquipmentSchedule(
    @Param('id') id: string,
    @Body() dto: UpdateEquipmentScheduleDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.updateEquipmentSchedule(id, dto, context);
  }

  /**
   * DELETE /scheduling/equipment-schedules/:id - Delete equipment schedule
   */
  @Delete('equipment-schedules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(SCHEDULE_DELETE)
  async deleteEquipmentSchedule(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    await this.scheduleService.deleteEquipmentSchedule(id, context);
  }

  // ========================================
  // SPACE SCHEDULES
  // ========================================

  /**
   * POST /scheduling/space-schedules - Create space schedule
   */
  @Post('space-schedules')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(SCHEDULE_CREATE)
  async createSpaceSchedule(
    @Body() dto: CreateSpaceScheduleDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.createSpaceSchedule(dto, context);
  }

  /**
   * GET /scheduling/space-schedules/:spaceId - Get space schedules
   */
  @Get('space-schedules/:spaceId')
  @Permissions(SCHEDULE_READ)
  async getSpaceSchedules(
    @Param('spaceId') spaceId: string,
    @Query('effectiveDate') effectiveDate?: string,
    @Query('includeExpired') includeExpired?: string,
    @Req() req?: any
  ) {
    const context = this.getContext(req);
    const filters: {
      effectiveDate?: Date;
      includeExpired?: boolean;
    } = {
      includeExpired: includeExpired === 'true',
    };

    if (effectiveDate) {
      filters.effectiveDate = new Date(effectiveDate);
    }

    return this.scheduleService.getSpaceSchedules(spaceId, context, filters);
  }

  /**
   * PUT /scheduling/space-schedules/:id - Update space schedule
   */
  @Put('space-schedules/:id')
  @Permissions(SCHEDULE_UPDATE)
  async updateSpaceSchedule(
    @Param('id') id: string,
    @Body() dto: UpdateSpaceScheduleDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.updateSpaceSchedule(id, dto, context);
  }

  /**
   * DELETE /scheduling/space-schedules/:id - Delete space schedule
   */
  @Delete('space-schedules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(SCHEDULE_DELETE)
  async deleteSpaceSchedule(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    await this.scheduleService.deleteSpaceSchedule(id, context);
  }

  // ========================================
  // RESOURCE BLOCKS
  // ========================================

  /**
   * POST /scheduling/resource-blocks - Create resource block
   */
  @Post('resource-blocks')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(SCHEDULE_CREATE)
  async createResourceBlock(
    @Body() dto: CreateResourceBlockDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.createResourceBlock(dto, context);
  }

  /**
   * GET /scheduling/resource-blocks - Get resource blocks
   */
  @Get('resource-blocks')
  @Permissions(SCHEDULE_READ)
  async getResourceBlocks(
    @Query('resourceType') resourceType?: 'staff' | 'equipment' | 'space',
    @Query('resourceId') resourceId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('approvalStatus') approvalStatus?: 'pending' | 'approved' | 'rejected',
    @Query('facilityId') facilityId?: string,
    @Req() req?: any
  ) {
    const context = this.getContext(req);
    const filters: {
      resourceType?: 'staff' | 'equipment' | 'space';
      resourceId?: string;
      startDate?: Date;
      endDate?: Date;
      approvalStatus?: 'pending' | 'approved' | 'rejected';
      facilityId?: string;
    } = {};

    if (resourceType) {
      filters.resourceType = resourceType;
    }
    if (resourceId) {
      filters.resourceId = resourceId;
    }
    if (startDate) {
      filters.startDate = new Date(startDate);
    }
    if (endDate) {
      filters.endDate = new Date(endDate);
    }
    if (approvalStatus) {
      filters.approvalStatus = approvalStatus;
    }
    if (facilityId) {
      filters.facilityId = facilityId;
    }

    return this.scheduleService.getResourceBlocks(context, filters);
  }

  /**
   * GET /scheduling/resource-blocks/pending - Get pending approval blocks
   */
  @Get('resource-blocks/pending')
  @Permissions(SCHEDULE_READ)
  async getPendingBlocks(
    @Query('facilityId') facilityId?: string,
    @Req() req?: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.getPendingBlocks(context, facilityId);
  }

  /**
   * PUT /scheduling/resource-blocks/:id - Update resource block
   */
  @Put('resource-blocks/:id')
  @Permissions(SCHEDULE_UPDATE)
  async updateResourceBlock(
    @Param('id') id: string,
    @Body() dto: UpdateResourceBlockDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.updateResourceBlock(id, dto, context);
  }

  /**
   * POST /scheduling/resource-blocks/:id/approve - Approve resource block
   */
  @Post('resource-blocks/:id/approve')
  @Permissions(SCHEDULE_UPDATE)
  async approveResourceBlock(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.approveResourceBlock(id, context);
  }

  /**
   * POST /scheduling/resource-blocks/:id/reject - Reject resource block
   */
  @Post('resource-blocks/:id/reject')
  @Permissions(SCHEDULE_UPDATE)
  async rejectResourceBlock(
    @Param('id') id: string,
    @Body() dto: RejectResourceBlockDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.rejectResourceBlock(id, dto.reason, context);
  }

  /**
   * DELETE /scheduling/resource-blocks/:id - Delete resource block
   */
  @Delete('resource-blocks/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(SCHEDULE_DELETE)
  async deleteResourceBlock(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    await this.scheduleService.deleteResourceBlock(id, context);
  }

  // ========================================
  // UTILITY ENDPOINTS
  // ========================================

  /**
   * GET /scheduling/resources/:resourceType/:resourceId/schedules/:date
   * Get all schedules for a resource on a specific date
   */
  @Get('resources/:resourceType/:resourceId/schedules/:date')
  @Permissions(SCHEDULE_READ)
  async getResourceSchedulesForDate(
    @Param('resourceType') resourceType: 'staff' | 'equipment' | 'space',
    @Param('resourceId') resourceId: string,
    @Param('date') date: string,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.getResourceSchedulesForDate(
      resourceType,
      resourceId,
      new Date(date),
      context
    );
  }
}
