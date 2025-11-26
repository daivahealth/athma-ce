export enum CodingSessionStatus {
  NEW = 'new',
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  RETURNED = 'returned',
  COMPLETED = 'completed',
  SUBMITTED = 'submitted',
}

export interface CodingSession {
  id: string;
  tenantId: string;
  encounterId: string;
  patientId: string;
  coderId?: string | null;
  status: CodingSessionStatus | string;
  priority?: string | null;
  queue?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  diagnoses?: CodingDiagnosis[];
  procedures?: CodingProcedure[];
}

export interface CodingSessionFilters {
  status?: CodingSessionStatus | string;
  coderId?: string;
  patientId?: string;
  encounterId?: string;
  queue?: string;
}

export interface CodingDiagnosis {
  id: string;
  sessionId: string;
  code: string;
  codeSystem: string;
  description?: string | null;
  clinicalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  isPrimary: boolean;
}

export interface CodingProcedure {
  id: string;
  sessionId: string;
  code: string;
  codeSystem: string;
  description?: string | null;
  modifier?: string | null;
  units?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CodingAuditEntry {
  id: string;
  sessionId: string;
  action: string;
  actorId?: string | null;
  actorName?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface CoderProductivityStats {
  coderId: string;
  coderName?: string;
  sessionsCompleted: number;
  diagnosesCoded: number;
  proceduresCoded: number;
  averageTurnaroundMinutes?: number;
}

export interface CodingSessionSummaryStats {
  total: number;
  byStatus: Record<string, number>;
}

export interface CreateDiagnosisInput {
  code: string;
  codeSystem: string;
  description?: string;
  clinicalNotes?: string;
  isPrimary?: boolean;
}

export type UpdateDiagnosisInput = Partial<CreateDiagnosisInput>;

export interface CreateProcedureInput {
  code: string;
  codeSystem: string;
  description?: string;
  modifier?: string;
  units?: number;
}

export type UpdateProcedureInput = Partial<CreateProcedureInput>;

export interface UpdateCodingSessionInput {
  priority?: string;
  queue?: string;
  notes?: string;
}
