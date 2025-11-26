import { PrismaService } from '@zeal/database-rcm';
import { CreateChargePostingRuleDto, UpdateChargePostingRuleDto, ProcessEventDto, EventType, EventSource, BillingItemType } from '../dto/charge-posting-rule.dto';
import { ChargeService } from './charge.service';
import { FeeScheduleService } from './fee-schedule.service';
import { MedicalCodingService } from '../../medical-coding/services/medical-coding.service';
/**
 * ChargePostingService
 *
 * Core business logic for automated charge posting based on clinical events.
 * This service processes events from the Clinical service and creates charges
 * automatically based on configured rules.
 *
 * Key responsibilities:
 * - Manage charge posting rules (CRUD operations)
 * - Process clinical events and match against rules
 * - Evaluate JSONB conditions with MongoDB-style operators
 * - Calculate charges based on rule configuration
 * - Create audit trail for compliance and debugging
 */
export declare class ChargePostingService {
    private readonly prisma;
    private readonly chargeService;
    private readonly feeScheduleService;
    private readonly medicalCodingService;
    private readonly logger;
    constructor(prisma: PrismaService, chargeService: ChargeService, feeScheduleService: FeeScheduleService, medicalCodingService: MedicalCodingService);
    createRule(tenantId: string, dto: CreateChargePostingRuleDto, userId?: string): Promise<{
        description: string | null;
        configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        billingItemId: string | null;
        priority: number;
        createdBy: string | null;
        updatedBy: string | null;
        basePrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        ruleName: string;
        eventType: string;
        eventSource: string;
        billingItemType: string;
        conditions: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        chargeCalculationMethod: string;
        priceSource: string;
        quantitySource: string;
        discountPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        taxPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        autoApprove: boolean;
    }>;
    findAllRules(tenantId: string, filters?: {
        eventType?: EventType;
        eventSource?: EventSource;
        billingItemType?: BillingItemType;
        isActive?: boolean;
    }): Promise<{
        description: string | null;
        configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        billingItemId: string | null;
        priority: number;
        createdBy: string | null;
        updatedBy: string | null;
        basePrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        ruleName: string;
        eventType: string;
        eventSource: string;
        billingItemType: string;
        conditions: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        chargeCalculationMethod: string;
        priceSource: string;
        quantitySource: string;
        discountPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        taxPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        autoApprove: boolean;
    }[]>;
    findRuleById(tenantId: string, id: string): Promise<{
        description: string | null;
        configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        billingItemId: string | null;
        priority: number;
        createdBy: string | null;
        updatedBy: string | null;
        basePrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        ruleName: string;
        eventType: string;
        eventSource: string;
        billingItemType: string;
        conditions: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        chargeCalculationMethod: string;
        priceSource: string;
        quantitySource: string;
        discountPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        taxPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        autoApprove: boolean;
    }>;
    updateRule(tenantId: string, id: string, dto: UpdateChargePostingRuleDto, userId?: string): Promise<{
        description: string | null;
        configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        billingItemId: string | null;
        priority: number;
        createdBy: string | null;
        updatedBy: string | null;
        basePrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        ruleName: string;
        eventType: string;
        eventSource: string;
        billingItemType: string;
        conditions: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        chargeCalculationMethod: string;
        priceSource: string;
        quantitySource: string;
        discountPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        taxPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        autoApprove: boolean;
    }>;
    deleteRule(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    setRuleActive(tenantId: string, id: string, isActive: boolean, userId?: string): Promise<{
        description: string | null;
        configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        billingItemId: string | null;
        priority: number;
        createdBy: string | null;
        updatedBy: string | null;
        basePrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        ruleName: string;
        eventType: string;
        eventSource: string;
        billingItemType: string;
        conditions: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        chargeCalculationMethod: string;
        priceSource: string;
        quantitySource: string;
        discountPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        taxPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        autoApprove: boolean;
    }>;
    /**
     * Process a clinical event and create charges based on matching rules
     *
     * This is the core method that:
     * 1. Stores the event in the database
     * 2. Finds all matching rules based on event type and conditions
     * 3. For each matching rule, calculates and creates a charge
     * 4. Creates audit trail records
     *
     * @param tenantId - Tenant UUID
     * @param dto - Event details from Clinical service
     * @returns Summary of processing (rules matched, charges created)
     */
    processEvent(tenantId: string, dto: ProcessEventDto): Promise<{
        success: boolean;
        eventId: string;
        rulesMatched: number;
        chargesCreated: number;
        charges: {
            chargeId: string;
            billingItemId: string;
            quantity: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            unitPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            grossAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            ruleId: string | null;
            ruleName: string | undefined;
        }[];
    }>;
    /**
     * Find all rules that match the event type and conditions
     */
    private findMatchingRules;
    /**
     * Evaluate JSONB conditions against event data
     * Supports MongoDB-style operators: $eq, $ne, $gt, $gte, $lt, $lte, $in
     *
     * Example condition:
     * {
     *   "eventData.testCode": { "$eq": "CBC001" },
     *   "eventData.urgent": { "$eq": true }
     * }
     */
    private evaluateConditions;
    /**
     * Get nested value from object using dot notation
     * Example: getNestedValue({ eventData: { testCode: "CBC001" } }, "eventData.testCode") => "CBC001"
     */
    private getNestedValue;
    /**
     * Evaluate a single condition with operator
     */
    private evaluateCondition;
    /**
     * Create a charge based on a rule and event data
     */
    private createChargeFromRule;
    /**
     * Resolve billing item ID from rule and event data
     */
    private resolveBillingItem;
    /**
     * Calculate price based on rule configuration
     */
    private calculatePrice;
    /**
     * Calculate quantity based on rule configuration
     */
    private calculateQuantity;
    /**
     * Create audit record for compliance and debugging
     */
    private createAuditRecord;
    /**
     * Reprocess an existing event (useful for fixing errors or testing)
     */
    reprocessEvent(tenantId: string, eventId: string): Promise<{
        success: boolean;
        eventId: string;
        rulesMatched: number;
        chargesCreated: number;
        charges: {
            chargeId: string;
            billingItemId: string;
            quantity: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            unitPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            grossAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            ruleId: string | null;
            ruleName: string | undefined;
        }[];
    }>;
    findAllEvents(tenantId: string, filters?: {
        eventType?: EventType;
        processed?: boolean;
        patientId?: string;
        encounterId?: string;
        dateFrom?: Date;
        dateTo?: Date;
    }): Promise<{
        error: string | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        patientId: string;
        encounterId: string | null;
        eventType: string;
        eventSource: string;
        eventId: string;
        eventData: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
        processed: boolean;
        processedAt: Date | null;
        rulesMatched: number;
        chargesCreated: number;
    }[]>;
    findEventById(tenantId: string, id: string): Promise<{
        auditRecords: ({
            rule: {
                description: string | null;
                configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                billingItemId: string | null;
                priority: number;
                createdBy: string | null;
                updatedBy: string | null;
                basePrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
                ruleName: string;
                eventType: string;
                eventSource: string;
                billingItemType: string;
                conditions: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
                chargeCalculationMethod: string;
                priceSource: string;
                quantitySource: string;
                discountPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
                taxPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
                autoApprove: boolean;
            };
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            chargeId: string;
            eventId: string;
            conditionsMet: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            calculationDetails: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            ruleId: string;
        })[];
    } & {
        error: string | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        patientId: string;
        encounterId: string | null;
        eventType: string;
        eventSource: string;
        eventId: string;
        eventData: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
        processed: boolean;
        processedAt: Date | null;
        rulesMatched: number;
        chargesCreated: number;
    }>;
    findEventsByPatient(tenantId: string, patientId: string): Promise<{
        error: string | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        patientId: string;
        encounterId: string | null;
        eventType: string;
        eventSource: string;
        eventId: string;
        eventData: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
        processed: boolean;
        processedAt: Date | null;
        rulesMatched: number;
        chargesCreated: number;
    }[]>;
    findEventsByEncounter(tenantId: string, encounterId: string): Promise<{
        error: string | null;
        id: string;
        tenantId: string;
        createdAt: Date;
        patientId: string;
        encounterId: string | null;
        eventType: string;
        eventSource: string;
        eventId: string;
        eventData: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
        processed: boolean;
        processedAt: Date | null;
        rulesMatched: number;
        chargesCreated: number;
    }[]>;
    findAllAuditRecords(tenantId: string, filters?: {
        ruleId?: string;
        chargeId?: string;
        eventId?: string;
        dateFrom?: Date;
        dateTo?: Date;
    }): Promise<({
        event: {
            error: string | null;
            id: string;
            tenantId: string;
            createdAt: Date;
            patientId: string;
            encounterId: string | null;
            eventType: string;
            eventSource: string;
            eventId: string;
            eventData: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            processed: boolean;
            processedAt: Date | null;
            rulesMatched: number;
            chargesCreated: number;
        };
        rule: {
            description: string | null;
            configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            billingItemId: string | null;
            priority: number;
            createdBy: string | null;
            updatedBy: string | null;
            basePrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            ruleName: string;
            eventType: string;
            eventSource: string;
            billingItemType: string;
            conditions: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            chargeCalculationMethod: string;
            priceSource: string;
            quantitySource: string;
            discountPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            taxPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            autoApprove: boolean;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        chargeId: string;
        eventId: string;
        conditionsMet: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        calculationDetails: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        ruleId: string;
    })[]>;
    findAuditByRule(tenantId: string, ruleId: string): Promise<({
        event: {
            error: string | null;
            id: string;
            tenantId: string;
            createdAt: Date;
            patientId: string;
            encounterId: string | null;
            eventType: string;
            eventSource: string;
            eventId: string;
            eventData: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            processed: boolean;
            processedAt: Date | null;
            rulesMatched: number;
            chargesCreated: number;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        chargeId: string;
        eventId: string;
        conditionsMet: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        calculationDetails: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        ruleId: string;
    })[]>;
    findAuditByCharge(tenantId: string, chargeId: string): Promise<({
        event: {
            error: string | null;
            id: string;
            tenantId: string;
            createdAt: Date;
            patientId: string;
            encounterId: string | null;
            eventType: string;
            eventSource: string;
            eventId: string;
            eventData: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            processed: boolean;
            processedAt: Date | null;
            rulesMatched: number;
            chargesCreated: number;
        };
        rule: {
            description: string | null;
            configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            billingItemId: string | null;
            priority: number;
            createdBy: string | null;
            updatedBy: string | null;
            basePrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            ruleName: string;
            eventType: string;
            eventSource: string;
            billingItemType: string;
            conditions: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            chargeCalculationMethod: string;
            priceSource: string;
            quantitySource: string;
            discountPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            taxPercentage: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            autoApprove: boolean;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        chargeId: string;
        eventId: string;
        conditionsMet: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        calculationDetails: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        ruleId: string;
    })[]>;
    getRuleStatistics(tenantId: string, filters?: {
        dateFrom?: Date;
        dateTo?: Date;
    }): Promise<any[]>;
    getEventStatistics(tenantId: string, filters?: {
        dateFrom?: Date;
        dateTo?: Date;
    }): Promise<{
        totalEvents: number;
        processedEvents: number;
        totalRulesMatched: number;
        totalChargesCreated: number;
        averageRulesPerEvent: number;
        averageChargesPerEvent: number;
        byEventType: any[];
    }>;
}
//# sourceMappingURL=charge-posting.service.d.ts.map