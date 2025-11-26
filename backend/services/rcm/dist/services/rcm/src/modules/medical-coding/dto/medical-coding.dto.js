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
exports.CreateCodingProcedureDto = exports.CreateCodingDiagnosisDto = exports.CodingSessionQueryDto = exports.SubmitCodingSessionDto = exports.UpdateCodingSessionDto = exports.UpdateCodingProcedureDto = exports.UpdateCodingDiagnosisDto = exports.DiagnosisType = exports.CodingSessionStatus = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
/**
 * Coding session status values
 */
var CodingSessionStatus;
(function (CodingSessionStatus) {
    CodingSessionStatus["AUTO_GENERATED"] = "auto_generated";
    CodingSessionStatus["IN_PROGRESS"] = "in_progress";
    CodingSessionStatus["COMPLETED"] = "completed";
    CodingSessionStatus["SUBMITTED"] = "submitted";
})(CodingSessionStatus || (exports.CodingSessionStatus = CodingSessionStatus = {}));
/**
 * Diagnosis type values
 */
var DiagnosisType;
(function (DiagnosisType) {
    DiagnosisType["PRIMARY"] = "primary";
    DiagnosisType["SECONDARY"] = "secondary";
    DiagnosisType["ADMITTING"] = "admitting";
    DiagnosisType["DISCHARGE"] = "discharge";
})(DiagnosisType || (exports.DiagnosisType = DiagnosisType = {}));
/**
 * DTO for updating a coding diagnosis
 */
class UpdateCodingDiagnosisDto {
    diagnosisCode;
    diagnosisCodeType;
    diagnosisDisplay;
    diagnosisDisplayAr;
    diagnosisType;
    sequence;
    usedForBilling;
}
exports.UpdateCodingDiagnosisDto = UpdateCodingDiagnosisDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ICD code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCodingDiagnosisDto.prototype, "diagnosisCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ICD version (ICD10, ICD11)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCodingDiagnosisDto.prototype, "diagnosisCodeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diagnosis display name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCodingDiagnosisDto.prototype, "diagnosisDisplay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diagnosis display name in Arabic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCodingDiagnosisDto.prototype, "diagnosisDisplayAr", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diagnosis type', enum: DiagnosisType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DiagnosisType),
    __metadata("design:type", String)
], UpdateCodingDiagnosisDto.prototype, "diagnosisType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sequence number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateCodingDiagnosisDto.prototype, "sequence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether to use for billing' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCodingDiagnosisDto.prototype, "usedForBilling", void 0);
/**
 * DTO for updating a coding procedure
 */
class UpdateCodingProcedureDto {
    procedureCode;
    procedureCodeType;
    procedureDisplay;
    procedureDisplayAr;
    units;
    sequence;
    serviceDate;
    modifiers;
}
exports.UpdateCodingProcedureDto = UpdateCodingProcedureDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Procedure code (CPT, HCPCS, etc.)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCodingProcedureDto.prototype, "procedureCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Code type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCodingProcedureDto.prototype, "procedureCodeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Procedure display name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCodingProcedureDto.prototype, "procedureDisplay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Procedure display name in Arabic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCodingProcedureDto.prototype, "procedureDisplayAr", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of units' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateCodingProcedureDto.prototype, "units", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sequence number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateCodingProcedureDto.prototype, "sequence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCodingProcedureDto.prototype, "serviceDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Modifier codes (comma-separated)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCodingProcedureDto.prototype, "modifiers", void 0);
/**
 * DTO for updating a coding session
 */
class UpdateCodingSessionDto {
    status;
    coderNotes;
    diagnoses;
    procedures;
}
exports.UpdateCodingSessionDto = UpdateCodingSessionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Session status', enum: CodingSessionStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CodingSessionStatus),
    __metadata("design:type", String)
], UpdateCodingSessionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Coder notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCodingSessionDto.prototype, "coderNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of diagnosis updates' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateCodingDiagnosisDto),
    __metadata("design:type", Array)
], UpdateCodingSessionDto.prototype, "diagnoses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of procedure updates' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateCodingProcedureDto),
    __metadata("design:type", Array)
], UpdateCodingSessionDto.prototype, "procedures", void 0);
/**
 * DTO for submitting a coding session
 */
class SubmitCodingSessionDto {
    coderNotes;
    generateClaim;
}
exports.SubmitCodingSessionDto = SubmitCodingSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coder final notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitCodingSessionDto.prototype, "coderNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether to generate claim immediately' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SubmitCodingSessionDto.prototype, "generateClaim", void 0);
/**
 * DTO for querying coding sessions
 */
class CodingSessionQueryDto {
    status;
    encounterId;
    patientId;
    dateFrom;
    dateTo;
    limit;
}
exports.CodingSessionQueryDto = CodingSessionQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by status', enum: CodingSessionStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CodingSessionStatus),
    __metadata("design:type", String)
], CodingSessionQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by encounter ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CodingSessionQueryDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by patient ID (via encounter)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CodingSessionQueryDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date from (ISO format)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CodingSessionQueryDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date to (ISO format)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CodingSessionQueryDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Limit results' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CodingSessionQueryDto.prototype, "limit", void 0);
/**
 * DTO for adding a new diagnosis to a coding session
 */
class CreateCodingDiagnosisDto {
    diagnosisCode;
    diagnosisCodeType;
    diagnosisDisplay;
    diagnosisDisplayAr;
    diagnosisType;
    sequence;
    usedForBilling;
}
exports.CreateCodingDiagnosisDto = CreateCodingDiagnosisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ICD code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodingDiagnosisDto.prototype, "diagnosisCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ICD version (ICD10, ICD11)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodingDiagnosisDto.prototype, "diagnosisCodeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diagnosis display name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodingDiagnosisDto.prototype, "diagnosisDisplay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diagnosis display name in Arabic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodingDiagnosisDto.prototype, "diagnosisDisplayAr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diagnosis type', enum: DiagnosisType }),
    (0, class_validator_1.IsEnum)(DiagnosisType),
    __metadata("design:type", String)
], CreateCodingDiagnosisDto.prototype, "diagnosisType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sequence number' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCodingDiagnosisDto.prototype, "sequence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether to use for billing', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCodingDiagnosisDto.prototype, "usedForBilling", void 0);
/**
 * DTO for adding a new procedure to a coding session
 */
class CreateCodingProcedureDto {
    billingItemId;
    procedureCode;
    procedureCodeType;
    procedureDisplay;
    procedureDisplayAr;
    units;
    sequence;
    serviceDate;
    modifier1;
    modifier2;
    modifier3;
}
exports.CreateCodingProcedureDto = CreateCodingProcedureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Billing item ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCodingProcedureDto.prototype, "billingItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Procedure code (CPT, HCPCS, etc.)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodingProcedureDto.prototype, "procedureCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Code type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodingProcedureDto.prototype, "procedureCodeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Procedure display name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodingProcedureDto.prototype, "procedureDisplay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Procedure display name in Arabic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodingProcedureDto.prototype, "procedureDisplayAr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of units' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCodingProcedureDto.prototype, "units", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sequence number' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCodingProcedureDto.prototype, "sequence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Service date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCodingProcedureDto.prototype, "serviceDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Modifier 1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodingProcedureDto.prototype, "modifier1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Modifier 2' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodingProcedureDto.prototype, "modifier2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Modifier 3' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodingProcedureDto.prototype, "modifier3", void 0);
//# sourceMappingURL=medical-coding.dto.js.map