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
exports.UpdatePayerDto = exports.CreatePayerDto = exports.PayerStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var PayerStatus;
(function (PayerStatus) {
    PayerStatus["ACTIVE"] = "active";
    PayerStatus["INACTIVE"] = "inactive";
    PayerStatus["SUSPENDED"] = "suspended";
})(PayerStatus || (exports.PayerStatus = PayerStatus = {}));
class CreatePayerDto {
    payerName;
    payerId;
    payerType;
    contactInfo;
    configuration;
    status;
}
exports.CreatePayerDto = CreatePayerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payer name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePayerDto.prototype, "payerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payer ID (external)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerDto.prototype, "payerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payer type (insurance, government, private)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerDto.prototype, "payerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact information (JSON)' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePayerDto.prototype, "contactInfo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Configuration settings (JSON)' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePayerDto.prototype, "configuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: PayerStatus, default: PayerStatus.ACTIVE }),
    (0, class_validator_1.IsEnum)(PayerStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePayerDto.prototype, "status", void 0);
class UpdatePayerDto extends (0, swagger_1.PartialType)(CreatePayerDto) {
}
exports.UpdatePayerDto = UpdatePayerDto;
//# sourceMappingURL=payer.dto.js.map