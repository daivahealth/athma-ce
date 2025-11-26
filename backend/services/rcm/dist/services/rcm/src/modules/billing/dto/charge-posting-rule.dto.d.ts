export declare enum EventType {
    LAB_TEST_ORDERED = "lab_test_ordered",
    MEDICATION_DISPENSED = "medication_dispensed",
    PROCEDURE_PERFORMED = "procedure_performed",
    IMAGING_STUDY_ORDERED = "imaging_study_ordered",
    DAILY_BED_CHARGE = "daily_bed_charge",
    CONSULTATION_COMPLETED = "consultation_completed",
    CUSTOM = "custom"
}
export declare enum EventSource {
    ENCOUNTER = "encounter",
    ORDER = "order",
    PHARMACY = "pharmacy",
    SCHEDULER = "scheduler",
    CUSTOM = "custom"
}
export declare enum BillingItemType {
    LAB_TEST = "lab_test",
    MEDICATION = "medication",
    PROCEDURE = "procedure",
    IMAGING_STUDY = "imaging_study",
    BED_CHARGE = "bed_charge",
    CONSULTATION = "consultation",
    SUPPLIES = "supplies",
    CUSTOM = "custom"
}
export declare enum ChargeCalculationMethod {
    FIXED = "fixed",
    CATALOG_PRICE = "catalog_price",
    CUSTOM_FORMULA = "custom_formula",
    TIERED_PRICING = "tiered_pricing"
}
export declare enum PriceSource {
    CATALOG = "catalog",
    CUSTOM = "custom",
    EVENT_DATA = "event_data",
    EXTERNAL_API = "external_api"
}
export declare enum QuantitySource {
    EVENT = "event",
    FIXED = "fixed",
    CALCULATED = "calculated"
}
export declare class CreateChargePostingRuleDto {
    ruleName: string;
    eventType: EventType;
    eventSource: EventSource;
    billingItemType: BillingItemType;
    billingItemId?: string;
    conditions?: Record<string, any>;
    chargeCalculationMethod?: ChargeCalculationMethod;
    basePrice?: number;
    priceSource?: PriceSource;
    quantitySource?: QuantitySource;
    discountPercentage?: number;
    taxPercentage?: number;
    isActive?: boolean;
    priority?: number;
    autoApprove?: boolean;
    description?: string;
    configuration?: Record<string, any>;
}
declare const UpdateChargePostingRuleDto_base: import("@nestjs/common").Type<Partial<CreateChargePostingRuleDto>>;
export declare class UpdateChargePostingRuleDto extends UpdateChargePostingRuleDto_base {
}
export interface ChargePostingRuleResponseDto {
    id: string;
    tenantId: string;
    ruleName: string;
    eventType: EventType;
    eventSource: EventSource;
    billingItemType: BillingItemType;
    billingItemId?: string | null;
    conditions?: Record<string, any> | null;
    chargeCalculationMethod: ChargeCalculationMethod;
    basePrice?: number | null;
    priceSource: PriceSource;
    quantitySource: QuantitySource;
    discountPercentage?: number | null;
    taxPercentage?: number | null;
    isActive: boolean;
    priority: number;
    autoApprove: boolean;
    description?: string | null;
    configuration?: Record<string, any> | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string | null;
    updatedBy?: string | null;
}
export declare class ProcessEventDto {
    eventType: EventType;
    eventSource: EventSource;
    eventId: string;
    patientId: string;
    encounterId?: string;
    eventData: Record<string, any>;
    occurredAt?: Date;
}
export interface ChargePostingEventResponseDto {
    id: string;
    tenantId: string;
    eventType: EventType;
    eventSource: EventSource;
    eventId: string;
    eventData: Record<string, any>;
    patientId: string;
    encounterId?: string | null;
    processed: boolean;
    processedAt?: Date | null;
    rulesMatched: number;
    chargesCreated: number;
    error?: string | null;
    createdAt: Date;
}
export interface ChargePostingAuditResponseDto {
    id: string;
    tenantId: string;
    chargeId: string;
    eventId: string;
    ruleId: string;
    conditionsMet?: Record<string, any> | null;
    calculationDetails?: Record<string, any> | null;
    createdAt: Date;
    rule?: ChargePostingRuleResponseDto;
}
export interface RuleExecutionResultDto {
    success: boolean;
    rulesMatched: number;
    chargesCreated: number;
    charges: Array<{
        chargeId: string;
        billingItemId: string;
        quantity: number;
        unitPrice: number;
        grossAmount: number;
        ruleId: string;
        ruleName: string;
    }>;
    errors?: string[];
}
export {};
//# sourceMappingURL=charge-posting-rule.dto.d.ts.map