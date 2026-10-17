import type { BadgeTone } from '@/components/ui/tone-badge';
import { toneOf } from '@/components/ui/tone-classes';
import type { OtReportStatus, OtRequestPriority, OtRequestStatus, OtScheduleStatus } from './types';

export const OT_REQUEST_STATUS_TONE: Record<OtRequestStatus, BadgeTone> = {
  DRAFT: 'slate',
  REQUESTED: 'blue',
  UNDER_REVIEW: 'amber',
  APPROVED: 'emerald',
  REJECTED: 'red',
  SCHEDULED: 'indigo',
  CANCELLED: 'rose',
  COMPLETED: 'teal',
};

/** The day-of-surgery flow, so a board reads left to right as cool → warm → done. */
export const OT_SCHEDULE_STATUS_TONE: Record<OtScheduleStatus, BadgeTone> = {
  PLANNED: 'sky',
  CONFIRMED: 'blue',
  PATIENT_READY: 'cyan',
  PATIENT_IN_OT: 'violet',
  ANAESTHESIA_STARTED: 'amber',
  SURGERY_STARTED: 'orange',
  SURGERY_COMPLETED: 'emerald',
  PATIENT_SHIFTED_TO_RECOVERY: 'teal',
  CANCELLED: 'rose',
  POSTPONED: 'fuchsia',
};

export const OT_REPORT_STATUS_TONE: Record<OtReportStatus, BadgeTone> = {
  DRAFT: 'slate',
  SIGNED: 'emerald',
  AMENDED: 'amber',
  CANCELLED: 'rose',
};

export const OT_REQUEST_PRIORITY_TONE: Record<OtRequestPriority, BadgeTone> = {
  ELECTIVE: 'teal',
  URGENT: 'amber',
  EMERGENCY: 'red',
};

export const otRequestStatusTone = (status: string | null | undefined): BadgeTone =>
  toneOf(OT_REQUEST_STATUS_TONE, status);
export const otScheduleStatusTone = (status: string | null | undefined): BadgeTone =>
  toneOf(OT_SCHEDULE_STATUS_TONE, status);
export const otReportStatusTone = (status: string | null | undefined): BadgeTone =>
  toneOf(OT_REPORT_STATUS_TONE, status);
export const otRequestPriorityTone = (priority: string | null | undefined): BadgeTone =>
  toneOf(OT_REQUEST_PRIORITY_TONE, priority);
