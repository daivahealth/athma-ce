/** One drug line inside a prescription */
export interface PrescriptionDrugItem {
  id: string;
  drugCode: string;
  codeSystem: string;
  drugName: string;
  drugNameAr?: string | null;
  genericName?: string | null;
  dosage: string;
  route: string;
  frequency: string;
  duration?: string | null;
  quantity?: string | null;
  refills: number;
  instructions?: string | null;
  instructionsAr?: string | null;
  status: string;
}

/** One pharmacy queue card = one Prescription header */
export interface PharmacyQueueItem {
  // Prescription identity
  prescriptionId: string;
  prescriptionNumber: string;
  version: number;
  parentId?: string | null;

  // Patient & encounter context
  patientId: string;
  encounterId?: string | null;
  mrn?: string | null;
  patientDisplayName?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  encounterType: string;
  encounterNumber?: string | null;

  // Prescription authorship
  prescribedBy?: string | null;
  prescribedAt: string;
  notes?: string | null;
  prescriptionStatus: string;

  // Drug line items
  items: PrescriptionDrugItem[];

  // Inpatient routing
  wardId?: string | null;
  wardName?: string | null;
  bedNumber?: string | null;

  // Dispensing state (from RCM)
  dispensingId?: string | null;
  dispensingNumber?: string | null;
  dispensingStatus: string;
}

export interface PharmacyQueueFilters {
  encounterType?: string;
  wardId?: string;
  facilityId?: string;
  search?: string;
}
