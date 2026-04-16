import type { PharmacyStock } from './stock';

export enum DispensingStatus {
  QUEUED = 'queued',
  VERIFIED = 'verified',
  DISPENSED = 'dispensed',
  PARTIALLY_DISPENSED = 'partially_dispensed',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

export enum DispensingChannel {
  OUTPATIENT_COUNTER = 'outpatient_counter',
  INPATIENT_WARD = 'inpatient_ward',
  INPATIENT_BEDSIDE = 'inpatient_bedside',
  EMERGENCY = 'emergency',
}

export interface PharmacyDispensingItem {
  id: string;
  tenantId: string;
  dispensingId: string;
  stockId: string;
  drugCode: string;
  drugName: string;
  dosageForm: string;
  strength?: string | null;
  batchNumber: string;
  expiryDate: string;
  quantityPrescribed: number;
  quantityDispensed: number;
  unit: string;
  dispensingInstructions?: string | null;
  unitPrice?: number | null;
  lineAmount?: number | null;
  isSubstituted: boolean;
  substitutionReason?: string | null;
  originalDrugCode?: string | null;
  createdAt: string;
  updatedAt: string;
  stock?: PharmacyStock;
}

export interface PharmacyDispensing {
  id: string;
  tenantId: string;
  dispensingNumber: string;
  patientId: string;
  encounterId: string;
  prescriptionOrderId: string;
  patientDisplayName?: string | null;
  mrn?: string | null;
  encounterType?: string | null;
  encounterNumber?: string | null;
  prescribedByName?: string | null;
  status: DispensingStatus;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  verificationNotes?: string | null;
  dispensedBy?: string | null;
  dispensedAt?: string | null;
  dispensingChannel: DispensingChannel;
  wardId?: string | null;
  wardName?: string | null;
  bedNumber?: string | null;
  dispatchedToWardAt?: string | null;
  wardReceivedBy?: string | null;
  wardReceivedAt?: string | null;
  counsellingProvided: boolean;
  counsellingNotes?: string | null;
  chargeId?: string | null;
  chargePosted: boolean;
  chargePostedAt?: string | null;
  cancelledBy?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  items?: PharmacyDispensingItem[];
}

export interface CreateDispensingInput {
  prescriptionOrderId: string;
  encounterId: string;
  patientId: string;
  dispensingChannel?: DispensingChannel;
}

export interface VerifyDispensingInput {
  verificationNotes?: string;
}

export interface DispenseItemInput {
  stockId: string;
  quantityDispensed: number;
  dispensingInstructions?: string;
  isSubstituted?: boolean;
  substitutionReason?: string;
  originalDrugCode?: string;
}

export interface ExecuteDispenseInput {
  items: DispenseItemInput[];
  counsellingProvided?: boolean;
  counsellingNotes?: string;
}

export interface DispatchToWardInput {
  wardId: string;
  wardName: string;
  bedNumber?: string;
}

export interface CancelDispensingInput {
  reason: string;
}

export interface ReturnItemInput {
  stockId: string;
  quantityReturned: number;
  reason: string;
}

export interface ReturnDispensingInput {
  items: ReturnItemInput[];
}

export interface DispensingFilters {
  patientId?: string;
  encounterId?: string;
  status?: string;
  dispensingChannel?: string;
  dateFrom?: string;
  dateTo?: string;
}
