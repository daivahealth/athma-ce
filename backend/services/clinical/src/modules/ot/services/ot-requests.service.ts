import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService, Prisma } from '@zeal/database-clinical';
import {
  CreateOtRequestDto,
  ListOtRequestsDto,
  UpdateOtRequestDto,
} from '../dto/ot-request.dto';
import {
  OtRequestStatus,
  REQUEST_MUTABLE_STATUSES,
  REQUEST_TRANSITIONS,
  OtScheduleStatus,
} from '../ot.constants';

@Injectable()
export class OtRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, userId: string, dto: CreateOtRequestDto) {
    await this.assertPatientEncounterContext(tenantId, dto.patientId, dto.encounterId);

    return this.prisma.$transaction(async (tx) => {
      const request = await tx.otRequest.create({
        data: {
          tenantId,
          patientId: dto.patientId,
          encounterId: dto.encounterId,
          requestedBy: userId,
          surgeryType: dto.surgeryType ?? null,
          procedureCode: dto.procedureCode ?? null,
          procedureName: dto.procedureName,
          diagnosis: dto.diagnosis ?? null,
          priority: dto.priority ?? 'ELECTIVE',
          expectedDurationMinutes: dto.expectedDurationMinutes ?? null,
          preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : null,
          preferredOtRoomSpaceId: dto.preferredOtRoomSpaceId ?? null,
          primarySurgeonId: dto.primarySurgeonId ?? null,
          anaesthetistRequired: dto.anaesthetistRequired ?? false,
          anaesthesiaTypePlanned: dto.anaesthesiaTypePlanned ?? null,
          ...(dto.specialEquipmentRequired !== undefined
            ? { specialEquipmentRequired: dto.specialEquipmentRequired as Prisma.InputJsonValue }
            : {}),
          bloodRequired: dto.bloodRequired ?? false,
          ...(dto.implantsRequired !== undefined
            ? { implantsRequired: dto.implantsRequired as Prisma.InputJsonValue }
            : {}),
          remarks: dto.remarks ?? null,
          createdBy: userId,
          updatedBy: userId,
        },
      });

      await this.recordStatusEvent(tx, tenantId, request.id, null, OtRequestStatus.DRAFT, userId);
      return request;
    });
  }

  async list(tenantId: string, query: ListOtRequestsDto) {
    return this.prisma.otRequest.findMany({
      where: {
        tenantId,
        ...(query.status ? { status: query.status as any } : {}),
        ...(query.patientId ? { patientId: query.patientId } : {}),
        ...(query.encounterId ? { encounterId: query.encounterId } : {}),
        ...(query.primarySurgeonId ? { primarySurgeonId: query.primarySurgeonId } : {}),
      },
      include: {
        schedules: {
          where: { isCurrent: true },
          take: 1,
          orderBy: { scheduledStartTime: 'desc' },
        },
      },
      orderBy: [{ requestedAt: 'desc' }],
    });
  }

  async findById(tenantId: string, id: string) {
    const request = await this.prisma.otRequest.findFirst({
      where: { id, tenantId },
      include: {
        schedules: {
          include: {
            teamMembers: true,
          },
          orderBy: { scheduledStartTime: 'desc' },
        },
        reports: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(`OT request ${id} not found`);
    }

    return request;
  }

  async update(tenantId: string, id: string, userId: string, dto: UpdateOtRequestDto) {
    const request = await this.findById(tenantId, id);
    if (!REQUEST_MUTABLE_STATUSES.includes(request.status as OtRequestStatus)) {
      throw new BadRequestException(`Cannot update OT request in status ${request.status}`);
    }

    const data: Prisma.OtRequestUpdateInput = {
      updatedBy: userId,
      ...(dto.surgeryType !== undefined ? { surgeryType: dto.surgeryType } : {}),
      ...(dto.procedureCode !== undefined ? { procedureCode: dto.procedureCode } : {}),
      ...(dto.procedureName !== undefined ? { procedureName: dto.procedureName } : {}),
      ...(dto.diagnosis !== undefined ? { diagnosis: dto.diagnosis } : {}),
      ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
      ...(dto.expectedDurationMinutes !== undefined
        ? { expectedDurationMinutes: dto.expectedDurationMinutes }
        : {}),
      ...(dto.preferredDate !== undefined ? { preferredDate: new Date(dto.preferredDate) } : {}),
      ...(dto.preferredOtRoomSpaceId !== undefined
        ? { preferredOtRoomSpaceId: dto.preferredOtRoomSpaceId }
        : {}),
      ...(dto.primarySurgeonId !== undefined ? { primarySurgeonId: dto.primarySurgeonId } : {}),
      ...(dto.anaesthetistRequired !== undefined
        ? { anaesthetistRequired: dto.anaesthetistRequired }
        : {}),
      ...(dto.anaesthesiaTypePlanned !== undefined
        ? { anaesthesiaTypePlanned: dto.anaesthesiaTypePlanned }
        : {}),
      ...(dto.specialEquipmentRequired !== undefined
        ? { specialEquipmentRequired: dto.specialEquipmentRequired as Prisma.InputJsonValue }
        : {}),
      ...(dto.bloodRequired !== undefined ? { bloodRequired: dto.bloodRequired } : {}),
      ...(dto.implantsRequired !== undefined
        ? { implantsRequired: dto.implantsRequired as Prisma.InputJsonValue }
        : {}),
      ...(dto.remarks !== undefined ? { remarks: dto.remarks } : {}),
    };

    return this.prisma.otRequest.update({
      where: { id },
      data,
    });
  }

  async submit(tenantId: string, id: string, userId: string, reason?: string, remarks?: string) {
    return this.transition(tenantId, id, userId, OtRequestStatus.REQUESTED, reason, remarks);
  }

  async markUnderReview(tenantId: string, id: string, userId: string, reason?: string, remarks?: string) {
    return this.transition(tenantId, id, userId, OtRequestStatus.UNDER_REVIEW, reason, remarks);
  }

  async approve(tenantId: string, id: string, userId: string, reason?: string, remarks?: string) {
    return this.transition(tenantId, id, userId, OtRequestStatus.APPROVED, reason, remarks);
  }

  async reject(tenantId: string, id: string, userId: string, reason?: string, remarks?: string) {
    if (!reason) {
      throw new BadRequestException('Rejection reason is required');
    }
    return this.transition(tenantId, id, userId, OtRequestStatus.REJECTED, reason, remarks);
  }

  async cancel(tenantId: string, id: string, userId: string, reason?: string, remarks?: string) {
    const request = await this.findById(tenantId, id);
    const activeSchedule = request.schedules.find(
      (schedule) => schedule.isCurrent && ![OtScheduleStatus.CANCELLED, OtScheduleStatus.POSTPONED].includes(schedule.status as OtScheduleStatus),
    );
    if (activeSchedule) {
      throw new BadRequestException('Cancel the active OT schedule before cancelling the OT request');
    }
    return this.transition(tenantId, id, userId, OtRequestStatus.CANCELLED, reason, remarks);
  }

  async complete(tenantId: string, id: string, userId: string, reason?: string, remarks?: string) {
    const request = await this.findById(tenantId, id);
    const activeSchedule = request.schedules.find((schedule) => schedule.id === request.activeScheduleId);

    if (!activeSchedule) {
      throw new BadRequestException('OT request has no active schedule to complete');
    }

    if (
      ![OtScheduleStatus.SURGERY_COMPLETED, OtScheduleStatus.PATIENT_SHIFTED_TO_RECOVERY].includes(
        activeSchedule.status as OtScheduleStatus,
      )
    ) {
      throw new BadRequestException('OT request can only be completed after surgery is completed or shifted to recovery');
    }

    return this.transition(tenantId, id, userId, OtRequestStatus.COMPLETED, reason, remarks);
  }

  async getHistory(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.otRequestStatusEvent.findMany({
      where: { tenantId, otRequestId: id },
      orderBy: { changedAt: 'asc' },
    });
  }

  private async transition(
    tenantId: string,
    id: string,
    userId: string,
    toStatus: OtRequestStatus,
    reason?: string,
    remarks?: string,
  ) {
    const request = await this.findById(tenantId, id);
    const fromStatus = request.status as OtRequestStatus;
    this.assertTransition(fromStatus, toStatus);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.otRequest.update({
        where: { id },
        data: {
          status: toStatus,
          approvedBy: toStatus === OtRequestStatus.APPROVED ? userId : request.approvedBy,
          approvedAt: toStatus === OtRequestStatus.APPROVED ? new Date() : request.approvedAt,
          rejectedBy: toStatus === OtRequestStatus.REJECTED ? userId : request.rejectedBy,
          rejectedAt: toStatus === OtRequestStatus.REJECTED ? new Date() : request.rejectedAt,
          rejectionReason: toStatus === OtRequestStatus.REJECTED ? reason ?? null : request.rejectionReason,
          cancelledBy: toStatus === OtRequestStatus.CANCELLED ? userId : request.cancelledBy,
          cancelledAt: toStatus === OtRequestStatus.CANCELLED ? new Date() : request.cancelledAt,
          cancellationReason: toStatus === OtRequestStatus.CANCELLED ? reason ?? null : request.cancellationReason,
          completedBy: toStatus === OtRequestStatus.COMPLETED ? userId : request.completedBy,
          completedAt: toStatus === OtRequestStatus.COMPLETED ? new Date() : request.completedAt,
          updatedBy: userId,
        },
      });

      await this.recordStatusEvent(tx, tenantId, id, fromStatus, toStatus, userId, reason, remarks);
      return updated;
    });
  }

  private assertTransition(fromStatus: OtRequestStatus, toStatus: OtRequestStatus) {
    if (!REQUEST_TRANSITIONS[fromStatus]?.includes(toStatus)) {
      throw new BadRequestException(`Invalid OT request transition from ${fromStatus} to ${toStatus}`);
    }
  }

  private async assertPatientEncounterContext(tenantId: string, patientId: string, encounterId: string) {
    const patient = await this.prisma.patient.findFirst({ where: { id: patientId, tenantId } });
    if (!patient) {
      throw new NotFoundException(`Patient ${patientId} not found`);
    }

    const encounter = await this.prisma.encounter.findFirst({
      where: { id: encounterId, tenantId, patientId },
    });
    if (!encounter) {
      throw new NotFoundException(`Encounter ${encounterId} not found for patient ${patientId}`);
    }
  }

  private async recordStatusEvent(
    tx: Prisma.TransactionClient,
    tenantId: string,
    otRequestId: string,
    fromStatus: OtRequestStatus | null,
    toStatus: OtRequestStatus,
    changedBy: string,
    reason?: string,
    remarks?: string,
  ) {
    await tx.otRequestStatusEvent.create({
      data: {
        tenantId,
        otRequestId,
        fromStatus,
        toStatus,
        changedBy,
        reason: reason ?? null,
        remarks: remarks ?? null,
      },
    });
  }
}
