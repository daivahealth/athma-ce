"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessEventDto = exports.UpdateChargePostingRuleDto = exports.CreateChargePostingRuleDto = exports.QuantitySource = exports.PriceSource = exports.ChargeCalculationMethod = exports.BillingItemType = exports.EventSource = exports.EventType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var EventType;
(function (EventType) {
    EventType["LAB_TEST_ORDERED"] = "lab_test_ordered";
    EventType["MEDICATION_DISPENSED"] = "medication_dispensed";
    EventType["PROCEDURE_PERFORMED"] = "procedure_performed";
    EventType["IMAGING_STUDY_ORDERED"] = "imaging_study_ordered";
    EventType["DAILY_BED_CHARGE"] = "daily_bed_charge";
    EventType["CONSULTATION_COMPLETED"] = "consultation_completed";
    EventType["CUSTOM"] = "custom";
})(EventType || (exports.EventType = EventType = {}));
var EventSource;
(function (EventSource) {
    EventSource["ENCOUNTER"] = "encounter";
    EventSource["ORDER"] = "order";
    EventSource["PHARMACY"] = "pharmacy";
    EventSource["SCHEDULER"] = "scheduler";
    EventSource["CUSTOM"] = "custom";
})(EventSource || (exports.EventSource = EventSource = {}));
var BillingItemType;
(function (BillingItemType) {
    BillingItemType["LAB_TEST"] = "lab_test";
    BillingItemType["MEDICATION"] = "medication";
    BillingItemType["PROCEDURE"] = "procedure";
    BillingItemType["IMAGING_STUDY"] = "imaging_study";
    BillingItemType["BED_CHARGE"] = "bed_charge";
    BillingItemType["CONSULTATION"] = "consultation";
    BillingItemType["SUPPLIES"] = "supplies";
    BillingItemType["CUSTOM"] = "custom";
})(BillingItemType || (exports.BillingItemType = BillingItemType = {}));
var ChargeCalculationMethod;
(function (ChargeCalculationMethod) {
    ChargeCalculationMethod["FIXED"] = "fixed";
    ChargeCalculationMethod["CATALOG_PRICE"] = "catalog_price";
    ChargeCalculationMethod["CUSTOM_FORMULA"] = "custom_formula";
    ChargeCalculationMethod["TIERED_PRICING"] = "tiered_pricing";
})(ChargeCalculationMethod || (exports.ChargeCalculationMethod = ChargeCalculationMethod = {}));
var PriceSource;
(function (PriceSource) {
    PriceSource["CATALOG"] = "catalog";
    PriceSource["CUSTOM"] = "custom";
    PriceSource["EVENT_DATA"] = "event_data";
    PriceSource["EXTERNAL_API"] = "external_api";
})(PriceSource || (exports.PriceSource = PriceSource = {}));
var QuantitySource;
(function (QuantitySource) {
    QuantitySource["EVENT"] = "event";
    QuantitySource["FIXED"] = "fixed";
    QuantitySource["CALCULATED"] = "calculated";
})(QuantitySource || (exports.QuantitySource = QuantitySource = {}));
class CreateChargePostingRuleDto {
    ruleName;
    eventType;
    eventSource;
    billingItemType;
    billingItemId;
    conditions;
    chargeCalculationMethod;
    basePrice;
    priceSource;
    quantitySource;
    discountPercentage;
    taxPercentage;
    isActive;
    priority;
    autoApprove;
    description;
    configuration;
}
exports.CreateChargePostingRuleDto = CreateChargePostingRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rule name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChargePostingRuleDto.prototype, "ruleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: EventType, description: 'Event type that triggers this rule' }),
    (0, class_validator_1.IsEnum)(EventType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChargePostingRuleDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: EventSource, description: 'Event source (encounter, order, etc.)' }),
    (0, class_validator_1.IsEnum)(EventSource),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChargePostingRuleDto.prototype, "eventSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: BillingItemType, description: 'Type of billing item to charge' }),
    (0, class_validator_1.IsEnum)(BillingItemType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChargePostingRuleDto.prototype, "billingItemType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Specific billing item ID (null for dynamic lookup)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChargePostingRuleDto.prototype, "billingItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Conditions to match (JSONB). Supports operators: $eq, $ne, $gt, $gte, $lt, $lte, $in',
        example: { 'eventData.labTestCategory': { '$eq': 'hematology' }, 'eventData.urgent': { '$eq': true } }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateChargePostingRuleDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ChargeCalculationMethod,
        description: 'How to calculate the charge amount',
        default: 'catalog_price'
    }),
    (0, class_validator_1.IsEnum)(ChargeCalculationMethod),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChargePostingRuleDto.prototype, "chargeCalculationMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Base price (used for FIXED method)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChargePostingRuleDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: PriceSource,
        description: 'Where to get the price from',
        default: 'catalog'
    }),
    (0, class_validator_1.IsEnum)(PriceSource),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChargePostingRuleDto.prototype, "priceSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: QuantitySource,
        description: 'Where to get the quantity from',
        default: 'event'
    }),
    (0, class_validator_1.IsEnum)(QuantitySource),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChargePostingRuleDto.prototype, "quantitySource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Discount percentage (0-100)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChargePostingRuleDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tax percentage (0-100)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChargePostingRuleDto.prototype, "taxPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is rule active', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChargePostingRuleDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule priority (higher number = higher priority)',
        default: 0
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChargePostingRuleDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Auto-approve charges created by this rule',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChargePostingRuleDto.prototype, "autoApprove", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rule description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChargePostingRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional configuration (JSONB)' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateChargePostingRuleDto.prototype, "configuration", void 0);
class UpdateChargePostingRuleDto extends (0, swagger_1.PartialType)(CreateChargePostingRuleDto) {
}
exports.UpdateChargePostingRuleDto = UpdateChargePostingRuleDto;
class ProcessEventDto {
    eventType;
    eventSource;
    eventId;
    patientId;
    encounterId;
    eventData;
    occurredAt;
}
exports.ProcessEventDto = ProcessEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: EventType, description: 'Event type' }),
    (0, class_validator_1.IsEnum)(EventType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessEventDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: EventSource, description: 'Event source' }),
    (0, class_validator_1.IsEnum)(EventSource),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessEventDto.prototype, "eventSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event ID (e.g., encounter_id, order_id)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessEventDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessEventDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Encounter ID (if applicable)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProcessEventDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event data (JSONB)' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ProcessEventDto.prototype, "eventData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp of the event' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], ProcessEventDto.prototype, "occurredAt", void 0);
//# sourceMappingURL=charge-posting-rule.dto.js.map