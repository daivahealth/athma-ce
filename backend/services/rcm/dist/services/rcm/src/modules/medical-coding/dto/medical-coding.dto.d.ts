/**
 * Coding session status values
 */
export declare enum CodingSessionStatus {
    AUTO_GENERATED = "auto_generated",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    SUBMITTED = "submitted"
}
/**
 * Diagnosis type values
 */
export declare enum DiagnosisType {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    ADMITTING = "admitting",
    DISCHARGE = "discharge"
}
/**
 * DTO for updating a coding diagnosis
 */
export declare class UpdateCodingDiagnosisDto {
    diagnosisCode?: string;
    diagnosisCodeType?: string;
    diagnosisDisplay?: string;
    diagnosisDisplayAr?: string;
    diagnosisType?: DiagnosisType;
    sequence?: number;
    usedForBilling?: boolean;
}
/**
 * DTO for updating a coding procedure
 */
export declare class UpdateCodingProcedureDto {
    procedureCode?: string;
    procedureCodeType?: string;
    procedureDisplay?: string;
    procedureDisplayAr?: string;
    units?: number;
    sequence?: number;
    serviceDate?: string;
    modifiers?: string;
}
/**
 * DTO for updating a coding session
 */
export declare class UpdateCodingSessionDto {
    status?: CodingSessionStatus;
    coderNotes?: string;
    diagnoses?: UpdateCodingDiagnosisDto[];
    procedures?: UpdateCodingProcedureDto[];
}
/**
 * DTO for submitting a coding session
 */
export declare class SubmitCodingSessionDto {
    coderNotes?: string;
    generateClaim?: boolean;
}
/**
 * DTO for querying coding sessions
 */
export declare class CodingSessionQueryDto {
    status?: CodingSessionStatus;
    encounterId?: string;
    patientId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
}
/**
 * DTO for adding a new diagnosis to a coding session
 */
export declare class CreateCodingDiagnosisDto {
    diagnosisCode: string;
    diagnosisCodeType: string;
    diagnosisDisplay: string;
    diagnosisDisplayAr?: string;
    diagnosisType: DiagnosisType;
    sequence: number;
    usedForBilling?: boolean;
}
/**
 * DTO for adding a new procedure to a coding session
 */
export declare class CreateCodingProcedureDto {
    billingItemId: string;
    procedureCode: string;
    procedureCodeType: string;
    procedureDisplay: string;
    procedureDisplayAr?: string;
    units: number;
    sequence: number;
    serviceDate: string;
    modifier1?: string;
    modifier2?: string;
    modifier3?: string;
}
//# sourceMappingURL=medical-coding.dto.d.ts.map