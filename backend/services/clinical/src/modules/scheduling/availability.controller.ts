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
  UseGuards,
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
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { AVAILABILITY_READ } from '@zeal/contracts';

@Controller('scheduling/availability')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  private getContext(req: any) {
    // Context is set by TenantContextMiddleware in req.context
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    return req.context;
  }

  /**
   * POST /scheduling/availability/find-slots - Find available slots for a resource
   */
  @Post('find-slots')
  @Permissions(AVAILABILITY_READ)
  async findAvailableSlots(
    @Body() dto: FindAvailableSlotsDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    const options: {
      facilityId?: string;
      slotInterval?: number;
      includePreparationTime?: boolean;
      preparationMinutes?: number;
      cleanupMinutes?: number;
    } = {};

    if (dto.facilityId) {
      options.facilityId = dto.facilityId;
    }
    if (dto.slotInterval !== undefined) {
      options.slotInterval = dto.slotInterval;
    }
    if (dto.includePreparationTime !== undefined) {
      options.includePreparationTime = dto.includePreparationTime;
    }
    if (dto.preparationMinutes !== undefined) {
      options.preparationMinutes = dto.preparationMinutes;
    }
    if (dto.cleanupMinutes !== undefined) {
      options.cleanupMinutes = dto.cleanupMinutes;
    }

    return this.availabilityService.findAvailableSlots(
      dto.resourceType,
      dto.resourceId,
      dto.startDate,
      dto.endDate,
      dto.durationMinutes,
      context,
      options
    );
  }

  /**
   * POST /scheduling/availability/check-slot - Check if a specific slot is available
   */
  @Post('check-slot')
  @Permissions(AVAILABILITY_READ)
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
        ...(dto.preparationStart ? { preparationStart: dto.preparationStart } : {}),
        ...(dto.cleanupEnd ? { cleanupEnd: dto.cleanupEnd } : {}),
      }
    );

    return { isAvailable };
  }

  /**
   * POST /scheduling/availability/detect-conflicts - Detect conflicts for a resource at a specific time
   */
  @Post('detect-conflicts')
  @Permissions(AVAILABILITY_READ)
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
        ...(dto.preparationStart ? { preparationStart: dto.preparationStart } : {}),
        ...(dto.cleanupEnd ? { cleanupEnd: dto.cleanupEnd } : {}),
      }
    );

    return { conflicts };
  }

  /**
   * POST /scheduling/availability/find-slots-for-appointment-type
   * Find available slots that satisfy all resource requirements for an appointment type
   */
  @Post('find-slots-for-appointment-type')
  @Permissions(AVAILABILITY_READ)
  async findSlotsForAppointmentType(
    @Body() dto: FindSlotsForAppointmentTypeDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    const options: {
      facilityId?: string;
      preferredStaffIds?: string[];
      preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
      slotInterval?: number;
    } = {};

    if (dto.facilityId) {
      options.facilityId = dto.facilityId;
    }
    if (dto.preferredStaffIds && dto.preferredStaffIds.length > 0) {
      options.preferredStaffIds = dto.preferredStaffIds;
    }
    if (dto.preferredTimeOfDay) {
      options.preferredTimeOfDay = dto.preferredTimeOfDay;
    }
    if (dto.slotInterval !== undefined) {
      options.slotInterval = dto.slotInterval;
    }

    return this.availabilityService.findAvailableSlotsForAppointmentType(
      dto.appointmentType,
      dto.startDate,
      dto.endDate,
      context,
      options
    );
  }

  /**
   * POST /scheduling/availability/utilization - Get resource utilization statistics
   */
  @Post('utilization')
  @Permissions(AVAILABILITY_READ)
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
  @Permissions(AVAILABILITY_READ)
  async findNextAvailableSlot(
    @Body() dto: FindNextAvailableSlotDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    const options: { startFrom?: Date; maxDaysToSearch?: number } = {};

    if (dto.startFrom) {
      options.startFrom = dto.startFrom;
    }
    if (dto.maxDaysToSearch !== undefined) {
      options.maxDaysToSearch = dto.maxDaysToSearch;
    }

    const slot = await this.availabilityService.findNextAvailableSlot(
      dto.resourceType,
      dto.resourceId,
      dto.durationMinutes,
      context,
      options
    );

    return { slot };
  }

  /**
   * POST /scheduling/availability/suggest-alternatives - Suggest alternative time slots
   */
  @Post('suggest-alternatives')
  @Permissions(AVAILABILITY_READ)
  async suggestAlternativeSlots(
    @Body() dto: SuggestAlternativeSlotsDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    const options: { maxAlternatives?: number; searchWindowDays?: number } = {};

    if (dto.maxAlternatives !== undefined) {
      options.maxAlternatives = dto.maxAlternatives;
    }
    if (dto.searchWindowDays !== undefined) {
      options.searchWindowDays = dto.searchWindowDays;
    }

    return this.availabilityService.suggestAlternativeSlots(
      dto.resourceType,
      dto.resourceId,
      dto.preferredStartTime,
      dto.durationMinutes,
      context,
      options
    );
  }

  /**
   * GET /scheduling/availability/resources/:resourceType/:resourceId/utilization
   * Get resource utilization (convenience GET endpoint)
   */
  @Get('resources/:resourceType/:resourceId/utilization')
  @Permissions(AVAILABILITY_READ)
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
