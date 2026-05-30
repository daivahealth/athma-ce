// ========================================
// ENUMS
// ========================================

export enum ReportStatus {
  DRAFT = 'DRAFT',
  PRELIMINARY = 'PRELIMINARY',
  FINAL = 'FINAL',
  AMENDED = 'AMENDED',
  CORRECTED = 'CORRECTED',
  CANCELLED = 'CANCELLED',
}

export type ReportType = 'lab' | 'pathology' | 'imaging' | 'procedure';

// ========================================
// LAB REPORT TYPES
// ========================================

export interface LabResultItem {
  id: string;
  tenantId: string;
  labReportId: string;
  sortOrder: number;
  testCode: string;
  codeSystem: string;
  testName: string;
  testNameAr?: string | null;
  valueNumeric?: number | null;
  valueString?: string | null;
  valueCode?: string | null;
  unit?: string | null;
  refRangeLow?: number | null;
  refRangeHigh?: number | null;
  refRangeText?: string | null;
  interpretation?: string | null;
  abnormalFlag: boolean;
  criticalFlag: boolean;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LabReport {
  id: string;
  tenantId: string;
  orderId: string;
  encounterId: string;
  patientId: string;
  reportStatus: ReportStatus;
  version: number;
  previousVersionId?: string | null;
  specimenType?: string | null;
  collectionDate?: string | null;
  receivedDate?: string | null;
  reportedBy?: string | null;
  verifiedBy?: string | null;
  reportedAt?: string | null;
  verifiedAt?: string | null;
  comments?: string | null;
  internalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: LabResultItem[];
}

export interface CreateLabReportInput {
  orderId: string;
  specimenType?: string;
  collectionDate?: string;
  receivedDate?: string;
  comments?: string;
  internalNotes?: string;
}

export interface UpdateLabReportInput {
  specimenType?: string;
  collectionDate?: string;
  receivedDate?: string;
  comments?: string;
  internalNotes?: string;
}

export interface LabResultItemInput {
  id?: string;
  testCode: string;
  codeSystem?: string;
  testName: string;
  testNameAr?: string;
  valueNumeric?: number;
  valueString?: string;
  valueCode?: string;
  unit?: string;
  refRangeLow?: number;
  refRangeHigh?: number;
  refRangeText?: string;
  interpretation?: string;
  abnormalFlag?: boolean;
  criticalFlag?: boolean;
  comment?: string;
  sortOrder?: number;
}

// ========================================
// PATHOLOGY REPORT TYPES
// ========================================

export interface PathologyReport {
  id: string;
  tenantId: string;
  orderId: string;
  encounterId: string;
  patientId: string;
  reportStatus: ReportStatus;
  version: number;
  previousVersionId?: string | null;
  specimenType?: string | null;
  collectionDate?: string | null;
  receivedDate?: string | null;
  clinicalHistory?: string | null;
  specimenReceived?: string | null;
  grossDescription?: string | null;
  microscopicDescription?: string | null;
  diagnosis?: string | null;
  comment?: string | null;
  internalNotes?: string | null;
  reportedBy?: string | null;
  verifiedBy?: string | null;
  reportedAt?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePathologyReportInput {
  orderId: string;
  specimenType?: string;
  collectionDate?: string;
  receivedDate?: string;
}

export interface UpdatePathologyReportInput {
  specimenType?: string;
  collectionDate?: string;
  receivedDate?: string;
  clinicalHistory?: string;
  specimenReceived?: string;
  grossDescription?: string;
  microscopicDescription?: string;
  diagnosis?: string;
  comment?: string;
  internalNotes?: string;
}

// ========================================
// IMAGING REPORT TYPES
// ========================================

export interface ImagingReport {
  id: string;
  tenantId: string;
  orderId: string;
  encounterId: string;
  patientId: string;
  reportStatus: ReportStatus;
  version: number;
  previousVersionId?: string | null;
  modality?: string | null;
  bodyPart?: string | null;
  technique?: string | null;
  comparison?: string | null;
  findings?: string | null;
  impression?: string | null;
  recommendations?: string | null;
  criticalFinding: boolean;
  criticalFindingNotifiedTo?: string | null;
  criticalFindingNotifiedAt?: string | null;
  criticalFindingAcknowledgedAt?: string | null;
  reportContent?: Record<string, unknown> | null;
  accessionNumber?: string | null;
  studyInstanceUid?: string | null;
  reportedBy?: string | null;
  reviewedBy?: string | null;
  reportedAt?: string | null;
  reviewedAt?: string | null;
  comments?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImagingReportInput {
  orderId: string;
  modality?: string;
  bodyPart?: string;
  accessionNumber?: string;
  studyInstanceUid?: string;
}

export interface UpdateImagingReportInput {
  technique?: string;
  comparison?: string;
  findings?: string;
  impression?: string;
  recommendations?: string;
  criticalFinding?: boolean;
  comments?: string;
  accessionNumber?: string;
  studyInstanceUid?: string;
  reportContent?: Record<string, unknown>;
}

// ========================================
// PROCEDURE REPORT TYPES
// ========================================

export interface ProcedureReport {
  id: string;
  tenantId: string;
  orderId: string;
  encounterId: string;
  patientId: string;
  reportStatus: ReportStatus;
  version: number;
  previousVersionId?: string | null;
  indication?: string | null;
  procedureDescription?: string | null;
  findings?: string | null;
  complications?: string | null;
  specimens?: Array<{ type: string; sentTo?: string; label?: string }> | null;
  postProcedureInstructions?: string | null;
  anesthesiaType?: string | null;
  anesthesiaProvider?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  durationMinutes?: number | null;
  primaryPerformer?: string | null;
  assistants: string[];
  estimatedBloodLoss?: string | null;
  implantsUsed?: Array<{ name: string; manufacturer?: string; lot?: string }> | null;
  reportContent?: Record<string, unknown> | null;
  reportedBy?: string | null;
  reportedAt?: string | null;
  comments?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProcedureReportInput {
  orderId: string;
  indication?: string;
}

export interface UpdateProcedureReportInput {
  indication?: string;
  procedureDescription?: string;
  findings?: string;
  complications?: string;
  specimens?: Array<{ type: string; sentTo?: string; label?: string }>;
  postProcedureInstructions?: string;
  anesthesiaType?: string;
  anesthesiaProvider?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  primaryPerformer?: string;
  assistants?: string[];
  estimatedBloodLoss?: string;
  implantsUsed?: Array<{ name: string; manufacturer?: string; lot?: string }>;
  comments?: string;
  reportContent?: Record<string, unknown>;
}

// ========================================
// SHARED TYPES
// ========================================

export interface ReportStatusTransitionInput {
  status: ReportStatus;
  reason?: string;
}

export interface AmendReportInput {
  reason: string;
}

export interface ReportStatusHistoryEntry {
  id: string;
  reportType: ReportType;
  reportId: string;
  fromStatus?: string | null;
  toStatus: string;
  changedBy: string;
  changedAt: string;
  reason?: string | null;
  version: number;
}

// ========================================
// AGGREGATED PATIENT RESULT TYPES
// ========================================

export interface PatientResult {
  id: string;
  reportType: ReportType;
  orderId: string;
  orderName: string;
  orderNameAr?: string | null;
  patientId: string;
  patientName: string;
  encounterId: string;
  reportStatus: string;
  reportedAt: string | null;
  version: number;
  createdAt: string;
  labSummary?: {
    itemCount: number;
    abnormalCount: number;
    criticalCount: number;
    specimenType?: string | null;
    specimenNumber?: string | null;
    reportStyle?: string | null;
    labDiscipline?: string | null;
  };
  imagingSummary?: {
    modality?: string | null;
    bodyPart?: string | null;
    impression?: string | null;
    criticalFinding: boolean;
  };
  procedureSummary?: {
    procedureDescription?: string | null;
    complications?: string | null;
    durationMinutes?: number | null;
  };
}

export interface PatientResultsResponse {
  results: PatientResult[];
  total: number;
}

export interface ReportableOrder {
  id: string;
  orderName: string;
  orderNameAr: string | null;
  patientId: string;
  patientName: string;
  encounterId: string;
  status: string;
  orderedAt: string;
}
