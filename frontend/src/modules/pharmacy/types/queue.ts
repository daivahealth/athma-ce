export interface PharmacyQueueItem {
  prescriptionOrderId: string;
  patientId: string;
  encounterId: string;
  mrn?: string | null;
  patientDisplayName?: string | null;
  encounterType: string;
  encounterNumber?: string | null;
  drugCode: string;
  drugName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration?: string | null;
  quantity: number;
  instructions?: string | null;
  prescribedBy?: string | null;
  prescribedAt: string;
  prescriptionStatus: string;
  dispensingId?: string | null;
  dispensingNumber?: string | null;
  dispensingStatus: string;
  wardId?: string | null;
  wardName?: string | null;
  bedNumber?: string | null;
}

export interface PharmacyQueueFilters {
  encounterType?: string;
  wardId?: string;
  facilityId?: string;
  search?: string;
}
