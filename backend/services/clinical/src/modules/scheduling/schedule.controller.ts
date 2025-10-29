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

@Controller('scheduling')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  private getContext(req: any) {
    return {
      userId: req.user?.id || 'system',
      tenantId: req.tenant?.id || 'default-tenant',
      facilityId: req.facility?.id || 'default-facility',
      userRole: req.user?.role || 'user',
    };
  }

  // ========================================
  // STAFF SCHEDULES
  // ========================================

  /**
   * POST /scheduling/staff-schedules - Create staff schedule
   */
  @Post('staff-schedules')
  @HttpCode(HttpStatus.CREATED)
  async createStaffSchedule(
    @Body() dto: CreateStaffScheduleDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.createStaffSchedule(dto, context);
  }

  /**
   * GET /scheduling/staff-schedules/:staffId - Get staff schedules
   */
  @Get('staff-schedules/:staffId')
  async getStaffSchedules(
    @Param('staffId') staffId: string,
    @Query('effectiveDate') effectiveDate?: string,
    @Query('includeExpired') includeExpired?: string,
    @Query('facilityId') facilityId?: string,
    @Req() req?: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.getStaffSchedules(staffId, context, {
      effectiveDate: effectiveDate ? new Date(effectiveDate) : undefined,
      includeExpired: includeExpired === 'true',
      facilityId,
    });
  }

  /**
   * PUT /scheduling/staff-schedules/:id - Update staff schedule
   */
  @Put('staff-schedules/:id')
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
  async createWeeklyStaffSchedule(
    @Body() dto: CreateWeeklyScheduleDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.createWeeklyStaffSchedule(
      dto.staffId,
      dto.days,
      dto.startTime,
      dto.endTime,
      {
        isAvailable: dto.isAvailable,
        scheduleType: dto.scheduleType,
        facilityId: dto.facilityId,
        effectiveFrom: dto.effectiveFrom,
        effectiveTo: dto.effectiveTo,
        notes: dto.notes,
      },
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
  async getEquipmentSchedules(
    @Param('equipmentId') equipmentId: string,
    @Query('effectiveDate') effectiveDate?: string,
    @Query('includeExpired') includeExpired?: string,
    @Req() req?: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.getEquipmentSchedules(equipmentId, context, {
      effectiveDate: effectiveDate ? new Date(effectiveDate) : undefined,
      includeExpired: includeExpired === 'true',
    });
  }

  /**
   * PUT /scheduling/equipment-schedules/:id - Update equipment schedule
   */
  @Put('equipment-schedules/:id')
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
  async getSpaceSchedules(
    @Param('spaceId') spaceId: string,
    @Query('effectiveDate') effectiveDate?: string,
    @Query('includeExpired') includeExpired?: string,
    @Req() req?: any
  ) {
    const context = this.getContext(req);
    return this.scheduleService.getSpaceSchedules(spaceId, context, {
      effectiveDate: effectiveDate ? new Date(effectiveDate) : undefined,
      includeExpired: includeExpired === 'true',
    });
  }

  /**
   * PUT /scheduling/space-schedules/:id - Update space schedule
   */
  @Put('space-schedules/:id')
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
    return this.scheduleService.getResourceBlocks(context, {
      resourceType,
      resourceId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      approvalStatus,
      facilityId,
    });
  }

  /**
   * GET /scheduling/resource-blocks/pending - Get pending approval blocks
   */
  @Get('resource-blocks/pending')
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
