/**
 * Clinical Observation types
 * Matches the backend ClinicalObservation model (vital-signs / laboratory, LOINC/SNOMED-coded).
 */

export interface ClinicalObservation {
  id: string;
  patientId: string;
  encounterId?: string | null;
  code: string;
  codeSystem: string;
  displayName: string;
  category: string; // vital-signs, laboratory, imaging, exam, score
  valueNumeric?: number | null;
  valueString?: string | null;
  valueCode?: string | null;
  unit?: string | null;
  refRangeLow?: number | null;
  refRangeHigh?: number | null;
  observedAt: string; // ISO
}
