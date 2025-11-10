export declare enum PrescriptionStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    DISCONTINUED = "discontinued"
}
export declare enum DrugCodeSystem {
    NDC = "NDC",
    RXNORM = "RxNorm",
    LOCAL = "local"
}
export declare class CreatePrescriptionDto {
    encounterId: string;
    patientId: string;
    drugCode: string;
    codeSystem?: DrugCodeSystem;
    drugName: string;
    drugNameAr?: string;
    genericName?: string;
    dosage: string;
    route: string;
    frequency: string;
    duration?: string;
    quantity?: string;
    refills?: number;
    instructions?: string;
    instructionsAr?: string;
    prescribedBy: string;
}
export declare class UpdatePrescriptionDto {
    dosage?: string;
    frequency?: string;
    duration?: string;
    quantity?: string;
    refills?: number;
    instructions?: string;
    instructionsAr?: string;
    status?: PrescriptionStatus;
}
export declare class PrescriptionResponseDto {
    id: string;
    tenantId: string;
    encounterId: string;
    patientId: string;
    drugCode: string;
    codeSystem: DrugCodeSystem;
    drugName: string;
    drugNameAr?: string;
    genericName?: string;
    dosage: string;
    route: string;
    frequency: string;
    duration?: string;
    quantity?: string;
    refills: number;
    instructions?: string;
    instructionsAr?: string;
    status: PrescriptionStatus;
    prescribedBy: string;
    prescribedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=prescription.dto.d.ts.map