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
exports.UpdatePolicyDto = exports.CreatePolicyDto = exports.PolicyStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus["ACTIVE"] = "active";
    PolicyStatus["INACTIVE"] = "inactive";
    PolicyStatus["EXPIRED"] = "expired";
    PolicyStatus["CANCELLED"] = "cancelled";
})(PolicyStatus || (exports.PolicyStatus = PolicyStatus = {}));
class CreatePolicyDto {
    patientId;
    policyNumber;
    groupNumber;
    payerName;
    payerId;
    relationship;
    effectiveDate;
    expirationDate;
    benefits;
    isPrimary;
    status;
}
exports.CreatePolicyDto = CreatePolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID (from Clinical database)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "policyNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Group number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "groupNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payer name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "payerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payer ID (references Payer entity)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "payerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Relationship to policy holder (self, spouse, child, etc.)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "relationship", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Policy effective date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Policy expiration date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "expirationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Benefits details (JSON)' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePolicyDto.prototype, "benefits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is this the primary insurance', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePolicyDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: PolicyStatus, default: PolicyStatus.ACTIVE }),
    (0, class_validator_1.IsEnum)(PolicyStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "status", void 0);
class UpdatePolicyDto extends (0, swagger_1.PartialType)(CreatePolicyDto) {
}
exports.UpdatePolicyDto = UpdatePolicyDto;
//# sourceMappingURL=policy.dto.js.map