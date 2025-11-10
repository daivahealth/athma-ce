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
exports.PrescriptionResponseDto = exports.UpdatePrescriptionDto = exports.CreatePrescriptionDto = exports.DrugCodeSystem = exports.PrescriptionStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
// Enum for prescription status
var PrescriptionStatus;
(function (PrescriptionStatus) {
    PrescriptionStatus["ACTIVE"] = "active";
    PrescriptionStatus["COMPLETED"] = "completed";
    PrescriptionStatus["CANCELLED"] = "cancelled";
    PrescriptionStatus["DISCONTINUED"] = "discontinued";
})(PrescriptionStatus || (exports.PrescriptionStatus = PrescriptionStatus = {}));
// Enum for drug code system
var DrugCodeSystem;
(function (DrugCodeSystem) {
    DrugCodeSystem["NDC"] = "NDC";
    DrugCodeSystem["RXNORM"] = "RxNorm";
    DrugCodeSystem["LOCAL"] = "local";
})(DrugCodeSystem || (exports.DrugCodeSystem = DrugCodeSystem = {}));
// DTO for creating a prescription order
class CreatePrescriptionDto {
    encounterId;
    patientId;
    drugCode;
    codeSystem;
    drugName;
    drugNameAr;
    genericName;
    dosage;
    route;
    frequency;
    duration;
    quantity;
    refills;
    instructions;
    instructionsAr;
    prescribedBy;
}
exports.CreatePrescriptionDto = CreatePrescriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Encounter ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Drug code (NDC, RxNorm, or local formulary code)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "drugCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Code system', enum: DrugCodeSystem, default: DrugCodeSystem.NDC }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DrugCodeSystem),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "codeSystem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Drug name in English' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "drugName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Drug name in Arabic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "drugNameAr", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Generic name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "genericName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dosage (e.g., "500mg")' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Route (e.g., oral, IV, topical)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Frequency (e.g., "twice daily")' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Duration (e.g., "7 days")' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quantity' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of refills', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePrescriptionDto.prototype, "refills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Instructions in English' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Instructions in Arabic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "instructionsAr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID who prescribed' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "prescribedBy", void 0);
// DTO for updating a prescription order
class UpdatePrescriptionDto {
    dosage;
    frequency;
    duration;
    quantity;
    refills;
    instructions;
    instructionsAr;
    status;
}
exports.UpdatePrescriptionDto = UpdatePrescriptionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dosage' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Frequency' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Duration' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quantity' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of refills' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePrescriptionDto.prototype, "refills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Instructions in English' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Instructions in Arabic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "instructionsAr", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Status', enum: PrescriptionStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PrescriptionStatus),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "status", void 0);
// Response DTO
class PrescriptionResponseDto {
    id;
    tenantId;
    encounterId;
    patientId;
    drugCode;
    codeSystem;
    drugName;
    drugNameAr;
    genericName;
    dosage;
    route;
    frequency;
    duration;
    quantity;
    refills;
    instructions;
    instructionsAr;
    status;
    prescribedBy;
    prescribedAt;
    createdAt;
    updatedAt;
}
exports.PrescriptionResponseDto = PrescriptionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "drugCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: DrugCodeSystem }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "codeSystem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "drugName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "drugNameAr", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "genericName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PrescriptionResponseDto.prototype, "refills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "instructionsAr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PrescriptionStatus }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "prescribedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PrescriptionResponseDto.prototype, "prescribedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PrescriptionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PrescriptionResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=prescription.dto.js.map