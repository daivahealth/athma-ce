"use strict";
/**
 * Patient Document Controller
 *
 * REST API endpoints for patient document management
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
exports.PatientDocumentController = void 0;
const common_1 = require("@nestjs/common");
const patient_document_service_1 = require("./patient-document.service");
let PatientDocumentController = class PatientDocumentController {
    documentService;
    constructor(documentService) {
        this.documentService = documentService;
    }
    /**
     * POST /patients/:patientId/documents - Add document
     */
    async addDocument(patientId, dto, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        // Convert dates if provided
        const documentData = {
            ...dto,
            issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
            expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        };
        return this.documentService.addDocument(tenantId, patientId, documentData);
    }
    /**
     * GET /patients/:patientId/documents - Get all documents
     */
    async getDocuments(patientId, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.documentService.getPatientDocuments(tenantId, patientId);
    }
    /**
     * GET /patients/:patientId/documents/:documentId - Get document by ID
     */
    async getDocument(documentId, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.documentService.getDocumentById(tenantId, documentId);
    }
    /**
     * PUT /patients/:patientId/documents/:documentId/verify - Verify document
     */
    async verifyDocument(documentId, body, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        const verifiedBy = req.user?.id || 'system';
        return this.documentService.verifyDocument(tenantId, documentId, verifiedBy, body.status);
    }
    /**
     * DELETE /patients/:patientId/documents/:documentId - Delete document
     */
    async deleteDocument(documentId, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.documentService.deleteDocument(tenantId, documentId);
    }
};
exports.PatientDocumentController = PatientDocumentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentController.prototype, "addDocument", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Get)(':documentId'),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentController.prototype, "getDocument", null);
__decorate([
    (0, common_1.Put)(':documentId/verify'),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentController.prototype, "verifyDocument", null);
__decorate([
    (0, common_1.Delete)(':documentId'),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentController.prototype, "deleteDocument", null);
exports.PatientDocumentController = PatientDocumentController = __decorate([
    (0, common_1.Controller)('patients/:patientId/documents'),
    __metadata("design:paramtypes", [patient_document_service_1.PatientDocumentService])
], PatientDocumentController);
//# sourceMappingURL=patient-document.controller.js.map