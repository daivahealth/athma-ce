/**
 * Discharge Service
 *
 * Business logic for patient discharge workflows
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { DischargePatientDto } from './dto/discharge-patient.dto';
import { UpdateDischargeChecklistDto } from './dto/update-discharge-checklist.dto';

@Injectable()
export class DischargeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get discharge checklist for an admission
   */
  async getDischargeChecklist(admissionId: string, tenantId: string) {
    // Verify admission exists
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${admissionId} not found`);
    }

    // Get or create discharge checklist
    let checklist = await this.prisma.dischargeChecklist.findUnique({
      where: { admissionId },
    });

    if (!checklist) {
      // Create default checklist with current schema fields
      checklist = await this.prisma.dischargeChecklist.create({
        data: {
          tenantId,
          admissionId,
          patientId: admission.patientId,
          medicalClearance: false,
          medicationsReconciled: false,
          dischargePrescriptionsIssued: false,
          followUpAppointmentScheduled: false,
          dischargInstructionsProvided: false,
          patientEducationCompleted: false,
          dmeOrdered: false,
          homeHealthOrdered: false,
          transportationArranged: false,
          billingCleared: false,
          insuranceNotified: false,
          medicalRecordsCompleted: false,
          readyForDischarge: false,
          createdBy: admission.createdBy,
        },
      });
    }

    return checklist;
  }

  /**
   * Update discharge checklist
   */
  async updateDischargeChecklist(
    admissionId: string,
    dto: UpdateDischargeChecklistDto,
    context: any
  ) {
    const { tenantId, userId } = context;

    // Verify admission exists
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${admissionId} not found`);
    }

    // Get or create checklist
    let checklist = await this.prisma.dischargeChecklist.findUnique({
      where: { admissionId },
    });

    if (!checklist) {
      checklist = await this.prisma.dischargeChecklist.create({
        data: {
          tenantId,
          admissionId,
          patientId: admission.patientId,
          medicalClearance: false,
          medicationsReconciled: false,
          dischargePrescriptionsIssued: false,
          followUpAppointmentScheduled: false,
          dischargInstructionsProvided: false,
          patientEducationCompleted: false,
          dmeOrdered: false,
          homeHealthOrdered: false,
          transportationArranged: false,
          billingCleared: false,
          insuranceNotified: false,
          medicalRecordsCompleted: false,
          readyForDischarge: false,
          createdBy: admission.createdBy,
        },
      });
    }

    // Update checklist
    const updated = await this.prisma.dischargeChecklist.update({
      where: { id: checklist.id },
      data: {
        ...dto,
        updatedBy: userId,
      },
    });

    // Create event if marked ready for discharge
    if (dto.readyForDischarge && !checklist.readyForDischarge) {
      await this.prisma.inpatientEvent.create({
        data: {
          tenantId,
          admissionId,
          patientId: admission.patientId,
          eventType: 'discharge_initiated',
          eventCategory: 'discharge',
          eventData: {
            checklistCompleted: true,
          },
          performedBy: userId,
          performedAt: new Date(),
        },
      });
    }

    return updated;
  }

  /**
   * Discharge patient
   */
  async dischargePatient(
    admissionId: string,
    dto: DischargePatientDto,
    context: any
  ) {
    const { tenantId, userId } = context;

    // Verify admission exists
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
      include: {
        dischargeChecklist: true,
      },
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${admissionId} not found`);
    }

    if (admission.status !== 'admitted') {
      throw new BadRequestException(
        `Cannot discharge patient with status: ${admission.status}`
      );
    }

    // Check discharge checklist (warning only, not blocking)
    if (
      admission.dischargeChecklist &&
      !admission.dischargeChecklist.readyForDischarge
    ) {
      console.warn(
        `Discharging patient without completed checklist: ${admissionId}`
      );
    }

    const dischargeDate = new Date(dto.actualDischargeDate);

    // Calculate length of stay
    const admissionDate = new Date(admission.admissionDate);
    const lengthOfStayDays = Math.ceil(
      (dischargeDate.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Release current bed assignment
    await this.prisma.bedAssignment.updateMany({
      where: {
        tenantId,
        admissionId,
        releasedAt: null,
      },
      data: {
        releasedAt: dischargeDate,
        releasedBy: userId,
      },
    });

    // Update admission
    const updated = await this.prisma.inpatientAdmission.update({
      where: { id: admissionId },
      data: {
        status: 'discharged',
        actualDischargeDate: dischargeDate,
        dischargeType: dto.dischargeType || null,
        dischargeDestination: dto.dischargeDestination || null,
        dischargeNotes: dto.dischargeNotes || null,
        dischargedBy: userId,
        lengthOfStayDays,
        currentWardId: null,
        currentBedId: null,
        currentSpaceId: null,
        updatedBy: userId,
      },
    });

    // Update encounter
    await this.prisma.encounter.update({
      where: { id: admission.encounterId },
      data: {
        status: 'finished',
        endTime: dischargeDate,
      },
    });

    // Create discharge event
    await this.prisma.inpatientEvent.create({
      data: {
        tenantId,
        admissionId,
        patientId: admission.patientId,
        eventType: 'discharge_completed',
        eventCategory: 'discharge',
        eventData: {
          dischargeType: dto.dischargeType,
          dischargeDestination: dto.dischargeDestination,
          lengthOfStayDays,
        },
        performedBy: userId,
        performedAt: dischargeDate,
        notes: dto.dischargeNotes || null,
      },
    });

    // TODO: Trigger PRM event for discharge follow-up
    // TODO: Notify RCM service for final billing

    return {
      id: updated.id,
      admissionNumber: updated.admissionNumber,
      status: updated.status,
      actualDischargeDate: updated.actualDischargeDate,
      dischargeType: updated.dischargeType,
      lengthOfStayDays: updated.lengthOfStayDays,
    };
  }
}
