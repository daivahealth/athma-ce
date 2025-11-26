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
exports.UpdateChargeDto = exports.CreateChargeDto = exports.ChargeSourceType = exports.ChargeStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var ChargeStatus;
(function (ChargeStatus) {
    ChargeStatus["UNBILLED"] = "unbilled";
    ChargeStatus["INVOICED"] = "invoiced";
    ChargeStatus["CANCELLED"] = "cancelled";
})(ChargeStatus || (exports.ChargeStatus = ChargeStatus = {}));
var ChargeSourceType;
(function (ChargeSourceType) {
    ChargeSourceType["ENCOUNTER"] = "encounter";
    ChargeSourceType["ORDER"] = "order";
    ChargeSourceType["MANUAL"] = "manual";
})(ChargeSourceType || (exports.ChargeSourceType = ChargeSourceType = {}));
class CreateChargeDto {
    patientId;
    encounterId;
    billingItemId;
    chargeDate;
    quantity;
    unitPrice;
    grossAmount;
    patientResponsibility;
    payerResponsibility;
    status;
    sourceType;
    sourceId;
    notes;
}
exports.CreateChargeDto = CreateChargeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID (from Clinical DB)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChargeDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Encounter ID (from Clinical DB)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChargeDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Billing item ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChargeDto.prototype, "billingItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Charge date', default: 'CURRENT_DATE' }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateChargeDto.prototype, "chargeDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quantity', default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChargeDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit price in AED' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChargeDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gross amount (quantity * unit_price)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChargeDto.prototype, "grossAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient responsibility amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChargeDto.prototype, "patientResponsibility", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payer responsibility amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChargeDto.prototype, "payerResponsibility", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ChargeStatus, description: 'Charge status', default: 'unbilled' }),
    (0, class_validator_1.IsEnum)(ChargeStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChargeDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ChargeSourceType, description: 'Source type' }),
    (0, class_validator_1.IsEnum)(ChargeSourceType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChargeDto.prototype, "sourceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Source ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChargeDto.prototype, "sourceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChargeDto.prototype, "notes", void 0);
class UpdateChargeDto extends (0, swagger_1.PartialType)(CreateChargeDto) {
}
exports.UpdateChargeDto = UpdateChargeDto;
//# sourceMappingURL=charge.dto.js.map