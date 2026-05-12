export type TreatmentIntent = 'curative' | 'adjuvant' | 'neoadjuvant' | 'palliative' | 'surveillance' | 'supportive';
export type OncologySubspecialty = 'medical_oncology' | 'surgical_oncology' | 'radiation_oncology' | 'hemato_oncology' | 'gynec_oncology';
export type TreatmentModality = 'surgery' | 'chemotherapy' | 'radiation' | 'immunotherapy' | 'hormonal' | 'targeted' | 'palliative' | 'surveillance';
export type ClinicalStatus = 'active' | 'remission' | 'recurrence' | 'relapsed' | 'resolved';
export type MetastaticStatus = 'localized' | 'regional' | 'distant' | 'unknown';
export type VerificationStatus = 'provisional' | 'differential' | 'confirmed' | 'refuted';
export type CarePlanStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'revised';

export interface OncologyPatientDisplay {
  patientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  displayName: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  phoneNumber?: string;
  email?: string;
  nationalId?: string;
  nationalIdType?: string;
  nationality?: string;
  preferredLanguage?: string;
}

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
  patientDisplay?: OncologyPatientDisplay;
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
  patientDisplay?: OncologyPatientDisplay;
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
  patientDisplay?: OncologyPatientDisplay;
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

export interface LabPrerequisite {
  test: string;
  parameter: string;
  minValue?: number;
  unit: string;
  timing: string;
}

export interface HydrationOrder {
  fluid: string;
  ratePerHour: number;
  durationHours: number;
  timing: 'pre' | 'concurrent' | 'post';
}

export interface DrugPreparationDetail {
  drug: string;
  preparedBy: string;
  preparedAt: string;
  lotNumber?: string;
  expiryDate?: string;
  diluent?: string;
  finalVolumeMl?: number;
  finalConcentration?: string;
}

export interface NurseVerificationChecklist {
  patientIdentityConfirmed: boolean;
  drugMatchesProtocol: boolean;
  doseMatchesOrder: boolean;
  routeCorrect: boolean;
  timeCorrect: boolean;
  expiryChecked: boolean;
  allergyConfirmed: boolean;
  infusionLinePatent: boolean;
  patientEducated: boolean;
}

export interface AdverseReaction {
  drug: string;
  ctcaeGrade: 1 | 2 | 3 | 4 | 5;
  type: string;
  onsetTime: string;
  description: string;
}

export interface AdministrationDetail {
  drug: string;
  startedAt: string;
  completedAt?: string;
  ratePerHour?: number;
  accessSite?: string;
}

export interface RegimenItem {
  drug: string;
  dose: number;
  unit: string;
  route: string;
  day: number | number[];
  doseFormula: 'bsa' | 'weight' | 'fixed';
  infusionDurationMin?: number;
  diluent?: string;
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
  dose_formula: 'bsa' | 'weight' | 'fixed';
  lab_prerequisites: LabPrerequisite[];
  hydration: HydrationOrder[];
  is_active: boolean;
  created_at: string;
}

export interface ChemoOrder {
  id: string;
  tenant_id: string;
  patient_id: string;
  encounter_id?: string;
  protocol_id: string;
  protocol_name?: string;
  protocol_code?: string;
  protocol_regimen?: RegimenItem[];
  protocol_emetogenic_risk?: string;
  protocol_total_cycles?: number;
  protocol_cycle_duration_days?: number;
  protocol_dose_formula?: string;
  protocol_lab_prerequisites?: LabPrerequisite[];
  protocol_hydration?: HydrationOrder[];
  cancer_diagnosis_id?: string;
  oncology_care_plan_id?: string;
  cancer_type?: string;
  primary_site?: string;
  ordering_provider: string;
  cycle_number: number;
  day_number: number;
  scheduled_date: string;
  administered_at?: string;
  bsa?: number;
  weight?: number;
  height?: number;
  creatinine_clearance?: number;
  hepatic_adjustment_grade?: string;
  renal_adjustment_grade?: string;
  dose_adjustments: DoseAdjustment[];
  pre_chemo_checklist: PreChemoChecklist;
  status: 'draft' | 'pending' | 'approved' | 'verified' | 'in_progress' | 'completed' | 'cancelled' | 'held';
  verified_by?: string;
  verified_at?: string;
  second_verified_by?: string;
  approved_by?: string;
  approved_at?: string;
  administered_by?: string;
  adverse_reactions: AdverseReaction[];
  administration_details: AdministrationDetail[];
  drug_preparation_details: DrugPreparationDetail[];
  nurse_verification_checklist: NurseVerificationChecklist;
  notes?: string;
  created_at: string;
  updated_at: string;
  patientDisplay?: OncologyPatientDisplay;
}

export interface DoseAdjustment {
  drug: string;
  adjustmentPercent: number;
  reason: string;
}

