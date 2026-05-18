import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { STANDARD_PATIENT_SELECT } from '../../common/constants/patient-select.constant';
import { buildOtPatientDisplay } from '../ot-patient-display.util';
import { OtScheduleStatus } from '../ot.constants';
import { OtRoomsService } from './ot-rooms.service';

type BoardState = 'IDLE' | 'OCCUPIED' | 'NEXT_UP' | 'BLOCKED' | 'INACTIVE';

const LIVE_BOARD_STATUSES = new Set<OtScheduleStatus>([
  OtScheduleStatus.PATIENT_IN_OT,
  OtScheduleStatus.ANAESTHESIA_STARTED,
  OtScheduleStatus.SURGERY_STARTED,
]);

const SCHEDULED_BOARD_STATUSES = new Set<OtScheduleStatus>([
  OtScheduleStatus.PLANNED,
  OtScheduleStatus.CONFIRMED,
  OtScheduleStatus.PATIENT_READY,
  OtScheduleStatus.PATIENT_IN_OT,
  OtScheduleStatus.ANAESTHESIA_STARTED,
  OtScheduleStatus.SURGERY_STARTED,
  OtScheduleStatus.SURGERY_COMPLETED,
  OtScheduleStatus.PATIENT_SHIFTED_TO_RECOVERY,
]);

