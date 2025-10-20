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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicStandaloneController = exports.ClinicController = void 0;
const common_1 = require("@nestjs/common");
const clinic_service_1 = require("./clinic.service");
const create_clinic_dto_1 = require("./dto/create-clinic.dto");
const update_clinic_dto_1 = require("./dto/update-clinic.dto");
let ClinicController = class ClinicController {
    clinicService;
    constructor(clinicService) {
        this.clinicService = clinicService;
    }
    create(departmentId, createClinicDto) {
        return this.clinicService.create(departmentId, createClinicDto);
    }
    findAll(departmentId, specialty) {
        return this.clinicService.findAll(departmentId, specialty);
    }
};
exports.ClinicController = ClinicController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('departmentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_clinic_dto_1.CreateClinicDto]),
    __metadata("design:returntype", void 0)
], ClinicController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('departmentId')),
    __param(1, (0, common_1.Query)('specialty')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClinicController.prototype, "findAll", null);
exports.ClinicController = ClinicController = __decorate([
    (0, common_1.Controller)('departments/:departmentId/clinics'),
    __metadata("design:paramtypes", [clinic_service_1.ClinicService])
], ClinicController);
// Standalone clinic controller for direct access
let ClinicStandaloneController = class ClinicStandaloneController {
    clinicService;
    constructor(clinicService) {
        this.clinicService = clinicService;
    }
    findOne(id) {
        return this.clinicService.findOne(id);
    }
    update(id, updateClinicDto) {
        return this.clinicService.update(id, updateClinicDto);
    }
    remove(id) {
        return this.clinicService.remove(id);
    }
};
exports.ClinicStandaloneController = ClinicStandaloneController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClinicStandaloneController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_clinic_dto_1.UpdateClinicDto]),
    __metadata("design:returntype", void 0)
], ClinicStandaloneController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClinicStandaloneController.prototype, "remove", null);
exports.ClinicStandaloneController = ClinicStandaloneController = __decorate([
    (0, common_1.Controller)('clinics'),
    __metadata("design:paramtypes", [clinic_service_1.ClinicService])
], ClinicStandaloneController);
//# sourceMappingURL=clinic.controller.js.map