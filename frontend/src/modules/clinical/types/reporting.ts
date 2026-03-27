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

export type ReportType = 'lab' | 'imaging' | 'procedure';

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
