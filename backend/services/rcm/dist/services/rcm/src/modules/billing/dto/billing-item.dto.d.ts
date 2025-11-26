export declare enum ItemType {
    LAB = "lab",
    IMAGING = "imaging",
    PROCEDURE = "procedure",
    CONSULT = "consult",
    REGISTRATION = "registration",
    PHARMACY = "pharmacy",
    PACKAGE = "package",
    MISC = "misc"
}
export declare enum BillingCodeType {
    INTERNAL = "INTERNAL",
    CPT = "CPT",
    DHA = "DHA",
    DOH = "DOH",
    HAAD = "HAAD",
    MOHAP = "MOHAP",
    LOINC = "LOINC",
    CUSTOM = "CUSTOM"
}
export declare enum ChargeType {
    REGISTRATION = "registration",
    CONSULTATION = "consultation",
    LAB = "lab",
    RADIOLOGY = "radiology",
    PROCEDURE = "procedure",
    PHARMACY = "pharmacy",
    PACKAGE = "package",
    MISC = "misc"
}
export declare class CreateBillingItemDto {
    tenantId?: string;
    itemType: ItemType;
    clinicalRefId?: string;
    billingCode: string;
    billingCodeType: BillingCodeType;
    billingDescription: string;
    chargeType: ChargeType;
    defaultUnit?: string;
    listPrice?: number;
    isActive?: boolean;
}
declare const UpdateBillingItemDto_base: import("@nestjs/common").Type<Partial<CreateBillingItemDto>>;
export declare class UpdateBillingItemDto extends UpdateBillingItemDto_base {
}
export interface BillingItemResponseDto {
    id: string;
    tenantId?: string | null;
    itemType: ItemType;
    clinicalRefId?: string | null;
    billingCode: string;
    billingCodeType: BillingCodeType;
    billingDescription: string;
    chargeType: ChargeType;
    defaultUnit: string;
    listPrice?: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=billing-item.dto.d.ts.map