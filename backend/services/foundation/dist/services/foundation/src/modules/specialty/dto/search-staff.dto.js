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
exports.SearchStaffBySpecialtyDto = exports.StaffType = void 0;
const class_validator_1 = require("class-validator");
var StaffType;
(function (StaffType) {
    StaffType["DOCTOR"] = "doctor";
    StaffType["NURSE"] = "nurse";
    StaffType["TECHNICIAN"] = "technician";
    StaffType["SUPPORT"] = "support";
})(StaffType || (exports.StaffType = StaffType = {}));
class SearchStaffBySpecialtyDto {
    specialtyCode;
    specialtyId;
    staffType;
    primaryOnly;
    activeOnly;
    facilityId;
    locale; // For translations (e.g., 'ar', 'en')
}
exports.SearchStaffBySpecialtyDto = SearchStaffBySpecialtyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchStaffBySpecialtyDto.prototype, "specialtyCode", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchStaffBySpecialtyDto.prototype, "specialtyId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(StaffType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchStaffBySpecialtyDto.prototype, "staffType", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SearchStaffBySpecialtyDto.prototype, "primaryOnly", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SearchStaffBySpecialtyDto.prototype, "activeOnly", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchStaffBySpecialtyDto.prototype, "facilityId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchStaffBySpecialtyDto.prototype, "locale", void 0);
//# sourceMappingURL=search-staff.dto.js.map