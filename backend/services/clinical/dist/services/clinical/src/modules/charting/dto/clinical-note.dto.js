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
exports.ClinicalNoteResponseDto = exports.SignNoteDto = exports.UpdateNoteSectionsDto = exports.UpdateClinicalNoteDto = exports.CreateClinicalNoteDto = exports.ClinicalNoteSectionDto = exports.NoteLanguage = exports.NoteStatus = exports.NoteType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
// Enum for note types
var NoteType;
(function (NoteType) {
    NoteType["SOAP"] = "soap";
    NoteType["H_AND_P"] = "h_and_p";
    NoteType["PROGRESS"] = "progress";
    NoteType["DISCHARGE"] = "discharge";
    NoteType["PROCEDURE"] = "procedure";
    NoteType["CONSULTATION"] = "consultation";
})(NoteType || (exports.NoteType = NoteType = {}));
// Enum for note status
var NoteStatus;
(function (NoteStatus) {
    NoteStatus["DRAFT"] = "draft";
    NoteStatus["FINAL"] = "final";
    NoteStatus["AMENDED"] = "amended";
    NoteStatus["SIGNED"] = "signed";
})(NoteStatus || (exports.NoteStatus = NoteStatus = {}));
// Enum for language
var NoteLanguage;
(function (NoteLanguage) {
    NoteLanguage["EN"] = "en";
    NoteLanguage["AR"] = "ar";
})(NoteLanguage || (exports.NoteLanguage = NoteLanguage = {}));
// DTO for clinical note section
class ClinicalNoteSectionDto {
    sectionCode;
    sectionName;
    content;
    sortOrder;
    isEmpty;
}
exports.ClinicalNoteSectionDto = ClinicalNoteSectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Section code (e.g., subjective, objective, assessment, plan)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClinicalNoteSectionDto.prototype, "sectionCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Section name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClinicalNoteSectionDto.prototype, "sectionName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content as JSON (can be free-text or structured)' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ClinicalNoteSectionDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort order for section display' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ClinicalNoteSectionDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether section is empty' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ClinicalNoteSectionDto.prototype, "isEmpty", void 0);
// DTO for creating a clinical note
class CreateClinicalNoteDto {
    encounterId;
    patientId;
    noteType;
    language;
    title;
    authorStaffId;
    coSignStaffId;
    sections;
}
exports.CreateClinicalNoteDto = CreateClinicalNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Encounter ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateClinicalNoteDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateClinicalNoteDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Note type', enum: NoteType }),
    (0, class_validator_1.IsEnum)(NoteType),
    __metadata("design:type", String)
], CreateClinicalNoteDto.prototype, "noteType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Language', enum: NoteLanguage, default: NoteLanguage.EN }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(NoteLanguage),
    __metadata("design:type", String)
], CreateClinicalNoteDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Note title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClinicalNoteDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Author staff ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateClinicalNoteDto.prototype, "authorStaffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Co-signer staff ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateClinicalNoteDto.prototype, "coSignStaffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Note sections', type: [ClinicalNoteSectionDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ClinicalNoteSectionDto),
    __metadata("design:type", Array)
], CreateClinicalNoteDto.prototype, "sections", void 0);
// DTO for updating a clinical note
class UpdateClinicalNoteDto {
    title;
    status;
    coSignStaffId;
    amendmentReason;
}
exports.UpdateClinicalNoteDto = UpdateClinicalNoteDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Note title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClinicalNoteDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Note status', enum: NoteStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(NoteStatus),
    __metadata("design:type", String)
], UpdateClinicalNoteDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Co-signer staff ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateClinicalNoteDto.prototype, "coSignStaffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Amendment reason (required when status is amended)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClinicalNoteDto.prototype, "amendmentReason", void 0);
// DTO for adding/updating sections
class UpdateNoteSectionsDto {
    sections;
}
exports.UpdateNoteSectionsDto = UpdateNoteSectionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Note sections', type: [ClinicalNoteSectionDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ClinicalNoteSectionDto),
    __metadata("design:type", Array)
], UpdateNoteSectionsDto.prototype, "sections", void 0);
// DTO for signing a note
class SignNoteDto {
    staffId;
    isCoSign;
}
exports.SignNoteDto = SignNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID signing the note' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SignNoteDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether this is a co-signature' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SignNoteDto.prototype, "isCoSign", void 0);
// Response DTO
class ClinicalNoteResponseDto {
    id;
    tenantId;
    encounterId;
    patientId;
    noteType;
    language;
    title;
    status;
    version;
    authorStaffId;
    coSignStaffId;
    signedAt;
    coSignedAt;
    amendmentReason;
    supersededBy;
    createdAt;
    updatedAt;
    sections;
}
exports.ClinicalNoteResponseDto = ClinicalNoteResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: NoteType }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "noteType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: NoteLanguage }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: NoteStatus }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ClinicalNoteResponseDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "authorStaffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "coSignStaffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], ClinicalNoteResponseDto.prototype, "signedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], ClinicalNoteResponseDto.prototype, "coSignedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "amendmentReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "supersededBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ClinicalNoteResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ClinicalNoteResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ClinicalNoteSectionDto] }),
    __metadata("design:type", Array)
], ClinicalNoteResponseDto.prototype, "sections", void 0);
//# sourceMappingURL=clinical-note.dto.js.map