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
exports.CreateWardDto = exports.WardType = void 0;
const class_validator_1 = require("class-validator");
var WardType;
(function (WardType) {
    WardType["GENERAL"] = "general";
    WardType["ICU"] = "icu";
    WardType["NICU"] = "nicu";
    WardType["PICU"] = "picu";
    WardType["ISOLATION"] = "isolation";
    WardType["MATERNITY"] = "maternity";
})(WardType || (exports.WardType = WardType = {}));
class CreateWardDto {
    name;
    code;
    wardType;
    floorNumber;
    totalBeds;
    nursingStation;
    status;
}
exports.CreateWardDto = CreateWardDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(WardType),
    __metadata("design:type", String)
], CreateWardDto.prototype, "wardType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "floorNumber", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateWardDto.prototype, "totalBeds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "nursingStation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWardDto.prototype, "status", void 0);
//# sourceMappingURL=create-ward.dto.js.map