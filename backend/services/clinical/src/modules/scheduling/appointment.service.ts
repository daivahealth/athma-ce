/**
 * Appointment Service
 *
 * Manages appointment booking with multi-resource coordination
 */

import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { AvailabilityService } from './availability.service';
import { RRule } from 'rrule';
import { STANDARD_PATIENT_SELECT } from '../common/constants/patient-select.constant';
import { PatientDisplayDto } from '@zeal/contracts';
import axios, { AxiosInstance } from 'axios';

export interface RequestContext {
  userId: string;
  tenantId: string;
  facilityId: string;
  userRole: string;
}

export interface BookAppointmentDto {
  patientId: string;
  appointmentType: string;
  startTime: Date;
  endTime: Date;
  facilityId?: string;
  spaceId?: string;
  staffId?: string;
  preferredResources?: Array<{
    type: 'staff' | 'equipment' | 'space';
    id: string;
    role?: string;
  }>;
  notes?: string;
  visitType?: string;
  autoAllocateResources?: boolean; // If true, automatically allocate based on requirements
}

export interface RescheduleAppointmentDto {
  appointmentId: string;
  newStartTime: Date;
  newEndTime: Date;
  reason?: string;
}

export interface CancelAppointmentDto {
  appointmentId: string;
  reason?: string;
}

export interface CreateAppointmentSeriesDto {
  patientId: string;
  seriesName?: string;
  appointmentType: string;
  recurrencePattern: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurrenceRule: string; // RRULE format (RFC 5545)
  startDate: Date;
  endDate?: Date;
  totalOccurrences?: number;
  preferredTime: { hour: number; minute: number };
  durationMinutes: number;
  facilityId?: string;
  preferredResources?: Array<{
    type: 'staff' | 'equipment' | 'space';
    id: string;
    role?: string;
  }>;
  notes?: string;
}

