import type { PatientDisplay } from './invoice';

export type PreAuthStatus =
  | 'draft'
  | 'pending'
  | 'submitted'
  | 'approved'
  | 'partially_approved'
  | 'denied'
  | 'cancelled'
  | 'expired';

export type PreAuthUrgency = 'routine' | 'urgent' | 'emergency';

export interface PreAuthService {
  procedureCode: string;
  procedureCodeType?: string;
  description?: string;
  quantity?: number;
  estimatedCost?: number;
  diagnosisCodes?: string[];
}

export interface PreAuthRequest {
  id: string;
  internalRef: string;
  status: PreAuthStatus;
  patientId: string;
  payerId: string;
  policyId?: string | null;
  encounterId?: string | null;
  urgency?: PreAuthUrgency | null;
  requestedServices?: PreAuthService[];
  clinicalNotes?: string | null;
  authorizationNumber?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  denialReason?: string | null;
  createdAt?: string;
  patientDisplay?: PatientDisplay | null;
}

export interface CreatePreAuthInput {
  patientId: string;
  payerId: string;
  policyId?: string;
  encounterId?: string;
  urgency?: PreAuthUrgency;
  requestedServices: PreAuthService[];
  clinicalNotes?: string;
}

export interface UpdatePreAuthInput {
  status?: PreAuthStatus;
  authorizationNumber?: string;
  approvedServices?: Array<{
    procedureCode: string;
    approvedQuantity: number;
    approvedAmount?: number;
  }>;
  denialReason?: string;
  validFrom?: string;
  validTo?: string;
}

export interface PreAuthFilters {
  patientId?: string;
  payerId?: string;
  encounterId?: string;
  status?: PreAuthStatus;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface PreAuthListResponse {
  requests: PreAuthRequest[];
  total: number;
}
