import type { Encounter } from '@/modules/clinical/types/encounter';
import type { PatientDisplay } from '@/modules/clinical/types/encounter';
import type { Patient } from '@/modules/clinical/types/patient';
import type { Space } from '@/modules/foundation/types/space';

export const OT_REQUEST_STATUSES = [
  'DRAFT',
  'REQUESTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'SCHEDULED',
  'CANCELLED',
  'COMPLETED',
] as const;

export const OT_REQUEST_PRIORITIES = ['ELECTIVE', 'URGENT', 'EMERGENCY'] as const;

export const OT_SCHEDULE_STATUSES = [
  'PLANNED',
  'CONFIRMED',
  'PATIENT_READY',
  'PATIENT_IN_OT',
  'ANAESTHESIA_STARTED',
  'SURGERY_STARTED',
  'SURGERY_COMPLETED',
  'PATIENT_SHIFTED_TO_RECOVERY',
  'CANCELLED',
  'POSTPONED',
] as const;

export const OT_REPORT_STATUSES = ['DRAFT', 'SIGNED', 'AMENDED', 'CANCELLED'] as const;

export const OT_TEAM_ROLES = [
  'PRIMARY_SURGEON',
  'ASSISTANT_SURGEON',
  'ANAESTHETIST',
  'SCRUB_NURSE',
  'CIRCULATING_NURSE',
  'OT_TECHNICIAN',
  'PERFUSIONIST',
  'RADIOLOGY_TECHNICIAN',
] as const;

export type OtRequestStatus = (typeof OT_REQUEST_STATUSES)[number];
export type OtRequestPriority = (typeof OT_REQUEST_PRIORITIES)[number];
export type OtScheduleStatus = (typeof OT_SCHEDULE_STATUSES)[number];
export type OtReportStatus = (typeof OT_REPORT_STATUSES)[number];
export type OtTeamRole = (typeof OT_TEAM_ROLES)[number];

