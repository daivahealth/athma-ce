import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaService } from '@zeal/database-clinical';
import { STANDARD_PATIENT_SELECT } from '../../common/constants/patient-select.constant';
import {
  CheckOtScheduleConflictsDto,
  CreateOtScheduleDto,
  ListOtSchedulesDto,
  OtTeamMemberDto,
  UpdateOtScheduleDto,
} from '../dto/ot-schedule.dto';
import {
  ACTIVE_SCHEDULE_STATUSES,
  OtRequestStatus,
  OtScheduleStatus,
  OtTeamRole,
  SCHEDULE_TRANSITIONS,
} from '../ot.constants';
import { buildOtPatientDisplay } from '../ot-patient-display.util';
import { OtRoomsService } from './ot-rooms.service';

type ConflictItem = {
  type: 'room' | 'staff' | 'availability' | 'block';
  resourceId: string;
  message: string;
  conflictingScheduleId?: string;
};

@Injectable()
export class OtSchedulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otRoomsService: OtRoomsService,
  ) {}

  async create(tenantId: string, userId: string, dto: CreateOtScheduleDto) {
    const request = await this.prisma.otRequest.findFirst({
      where: { id: dto.otRequestId, tenantId },
    });

    if (!request) {
      throw new NotFoundException(`OT request ${dto.otRequestId} not found`);
    }

    if (![OtRequestStatus.APPROVED, OtRequestStatus.SCHEDULED].includes(request.status as OtRequestStatus)) {
      throw new BadRequestException(`Cannot schedule OT request in status ${request.status}`);
    }

    const scheduledStartTime = new Date(dto.scheduledStartTime);
    const scheduledEndTime = new Date(dto.scheduledEndTime);
    this.assertTimeRange(scheduledStartTime, scheduledEndTime);
    await this.otRoomsService.ensureActiveRoom(tenantId, dto.otRoomSpaceId);

    const conflicts = await this.collectConflicts(tenantId, {
      otRoomSpaceId: dto.otRoomSpaceId,
      scheduledStartTime,
      scheduledEndTime,
      staffIds: this.collectStaffIdsFromPayload(dto),
    });

    if (conflicts.length > 0) {
      throw new BadRequestException({
        message: 'OT schedule conflicts detected',
        conflicts,
      });
    }

    this.validateTeamMembers(dto.teamMembers);

    const scheduleId = await this.prisma.$transaction(async (tx) => {
      const currentSchedule = await tx.otSchedule.findFirst({
        where: {
          tenantId,
          otRequestId: dto.otRequestId,
          isCurrent: true,
        },
      });

      if (currentSchedule) {
        await tx.otSchedule.update({
          where: { id: currentSchedule.id },
          data: {
            isCurrent: false,
            status:
              currentSchedule.status === OtScheduleStatus.CANCELLED
                ? currentSchedule.status
                : OtScheduleStatus.POSTPONED,
            postponedReason: 'Superseded by a newer OT schedule',
            updatedBy: userId,
          },
        });

        await this.recordStatusEvent(
          tx,
          tenantId,
          currentSchedule.id,
          currentSchedule.status as OtScheduleStatus,
          OtScheduleStatus.POSTPONED,
          userId,
          'Superseded by a newer OT schedule',
        );
      }

      const derived = this.deriveHeaderFields(dto);
      const schedule = await tx.otSchedule.create({
        data: {
          tenantId,
          otRequestId: dto.otRequestId,
          patientId: request.patientId,
          encounterId: request.encounterId,
          otRoomSpaceId: dto.otRoomSpaceId,
          scheduledStartTime,
          scheduledEndTime,
          primarySurgeonId: derived.primarySurgeonId,
          assistantSurgeonIds: derived.assistantSurgeonIds,
          anaesthetistId: derived.anaesthetistId,
          scrubNurseId: derived.scrubNurseId,
          circulatingNurseId: derived.circulatingNurseId,
          technicianId: derived.technicianId,
          anaesthesiaType: dto.anaesthesiaType ?? null,
          createdBy: userId,
          updatedBy: userId,
        },
      });

      await this.syncTeamMembers(tx, tenantId, schedule.id, userId, dto.teamMembers ?? []);

      await tx.otRequest.update({
        where: { id: dto.otRequestId },
        data: {
          status: OtRequestStatus.SCHEDULED,
          activeScheduleId: schedule.id,
          updatedBy: userId,
        },
      });

      await tx.otRequestStatusEvent.create({
        data: {
          tenantId,
          otRequestId: dto.otRequestId,
          fromStatus: request.status as any,
          toStatus: OtRequestStatus.SCHEDULED,
          changedBy: userId,
          reason: currentSchedule ? 'Rescheduled OT request' : 'Initial OT schedule created',
        },
      });

      await this.recordStatusEvent(tx, tenantId, schedule.id, null, OtScheduleStatus.PLANNED, userId);

      return schedule.id;
    });
    return this.findById(tenantId, scheduleId);
  }

  async list(tenantId: string, query: ListOtSchedulesDto) {
    const patientIds = await this.resolvePatientIdsBySearch(tenantId, query.search);
    const schedules = await this.prisma.otSchedule.findMany({
      where: {
        tenantId,
        ...(query.search ? { patientId: { in: patientIds } } : {}),
        ...(query.status ? { status: query.status as any } : {}),
        ...(query.patientId ? { patientId: query.patientId } : {}),
        ...(query.encounterId ? { encounterId: query.encounterId } : {}),
        ...(query.otRoomSpaceId ? { otRoomSpaceId: query.otRoomSpaceId } : {}),
        ...(query.primarySurgeonId ? { primarySurgeonId: query.primarySurgeonId } : {}),
      },
      include: {
        teamMembers: true,
      },
      orderBy: [{ scheduledStartTime: 'asc' }],
    });
    const patientDisplayMap = await this.fetchPatientDisplayMap(
      tenantId,
      schedules.map((schedule) => schedule.patientId)
    );
    const roomMap = await this.otRoomsService.getBySpaceIds(
      tenantId,
      schedules.map((schedule) => schedule.otRoomSpaceId)
    );
    return schedules.map((schedule) => this.serializeSchedule(schedule, patientDisplayMap, roomMap));
  }

  async findById(tenantId: string, id: string) {
    const schedule = await this.prisma.otSchedule.findFirst({
      where: { id, tenantId },
      include: {
        teamMembers: true,
        reports: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException(`OT schedule ${id} not found`);
    }

    const patientDisplayMap = await this.fetchPatientDisplayMap(tenantId, [
      schedule.patientId,
      ...schedule.reports.map((report) => report.patientId),
    ]);
    const roomMap = await this.otRoomsService.getBySpaceIds(tenantId, [schedule.otRoomSpaceId]);
    return this.serializeSchedule(schedule, patientDisplayMap, roomMap);
  }

  async update(tenantId: string, id: string, userId: string, dto: UpdateOtScheduleDto) {
    const schedule = await this.findById(tenantId, id);
    if ([OtScheduleStatus.CANCELLED, OtScheduleStatus.POSTPONED, OtScheduleStatus.PATIENT_SHIFTED_TO_RECOVERY].includes(schedule.status as OtScheduleStatus)) {
      throw new BadRequestException(`Cannot update OT schedule in status ${schedule.status}`);
    }

    const nextStart = dto.scheduledStartTime ? new Date(dto.scheduledStartTime) : schedule.scheduledStartTime;
    const nextEnd = dto.scheduledEndTime ? new Date(dto.scheduledEndTime) : schedule.scheduledEndTime;
    this.assertTimeRange(nextStart, nextEnd);

    const roomId = dto.otRoomSpaceId ?? schedule.otRoomSpaceId;
    await this.otRoomsService.ensureActiveRoom(tenantId, roomId);

    const conflictPayload: {
      otRoomSpaceId: string;
      scheduledStartTime: Date;
      scheduledEndTime: Date;
      staffIds: string[];
      scheduleId?: string;
    } = {
      otRoomSpaceId: roomId,
      scheduledStartTime: nextStart,
      scheduledEndTime: nextEnd,
      staffIds: this.collectStaffIdsFromPayload({
        ...schedule,
        ...dto,
      }),
    };
    conflictPayload.scheduleId = id;
    const conflicts = await this.collectConflicts(tenantId, conflictPayload);
    if (conflicts.length > 0) {
      throw new BadRequestException({
        message: 'OT schedule conflicts detected',
        conflicts,
      });
    }

    this.validateTeamMembers(dto.teamMembers);
    const derived = this.deriveHeaderFields({
      primarySurgeonId: dto.primarySurgeonId ?? schedule.primarySurgeonId,
      assistantSurgeonIds: dto.assistantSurgeonIds ?? schedule.assistantSurgeonIds,
      anaesthetistId: dto.anaesthetistId ?? schedule.anaesthetistId,
      scrubNurseId: dto.scrubNurseId ?? schedule.scrubNurseId,
      circulatingNurseId: dto.circulatingNurseId ?? schedule.circulatingNurseId,
      technicianId: dto.technicianId ?? schedule.technicianId,
      teamMembers: dto.teamMembers ?? schedule.teamMembers,
    });

    return this.prisma.$transaction(async (tx) => {
      const data: Prisma.OtScheduleUpdateInput = {
        otRoomSpaceId: roomId,
        scheduledStartTime: nextStart,
        scheduledEndTime: nextEnd,
        primarySurgeonId: derived.primarySurgeonId,
        assistantSurgeonIds: derived.assistantSurgeonIds,
        anaesthetistId: derived.anaesthetistId,
        scrubNurseId: derived.scrubNurseId,
        circulatingNurseId: derived.circulatingNurseId,
        technicianId: derived.technicianId,
        updatedBy: userId,
        ...(dto.actualStartTime !== undefined ? { actualStartTime: new Date(dto.actualStartTime) } : {}),
        ...(dto.actualEndTime !== undefined ? { actualEndTime: new Date(dto.actualEndTime) } : {}),
        ...(dto.anaesthesiaType !== undefined ? { anaesthesiaType: dto.anaesthesiaType } : {}),
      };

      const updated = await tx.otSchedule.update({
        where: { id },
        data,
      });

      if (dto.teamMembers) {
        await this.syncTeamMembers(tx, tenantId, id, userId, dto.teamMembers);
      }

      return updated.id;
    });
    return this.findById(tenantId, id);
  }

  async transition(
    tenantId: string,
    id: string,
    userId: string,
    toStatus: OtScheduleStatus,
    options?: { reason?: string; remarks?: string; actualStartTime?: string; actualEndTime?: string },
  ) {
    const schedule = await this.findById(tenantId, id);
    const fromStatus = schedule.status as OtScheduleStatus;
    this.assertTransition(fromStatus, toStatus);

    return this.prisma.$transaction(async (tx) => {
      const data: Prisma.OtScheduleUpdateInput = {
        status: toStatus,
        updatedBy: userId,
        ...(options?.actualStartTime !== undefined
          ? { actualStartTime: new Date(options.actualStartTime) }
          : toStatus === OtScheduleStatus.ANAESTHESIA_STARTED && !schedule.actualStartTime
            ? { actualStartTime: new Date() }
            : {}),
        ...(options?.actualEndTime !== undefined
          ? { actualEndTime: new Date(options.actualEndTime) }
          : toStatus === OtScheduleStatus.PATIENT_SHIFTED_TO_RECOVERY && !schedule.actualEndTime
            ? { actualEndTime: new Date() }
            : {}),
        ...(toStatus === OtScheduleStatus.CANCELLED
          ? { cancelledReason: options?.reason ?? null, isCurrent: false }
          : {}),
        ...(toStatus === OtScheduleStatus.POSTPONED
          ? { postponedReason: options?.reason ?? null, isCurrent: false }
          : {}),
      };

      await tx.otSchedule.update({
        where: { id },
        data,
      });

      await this.recordStatusEvent(tx, tenantId, id, fromStatus, toStatus, userId, options?.reason, options?.remarks);

      if ([OtScheduleStatus.CANCELLED, OtScheduleStatus.POSTPONED].includes(toStatus) && schedule.isCurrent) {
        await tx.otRequest.update({
          where: { id: schedule.otRequestId },
          data: {
            status: OtRequestStatus.APPROVED,
            activeScheduleId: null,
            updatedBy: userId,
          },
        });

        await tx.otRequestStatusEvent.create({
          data: {
            tenantId,
            otRequestId: schedule.otRequestId,
            fromStatus: OtRequestStatus.SCHEDULED,
            toStatus: OtRequestStatus.APPROVED,
            changedBy: userId,
            reason: options?.reason ?? `${toStatus} current OT schedule`,
          },
        });
      }

      if (toStatus === OtScheduleStatus.PATIENT_SHIFTED_TO_RECOVERY && schedule.isCurrent) {
        await tx.otRequest.update({
          where: { id: schedule.otRequestId },
          data: {
            status: OtRequestStatus.COMPLETED,
            completedAt: new Date(),
            completedBy: userId,
            updatedBy: userId,
          },
        });

        await tx.otRequestStatusEvent.create({
          data: {
            tenantId,
            otRequestId: schedule.otRequestId,
            fromStatus: OtRequestStatus.SCHEDULED,
            toStatus: OtRequestStatus.COMPLETED,
            changedBy: userId,
            reason: 'Patient shifted to recovery',
          },
        });
      }

      return id;
    });
    return this.findById(tenantId, id);
  }

  private async fetchPatientDisplayMap(tenantId: string, patientIds: string[]) {
    const uniquePatientIds = [...new Set(patientIds.filter(Boolean))];
    if (uniquePatientIds.length === 0) {
      return new Map<string, ReturnType<typeof buildOtPatientDisplay>>();
    }

    const patients = await this.prisma.patient.findMany({
      where: {
        tenantId,
        id: { in: uniquePatientIds },
      },
      select: STANDARD_PATIENT_SELECT,
    });

    return new Map(
      patients.map((patient) => [patient.id, buildOtPatientDisplay(patient)])
    );
  }

  private async resolvePatientIdsBySearch(tenantId: string, search?: string) {
    const term = search?.trim();
    if (!term) {
      return [];
    }

    const patients = await this.prisma.patient.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: term, mode: 'insensitive' } },
          { lastName: { contains: term, mode: 'insensitive' } },
          { displayName: { contains: term, mode: 'insensitive' } },
          { mrn: { contains: term, mode: 'insensitive' } },
          { phoneNumber: { contains: term } },
        ],
      },
      select: { id: true },
    });

    return patients.map((patient) => patient.id);
  }

  private serializeSchedule(
    schedule: any,
    patientDisplayMap: Map<string, ReturnType<typeof buildOtPatientDisplay>>,
    roomMap: Map<string, any>
  ) {
    const room = roomMap.get(schedule.otRoomSpaceId) ?? null;
    const roomDisplayName =
      room?.space?.name ||
      room?.specialty ||
      room?.notes ||
      'Configured OT Room';
    const roomDisplayDescription =
      room?.space?.spaceNumber ||
      room?.space?.spaceType ||
      room?.notes ||
      room?.specialty ||
      null;

    return {
      ...schedule,
      patientDisplay: patientDisplayMap.get(schedule.patientId) ?? null,
      room,
      roomDisplayName,
      roomDisplayDescription,
      ...(schedule.reports
        ? {
            reports: schedule.reports.map((report: any) => {
              return {
                ...report,
                patientDisplay: patientDisplayMap.get(report.patientId) ?? null,
              };
            }),
          }
        : {}),
    };
  }

  async getHistory(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.otScheduleStatusEvent.findMany({
      where: { tenantId, otScheduleId: id },
      orderBy: { changedAt: 'asc' },
    });
  }

  async checkConflicts(tenantId: string, dto: CheckOtScheduleConflictsDto) {
    const conflicts = await this.collectConflicts(tenantId, {
      otRoomSpaceId: dto.otRoomSpaceId,
      scheduledStartTime: new Date(dto.scheduledStartTime),
      scheduledEndTime: new Date(dto.scheduledEndTime),
      staffIds: dto.staffIds ?? [],
      ...(dto.scheduleId ? { scheduleId: dto.scheduleId } : {}),
    });

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
    };
  }

  private async collectConflicts(
    tenantId: string,
    input: {
      otRoomSpaceId: string;
      scheduledStartTime: Date;
      scheduledEndTime: Date;
      staffIds: string[];
      scheduleId?: string;
    },
  ): Promise<ConflictItem[]> {
    const conflicts: ConflictItem[] = [];
    this.assertTimeRange(input.scheduledStartTime, input.scheduledEndTime);

    const overlapWhere = {
      tenantId,
      status: { in: ACTIVE_SCHEDULE_STATUSES },
      scheduledStartTime: { lt: input.scheduledEndTime },
      scheduledEndTime: { gt: input.scheduledStartTime },
    } as Prisma.OtScheduleWhereInput;

    if (input.scheduleId) {
      overlapWhere.id = { not: input.scheduleId };
    }

    const roomConflict = await this.prisma.otSchedule.findFirst({
      where: {
        ...overlapWhere,
        otRoomSpaceId: input.otRoomSpaceId,
      },
    });

    if (roomConflict) {
      conflicts.push({
        type: 'room',
        resourceId: input.otRoomSpaceId,
        conflictingScheduleId: roomConflict.id,
        message: `OT room is already allocated to schedule ${roomConflict.id}`,
      });
    }

    if (input.staffIds.length > 0) {
      const staffConflict = await this.prisma.otSchedule.findFirst({
        where: {
          ...overlapWhere,
          OR: [
            { primarySurgeonId: { in: input.staffIds } },
            { anaesthetistId: { in: input.staffIds } },
            { scrubNurseId: { in: input.staffIds } },
            { circulatingNurseId: { in: input.staffIds } },
            { technicianId: { in: input.staffIds } },
            { assistantSurgeonIds: { hasSome: input.staffIds } },
          ],
        },
      });

      if (staffConflict) {
        conflicts.push({
          type: 'staff',
          resourceId: staffConflict.id,
          conflictingScheduleId: staffConflict.id,
          message: `One or more OT staff members are already allocated to schedule ${staffConflict.id}`,
        });
      }
    }

    const roomAvailabilityConflicts = await this.checkRecurringAvailability(
      tenantId,
      'space',
      input.otRoomSpaceId,
      input.scheduledStartTime,
      input.scheduledEndTime,
    );
    conflicts.push(...roomAvailabilityConflicts);

    for (const staffId of input.staffIds) {
      const staffAvailabilityConflicts = await this.checkRecurringAvailability(
        tenantId,
        'staff',
        staffId,
        input.scheduledStartTime,
        input.scheduledEndTime,
      );
      conflicts.push(...staffAvailabilityConflicts);
    }

    const roomBlock = await this.prisma.resourceBlock.findFirst({
      where: {
        tenantId,
        resourceType: 'space',
        resourceId: input.otRoomSpaceId,
        approvalStatus: { not: 'rejected' },
        isAvailable: false,
        startDatetime: { lt: input.scheduledEndTime },
        endDatetime: { gt: input.scheduledStartTime },
      },
    });
    if (roomBlock) {
      conflicts.push({
        type: 'block',
        resourceId: input.otRoomSpaceId,
        message: `OT room is blocked: ${roomBlock.blockType}`,
      });
    }

    for (const staffId of input.staffIds) {
      const staffBlock = await this.prisma.resourceBlock.findFirst({
        where: {
          tenantId,
          resourceType: 'staff',
          resourceId: staffId,
          approvalStatus: { not: 'rejected' },
          isAvailable: false,
          startDatetime: { lt: input.scheduledEndTime },
          endDatetime: { gt: input.scheduledStartTime },
        },
      });

      if (staffBlock) {
        conflicts.push({
          type: 'block',
          resourceId: staffId,
          message: `Staff member ${staffId} is blocked: ${staffBlock.blockType}`,
        });
      }
    }

    return conflicts;
  }

  private async checkRecurringAvailability(
    tenantId: string,
    resourceType: 'space' | 'staff',
    resourceId: string,
    start: Date,
    end: Date,
  ): Promise<ConflictItem[]> {
    const isoDate = start.toISOString().split('T')[0] ?? start.toISOString();
    const dateOnly = new Date(isoDate);
    const dayOfWeek = start.getDay();
    const startMinutes = this.minutesOfDay(start);
    const endMinutes = this.minutesOfDay(end);

    if (resourceType === 'space') {
      const schedules = await this.prisma.spaceSchedule.findMany({
        where: {
          tenantId,
          spaceId: resourceId,
          dayOfWeek,
          effectiveFrom: { lte: dateOnly },
          OR: [{ effectiveTo: null }, { effectiveTo: { gte: dateOnly } }],
        },
      });
      return this.evaluateScheduleWindows('space', resourceId, schedules, startMinutes, endMinutes);
    }

    const schedules = await this.prisma.staffSchedule.findMany({
      where: {
        tenantId,
        staffId: resourceId,
        dayOfWeek,
        effectiveFrom: { lte: dateOnly },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: dateOnly } }],
      },
    });
    return this.evaluateScheduleWindows('staff', resourceId, schedules, startMinutes, endMinutes);
  }

  private evaluateScheduleWindows(
    resourceType: 'space' | 'staff',
    resourceId: string,
    schedules: Array<{ startTime: string; endTime: string; isAvailable: boolean }>,
    startMinutes: number,
    endMinutes: number,
  ): ConflictItem[] {
    if (schedules.length === 0) {
      return [];
    }

    const overlaps = schedules.filter((entry) => this.timeWindowOverlaps(entry.startTime, entry.endTime, startMinutes, endMinutes));
    if (overlaps.some((entry) => !entry.isAvailable)) {
      return [
        {
          type: 'availability',
          resourceId,
          message: `${resourceType} has a recurring unavailable slot for the requested time`,
        },
      ];
    }

    if (!overlaps.some((entry) => entry.isAvailable)) {
      return [
        {
          type: 'availability',
          resourceId,
          message: `${resourceType} has no recurring availability configured for the requested time`,
        },
      ];
    }

    return [];
  }

  private timeWindowOverlaps(startTime: string, endTime: string, startMinutes: number, endMinutes: number) {
    const scheduleStart = this.parseMinutes(startTime);
    const scheduleEnd = this.parseMinutes(endTime);
    return scheduleStart < endMinutes && scheduleEnd > startMinutes;
  }

  private minutesOfDay(date: Date) {
    return date.getHours() * 60 + date.getMinutes();
  }

  private parseMinutes(value: string) {
    const [hoursRaw, minutesRaw] = value.split(':');
    const hours = Number(hoursRaw ?? 0);
    const minutes = Number(minutesRaw ?? 0);
    return hours * 60 + minutes;
  }

  private deriveHeaderFields(
    dto: {
      primarySurgeonId?: string | null;
      assistantSurgeonIds?: string[] | null;
      anaesthetistId?: string | null;
      scrubNurseId?: string | null;
      circulatingNurseId?: string | null;
      technicianId?: string | null;
      teamMembers?: Array<{ staffId: string; role: string; isPrimary?: boolean | null }>;
    },
  ) {
    const teamMembers = dto.teamMembers ?? [];
    const primarySurgeon = teamMembers.find((member) => member.role === OtTeamRole.PRIMARY_SURGEON && member.isPrimary);

    return {
      primarySurgeonId:
        dto.primarySurgeonId ??
        primarySurgeon?.staffId ??
        teamMembers.find((member) => member.role === OtTeamRole.PRIMARY_SURGEON)?.staffId ??
        null,
      assistantSurgeonIds:
        dto.assistantSurgeonIds ??
        teamMembers
          .filter((member) => member.role === OtTeamRole.ASSISTANT_SURGEON)
          .map((member) => member.staffId),
      anaesthetistId:
        dto.anaesthetistId ??
        teamMembers.find((member) => member.role === OtTeamRole.ANAESTHETIST)?.staffId ??
        null,
      scrubNurseId:
        dto.scrubNurseId ??
        teamMembers.find((member) => member.role === OtTeamRole.SCRUB_NURSE)?.staffId ??
        null,
      circulatingNurseId:
        dto.circulatingNurseId ??
        teamMembers.find((member) => member.role === OtTeamRole.CIRCULATING_NURSE)?.staffId ??
        null,
      technicianId:
        dto.technicianId ??
        teamMembers.find((member) => member.role === OtTeamRole.OT_TECHNICIAN)?.staffId ??
        null,
    };
  }

  private collectStaffIdsFromPayload(
    dto: {
      primarySurgeonId?: string | null;
      anaesthetistId?: string | null;
      scrubNurseId?: string | null;
      circulatingNurseId?: string | null;
      technicianId?: string | null;
      assistantSurgeonIds?: string[] | null;
      teamMembers?: Array<{ staffId: string }>;
    },
  ) {
    return Array.from(
      new Set(
        [
          dto.primarySurgeonId,
          dto.anaesthetistId,
          dto.scrubNurseId,
          dto.circulatingNurseId,
          dto.technicianId,
          ...(dto.assistantSurgeonIds ?? []),
          ...((dto.teamMembers ?? []).map((member) => member.staffId)),
        ].filter(Boolean) as string[],
      ),
    );
  }

  private validateTeamMembers(teamMembers?: OtTeamMemberDto[]) {
    if (!teamMembers) {
      return;
    }

    const seen = new Set<string>();
    let primarySurgeonCount = 0;

    for (const member of teamMembers) {
      const key = `${member.staffId}:${member.role}`;
      if (seen.has(key)) {
        throw new BadRequestException(`Duplicate OT team assignment for ${key}`);
      }
      seen.add(key);

      if (member.role === OtTeamRole.PRIMARY_SURGEON) {
        primarySurgeonCount += 1;
      }
    }

    if (primarySurgeonCount > 1) {
      throw new BadRequestException('Only one primary surgeon can be assigned to an OT schedule');
    }
  }

  private async syncTeamMembers(
    tx: Prisma.TransactionClient,
    tenantId: string,
    scheduleId: string,
    userId: string,
    teamMembers: OtTeamMemberDto[],
  ) {
    await tx.otTeamMember.deleteMany({ where: { scheduleId } });
    if (teamMembers.length === 0) {
      return;
    }

    await tx.otTeamMember.createMany({
      data: teamMembers.map((member) => ({
        tenantId,
        scheduleId,
        staffId: member.staffId,
        role: member.role,
        isPrimary: member.isPrimary ?? false,
        displayOrder: member.displayOrder ?? null,
        createdBy: userId,
        updatedBy: userId,
      })),
    });
  }

  private async recordStatusEvent(
    tx: Prisma.TransactionClient,
    tenantId: string,
    otScheduleId: string,
    fromStatus: OtScheduleStatus | null,
    toStatus: OtScheduleStatus,
    changedBy: string,
    reason?: string,
    remarks?: string,
  ) {
    await tx.otScheduleStatusEvent.create({
      data: {
        tenantId,
        otScheduleId,
        fromStatus,
        toStatus,
        changedBy,
        reason: reason ?? null,
        remarks: remarks ?? null,
      },
    });
  }

  private assertTransition(fromStatus: OtScheduleStatus, toStatus: OtScheduleStatus) {
    if (!SCHEDULE_TRANSITIONS[fromStatus]?.includes(toStatus)) {
      throw new BadRequestException(`Invalid OT schedule transition from ${fromStatus} to ${toStatus}`);
    }
  }

  private assertTimeRange(start: Date, end: Date) {
    if (start >= end) {
      throw new BadRequestException('Scheduled end time must be after scheduled start time');
    }
  }
}
