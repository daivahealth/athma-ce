/**
 * Transfer Service
 *
 * Business logic for patient transfers between beds/wards
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { TransferPatientDto } from './dto/transfer-patient.dto';

@Injectable()
export class TransferService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Transfer patient to new bed/ward
   */
  async transferPatient(
    admissionId: string,
    dto: TransferPatientDto,
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

    if (admission.status !== 'admitted') {
      throw new BadRequestException(
        `Cannot transfer patient with status: ${admission.status}`
      );
    }

    // TODO: Call Foundation API to verify bed is available
    // For now, we assume the bed is available

    // Check if transferring to same bed
    if (admission.currentBedId === dto.toBedId) {
      throw new BadRequestException('Patient is already in this bed');
    }

    const transferTime = new Date();

    // Release current bed assignment
    await this.prisma.bedAssignment.updateMany({
      where: {
        tenantId,
        admissionId,
        releasedAt: null,
      },
      data: {
        releasedAt: transferTime,
        releasedBy: userId,
      },
    });

    // TODO: Get spaceId from Foundation API based on bedId
    const spaceId = dto.toBedId; // Placeholder

    // Create new bed assignment
    const newAssignment = await this.prisma.bedAssignment.create({
      data: {
        tenantId,
        admissionId,
        patientId: admission.patientId,
        bedId: dto.toBedId,
        wardId: dto.toWardId,
        spaceId,
        assignedAt: transferTime,
        isTransfer: true,
        transferReason: dto.transferReason || null,
        transferType: dto.transferType || null,
        assignedBy: userId,
      },
    });

    // Update admission's current location
    const updatedAdmission = await this.prisma.inpatientAdmission.update({
      where: { id: admissionId },
      data: {
        currentWardId: dto.toWardId,
        currentBedId: dto.toBedId,
        currentSpaceId: spaceId,
        updatedBy: userId,
      },
    });

    // Create transfer event
    const event = await this.prisma.inpatientEvent.create({
      data: {
        tenantId,
        admissionId,
        patientId: admission.patientId,
        eventType: 'patient_transferred',
        eventCategory: 'transfer',
        eventData: {
          fromWardId: admission.currentWardId,
          fromBedId: admission.currentBedId,
          toWardId: dto.toWardId,
          toBedId: dto.toBedId,
          transferReason: dto.transferReason,
          transferType: dto.transferType,
        },
        performedBy: userId,
        performedAt: transferTime,
        notes: dto.notes || null,
      },
    });

    return {
      admission: {
        id: updatedAdmission.id,
        currentWardId: updatedAdmission.currentWardId,
        currentBedId: updatedAdmission.currentBedId,
        status: updatedAdmission.status,
      },
      bedAssignment: {
        id: newAssignment.id,
        bedId: newAssignment.bedId,
        wardId: newAssignment.wardId,
        assignedAt: newAssignment.assignedAt,
        isTransfer: newAssignment.isTransfer,
        transferType: newAssignment.transferType,
      },
      event: {
        eventId: event.id,
        eventType: event.eventType,
        performedAt: event.performedAt,
      },
    };
  }
}
