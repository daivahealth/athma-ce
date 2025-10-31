"use strict";
/**
 * Appointment Service
 *
 * Manages appointment booking with multi-resource coordination
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
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
const availability_service_1 = require("./availability.service");
const rrule_1 = require("rrule");
let AppointmentService = class AppointmentService {
    prisma;
    availabilityService;
    constructor(prisma, availabilityService) {
        this.prisma = prisma;
        this.availabilityService = availabilityService;
    }
    /**
     * Book an appointment with automatic or manual resource allocation
     */
    async bookAppointment(dto, context) {
        // Validate time order
        if (dto.startTime >= dto.endTime) {
            throw new common_1.BadRequestException('End time must be after start time');
        }
        // Validate patient exists
        const patient = await this.prisma.patient.findUnique({
            where: { id: dto.patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (patient.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const facilityId = dto.facilityId || context.facilityId;
        // If auto-allocate is enabled, find and allocate resources based on requirements
        if (dto.autoAllocateResources) {
            const requirements = await this.prisma.appointmentResourceRequirement.findMany({
                where: {
                    tenantId: context.tenantId,
                    appointmentType: dto.appointmentType,
                    isRequired: true,
                },
            });
            if (requirements.length > 0) {
                // Verify all required resources are available
                for (const requirement of requirements) {
                    if (requirement.resourceId) {
                        const availabilityOptions = {};
                        if (requirement.preparationTimeMinutes > 0) {
                            availabilityOptions.includePreparationTime = true;
                            availabilityOptions.preparationStart = new Date(dto.startTime.getTime() - requirement.preparationTimeMinutes * 60000);
                        }
                        if (requirement.cleanupTimeMinutes > 0) {
                            availabilityOptions.includePreparationTime = true;
                            availabilityOptions.cleanupEnd = new Date(dto.endTime.getTime() + requirement.cleanupTimeMinutes * 60000);
                        }
                        const isAvailable = await this.availabilityService.isSlotAvailable(requirement.resourceType, requirement.resourceId, dto.startTime, dto.endTime, context, availabilityOptions);
                        if (!isAvailable) {
                            throw new common_1.BadRequestException(`Required resource ${requirement.resourceRole || requirement.resourceType} is not available at the requested time`);
                        }
                    }
                }
            }
        }
        else if (dto.preferredResources && dto.preferredResources.length > 0) {
            // Verify preferred resources are available
            for (const resource of dto.preferredResources) {
                const isAvailable = await this.availabilityService.isSlotAvailable(resource.type, resource.id, dto.startTime, dto.endTime, context);
                if (!isAvailable) {
                    throw new common_1.BadRequestException(`Resource ${resource.type} with id ${resource.id} is not available at the requested time`);
                }
            }
        }
        // Create the appointment
        const appointment = await this.prisma.appointment.create({
            data: {
                tenantId: context.tenantId,
                patientId: dto.patientId,
                facilityId,
                spaceId: dto.spaceId || null,
                staffId: dto.staffId || null,
                appointmentType: dto.appointmentType,
                status: 'scheduled',
                startTime: dto.startTime,
                endTime: dto.endTime,
                duration: Math.round((dto.endTime.getTime() - dto.startTime.getTime()) / 60000),
                notes: dto.notes || null,
                visitType: dto.visitType || null,
            },
        });
        // Allocate resources
        const allocatedResources = [];
        if (dto.autoAllocateResources) {
            const requirements = await this.prisma.appointmentResourceRequirement.findMany({
                where: {
                    tenantId: context.tenantId,
                    appointmentType: dto.appointmentType,
                    isRequired: true,
                },
            });
            for (const requirement of requirements) {
                if (requirement.resourceId) {
                    const allocationRequest = {
                        appointmentId: appointment.id,
                        resourceType: requirement.resourceType,
                        resourceId: requirement.resourceId,
                        startTime: dto.startTime,
                        endTime: dto.endTime,
                    };
                    if (requirement.resourceRole) {
                        allocationRequest.resourceRole = requirement.resourceRole;
                    }
                    if (requirement.preparationTimeMinutes > 0) {
                        allocationRequest.preparationStart = new Date(dto.startTime.getTime() - requirement.preparationTimeMinutes * 60000);
                    }
                    if (requirement.cleanupTimeMinutes > 0) {
                        allocationRequest.cleanupEnd = new Date(dto.endTime.getTime() + requirement.cleanupTimeMinutes * 60000);
                    }
                    const resource = await this.allocateResource(allocationRequest, context);
                    allocatedResources.push(resource);
                }
            }
        }
        else if (dto.preferredResources && dto.preferredResources.length > 0) {
            for (const resource of dto.preferredResources) {
                const allocationRequest = {
                    appointmentId: appointment.id,
                    resourceType: resource.type,
                    resourceId: resource.id,
                    startTime: dto.startTime,
                    endTime: dto.endTime,
                };
                if (resource.role) {
                    allocationRequest.resourceRole = resource.role;
                }
                const allocated = await this.allocateResource(allocationRequest, context);
                allocatedResources.push(allocated);
            }
        }
        return {
            ...appointment,
            resources: allocatedResources,
        };
    }
    /**
     * Allocate a resource to an appointment
     */
    async allocateResource(dto, context) {
        // Verify appointment exists and belongs to tenant
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: dto.appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        // Check resource availability
        const isAvailable = await this.availabilityService.isSlotAvailable(dto.resourceType, dto.resourceId, dto.startTime, dto.endTime, context, {
            ...(dto.preparationStart ? { preparationStart: dto.preparationStart } : {}),
            ...(dto.cleanupEnd ? { cleanupEnd: dto.cleanupEnd } : {}),
        });
        if (!isAvailable) {
            throw new common_1.BadRequestException(`Resource ${dto.resourceType} is not available at the requested time`);
        }
        // Create resource allocation
        const resource = await this.prisma.appointmentResource.create({
            data: {
                tenantId: context.tenantId,
                appointmentId: dto.appointmentId,
                resourceType: dto.resourceType,
                resourceId: dto.resourceId,
                resourceRole: dto.resourceRole || null,
                startTime: dto.startTime,
                endTime: dto.endTime,
                preparationStart: dto.preparationStart || null,
                cleanupEnd: dto.cleanupEnd || null,
                status: 'allocated',
                createdBy: context.userId,
                updatedBy: context.userId,
            },
        });
        return resource;
    }
    /**
     * Get appointment with all resources
     */
    async getAppointmentWithResources(appointmentId, context) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                resources: true,
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                    },
                },
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return appointment;
    }
    /**
     * Reschedule an appointment and its resources
     */
    async rescheduleAppointment(dto, context) {
        // Get appointment with resources
        const appointment = await this.getAppointmentWithResources(dto.appointmentId, context);
        // Calculate duration
        const durationMs = appointment.endTime.getTime() - appointment.startTime.getTime();
        const newEndTime = dto.newEndTime || new Date(dto.newStartTime.getTime() + durationMs);
        // Verify all resources are available at new time
        for (const resource of appointment.resources) {
            const isAvailable = await this.availabilityService.isSlotAvailable(resource.resourceType, resource.resourceId, dto.newStartTime, newEndTime, context, {
                ...(resource.preparationStart ? { preparationStart: resource.preparationStart } : {}),
                ...(resource.cleanupEnd ? { cleanupEnd: resource.cleanupEnd } : {}),
            });
            if (!isAvailable) {
                throw new common_1.BadRequestException(`Resource ${resource.resourceType} (${resource.resourceRole || resource.resourceId}) is not available at the new time`);
            }
        }
        // Update appointment
        const updatedAppointment = await this.prisma.appointment.update({
            where: { id: dto.appointmentId },
            data: {
                startTime: dto.newStartTime,
                endTime: newEndTime,
                rescheduleReason: dto.reason || null,
            },
        });
        // Update all resource allocations
        const timeDifference = dto.newStartTime.getTime() - appointment.startTime.getTime();
        for (const resource of appointment.resources) {
            await this.prisma.appointmentResource.update({
                where: { id: resource.id },
                data: {
                    startTime: new Date(resource.startTime.getTime() + timeDifference),
                    endTime: new Date(resource.endTime.getTime() + timeDifference),
                    preparationStart: resource.preparationStart
                        ? new Date(resource.preparationStart.getTime() + timeDifference)
                        : null,
                    cleanupEnd: resource.cleanupEnd
                        ? new Date(resource.cleanupEnd.getTime() + timeDifference)
                        : null,
                    updatedBy: context.userId,
                },
            });
        }
        return this.getAppointmentWithResources(dto.appointmentId, context);
    }
    /**
     * Cancel an appointment and release resources
     */
    async cancelAppointment(dto, context) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: dto.appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        // Update appointment status
        await this.prisma.appointment.update({
            where: { id: dto.appointmentId },
            data: {
                status: 'cancelled',
                cancellationReason: dto.reason || null,
            },
        });
        // Update all resource allocations to cancelled
        await this.prisma.appointmentResource.updateMany({
            where: { appointmentId: dto.appointmentId },
            data: {
                status: 'cancelled',
                updatedBy: context.userId,
            },
        });
        return { success: true, message: 'Appointment cancelled successfully' };
    }
    /**
     * Create appointment series (recurring appointments)
     */
    async createAppointmentSeries(dto, context) {
        // Validate patient
        const patient = await this.prisma.patient.findUnique({
            where: { id: dto.patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (patient.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        // Parse recurrence rule
        let occurrenceDates;
        try {
            const rule = rrule_1.RRule.fromString(dto.recurrenceRule);
            occurrenceDates = rule.all();
            // If totalOccurrences specified, limit to that count
            if (dto.totalOccurrences && occurrenceDates.length > dto.totalOccurrences) {
                occurrenceDates = occurrenceDates.slice(0, dto.totalOccurrences);
            }
            // If endDate specified, filter dates
            if (dto.endDate) {
                occurrenceDates = occurrenceDates.filter(date => date <= dto.endDate);
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new common_1.BadRequestException('Invalid recurrence rule: ' + message);
        }
        // Create appointment series record
        const series = await this.prisma.appointmentSeries.create({
            data: {
                tenantId: context.tenantId,
                patientId: dto.patientId,
                seriesName: dto.seriesName || null,
                appointmentType: dto.appointmentType,
                recurrencePattern: dto.recurrencePattern,
                recurrenceRule: dto.recurrenceRule,
                startDate: dto.startDate,
                endDate: dto.endDate || null,
                totalOccurrences: dto.totalOccurrences || occurrenceDates.length,
                occurrencesCreated: 0,
                status: 'active',
                createdBy: context.userId,
                updatedBy: context.userId,
            },
        });
        // Create individual appointments
        const createdAppointments = [];
        let successCount = 0;
        for (const occurrenceDate of occurrenceDates) {
            try {
                // Set preferred time for this occurrence
                const startTime = new Date(occurrenceDate);
                startTime.setHours(dto.preferredTime.hour, dto.preferredTime.minute, 0, 0);
                const endTime = new Date(startTime);
                endTime.setMinutes(endTime.getMinutes() + dto.durationMinutes);
                // Try to book appointment
                const bookingPayload = {
                    patientId: dto.patientId,
                    appointmentType: dto.appointmentType,
                    startTime,
                    endTime,
                    autoAllocateResources: true,
                };
                if (dto.facilityId) {
                    bookingPayload.facilityId = dto.facilityId;
                }
                if (dto.preferredResources && dto.preferredResources.length > 0) {
                    bookingPayload.preferredResources = dto.preferredResources;
                }
                if (dto.notes) {
                    bookingPayload.notes = dto.notes;
                }
                const appointment = await this.bookAppointment(bookingPayload, context);
                // Link to series
                await this.prisma.appointment.update({
                    where: { id: appointment.id },
                    data: { seriesId: series.id },
                });
                createdAppointments.push(appointment);
                successCount++;
            }
            catch (error) {
                // Log error but continue with other occurrences
                const message = error instanceof Error ? error.message : String(error);
                console.error(`Failed to create appointment for ${occurrenceDate}:`, message);
            }
        }
        // Update series with actual count created
        await this.prisma.appointmentSeries.update({
            where: { id: series.id },
            data: { occurrencesCreated: successCount },
        });
        return {
            series,
            appointmentsCreated: successCount,
            appointmentsFailed: occurrenceDates.length - successCount,
            appointments: createdAppointments,
        };
    }
    /**
     * Get appointment series with all appointments
     */
    async getAppointmentSeries(seriesId, context) {
        const series = await this.prisma.appointmentSeries.findUnique({
            where: { id: seriesId },
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                    },
                },
            },
        });
        if (!series) {
            throw new common_1.NotFoundException('Appointment series not found');
        }
        if (series.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        // Get all appointments in this series
        const appointments = await this.prisma.appointment.findMany({
            where: {
                tenantId: context.tenantId,
                seriesId: seriesId,
            },
            include: {
                resources: true,
            },
            orderBy: { startTime: 'asc' },
        });
        return {
            ...series,
            appointments,
        };
    }
    /**
     * Pause appointment series (prevents future appointments from being created)
     */
    async pauseAppointmentSeries(seriesId, context) {
        const series = await this.prisma.appointmentSeries.findUnique({
            where: { id: seriesId },
        });
        if (!series) {
            throw new common_1.NotFoundException('Appointment series not found');
        }
        if (series.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.appointmentSeries.update({
            where: { id: seriesId },
            data: {
                status: 'paused',
                updatedBy: context.userId,
            },
        });
    }
    /**
     * Resume appointment series
     */
    async resumeAppointmentSeries(seriesId, context) {
        const series = await this.prisma.appointmentSeries.findUnique({
            where: { id: seriesId },
        });
        if (!series) {
            throw new common_1.NotFoundException('Appointment series not found');
        }
        if (series.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.appointmentSeries.update({
            where: { id: seriesId },
            data: {
                status: 'active',
                updatedBy: context.userId,
            },
        });
    }
    /**
     * Cancel entire appointment series
     */
    async cancelAppointmentSeries(seriesId, reason, context) {
        const series = await this.prisma.appointmentSeries.findUnique({
            where: { id: seriesId },
        });
        if (!series) {
            throw new common_1.NotFoundException('Appointment series not found');
        }
        if (series.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        // Update series status
        await this.prisma.appointmentSeries.update({
            where: { id: seriesId },
            data: {
                status: 'cancelled',
                updatedBy: context.userId,
            },
        });
        // Cancel all future appointments in the series
        const now = new Date();
        const futureAppointments = await this.prisma.appointment.findMany({
            where: {
                tenantId: context.tenantId,
                seriesId,
                startTime: { gte: now },
                status: { not: 'cancelled' },
            },
        });
        for (const appointment of futureAppointments) {
            await this.cancelAppointment({
                appointmentId: appointment.id,
                reason: reason || 'Series cancelled',
            }, context);
        }
        return {
            success: true,
            message: 'Appointment series cancelled successfully',
            appointmentsCancelled: futureAppointments.length,
        };
    }
    /**
     * Get patient appointments
     */
    async getPatientAppointments(patientId, context, options) {
        const where = {
            tenantId: context.tenantId,
            patientId,
        };
        if (options?.startDate) {
            where.startTime = { gte: options.startDate };
        }
        if (options?.endDate) {
            where.endTime = { lte: options.endDate };
        }
        if (options?.status) {
            where.status = options.status;
        }
        return this.prisma.appointment.findMany({
            where,
            include: {
                resources: options?.includeResources || false,
            },
            orderBy: { startTime: 'asc' },
        });
    }
    /**
     * Get facility appointments for a date range
     */
    async getFacilityAppointments(startDate, endDate, context, options) {
        const where = {
            tenantId: context.tenantId,
            startTime: { gte: startDate, lte: endDate },
        };
        if (options?.facilityId) {
            where.facilityId = options.facilityId;
        }
        if (options?.status) {
            where.status = options.status;
        }
        return this.prisma.appointment.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                resources: options?.includeResources || false,
            },
            orderBy: { startTime: 'asc' },
        });
    }
    /**
     * Confirm appointment resource allocation
     */
    async confirmResource(resourceId, context) {
        const resource = await this.prisma.appointmentResource.findUnique({
            where: { id: resourceId },
        });
        if (!resource) {
            throw new common_1.NotFoundException('Appointment resource not found');
        }
        if (resource.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.appointmentResource.update({
            where: { id: resourceId },
            data: {
                status: 'confirmed',
                updatedBy: context.userId,
            },
        });
    }
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService,
        availability_service_1.AvailabilityService])
], AppointmentService);
//# sourceMappingURL=appointment.service.js.map