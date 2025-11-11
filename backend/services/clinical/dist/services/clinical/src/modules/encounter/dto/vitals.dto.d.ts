/**
 * DTO for updating vital signs
 */
export declare class UpdateVitalsDto {
    temperature?: number;
    temperatureUnit?: 'celsius' | 'fahrenheit';
    systolicBP?: number;
    diastolicBP?: number;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    weightUnit?: 'kg' | 'lbs';
    height?: number;
    heightUnit?: 'cm' | 'in';
    bmi?: number;
    painScale?: number;
    bloodGlucose?: number;
    bloodGlucoseUnit?: 'mg/dL' | 'mmol/L';
    headCircumference?: number;
    notes?: string;
    recordedAt?: string;
    recordedBy?: string;
}
/**
 * Response DTO for vitals
 */
export declare class VitalsResponseDto {
    temperature?: number;
    temperatureUnit?: string;
    systolicBP?: number;
    diastolicBP?: number;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    weightUnit?: string;
    height?: number;
    heightUnit?: string;
    bmi?: number;
    painScale?: number;
    bloodGlucose?: number;
    bloodGlucoseUnit?: string;
    headCircumference?: number;
    notes?: string;
    recordedAt?: Date | string;
    recordedBy?: string;
}
//# sourceMappingURL=vitals.dto.d.ts.map