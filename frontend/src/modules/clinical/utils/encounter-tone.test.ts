import {
  EncounterClass,
  EncounterPriority,
  EncounterStatus,
} from '@/modules/clinical/types/encounter';
import {
  ENCOUNTER_CLASS_TONE,
  ENCOUNTER_PRIORITY_TONE,
  ENCOUNTER_STATUS_TONE,
  encounterClassTone,
  encounterPriorityTone,
  encounterStatusTone,
} from './encounter-tone';

describe('encounter tones', () => {
  it.each(Object.values(EncounterStatus))('maps status %s', (status) => {
    expect(encounterStatusTone(status)).toBe(ENCOUNTER_STATUS_TONE[status]);
  });

  it.each(Object.values(EncounterClass))('maps class %s', (encounterClass) => {
    expect(encounterClassTone(encounterClass)).toBe(ENCOUNTER_CLASS_TONE[encounterClass]);
  });

  it.each(Object.values(EncounterPriority))('maps priority %s', (priority) => {
    expect(encounterPriorityTone(priority)).toBe(ENCOUNTER_PRIORITY_TONE[priority]);
  });

  it('gives each class its own tone', () => {
    const tones = Object.values(ENCOUNTER_CLASS_TONE);
    expect(new Set(tones).size).toBe(tones.length);
  });

  it('falls back to slate for unknown values', () => {
    expect(encounterStatusTone('paused')).toBe('slate');
    expect(encounterClassTone('XYZ')).toBe('slate');
    expect(encounterPriorityTone(null)).toBe('slate');
  });
});
