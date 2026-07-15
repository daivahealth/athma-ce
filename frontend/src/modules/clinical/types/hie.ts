// Types for consent-driven Health Information Exchange (HIE) external-record
// fetch. Region/network-agnostic — see ADR-0012.

export type HieConsentDerivedStatus =
  | 'granted'
  | 'expiring'
  | 'expired'
  | 'revoked'
  | 'inactive';

export interface HieConsentRequest {
  id: string;
  patientId: string;
  consentType: string;
  consentStatus: string;
  isActive: boolean;
  purpose: string;
  effectiveFrom: string;
  effectiveUntil?: string | null;
  derivedStatus: HieConsentDerivedStatus;
  createdAt: string;
  updatedAt: string;
}

export type HieFetchJobStatus = 'pending' | 'fetching' | 'completed' | 'failed';

export interface HieFetchSummaryRecord {
  externalId: string;
  recordType: string;
  title: string;
  sourceSystem: string;
}

export interface HieFetchSummary {
  provider: string;
  recordsReturned: number;
  documentsCreated: number;
  records: HieFetchSummaryRecord[];
}

export interface HieFetchJob {
  id: string;
  patientId: string;
  consentId?: string | null;
  provider: string;
  patientReference?: string | null;
  recordTypes: string[];
  status: HieFetchJobStatus;
  attempts: number;
  recordsFetched: number;
  documentIds: string[];
  summary?: HieFetchSummary | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  canRetry: boolean;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHieConsentRequestInput {
  patientId: string;
  purpose?: string;
  patientReference?: string;
}

export interface FetchExternalRecordsInput {
  patientId: string;
  recordTypes?: string[];
  patientReference?: string;
  simulateFailure?: boolean;
}
