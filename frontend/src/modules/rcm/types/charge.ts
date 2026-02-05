import type { BillingItem } from './billing-item';

export enum ChargeStatus {
  UNBILLED = 'unbilled',
  INVOICED = 'invoiced',
  CANCELLED = 'cancelled',
}

export enum ChargeSourceType {
  ENCOUNTER = 'encounter',
  ORDER = 'order',
  MANUAL = 'manual',
}

export interface Charge {
  id: string;
  tenantId: string;
  patientId: string;
  encounterId?: string | null;
  billingItemId: string;
  chargeDate: string;
  quantity: number;
  unitPrice: number;
  grossAmount: number;
  patientResponsibility?: number | null;
  payerResponsibility?: number | null;
  status: ChargeStatus;
  sourceType?: ChargeSourceType | null;
  sourceId?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  billingItem?: BillingItem;
}

export interface CreateChargeInput {
  patientId: string;
  encounterId?: string;
  billingItemId: string;
  chargeDate?: string;
  quantity?: number;
  unitPrice: number;
  grossAmount: number;
  status?: ChargeStatus;
  sourceType?: ChargeSourceType;
  sourceId?: string;
  notes?: string;
}
