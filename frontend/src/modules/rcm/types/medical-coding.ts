/**
 * Mirrors the RCM service's `CodingSessionStatus`
 * (backend/services/rcm/src/modules/medical-coding/dto/medical-coding.dto.ts).
 * Sessions are created as `auto_generated`, move to `in_progress` when a coder
 * starts review, and to `completed` when submitted.
 */
export enum CodingSessionStatus {
  AUTO_GENERATED = 'auto_generated',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SUBMITTED = 'submitted',
}

export interface CodingSession {
  id: string;
  tenantId: string;
  encounterId: string;
  /** Resolved by RCM from the encounter in Clinical; null when the lookup failed. */
  patientId: string | null;
  patientDisplay?: {
    patientId: string;
    displayName: string;
    mrn: string;
    gender: string;
    age: number | null;
  } | null;
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
  /** Patient name, claim number, or exact session / encounter id (server-side). */
  search?: string;
  limit?: number;
  offset?: number;
}

/** GET /medical-coding/sessions: one page plus the total matching the filters. */
export interface CodingSessionListResponse {
  sessions: CodingSession[];
  total: number;
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
  /** auto_generated + in_progress */
  pending?: number;
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
