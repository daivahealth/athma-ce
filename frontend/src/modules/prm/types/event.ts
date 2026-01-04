export type PatientGender = 'M' | 'F' | 'O' | 'U';

export interface IngestEventInput {
  patient_id: string;
  patient_display_name?: string;
  patient_gender?: PatientGender;
  patient_dob?: string;
  patient_age_years_at_event?: number;
  patient_ref?: string;
  patient_mobile_masked?: string;
  source_system: string;
  source_module: string;
  event_type: string;
  event_subtype?: string;
  severity?: 0 | 1 | 2;
  occurred_at: string;
  entity_type: string;
  entity_id: string;
  payload: Record<string, unknown>;
  correlation_id?: string;
  dedupe_key: string;
}

export interface EventResponse {
  event_id: string;
  duplicate: boolean;
  rules_evaluated: number;
  jobs_created: number;
}
