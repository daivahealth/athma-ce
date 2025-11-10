export declare enum DiagnosisType {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    RULE_OUT = "rule_out",
    DIFFERENTIAL = "differential"
}
export declare class CreateDiagnosisDto {
    encounterId: string;
    patientId: string;
    icdCode: string;
    icdVersion?: string;
    diagnosisName: string;
    diagnosisNameAr?: string;
    diagnosisType: DiagnosisType;
    diagnosisRank?: number;
    isPresentOnAdmission?: boolean;
    isChronic?: boolean;
    onsetDate?: string;
    clinicalNotes?: string;
    diagnosedBy: string;
}
export declare class UpdateDiagnosisDto {
    diagnosisType?: DiagnosisType;
    diagnosisRank?: number;
    isPresentOnAdmission?: boolean;
    isChronic?: boolean;
    onsetDate?: string;
    clinicalNotes?: string;
}
export declare class DiagnosisResponseDto {
    id: string;
    tenantId: string;
    encounterId: string;
    patientId: string;
    icdCode: string;
    icdVersion: string;
    diagnosisName: string;
    diagnosisNameAr?: string;
    diagnosisType: DiagnosisType;
    diagnosisRank?: number;
    isPresentOnAdmission: boolean;
    isChronic: boolean;
    onsetDate?: Date;
    clinicalNotes?: string;
    diagnosedBy: string;
    diagnosedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=diagnosis.dto.d.ts.map