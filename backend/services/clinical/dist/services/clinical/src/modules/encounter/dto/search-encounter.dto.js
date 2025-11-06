"use strict";
/**
 * DTO for searching encounters
 */
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
exports.SearchEncounterDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_encounter_dto_1 = require("./create-encounter.dto");
class SearchEncounterDto {
    patientId;
    primaryStaffId;
    facilityId;
    status;
    encounterClass;
    startDate;
    endDate;
    search; // Search in chief complaint, presenting symptoms
    page;
    limit;
}
exports.SearchEncounterDto = SearchEncounterDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchEncounterDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchEncounterDto.prototype, "primaryStaffId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchEncounterDto.prototype, "facilityId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(create_encounter_dto_1.EncounterStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchEncounterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(create_encounter_dto_1.EncounterClass),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchEncounterDto.prototype, "encounterClass", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchEncounterDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchEncounterDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchEncounterDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchEncounterDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchEncounterDto.prototype, "limit", void 0);
//# sourceMappingURL=search-encounter.dto.js.map