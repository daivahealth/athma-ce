export type TreatmentIntent = 'curative' | 'adjuvant' | 'neoadjuvant' | 'palliative' | 'surveillance' | 'supportive';
export type OncologySubspecialty = 'medical_oncology' | 'surgical_oncology' | 'radiation_oncology' | 'hemato_oncology' | 'gynec_oncology';
export type TreatmentModality = 'surgery' | 'chemotherapy' | 'radiation' | 'immunotherapy' | 'hormonal' | 'targeted' | 'palliative' | 'surveillance';
export type ClinicalStatus = 'active' | 'remission' | 'recurrence' | 'relapsed' | 'resolved';
export type MetastaticStatus = 'localized' | 'regional' | 'distant' | 'unknown';
export type VerificationStatus = 'provisional' | 'differential' | 'confirmed' | 'refuted';
export type CarePlanStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'revised';

export interface CancerDiagnosis {
  id: string;
  tenant_id: string;
  patient_id: string;
  encounter_id?: string;
  encounter_diagnosis_id?: string;
  cancer_type: string;
  primary_site: string;
  primary_site_code?: string;
  laterality?: string;
  histology_morphology?: string;
  morphology_code?: string;
  icd_code?: string;
  snomed_code?: string;
  diagnosis_date: string;
  clinical_status: ClinicalStatus;
  verification_status: VerificationStatus;
  grade?: string;
  metastatic_status: MetastaticStatus;
  is_recurrence: boolean;
  biomarkers: Record<string, unknown>;
  ecog_at_diagnosis?: number;
  diagnosed_by: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  latest_stage?: string;
  latest_staging_system?: string;
  care_plan_status?: string;
  stagings?: TumorStaging[];
  care_plans?: OncologyCarePlan[];
}

export interface TumorStaging {
  id: string;
  tenant_id: string;
  cancer_diagnosis_id: string;
  patient_id: string;
  encounter_id?: string;
  provider_id?: string;
  staging_system: string;
  staging_edition?: string;
  staging_type: string;
  stage_group?: string;
  t_category?: string;
  n_category?: string;
  m_category?: string;
  body_site?: string;
  grade?: string;
  histology?: string;
  staging_date: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  cancer_type?: string;
  primary_site?: string;
}

export interface TumorBoardCase {
  id: string;
  tenant_id: string;
  patient_id: string;
  cancer_diagnosis_id: string;
  staging_id?: string;
  meeting_date: string;
  presented_by: string;
  attendees: TumorBoardAttendee[];
  clinical_summary?: string;
  imaging_findings?: string;
  pathology_report?: string;
  molecular_profile?: string;
  mdt_recommendation?: string;
  treatment_intent?: string;
  recommended_pathway: PlannedModality[];
  treatment_plan: Record<string, unknown>;
  decision?: string;
  review_outcome?: string;
  follow_up_actions: unknown[];
  status: 'scheduled' | 'in_review' | 'completed' | 'deferred';
  created_at: string;
  updated_at: string;
  cancer_type?: string;
  primary_site?: string;
}

export interface TumorBoardAttendee {
  staffId: string;
  role: string;
  specialty: string;
}

export interface PlannedModality {
  modality: TreatmentModality;
  sequence: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  details?: string;
  startDate?: string;
  endDate?: string;
  responsibleSubspecialty?: OncologySubspecialty;
  // Per-modality schedule (cycles for systemic therapy, fractions for radiation)
  plannedCycles?: number;
  cycleDurationDays?: number;
  plannedFractions?: number;
  // Chemo protocol selected at planning time (chemotherapy modality only);
  // pre-populates the protocol when placing chemo orders against this plan
  protocolId?: string;
  protocolCode?: string;
  protocolName?: string;
}

export interface OncologyCarePlan {
  id: string;
  tenant_id: string;
  patient_id: string;
  cancer_diagnosis_id: string;
  tumor_board_case_id?: string;
  plan_number: string;
  version: number;
  parent_plan_id?: string;
  treatment_intent: TreatmentIntent;
  oncology_subspecialty?: OncologySubspecialty;
  planned_modalities: PlannedModality[];
  planned_cycles?: number;
  cycle_duration_days?: number;
  milestones: Array<{ name: string; targetDate: string; status: string; completedDate?: string; notes?: string }>;
  follow_up_schedule: Array<{ intervalWeeks: number; type: string; notes?: string }>;
  status: CarePlanStatus;
  start_date?: string;
  end_date?: string;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  cancer_type?: string;
  primary_site?: string;
}

export interface ChemoProtocol {
  id: string;
  tenant_id: string;
  code: string;
  name: string;
  description?: string;
  cancer_type: string;
  intent: 'curative' | 'palliative' | 'adjuvant' | 'neoadjuvant';
  regimen: RegimenItem[];
  /** Phase-based regimen (schema v2) — source of truth; `regimen` is derived. */
  phases: ProtocolPhase[];
  total_cycles: number;
  cycle_duration_days: number;
  premedications: string[];
  supportive_care: string[];
  emetogenic_risk?: string;
  is_active: boolean;
  created_at: string;
}

export interface RegimenItem {
  drug: string;
  dose: string;
  unit: string;
  route: string;
  day: number;
  cycle: string;
}

// ── Phase-based regimen (protocol schema v2) ────────────────────────────────
// Protocol → phases (sequential blocks of identical cycles) → drug lines.
// Per-cycle exceptions live on the drug line as sparse overrides, keyed by the
// cycle number *within the phase* so they survive edits to earlier phases.

/** Predefined dose reduction for a drug line (e.g. DL−1 = 80 mg/m²). */
export interface ProtocolDoseLevel {
  level: number; // −1, −2, −3
  dose: number; // same unit as the drug line
}

/** Exception to a drug line for specific cycles of its phase. */
export interface ProtocolDrugOverride {
  cycles: number[]; // phase-relative cycle numbers (1-based)
  dose?: number;
  unit?: string;
  days?: number[];
  omit?: boolean;
  note?: string;
}

export interface ProtocolPhaseDrug {
  id: string;
  drug: string;
  dose: number;
  unit: string;
  route: string;
  days: number[];
  /** 'auc' = Calvert (carboplatin); dose is the target AUC. */
  doseFormula: 'bsa' | 'weight' | 'fixed' | 'auc';
  infusionDurationMin?: number;
  diluent?: string;
  /** Absolute cap per administration in mg (e.g. vincristine 2 mg). */
  maxDose?: number;
  doseLevels?: ProtocolDoseLevel[];
  overrides?: ProtocolDrugOverride[];
}

export interface ProtocolPhase {
  id: string;
  name: string;
  cycles: number;
  cycleDurationDays: number;
  drugs: ProtocolPhaseDrug[];
  notes?: string;
}

export interface ChemoOrder {
  id: string;
  tenant_id: string;
  patient_id: string;
  encounter_id?: string;
  protocol_id: string;
  protocol_name?: string;
  protocol_code?: string;
  ordering_provider: string;
  cycle_number: number;
  day_number: number;
  scheduled_date: string;
  administered_at?: string;
  bsa?: number;
  weight?: number;
  height?: number;
  creatinine_clearance?: number;
  dose_adjustments: unknown[];
  pre_chemo_checklist: Record<string, unknown>;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'held';
  verified_by?: string;
  verified_at?: string;
  administered_by?: string;
  notes?: string;
  created_at: string;
}
