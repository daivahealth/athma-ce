export type DenialStatus = 'open' | 'appealing' | 'upheld' | 'overturned';

export type AppealStatus = 'draft' | 'filed' | 'accepted' | 'rejected';

export interface AppealSupportingRef {
  type: string;
  ref: string;
  description?: string;
}

export interface Appeal {
  id: string;
  denialId: string;
  status: AppealStatus;
  narrative: string;
  justification?: string | null;
  supportingRefs?: AppealSupportingRef[];
  filedAt?: string | null;
  outcome?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Denial {
  id: string;
  claimId: string;
  denialCode: string;
  denialReason: string;
  remarkCodes?: string[] | null;
  deniedAmount: number;
  currency: string;
  status: DenialStatus;
  deniedAt: string;
  appealDeadline?: string | null;
  createdAt?: string;
  updatedAt?: string;
  appeals?: Appeal[];
  claim?: {
    id: string;
    claimNumber: string;
    encounterId?: string | null;
    patientId: string;
    status: string;
  };
}

export interface CreateDenialInput {
  claimId: string;
  denialCode: string;
  denialReason: string;
  deniedAmount: number;
  currency?: string;
  remarkCodes?: string[];
  deniedAt?: string;
  appealDeadline?: string;
  status?: DenialStatus;
}

export interface CreateAppealInput {
  narrative: string;
  justification?: string;
  supportingRefs?: AppealSupportingRef[];
}

export interface FileAppealInput {
  narrative?: string;
  justification?: string;
  supportingRefs?: AppealSupportingRef[];
}

export interface DenialFilters {
  claimId?: string;
  encounterId?: string;
  patientId?: string;
  status?: DenialStatus;
  limit?: number;
  offset?: number;
}

export interface DenialListResponse {
  denials: Denial[];
  total: number;
}
