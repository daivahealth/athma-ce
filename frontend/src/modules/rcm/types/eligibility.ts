import type { PatientDisplay } from './invoice';

export type EligibilityRequestType = 'eligibility' | 'benefits';

export type EligibilityStatus = 'accepted' | 'rejected' | 'error';

export interface EligibilityRequest {
  id: string;
  patientId: string;
  payerId: string;
  policyId?: string | null;
  encounterId?: string | null;
  requestType?: EligibilityRequestType;
  serviceTypes?: string[];
  serviceDate?: string | null;
  status?: EligibilityStatus;
  createdAt?: string;
  benefitsSummary?: {
    copay?: number;
    coinsurance?: number;
    deductible?: number;
    deductibleMet?: number;
    outOfPocketMax?: number;
    outOfPocketMet?: number;
    coverageLevel?: string;
    planName?: string;
    networkStatus?: string;
  } | null;
  errors?: Array<{ code: string; message: string }>;
  patientDisplay?: PatientDisplay | null;
}

export interface CheckEligibilityInput {
  patientId: string;
  payerId: string;
  policyId?: string;
  encounterId?: string;
  requestType?: EligibilityRequestType;
  serviceTypes?: string[];
  serviceDate?: string;
}

export interface CheckEligibilityResponse {
  requestId: string;
  status: EligibilityStatus;
  isEligible?: boolean;
  eligibilityStart?: string;
  eligibilityEnd?: string;
  benefitsSummary?: EligibilityRequest['benefitsSummary'];
  errors?: Array<{ code: string; message: string }>;
}

export interface EligibilityFilters {
  patientId?: string;
  payerId?: string;
  status?: EligibilityStatus;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface EligibilityListResponse {
  requests: EligibilityRequest[];
  total: number;
}
