export enum OtRequestPriority {
  ELECTIVE = 'ELECTIVE',
  URGENT = 'URGENT',
  EMERGENCY = 'EMERGENCY',
}

export enum OtRequestStatus {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum OtScheduleStatus {
  PLANNED = 'PLANNED',
  CONFIRMED = 'CONFIRMED',
  PATIENT_READY = 'PATIENT_READY',
  PATIENT_IN_OT = 'PATIENT_IN_OT',
  ANAESTHESIA_STARTED = 'ANAESTHESIA_STARTED',
  SURGERY_STARTED = 'SURGERY_STARTED',
  SURGERY_COMPLETED = 'SURGERY_COMPLETED',
  PATIENT_SHIFTED_TO_RECOVERY = 'PATIENT_SHIFTED_TO_RECOVERY',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED',
}

export enum OtTeamRole {
  PRIMARY_SURGEON = 'PRIMARY_SURGEON',
  ASSISTANT_SURGEON = 'ASSISTANT_SURGEON',
  ANAESTHETIST = 'ANAESTHETIST',
  SCRUB_NURSE = 'SCRUB_NURSE',
  CIRCULATING_NURSE = 'CIRCULATING_NURSE',
  OT_TECHNICIAN = 'OT_TECHNICIAN',
  PERFUSIONIST = 'PERFUSIONIST',
  RADIOLOGY_TECHNICIAN = 'RADIOLOGY_TECHNICIAN',
}

export enum OtReportStatus {
  DRAFT = 'DRAFT',
  SIGNED = 'SIGNED',
  AMENDED = 'AMENDED',
  CANCELLED = 'CANCELLED',
}

export const REQUEST_MUTABLE_STATUSES = [
  OtRequestStatus.DRAFT,
  OtRequestStatus.REQUESTED,
  OtRequestStatus.UNDER_REVIEW,
  OtRequestStatus.APPROVED,
];

export const ACTIVE_SCHEDULE_STATUSES = [
  OtScheduleStatus.PLANNED,
  OtScheduleStatus.CONFIRMED,
  OtScheduleStatus.PATIENT_READY,
  OtScheduleStatus.PATIENT_IN_OT,
  OtScheduleStatus.ANAESTHESIA_STARTED,
  OtScheduleStatus.SURGERY_STARTED,
  OtScheduleStatus.SURGERY_COMPLETED,
  OtScheduleStatus.PATIENT_SHIFTED_TO_RECOVERY,
];

export const REQUEST_TRANSITIONS: Record<OtRequestStatus, OtRequestStatus[]> = {
  [OtRequestStatus.DRAFT]: [OtRequestStatus.REQUESTED, OtRequestStatus.CANCELLED],
  [OtRequestStatus.REQUESTED]: [
    OtRequestStatus.UNDER_REVIEW,
    OtRequestStatus.APPROVED,
    OtRequestStatus.REJECTED,
    OtRequestStatus.CANCELLED,
  ],
  [OtRequestStatus.UNDER_REVIEW]: [
    OtRequestStatus.APPROVED,
    OtRequestStatus.REJECTED,
    OtRequestStatus.CANCELLED,
  ],
  [OtRequestStatus.APPROVED]: [OtRequestStatus.SCHEDULED, OtRequestStatus.CANCELLED],
  [OtRequestStatus.REJECTED]: [],
  [OtRequestStatus.SCHEDULED]: [OtRequestStatus.CANCELLED, OtRequestStatus.COMPLETED],
  [OtRequestStatus.CANCELLED]: [],
  [OtRequestStatus.COMPLETED]: [],
};

export const SCHEDULE_TRANSITIONS: Record<OtScheduleStatus, OtScheduleStatus[]> = {
  [OtScheduleStatus.PLANNED]: [
    OtScheduleStatus.CONFIRMED,
    OtScheduleStatus.CANCELLED,
    OtScheduleStatus.POSTPONED,
  ],
  [OtScheduleStatus.CONFIRMED]: [
    OtScheduleStatus.PATIENT_READY,
    OtScheduleStatus.CANCELLED,
    OtScheduleStatus.POSTPONED,
  ],
  [OtScheduleStatus.PATIENT_READY]: [
    OtScheduleStatus.PATIENT_IN_OT,
    OtScheduleStatus.CANCELLED,
    OtScheduleStatus.POSTPONED,
  ],
  [OtScheduleStatus.PATIENT_IN_OT]: [
    OtScheduleStatus.ANAESTHESIA_STARTED,
    OtScheduleStatus.CANCELLED,
  ],
  [OtScheduleStatus.ANAESTHESIA_STARTED]: [
    OtScheduleStatus.SURGERY_STARTED,
    OtScheduleStatus.CANCELLED,
  ],
  [OtScheduleStatus.SURGERY_STARTED]: [
    OtScheduleStatus.SURGERY_COMPLETED,
    OtScheduleStatus.CANCELLED,
  ],
  [OtScheduleStatus.SURGERY_COMPLETED]: [
    OtScheduleStatus.PATIENT_SHIFTED_TO_RECOVERY,
    OtScheduleStatus.CANCELLED,
  ],
  [OtScheduleStatus.PATIENT_SHIFTED_TO_RECOVERY]: [],
  [OtScheduleStatus.CANCELLED]: [],
  [OtScheduleStatus.POSTPONED]: [],
};
