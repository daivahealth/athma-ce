export enum FeeScheduleType {
  AUTHORITY = 'authority',
  TENANT = 'tenant',
  CONTRACT = 'contract',
}

export enum FeeScheduleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  EXPIRED = 'expired',
}

export enum AuthorityCode {
  DHA = 'DHA',
  DOH = 'DOH',
  MOHAP = 'MOHAP',
  HAAD = 'HAAD',
}

export enum FeeScheduleCodeType {
  INTERNAL = 'INTERNAL',
  CPT = 'CPT',
  DHA = 'DHA',
  DOH = 'DOH',
  HAAD = 'HAAD',
  MOHAP = 'MOHAP',
  LOINC = 'LOINC',
  ICD10 = 'ICD10',
  CUSTOM = 'CUSTOM',
}

export interface FeeSchedule {
  id: string;
  tenantId?: string | null;
  scheduleName: string;
  scheduleType: FeeScheduleType;
  authorityCode?: AuthorityCode | null;
  version?: string | null;
  effectiveFrom: string;
  effectiveTo?: string | null;
  status: FeeScheduleStatus;
  baseFeeScheduleId?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  baseFeeSchedule?: FeeSchedule | null;
}

export interface FeeScheduleFilters {
  scheduleType?: FeeScheduleType;
  status?: FeeScheduleStatus;
  authorityCode?: AuthorityCode;
}

export interface CreateFeeScheduleInput {
  scheduleName: string;
  scheduleType: FeeScheduleType;
  authorityCode?: AuthorityCode;
  version?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status?: FeeScheduleStatus;
  baseFeeScheduleId?: string;
  metadata?: Record<string, any>;
}

export type UpdateFeeScheduleInput = Partial<CreateFeeScheduleInput>;

export interface FeeScheduleItem {
  id: string;
  feeScheduleId: string;
  billingItemId?: string | null;
  code: string;
  codeType: FeeScheduleCodeType;
  baseAmount: number;
  currency: string;
  unit?: string | null;
  multiplier?: number | null;
  discountPct?: number | null;
  maxAllowedAmount?: number | null;
  serviceGroup?: string | null;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeeScheduleItemInput {
  feeScheduleId: string;
  billingItemId?: string;
  code: string;
  codeType: FeeScheduleCodeType;
  baseAmount: number;
  currency?: string;
  unit?: string;
  multiplier?: number;
  discountPct?: number;
  maxAllowedAmount?: number;
  serviceGroup?: string;
  priority?: number;
}

export type UpdateFeeScheduleItemInput = Partial<CreateFeeScheduleItemInput>;

export interface FeeScheduleItemFilters {
  code?: string;
  codeType?: FeeScheduleCodeType;
  serviceGroup?: string;
}

export interface PriceLookupInput {
  code: string;
  codeType: FeeScheduleCodeType;
  scheduleType?: FeeScheduleType;
  feeScheduleId?: string;
  effectiveDate?: string;
  patientId?: string;
  encounterId?: string;
}

export interface PriceLookupResult {
  price?: number | null;
  currency?: string;
  code: string;
  codeType: FeeScheduleCodeType;
  message?: string;
}
