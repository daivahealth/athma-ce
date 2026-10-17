import {
  OT_REPORT_STATUSES,
  OT_REQUEST_PRIORITIES,
  OT_REQUEST_STATUSES,
  OT_SCHEDULE_STATUSES,
} from './types';
import {
  OT_REPORT_STATUS_TONE,
  OT_REQUEST_PRIORITY_TONE,
  OT_REQUEST_STATUS_TONE,
  OT_SCHEDULE_STATUS_TONE,
  otReportStatusTone,
  otRequestPriorityTone,
  otRequestStatusTone,
  otScheduleStatusTone,
} from './ot-tone';

describe('OT tones', () => {
  it.each(OT_REQUEST_STATUSES)('maps request status %s', (status) => {
    expect(otRequestStatusTone(status)).toBe(OT_REQUEST_STATUS_TONE[status]);
  });

  it.each(OT_SCHEDULE_STATUSES)('maps schedule status %s', (status) => {
    expect(otScheduleStatusTone(status)).toBe(OT_SCHEDULE_STATUS_TONE[status]);
  });

  it.each(OT_REPORT_STATUSES)('maps report status %s', (status) => {
    expect(otReportStatusTone(status)).toBe(OT_REPORT_STATUS_TONE[status]);
  });

  it.each(OT_REQUEST_PRIORITIES)('maps priority %s', (priority) => {
    expect(otRequestPriorityTone(priority)).toBe(OT_REQUEST_PRIORITY_TONE[priority]);
  });

  it('gives each schedule step its own tone', () => {
    const tones = Object.values(OT_SCHEDULE_STATUS_TONE);
    expect(new Set(tones).size).toBe(tones.length);
  });

  it('falls back to slate for unknown values', () => {
    expect(otRequestStatusTone('ARCHIVED')).toBe('slate');
    expect(otScheduleStatusTone(undefined)).toBe('slate');
    expect(otReportStatusTone('')).toBe('slate');
    expect(otRequestPriorityTone('LOW')).toBe('slate');
  });
});
