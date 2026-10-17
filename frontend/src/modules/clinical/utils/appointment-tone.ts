import type { BadgeTone } from '@/components/ui/tone-badge';
import { toneOf } from '@/components/ui/tone-classes';

/** Every appointment status the PMS service returns (see the appointment DTO). */
export const APPOINTMENT_STATUSES = [
  'scheduled',
  'confirmed',
  'checked_in',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
  'rescheduled',
] as const;

export const APPOINTMENT_STATUS_TONE: Record<(typeof APPOINTMENT_STATUSES)[number], BadgeTone> = {
  scheduled: 'sky',
  confirmed: 'blue',
  checked_in: 'cyan',
  in_progress: 'violet',
  completed: 'emerald',
  cancelled: 'rose',
  no_show: 'orange',
  rescheduled: 'amber',
};

export const appointmentStatusTone = (status: string | null | undefined): BadgeTone =>
  toneOf(APPOINTMENT_STATUS_TONE, status);
