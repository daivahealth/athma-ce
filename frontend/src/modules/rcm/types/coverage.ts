import type { Policy } from './policy';
import type { Payer } from './payer';

export enum FinancialClass {
  INSURANCE = 'insurance',
  CORPORATE = 'corporate',
  TPA = 'tpa',
  CASH = 'cash',
  GOVERNMENT = 'government',
}

export enum CoverageLevel {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  SELF_PAY = 'self_pay',
}

export interface EncounterCoverage {
  id: string;
  tenantId: string;
  encounterId: string;
  patientId: string;
  policyId?: string | null;
  payerId?: string | null;
  financialClass: FinancialClass;
  coverageLevel: CoverageLevel;
  planName?: string | null;
  memberId?: string | null;
  memberName?: string | null;
  networkName?: string | null;
  copayAmount?: number | null;
  coinsurancePct?: number | null;
  deductibleSnapshot?: Record<string, any> | null;
  benefitsSnapshot?: Record<string, any> | null;
  eligibilityRequestId?: string | null;
  preauthRequestId?: string | null;
  costEstimateId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  policy?: Policy | null;
  payer?: Payer | null;
}

export interface CreateEncounterCoverageInput {
  encounterId: string;
  patientId: string;
  policyId?: string;
  payerId?: string;
  financialClass: FinancialClass;
  coverageLevel?: CoverageLevel;
  planName?: string;
  memberId?: string;
  memberName?: string;
  networkName?: string;
  copayAmount?: number;
  coinsurancePct?: number;
  deductibleSnapshot?: Record<string, any>;
  benefitsSnapshot?: Record<string, any>;
  eligibilityRequestId?: string;
  preauthRequestId?: string;
  costEstimateId?: string;
  isActive?: boolean;
}
