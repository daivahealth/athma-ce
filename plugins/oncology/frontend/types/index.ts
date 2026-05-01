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
