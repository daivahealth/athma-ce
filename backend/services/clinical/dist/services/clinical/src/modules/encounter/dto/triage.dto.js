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
exports.TriageResponseDto = exports.UpdateTriageDto = exports.CreateTriageDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
/**
 * DTO for creating a new triage record
 */
class CreateTriageDto {
    encounterId;
    patientId;
    triageStaffId;
    triageLevel;
    chiefComplaintsAndHPI;
    vitalSigns;
    painScore;
    allergies;
    currentMedications;
    triageNotes;
}
exports.CreateTriageDto = CreateTriageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Encounter ID this triage is associated with',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTriageDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Patient ID',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTriageDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff ID who performed the triage',
        example: '123e4567-e89b-12d3-a456-426614174002',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTriageDto.prototype, "triageStaffId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Triage priority level (1=Critical, 2=Emergency, 3=Urgent, 4=Semi-Urgent, 5=Non-Urgent)',
        example: 3,
        minimum: 1,
        maximum: 5,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateTriageDto.prototype, "triageLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Chief complaints and History of Present Illness (HPI)',
        example: 'Patient presents with acute chest pain radiating to left arm, started 2 hours ago...',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTriageDto.prototype, "chiefComplaintsAndHPI", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vital signs captured during triage',
        example: {
            temperature: 37.2,
            temperatureUnit: 'celsius',
            heartRate: 85,
            systolicBP: 130,
            diastolicBP: 85,
            respiratoryRate: 18,
            oxygenSaturation: 97,
            weight: 70,
            weightUnit: 'kg',
            height: 175,
            heightUnit: 'cm',
            bmi: 22.9,
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTriageDto.prototype, "vitalSigns", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pain score (0-10 scale)',
        example: 7,
        minimum: 0,
        maximum: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateTriageDto.prototype, "painScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient allergies',
        example: [
            { allergen: 'Penicillin', reaction: 'Rash', severity: 'Moderate' },
            { allergen: 'Peanuts', reaction: 'Anaphylaxis', severity: 'Severe' },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateTriageDto.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Current medications patient is taking',
        example: [
            { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily' },
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateTriageDto.prototype, "currentMedications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional triage notes and observations',
        example: 'Patient appears anxious, diaphoretic. Alert and oriented x3.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTriageDto.prototype, "triageNotes", void 0);
/**
 * DTO for updating an existing triage record
 */
class UpdateTriageDto {
    triageStaffId;
    triageLevel;
    chiefComplaintsAndHPI;
    vitalSigns;
    painScore;
    allergies;
    currentMedications;
    triageNotes;
}
exports.UpdateTriageDto = UpdateTriageDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Staff ID who performed the triage',
        example: '123e4567-e89b-12d3-a456-426614174002',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateTriageDto.prototype, "triageStaffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Triage priority level (1=Critical, 2=Emergency, 3=Urgent, 4=Semi-Urgent, 5=Non-Urgent)',
        example: 3,
        minimum: 1,
        maximum: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], UpdateTriageDto.prototype, "triageLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Chief complaints and History of Present Illness (HPI)',
        example: 'Patient presents with acute chest pain radiating to left arm, started 2 hours ago...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTriageDto.prototype, "chiefComplaintsAndHPI", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vital signs captured during triage',
        example: {
            temperature: 37.2,
            temperatureUnit: 'celsius',
            heartRate: 85,
            systolicBP: 130,
            diastolicBP: 85,
            respiratoryRate: 18,
            oxygenSaturation: 97,
            weight: 70,
            weightUnit: 'kg',
            height: 175,
            heightUnit: 'cm',
            bmi: 22.9,
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateTriageDto.prototype, "vitalSigns", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pain score (0-10 scale)',
        example: 7,
        minimum: 0,
        maximum: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdateTriageDto.prototype, "painScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient allergies',
        example: [
            { allergen: 'Penicillin', reaction: 'Rash', severity: 'Moderate' },
            { allergen: 'Peanuts', reaction: 'Anaphylaxis', severity: 'Severe' },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateTriageDto.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Current medications patient is taking',
        example: [
            { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily' },
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateTriageDto.prototype, "currentMedications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional triage notes and observations',
        example: 'Patient appears anxious, diaphoretic. Alert and oriented x3.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTriageDto.prototype, "triageNotes", void 0);
/**
 * Response DTO for triage data
 */
class TriageResponseDto {
    id;
    tenantId;
    encounterId;
    patientId;
    triageStaffId;
    triageLevel;
    chiefComplaintsAndHPI;
    vitalSigns;
    painScore;
    allergies;
    currentMedications;
    triageNotes;
    triageTime;
    createdAt;
    updatedAt;
}
exports.TriageResponseDto = TriageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TriageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TriageResponseDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TriageResponseDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TriageResponseDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TriageResponseDto.prototype, "triageStaffId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TriageResponseDto.prototype, "triageLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TriageResponseDto.prototype, "chiefComplaintsAndHPI", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], TriageResponseDto.prototype, "vitalSigns", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], TriageResponseDto.prototype, "painScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], TriageResponseDto.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], TriageResponseDto.prototype, "currentMedications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TriageResponseDto.prototype, "triageNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TriageResponseDto.prototype, "triageTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TriageResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TriageResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=triage.dto.js.map