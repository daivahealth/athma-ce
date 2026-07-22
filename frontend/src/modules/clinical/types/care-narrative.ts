/**
 * Types for the AI Care Narrative (ai-gateway patient-narrative endpoint).
 */

export interface CareNarrativeRequest {
  /** Reading clinician specialty used to tune emphasis. Optional; inferred server-side if omitted. */
  specialty?: string;
  /** Bypass the server-side Redis cache and force a fresh LLM call. */
  forceRefresh?: boolean;
}

export interface CareNarrativeSection {
  title: string;
  bullets: string[];
}

export interface CareNarrativeAvailable {
  available: true;
  narrative: string;
  snapshot: string;
  sections: CareNarrativeSection[];
  /**
   * Short, non-prescriptive clinician-facing considerations generated in the
   * same call as the narrative. Intentionally not rendered on Care Context —
   * only the Patient AI+ page shows these.
   */
  recommendations: string[];
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