export interface AllocateResourceDto {
  appointmentId: string;
  resourceType: 'staff' | 'equipment' | 'space';
  resourceId: string;
  resourceRole?: string;
  startTime: Date;
  endTime: Date;
  preparationStart?: Date;
  cleanupEnd?: Date;
}

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);
  private readonly foundationApi: AxiosInstance;

  constructor(
    private prisma: PrismaService,
    private availabilityService: AvailabilityService
  ) {
    // Initialize Foundation API client
    const foundationUrl = process.env.FOUNDATION_SERVICE_URL || 'http://localhost:3010';
    this.foundationApi = axios.create({
      baseURL: `${foundationUrl}/api/v1`,
      timeout: 5000,
    });
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Build patient display info from patient record
   */
  private buildPatientDisplay(patient: any): PatientDisplayDto {
    return {
      patientId: patient.id,
      mrn: patient.mrn,
      firstName: patient.firstName,
      lastName: patient.lastName,
      displayName: patient.displayName || `${patient.firstName} ${patient.lastName}`,
      age: this.calculateAge(patient.dateOfBirth),
      dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD format
      gender: patient.gender,
      nationalId: patient.nationalId || undefined,
      nationalIdType: patient.nationalIdType || undefined,
      phoneNumber: patient.phoneNumber || undefined,
      email: patient.email || undefined,
      nationality: patient.nationality || undefined,
      preferredLanguage: patient.preferredLanguage || undefined,
    };
  }

  /**
   * Fetch staff display name from Foundation API
   */
  private async fetchStaffDisplayName(
    staffId: string,
    tenantId: string
  ): Promise<string | null> {
    try {
      const response = await this.foundationApi.get(`/staff/${staffId}`, {
        headers: {
          'x-tenant-id': tenantId,
        },
      });
      const staff = response.data;
      return staff.displayName || `${staff.firstName || ''} ${staff.lastName || ''}`.trim() || null;
    } catch (error: any) {
      this.logger.warn(`Failed to fetch staff display name for ID ${staffId}: ${error?.message || 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Fetch facility name from Foundation API
   */
  private async fetchFacilityName(
    facilityId: string,
    tenantId: string
  ): Promise<string | null> {
    try {
      const response = await this.foundationApi.get(`/facilities/${facilityId}`, {
        headers: {
          'x-tenant-id': tenantId,
        },
      });
      const facility = response.data;
      return facility.name || null;
    } catch (error: any) {
      this.logger.warn(`Failed to fetch facility name for ID ${facilityId}: ${error?.message || 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Book an appointment with automatic or manual resource allocation
   */
  async bookAppointment(
    dto: BookAppointmentDto,
    context: RequestContext
  ) {
    // Validate time order
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('End time must be after start time');
    }

    // Validate patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (patient.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
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
            const availabilityOptions: {
              includePreparationTime?: boolean;
              preparationStart?: Date;
              cleanupEnd?: Date;
            } = {};

            if (requirement.preparationTimeMinutes > 0) {
              availabilityOptions.includePreparationTime = true;
              availabilityOptions.preparationStart = new Date(
                dto.startTime.getTime() - requirement.preparationTimeMinutes * 60000
              );
            }

            if (requirement.cleanupTimeMinutes > 0) {
              availabilityOptions.includePreparationTime = true;
              availabilityOptions.cleanupEnd = new Date(
                dto.endTime.getTime() + requirement.cleanupTimeMinutes * 60000
              );
            }

            const isAvailable = await this.availabilityService.isSlotAvailable(
              requirement.resourceType as 'staff' | 'equipment' | 'space',
              requirement.resourceId,
              dto.startTime,
              dto.endTime,
              context,
              availabilityOptions
            );

            if (!isAvailable) {
              throw new BadRequestException(
                `Required resource ${requirement.resourceRole || requirement.resourceType} is not available at the requested time`
              );
            }
          }
        }
      }
    } else if (dto.preferredResources && dto.preferredResources.length > 0) {
      // Verify preferred resources are available
      for (const resource of dto.preferredResources) {
        const isAvailable = await this.availabilityService.isSlotAvailable(
          resource.type,
          resource.id,
          dto.startTime,
          dto.endTime,
          context
        );

        if (!isAvailable) {
          throw new BadRequestException(
            `Resource ${resource.type} with id ${resource.id} is not available at the requested time`
          );
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
          const allocationRequest: AllocateResourceDto = {
            appointmentId: appointment.id,
            resourceType: requirement.resourceType as 'staff' | 'equipment' | 'space',
            resourceId: requirement.resourceId,
            startTime: dto.startTime,
            endTime: dto.endTime,
          };

          if (requirement.resourceRole) {
            allocationRequest.resourceRole = requirement.resourceRole;
          }

          if (requirement.preparationTimeMinutes > 0) {
            allocationRequest.preparationStart = new Date(
              dto.startTime.getTime() - requirement.preparationTimeMinutes * 60000
            );
          }

          if (requirement.cleanupTimeMinutes > 0) {
            allocationRequest.cleanupEnd = new Date(
              dto.endTime.getTime() + requirement.cleanupTimeMinutes * 60000
            );
          }

          const resource = await this.allocateResource(allocationRequest, context);
          allocatedResources.push(resource);
        }
      }
    } else if (dto.preferredResources && dto.preferredResources.length > 0) {
      for (const resource of dto.preferredResources) {
        const allocationRequest: AllocateResourceDto = {
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
  async allocateResource(
    dto: AllocateResourceDto,
    context: RequestContext
  ) {
    // Verify appointment exists and belongs to tenant
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    // Check resource availability
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

    if (!isAvailable) {
      throw new BadRequestException(
        `Resource ${dto.resourceType} is not available at the requested time`
      );
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
  async getAppointmentWithResources(
    appointmentId: string,
    context: RequestContext
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        resources: true,
        patient: {
          select: STANDARD_PATIENT_SELECT,
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    // Build PatientDisplayDto
    const patientDisplay = appointment.patient ? this.buildPatientDisplay(appointment.patient) : null;

    // Fetch staff display name if staffId exists
    let staffDisplayName: string | null = null;
    if (appointment.staffId) {
      staffDisplayName = await this.fetchStaffDisplayName(appointment.staffId, context.tenantId);
    }

    // Fetch facility name if facilityId exists
    let facilityName: string | null = null;
    if (appointment.facilityId) {
      facilityName = await this.fetchFacilityName(appointment.facilityId, context.tenantId);
    }

    return {
      ...appointment,
      patientDisplay,
      staffDisplayName,
      facilityName,
    };
  }

  /**
   * Reschedule an appointment and its resources
   */
  async rescheduleAppointment(
    dto: RescheduleAppointmentDto,
    context: RequestContext
  ) {
    // Get appointment with resources
    const appointment = await this.getAppointmentWithResources(dto.appointmentId, context);

    // Calculate duration
    const durationMs = appointment.endTime.getTime() - appointment.startTime.getTime();
    const newEndTime = dto.newEndTime || new Date(dto.newStartTime.getTime() + durationMs);

    // Verify all resources are available at new time
    for (const resource of appointment.resources) {
      const isAvailable = await this.availabilityService.isSlotAvailable(
        resource.resourceType as 'staff' | 'equipment' | 'space',
        resource.resourceId,
        dto.newStartTime,
        newEndTime,
        context,
        {
          ...(resource.preparationStart ? { preparationStart: resource.preparationStart } : {}),
          ...(resource.cleanupEnd ? { cleanupEnd: resource.cleanupEnd } : {}),
        }
      );

      if (!isAvailable) {
        throw new BadRequestException(
          `Resource ${resource.resourceType} (${resource.resourceRole || resource.resourceId}) is not available at the new time`
        );
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
  async cancelAppointment(
    dto: CancelAppointmentDto,
    context: RequestContext
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
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
  async createAppointmentSeries(
    dto: CreateAppointmentSeriesDto,
    context: RequestContext
  ) {
    // Validate patient
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (patient.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    // Parse recurrence rule
    let occurrenceDates: Date[];
    try {
      const rule = RRule.fromString(dto.recurrenceRule);
      occurrenceDates = rule.all();

      // If totalOccurrences specified, limit to that count
      if (dto.totalOccurrences && occurrenceDates.length > dto.totalOccurrences) {
        occurrenceDates = occurrenceDates.slice(0, dto.totalOccurrences);
      }

      // If endDate specified, filter dates
      if (dto.endDate) {
        occurrenceDates = occurrenceDates.filter(date => date <= dto.endDate!);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException('Invalid recurrence rule: ' + message);
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
        const bookingPayload: BookAppointmentDto = {
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
      } catch (error) {
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
  async getAppointmentSeries(
    seriesId: string,
    context: RequestContext
  ) {
    const series = await this.prisma.appointmentSeries.findUnique({
      where: { id: seriesId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!series) {
      throw new NotFoundException('Appointment series not found');
    }

    if (series.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
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
  async pauseAppointmentSeries(
    seriesId: string,
    context: RequestContext
  ) {
    const series = await this.prisma.appointmentSeries.findUnique({
      where: { id: seriesId },
    });

    if (!series) {
      throw new NotFoundException('Appointment series not found');
    }

    if (series.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
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
  async resumeAppointmentSeries(
    seriesId: string,
    context: RequestContext
  ) {
    const series = await this.prisma.appointmentSeries.findUnique({
      where: { id: seriesId },
    });

    if (!series) {
      throw new NotFoundException('Appointment series not found');
    }

    if (series.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
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
  async cancelAppointmentSeries(
    seriesId: string,
    reason: string,
    context: RequestContext
  ) {
    const series = await this.prisma.appointmentSeries.findUnique({
      where: { id: seriesId },
    });

    if (!series) {
      throw new NotFoundException('Appointment series not found');
    }

    if (series.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
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
      await this.cancelAppointment(
        {
          appointmentId: appointment.id,
          reason: reason || 'Series cancelled',
        },
        context
      );
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
  async getPatientAppointments(
    patientId: string,
    context: RequestContext,
    options?: {
      startDate?: Date;
      endDate?: Date;
      status?: string;
      includeResources?: boolean;
    }
  ) {
    const where: any = {
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
  async getFacilityAppointments(
    startDate: Date,
    endDate: Date,
    context: RequestContext,
    options?: {
      facilityId?: string;
      status?: string;
      includeResources?: boolean;
    }
  ) {
    const where: any = {
      tenantId: context.tenantId,
      startTime: { gte: startDate, lte: endDate },
    };

    if (options?.facilityId) {
      where.facilityId = options.facilityId;
    }

    if (options?.status) {
      where.status = options.status;
    }

    const appointments = await this.prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: STANDARD_PATIENT_SELECT,
        },
        resources: options?.includeResources || false,
      },
      orderBy: { startTime: 'asc' },
    });

    // Transform appointments to include patientDisplay
    return appointments.map((appointment) => ({
      ...appointment,
      patientDisplay: appointment.patient ? this.buildPatientDisplay(appointment.patient) : null,
      patient: undefined, // Remove raw patient data
    }));
  }

  /**
   * Confirm appointment resource allocation
   */
  async confirmResource(
    resourceId: string,
    context: RequestContext
  ) {
    const resource = await this.prisma.appointmentResource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new NotFoundException('Appointment resource not found');
    }

    if (resource.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.appointmentResource.update({
      where: { id: resourceId },
      data: {
        status: 'confirmed',
        updatedBy: context.userId,
      },
    });
  }
}
