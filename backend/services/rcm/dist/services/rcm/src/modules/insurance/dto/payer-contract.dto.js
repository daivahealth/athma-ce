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
exports.CalculateContractPriceDto = exports.PayerContractAdjustmentQueryDto = exports.PayerContractQueryDto = exports.BulkCreatePayerContractAdjustmentsDto = exports.UpdatePayerContractAdjustmentDto = exports.CreatePayerContractAdjustmentDto = exports.UpdatePayerContractDto = exports.CreatePayerContractDto = exports.AuthorityCode = exports.ContractStatus = exports.ReimbursementMethod = exports.ContractType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
// ==================== ENUMS ====================
var ContractType;
(function (ContractType) {
    ContractType["FEE_FOR_SERVICE"] = "fee_for_service";
    ContractType["CAPITATION"] = "capitation";
    ContractType["BUNDLED"] = "bundled";
    ContractType["VALUE_BASED"] = "value_based";
})(ContractType || (exports.ContractType = ContractType = {}));
var ReimbursementMethod;
(function (ReimbursementMethod) {
    ReimbursementMethod["PERCENTAGE_OF_TARIFF"] = "percentage_of_tariff";
    ReimbursementMethod["FIXED_RATE"] = "fixed_rate";
    ReimbursementMethod["PERCENTAGE_OF_CHARGES"] = "percentage_of_charges";
    ReimbursementMethod["PER_DIEM"] = "per_diem";
    ReimbursementMethod["CASE_RATE"] = "case_rate";
})(ReimbursementMethod || (exports.ReimbursementMethod = ReimbursementMethod = {}));
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["ACTIVE"] = "active";
    ContractStatus["EXPIRED"] = "expired";
    ContractStatus["DRAFT"] = "draft";
    ContractStatus["SUSPENDED"] = "suspended";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
