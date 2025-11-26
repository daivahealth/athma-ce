export declare enum FinancialClass {
    INSURANCE = "insurance",
    CORPORATE = "corporate",
    TPA = "tpa",
    CASH = "cash",
    GOVERNMENT = "government"
}
export declare enum CoverageLevel {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    TERTIARY = "tertiary",
    SELF_PAY = "self_pay"
}
export declare class CreateEncounterCoverageDto {
    encounterId: string;
    patientId: string;
    policyId?: string;
    payerId?: string;
    financialClass: FinancialClass;
    coverageLevel?: CoverageLevel;
    planName?: string;
    memberId?: string;
    memberName?: string;
    networkName?: string;
    copayAmount?: number;
    coinsurancePct?: number;
    deductibleSnapshot?: Record<string, any>;
    benefitsSnapshot?: Record<string, any>;
    eligibilityRequestId?: string;
    preauthRequestId?: string;
    costEstimateId?: string;
    isActive?: boolean;
}
declare const UpdateEncounterCoverageDto_base: import("@nestjs/common").Type<Partial<CreateEncounterCoverageDto>>;
export declare class UpdateEncounterCoverageDto extends UpdateEncounterCoverageDto_base {
}
export interface EncounterCoverageResponseDto {
    id: string;
    tenantId: string;
    encounterId: string;
    patientId: string;
    policyId?: string | null;
    payerId?: string | null;
    financialClass: FinancialClass;
    coverageLevel: CoverageLevel;
    planName?: string | null;
    memberId?: string | null;
    memberName?: string | null;
    networkName?: string | null;
    copayAmount?: number | null;
    coinsurancePct?: number | null;
    deductibleSnapshot?: Record<string, any> | null;
    benefitsSnapshot?: Record<string, any> | null;
    eligibilityRequestId?: string | null;
    preauthRequestId?: string | null;
    costEstimateId?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    policy?: any;
    payer?: any;
}
export {};
//# sourceMappingURL=encounter-coverage.dto.d.ts.map