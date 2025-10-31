"use strict";
/**
 * Availability Service
 *
 * Finds available time slots considering schedules, blocks, and existing appointments
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
exports.AvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
let AvailabilityService = class AvailabilityService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Find available slots for a specific resource
     */
    async findAvailableSlots(resourceType, resourceId, startDate, endDate, durationMinutes, context, options) {
        const slotInterval = options?.slotInterval || 15;
        const availableSlots = [];
        // Iterate through each day in the range
        let currentDate = new Date(startDate);
        currentDate.setHours(0, 0, 0, 0);
        const endDateOnly = new Date(endDate);
        endDateOnly.setHours(23, 59, 59, 999);
        while (currentDate <= endDateOnly) {
            const dayOptions = { slotInterval };
            if (options?.includePreparationTime !== undefined) {
                dayOptions.includePreparationTime = options.includePreparationTime;
            }
            if (options?.preparationMinutes !== undefined) {
                dayOptions.preparationMinutes = options.preparationMinutes;
            }
            if (options?.cleanupMinutes !== undefined) {
                dayOptions.cleanupMinutes = options.cleanupMinutes;
            }
            const daySlots = await this.findAvailableSlotsForDay(resourceType, resourceId, currentDate, durationMinutes, context, dayOptions);
            availableSlots.push(...daySlots);
            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return availableSlots;
    }
    /**
     * Find available slots for a single day
     */
    async findAvailableSlotsForDay(resourceType, resourceId, date, durationMinutes, context, options) {
        const dayOfWeek = date.getDay();
        const slotInterval = options?.slotInterval || 15;
        // Get recurring schedule for this day
        const recurringSchedules = await this.getRecurringSchedulesForDay(resourceType, resourceId, dayOfWeek, date, context);
        if (recurringSchedules.length === 0) {
            return []; // No schedule defined for this day
        }
        // Get blocks for this day
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
        // Generate candidate slots from recurring schedules
        const candidateSlots = [];
        for (const schedule of recurringSchedules) {
            if (!schedule.isAvailable)
                continue; // Skip unavailable periods
            // Parse time strings (HH:MM:SS)
            const [startHour, startMin] = schedule.startTime.split(':').map(Number);
            const [endHour, endMin] = schedule.endTime.split(':').map(Number);
            // Create datetime objects
            const scheduleStart = new Date(date);
            scheduleStart.setHours(startHour, startMin, 0, 0);
            const scheduleEnd = new Date(date);
            scheduleEnd.setHours(endHour, endMin, 0, 0);
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
            // Check blocks
            const hasBlockConflict = blocks.some(block => {
                return ((block.startDatetime <= slot.startTime && block.endDatetime > slot.startTime) ||
                    (block.startDatetime < slot.endTime && block.endDatetime >= slot.endTime) ||
                    (block.startDatetime >= slot.startTime && block.endDatetime <= slot.endTime));
            });
            if (hasBlockConflict)
                return false;
            // Check existing appointments (including prep/cleanup)
            const hasAppointmentConflict = existingAppointments.some(appt => {
                const apptStart = appt.preparationStart || appt.startTime;
                const apptEnd = appt.cleanupEnd || appt.endTime;
                return ((apptStart <= slot.startTime && apptEnd > slot.startTime) ||
                    (apptStart < slot.endTime && apptEnd >= slot.endTime) ||
                    (apptStart >= slot.startTime && apptEnd <= slot.endTime));
            });
            if (hasAppointmentConflict)
                return false;
            return true;
        });
        return availableSlots;
    }
    /**
     * Get recurring schedules for a specific day
     */
    async getRecurringSchedulesForDay(resourceType, resourceId, dayOfWeek, date, context) {
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
        }
        else if (resourceType === 'equipment') {
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
        }
        else if (resourceType === 'space') {
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
    async isSlotAvailable(resourceType, resourceId, startTime, endTime, context, options) {
        const conflicts = await this.detectConflicts(resourceType, resourceId, startTime, endTime, context, {
            ...(options?.preparationStart ? { preparationStart: options.preparationStart } : {}),
            ...(options?.cleanupEnd ? { cleanupEnd: options.cleanupEnd } : {}),
        });
        return conflicts.length === 0;
    }
    /**
     * Detect conflicts for a resource at a specific time
     */
    async detectConflicts(resourceType, resourceId, startTime, endTime, context, options) {
        const conflicts = [];
        const dayOfWeek = startTime.getDay();
        const effectiveStart = options?.preparationStart || startTime;
        const effectiveEnd = options?.cleanupEnd || endTime;
        // 1. Check recurring schedule
        const schedules = await this.getRecurringSchedulesForDay(resourceType, resourceId, dayOfWeek, startTime, context);
        // Extract time from datetime for comparison
        const requestedStartTime = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}:00`;
        const requestedEndTime = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}:00`;
        const coveringSchedule = schedules.find(s => {
            return (s.isAvailable &&
                s.startTime <= requestedStartTime &&
                s.endTime >= requestedEndTime);
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
        if (blocks.length > 0) {
            conflicts.push({
                type: 'BLOCKED',
                message: 'Resource is blocked during this time',
                details: blocks,
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
        if (existingAppointments.length > 0) {
            conflicts.push({
                type: 'DOUBLE_BOOKING',
                message: 'Resource already booked during this time',
                details: existingAppointments,
            });
        }
        return conflicts;
    }
    /**
     * Find available slots that satisfy all resource requirements for an appointment type
     */
    async findAvailableSlotsForAppointmentType(appointmentType, startDate, endDate, context, options) {
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
        const multiResourceSlots = [];
        // Calculate total duration including prep and cleanup
        const maxDuration = Math.max(...requirements.map(r => r.minDurationMinutes + r.preparationTimeMinutes + r.cleanupTimeMinutes));
        // Get available resources for each requirement
        const resourceAvailabilities = new Map();
        for (const requirement of requirements) {
            if (!requirement.isRequired)
                continue; // Skip optional resources for now
            // If specific resource ID is specified, only check that one
            if (requirement.resourceId) {
                const slots = await this.findAvailableSlots(requirement.resourceType, requirement.resourceId, startDate, endDate, requirement.minDurationMinutes, context, {
                    slotInterval: options?.slotInterval || 15,
                    includePreparationTime: true,
                    preparationMinutes: requirement.preparationTimeMinutes,
                    cleanupMinutes: requirement.cleanupTimeMinutes,
                });
                resourceAvailabilities.set(`${requirement.resourceType}-${requirement.resourceId}`, slots);
            }
            else {
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
                    const hasMatchingSlot = slots.some(slot => slot.startTime.getTime() === candidateSlot.startTime.getTime() &&
                        slot.endTime.getTime() === candidateSlot.endTime.getTime());
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
                        type: r.resourceType,
                        id: r.resourceId,
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
                }
                else if (options.preferredTimeOfDay === 'afternoon') {
                    return hour >= 12 && hour < 17;
                }
                else if (options.preferredTimeOfDay === 'evening') {
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
    async getResourceUtilization(resourceType, resourceId, startDate, endDate, context) {
        // Calculate total minutes based on schedules
        let totalMinutes = 0;
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            const schedules = await this.getRecurringSchedulesForDay(resourceType, resourceId, dayOfWeek, currentDate, context);
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
    async findNextAvailableSlot(resourceType, resourceId, durationMinutes, context, options) {
        const startFrom = options?.startFrom || new Date();
        const maxDays = options?.maxDaysToSearch || 30;
        const endDate = new Date(startFrom);
        endDate.setDate(endDate.getDate() + maxDays);
        const slots = await this.findAvailableSlots(resourceType, resourceId, startFrom, endDate, durationMinutes, context);
        return slots.length > 0 ? slots[0] : null;
    }
    /**
     * Suggest alternative time slots when preferred slot is unavailable
     */
    async suggestAlternativeSlots(resourceType, resourceId, preferredStartTime, durationMinutes, context, options) {
        const maxAlternatives = options?.maxAlternatives || 5;
        const searchWindowDays = options?.searchWindowDays || 7;
        const searchStart = new Date(preferredStartTime);
        searchStart.setDate(searchStart.getDate() - 1); // Start from day before
        const searchEnd = new Date(preferredStartTime);
        searchEnd.setDate(searchEnd.getDate() + searchWindowDays);
        const allSlots = await this.findAvailableSlots(resourceType, resourceId, searchStart, searchEnd, durationMinutes, context);
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
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], AvailabilityService);
//# sourceMappingURL=availability.service.js.map