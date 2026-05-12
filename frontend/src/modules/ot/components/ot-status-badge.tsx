'use client';

import { Badge } from '@/components/ui/badge';
import type { OtReportStatus, OtRequestStatus, OtScheduleStatus } from '../types';

const REQUEST_STATUS_STYLES: Record<OtRequestStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  REQUESTED: 'bg-blue-100 text-blue-700',
  UNDER_REVIEW: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700',
  SCHEDULED: 'bg-indigo-100 text-indigo-700',
  CANCELLED: 'bg-zinc-200 text-zinc-700',
  COMPLETED: 'bg-teal-100 text-teal-700',
};

const SCHEDULE_STATUS_STYLES: Record<OtScheduleStatus, string> = {
  PLANNED: 'bg-slate-100 text-slate-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PATIENT_READY: 'bg-cyan-100 text-cyan-700',
  PATIENT_IN_OT: 'bg-violet-100 text-violet-700',
  ANAESTHESIA_STARTED: 'bg-amber-100 text-amber-800',
  SURGERY_STARTED: 'bg-orange-100 text-orange-700',
  SURGERY_COMPLETED: 'bg-emerald-100 text-emerald-700',
  PATIENT_SHIFTED_TO_RECOVERY: 'bg-teal-100 text-teal-700',
  CANCELLED: 'bg-zinc-200 text-zinc-700',
  POSTPONED: 'bg-rose-100 text-rose-700',
};

const REPORT_STATUS_STYLES: Record<OtReportStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  SIGNED: 'bg-emerald-100 text-emerald-700',
  AMENDED: 'bg-amber-100 text-amber-800',
  CANCELLED: 'bg-zinc-200 text-zinc-700',
};

function humanize(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function OtRequestStatusBadge({ status }: { status: OtRequestStatus }) {
  return <Badge className={REQUEST_STATUS_STYLES[status]}>{humanize(status)}</Badge>;
}

export function OtScheduleStatusBadge({ status }: { status: OtScheduleStatus }) {
  return <Badge className={SCHEDULE_STATUS_STYLES[status]}>{humanize(status)}</Badge>;
}

export function OtReportStatusBadge({ status }: { status: OtReportStatus }) {
  return <Badge className={REPORT_STATUS_STYLES[status]}>{humanize(status)}</Badge>;
}