export interface OtTeamMember {
  id: string;
  tenantId: string;
  scheduleId: string;
  staffId: string;
  role: OtTeamRole;
  isPrimary: boolean;
  displayOrder?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface OtReportVersion {
  id: string;
  tenantId: string;
  reportId: string;
  versionNo: number;
  reportData: Record<string, unknown>;
  createdBy: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface OtReport {
  id: string;
  tenantId: string;
  scheduleId: string;
  otRequestId: string;
  patientId: string;
  encounterId: string;
  reportNumber: string;
  reportStatus: OtReportStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  signedBy?: string | null;
  signedAt?: string | null;
  remarks?: string | null;
  versions?: OtReportVersion[];
  patientDisplay?: PatientDisplay | null;
  schedule?: { scheduledStartTime: string; scheduledEndTime: string } | null;
}

export interface OtSchedule {
  id: string;
  tenantId: string;
  otRequestId: string;
  patientId: string;
  encounterId: string;
  otRoomSpaceId: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
  primarySurgeonId?: string | null;
  assistantSurgeonIds?: string[];
  anaesthetistId?: string | null;
  scrubNurseId?: string | null;
  circulatingNurseId?: string | null;
  technicianId?: string | null;
  anaesthesiaType?: string | null;
  status: OtScheduleStatus;
  isCurrent: boolean;
  postponedReason?: string | null;
  cancelledReason?: string | null;
  createdAt: string;
  updatedAt: string;
  teamMembers?: OtTeamMember[];
  reports?: OtReport[];
  patientDisplay?: PatientDisplay | null;
  room?: OtRoomConfig | null;
  roomDisplayName?: string | null;
  roomDisplayDescription?: string | null;
}

export interface OtRequest {
  id: string;
  tenantId: string;
  patientId: string;
  encounterId: string;
  requestedBy: string;
  requestedAt: string;
  surgeryType?: string | null;
  procedureCode?: string | null;
  procedureName: string;
  diagnosis?: string | null;
  priority: OtRequestPriority;
  expectedDurationMinutes?: number | null;
  preferredDate?: string | null;
  preferredOtRoomSpaceId?: string | null;
  primarySurgeonId?: string | null;
  anaesthetistRequired: boolean;
  anaesthesiaTypePlanned?: string | null;
  specialEquipmentRequired?: string[] | null;
  bloodRequired: boolean;
  implantsRequired?: string[] | null;
  remarks?: string | null;
  status: OtRequestStatus;
  activeScheduleId?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  completedBy?: string | null;
  completedAt?: string | null;
  schedules?: OtSchedule[];
  reports?: OtReport[];
  patientDisplay?: PatientDisplay | null;
}

export interface OtRoomConfig {
  id: string;
  tenantId: string;
  spaceId: string;
  specialty?: string | null;
  isActive: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  space?: Space | null;
}

export const OT_BOARD_STATES = ['IDLE', 'OCCUPIED', 'NEXT_UP', 'BLOCKED', 'INACTIVE'] as const;
export type OtBoardState = (typeof OT_BOARD_STATES)[number];

export interface OtBoardCase {
  scheduleId: string;
  otRequestId: string;
  patientId: string;
  patientDisplay?: PatientDisplay | null;
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
  scheduleStatus: OtScheduleStatus;
  procedureName: string;
  procedureCode?: string | null;
  primarySurgeonId?: string | null;
}

export interface OtBoardRoom {
  room: {
    id: string;
    spaceId: string;
    name: string;
    spaceNumber?: string | null;
    specialty?: string | null;
    isActive: boolean;
    notes?: string | null;
  };
  state: OtBoardState;
  stateLabel: string;
  blockedReason?: string | null;
  currentCase?: OtBoardCase | null;
  nextCase?: OtBoardCase | null;
  summary: {
    scheduledCaseCount: number;
    completedCaseCount: number;
    cancelledCaseCount: number;
    plannedOccupiedMinutes: number;
    actualOccupiedMinutes: number;
    hasDelay: boolean;
    delayMinutes: number;
  };
}

export interface OtBoardSummary {
  totalRooms: number;
  activeRooms: number;
  occupiedRooms: number;
  idleRooms: number;
  blockedRooms: number;
  inactiveRooms: number;
  nextUpRooms: number;
  casesInProgress: number;
}

export interface OtBoardResponse {
  date: string;
  generatedAt: string;
  summary: OtBoardSummary;
  rooms: OtBoardRoom[];
}

export interface OtRequestStatusEvent {
  id: string;
  tenantId: string;
  otRequestId: string;
  fromStatus?: OtRequestStatus | null;
  toStatus: OtRequestStatus;
  changedBy: string;
  changedAt: string;
  reason?: string | null;
  remarks?: string | null;
}

export interface OtScheduleStatusEvent {
  id: string;
  tenantId: string;
  otScheduleId: string;
  fromStatus?: OtScheduleStatus | null;
  toStatus: OtScheduleStatus;
  changedBy: string;
  changedAt: string;
  reason?: string | null;
  remarks?: string | null;
}

export interface OtConflictItem {
  type: 'room' | 'staff' | 'availability' | 'block';
  resourceId: string;
  message: string;
  conflictingScheduleId?: string;
}

export interface OtConflictsResponse {
  hasConflicts: boolean;
  conflicts: OtConflictItem[];
}

export interface OtRequestListFilters {
  search?: string;
  status?: OtRequestStatus;
  patientId?: string;
  encounterId?: string;
  primarySurgeonId?: string;
}

export interface OtScheduleListFilters {
  search?: string;
  status?: OtScheduleStatus;
  patientId?: string;
  encounterId?: string;
  otRoomSpaceId?: string;
  primarySurgeonId?: string;
}

export interface OtReportListFilters {
  search?: string;
  reportStatus?: OtReportStatus;
  patientId?: string;
  scheduleId?: string;
}

export interface CreateOtRequestInput {
  patientId: string;
  encounterId: string;
  procedureName: string;
  surgeryType?: string;
  procedureCode?: string;
  diagnosis?: string;
  priority?: OtRequestPriority;
  expectedDurationMinutes?: number;
  preferredDate?: string;
  preferredOtRoomSpaceId?: string;
  primarySurgeonId?: string;
  anaesthetistRequired?: boolean;
  anaesthesiaTypePlanned?: string;
  specialEquipmentRequired?: string[];
  bloodRequired?: boolean;
  implantsRequired?: string[];
  remarks?: string;
}

export interface UpdateOtRequestInput extends Partial<CreateOtRequestInput> {}

export interface OtTransitionInput {
  reason?: string;
  remarks?: string;
}

export interface CreateOtScheduleInput {
  otRequestId: string;
  otRoomSpaceId: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  primarySurgeonId?: string;
  assistantSurgeonIds?: string[];
  anaesthetistId?: string;
  scrubNurseId?: string;
  circulatingNurseId?: string;
  technicianId?: string;
  anaesthesiaType?: string;
  teamMembers?: Array<{
    staffId: string;
    role: OtTeamRole;
    isPrimary?: boolean;
    displayOrder?: number;
  }>;
}

export interface UpdateOtScheduleInput extends Partial<CreateOtScheduleInput> {
  actualStartTime?: string;
  actualEndTime?: string;
}

export interface TransitionOtScheduleInput extends OtTransitionInput {
  actualStartTime?: string;
  actualEndTime?: string;
}

export interface CheckOtScheduleConflictsInput {
  otRoomSpaceId: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  scheduleId?: string;
  staffIds?: string[];
}

export interface CreateOtReportInput {
  scheduleId: string;
  remarks?: string;
  reportData: Record<string, unknown>;
}

export interface UpdateOtReportInput {
  remarks?: string;
  reportData?: Record<string, unknown>;
}

export interface AmendOtReportInput extends OtTransitionInput {
  reportData: Record<string, unknown>;
}

export interface UpsertOtRoomConfigInput {
  spaceId: string;
  specialty?: string;
  isActive?: boolean;
  notes?: string;
}

export interface UpdateOtRoomConfigInput {
  specialty?: string;
  isActive?: boolean;
  notes?: string;
}

export interface OtRequestContext {
  request: OtRequest;
  encounter?: Encounter | null;
  patient?: Partial<Patient> | null;
}
