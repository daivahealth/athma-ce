export enum PolicyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export interface Policy {
  id: string;
  tenantId: string;
  patientId: string;
  policyNumber: string;
  groupNumber?: string | null;
  payerName: string;
  payerId: string;
  relationship?: string | null;
  effectiveDate?: string | null;
  expirationDate?: string | null;
  benefits?: Record<string, any> | null;
  isPrimary: boolean;
  status: PolicyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePolicyInput {
  patientId: string;
  policyNumber: string;
  groupNumber?: string;
  payerName: string;
  payerId: string;
  relationship?: string;
  effectiveDate?: string;
  expirationDate?: string;
  benefits?: Record<string, any>;
  isPrimary?: boolean;
  status?: PolicyStatus;
}
