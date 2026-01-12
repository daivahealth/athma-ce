/**
 * Transfer Service
 *
 * Business logic for patient transfers between beds/wards
 * Uses atomic transactions to ensure data consistency
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { TransferPatientDto } from './dto/transfer-patient.dto';
import { InpatientAdmissionStatus, InpatientEventType } from './dto/create-event.dto';

@Injectable()
export class TransferService {
  private readonly logger = new Logger(TransferService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Transfer patient to new bed/ward with complete transaction
   */
  async transferPatient(
    admissionId: string,
    dto: TransferPatientDto,
    context: any
  ) {
    const { tenantId, userId } = context;

    this.logger.log(`Starting transfer for admission ${admissionId}`);

    // Verify admission exists and is active
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${admissionId} not found`);
    }

    // Check admission status - only active patients can be transferred
    const transferableStatuses: InpatientAdmissionStatus[] = [
      InpatientAdmissionStatus.ADMITTED,
      InpatientAdmissionStatus.ACTIVE,
      InpatientAdmissionStatus.ON_LEAVE,
    ];

    if (!transferableStatuses.includes(admission.admissionStatus)) {
      throw new BadRequestException(
        `Cannot transfer patient with status: ${admission.admissionStatus}. Patient must be ADMITTED, ACTIVE, or ON_LEAVE.`
      );
    }

    // Validate current bed exists
    if (!admission.currentBedId) {
      throw new BadRequestException('Patient does not have a current bed assignment');
    }

    // Check if transferring to same bed
    if (admission.currentBedId === dto.toBedId) {
      throw new BadRequestException('Patient is already in this bed');
    }

    // TODO: Call Foundation API to verify new bed is available and get space details
    // For now, use bedId as placeholder for spaceId until Foundation integration
    const toSpaceId = dto.toBedId; // Placeholder until Foundation integration

    const transferTime = new Date();

    // Execute transfer in a transaction for atomicity
    const result = await this.prisma.$transaction(async (tx) => {
      // Step 1: Release current bed assignment
      const releasedAssignments = await tx.bedAssignment.updateMany({
        where: {
          tenantId,
          admissionId,
          releasedAt: null, // Only active assignments
        },
        data: {
          releasedAt: transferTime,
          releasedBy: userId,
        },
      });

      if (releasedAssignments.count === 0) {
        throw new BadRequestException('No active bed assignment found to release');
      }

      this.logger.log(`Released ${releasedAssignments.count} bed assignment(s)`);

      // Step 2: Create new bed assignment
      const newAssignment = await tx.bedAssignment.create({
        data: {
          tenantId,
          admissionId,
          patientId: admission.patientId,
          bedId: dto.toBedId,
          wardId: dto.toWardId,
          spaceId: toSpaceId,
          assignedAt: transferTime,
          assignedBy: userId,
          isTransfer: true,
          transferReason: dto.transferReason || null,
          transferType: dto.transferType || null,
          notes: dto.notes || null,
        },
      });

      this.logger.log(`Created new bed assignment ${newAssignment.id}`);

      // Step 3: Update admission's current location
      const updatedAdmission = await tx.inpatientAdmission.update({
        where: { id: admissionId },
        data: {
          currentWardId: dto.toWardId,
          currentSpaceId: toSpaceId,
          currentBedId: dto.toBedId,
          updatedBy: userId,
        },
      });

      this.logger.log(`Updated admission location`);

      // Step 4: Log transfer event
      const event = await tx.inpatientEvent.create({
        data: {
          tenantId,
          facilityId: admission.facilityId,
          admissionId,
          encounterId: admission.encounterId,
          patientId: admission.patientId,
          eventType: InpatientEventType.TRANSFERRED,

          // Location change tracking (use conditional spread for nullable fields)
          ...(admission.currentWardId && { fromWardId: admission.currentWardId }),
          ...(admission.currentSpaceId && { fromSpaceId: admission.currentSpaceId }),
          ...(admission.currentBedId && { fromBedId: admission.currentBedId }),
          toWardId: dto.toWardId,
          toSpaceId: toSpaceId,
          toBedId: dto.toBedId,

          // Include reason only if present
          ...(dto.transferReason || dto.notes) && { reason: dto.transferReason || dto.notes },
          ...(dto.transferType || dto.notes) && {
            metadata: {
              transferType: dto.transferType,
              notes: dto.notes,
            },
          },
          performedBy: userId,
          performedAt: transferTime,
        },
      });

      this.logger.log(`Logged transfer event ${event.id}`);

      return {
        admission: updatedAdmission,
        bedAssignment: newAssignment,
        event,
      };
    });

    // TODO: Step 5: Update Foundation bed occupancy status
    // await this.foundationService.updateBedOccupancy(admission.currentBedId, 'empty')
    // await this.foundationService.updateBedOccupancy(dto.toBedId, 'occupied')

    this.logger.log(`Transfer completed successfully for admission ${admissionId}`);

    return {
      admission: {
        id: result.admission.id,
        currentWardId: result.admission.currentWardId,
        currentSpaceId: result.admission.currentSpaceId,
        currentBedId: result.admission.currentBedId,
        admissionStatus: result.admission.admissionStatus,
        dischargeStatus: result.admission.dischargeStatus,
      },
      bedAssignment: {
        id: result.bedAssignment.id,
        bedId: result.bedAssignment.bedId,
        wardId: result.bedAssignment.wardId,
        spaceId: result.bedAssignment.spaceId,
        assignedAt: result.bedAssignment.assignedAt,
        isTransfer: result.bedAssignment.isTransfer,
        transferReason: result.bedAssignment.transferReason,
        transferType: result.bedAssignment.transferType,
      },
      event: {
        id: result.event.id,
        eventType: result.event.eventType,
        performedAt: result.event.performedAt,
      },
    };
  }

  /**
   * Get transfer history for an admission
   */
  async getTransferHistory(admissionId: string, tenantId: string) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    const transfers = await this.prisma.bedAssignment.findMany({
      where: {
        tenantId,
        admissionId,
        isTransfer: true,
      },
      orderBy: {
        assignedAt: 'asc',
      },
    });

    return transfers;
  }

  /**
   * Get current bed assignment for an admission
   */
  async getCurrentBedAssignment(admissionId: string, tenantId: string) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    const currentAssignment = await this.prisma.bedAssignment.findFirst({
      where: {
        tenantId,
        admissionId,
        releasedAt: null, // Active assignment
      },
    });

    return currentAssignment;
  }
}
