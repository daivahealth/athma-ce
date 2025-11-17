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
  ASAP = 'asap',
}

export enum OrderStatus {
  ORDERED = 'ordered',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ResultStatus {
  PRELIMINARY = 'preliminary',
  FINAL = 'final',
  CORRECTED = 'corrected',
  AMENDED = 'amended',
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

export interface ClinicalNoteSection {
  id?: string;
  sectionCode: string;
  sectionName: string;
  content: Record<string, any>;
  sortOrder?: number;
  isEmpty?: boolean;
}

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
  sections?: ClinicalNoteSection[];
}

export interface CreateClinicalNoteInput {
  encounterId: string;
  patientId: string;
  noteType: NoteType;
  language?: NoteLanguage;
  title?: string;
  authorStaffId: string;
  coSignStaffId?: string;
  sections?: Omit<ClinicalNoteSection, 'id'>[];
}

export interface UpdateClinicalNoteInput {
  title?: string;
  status?: NoteStatus;
  coSignStaffId?: string;
  amendmentReason?: string;
}

export interface UpdateNoteSectionsInput {
  sections: Omit<ClinicalNoteSection, 'id'>[];
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
  instructions?: string;
  instructionsAr?: string;
  clinicalInfo?: string;
  resultStatus?: ResultStatus;
  resultData?: Record<string, any>;
  resultBy?: string;
  resultAt?: Date | string;
  cancelReason?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateClinicalOrderInput {
  encounterId: string;
  patientId: string;
  orderType: OrderType;
  orderCode: string;
  codeSystem: string;
  orderName: string;
  orderNameAr?: string;
  priority: OrderPriority;
  orderedBy: string;
  scheduledFor?: string;
  instructions?: string;
  instructionsAr?: string;
  clinicalInfo?: string;
}

export interface UpdateClinicalOrderInput {
  status?: OrderStatus;
  scheduledFor?: string;
  instructions?: string;
  instructionsAr?: string;
  clinicalInfo?: string;
  cancelReason?: string;
}

export interface AddOrderResultInput {
  resultStatus: ResultStatus;
  resultData: Record<string, any>;
  resultBy: string;
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
