export declare enum PolicyStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    EXPIRED = "expired",
    CANCELLED = "cancelled"
}
export declare class CreatePolicyDto {
    patientId: string;
    policyNumber: string;
    groupNumber?: string;
    payerName: string;
    payerId: string;
    relationship?: string;
    effectiveDate?: string;
    expirationDate?: string;
    benefits?: Record<string, any>;
    isPrimary?: boolean;
    status?: PolicyStatus;
}
declare const UpdatePolicyDto_base: import("@nestjs/common").Type<Partial<CreatePolicyDto>>;
export declare class UpdatePolicyDto extends UpdatePolicyDto_base {
}
export interface PolicyResponseDto {
    id: string;
    tenantId: string;
    patientId: string;
    policyNumber: string;
    groupNumber?: string | null;
    payerName: string;
    payerId: string;
    relationship?: string | null;
    effectiveDate?: Date | null;
    expirationDate?: Date | null;
    benefits?: Record<string, any>;
    isPrimary: boolean;
    status: PolicyStatus;
    createdAt: Date;
    updatedAt: Date;
    payer?: any;
}
export {};
//# sourceMappingURL=policy.dto.d.ts.map