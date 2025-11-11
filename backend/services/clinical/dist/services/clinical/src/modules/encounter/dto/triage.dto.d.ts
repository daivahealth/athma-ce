/**
 * DTO for creating a new triage record
 */
export declare class CreateTriageDto {
    encounterId: string;
    patientId: string;
    triageStaffId: string;
    triageLevel: number;
    chiefComplaintsAndHPI: string;
    vitalSigns?: {
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
    };
    painScore?: number;
    allergies?: Array<{
        allergen: string;
        reaction?: string;
        severity?: string;
    }>;
    currentMedications?: Array<{
        name: string;
        dosage?: string;
        frequency?: string;
    }>;
    triageNotes?: string;
}
/**
 * DTO for updating an existing triage record
 */
export declare class UpdateTriageDto {
    triageStaffId?: string;
    triageLevel?: number;
    chiefComplaintsAndHPI?: string;
    vitalSigns?: {
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
    };
    painScore?: number;
    allergies?: Array<{
        allergen: string;
        reaction?: string;
        severity?: string;
    }>;
    currentMedications?: Array<{
        name: string;
        dosage?: string;
        frequency?: string;
    }>;
    triageNotes?: string;
}
/**
 * Response DTO for triage data
 */
export declare class TriageResponseDto {
    id: string;
    tenantId: string;
    encounterId: string;
    patientId: string;
    triageStaffId: string;
    triageLevel: number;
    chiefComplaintsAndHPI: string;
    vitalSigns?: any;
    painScore?: number;
    allergies?: any;
    currentMedications?: any;
    triageNotes?: string;
    triageTime: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=triage.dto.d.ts.map