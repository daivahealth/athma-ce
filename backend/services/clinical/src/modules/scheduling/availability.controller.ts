/**
 * Availability Controller
 *
 * REST API endpoints for checking resource availability and finding time slots
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import {
  FindAvailableSlotsDto,
  CheckSlotAvailabilityDto,
  FindSlotsForAppointmentTypeDto,
  GetResourceUtilizationDto,
  FindNextAvailableSlotDto,
  SuggestAlternativeSlotsDto,
} from './dto/availability.dto';

@Controller('scheduling/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  private getContext(req: any) {
    return {
      userId: req.user?.id || 'system',
      tenantId: req.tenant?.id || 'default-tenant',
      facilityId: req.facility?.id || 'default-facility',
      userRole: req.user?.role || 'user',
    };
  }

  /**
   * POST /scheduling/availability/find-slots - Find available slots for a resource
   */
  @Post('find-slots')
  async findAvailableSlots(
    @Body() dto: FindAvailableSlotsDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.availabilityService.findAvailableSlots(
      dto.resourceType,
      dto.resourceId,
      dto.startDate,
      dto.endDate,
      dto.durationMinutes,
      context,
      {
        facilityId: dto.facilityId,
        slotInterval: dto.slotInterval,
        includePreparationTime: dto.includePreparationTime,
        preparationMinutes: dto.preparationMinutes,
        cleanupMinutes: dto.cleanupMinutes,
      }
    );
  }

  /**
   * POST /scheduling/availability/check-slot - Check if a specific slot is available
   */
  @Post('check-slot')
  async checkSlotAvailability(
    @Body() dto: CheckSlotAvailabilityDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    const isAvailable = await this.availabilityService.isSlotAvailable(
      dto.resourceType,
      dto.resourceId,
      dto.startTime,
      dto.endTime,
      context,
      {
        preparationStart: dto.preparationStart,
        cleanupEnd: dto.cleanupEnd,
      }
    );

    return { isAvailable };
  }

  /**
   * POST /scheduling/availability/detect-conflicts - Detect conflicts for a resource at a specific time
   */
  @Post('detect-conflicts')
  async detectConflicts(
    @Body() dto: CheckSlotAvailabilityDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    const conflicts = await this.availabilityService.detectConflicts(
      dto.resourceType,
      dto.resourceId,
      dto.startTime,
      dto.endTime,
      context,
      {
        preparationStart: dto.preparationStart,
        cleanupEnd: dto.cleanupEnd,
      }
    );

    return { conflicts };
  }

  /**
   * POST /scheduling/availability/find-slots-for-appointment-type
   * Find available slots that satisfy all resource requirements for an appointment type
   */
  @Post('find-slots-for-appointment-type')
  async findSlotsForAppointmentType(
    @Body() dto: FindSlotsForAppointmentTypeDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.availabilityService.findAvailableSlotsForAppointmentType(
      dto.appointmentType,
      dto.startDate,
      dto.endDate,
      context,
      {
        facilityId: dto.facilityId,
        preferredStaffIds: dto.preferredStaffIds,
        preferredTimeOfDay: dto.preferredTimeOfDay,
        slotInterval: dto.slotInterval,
      }
    );
  }

  /**
   * POST /scheduling/availability/utilization - Get resource utilization statistics
   */
  @Post('utilization')
  async getResourceUtilization(
    @Body() dto: GetResourceUtilizationDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.availabilityService.getResourceUtilization(
      dto.resourceType,
      dto.resourceId,
      dto.startDate,
      dto.endDate,
      context
    );
  }

  /**
   * POST /scheduling/availability/next-available - Find next available slot for a resource
   */
  @Post('next-available')
  async findNextAvailableSlot(
    @Body() dto: FindNextAvailableSlotDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    const slot = await this.availabilityService.findNextAvailableSlot(
      dto.resourceType,
      dto.resourceId,
      dto.durationMinutes,
      context,
      {
        startFrom: dto.startFrom,
        maxDaysToSearch: dto.maxDaysToSearch,
      }
    );

    return { slot };
  }

  /**
   * POST /scheduling/availability/suggest-alternatives - Suggest alternative time slots
   */
  @Post('suggest-alternatives')
  async suggestAlternativeSlots(
    @Body() dto: SuggestAlternativeSlotsDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.availabilityService.suggestAlternativeSlots(
      dto.resourceType,
      dto.resourceId,
      dto.preferredStartTime,
      dto.durationMinutes,
      context,
      {
        maxAlternatives: dto.maxAlternatives,
        searchWindowDays: dto.searchWindowDays,
      }
    );
  }

  /**
   * GET /scheduling/availability/resources/:resourceType/:resourceId/utilization
   * Get resource utilization (convenience GET endpoint)
   */
  @Get('resources/:resourceType/:resourceId/utilization')
  async getResourceUtilizationByParams(
    @Param('resourceType') resourceType: 'staff' | 'equipment' | 'space',
    @Param('resourceId') resourceId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.availabilityService.getResourceUtilization(
      resourceType,
      resourceId,
      new Date(startDate),
      new Date(endDate),
      context
    );
  }
}
