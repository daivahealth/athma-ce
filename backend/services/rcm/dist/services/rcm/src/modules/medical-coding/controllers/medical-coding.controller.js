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
exports.MedicalCodingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const medical_coding_service_1 = require("../services/medical-coding.service");
const medical_coding_dto_1 = require("../dto/medical-coding.dto");
let MedicalCodingController = class MedicalCodingController {
    medicalCodingService;
    constructor(medicalCodingService) {
        this.medicalCodingService = medicalCodingService;
    }
    // ========================================
    // CODING SESSION QUERY ENDPOINTS
    // ========================================
    async findAllSessions(tenantId, status, encounterId, patientId, dateFrom, dateTo, limit) {
        const filters = {};
        if (status)
            filters.status = status;
        if (encounterId)
            filters.encounterId = encounterId;
        if (patientId)
            filters.patientId = patientId;
        if (dateFrom)
            filters.dateFrom = dateFrom;
        if (dateTo)
            filters.dateTo = dateTo;
        if (limit)
            filters.limit = parseInt(limit);
        return this.medicalCodingService.findAllSessions(tenantId, filters);
    }
    async getPendingSessions(tenantId, limit) {
        const limitNumber = limit ? parseInt(limit) : 50;
        return this.medicalCodingService.getPendingCodingSessions(tenantId, limitNumber);
    }
    async findSessionById(tenantId, id) {
        return this.medicalCodingService.findSessionById(tenantId, id);
    }
    async findSessionByEncounter(tenantId, encounterId) {
        return this.medicalCodingService.getCodingSessionByEncounter(tenantId, encounterId);
    }
    // ========================================
    // CODER REVIEW WORKFLOW ENDPOINTS
    // ========================================
    async startReview(tenantId, userId, sessionId) {
        return this.medicalCodingService.startReview(tenantId, sessionId, userId);
    }
    async updateSession(tenantId, userId, sessionId, dto) {
        return this.medicalCodingService.updateSession(tenantId, sessionId, dto, userId);
    }
    async submitSession(tenantId, userId, sessionId, dto) {
        return this.medicalCodingService.submitSession(tenantId, sessionId, dto, userId);
    }
    // ========================================
    // DIAGNOSIS MANAGEMENT ENDPOINTS
    // ========================================
    async addDiagnosis(tenantId, userId, sessionId, dto) {
        return this.medicalCodingService.addDiagnosis(tenantId, sessionId, dto, userId);
    }
    async updateDiagnosis(userId, diagnosisId, dto) {
        return this.medicalCodingService.updateDiagnosis(diagnosisId, dto, userId);
    }
    async deleteDiagnosis(diagnosisId) {
        return this.medicalCodingService.deleteDiagnosis(diagnosisId);
    }
    // ========================================
    // PROCEDURE MANAGEMENT ENDPOINTS
    // ========================================
    async addProcedure(tenantId, userId, sessionId, dto) {
        return this.medicalCodingService.addProcedure(tenantId, sessionId, dto, userId);
    }
    async updateProcedure(userId, procedureId, dto) {
        return this.medicalCodingService.updateProcedure(procedureId, dto, userId);
    }
    async deleteProcedure(procedureId) {
        return this.medicalCodingService.deleteProcedure(procedureId);
    }
    // ========================================
    // AUDIT TRAIL ENDPOINTS
    // ========================================
    async getSessionAudit(tenantId, sessionId) {
        return this.medicalCodingService.getSessionAudit(tenantId, sessionId);
    }
    async getAuditLogs(tenantId, sessionId, userId, action, dateFrom, dateTo) {
        const filters = {};
        if (sessionId)
            filters.sessionId = sessionId;
        if (userId)
            filters.userId = userId;
        if (action)
            filters.action = action;
        if (dateFrom)
            filters.dateFrom = new Date(dateFrom);
        if (dateTo)
            filters.dateTo = new Date(dateTo);
        return this.medicalCodingService.getAuditLogs(tenantId, filters);
    }
    // ========================================
    // STATISTICS ENDPOINTS
    // ========================================
    async getCoderProductivity(tenantId, userId, dateFrom, dateTo) {
        const filters = {};
        if (userId)
            filters.userId = userId;
        if (dateFrom)
            filters.dateFrom = new Date(dateFrom);
        if (dateTo)
            filters.dateTo = new Date(dateTo);
        return this.medicalCodingService.getCoderProductivity(tenantId, filters);
    }
    async getSessionSummary(tenantId) {
        return this.medicalCodingService.getSessionSummary(tenantId);
    }
};
exports.MedicalCodingController = MedicalCodingController;
__decorate([
    (0, common_1.Get)('sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all coding sessions with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: medical_coding_dto_1.CodingSessionStatus }),
    (0, swagger_1.ApiQuery)({ name: 'encounterId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sessions retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('encounterId')),
    __param(3, (0, common_1.Query)('patientId')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "findAllSessions", null);
__decorate([
    (0, common_1.Get)('sessions/pending'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get pending coding sessions (coder inbox)',
        description: 'Returns sessions with status auto_generated or in_progress',
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Max results (default 50)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending sessions retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "getPendingSessions", null);
__decorate([
    (0, common_1.Get)('sessions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coding session by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "findSessionById", null);
__decorate([
    (0, common_1.Get)('sessions/encounter/:encounterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coding session by encounter ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "findSessionByEncounter", null);
__decorate([
    (0, common_1.Put)('sessions/:id/start-review'),
    (0, swagger_1.ApiOperation)({
        summary: 'Start coder review (change status to in_progress)',
        description: 'Claims a coding session for review by the current coder',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review started' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "startReview", null);
__decorate([
    (0, common_1.Put)('sessions/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update coding session',
        description: 'Update session details, diagnoses, and procedures during coder review',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, medical_coding_dto_1.UpdateCodingSessionDto]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "updateSession", null);
__decorate([
    (0, common_1.Post)('sessions/:id/submit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit coding session for claim generation',
        description: 'Changes status to completed and optionally triggers claim generation',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session submitted successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, medical_coding_dto_1.SubmitCodingSessionDto]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "submitSession", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/diagnoses'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new diagnosis to coding session' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Diagnosis added' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Param)('sessionId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, medical_coding_dto_1.CreateCodingDiagnosisDto]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "addDiagnosis", null);
__decorate([
    (0, common_1.Put)('diagnoses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a diagnosis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis updated' }),
    __param(0, (0, common_1.Headers)('x-user-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, medical_coding_dto_1.UpdateCodingDiagnosisDto]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "updateDiagnosis", null);
__decorate([
    (0, common_1.Delete)('diagnoses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a diagnosis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "deleteDiagnosis", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/procedures'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new procedure to coding session' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Procedure added' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Param)('sessionId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, medical_coding_dto_1.CreateCodingProcedureDto]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "addProcedure", null);
__decorate([
    (0, common_1.Put)('procedures/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a procedure' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Procedure updated' }),
    __param(0, (0, common_1.Headers)('x-user-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, medical_coding_dto_1.UpdateCodingProcedureDto]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "updateProcedure", null);
__decorate([
    (0, common_1.Delete)('procedures/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a procedure' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Procedure deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "deleteProcedure", null);
__decorate([
    (0, common_1.Get)('sessions/:sessionId/audit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get audit trail for a coding session',
        description: 'Returns all audit log entries showing changes made to the session',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit trail retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "getSessionAudit", null);
__decorate([
    (0, common_1.Get)('audit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get audit logs with filters',
        description: 'Query audit logs across all coding sessions',
    }),
    (0, swagger_1.ApiQuery)({ name: 'sessionId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'action', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit logs retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('sessionId')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('action')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('statistics/coder-productivity'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get coder productivity statistics',
        description: 'Returns metrics on sessions reviewed, avg time, etc. by coder',
    }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('dateFrom')),
    __param(3, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "getCoderProductivity", null);
__decorate([
    (0, common_1.Get)('statistics/session-summary'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get session statistics summary',
        description: 'Returns counts by status and other aggregate metrics',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicalCodingController.prototype, "getSessionSummary", null);
exports.MedicalCodingController = MedicalCodingController = __decorate([
    (0, swagger_1.ApiTags)('Medical Coding'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('medical-coding'),
    __metadata("design:paramtypes", [medical_coding_service_1.MedicalCodingService])
], MedicalCodingController);
//# sourceMappingURL=medical-coding.controller.js.map