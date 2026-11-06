import type { BadgeTone } from '@/components/ui/tone-badge';
import { toneOf } from '@/components/ui/tone-classes';

/**
 * One palette for every lab screen: the results list, the operations
 * worklists and the report page all colour a report status, an analyte's
 * interpretation, a specimen's lab stage and an order's priority the same way.
 */

export const REPORT_STATUS_TONE: Record<string, BadgeTone> = {
  DRAFT: 'slate',
  PRELIMINARY: 'amber',
  FINAL: 'emerald',
  AMENDED: 'blue',
  CORRECTED: 'orange',
  CANCELLED: 'red',
};

export const reportStatusTone = (status: string | null | undefined): BadgeTone =>
  toneOf(REPORT_STATUS_TONE, status);

export const INTERPRETATION_TONE: Record<string, BadgeTone> = {
  normal: 'emerald',
  high: 'amber',
  low: 'amber',
  abnormal: 'amber',
  critical_high: 'red',
  critical_low: 'red',
};

export const interpretationTone = (interpretation: string | null | undefined): BadgeTone =>
  toneOf(INTERPRETATION_TONE, interpretation);

/** A readable label for an interpretation code, e.g. `critical_high` → `Critical high`. */
export function interpretationLabel(interpretation: string | null | undefined): string {
  if (!interpretation) return '';
  const words = interpretation.split('_').join(' ');
  return words[0].toUpperCase() + words.slice(1);
}

/** The arrow a reader scans for down a result column. */
export function interpretationArrow(interpretation: string | null | undefined): '↑' | '↓' | '' {
  if (interpretation === 'high' || interpretation === 'critical_high') return '↑';
  if (interpretation === 'low' || interpretation === 'critical_low') return '↓';
  return '';
}

/** Where a specimen or ordered test sits in the lab's own pipeline. */
export const LAB_STAGE_TONE: Record<string, BadgeTone> = {
  pending: 'slate',
  ordered: 'slate',
  prepared: 'sky',
  collected: 'sky',
  received: 'violet',
  accessioned: 'indigo',
  processing: 'amber',
  result_entered: 'teal',
  completed: 'emerald',
  verified: 'emerald',
  rejected: 'red',
  cancelled: 'red',
};

export const labStageTone = (status: string | null | undefined): BadgeTone =>
  toneOf(LAB_STAGE_TONE, status?.toLowerCase());

export const LAB_PRIORITY_TONE: Record<string, BadgeTone> = {
  routine: 'slate',
  urgent: 'orange',
  asap: 'orange',
  stat: 'red',
  critical: 'red',
};

export const labPriorityTone = (priority: string | null | undefined): BadgeTone =>
  toneOf(LAB_PRIORITY_TONE, priority?.toLowerCase(), 'amber');
