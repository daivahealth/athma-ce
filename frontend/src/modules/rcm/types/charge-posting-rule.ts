export enum EventType {
  LAB_TEST_ORDERED = 'lab_test_ordered',
  MEDICATION_DISPENSED = 'medication_dispensed',
  PROCEDURE_PERFORMED = 'procedure_performed',
  IMAGING_STUDY_ORDERED = 'imaging_study_ordered',
  DAILY_BED_CHARGE = 'daily_bed_charge',
  CONSULTATION_COMPLETED = 'consultation_completed',
  CUSTOM = 'custom',
}

export enum EventSource {
  ENCOUNTER = 'encounter',
  ORDER = 'order',
  PHARMACY = 'pharmacy',
  SCHEDULER = 'scheduler',
  CUSTOM = 'custom',
}

export enum BillingItemType {
  LAB_TEST = 'lab_test',
  MEDICATION = 'medication',
  PROCEDURE = 'procedure',
  IMAGING_STUDY = 'imaging_study',
  BED_CHARGE = 'bed_charge',
  CONSULTATION = 'consultation',
  SUPPLIES = 'supplies',
  CUSTOM = 'custom',
}

export enum ChargeCalculationMethod {
  FIXED = 'fixed',
  CATALOG_PRICE = 'catalog_price',
  CUSTOM_FORMULA = 'custom_formula',
  TIERED_PRICING = 'tiered_pricing',
}

export enum PriceSource {
  CATALOG = 'catalog',
  CUSTOM = 'custom',
  EVENT_DATA = 'event_data',
  EXTERNAL_API = 'external_api',
}

export enum QuantitySource {
  EVENT = 'event',
  FIXED = 'fixed',
  CALCULATED = 'calculated',
}

export interface ChargePostingRule {
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
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface ChargePostingRuleFilters {
  eventType?: EventType;
  eventSource?: EventSource;
  billingItemType?: BillingItemType;
  isActive?: boolean;
}

export interface CreateChargePostingRuleInput {
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

export type UpdateChargePostingRuleInput = Partial<CreateChargePostingRuleInput>;
