import type { BadgeTone } from '@/components/ui/tone-badge';
import { toneOf } from '@/components/ui/tone-classes';
import type {
  EncounterClass,
  EncounterPriority,
  EncounterStatus,
} from '@/modules/clinical/types/encounter';

export const ENCOUNTER_STATUS_TONE: Record<`${EncounterStatus}`, BadgeTone> = {
  planned: 'sky',
  arrived: 'cyan',
  triaged: 'amber',
  'in-progress': 'violet',
  onleave: 'orange',
  finished: 'emerald',
  cancelled: 'rose',
  'entered-in-error': 'red',
  unknown: 'slate',
};

/** FHIR v3 ActEncounterCode: each setting of care gets its own colour. */
export const ENCOUNTER_CLASS_TONE: Record<`${EncounterClass}`, BadgeTone> = {
  AMB: 'blue',
  EMER: 'red',
  FLD: 'teal',
  HH: 'green',
  IMP: 'indigo',
  ACUTE: 'fuchsia',
  NONAC: 'purple',
  OBSENC: 'amber',
  PRENC: 'sky',
  SS: 'cyan',
  VR: 'violet',
};

export const ENCOUNTER_PRIORITY_TONE: Record<`${EncounterPriority}`, BadgeTone> = {
  stat: 'red',
  asap: 'orange',
  urgent: 'amber',
  routine: 'blue',
  elective: 'teal',
};

export const encounterStatusTone = (status: string | null | undefined): BadgeTone =>
  toneOf(ENCOUNTER_STATUS_TONE, status);
export const encounterClassTone = (encounterClass: string | null | undefined): BadgeTone =>
  toneOf(ENCOUNTER_CLASS_TONE, encounterClass);
export const encounterPriorityTone = (priority: string | null | undefined): BadgeTone =>
  toneOf(ENCOUNTER_PRIORITY_TONE, priority);
