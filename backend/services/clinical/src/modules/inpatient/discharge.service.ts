/**
 * Discharge Service
 *
 * Business logic for patient discharge workflows
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { DischargePatientDto } from './dto/discharge-patient.dto';
import { UpdateDischargeChecklistDto } from './dto/update-discharge-checklist.dto';
import { EventService } from './event.service';
import {
  InpatientAdmissionStatus,
  InpatientDischargeStatus,
} from './dto/create-event.dto';

@Injectable()
export class DischargeService {
  private readonly logger = new Logger(DischargeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService
  ) {}

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
   * Updates discharge status workflow based on checklist completion
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

    // Determine new discharge status based on checklist state
    let newDischargeStatus: InpatientDischargeStatus | undefined;
    let statusChangeReason: string | undefined;

    // If checklist is being marked as ready for discharge
    if (dto.readyForDischarge && !checklist.readyForDischarge) {
      newDischargeStatus = InpatientDischargeStatus.READY;
      statusChangeReason = 'Discharge checklist completed and approved';
    }
    // If checklist was ready but now being unmarked (e.g., issues found)
    else if (dto.readyForDischarge === false && checklist.readyForDischarge) {
      newDischargeStatus = InpatientDischargeStatus.PLANNING;
      statusChangeReason = 'Discharge readiness status revoked, returning to planning';
    }
    // If first update to checklist (moving from NONE to PLANNING)
    else if (
      !checklist.readyForDischarge &&
      admission.dischargeStatus === InpatientDischargeStatus.NONE
    ) {
      newDischargeStatus = InpatientDischargeStatus.PLANNING;
      statusChangeReason = 'Discharge planning initiated';
    }

    // Update checklist and admission status in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Update checklist
      const updatedChecklist = await tx.dischargeChecklist.update({
        where: { id: checklist.id },
        data: {
          ...dto,
          updatedBy: userId,
        },
      });

      // Update admission discharge status if needed
      if (newDischargeStatus && newDischargeStatus !== admission.dischargeStatus) {
        await tx.inpatientAdmission.update({
          where: { id: admissionId },
          data: {
            dischargeStatus: newDischargeStatus,
            updatedBy: userId,
          },
        });

        // Log discharge status change
        await this.eventService.logDischargeStatusChange(
          admissionId,
          admission.dischargeStatus,
          newDischargeStatus,
          userId,
          tenantId,
          statusChangeReason
        );

        this.logger.log(
          `Discharge status updated: ${admission.dischargeStatus} → ${newDischargeStatus} for admission ${admissionId}`
        );
      }

      return updatedChecklist;
    });

    return result;
  }

  /**
   * Discharge patient
   * Confirms discharge and updates all statuses atomically
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

    // Check admission status (use new enum)
    if (
      admission.admissionStatus === InpatientAdmissionStatus.DISCHARGED ||
      admission.admissionStatus === InpatientAdmissionStatus.CANCELLED ||
      admission.admissionStatus === InpatientAdmissionStatus.EXPIRED
    ) {
      throw new BadRequestException(
        `Cannot discharge patient with admission status: ${admission.admissionStatus}`
      );
    }

    // Check discharge checklist (warning only, not blocking)
    if (
      admission.dischargeChecklist &&
      !admission.dischargeChecklist.readyForDischarge
    ) {
      this.logger.warn(
        `Discharging patient without completed checklist: ${admissionId}`
      );
    }

    const dischargeDate = new Date(dto.actualDischargeDate);

    // Calculate length of stay
    const admissionDate = new Date(admission.admissionDate);
    const lengthOfStayDays = Math.ceil(
      (dischargeDate.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Perform discharge in atomic transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Step 1: Release current bed assignment and mark as needing cleaning
      await tx.bedAssignment.updateMany({
        where: {
          tenantId,
          admissionId,
          releasedAt: null,
        },
        data: {
          releasedAt: dischargeDate,
          releasedBy: userId,
          cleaningRequired: true, // Mark bed for cleaning after discharge
        },
      });

      // Step 2: Update admission with new status model
      const updatedAdmission = await tx.inpatientAdmission.update({
        where: { id: admissionId },
        data: {
          // Update both status fields
          admissionStatus: InpatientAdmissionStatus.DISCHARGED,
          dischargeStatus: InpatientDischargeStatus.CONFIRMED,
          // Legacy field for backward compatibility
          status: 'discharged',
          // Discharge details
          actualDischargeDate: dischargeDate,
          dischargeType: dto.dischargeType || null,
          dischargeDestination: dto.dischargeDestination || null,
          dischargeNotes: dto.dischargeNotes || null,
          dischargedBy: userId,
          lengthOfStayDays,
          // Clear current location
          currentWardId: null,
          currentBedId: null,
          currentSpaceId: null,
          updatedBy: userId,
        },
      });

      // Step 3: Update encounter
      await tx.encounter.update({
        where: { id: admission.encounterId },
        data: {
          status: 'finished',
          endTime: dischargeDate,
        },
      });

      // Step 4: Log discharge confirmed event using EventService
      await this.eventService.logDischargeConfirmed(
        admissionId,
        userId,
        tenantId,
        dto.dischargeNotes
      );

      this.logger.log(
        `Patient discharged: Admission ${admissionId}, LOS: ${lengthOfStayDays} days`
      );

      return updatedAdmission;
    });

    // TODO: Trigger PRM event for discharge follow-up
    // TODO: Notify RCM service for final billing

    return {
      id: result.id,
      admissionNumber: result.admissionNumber,
      admissionStatus: result.admissionStatus,
      dischargeStatus: result.dischargeStatus,
      status: result.status, // Legacy field
      actualDischargeDate: result.actualDischargeDate,
      dischargeType: result.dischargeType,
      lengthOfStayDays: result.lengthOfStayDays,
    };
  }
}
