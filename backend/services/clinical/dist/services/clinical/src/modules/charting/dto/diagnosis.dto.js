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
exports.DiagnosisResponseDto = exports.UpdateDiagnosisDto = exports.CreateDiagnosisDto = exports.DiagnosisType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
// Enum for diagnosis type
var DiagnosisType;
(function (DiagnosisType) {
    DiagnosisType["PRIMARY"] = "primary";
    DiagnosisType["SECONDARY"] = "secondary";
    DiagnosisType["RULE_OUT"] = "rule_out";
    DiagnosisType["DIFFERENTIAL"] = "differential";
})(DiagnosisType || (exports.DiagnosisType = DiagnosisType = {}));
// DTO for creating a diagnosis
class CreateDiagnosisDto {
    encounterId;
    patientId;
    icdCode;
    icdVersion;
    diagnosisName;
    diagnosisNameAr;
    diagnosisType;
    diagnosisRank;
    isPresentOnAdmission;
    isChronic;
    onsetDate;
    clinicalNotes;
    diagnosedBy;
}
exports.CreateDiagnosisDto = CreateDiagnosisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Encounter ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ICD-10 code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "icdCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ICD version', default: 'ICD-10' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "icdVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diagnosis name in English' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "diagnosisName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diagnosis name in Arabic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "diagnosisNameAr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diagnosis type', enum: DiagnosisType }),
    (0, class_validator_1.IsEnum)(DiagnosisType),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "diagnosisType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diagnosis rank (1 = primary, 2+ = secondary)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateDiagnosisDto.prototype, "diagnosisRank", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Present on admission flag' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDiagnosisDto.prototype, "isPresentOnAdmission", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Chronic condition flag' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDiagnosisDto.prototype, "isChronic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Onset date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "onsetDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinical notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "clinicalNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID who diagnosed' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "diagnosedBy", void 0);
// DTO for updating a diagnosis
class UpdateDiagnosisDto {
    diagnosisType;
    diagnosisRank;
    isPresentOnAdmission;
    isChronic;
    onsetDate;
    clinicalNotes;
}
exports.UpdateDiagnosisDto = UpdateDiagnosisDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diagnosis type', enum: DiagnosisType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DiagnosisType),
    __metadata("design:type", String)
], UpdateDiagnosisDto.prototype, "diagnosisType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diagnosis rank' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateDiagnosisDto.prototype, "diagnosisRank", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Present on admission flag' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDiagnosisDto.prototype, "isPresentOnAdmission", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Chronic condition flag' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDiagnosisDto.prototype, "isChronic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Onset date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateDiagnosisDto.prototype, "onsetDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinical notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDiagnosisDto.prototype, "clinicalNotes", void 0);
// Response DTO
class DiagnosisResponseDto {
    id;
    tenantId;
    encounterId;
    patientId;
    icdCode;
    icdVersion;
    diagnosisName;
    diagnosisNameAr;
    diagnosisType;
    diagnosisRank;
    isPresentOnAdmission;
    isChronic;
    onsetDate;
    clinicalNotes;
    diagnosedBy;
    diagnosedAt;
    createdAt;
    updatedAt;
}
exports.DiagnosisResponseDto = DiagnosisResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DiagnosisResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DiagnosisResponseDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DiagnosisResponseDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DiagnosisResponseDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DiagnosisResponseDto.prototype, "icdCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DiagnosisResponseDto.prototype, "icdVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DiagnosisResponseDto.prototype, "diagnosisName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], DiagnosisResponseDto.prototype, "diagnosisNameAr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: DiagnosisType }),
    __metadata("design:type", String)
], DiagnosisResponseDto.prototype, "diagnosisType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], DiagnosisResponseDto.prototype, "diagnosisRank", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], DiagnosisResponseDto.prototype, "isPresentOnAdmission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], DiagnosisResponseDto.prototype, "isChronic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], DiagnosisResponseDto.prototype, "onsetDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], DiagnosisResponseDto.prototype, "clinicalNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DiagnosisResponseDto.prototype, "diagnosedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DiagnosisResponseDto.prototype, "diagnosedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DiagnosisResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DiagnosisResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=diagnosis.dto.js.map