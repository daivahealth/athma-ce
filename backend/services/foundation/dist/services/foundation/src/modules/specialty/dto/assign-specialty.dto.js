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
exports.BulkAssignSpecialtiesDto = exports.AssignSpecialtyDto = void 0;
const class_validator_1 = require("class-validator");
class AssignSpecialtyDto {
    facilityId;
    specialtyId;
    primaryFlag;
}
exports.AssignSpecialtyDto = AssignSpecialtyDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AssignSpecialtyDto.prototype, "facilityId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AssignSpecialtyDto.prototype, "specialtyId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AssignSpecialtyDto.prototype, "primaryFlag", void 0);
class BulkAssignSpecialtiesDto {
    facilityId;
    primarySpecialtyId;
    secondarySpecialtyIds;
}
exports.BulkAssignSpecialtiesDto = BulkAssignSpecialtiesDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BulkAssignSpecialtiesDto.prototype, "facilityId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BulkAssignSpecialtiesDto.prototype, "primarySpecialtyId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BulkAssignSpecialtiesDto.prototype, "secondarySpecialtyIds", void 0);
//# sourceMappingURL=assign-specialty.dto.js.map