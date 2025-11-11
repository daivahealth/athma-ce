export interface TriageVitalSigns {
  temperature?: number;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  heartRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  height?: number;
  heightUnit?: 'cm' | 'in';
  bmi?: number;
  bloodGlucose?: number;
  bloodGlucoseUnit?: 'mg/dL' | 'mmol/L';
  headCircumference?: number;
}

export interface TriageAllergy {
  allergen: string;
  reaction?: string;
  severity?: string;
}

export interface TriageMedication {
  name: string;
  dosage?: string;
  frequency?: string;
}

export interface TriageRecord {
  id: string;
  tenantId: string;
  encounterId: string;
  patientId: string;
  triageStaffId: string;
  triageLevel: number;
  chiefComplaintsAndHPI: string;
  vitalSigns?: TriageVitalSigns | null;
  painScore?: number | null;
  allergies?: TriageAllergy[] | null;
  currentMedications?: TriageMedication[] | null;
  triageNotes?: string | null;
  triageTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTriageInput {
  encounterId: string;
  patientId: string;
  triageStaffId: string;
  triageLevel: number;
  chiefComplaintsAndHPI: string;
  vitalSigns?: TriageVitalSigns;
  painScore?: number;
  allergies?: TriageAllergy[];
  currentMedications?: TriageMedication[];
  triageNotes?: string;
}

export type UpdateTriageInput = Partial<
  Omit<CreateTriageInput, 'encounterId' | 'patientId'>
>;

// Triage level labels and colors
export const TRIAGE_LEVELS = {
  1: { label: 'Critical', color: 'red', description: 'Immediate - Life threatening' },
  2: { label: 'Emergency', color: 'orange', description: 'Very urgent - 15 minutes' },
  3: { label: 'Urgent', color: 'yellow', description: 'Urgent - 30 minutes' },
  4: { label: 'Semi-Urgent', color: 'green', description: 'Less urgent - 60 minutes' },
  5: { label: 'Non-Urgent', color: 'blue', description: 'Non-urgent - 120 minutes' },
} as const;

export type TriageLevel = keyof typeof TRIAGE_LEVELS;
