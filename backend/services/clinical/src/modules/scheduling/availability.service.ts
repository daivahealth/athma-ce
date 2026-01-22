/**
 * Availability Service
 *
 * Finds available time slots considering schedules, blocks, and existing appointments
 */

import { Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import { PrismaService } from '@zeal/database-clinical';
import { configClient } from '../../config';

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

@Injectable()
export class AvailabilityService {
  private readonly logger = new Logger(AvailabilityService.name);
  constructor(private prisma: PrismaService) {}

  private async getTimezone(context: RequestContext): Promise<string> {
    return configClient.get('locale.timezone', context);
  }

  private toFacilityDateTime(date: Date, timezone: string) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).setZone(timezone);
  }

  /**
   * Find available slots for a specific resource
   */
  async findAvailableSlots(
    resourceType: 'staff' | 'equipment' | 'space',
    resourceId: string,
    startDate: Date,
    endDate: Date,
    durationMinutes: number,
    context: RequestContext,
    options?: {
      facilityId?: string;
      slotInterval?: number; // Minutes between slot start times, default 15
      includePreparationTime?: boolean;
      preparationMinutes?: number;
      cleanupMinutes?: number;
    }
  ): Promise<TimeSlot[]> {
    const slotInterval = options?.slotInterval || 15;
    const availableSlots: TimeSlot[] = [];
    const timezone = await this.getTimezone(context);

    // Iterate through each day in the range using facility timezone
    let currentDate = this.toFacilityDateTime(startDate, timezone).startOf('day');
    const endDateOnly = this.toFacilityDateTime(endDate, timezone).endOf('day');

    while (currentDate <= endDateOnly) {
      const dayOptions: {
        slotInterval?: number;
        includePreparationTime?: boolean;
        preparationMinutes?: number;
        cleanupMinutes?: number;
      } = { slotInterval };

      if (options?.includePreparationTime !== undefined) {
        dayOptions.includePreparationTime = options.includePreparationTime;
      }
      if (options?.preparationMinutes !== undefined) {
        dayOptions.preparationMinutes = options.preparationMinutes;
      }
      if (options?.cleanupMinutes !== undefined) {
        dayOptions.cleanupMinutes = options.cleanupMinutes;
      }

      const daySlots = await this.findAvailableSlotsForDay(
        resourceType,
        resourceId,
        currentDate.toJSDate(),
        durationMinutes,
        context,
        dayOptions
      );

      availableSlots.push(...daySlots);

      // Move to next day
      currentDate = currentDate.plus({ days: 1 });
    }

    return availableSlots;
  }

  /**
   * Find available slots for a single day
   */
  private async findAvailableSlotsForDay(
    resourceType: 'staff' | 'equipment' | 'space',
    resourceId: string,
    date: Date,
    durationMinutes: number,
    context: RequestContext,
    options?: {
      slotInterval?: number;
      includePreparationTime?: boolean;
      preparationMinutes?: number;
      cleanupMinutes?: number;
    }
  ): Promise<TimeSlot[]> {
    const timezone = await this.getTimezone(context);
    const dayOfWeek = this.toFacilityDateTime(date, timezone).weekday % 7;
    const slotInterval = options?.slotInterval || 15;

    // Get recurring schedule for this day
    const recurringSchedules = await this.getRecurringSchedulesForDay(
      resourceType,
      resourceId,
      dayOfWeek,
      date,
      context
    );

    if (recurringSchedules.length === 0) {
      return []; // No schedule defined for this day
    }

    // Get blocks for this day
    const startOfDay = this.toFacilityDateTime(date, timezone).startOf('day').toJSDate();
    const endOfDay = this.toFacilityDateTime(date, timezone).endOf('day').toJSDate();

    const blocks = await this.prisma.resourceBlock.findMany({
      where: {
        tenantId: context.tenantId,
        resourceType,
        resourceId,
        approvalStatus: 'approved',
        startDatetime: { lte: endOfDay },
        endDatetime: { gte: startOfDay },
      },
    });

    // Get existing appointments for this day
    const existingAppointments = await this.prisma.appointmentResource.findMany({
      where: {
        tenantId: context.tenantId,
        resourceType,
        resourceId,
        status: { in: ['allocated', 'confirmed', 'in_use'] },
        startTime: { lte: endOfDay },
        endTime: { gte: startOfDay },
      },
    });
    const directAppointments =
      resourceType === 'staff' || resourceType === 'space'
        ? await this.prisma.appointment.findMany({
            where: {
              tenantId: context.tenantId,
              ...(resourceType === 'staff' ? { staffId: resourceId } : { spaceId: resourceId }),
              status: { not: 'cancelled' },
              startTime: { lte: endOfDay },
              endTime: { gte: startOfDay },
            },
          })
        : [];

    // Generate candidate slots from recurring schedules
    const candidateSlots: TimeSlot[] = [];

    for (const schedule of recurringSchedules) {
      if (!schedule.isAvailable) continue; // Skip unavailable periods

      // Parse time strings (HH:MM:SS)
      const [startHour, startMin] = schedule.startTime.split(':').map(Number);
      const [endHour, endMin] = schedule.endTime.split(':').map(Number);

      // Create datetime objects
      const scheduleStart = this.toFacilityDateTime(date, timezone)
        .set({ hour: startHour, minute: startMin, second: 0, millisecond: 0 })
        .toJSDate();
      const scheduleEnd = this.toFacilityDateTime(date, timezone)
        .set({ hour: endHour, minute: endMin, second: 0, millisecond: 0 })
        .toJSDate();

      // Generate slots at interval
      let slotStart = new Date(scheduleStart);
      while (slotStart < scheduleEnd) {
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);

        // Add preparation and cleanup if needed
        let effectiveStart = new Date(slotStart);
        let effectiveEnd = new Date(slotEnd);

        if (options?.includePreparationTime && options.preparationMinutes) {
          effectiveStart.setMinutes(effectiveStart.getMinutes() - options.preparationMinutes);
        }

        if (options?.includePreparationTime && options.cleanupMinutes) {
          effectiveEnd.setMinutes(effectiveEnd.getMinutes() + options.cleanupMinutes);
        }

        // Check if slot fits within schedule
        if (effectiveEnd <= scheduleEnd) {
          candidateSlots.push({
            startTime: slotStart,
            endTime: slotEnd,
          });
        }

        // Move to next slot
        slotStart = new Date(slotStart);
        slotStart.setMinutes(slotStart.getMinutes() + slotInterval);
      }
    }

    // Filter out slots that conflict with blocks or appointments
    const availableSlots = candidateSlots.filter(slot => {
      const overlaps = (startA: Date, endA: Date, startB: Date, endB: Date) =>
        startA < endB && endA > startB;
      // Check blocks
      const hasBlockConflict = blocks.some(block => {
        return overlaps(block.startDatetime, block.endDatetime, slot.startTime, slot.endTime);
      });

      if (hasBlockConflict) return false;

      // Check existing appointments (including prep/cleanup)
      const hasAppointmentConflict = existingAppointments.some(appt => {
        const apptStart = appt.preparationStart || appt.startTime;
        const apptEnd = appt.cleanupEnd || appt.endTime;

        return overlaps(apptStart, apptEnd, slot.startTime, slot.endTime);
      });

      if (hasAppointmentConflict) return false;

      const hasDirectAppointmentConflict = directAppointments.some(appt => {
        return overlaps(appt.startTime, appt.endTime, slot.startTime, slot.endTime);
      });

      if (hasDirectAppointmentConflict) return false;

      return true;
    });

    return availableSlots;
  }

  /**
   * Get recurring schedules for a specific day
   */
  private async getRecurringSchedulesForDay(
    resourceType: 'staff' | 'equipment' | 'space',
    resourceId: string,
    dayOfWeek: number,
    date: Date,
    context: RequestContext
  ): Promise<any[]> {
    if (resourceType === 'staff') {
      return this.prisma.staffSchedule.findMany({
        where: {
          tenantId: context.tenantId,
          staffId: resourceId,
          dayOfWeek,
          effectiveFrom: { lte: date },
          OR: [
            { effectiveTo: null },
            { effectiveTo: { gte: date } },
          ],
        },
      });
    } else if (resourceType === 'equipment') {
      return this.prisma.equipmentSchedule.findMany({
        where: {
          tenantId: context.tenantId,
          equipmentId: resourceId,
          dayOfWeek,
          effectiveFrom: { lte: date },
          OR: [
            { effectiveTo: null },
            { effectiveTo: { gte: date } },
          ],
        },
      });
    } else if (resourceType === 'space') {
      return this.prisma.spaceSchedule.findMany({
        where: {
          tenantId: context.tenantId,
          spaceId: resourceId,
          dayOfWeek,
          effectiveFrom: { lte: date },
          OR: [
            { effectiveTo: null },
            { effectiveTo: { gte: date } },
          ],
        },
      });
    }

    return [];
  }

  /**
   * Check if a specific slot is available for a resource
   */
  async isSlotAvailable(
    resourceType: 'staff' | 'equipment' | 'space',
    resourceId: string,
    startTime: Date,
    endTime: Date,
    context: RequestContext,
    options?: {
      includePreparationTime?: boolean;
      preparationStart?: Date;
      cleanupEnd?: Date;
      excludeAppointmentId?: string;
    }
  ): Promise<boolean> {
    const conflicts = await this.detectConflicts(
      resourceType,
      resourceId,
      startTime,
      endTime,
      context,
      {
        ...(options?.preparationStart ? { preparationStart: options.preparationStart } : {}),
        ...(options?.cleanupEnd ? { cleanupEnd: options.cleanupEnd } : {}),
        ...(options?.excludeAppointmentId ? { excludeAppointmentId: options.excludeAppointmentId } : {}),
      }
    );

    return conflicts.length === 0;
  }

  /**
   * Detect conflicts for a resource at a specific time
   */
  async detectConflicts(
    resourceType: 'staff' | 'equipment' | 'space',
    resourceId: string,
    startTime: Date,
    endTime: Date,
    context: RequestContext,
    options?: {
      preparationStart?: Date;
      cleanupEnd?: Date;
      excludeAppointmentId?: string;
    }
  ): Promise<ConflictInfo[]> {
    const conflicts: ConflictInfo[] = [];
    const timezone = await this.getTimezone(context);
    const dayOfWeek = this.toFacilityDateTime(startTime, timezone).weekday % 7;

    const effectiveStart = options?.preparationStart || startTime;
    const effectiveEnd = options?.cleanupEnd || endTime;
    const overlaps = (startA: Date, endA: Date, startB: Date, endB: Date) =>
      startA < endB && endA > startB;

    // 1. Check recurring schedule
    const schedules = await this.getRecurringSchedulesForDay(
      resourceType,
      resourceId,
      dayOfWeek,
      startTime,
      context
    );

    // Extract time from datetime for comparison
    const localStart = this.toFacilityDateTime(startTime, timezone);
    const localEnd = this.toFacilityDateTime(endTime, timezone);
    const requestedStartTime = `${localStart.hour.toString().padStart(2, '0')}:${localStart.minute.toString().padStart(2, '0')}:00`;
    const requestedEndTime = `${localEnd.hour.toString().padStart(2, '0')}:${localEnd.minute.toString().padStart(2, '0')}:00`;

    const coveringSchedule = schedules.find(s => {
      return (
        s.isAvailable &&
        s.startTime <= requestedStartTime &&
        s.endTime >= requestedEndTime
      );
    });

    if (!coveringSchedule) {
      conflicts.push({
        type: 'SCHEDULE_UNAVAILABLE',
        message: 'No matching schedule for this time slot',
      });
    }

    // 2. Check for blocks
    const blocks = await this.prisma.resourceBlock.findMany({
      where: {
        tenantId: context.tenantId,
        resourceType,
        resourceId,
        approvalStatus: 'approved',
        startDatetime: { lte: effectiveEnd },
        endDatetime: { gte: effectiveStart },
      },
    });

    if (blocks.some((block) => overlaps(block.startDatetime, block.endDatetime, effectiveStart, effectiveEnd))) {
      conflicts.push({
        type: 'BLOCKED',
        message: 'Resource is blocked during this time',
        details: blocks.filter((block) =>
          overlaps(block.startDatetime, block.endDatetime, effectiveStart, effectiveEnd)
        ),
      });
    }

    // 3. Check existing appointments
    const existingAppointments = await this.prisma.appointmentResource.findMany({
      where: {
        tenantId: context.tenantId,
        resourceType,
        resourceId,
        status: { in: ['allocated', 'confirmed', 'in_use'] },
        OR: [
          {
            startTime: { lte: effectiveEnd },
            endTime: { gte: effectiveStart },
          },
          {
            preparationStart: { not: null, lte: effectiveEnd },
            cleanupEnd: { not: null, gte: effectiveStart },
          },
        ],
      },
    });
    const directAppointments =
      resourceType === 'staff' || resourceType === 'space'
        ? await this.prisma.appointment.findMany({
            where: {
              tenantId: context.tenantId,
              ...(resourceType === 'staff' ? { staffId: resourceId } : { spaceId: resourceId }),
              status: { not: 'cancelled' },
              ...(options?.excludeAppointmentId ? { id: { not: options.excludeAppointmentId } } : {}),
              startTime: { lte: effectiveEnd },
              endTime: { gte: effectiveStart },
            },
          })
        : [];

    if (
      existingAppointments.some((appt) =>
        overlaps(
          appt.preparationStart || appt.startTime,
          appt.cleanupEnd || appt.endTime,
          effectiveStart,
          effectiveEnd
        )
      ) ||
      directAppointments.some((appt) =>
        overlaps(appt.startTime, appt.endTime, effectiveStart, effectiveEnd)
      )
    ) {
      this.logger.warn(
        `Availability conflict: ${resourceType} ${resourceId} has ${existingAppointments.length} appointment_resources and ${directAppointments.length} appointments overlapping ${effectiveStart.toISOString()} - ${effectiveEnd.toISOString()}`
      );
      if (existingAppointments.length > 0) {
        this.logger.warn(
          `appointment_resources: ${existingAppointments
            .map((appt) => `${appt.id} ${appt.startTime.toISOString()}-${appt.endTime.toISOString()}`)
            .join(', ')}`
        );
      }
      if (directAppointments.length > 0) {
        this.logger.warn(
          `appointments: ${directAppointments
            .map((appt) => `${appt.id} ${appt.startTime.toISOString()}-${appt.endTime.toISOString()}`)
            .join(', ')}`
        );
      }
      conflicts.push({
        type: 'DOUBLE_BOOKING',
        message: 'Resource already booked during this time',
        details: [...existingAppointments, ...directAppointments],
      });
    }

    return conflicts;
  }

  /**
   * Find available slots that satisfy all resource requirements for an appointment type
   */
  async findAvailableSlotsForAppointmentType(
    appointmentType: string,
    startDate: Date,
    endDate: Date,
    context: RequestContext,
    options?: {
      facilityId?: string;
      preferredStaffIds?: string[];
      preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
      slotInterval?: number;
    }
  ): Promise<MultiResourceSlot[]> {
    // Get resource requirements for this appointment type
    const requirements = await this.prisma.appointmentResourceRequirement.findMany({
      where: {
        tenantId: context.tenantId,
        appointmentType,
      },
    });

    if (requirements.length === 0) {
      return []; // No requirements defined
    }

    // For simplicity, we'll find slots where ALL required resources are available
    // This is a complex operation that requires checking all resources simultaneously

    const multiResourceSlots: MultiResourceSlot[] = [];

    // Calculate total duration including prep and cleanup
    const maxDuration = Math.max(...requirements.map(r =>
      r.minDurationMinutes + r.preparationTimeMinutes + r.cleanupTimeMinutes
    ));

    // Get available resources for each requirement
    const resourceAvailabilities: Map<string, TimeSlot[]> = new Map();

    for (const requirement of requirements) {
      if (!requirement.isRequired) continue; // Skip optional resources for now

      // If specific resource ID is specified, only check that one
      if (requirement.resourceId) {
        const slots = await this.findAvailableSlots(
          requirement.resourceType as 'staff' | 'equipment' | 'space',
          requirement.resourceId,
          startDate,
          endDate,
          requirement.minDurationMinutes,
          context,
          {
            slotInterval: options?.slotInterval || 15,
            includePreparationTime: true,
            preparationMinutes: requirement.preparationTimeMinutes,
            cleanupMinutes: requirement.cleanupTimeMinutes,
          }
        );

        resourceAvailabilities.set(
          `${requirement.resourceType}-${requirement.resourceId}`,
          slots
        );
      } else {
        // TODO: Find resources by role
        // This would require a registry of resources with their roles
        // For now, we skip this case
        continue;
      }
    }

    // Find overlapping slots across all resources
    // This is a simplified implementation - a production version would need more sophisticated logic

    if (resourceAvailabilities.size > 0) {
      const firstResourceSlots = Array.from(resourceAvailabilities.values())[0] ?? [];

      for (const candidateSlot of firstResourceSlots) {
        // Check if this slot works for ALL resources
        let allAvailable = true;

        for (const [resourceKey, slots] of resourceAvailabilities.entries()) {
          const hasMatchingSlot = slots.some(slot =>
            slot.startTime.getTime() === candidateSlot.startTime.getTime() &&
            slot.endTime.getTime() === candidateSlot.endTime.getTime()
          );

          if (!hasMatchingSlot) {
            allAvailable = false;
            break;
          }
        }

        if (allAvailable) {
          // Build resource list
          const resources = requirements
            .filter(r => r.resourceId)
            .map(r => ({
              type: r.resourceType as 'staff' | 'equipment' | 'space',
              id: r.resourceId!,
              ...(r.resourceRole ? { role: r.resourceRole } : {}),
            }));

          multiResourceSlots.push({
            startTime: candidateSlot.startTime,
            endTime: candidateSlot.endTime,
            resources,
          });
        }
      }
    }

    // Apply time of day filter if specified
    if (options?.preferredTimeOfDay) {
      return multiResourceSlots.filter(slot => {
        const hour = slot.startTime.getHours();

        if (options.preferredTimeOfDay === 'morning') {
          return hour >= 6 && hour < 12;
        } else if (options.preferredTimeOfDay === 'afternoon') {
          return hour >= 12 && hour < 17;
        } else if (options.preferredTimeOfDay === 'evening') {
          return hour >= 17 && hour < 21;
        }

        return true;
      });
    }

    return multiResourceSlots;
  }

  /**
   * Get resource utilization statistics
   */
  async getResourceUtilization(
    resourceType: 'staff' | 'equipment' | 'space',
    resourceId: string,
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<{
    totalMinutes: number;
    bookedMinutes: number;
    blockedMinutes: number;
    availableMinutes: number;
    utilizationPercentage: number;
  }> {
    // Calculate total minutes based on schedules
    let totalMinutes = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const schedules = await this.getRecurringSchedulesForDay(
        resourceType,
        resourceId,
        dayOfWeek,
        currentDate,
        context
      );

      for (const schedule of schedules) {
        if (schedule.isAvailable) {
          const [startH, startM] = schedule.startTime.split(':').map(Number);
          const [endH, endM] = schedule.endTime.split(':').map(Number);
          const minutes = (endH * 60 + endM) - (startH * 60 + startM);
          totalMinutes += minutes;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate booked minutes
    const appointments = await this.prisma.appointmentResource.findMany({
      where: {
        tenantId: context.tenantId,
        resourceType,
        resourceId,
        status: { in: ['allocated', 'confirmed', 'in_use', 'completed'] },
        startTime: { gte: startDate },
        endTime: { lte: endDate },
      },
    });

    let bookedMinutes = 0;
    for (const appt of appointments) {
      const duration = (appt.endTime.getTime() - appt.startTime.getTime()) / (1000 * 60);
      bookedMinutes += duration;
    }

    // Calculate blocked minutes
    const blocks = await this.prisma.resourceBlock.findMany({
      where: {
        tenantId: context.tenantId,
        resourceType,
        resourceId,
        approvalStatus: 'approved',
        isAvailable: false,
        startDatetime: { gte: startDate },
        endDatetime: { lte: endDate },
      },
    });

    let blockedMinutes = 0;
    for (const block of blocks) {
      const duration = (block.endDatetime.getTime() - block.startDatetime.getTime()) / (1000 * 60);
      blockedMinutes += duration;
    }

    const availableMinutes = totalMinutes - bookedMinutes - blockedMinutes;
    const utilizationPercentage = totalMinutes > 0 ? (bookedMinutes / totalMinutes) * 100 : 0;

    return {
      totalMinutes,
      bookedMinutes,
      blockedMinutes,
      availableMinutes,
      utilizationPercentage,
    };
  }

  /**
   * Find next available slot for a resource
   */
  async findNextAvailableSlot(
    resourceType: 'staff' | 'equipment' | 'space',
    resourceId: string,
    durationMinutes: number,
    context: RequestContext,
    options?: {
      startFrom?: Date;
      maxDaysToSearch?: number;
    }
  ): Promise<TimeSlot | null> {
    const startFrom = options?.startFrom || new Date();
    const maxDays = options?.maxDaysToSearch || 30;

    const endDate = new Date(startFrom);
    endDate.setDate(endDate.getDate() + maxDays);

    const slots = await this.findAvailableSlots(
      resourceType,
      resourceId,
      startFrom,
      endDate,
      durationMinutes,
      context
    );

    return slots.length > 0 ? slots[0]! : null;
  }

  /**
   * Suggest alternative time slots when preferred slot is unavailable
   */
  async suggestAlternativeSlots(
    resourceType: 'staff' | 'equipment' | 'space',
    resourceId: string,
    preferredStartTime: Date,
    durationMinutes: number,
    context: RequestContext,
    options?: {
      maxAlternatives?: number;
      searchWindowDays?: number;
    }
  ): Promise<TimeSlot[]> {
    const maxAlternatives = options?.maxAlternatives || 5;
    const searchWindowDays = options?.searchWindowDays || 7;

    const searchStart = new Date(preferredStartTime);
    searchStart.setDate(searchStart.getDate() - 1); // Start from day before

    const searchEnd = new Date(preferredStartTime);
    searchEnd.setDate(searchEnd.getDate() + searchWindowDays);

    const allSlots = await this.findAvailableSlots(
      resourceType,
      resourceId,
      searchStart,
      searchEnd,
      durationMinutes,
      context
    );

    // Sort by proximity to preferred time
    const sortedSlots = allSlots
      .map(slot => ({
        slot,
        timeDiff: Math.abs(slot.startTime.getTime() - preferredStartTime.getTime()),
      }))
      .sort((a, b) => a.timeDiff - b.timeDiff)
      .slice(0, maxAlternatives)
      .map(item => item.slot);

    return sortedSlots;
  }
}