@Injectable()
export class OtBoardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otRoomsService: OtRoomsService,
  ) {}

  async getBoard(tenantId: string, date?: string, facilityId?: string) {
    const boardDate = this.normalizeDate(date);
    const dayStart = new Date(`${boardDate}T00:00:00`);
    const dayEnd = new Date(`${boardDate}T23:59:59.999`);
    const now = new Date();
    const referenceTime =
      boardDate === this.toDateKey(now) ? now : new Date(`${boardDate}T00:00:00`);

    const rooms = await this.otRoomsService.list(tenantId, facilityId, true);
    const roomIds = rooms.map((room) => room.spaceId);

    if (roomIds.length === 0) {
      return {
        date: boardDate,
        generatedAt: now.toISOString(),
        summary: {
          totalRooms: 0,
          activeRooms: 0,
          occupiedRooms: 0,
          idleRooms: 0,
          blockedRooms: 0,
          inactiveRooms: 0,
          nextUpRooms: 0,
          casesInProgress: 0,
        },
        rooms: [],
      };
    }

    const schedules = await this.prisma.otSchedule.findMany({
      where: {
        tenantId,
        otRoomSpaceId: { in: roomIds },
        scheduledStartTime: { lt: dayEnd },
        scheduledEndTime: { gt: dayStart },
      },
      include: {
        otRequest: {
          select: {
            id: true,
            procedureName: true,
            procedureCode: true,
          },
        },
      },
      orderBy: [{ scheduledStartTime: 'asc' }, { createdAt: 'asc' }],
    });

    const roomBlocks = await this.prisma.resourceBlock.findMany({
      where: {
        tenantId,
        resourceType: 'space',
        resourceId: { in: roomIds },
        isAvailable: false,
        approvalStatus: 'approved',
        startDatetime: { lt: dayEnd },
        endDatetime: { gt: dayStart },
      },
      orderBy: { startDatetime: 'asc' },
    });

    const patientDisplayMap = await this.fetchPatientDisplayMap(
      tenantId,
      schedules.map((schedule) => schedule.patientId),
    );

    const schedulesByRoom = new Map<string, typeof schedules>();
    for (const schedule of schedules) {
      const list = schedulesByRoom.get(schedule.otRoomSpaceId) ?? [];
      list.push(schedule);
      schedulesByRoom.set(schedule.otRoomSpaceId, list);
    }

    const blocksByRoom = new Map<string, typeof roomBlocks>();
    for (const block of roomBlocks) {
      const list = blocksByRoom.get(block.resourceId) ?? [];
      list.push(block);
      blocksByRoom.set(block.resourceId, list);
    }

    const roomCards = rooms
      .map((room) => {
        const roomSchedules = (schedulesByRoom.get(room.spaceId) ?? []).sort(
          (a, b) =>
            new Date(a.scheduledStartTime).getTime() -
            new Date(b.scheduledStartTime).getTime(),
        );
        const blocks = blocksByRoom.get(room.spaceId) ?? [];
        const activeBlock =
          blocks.find((block) =>
            this.overlaps(referenceTime, referenceTime, block.startDatetime, block.endDatetime),
          ) ?? null;

        const currentCase =
          roomSchedules.find((schedule) => this.isCurrentCase(schedule, referenceTime)) ?? null;

        const nextCase =
          roomSchedules.find((schedule) => {
            if (currentCase && schedule.id === currentCase.id) {
              return false;
            }
            return new Date(schedule.scheduledStartTime).getTime() > referenceTime.getTime();
          }) ?? null;

        const state = this.resolveState(room.isActive, activeBlock, currentCase, nextCase);
        const delayMinutes = currentCase
          ? this.computeDelayMinutes(currentCase, referenceTime)
          : 0;

        return {
          room: {
            id: room.id,
            spaceId: room.spaceId,
            name: room.space?.name ?? room.specialty ?? 'Configured OT Room',
            spaceNumber: room.space?.spaceNumber ?? null,
            specialty: room.specialty ?? null,
            isActive: room.isActive,
            notes: room.notes ?? null,
          },
          state,
          stateLabel: this.getStateLabel(state),
          blockedReason: activeBlock?.reason ?? activeBlock?.blockType ?? null,
          currentCase: currentCase
            ? this.serializeBoardCase(currentCase, patientDisplayMap)
            : null,
          nextCase: nextCase ? this.serializeBoardCase(nextCase, patientDisplayMap) : null,
          summary: {
            scheduledCaseCount: roomSchedules.filter((schedule) =>
              SCHEDULED_BOARD_STATUSES.has(schedule.status as OtScheduleStatus),
            ).length,
            completedCaseCount: roomSchedules.filter((schedule) =>
              [
                OtScheduleStatus.SURGERY_COMPLETED,
                OtScheduleStatus.PATIENT_SHIFTED_TO_RECOVERY,
              ].includes(schedule.status as OtScheduleStatus),
            ).length,
            cancelledCaseCount: roomSchedules.filter((schedule) =>
              [OtScheduleStatus.CANCELLED, OtScheduleStatus.POSTPONED].includes(
                schedule.status as OtScheduleStatus,
              ),
            ).length,
            plannedOccupiedMinutes: roomSchedules
              .filter((schedule) =>
                SCHEDULED_BOARD_STATUSES.has(schedule.status as OtScheduleStatus),
              )
              .reduce(
                (total, schedule) =>
                  total +
                  this.diffMinutes(
                    new Date(schedule.scheduledStartTime),
                    new Date(schedule.scheduledEndTime),
                  ),
                0,
              ),
            actualOccupiedMinutes: roomSchedules.reduce((total, schedule) => {
              if (!schedule.actualStartTime || !schedule.actualEndTime) {
                return total;
              }
              return (
                total +
                this.diffMinutes(
                  new Date(schedule.actualStartTime),
                  new Date(schedule.actualEndTime),
                )
              );
            }, 0),
            hasDelay: delayMinutes > 0,
            delayMinutes,
          },
        };
      })
      .sort((a, b) => {
        const left = `${a.room.name} ${a.room.spaceNumber ?? ''}`.trim();
        const right = `${b.room.name} ${b.room.spaceNumber ?? ''}`.trim();
        return left.localeCompare(right);
      });

    return {
      date: boardDate,
      generatedAt: now.toISOString(),
      summary: {
        totalRooms: roomCards.length,
        activeRooms: roomCards.filter((room) => room.room.isActive).length,
        occupiedRooms: roomCards.filter((room) => room.state === 'OCCUPIED').length,
        idleRooms: roomCards.filter((room) => room.state === 'IDLE').length,
        blockedRooms: roomCards.filter((room) => room.state === 'BLOCKED').length,
        inactiveRooms: roomCards.filter((room) => room.state === 'INACTIVE').length,
        nextUpRooms: roomCards.filter((room) => room.state === 'NEXT_UP').length,
        casesInProgress: roomCards.filter((room) => room.currentCase).length,
      },
      rooms: roomCards,
    };
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
      patients.map((patient) => [patient.id, buildOtPatientDisplay(patient)]),
    );
  }

  private serializeBoardCase(
    schedule: {
      id: string;
      otRequestId: string;
      patientId: string;
      scheduledStartTime: Date;
      scheduledEndTime: Date;
      actualStartTime: Date | null;
      actualEndTime: Date | null;
      status: string;
      primarySurgeonId: string | null;
      otRequest: { procedureName: string; procedureCode: string | null } | null;
    },
    patientDisplayMap: Map<string, ReturnType<typeof buildOtPatientDisplay>>,
  ) {
    return {
      scheduleId: schedule.id,
      otRequestId: schedule.otRequestId,
      patientId: schedule.patientId,
      patientDisplay: patientDisplayMap.get(schedule.patientId) ?? null,
      plannedStartTime: schedule.scheduledStartTime,
      plannedEndTime: schedule.scheduledEndTime,
      actualStartTime: schedule.actualStartTime,
      actualEndTime: schedule.actualEndTime,
      scheduleStatus: schedule.status,
      procedureName: schedule.otRequest?.procedureName ?? 'Procedure not recorded',
      procedureCode: schedule.otRequest?.procedureCode ?? null,
      primarySurgeonId: schedule.primarySurgeonId,
    };
  }

  private resolveState(
    isActive: boolean,
    activeBlock: unknown,
    currentCase: unknown,
    nextCase: unknown,
  ): BoardState {
    if (!isActive) {
      return 'INACTIVE';
    }
    if (activeBlock) {
      return 'BLOCKED';
    }
    if (currentCase) {
      return 'OCCUPIED';
    }
    if (nextCase) {
      return 'NEXT_UP';
    }
    return 'IDLE';
  }

  private isCurrentCase(
    schedule: {
      status: string;
      scheduledStartTime: Date;
      scheduledEndTime: Date;
      actualStartTime: Date | null;
      actualEndTime: Date | null;
    },
    referenceTime: Date,
  ) {
    if (!LIVE_BOARD_STATUSES.has(schedule.status as OtScheduleStatus)) {
      return false;
    }

    const start = schedule.actualStartTime ?? schedule.scheduledStartTime;
    const end = schedule.actualEndTime ?? schedule.scheduledEndTime;
    return this.overlaps(referenceTime, referenceTime, start, end);
  }

  private overlaps(leftStart: Date, leftEnd: Date, rightStart: Date, rightEnd: Date) {
    return leftStart.getTime() <= rightEnd.getTime() && leftEnd.getTime() >= rightStart.getTime();
  }

  private diffMinutes(start: Date, end: Date) {
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  }

  private computeDelayMinutes(
    schedule: {
      scheduledStartTime: Date;
      actualStartTime: Date | null;
    },
    referenceTime: Date,
  ) {
    if (schedule.actualStartTime) {
      return Math.max(0, this.diffMinutes(schedule.scheduledStartTime, schedule.actualStartTime));
    }
    if (referenceTime.getTime() > schedule.scheduledStartTime.getTime()) {
      return this.diffMinutes(schedule.scheduledStartTime, referenceTime);
    }
    return 0;
  }

  private normalizeDate(date?: string) {
    return date?.trim() || this.toDateKey(new Date());
  }

  private toDateKey(value: Date) {
    return value.toISOString().slice(0, 10);
  }

  private getStateLabel(state: BoardState) {
    switch (state) {
      case 'OCCUPIED':
        return 'Case in progress';
      case 'NEXT_UP':
        return 'Next case pending';
      case 'BLOCKED':
        return 'Room blocked';
      case 'INACTIVE':
        return 'Inactive';
      default:
        return 'Idle';
    }
  }
}
