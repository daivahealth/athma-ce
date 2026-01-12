/**
 * Event Service
 *
 * Business logic for inpatient event logging with comprehensive audit trail
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  CreateEventDto,
  InpatientEventType,
  InpatientAdmissionStatus,
  InpatientDischargeStatus,
  InpatientAcuity,
} from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get events for an admission with optional filtering
   */
  async getAdmissionEvents(
    admissionId: string,
    tenantId: string,
    options?: {
      eventTypes?: InpatientEventType[];
      limit?: number;
    }
  ) {
    // Verify admission exists
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${admissionId} not found`);
    }

    // Get events
    const events = await this.prisma.inpatientEvent.findMany({
      where: {
        tenantId,
        admissionId,
        ...(options?.eventTypes && { eventType: { in: options.eventTypes } }),
      },
      orderBy: {
        performedAt: 'desc',
      },
      ...(options?.limit && { take: options.limit }),
    });

    return events;
  }

  /**
   * Get events for a patient across all admissions
   */
  async getPatientEvents(
    patientId: string,
    tenantId: string,
    options?: {
      eventTypes?: InpatientEventType[];
      limit?: number;
    }
  ) {
    const events = await this.prisma.inpatientEvent.findMany({
      where: {
        tenantId,
        patientId,
        ...(options?.eventTypes && { eventType: { in: options.eventTypes } }),
      },
      orderBy: {
        performedAt: 'desc',
      },
      ...(options?.limit && { take: options.limit }),
    });

    return events;
  }

  /**
   * Create an event (full DTO)
   */
  async createEvent(dto: CreateEventDto, tenantId: string) {
    // Create event
    const event = await this.prisma.inpatientEvent.create({
      data: {
        tenantId,
        facilityId: dto.facilityId,
        admissionId: dto.admissionId,
        encounterId: dto.encounterId,
        patientId: dto.patientId,
        eventType: dto.eventType,

        // Status changes (only include if present)
        ...(dto.fromAdmissionStatus && { fromAdmissionStatus: dto.fromAdmissionStatus }),
        ...(dto.toAdmissionStatus && { toAdmissionStatus: dto.toAdmissionStatus }),
        ...(dto.fromDischargeStatus && { fromDischargeStatus: dto.fromDischargeStatus }),
        ...(dto.toDischargeStatus && { toDischargeStatus: dto.toDischargeStatus }),
        ...(dto.fromAcuity && { fromAcuity: dto.fromAcuity }),
        ...(dto.toAcuity && { toAcuity: dto.toAcuity }),

        // Location changes (only include if present)
        ...(dto.fromWardId && { fromWardId: dto.fromWardId }),
        ...(dto.fromSpaceId && { fromSpaceId: dto.fromSpaceId }),
        ...(dto.fromBedId && { fromBedId: dto.fromBedId }),
        ...(dto.toWardId && { toWardId: dto.toWardId }),
        ...(dto.toSpaceId && { toSpaceId: dto.toSpaceId }),
        ...(dto.toBedId && { toBedId: dto.toBedId }),

        // Context (only include if present)
        ...(dto.reason && { reason: dto.reason }),
        ...(dto.metadata && { metadata: dto.metadata }),
        performedBy: dto.performedBy,
        performedAt: new Date(),
      },
    });

    return event;
  }

  /**
   * Helper: Log admission status change
   */
  async logAdmissionStatusChange(
    admissionId: string,
    fromStatus: InpatientAdmissionStatus,
    toStatus: InpatientAdmissionStatus,
    userId: string,
    tenantId: string,
    reason?: string
  ) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    return this.createEvent({
      facilityId: admission.facilityId,
      admissionId,
      encounterId: admission.encounterId,
      patientId: admission.patientId,
      eventType: InpatientEventType.STATUS_CHANGED,
      fromAdmissionStatus: fromStatus,
      toAdmissionStatus: toStatus,
      ...(reason && { reason }),
      performedBy: userId,
    }, tenantId);
  }

  /**
   * Helper: Log discharge status change
   */
  async logDischargeStatusChange(
    admissionId: string,
    fromStatus: InpatientDischargeStatus,
    toStatus: InpatientDischargeStatus,
    userId: string,
    tenantId: string,
    reason?: string
  ) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    return this.createEvent({
      facilityId: admission.facilityId,
      admissionId,
      encounterId: admission.encounterId,
      patientId: admission.patientId,
      eventType: InpatientEventType.DISCHARGE_STATUS_CHANGED,
      fromDischargeStatus: fromStatus,
      toDischargeStatus: toStatus,
      ...(reason && { reason }),
      performedBy: userId,
    }, tenantId);
  }

  /**
   * Helper: Log acuity change
   */
  async logAcuityChange(
    admissionId: string,
    fromAcuity: InpatientAcuity,
    toAcuity: InpatientAcuity,
    userId: string,
    tenantId: string,
    reason?: string
  ) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    return this.createEvent({
      facilityId: admission.facilityId,
      admissionId,
      encounterId: admission.encounterId,
      patientId: admission.patientId,
      eventType: InpatientEventType.ACUITY_CHANGED,
      fromAcuity,
      toAcuity,
      ...(reason && { reason }),
      performedBy: userId,
    }, tenantId);
  }

  /**
   * Helper: Log transfer
   */
  async logTransfer(
    admissionId: string,
    fromWardId: string,
    fromSpaceId: string,
    fromBedId: string,
    toWardId: string,
    toSpaceId: string,
    toBedId: string,
    userId: string,
    tenantId: string,
    reason?: string
  ) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    return this.createEvent({
      facilityId: admission.facilityId,
      admissionId,
      encounterId: admission.encounterId,
      patientId: admission.patientId,
      eventType: InpatientEventType.TRANSFERRED,
      fromWardId,
      fromSpaceId,
      fromBedId,
      toWardId,
      toSpaceId,
      toBedId,
      ...(reason && { reason }),
      performedBy: userId,
    }, tenantId);
  }

  /**
   * Helper: Log admission created
   */
  async logAdmissionCreated(
    admissionId: string,
    userId: string,
    tenantId: string
  ) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    return this.createEvent({
      facilityId: admission.facilityId,
      admissionId,
      encounterId: admission.encounterId,
      patientId: admission.patientId,
      eventType: InpatientEventType.ADMISSION_CREATED,
      performedBy: userId,
    }, tenantId);
  }

  /**
   * Helper: Log bed assignment
   */
  async logBedAssignment(
    admissionId: string,
    bedId: string,
    wardId: string,
    spaceId: string,
    userId: string,
    tenantId: string,
    reason?: string
  ) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    return this.createEvent({
      facilityId: admission.facilityId,
      admissionId,
      encounterId: admission.encounterId,
      patientId: admission.patientId,
      eventType: InpatientEventType.BED_ASSIGNED,
      toBedId: bedId,
      toWardId: wardId,
      toSpaceId: spaceId,
      ...(reason && { reason }),
      performedBy: userId,
    }, tenantId);
  }

  /**
   * Helper: Log bed release
   */
  async logBedRelease(
    admissionId: string,
    bedId: string,
    wardId: string,
    spaceId: string,
    userId: string,
    tenantId: string,
    reason?: string
  ) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    return this.createEvent({
      facilityId: admission.facilityId,
      admissionId,
      encounterId: admission.encounterId,
      patientId: admission.patientId,
      eventType: InpatientEventType.BED_RELEASED,
      fromBedId: bedId,
      fromWardId: wardId,
      fromSpaceId: spaceId,
      ...(reason && { reason }),
      performedBy: userId,
    }, tenantId);
  }

  /**
   * Helper: Log discharge confirmation
   */
  async logDischargeConfirmed(
    admissionId: string,
    userId: string,
    tenantId: string,
    reason?: string
  ) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    return this.createEvent({
      facilityId: admission.facilityId,
      admissionId,
      encounterId: admission.encounterId,
      patientId: admission.patientId,
      eventType: InpatientEventType.DISCHARGE_CONFIRMED,
      ...(reason && { reason }),
      performedBy: userId,
    }, tenantId);
  }
}
