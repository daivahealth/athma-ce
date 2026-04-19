import { IsString, IsOptional, IsNotEmpty, IsEnum, IsUUID, IsNumber, IsBoolean, IsObject, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

export class CreateChargePostingRuleDto {
  @ApiProperty({ description: 'Rule name' })
  @IsString()
  @IsNotEmpty()
  ruleName!: string;

  @ApiProperty({ enum: EventType, description: 'Event type that triggers this rule' })
  @IsEnum(EventType)
  @IsNotEmpty()
  eventType!: EventType;

  @ApiProperty({ enum: EventSource, description: 'Event source (encounter, order, etc.)' })
  @IsEnum(EventSource)
  @IsNotEmpty()
  eventSource!: EventSource;

  @ApiProperty({ enum: BillingItemType, description: 'Type of billing item to charge' })
  @IsEnum(BillingItemType)
  @IsNotEmpty()
  billingItemType!: BillingItemType;

  @ApiPropertyOptional({ description: 'Specific billing item ID (null for dynamic lookup)' })
  @IsUUID("all")
  @IsOptional()
  billingItemId?: string;

  @ApiPropertyOptional({
    description: 'Conditions to match (JSONB). Supports operators: $eq, $ne, $gt, $gte, $lt, $lte, $in',
    example: { 'eventData.labTestCategory': { '$eq': 'hematology' }, 'eventData.urgent': { '$eq': true } }
  })
  @IsObject()
  @IsOptional()
  conditions?: Record<string, any>;

  @ApiPropertyOptional({
    enum: ChargeCalculationMethod,
    description: 'How to calculate the charge amount',
    default: 'catalog_price'
  })
  @IsEnum(ChargeCalculationMethod)
  @IsOptional()
  chargeCalculationMethod?: ChargeCalculationMethod;

  @ApiPropertyOptional({ description: 'Base price (used for FIXED method)' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  basePrice?: number;

  @ApiPropertyOptional({
    enum: PriceSource,
    description: 'Where to get the price from',
    default: 'catalog'
  })
  @IsEnum(PriceSource)
  @IsOptional()
  priceSource?: PriceSource;

  @ApiPropertyOptional({
    enum: QuantitySource,
    description: 'Where to get the quantity from',
    default: 'event'
  })
  @IsEnum(QuantitySource)
  @IsOptional()
  quantitySource?: QuantitySource;

  @ApiPropertyOptional({ description: 'Discount percentage (0-100)' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  discountPercentage?: number;

  @ApiPropertyOptional({ description: 'Tax percentage (0-100)' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  taxPercentage?: number;

  @ApiPropertyOptional({ description: 'Is rule active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Rule priority (higher number = higher priority)',
    default: 0
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  priority?: number;

  @ApiPropertyOptional({
    description: 'Auto-approve charges created by this rule',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  autoApprove?: boolean;

  @ApiPropertyOptional({ description: 'Rule description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Additional configuration (JSONB)' })
  @IsObject()
  @IsOptional()
  configuration?: Record<string, any>;
}

export class UpdateChargePostingRuleDto extends PartialType(CreateChargePostingRuleDto) {}

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

export class ProcessEventDto {
  @ApiProperty({ enum: EventType, description: 'Event type' })
  @IsEnum(EventType)
  @IsNotEmpty()
  eventType!: EventType;

  @ApiProperty({ enum: EventSource, description: 'Event source' })
  @IsEnum(EventSource)
  @IsNotEmpty()
  eventSource!: EventSource;

  @ApiProperty({ description: 'Event ID (e.g., encounter_id, order_id)' })
  @IsUUID("all")
  @IsNotEmpty()
  eventId!: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("all")
  @IsNotEmpty()
  patientId!: string;

  @ApiPropertyOptional({ description: 'Encounter ID (if applicable)' })
  @IsUUID("all")
  @IsOptional()
  encounterId?: string;

  @ApiProperty({ description: 'Event data (JSONB)' })
  @IsObject()
  @IsNotEmpty()
  eventData!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Timestamp of the event' })
  @Type(() => Date)
  @IsOptional()
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
