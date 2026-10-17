'use client';

import { ToneBadge } from '@/components/ui/tone-badge';
import {
  otReportStatusTone,
  otRequestPriorityTone,
  otRequestStatusTone,
  otScheduleStatusTone,
} from '../ot-tone';
import type {
  OtReportStatus,
  OtRequestPriority,
  OtRequestStatus,
  OtScheduleStatus,
} from '../types';

function humanize(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function OtRequestStatusBadge({ status }: { status: OtRequestStatus }) {
  return (
    <ToneBadge tone={otRequestStatusTone(status)} withDot>
      {humanize(status)}
    </ToneBadge>
  );
}

export function OtScheduleStatusBadge({ status }: { status: OtScheduleStatus }) {
  return (
    <ToneBadge tone={otScheduleStatusTone(status)} withDot>
      {humanize(status)}
    </ToneBadge>
  );
}

export function OtReportStatusBadge({ status }: { status: OtReportStatus }) {
  return (
    <ToneBadge tone={otReportStatusTone(status)} withDot>
      {humanize(status)}
    </ToneBadge>
  );
}

/** An emergency is the one priority that must stand out from the rest of the row. */
export function OtRequestPriorityBadge({ priority }: { priority: OtRequestPriority }) {
  return (
    <ToneBadge tone={otRequestPriorityTone(priority)} strong={priority === 'EMERGENCY'}>
      {humanize(priority)}
    </ToneBadge>
  );
}
