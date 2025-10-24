"use strict";
/**
 * Patient History Controller
 *
 * REST API endpoints for patient history tracking
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientHistoryController = void 0;
const common_1 = require("@nestjs/common");
const patient_history_service_1 = require("./patient-history.service");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class HistoryQueryDto {
    limit;
    offset;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], HistoryQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], HistoryQueryDto.prototype, "offset", void 0);
let PatientHistoryController = class PatientHistoryController {
    historyService;
    constructor(historyService) {
        this.historyService = historyService;
    }
    /**
     * GET /patients/:patientId/history - Get patient history
     */
    async getHistory(patientId, query, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.historyService.getPatientHistory(tenantId, patientId, query);
    }
    /**
     * GET /patients/:patientId/history/field/:fieldName - Get field history
     */
    async getFieldHistory(patientId, fieldName, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.historyService.getFieldHistory(tenantId, patientId, fieldName);
    }
    /**
     * GET /patients/:patientId/history/pending-approvals - Get pending approvals
     */
    async getPendingApprovals(req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.historyService.getPendingApprovals(tenantId);
    }
    /**
     * GET /patients/:patientId/history/stats - Get change statistics
     */
    async getStats(req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.historyService.getChangeStats(tenantId);
    }
};
exports.PatientHistoryController = PatientHistoryController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, HistoryQueryDto, Object]),
    __metadata("design:returntype", Promise)
], PatientHistoryController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('field/:fieldName'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Param)('fieldName')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PatientHistoryController.prototype, "getFieldHistory", null);
__decorate([
    (0, common_1.Get)('pending-approvals'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientHistoryController.prototype, "getPendingApprovals", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientHistoryController.prototype, "getStats", null);
exports.PatientHistoryController = PatientHistoryController = __decorate([
    (0, common_1.Controller)('patients/:patientId/history'),
    __metadata("design:paramtypes", [patient_history_service_1.PatientHistoryService])
], PatientHistoryController);
//# sourceMappingURL=patient-history.controller.js.map