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
exports.PriceLookupDto = exports.FeeScheduleItemQueryDto = exports.FeeScheduleQueryDto = exports.BulkCreateFeeScheduleItemsDto = exports.UpdateFeeScheduleItemDto = exports.CreateFeeScheduleItemDto = exports.UpdateFeeScheduleDto = exports.CreateFeeScheduleDto = exports.FeeScheduleCodeType = exports.AuthorityCode = exports.FeeScheduleStatus = exports.FeeScheduleType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var FeeScheduleType;
(function (FeeScheduleType) {
    FeeScheduleType["AUTHORITY"] = "authority";
    FeeScheduleType["TENANT"] = "tenant";
    FeeScheduleType["CONTRACT"] = "contract";
})(FeeScheduleType || (exports.FeeScheduleType = FeeScheduleType = {}));
var FeeScheduleStatus;
(function (FeeScheduleStatus) {
    FeeScheduleStatus["ACTIVE"] = "active";
    FeeScheduleStatus["INACTIVE"] = "inactive";
    FeeScheduleStatus["DRAFT"] = "draft";
    FeeScheduleStatus["EXPIRED"] = "expired";
})(FeeScheduleStatus || (exports.FeeScheduleStatus = FeeScheduleStatus = {}));
var AuthorityCode;
(function (AuthorityCode) {
    AuthorityCode["DHA"] = "DHA";
    AuthorityCode["DOH"] = "DOH";
    AuthorityCode["MOHAP"] = "MOHAP";
    AuthorityCode["HAAD"] = "HAAD";
})(AuthorityCode || (exports.AuthorityCode = AuthorityCode = {}));
var FeeScheduleCodeType;
(function (FeeScheduleCodeType) {
    FeeScheduleCodeType["INTERNAL"] = "INTERNAL";
    FeeScheduleCodeType["CPT"] = "CPT";
    FeeScheduleCodeType["DHA"] = "DHA";
    FeeScheduleCodeType["DOH"] = "DOH";
    FeeScheduleCodeType["HAAD"] = "HAAD";
    FeeScheduleCodeType["MOHAP"] = "MOHAP";
    FeeScheduleCodeType["LOINC"] = "LOINC";
    FeeScheduleCodeType["ICD10"] = "ICD10";
    FeeScheduleCodeType["CUSTOM"] = "CUSTOM";
})(FeeScheduleCodeType || (exports.FeeScheduleCodeType = FeeScheduleCodeType = {}));
// Fee Schedule DTOs
class CreateFeeScheduleDto {
    tenantId;
    scheduleName;
    scheduleType;
    authorityCode;
    version;
    effectiveFrom;
    effectiveTo;
    status;
    baseFeeScheduleId;
    metadata;
}
exports.CreateFeeScheduleDto = CreateFeeScheduleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tenant ID (null for authority/global schedules)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFeeScheduleDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Schedule name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFeeScheduleDto.prototype, "scheduleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: FeeScheduleType, description: 'Schedule type' }),
    (0, class_validator_1.IsEnum)(FeeScheduleType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFeeScheduleDto.prototype, "scheduleType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: AuthorityCode, description: 'Authority code (for authority schedules)' }),
    (0, class_validator_1.IsEnum)(AuthorityCode),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFeeScheduleDto.prototype, "authorityCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Version identifier' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFeeScheduleDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Effective from date', type: Date }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateFeeScheduleDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective to date', type: Date }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateFeeScheduleDto.prototype, "effectiveTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: FeeScheduleStatus, description: 'Schedule status', default: FeeScheduleStatus.ACTIVE }),
    (0, class_validator_1.IsEnum)(FeeScheduleStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFeeScheduleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Base fee schedule ID (for derived schedules)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFeeScheduleDto.prototype, "baseFeeScheduleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata', type: Object }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateFeeScheduleDto.prototype, "metadata", void 0);
class UpdateFeeScheduleDto extends (0, swagger_1.PartialType)(CreateFeeScheduleDto) {
}
exports.UpdateFeeScheduleDto = UpdateFeeScheduleDto;
// Fee Schedule Item DTOs
class CreateFeeScheduleItemDto {
    feeScheduleId;
    billingItemId;
    code;
    codeType;
    baseAmount;
    currency;
    unit;
    multiplier;
    discountPct;
    maxAllowedAmount;
    serviceGroup;
    priority;
}
exports.CreateFeeScheduleItemDto = CreateFeeScheduleItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fee schedule ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFeeScheduleItemDto.prototype, "feeScheduleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Billing item ID (optional link to catalog)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFeeScheduleItemDto.prototype, "billingItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Billing code (DHA/DOH/CPT code)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFeeScheduleItemDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: FeeScheduleCodeType, description: 'Code type' }),
    (0, class_validator_1.IsEnum)(FeeScheduleCodeType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFeeScheduleItemDto.prototype, "codeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base amount in AED' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateFeeScheduleItemDto.prototype, "baseAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency code', default: 'AED' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFeeScheduleItemDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Unit of measurement' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFeeScheduleItemDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Price multiplier for contract overrides' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFeeScheduleItemDto.prototype, "multiplier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Discount percentage' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateFeeScheduleItemDto.prototype, "discountPct", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum allowed amount (cap)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateFeeScheduleItemDto.prototype, "maxAllowedAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service group (radiology, laboratory, etc.)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFeeScheduleItemDto.prototype, "serviceGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Priority for conflict resolution', default: 100 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], CreateFeeScheduleItemDto.prototype, "priority", void 0);
class UpdateFeeScheduleItemDto extends (0, swagger_1.PartialType)(CreateFeeScheduleItemDto) {
}
exports.UpdateFeeScheduleItemDto = UpdateFeeScheduleItemDto;
// Bulk operations DTOs
class BulkCreateFeeScheduleItemsDto {
    feeScheduleId;
    items;
}
exports.BulkCreateFeeScheduleItemsDto = BulkCreateFeeScheduleItemsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fee schedule ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BulkCreateFeeScheduleItemsDto.prototype, "feeScheduleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of fee schedule items', type: [CreateFeeScheduleItemDto] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], BulkCreateFeeScheduleItemsDto.prototype, "items", void 0);
// Query/Filter DTOs
class FeeScheduleQueryDto {
    scheduleType;
    status;
    authorityCode;
    effectiveDate;
}
exports.FeeScheduleQueryDto = FeeScheduleQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: FeeScheduleType, description: 'Filter by schedule type' }),
    (0, class_validator_1.IsEnum)(FeeScheduleType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FeeScheduleQueryDto.prototype, "scheduleType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: FeeScheduleStatus, description: 'Filter by status' }),
    (0, class_validator_1.IsEnum)(FeeScheduleStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FeeScheduleQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: AuthorityCode, description: 'Filter by authority code' }),
    (0, class_validator_1.IsEnum)(AuthorityCode),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FeeScheduleQueryDto.prototype, "authorityCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by effective date (find schedules active on this date)', type: Date }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], FeeScheduleQueryDto.prototype, "effectiveDate", void 0);
class FeeScheduleItemQueryDto {
    code;
    codeType;
    serviceGroup;
}
exports.FeeScheduleItemQueryDto = FeeScheduleItemQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by billing code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FeeScheduleItemQueryDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: FeeScheduleCodeType, description: 'Filter by code type' }),
    (0, class_validator_1.IsEnum)(FeeScheduleCodeType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FeeScheduleItemQueryDto.prototype, "codeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by service group' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FeeScheduleItemQueryDto.prototype, "serviceGroup", void 0);
// Price lookup DTOs
class PriceLookupDto {
    code;
    codeType;
    feeScheduleId;
    lookupDate;
}
exports.PriceLookupDto = PriceLookupDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Billing code to look up' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PriceLookupDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: FeeScheduleCodeType, description: 'Code type' }),
    (0, class_validator_1.IsEnum)(FeeScheduleCodeType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PriceLookupDto.prototype, "codeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fee schedule ID (optional, will search all active schedules if not provided)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PriceLookupDto.prototype, "feeScheduleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Lookup date (defaults to current date)', type: Date }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], PriceLookupDto.prototype, "lookupDate", void 0);
//# sourceMappingURL=fee-schedule.dto.js.map