var AuthorityCode;
(function (AuthorityCode) {
    AuthorityCode["DHA"] = "DHA";
    AuthorityCode["DOH"] = "DOH";
    AuthorityCode["MOHAP"] = "MOHAP";
    AuthorityCode["HAAD"] = "HAAD";
})(AuthorityCode || (exports.AuthorityCode = AuthorityCode = {}));
// ==================== PAYER CONTRACT DTOs ====================
class CreatePayerContractDto {
    payerId;
    contractName;
    contractNumber;
    authorityCode;
    baseFeeScheduleId;
    planCode;
    networkType;
    lineOfBusiness;
    contractType;
    reimbursementMethod;
    effectiveFrom;
    effectiveTo;
    status;
    defaultMultiplier;
    defaultDiscountPct;
    defaultMaxAllowedAmount;
    terms;
    metadata;
}
exports.CreatePayerContractDto = CreatePayerContractDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payer ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "payerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contract name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "contractName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contract number (external reference)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "contractNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Authority code', enum: AuthorityCode }),
    (0, class_validator_1.IsEnum)(AuthorityCode),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "authorityCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Base fee schedule ID to reference' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "baseFeeScheduleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plan code for specific plan within payer' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "planCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Network type (e.g., PPO, HMO, EPO)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "networkType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Line of business (e.g., commercial, medicare, medicaid)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "lineOfBusiness", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contract type', enum: ContractType, default: ContractType.FEE_FOR_SERVICE }),
    (0, class_validator_1.IsEnum)(ContractType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "contractType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reimbursement method',
        enum: ReimbursementMethod,
        default: ReimbursementMethod.PERCENTAGE_OF_TARIFF,
    }),
    (0, class_validator_1.IsEnum)(ReimbursementMethod),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "reimbursementMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Effective from date (ISO 8601 format)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective to date (ISO 8601 format)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "effectiveTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contract status', enum: ContractStatus, default: ContractStatus.ACTIVE }),
    (0, class_validator_1.IsEnum)(ContractStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default multiplier applied to base tariff' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePayerContractDto.prototype, "defaultMultiplier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default discount percentage' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePayerContractDto.prototype, "defaultDiscountPct", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default maximum allowed amount' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePayerContractDto.prototype, "defaultMaxAllowedAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contract terms (JSON)' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePayerContractDto.prototype, "terms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata (JSON)' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePayerContractDto.prototype, "metadata", void 0);
class UpdatePayerContractDto extends (0, swagger_1.PartialType)(CreatePayerContractDto) {
}
exports.UpdatePayerContractDto = UpdatePayerContractDto;
// ==================== PAYER CONTRACT ADJUSTMENT DTOs ====================
class CreatePayerContractAdjustmentDto {
    contractId;
    serviceGroup;
    billingItemId;
    feeScheduleItemId;
    multiplier;
    discountPct;
    maxAllowedAmount;
    minAllowedAmount;
    priority;
    effectiveFrom;
    effectiveTo;
    isExclusion;
    notes;
}
exports.CreatePayerContractAdjustmentDto = CreatePayerContractAdjustmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contract ID this adjustment belongs to' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePayerContractAdjustmentDto.prototype, "contractId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service group to apply adjustment to' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractAdjustmentDto.prototype, "serviceGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Billing item ID to apply adjustment to' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractAdjustmentDto.prototype, "billingItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fee schedule item ID to apply adjustment to' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractAdjustmentDto.prototype, "feeScheduleItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pricing multiplier override' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePayerContractAdjustmentDto.prototype, "multiplier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Discount percentage override' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePayerContractAdjustmentDto.prototype, "discountPct", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum allowed amount' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePayerContractAdjustmentDto.prototype, "maxAllowedAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum allowed amount' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePayerContractAdjustmentDto.prototype, "minAllowedAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Priority (lower = higher specificity)', default: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePayerContractAdjustmentDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective from date (ISO 8601 format)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractAdjustmentDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective to date (ISO 8601 format)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractAdjustmentDto.prototype, "effectiveTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is this an exclusion rule?', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePayerContractAdjustmentDto.prototype, "isExclusion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes about this adjustment' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerContractAdjustmentDto.prototype, "notes", void 0);
class UpdatePayerContractAdjustmentDto extends (0, swagger_1.PartialType)(CreatePayerContractAdjustmentDto) {
}
exports.UpdatePayerContractAdjustmentDto = UpdatePayerContractAdjustmentDto;
// ==================== BULK OPERATIONS ====================
class BulkCreatePayerContractAdjustmentsDto {
    contractId;
    adjustments;
}
exports.BulkCreatePayerContractAdjustmentsDto = BulkCreatePayerContractAdjustmentsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contract ID for all adjustments' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BulkCreatePayerContractAdjustmentsDto.prototype, "contractId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of adjustments to create', type: [CreatePayerContractAdjustmentDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreatePayerContractAdjustmentDto),
    __metadata("design:type", Array)
], BulkCreatePayerContractAdjustmentsDto.prototype, "adjustments", void 0);
// ==================== QUERY/FILTER DTOs ====================
class PayerContractQueryDto {
    payerId;
    status;
    contractType;
    authorityCode;
    planCode;
    networkType;
    effectiveDate;
}
exports.PayerContractQueryDto = PayerContractQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by payer ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayerContractQueryDto.prototype, "payerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by contract status', enum: ContractStatus }),
    (0, class_validator_1.IsEnum)(ContractStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayerContractQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by contract type', enum: ContractType }),
    (0, class_validator_1.IsEnum)(ContractType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayerContractQueryDto.prototype, "contractType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by authority code', enum: AuthorityCode }),
    (0, class_validator_1.IsEnum)(AuthorityCode),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayerContractQueryDto.prototype, "authorityCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by plan code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayerContractQueryDto.prototype, "planCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by network type' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayerContractQueryDto.prototype, "networkType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by effective date (ISO 8601 format)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayerContractQueryDto.prototype, "effectiveDate", void 0);
class PayerContractAdjustmentQueryDto {
    contractId;
    serviceGroup;
    billingItemId;
    feeScheduleItemId;
    effectiveDate;
    includeExclusions;
}
exports.PayerContractAdjustmentQueryDto = PayerContractAdjustmentQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by contract ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayerContractAdjustmentQueryDto.prototype, "contractId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by service group' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayerContractAdjustmentQueryDto.prototype, "serviceGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by billing item ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayerContractAdjustmentQueryDto.prototype, "billingItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by fee schedule item ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayerContractAdjustmentQueryDto.prototype, "feeScheduleItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by effective date (ISO 8601 format)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayerContractAdjustmentQueryDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include exclusions?', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PayerContractAdjustmentQueryDto.prototype, "includeExclusions", void 0);
// ==================== PRICE CALCULATION DTO ====================
class CalculateContractPriceDto {
    contractId;
    code;
    codeType;
    serviceGroup;
    effectiveDate;
}
exports.CalculateContractPriceDto = CalculateContractPriceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contract ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CalculateContractPriceDto.prototype, "contractId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Billing code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CalculateContractPriceDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Code type (CPT, ICD10, etc.)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CalculateContractPriceDto.prototype, "codeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service group' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CalculateContractPriceDto.prototype, "serviceGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective date for calculation (ISO 8601 format)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CalculateContractPriceDto.prototype, "effectiveDate", void 0);
//# sourceMappingURL=payer-contract.dto.js.map