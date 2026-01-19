/**
 * Discharge Transaction Service
 * Manages the comprehensive discharge workflow using InpatientDischarge table
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  PrismaService,
  DischargeTransactionStatus,
  DischargeType,
  DischargeDestination,
  InpatientAdmissionStatus,
  InpatientDischargeStatus,
  InpatientEventType,
  ChannelStatus,
} from '@zeal/database-clinical';
import { ChannelEventEmitter } from './channel-event-emitter.service';
import { EventService } from './event.service';

@Injectable()
export class DischargeTransactionService {
  private readonly logger = new Logger(DischargeTransactionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly channelEventEmitter: ChannelEventEmitter,
    private readonly eventService: EventService,
  ) {}

  /**
   * Initiate discharge planning
   * Creates a new discharge transaction when planning begins
   */
  async initiateDischargePlanning(
    admissionId: string,
    dto: {
      targetDischargeDate?: Date;
      targetDischargeTime?: string;
      approvalRequired?: boolean;
      internalNotes?: string;
    },
    context: any
  ) {
    const { tenantId, facilityId, userId } = context;

    // Verify admission exists and is not already discharged
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
      include: { discharge: true },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    if (admission.discharge) {
      throw new BadRequestException('Discharge planning already initiated for this admission');
    }

    if (admission.admissionStatus === InpatientAdmissionStatus.DISCHARGED) {
      throw new BadRequestException('Patient already discharged');
    }

    // Create discharge transaction
    const discharge = await this.prisma.inpatientDischarge.create({
      data: {
        tenantId,
        facilityId,
        admissionId,
        patientId: admission.patientId,
        encounterId: admission.encounterId,
        status: DischargeTransactionStatus.PLANNING,
        initiatedBy: userId,
        initiatedAt: new Date(),
        targetDischargeDate: dto.targetDischargeDate ? new Date(dto.targetDischargeDate) : null,
        targetDischargeTime: dto.targetDischargeTime || null,
        approvalRequired: dto.approvalRequired || false,
        internalNotes: dto.internalNotes || null,
        createdBy: userId,
      },
    });

    // Update admission discharge status
    await this.prisma.inpatientAdmission.update({
      where: { id: admissionId },
      data: {
        dischargeStatus: InpatientDischargeStatus.INITIATED,
        updatedBy: userId,
      },
    });

    // Create event
    await this.eventService.createEvent({
      admissionId,
      encounterId: admission.encounterId,
      patientId: admission.patientId,
      eventType: InpatientEventType.DISCHARGE_STATUS_CHANGED,
      facilityId,
      fromDischargeStatus: InpatientDischargeStatus.NONE,
      toDischargeStatus: InpatientDischargeStatus.INITIATED,
      reason: 'Discharge planning initiated',
      performedBy: userId,
    }, tenantId);

    // Emit discharge planning initiated message to care channel
    const channel = await this.prisma.careChannel.findUnique({
      where: { admissionId, tenantId },
    });

    if (channel) {
      const dischargeDetails: {
        targetDischargeDate?: Date;
        targetDischargeTime?: string;
        initiatedBy: string;
      } = {
        initiatedBy: userId,
      };

      if (dto.targetDischargeDate) {
        dischargeDetails.targetDischargeDate = dto.targetDischargeDate;
      }
      if (dto.targetDischargeTime) {
        dischargeDetails.targetDischargeTime = dto.targetDischargeTime;
      }

      await this.channelEventEmitter.emitDischargePlanningInitiated(
        discharge.id,
        channel.id,
        dischargeDetails,
        null,
        context,
      );
      this.logger.log(`Discharge planning message posted to channel ${channel.id}`);
    }

    this.logger.log(`Discharge planning initiated for admission ${admissionId}`);

    return discharge;
  }

  /**
   * Get discharge transaction by admission ID
   */
  async getDischargeByAdmissionId(admissionId: string, tenantId: string) {
    const discharge = await this.prisma.inpatientDischarge.findUnique({
      where: { admissionId, tenantId },
      include: {
        admission: {
          select: {
            admissionNumber: true,
            patientId: true,
            admissionDate: true,
          },
        },
        checklistInstance: {
          include: {
            template: true,
            responses: true,
          },
        },
      },
    });

    if (!discharge) {
      throw new NotFoundException(`Discharge not found for admission ${admissionId}`);
    }

    return discharge;
  }

  /**
   * Mark discharge as ready
   * Called when checklist is verified and patient is medically ready
   */
  async markReady(
    dischargeId: string,
    remarks: string | undefined,
    context: any
  ) {
    const { tenantId, userId } = context;

    const discharge = await this.prisma.inpatientDischarge.findUnique({
      where: { id: dischargeId, tenantId },
      include: { admission: true },
    });

    if (!discharge) {
      throw new NotFoundException(`Discharge ${dischargeId} not found`);
    }

    if (discharge.status !== DischargeTransactionStatus.PLANNING) {
      throw new BadRequestException('Discharge must be in PLANNING status');
    }

    // Update discharge to READY
    const updated = await this.prisma.inpatientDischarge.update({
      where: { id: dischargeId },
      data: {
        status: DischargeTransactionStatus.READY,
        readyMarkedAt: new Date(),
        readyMarkedBy: userId,
        readyRemarks: remarks || null,
        updatedBy: userId,
      },
    });

    // Update admission status
    await this.prisma.inpatientAdmission.update({
      where: { id: discharge.admissionId },
      data: {
        dischargeStatus: InpatientDischargeStatus.READY,
        updatedBy: userId,
      },
    });

    // Create event
    await this.eventService.createEvent({
      admissionId: discharge.admissionId,
      encounterId: discharge.encounterId,
      patientId: discharge.patientId,
      eventType: InpatientEventType.DISCHARGE_STATUS_CHANGED,
      facilityId: discharge.facilityId,
      fromDischargeStatus: InpatientDischargeStatus.INITIATED,
      toDischargeStatus: InpatientDischargeStatus.READY,
      reason: 'Patient ready for discharge',
      performedBy: userId,
    }, tenantId);

    // Emit discharge ready message to care channel
    const channel = await this.prisma.careChannel.findUnique({
      where: { admissionId: discharge.admissionId, tenantId },
    });

    if (channel) {
      const readyDetails: {
        readyMarkedBy: string;
        readyRemarks?: string;
      } = {
        readyMarkedBy: userId,
      };

      if (remarks) {
        readyDetails.readyRemarks = remarks;
      }

      await this.channelEventEmitter.emitDischargeReady(
        dischargeId,
        channel.id,
        readyDetails,
        null,
        context,
      );
      this.logger.log(`Discharge ready message posted to channel ${channel.id}`);
    }

    this.logger.log(`Discharge ${dischargeId} marked as READY`);

    return updated;
  }

  /**
   * Approve discharge (if approval workflow is enabled)
   */
  async approveDischarge(
    dischargeId: string,
    remarks: string | undefined,
    context: any
  ) {
    const { tenantId, userId } = context;

    const discharge = await this.prisma.inpatientDischarge.findUnique({
      where: { id: dischargeId, tenantId },
    });

    if (!discharge) {
      throw new NotFoundException(`Discharge ${dischargeId} not found`);
    }

    if (!discharge.approvalRequired) {
      throw new BadRequestException('Approval not required for this discharge');
    }

    if (discharge.status !== DischargeTransactionStatus.READY) {
      throw new BadRequestException('Discharge must be READY before approval');
    }

    // Update to APPROVED
    const updated = await this.prisma.inpatientDischarge.update({
      where: { id: dischargeId },
      data: {
        status: DischargeTransactionStatus.APPROVED,
        approvedBy: userId,
        approvedAt: new Date(),
        approvalRemarks: remarks || null,
        updatedBy: userId,
      },
    });

    // Emit discharge approved message to care channel
    const channel = await this.prisma.careChannel.findUnique({
      where: { admissionId: discharge.admissionId, tenantId },
    });

    if (channel) {
      const approvalDetails: {
        approvedBy: string;
        approvalRemarks?: string;
      } = {
        approvedBy: userId,
      };

      if (remarks) {
        approvalDetails.approvalRemarks = remarks;
      }

      await this.channelEventEmitter.emitDischargeApproved(
        dischargeId,
        channel.id,
        approvalDetails,
        null,
        context,
      );
      this.logger.log(`Discharge approved message posted to channel ${channel.id}`);
    }

    this.logger.log(`Discharge ${dischargeId} approved by ${userId}`);

    return updated;
  }

  /**
   * Execute discharge - actually discharge the patient
   */
  async executeDischarge(
    dischargeId: string,
    dto: {
      dischargeType: DischargeType;
      dischargeDestination: DischargeDestination;
      dischargeDisposition?: string;
      dischargeSummaryId?: string;
      finalDiagnosis?: any;
      dischargeMedications?: any;
      followUpInstructions?: string;
      followUpAppointments?: any;
      dietInstructions?: string;
      activityRestrictions?: string;
    },
    context: any
  ) {
    const { tenantId, userId } = context;

    return await this.prisma.$transaction(async (tx) => {
      const discharge = await tx.inpatientDischarge.findUnique({
        where: { id: dischargeId, tenantId },
        include: { admission: true },
      });

      if (!discharge) {
        throw new NotFoundException(`Discharge ${dischargeId} not found`);
      }

      // Validate status
      const validStatuses: DischargeTransactionStatus[] = [
        DischargeTransactionStatus.READY,
        DischargeTransactionStatus.APPROVED,
      ];
      if (!validStatuses.includes(discharge.status as DischargeTransactionStatus)) {
        throw new BadRequestException('Discharge must be READY or APPROVED to execute');
      }

      const now = new Date();
      const admissionDate = new Date(discharge.admission.admissionDate);
      const lengthOfStayDays = Math.ceil(
        (now.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const planningDurationHours = Math.ceil(
        (now.getTime() - new Date(discharge.initiatedAt).getTime()) / (1000 * 60 * 60)
      );

      // Update discharge transaction
      const updated = await tx.inpatientDischarge.update({
        where: { id: dischargeId },
        data: {
          status: DischargeTransactionStatus.EXECUTED,
          actualDischargeDate: now,
          actualDischargeTime: now.toTimeString().substring(0, 5),
          dischargedBy: userId,
          dischargeType: dto.dischargeType,
          dischargeDestination: dto.dischargeDestination,
          dischargeDisposition: dto.dischargeDisposition || null,
          dischargeSummaryId: dto.dischargeSummaryId || null,
          finalDiagnosis: dto.finalDiagnosis || null,
          dischargeMedications: dto.dischargeMedications || null,
          followUpInstructions: dto.followUpInstructions || null,
          followUpAppointments: dto.followUpAppointments || null,
          dietInstructions: dto.dietInstructions || null,
          activityRestrictions: dto.activityRestrictions || null,
          lengthOfStayDays,
          planningDurationHours,
          updatedBy: userId,
        },
      });

      // Update admission
      await tx.inpatientAdmission.update({
        where: { id: discharge.admissionId },
        data: {
          admissionStatus: InpatientAdmissionStatus.DISCHARGED,
          dischargeStatus: InpatientDischargeStatus.CONFIRMED,
          actualDischargeDate: now,
          dischargeType: dto.dischargeType,
          dischargeDestination: dto.dischargeDestination,
          dischargedBy: userId,
          lengthOfStayDays,
          updatedBy: userId,
        },
      });

      // Close care channel
      const channel = await tx.careChannel.findUnique({
        where: { admissionId: discharge.admissionId, tenantId },
      });

      if (channel) {
        await tx.careChannel.update({
          where: { id: channel.id },
          data: {
            status: ChannelStatus.CLOSED,
            closedAt: now,
            closedBy: userId,
            closureReason: 'discharged',
          },
        });

        // Emit discharge confirmed message
        await this.channelEventEmitter.emitDischargeConfirmed(
          discharge.admissionId,
          channel.id,
          {
            dischargeType: dto.dischargeType,
            dischargeDestination: dto.dischargeDestination,
            lengthOfStayDays,
          },
          tx,
          context
        );
      }

      // Create event
      await this.eventService.createEvent({
        admissionId: discharge.admissionId,
        encounterId: discharge.encounterId,
        patientId: discharge.patientId,
        eventType: InpatientEventType.DISCHARGE_STATUS_CHANGED,
        facilityId: discharge.facilityId,
        fromDischargeStatus: InpatientDischargeStatus.READY,
        toDischargeStatus: InpatientDischargeStatus.CONFIRMED,
        reason: `Patient discharged - ${dto.dischargeType}`,
        performedBy: userId,
      }, tenantId);

      this.logger.log(`Discharge ${dischargeId} executed successfully`);

      return updated;
    });
  }

  /**
   * Cancel discharge planning
   */
  async cancelDischarge(
    dischargeId: string,
    reason: string,
    context: any
  ) {
    const { tenantId, userId } = context;

    const discharge = await this.prisma.inpatientDischarge.findUnique({
      where: { id: dischargeId, tenantId },
    });

    if (!discharge) {
      throw new NotFoundException(`Discharge ${dischargeId} not found`);
    }

    if (discharge.status === DischargeTransactionStatus.EXECUTED) {
      throw new BadRequestException('Cannot cancel executed discharge');
    }

    // Update discharge
    const updated = await this.prisma.inpatientDischarge.update({
      where: { id: dischargeId },
      data: {
        status: DischargeTransactionStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelledBy: userId,
        cancellationReason: reason,
        updatedBy: userId,
      },
    });

    // Update admission
    await this.prisma.inpatientAdmission.update({
      where: { id: discharge.admissionId },
      data: {
        dischargeStatus: InpatientDischargeStatus.NONE,
        updatedBy: userId,
      },
    });

    // Emit discharge cancelled message to care channel
    const channel = await this.prisma.careChannel.findUnique({
      where: { admissionId: discharge.admissionId, tenantId },
    });

    if (channel) {
      await this.channelEventEmitter.emitDischargeCancelled(
        dischargeId,
        channel.id,
        {
          cancelledBy: userId,
          cancellationReason: reason,
        },
        null,
        context,
      );
      this.logger.log(`Discharge cancelled message posted to channel ${channel.id}`);
    }

    this.logger.log(`Discharge ${dischargeId} cancelled: ${reason}`);

    return updated;
  }
}
