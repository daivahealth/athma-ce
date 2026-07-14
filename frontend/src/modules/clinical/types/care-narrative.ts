/**
 * Types for the AI Care Narrative (ai-gateway patient-narrative endpoint).
 */

export interface CareNarrativeRequest {
  /** Reading clinician specialty used to tune emphasis. Optional; inferred server-side if omitted. */
  specialty?: string;
}

export interface CareNarrativeAvailable {
  available: true;
  narrative: string;
  specialty: string;
  model: string;
  sourceCount: number;
  generatedAt: string;
}

export interface CareNarrativeUnavailable {
  available: false;
  reason: string;
}

export type CareNarrativeResult = CareNarrativeAvailable | CareNarrativeUnavailable;
