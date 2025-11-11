/**
 * Vitals types for encounter vital signs
 */

export interface Vitals {
  // Temperature
  temperature?: number;
  temperatureUnit?: 'celsius' | 'fahrenheit';

  // Blood Pressure
  systolicBP?: number;
  diastolicBP?: number;

  // Heart Rate
  heartRate?: number;

  // Respiratory Rate
  respiratoryRate?: number;

  // Oxygen Saturation
  oxygenSaturation?: number;

  // Weight
  weight?: number;
  weightUnit?: 'kg' | 'lbs';

  // Height
  height?: number;
  heightUnit?: 'cm' | 'in';

  // BMI
  bmi?: number;

  // Pain Scale
  painScale?: number;

  // Blood Glucose
  bloodGlucose?: number;
  bloodGlucoseUnit?: 'mg/dL' | 'mmol/L';

  // Head Circumference (pediatric)
  headCircumference?: number;

  // Notes
  notes?: string;

  // Metadata
  recordedAt?: string | Date;
  recordedBy?: string;
  lastUpdatedAt?: string | Date;
}

export interface VitalsResponse {
  id: string;
  vitalSigns: Vitals;
}

export type UpdateVitalsInput = Partial<Vitals>;
