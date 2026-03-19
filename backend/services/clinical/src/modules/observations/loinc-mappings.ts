/**
 * LOINC code mappings for clinical observations.
 * Maps internal vital sign keys and common lab/imaging results to standard LOINC codes.
 */

export interface LoincMapping {
  code: string;
  codeSystem: 'LOINC';
  displayName: string;
  displayNameAr?: string;
  category: 'vital-signs' | 'laboratory' | 'imaging' | 'exam' | 'score';
  defaultUnit: string;
  refRangeLow?: number;
  refRangeHigh?: number;
}

/**
 * Maps triage vitalSigns JSON keys to LOINC observation codes.
 * Keys match the field names in CreateTriageDto.vitalSigns.
 */
export const VITAL_SIGN_MAPPINGS: Record<string, LoincMapping> = {
  heartRate: {
    code: '8867-4',
    codeSystem: 'LOINC',
    displayName: 'Heart Rate',
    displayNameAr: 'معدل ضربات القلب',
    category: 'vital-signs',
    defaultUnit: 'bpm',
    refRangeLow: 60,
    refRangeHigh: 100,
  },
  systolicBP: {
    code: '8480-6',
    codeSystem: 'LOINC',
    displayName: 'Systolic Blood Pressure',
    displayNameAr: 'ضغط الدم الانقباضي',
    category: 'vital-signs',
    defaultUnit: 'mmHg',
    refRangeLow: 90,
    refRangeHigh: 140,
  },
  diastolicBP: {
    code: '8462-4',
    codeSystem: 'LOINC',
    displayName: 'Diastolic Blood Pressure',
    displayNameAr: 'ضغط الدم الانبساطي',
    category: 'vital-signs',
    defaultUnit: 'mmHg',
    refRangeLow: 60,
    refRangeHigh: 90,
  },
  temperature: {
    code: '8310-5',
    codeSystem: 'LOINC',
    displayName: 'Body Temperature',
    displayNameAr: 'درجة حرارة الجسم',
    category: 'vital-signs',
    defaultUnit: '°C',
    refRangeLow: 36.1,
    refRangeHigh: 37.2,
  },
  respiratoryRate: {
    code: '9279-1',
    codeSystem: 'LOINC',
    displayName: 'Respiratory Rate',
    displayNameAr: 'معدل التنفس',
    category: 'vital-signs',
    defaultUnit: '/min',
    refRangeLow: 12,
    refRangeHigh: 20,
  },
  oxygenSaturation: {
    code: '2708-6',
    codeSystem: 'LOINC',
    displayName: 'Oxygen Saturation (SpO2)',
    displayNameAr: 'تشبع الأكسجين',
    category: 'vital-signs',
    defaultUnit: '%',
    refRangeLow: 95,
    refRangeHigh: 100,
  },
  weight: {
    code: '29463-7',
    codeSystem: 'LOINC',
    displayName: 'Body Weight',
    displayNameAr: 'وزن الجسم',
    category: 'vital-signs',
    defaultUnit: 'kg',
  },
  height: {
    code: '8302-2',
    codeSystem: 'LOINC',
    displayName: 'Body Height',
    displayNameAr: 'طول الجسم',
    category: 'vital-signs',
    defaultUnit: 'cm',
  },
  bmi: {
    code: '39156-5',
    codeSystem: 'LOINC',
    displayName: 'Body Mass Index (BMI)',
    displayNameAr: 'مؤشر كتلة الجسم',
    category: 'vital-signs',
    defaultUnit: 'kg/m2',
    refRangeLow: 18.5,
    refRangeHigh: 24.9,
  },
  bloodGlucose: {
    code: '2345-7',
    codeSystem: 'LOINC',
    displayName: 'Blood Glucose',
    displayNameAr: 'سكر الدم',
    category: 'vital-signs',
    defaultUnit: 'mg/dL',
    refRangeLow: 70,
    refRangeHigh: 100,
  },
  headCircumference: {
    code: '9843-4',
    codeSystem: 'LOINC',
    displayName: 'Head Circumference',
    displayNameAr: 'محيط الرأس',
    category: 'vital-signs',
    defaultUnit: 'cm',
  },
};