export interface PreChemoChecklist {
  consentDocumented?: boolean;
  consentDate?: string;
  allergiesReviewed?: boolean;
  allergiesSummary?: string;
  labsReviewed?: boolean;
  labsDate?: string;
  labsWithinRange?: boolean;
  bsaVerified?: boolean;
  doseVerified?: boolean;
  premedicationsOrdered?: boolean;
}

// ── Oncology Catalogs ──────────────────────────────────────────

export interface OncologyCancerType {
  id: string;
  tenant_id: string;
  code: string;
  name: string;
  category?: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OncologyPrimarySite {
  id: string;
  tenant_id: string;
  icdo_site_code: string;
  icdo_site_name: string;
  body_system?: string;
  laterality_applicable: boolean;
  mapping_type?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OncologyCancerTypeSiteMapping {
  id: string;
  tenant_id: string;
  cancer_type_id: string;
  primary_site_id: string;
  is_default: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  // joined fields
  cancer_type_code?: string;
  cancer_type_name?: string;
  icdo_site_code?: string;
  icdo_site_name?: string;
}

export interface OncologyHistology {
  id: string;
  tenant_id: string;
  morphology_code: string;
  morphology_name: string;
  behavior_code?: string;
  behavior_name?: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Radiation Oncology Types
// ============================================================

export type RadiationStatus = 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type FractionStatus = 'SCHEDULED' | 'DELIVERED' | 'MISSED' | 'CANCELLED' | 'RESCHEDULED';
export type PlanningStatus = 'NOT_STARTED' | 'CONTOURING' | 'DOSIMETRY' | 'QA' | 'READY_FOR_APPROVAL' | 'APPROVED';

export interface RadiationPrescription {
  id: string;
  tenant_id: string;
  patient_id: string;
  encounter_id: string;
  cancer_profile_id?: string;
  prescription_number?: string;
  treatment_intent?: string;
  treatment_site_id?: string;
  laterality?: string;
  modality?: string;
  technique?: string;
  total_dose_gy?: number;
  dose_per_fraction_gy?: number;
  planned_fractions?: number;
  concurrent_chemo: boolean;
  planned_start_date?: string;
  planned_end_date?: string;
  prescription_notes?: string;
  prescribed_by?: string;
  prescribed_at?: string;
  status: RadiationStatus;
  created_at: string;
  updated_at: string;
  patientDisplay?: OncologyPatientDisplay;
  simulations?: RadiationSimulation[];
  treatment_plans?: RadiationTreatmentPlan[];
  reviews?: RadiationOnTreatmentReview[];
  completion_summary?: RadiationCompletionSummary;
}

export interface RadiationSimulation {
  id: string;
  tenant_id: string;
  prescription_id: string;
  simulation_date?: string;
  patient_position?: string;
  immobilization_device?: string;
  contrast_used: boolean;
  scan_region?: string;
  setup_reference?: string;
  tattoo_marking_done: boolean;
  simulation_notes?: string;
  performed_by?: string;
  status: string;
  created_at: string;
  updated_at: string;
  treatment_plans?: RadiationTreatmentPlan[];
}

export interface RadiationTreatmentPlan {
  id: string;
  tenant_id: string;
  prescription_id: string;
  simulation_id?: string;
  external_plan_reference?: string;
  planning_system?: string;
  planning_status?: PlanningStatus;
  planner_id?: string;
  physicist_id?: string;
  radiation_oncologist_id?: string;
  contouring_completed: boolean;
  physics_qa_completed: boolean;
  treatment_machine?: string;
  plan_notes?: string;
  approved_by?: string;
  approved_at?: string;
  status: string;
  created_at: string;
  updated_at: string;
  fractions?: RadiationFraction[];
  prescription?: RadiationPrescription;
}

export interface RadiationFraction {
  id: string;
  tenant_id: string;
  treatment_plan_id: string;
  fraction_number: number;
  planned_date?: string;
  actual_date?: string;
  planned_dose_gy?: number;
  delivered_dose_gy?: number;
  treatment_machine?: string;
  radiation_therapist_id?: string;
  status: FractionStatus;
  interruption_reason?: string;
  verification_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface RadiationOnTreatmentReview {
  id: string;
  tenant_id: string;
  prescription_id: string;
  review_date: string;
  week_number?: number;
  toxicity_grade?: string;
  pain_score?: number;
  weight_kg?: number;
  treatment_break_required: boolean;
  review_notes?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface RadiationCompletionSummary {
  id: string;
  tenant_id: string;
  prescription_id: string;
  completion_date?: string;
  planned_total_dose_gy?: number;
  delivered_total_dose_gy?: number;
  planned_fractions?: number;
  delivered_fractions?: number;
  interruptions: boolean;
  interruption_notes?: string;
  acute_toxicity_summary?: string;
  response_assessment_plan?: string;
  followup_plan?: string;
  completed_by?: string;
  created_at: string;
  updated_at: string;
}
