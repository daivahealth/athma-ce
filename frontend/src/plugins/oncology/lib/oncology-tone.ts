import type { BadgeTone } from '@/components/ui/tone-badge';
import { toneOf } from '@/components/ui/tone-classes';
import type { TreatmentIntent, TreatmentModality } from '@/plugins/oncology/types';

/**
 * One status vocabulary across the oncology screens: care plans, tumour
 * boards, chemo orders, treatment plans and days, radiation plans and
 * fractions. Keys are lower case; {@link oncologyStatusTone} folds the
 * radiation enums (upper case) onto them.
 */
export const ONCOLOGY_STATUS_TONE: Record<string, BadgeTone> = {
  // preparation
  draft: 'slate',
  planned: 'sky',
  not_started: 'slate',
  pending: 'amber',
  in_review: 'purple',
  revised: 'cyan',
  // authorised / booked
  ordered: 'blue',
  scheduled: 'blue',
  approved: 'indigo',
  verified: 'teal',
  // under way
  active: 'green',
  in_progress: 'violet',
  // done
  given: 'emerald',
  delivered: 'emerald',
  completed: 'emerald',
  // paused or moved
  held: 'orange',
  on_hold: 'orange',
  deferred: 'amber',
  rescheduled: 'amber',
  // did not happen
  skipped: 'slate',
  missed: 'red',
  cancelled: 'rose',
};

export const TREATMENT_MODALITY_TONE: Record<TreatmentModality, BadgeTone> = {
  surgery: 'rose',
  chemotherapy: 'violet',
  radiation: 'amber',
  immunotherapy: 'teal',
  hormonal: 'fuchsia',
  targeted: 'indigo',
  palliative: 'purple',
  surveillance: 'sky',
};

export const TREATMENT_INTENT_TONE: Record<TreatmentIntent, BadgeTone> = {
  curative: 'green',
  adjuvant: 'blue',
  neoadjuvant: 'indigo',
  palliative: 'purple',
  surveillance: 'amber',
  supportive: 'teal',
};

/**
 * A protocol's phases have free-text names (AC, Paclitaxel, TCH…), so they
 * are coloured by position, in the same order as the builder's phase accents.
 */
export const PHASE_TONES: readonly BadgeTone[] = ['sky', 'violet', 'emerald', 'orange', 'fuchsia'];

export const oncologyStatusTone = (status: string | null | undefined): BadgeTone =>
  toneOf(ONCOLOGY_STATUS_TONE, status?.toLowerCase());
export const treatmentModalityTone = (modality: string | null | undefined): BadgeTone =>
  toneOf(TREATMENT_MODALITY_TONE, modality);
export const treatmentIntentTone = (intent: string | null | undefined): BadgeTone =>
  toneOf(TREATMENT_INTENT_TONE, intent);
export const phaseTone = (phaseIndex: number | null | undefined): BadgeTone =>
  phaseIndex == null || phaseIndex < 0 || !Number.isInteger(phaseIndex)
    ? 'slate'
    : PHASE_TONES[phaseIndex % PHASE_TONES.length];
