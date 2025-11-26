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
exports.UpdateBillingItemDto = exports.CreateBillingItemDto = exports.ChargeType = exports.BillingCodeType = exports.ItemType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var ItemType;
(function (ItemType) {
    ItemType["LAB"] = "lab";
    ItemType["IMAGING"] = "imaging";
    ItemType["PROCEDURE"] = "procedure";
    ItemType["CONSULT"] = "consult";
    ItemType["REGISTRATION"] = "registration";
    ItemType["PHARMACY"] = "pharmacy";
    ItemType["PACKAGE"] = "package";
    ItemType["MISC"] = "misc";
})(ItemType || (exports.ItemType = ItemType = {}));
var BillingCodeType;
(function (BillingCodeType) {
    BillingCodeType["INTERNAL"] = "INTERNAL";
    BillingCodeType["CPT"] = "CPT";
    BillingCodeType["DHA"] = "DHA";
    BillingCodeType["DOH"] = "DOH";
    BillingCodeType["HAAD"] = "HAAD";
    BillingCodeType["MOHAP"] = "MOHAP";
    BillingCodeType["LOINC"] = "LOINC";
    BillingCodeType["CUSTOM"] = "CUSTOM";
})(BillingCodeType || (exports.BillingCodeType = BillingCodeType = {}));
var ChargeType;
(function (ChargeType) {
    ChargeType["REGISTRATION"] = "registration";
    ChargeType["CONSULTATION"] = "consultation";
    ChargeType["LAB"] = "lab";
    ChargeType["RADIOLOGY"] = "radiology";
    ChargeType["PROCEDURE"] = "procedure";
    ChargeType["PHARMACY"] = "pharmacy";
    ChargeType["PACKAGE"] = "package";
    ChargeType["MISC"] = "misc";
})(ChargeType || (exports.ChargeType = ChargeType = {}));
class CreateBillingItemDto {
    tenantId;
    itemType;
    clinicalRefId;
    billingCode;
    billingCodeType;
    billingDescription;
    chargeType;
    defaultUnit;
    listPrice;
    isActive;
}
exports.CreateBillingItemDto = CreateBillingItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tenant ID (null for global items)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBillingItemDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ItemType, description: 'Item type' }),
    (0, class_validator_1.IsEnum)(ItemType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBillingItemDto.prototype, "itemType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinical reference ID (logical FK to Foundation catalog)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBillingItemDto.prototype, "clinicalRefId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Billing code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBillingItemDto.prototype, "billingCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: BillingCodeType, description: 'Billing code type' }),
    (0, class_validator_1.IsEnum)(BillingCodeType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBillingItemDto.prototype, "billingCodeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Billing description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBillingItemDto.prototype, "billingDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ChargeType, description: 'Charge type' }),
    (0, class_validator_1.IsEnum)(ChargeType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBillingItemDto.prototype, "chargeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default unit', default: 'each' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBillingItemDto.prototype, "defaultUnit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'List price in AED' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBillingItemDto.prototype, "listPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is active', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateBillingItemDto.prototype, "isActive", void 0);
class UpdateBillingItemDto extends (0, swagger_1.PartialType)(CreateBillingItemDto) {
}
exports.UpdateBillingItemDto = UpdateBillingItemDto;
//# sourceMappingURL=billing-item.dto.js.map