/**
 * Common lab result LOINC codes.
 * Used for mapping order resultData JSON keys to observations.
 */
export const LAB_RESULT_MAPPINGS: Record<string, LoincMapping> = {
  hemoglobin: {
    code: '718-7',
    codeSystem: 'LOINC',
    displayName: 'Hemoglobin',
    displayNameAr: 'الهيموغلوبين',
    category: 'laboratory',
    defaultUnit: 'g/dL',
    refRangeLow: 12.0,
    refRangeHigh: 17.5,
  },
  wbc: {
    code: '6690-2',
    codeSystem: 'LOINC',
    displayName: 'White Blood Cell Count',
    displayNameAr: 'عدد كريات الدم البيضاء',
    category: 'laboratory',
    defaultUnit: '10^3/uL',
    refRangeLow: 4.5,
    refRangeHigh: 11.0,
  },
  rbc: {
    code: '789-8',
    codeSystem: 'LOINC',
    displayName: 'Red Blood Cell Count',
    displayNameAr: 'عدد كريات الدم الحمراء',
    category: 'laboratory',
    defaultUnit: '10^6/uL',
    refRangeLow: 4.5,
    refRangeHigh: 5.5,
  },
  platelets: {
    code: '777-3',
    codeSystem: 'LOINC',
    displayName: 'Platelet Count',
    displayNameAr: 'عدد الصفائح الدموية',
    category: 'laboratory',
    defaultUnit: '10^3/uL',
    refRangeLow: 150,
    refRangeHigh: 400,
  },
  creatinine: {
    code: '2160-0',
    codeSystem: 'LOINC',
    displayName: 'Creatinine',
    displayNameAr: 'الكرياتينين',
    category: 'laboratory',
    defaultUnit: 'mg/dL',
    refRangeLow: 0.7,
    refRangeHigh: 1.3,
  },
  bun: {
    code: '3094-0',
    codeSystem: 'LOINC',
    displayName: 'Blood Urea Nitrogen',
    displayNameAr: 'نيتروجين اليوريا في الدم',
    category: 'laboratory',
    defaultUnit: 'mg/dL',
    refRangeLow: 7,
    refRangeHigh: 20,
  },
  sodium: {
    code: '2951-2',
    codeSystem: 'LOINC',
    displayName: 'Sodium',
    displayNameAr: 'الصوديوم',
    category: 'laboratory',
    defaultUnit: 'mmol/L',
    refRangeLow: 136,
    refRangeHigh: 145,
  },
  potassium: {
    code: '2823-3',
    codeSystem: 'LOINC',
    displayName: 'Potassium',
    displayNameAr: 'البوتاسيوم',
    category: 'laboratory',
    defaultUnit: 'mmol/L',
    refRangeLow: 3.5,
    refRangeHigh: 5.0,
  },
  glucose: {
    code: '2345-7',
    codeSystem: 'LOINC',
    displayName: 'Glucose',
    displayNameAr: 'الجلوكوز',
    category: 'laboratory',
    defaultUnit: 'mg/dL',
    refRangeLow: 70,
    refRangeHigh: 100,
  },
  hba1c: {
    code: '4548-4',
    codeSystem: 'LOINC',
    displayName: 'Hemoglobin A1c',
    displayNameAr: 'الهيموغلوبين السكري',
    category: 'laboratory',
    defaultUnit: '%',
    refRangeLow: 4.0,
    refRangeHigh: 5.6,
  },
  totalCholesterol: {
    code: '2093-3',
    codeSystem: 'LOINC',
    displayName: 'Total Cholesterol',
    displayNameAr: 'الكوليسترول الكلي',
    category: 'laboratory',
    defaultUnit: 'mg/dL',
    refRangeHigh: 200,
  },
  ldl: {
    code: '2089-1',
    codeSystem: 'LOINC',
    displayName: 'LDL Cholesterol',
    displayNameAr: 'الكوليسترول الضار',
    category: 'laboratory',
    defaultUnit: 'mg/dL',
    refRangeHigh: 100,
  },
  hdl: {
    code: '2085-9',
    codeSystem: 'LOINC',
    displayName: 'HDL Cholesterol',
    displayNameAr: 'الكوليسترول النافع',
    category: 'laboratory',
    defaultUnit: 'mg/dL',
    refRangeLow: 40,
  },
  triglycerides: {
    code: '2571-8',
    codeSystem: 'LOINC',
    displayName: 'Triglycerides',
    displayNameAr: 'الدهون الثلاثية',
    category: 'laboratory',
    defaultUnit: 'mg/dL',
    refRangeHigh: 150,
  },
  alt: {
    code: '1742-6',
    codeSystem: 'LOINC',
    displayName: 'ALT (Alanine Aminotransferase)',
    displayNameAr: 'ناقلة أمين الألانين',
    category: 'laboratory',
    defaultUnit: 'U/L',
    refRangeHigh: 35,
  },
  ast: {
    code: '1920-8',
    codeSystem: 'LOINC',
    displayName: 'AST (Aspartate Aminotransferase)',
    displayNameAr: 'ناقلة أمين الأسبارتات',
    category: 'laboratory',
    defaultUnit: 'U/L',
    refRangeHigh: 35,
  },
  tsh: {
    code: '3016-3',
    codeSystem: 'LOINC',
    displayName: 'Thyroid Stimulating Hormone',
    displayNameAr: 'هرمون تنشيط الغدة الدرقية',
    category: 'laboratory',
    defaultUnit: 'mIU/L',
    refRangeLow: 0.4,
    refRangeHigh: 4.0,
  },
};

