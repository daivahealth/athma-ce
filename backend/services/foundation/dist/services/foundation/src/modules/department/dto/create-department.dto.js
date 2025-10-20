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
exports.CreateDepartmentDto = exports.DepartmentType = void 0;
const class_validator_1 = require("class-validator");
var DepartmentType;
(function (DepartmentType) {
    DepartmentType["OPD"] = "opd";
    DepartmentType["IPD"] = "ipd";
    DepartmentType["RADIOLOGY"] = "radiology";
    DepartmentType["LABORATORY"] = "laboratory";
    DepartmentType["SURGERY"] = "surgery";
    DepartmentType["EMERGENCY"] = "emergency";
    DepartmentType["PHARMACY"] = "pharmacy";
})(DepartmentType || (exports.DepartmentType = DepartmentType = {}));
class CreateDepartmentDto {
    name;
    code;
    departmentType;
    headOfDepartment;
    floorNumber;
    phoneExtension;
    operatingHours;
    status;
}
exports.CreateDepartmentDto = CreateDepartmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(DepartmentType),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "departmentType", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "headOfDepartment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "floorNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "phoneExtension", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDepartmentDto.prototype, "operatingHours", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "status", void 0);
//# sourceMappingURL=create-department.dto.js.map