// ========================================
// ENUMS
// ========================================

export enum NoteType {
  SOAP = 'soap',
  H_AND_P = 'h_and_p',
  PROGRESS = 'progress',
  DISCHARGE = 'discharge',
  PROCEDURE = 'procedure',
  CONSULTATION = 'consultation',
}

export enum NoteStatus {
  DRAFT = 'draft',
  FINAL = 'final',
  AMENDED = 'amended',
  SIGNED = 'signed',
}

export enum NoteLanguage {
  EN = 'en',
  AR = 'ar',
}

export enum DiagnosisType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  RULE_OUT = 'rule_out',
  DIFFERENTIAL = 'differential',
}

export enum OrderType {
  LAB = 'lab',
  IMAGING = 'imaging',
  PROCEDURE = 'procedure',
}

export enum OrderPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  STAT = 'stat',
}

export enum OrderStatus {
  ORDERED = 'ordered',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ResultStatus {
  PENDING = 'pending',
  PRELIMINARY = 'preliminary',
  FINAL = 'final',
  AMENDED = 'amended',
}

export enum CodeSystem {
  LOINC = 'LOINC',
  CPT = 'CPT',
  SNOMED = 'SNOMED',
  LOCAL = 'LOCAL',
}

export enum PackageOrderStatus {
  ORDERED = 'ordered',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PrescriptionStatus {
  ACTIVE = 'active',
  DISCONTINUED = 'discontinued',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum DrugCodeSystem {
  NDC = 'NDC',
  RXNORM = 'RxNorm',
  LOCAL = 'local',
}

// ========================================
// CLINICAL NOTE TYPES
// ========================================

export interface ClinicalNote {
  id: string;
  tenantId: string;
  encounterId: string;
  patientId: string;
  noteType: NoteType;
  language: NoteLanguage;
  title?: string;
  status: NoteStatus;
  version: number;
  authorStaffId: string;
  coSignStaffId?: string;
  signedAt?: Date | string;
  coSignedAt?: Date | string;
  amendmentReason?: string;
  supersededBy?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  content?: Record<string, any>;
}

export interface CreateClinicalNoteInput {
  encounterId: string;
  patientId: string;
  noteType: NoteType;
  language?: NoteLanguage;
  title?: string;
  authorStaffId: string;
  coSignStaffId?: string;
  content?: Record<string, any>;
}

export interface UpdateClinicalNoteInput {
  title?: string;
  status?: NoteStatus;
  coSignStaffId?: string;
  amendmentReason?: string;
  content?: Record<string, any>;
}

export interface SignNoteInput {
  staffId: string;
  isCoSign?: boolean;
}

// ========================================
// DIAGNOSIS TYPES
// ========================================

export interface Diagnosis {
  id: string;
  tenantId: string;
  encounterId: string;
  patientId: string;
  icdCode: string;
  diagnosisName: string;
  diagnosisNameAr?: string;
  diagnosisType: DiagnosisType;
  diagnosisRank?: number;
  presentOnAdmission?: boolean;
  chronicCondition?: boolean;
  onsetDate?: Date | string;
  resolutionDate?: Date | string;
  diagnosedBy: string;
  verifiedBy?: string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateDiagnosisInput {
  encounterId: string;
  patientId: string;
  icdCode: string;
  diagnosisName: string;
  diagnosisNameAr?: string;
  diagnosisType: DiagnosisType;
  diagnosisRank?: number;
  presentOnAdmission?: boolean;
  chronicCondition?: boolean;
  onsetDate?: string;
  notes?: string;
  diagnosedBy: string;
}

export interface UpdateDiagnosisInput {
  diagnosisType?: DiagnosisType;
  diagnosisRank?: number;
  presentOnAdmission?: boolean;
  chronicCondition?: boolean;
  resolutionDate?: string;
  notes?: string;
  verifiedBy?: string;
}

// ========================================
// CLINICAL ORDER TYPES
// ========================================

export interface ClinicalOrder {
  id: string;
  tenantId: string;
  encounterId: string;
  patientId: string;
  orderType: OrderType;
  orderCode: string;
  codeSystem: string;
  orderName: string;
  orderNameAr?: string;
  priority: OrderPriority;
  status: OrderStatus;
  orderedBy: string;
  orderedAt: Date | string;
  scheduledFor?: Date | string;
  performedBy?: string;
  performedAt?: Date | string;
  specialInstructions?: string;
  clinicalIndication?: string;
  packageOrderId?: string;
  resultStatus?: ResultStatus;
  resultData?: Record<string, any>;
  resultNotes?: string;
  resultedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  labTests?: LabOrderTest[];
  imagingDetails?: ImagingOrderDetail[];
  procedureDetails?: ProcedureOrderDetail[];
}

export interface LabOrderTest {
  id?: string;
  labTestMasterId?: string;
  testCode: string;
  codeSystem?: CodeSystem | string;
  testName: string;
  loincCode?: string;
  cptCode?: string;
  specimenType?: string;
  collectionMethod?: string;
  fastingRequired?: boolean;
  fastingDurationHours?: number;
  quantity?: number;
  sortOrder?: number;
  notes?: string;
}

export interface ImagingOrderDetail {
  id?: string;
  imagingStudyMasterId?: string;
  studyCode: string;
  codeSystem?: CodeSystem | string;
  studyName: string;
  cptCode?: string;
  modality?: string;
  bodyPart?: string;
  contrastRequired?: boolean;
  contrastType?: string;
  preparationInstructions?: string;
  quantity?: number;
  sortOrder?: number;
  notes?: string;
}

export interface ProcedureOrderDetail {
  id?: string;
  procedureMasterId?: string;
  procedureCode: string;
  codeSystem?: CodeSystem | string;
  procedureName: string;
  cptCode?: string;
  icd10PcsCode?: string;
  procedureCategory?: string;
  bodySystem?: string;
  anesthesiaType?: string;
  facilityRequired?: string;
  estimatedDurationMinutes?: number;
  preparationInstructions?: string;
  consentRequired?: boolean;
  quantity?: number;
  sortOrder?: number;
  notes?: string;
}

export interface CreateClinicalOrderInput {
  encounterId: string;
  patientId: string;
  orderType: OrderType;
  orderCode: string;
  codeSystem: CodeSystem | string;
  orderName: string;
  orderNameAr?: string;
  priority: OrderPriority;
  orderedBy: string;
  specialInstructions?: string;
  clinicalIndication?: string;
  packageOrderId?: string;
  labTests?: LabOrderTest[];
  imagingDetails?: ImagingOrderDetail[];
  procedureDetails?: ProcedureOrderDetail[];
}

export interface UpdateClinicalOrderInput {
  status?: OrderStatus;
  specialInstructions?: string;
  clinicalIndication?: string;
}

export interface AddOrderResultInput {
  resultStatus: ResultStatus;
  resultData: Record<string, any>;
  resultNotes?: string;
  performedBy?: string;
  performedAt?: string;
}

export interface CreatePackageOrderInput {
  packageId: string;
  encounterId: string;
  patientId: string;
  priority?: OrderPriority;
  clinicalIndication?: string;
  specialInstructions?: string;
  notes?: string;
  orderedBy: string;
}

export interface PackageOrder {
  id: string;
  tenantId: string;
  packageId: string;
  packageCode?: string;
  packageName?: string;
  encounterId: string;
  patientId: string;
  status: PackageOrderStatus;
  notes?: string;
  orderedBy: string;
  orderedAt: Date | string;
  clinicalOrders: ClinicalOrder[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ChildTypeSummary {
  lab: number;
  imaging: number;
  procedure: number;
}

export interface ChartPackageOrder {
  id: string;
  packageId: string;
  packageCode: string;
  packageName: string;
  status: PackageOrderStatus;
  orderedBy: string;
  orderedAt: Date | string;
  childOrderCount: number;
  childTypeSummary: ChildTypeSummary;
  clinicalOrders: ClinicalOrder[];
}

export interface EncounterChartOrders {
  standaloneOrders: ClinicalOrder[];
  packageOrders: ChartPackageOrder[];
}

// ========================================
// PRESCRIPTION TYPES
// ========================================

export interface Prescription {
  id: string;
  tenantId: string;
  encounterId: string;
  patientId: string;
  drugCode: string;
  codeSystem: DrugCodeSystem;
  drugName: string;
  drugNameAr?: string;
  dosage: string;
  route: string;
  frequency: string;
  duration?: string;
  quantity?: number;
  refills?: number;
  status: PrescriptionStatus;
  prescribedBy: string;
  prescribedAt: Date | string;
  startDate?: Date | string;
  endDate?: Date | string;
  discontinuedAt?: Date | string;
  discontinuedBy?: string;
  discontinuedReason?: string;
  instructions?: string;
  instructionsAr?: string;
  indication?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreatePrescriptionInput {
  encounterId: string;
  patientId: string;
  drugCode: string;
  codeSystem?: DrugCodeSystem;
  drugName: string;
  drugNameAr?: string;
  dosage: string;
  route: string;
  frequency: string;
  duration?: string;
  quantity?: number;
  refills?: number;
  prescribedBy: string;
  prescribedByName?: string;
  startDate?: string;
  endDate?: string;
  instructions?: string;
  instructionsAr?: string;
  indication?: string;
}

export interface UpdatePrescriptionInput {
  dosage?: string;
  route?: string;
  frequency?: string;
  duration?: string;
  quantity?: number;
  refills?: number;
  startDate?: string;
  endDate?: string;
  instructions?: string;
  instructionsAr?: string;
  indication?: string;
}
