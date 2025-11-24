export enum ItemType {
  LAB = 'lab',
  IMAGING = 'imaging',
  PROCEDURE = 'procedure',
  CONSULT = 'consult',
  REGISTRATION = 'registration',
  PHARMACY = 'pharmacy',
  PACKAGE = 'package',
  MISC = 'misc',
}

export enum BillingCodeType {
  INTERNAL = 'INTERNAL',
  CPT = 'CPT',
  DHA = 'DHA',
  DOH = 'DOH',
  HAAD = 'HAAD',
  MOHAP = 'MOHAP',
  LOINC = 'LOINC',
  CUSTOM = 'CUSTOM',
}

export enum ChargeType {
  REGISTRATION = 'registration',
  CONSULTATION = 'consultation',
  LAB = 'lab',
  RADIOLOGY = 'radiology',
  PROCEDURE = 'procedure',
  PHARMACY = 'pharmacy',
  PACKAGE = 'package',
  MISC = 'misc',
}

export interface BillingItem {
  id: string;
  tenantId?: string | null;
  itemType: ItemType;
  clinicalRefId?: string | null;
  billingCode: string;
  billingCodeType: BillingCodeType;
  billingDescription: string;
  chargeType: ChargeType;
  defaultUnit: string;
  listPrice?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillingItemInput {
  tenantId?: string;
  itemType: ItemType;
  clinicalRefId?: string;
  billingCode: string;
  billingCodeType: BillingCodeType;
  billingDescription: string;
  chargeType: ChargeType;
  defaultUnit?: string;
  listPrice?: number;
  isActive?: boolean;
}

export type UpdateBillingItemInput = Partial<CreateBillingItemInput>;

export interface BillingItemFilters {
  itemType?: ItemType;
  chargeType?: ChargeType;
  billingCodeType?: BillingCodeType;
  isActive?: boolean;
  includeGlobal?: boolean;
}

export interface BillingItemStatistics {
  total: number;
  active: number;
  inactive: number;
  byItemType: Record<string, number>;
  byChargeType: Record<string, number>;
}
