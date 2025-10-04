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
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ClinicalService } from './clinical.service';
let ClinicalController = class ClinicalController {
    clinicalService;
    constructor(clinicalService) {
        this.clinicalService = clinicalService;
    }
    async getTemplates(query) {
        return this.clinicalService.getTemplates(query);
    }
    async createTemplate(templateDto) {
        return this.clinicalService.createTemplate(templateDto);
    }
    async getMedications(query) {
        return this.clinicalService.getMedications(query);
    }
    async searchMedications(query) {
        return this.clinicalService.searchMedications(query);
    }
    async getDiagnoses(query) {
        return this.clinicalService.getDiagnoses(query);
    }
    async searchDiagnoses(query) {
        return this.clinicalService.searchDiagnoses(query);
    }
};
__decorate([
    Get('templates'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "getTemplates", null);
__decorate([
    Post('templates'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "createTemplate", null);
__decorate([
    Get('medications'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "getMedications", null);
__decorate([
    Get('medications/search'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "searchMedications", null);
__decorate([
    Get('diagnoses'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "getDiagnoses", null);
__decorate([
    Get('diagnoses/search'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "searchDiagnoses", null);
ClinicalController = __decorate([
    Controller('clinical'),
    __metadata("design:paramtypes", [ClinicalService])
], ClinicalController);
export { ClinicalController };
//# sourceMappingURL=clinical.controller.js.map