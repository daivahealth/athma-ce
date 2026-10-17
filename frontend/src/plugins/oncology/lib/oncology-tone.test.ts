import {
  ONCOLOGY_STATUS_TONE,
  PHASE_TONES,
  TREATMENT_INTENT_TONE,
  TREATMENT_MODALITY_TONE,
  oncologyStatusTone,
  phaseTone,
  treatmentIntentTone,
  treatmentModalityTone,
} from './oncology-tone';

// Every status enum in plugins/oncology/types, lower-cased.
const STATUSES = [
  // CarePlanStatus
  'draft',
  'active',
  'on_hold',
  'completed',
  'cancelled',
  'revised',
  // PlannedModality status
  'planned',
  'in_progress',
  // Tumour board
  'scheduled',
  'in_review',
  'deferred',
  // Chemo order
  'pending',
  'approved',
  'verified',
  'held',
  // TreatmentDayStatus
  'ordered',
  'given',
  'skipped',
  // RadiationStatus / FractionStatus / PlanningStatus (upper case in the API)
  'DRAFT',
  'APPROVED',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
  'SCHEDULED',
  'DELIVERED',
  'MISSED',
  'RESCHEDULED',
  'NOT_STARTED',
];

describe('oncology tones', () => {
  it.each(STATUSES)('maps status %s', (status) => {
    expect(oncologyStatusTone(status)).toBe(ONCOLOGY_STATUS_TONE[status.toLowerCase()]);
  });

  it.each(Object.keys(TREATMENT_MODALITY_TONE))('maps modality %s', (modality) => {
    expect(treatmentModalityTone(modality)).toBe(
      TREATMENT_MODALITY_TONE[modality as keyof typeof TREATMENT_MODALITY_TONE],
    );
  });

  it('gives each modality its own tone', () => {
    const tones = Object.values(TREATMENT_MODALITY_TONE);
    expect(new Set(tones).size).toBe(tones.length);
  });

  it.each(Object.keys(TREATMENT_INTENT_TONE))('maps intent %s', (intent) => {
    expect(treatmentIntentTone(intent)).toBe(
      TREATMENT_INTENT_TONE[intent as keyof typeof TREATMENT_INTENT_TONE],
    );
  });

  it('colours phases by position and wraps around', () => {
    expect(phaseTone(0)).toBe(PHASE_TONES[0]);
    expect(phaseTone(1)).toBe(PHASE_TONES[1]);
    expect(phaseTone(PHASE_TONES.length)).toBe(PHASE_TONES[0]);
  });

  it('falls back to slate for unknown values', () => {
    expect(oncologyStatusTone('exploded')).toBe('slate');
    expect(oncologyStatusTone(null)).toBe('slate');
    expect(treatmentModalityTone('magic')).toBe('slate');
    expect(treatmentIntentTone('')).toBe('slate');
    expect(phaseTone(undefined)).toBe('slate');
    expect(phaseTone(-1)).toBe('slate');
  });
});
