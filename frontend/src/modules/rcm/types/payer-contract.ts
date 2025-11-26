export enum ContractType {
  FEE_FOR_SERVICE = 'fee_for_service',
  CAPITATION = 'capitation',
  BUNDLED = 'bundled',
  VALUE_BASED = 'value_based',
}

export enum ReimbursementMethod {
  PERCENTAGE_OF_TARIFF = 'percentage_of_tariff',
  FIXED_RATE = 'fixed_rate',
  PERCENTAGE_OF_CHARGES = 'percentage_of_charges',
  PER_DIEM = 'per_diem',
  CASE_RATE = 'case_rate',
}

export enum ContractStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  DRAFT = 'draft',
  SUSPENDED = 'suspended',
}

export enum AuthorityCode {
  DHA = 'DHA',
  DOH = 'DOH',
  MOHAP = 'MOHAP',
  HAAD = 'HAAD',
}

export interface PayerContract {
  id: string;
  tenantId: string;
  payerId: string;
  contractName: string;
  contractNumber?: string | null;
  authorityCode?: AuthorityCode | null;
  baseFeeScheduleId?: string | null;
  planCode?: string | null;
  networkType?: string | null;
  lineOfBusiness?: string | null;
  contractType: ContractType;
  reimbursementMethod: ReimbursementMethod;
  effectiveFrom: string;
  effectiveTo?: string | null;
  status: ContractStatus;
  defaultMultiplier?: number | null;
  defaultDiscountPct?: number | null;
  defaultMaxAllowedAmount?: number | null;
  terms?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface PayerContractFilters {
  payerId?: string;
  status?: ContractStatus;
  contractType?: ContractType;
  authorityCode?: AuthorityCode;
  planCode?: string;
  networkType?: string;
  effectiveDate?: string;
}

export interface CreatePayerContractInput {
  payerId: string;
  contractName: string;
  contractNumber?: string;
  authorityCode?: AuthorityCode;
  baseFeeScheduleId?: string;
  planCode?: string;
  networkType?: string;
  lineOfBusiness?: string;
  contractType?: ContractType;
  reimbursementMethod?: ReimbursementMethod;
  effectiveFrom: string;
  effectiveTo?: string;
  status?: ContractStatus;
  defaultMultiplier?: number;
  defaultDiscountPct?: number;
  defaultMaxAllowedAmount?: number;
  terms?: Record<string, any>;
  metadata?: Record<string, any>;
}

export type UpdatePayerContractInput = Partial<CreatePayerContractInput>;

export interface PayerContractAdjustment {
  id: string;
  contractId: string;
  serviceGroup?: string | null;
  billingItemId?: string | null;
  feeScheduleItemId?: string | null;
  multiplier?: number | null;
  discountPct?: number | null;
  maxAllowedAmount?: number | null;
  minAllowedAmount?: number | null;
  priority: number;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  isExclusion: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayerContractAdjustmentInput {
  contractId: string;
  serviceGroup?: string;
  billingItemId?: string;
  feeScheduleItemId?: string;
  multiplier?: number;
  discountPct?: number;
  maxAllowedAmount?: number;
  minAllowedAmount?: number;
  priority?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
  isExclusion?: boolean;
  notes?: string;
}

export type UpdatePayerContractAdjustmentInput = Partial<CreatePayerContractAdjustmentInput>;

export interface PayerContractAdjustmentFilters {
  serviceGroup?: string;
  billingItemId?: string;
  feeScheduleItemId?: string;
  effectiveDate?: string;
  includeExclusions?: boolean;
}

export interface ContractPriceCalculationInput {
  contractId?: string;
  payerId?: string;
  billingCode: string;
  codeType: string;
  quantity?: number;
  serviceGroup?: string;
  encounterId?: string;
}

export interface ContractPriceCalculationResult {
  contractId?: string;
  baseAmount?: number;
  finalAmount?: number;
  adjustmentsApplied?: Array<{ id: string; notes?: string | null }>;
  message?: string;
}