/**
 * Common imaging result LOINC codes.
 */
export const IMAGING_RESULT_MAPPINGS: Record<string, LoincMapping> = {
  ejectionFraction: {
    code: '10230-1',
    codeSystem: 'LOINC',
    displayName: 'Ejection Fraction',
    displayNameAr: 'الكسر القذفي',
    category: 'imaging',
    defaultUnit: '%',
    refRangeLow: 55,
    refRangeHigh: 70,
  },
  lvInternalDiameterDiastole: {
    code: '29430-6',
    codeSystem: 'LOINC',
    displayName: 'LV Internal Diameter (Diastole)',
    displayNameAr: 'القطر الداخلي للبطين الأيسر (الانبساط)',
    category: 'imaging',
    defaultUnit: 'cm',
    refRangeLow: 3.5,
    refRangeHigh: 5.7,
  },
  lvInternalDiameterSystole: {
    code: '29438-9',
    codeSystem: 'LOINC',
    displayName: 'LV Internal Diameter (Systole)',
    displayNameAr: 'القطر الداخلي للبطين الأيسر (الانقباض)',
    category: 'imaging',
    defaultUnit: 'cm',
    refRangeLow: 2.0,
    refRangeHigh: 4.0,
  },
};

/**
 * All mappings combined for easy lookup by result key name.
 */
export const ALL_OBSERVATION_MAPPINGS: Record<string, LoincMapping> = {
  ...VITAL_SIGN_MAPPINGS,
  ...LAB_RESULT_MAPPINGS,
  ...IMAGING_RESULT_MAPPINGS,
};

/**
 * Determine interpretation based on value vs reference range.
 */
export function interpretValue(
  value: number,
  refRangeLow?: number,
  refRangeHigh?: number,
): string | null {
  if (refRangeLow == null && refRangeHigh == null) return null;

  if (refRangeLow != null && value < refRangeLow) {
    // Critical low: more than 20% below low range
    if (value < refRangeLow * 0.8) return 'critical_low';
    return 'low';
  }
  if (refRangeHigh != null && value > refRangeHigh) {
    // Critical high: more than 20% above high range
    if (value > refRangeHigh * 1.2) return 'critical_high';
    return 'high';
  }
  return 'normal';
}

/**
 * Unit conversion helpers for normalizing triage values before storage.
 */
export function convertToCelsius(fahrenheit: number): number {
  return Number(((fahrenheit - 32) * (5 / 9)).toFixed(1));
}

export function convertToKg(lbs: number): number {
  return Number((lbs * 0.453592).toFixed(1));
}

export function convertToCm(inches: number): number {
  return Number((inches * 2.54).toFixed(1));
}

export function convertToMgDl(mmolL: number): number {
  return Number((mmolL * 18.0182).toFixed(1));
}
