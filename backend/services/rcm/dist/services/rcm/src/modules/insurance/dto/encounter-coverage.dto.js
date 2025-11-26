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
exports.UpdateEncounterCoverageDto = exports.CreateEncounterCoverageDto = exports.CoverageLevel = exports.FinancialClass = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var FinancialClass;
(function (FinancialClass) {
    FinancialClass["INSURANCE"] = "insurance";
    FinancialClass["CORPORATE"] = "corporate";
    FinancialClass["TPA"] = "tpa";
    FinancialClass["CASH"] = "cash";
    FinancialClass["GOVERNMENT"] = "government";
})(FinancialClass || (exports.FinancialClass = FinancialClass = {}));
var CoverageLevel;
(function (CoverageLevel) {
    CoverageLevel["PRIMARY"] = "primary";
    CoverageLevel["SECONDARY"] = "secondary";
    CoverageLevel["TERTIARY"] = "tertiary";
    CoverageLevel["SELF_PAY"] = "self_pay";
})(CoverageLevel || (exports.CoverageLevel = CoverageLevel = {}));
class CreateEncounterCoverageDto {
    encounterId;
    patientId;
    policyId;
    payerId;
    financialClass;
    coverageLevel;
    planName;
    memberId;
    memberName;
    networkName;
    copayAmount;
    coinsurancePct;
    deductibleSnapshot;
    benefitsSnapshot;
    eligibilityRequestId;
    preauthRequestId;
    costEstimateId;
    isActive;
}
exports.CreateEncounterCoverageDto = CreateEncounterCoverageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Encounter ID (from Clinical database)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID (from Clinical database)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Policy ID (may be null for self-pay)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "policyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payer ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "payerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: FinancialClass, description: 'Financial class (insurance, corporate, tpa, cash, government)' }),
    (0, class_validator_1.IsEnum)(FinancialClass),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "financialClass", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: CoverageLevel, default: CoverageLevel.PRIMARY, description: 'Coverage level (primary, secondary, tertiary, self_pay)' }),
    (0, class_validator_1.IsEnum)(CoverageLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "coverageLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plan name snapshot' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "planName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Member ID snapshot' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Member name snapshot' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "memberName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Network name snapshot' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "networkName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Copay amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateEncounterCoverageDto.prototype, "copayAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Coinsurance percentage' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateEncounterCoverageDto.prototype, "coinsurancePct", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deductible snapshot (JSON)' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateEncounterCoverageDto.prototype, "deductibleSnapshot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Benefits snapshot (JSON)' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateEncounterCoverageDto.prototype, "benefitsSnapshot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Eligibility request ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "eligibilityRequestId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pre-authorization request ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "preauthRequestId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cost estimate ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterCoverageDto.prototype, "costEstimateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is active', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateEncounterCoverageDto.prototype, "isActive", void 0);
class UpdateEncounterCoverageDto extends (0, swagger_1.PartialType)(CreateEncounterCoverageDto) {
}
exports.UpdateEncounterCoverageDto = UpdateEncounterCoverageDto;
//# sourceMappingURL=encounter-coverage.dto.js.map