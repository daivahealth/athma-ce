"use strict";
/**
 * Consent Controller
 *
 * REST API endpoints for patient consent management
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
exports.ConsentController = void 0;
const common_1 = require("@nestjs/common");
const consent_service_1 = require("./consent.service");
const shared_types_1 = require("@zeal/shared-types");
let ConsentController = class ConsentController {
    consentService;
    constructor(consentService) {
        this.consentService = consentService;
    }
    /**
     * POST /patients/:patientId/consents - Create consent
     */
    async createConsent(patientId, dto, req) {
        const context = {
            userId: req.user?.id || 'system',
            tenantId: req.tenant?.id || 'default-tenant',
            facilityId: req.facility?.id || 'default-facility',
            userRole: req.user?.role || 'user',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        };
        const consentData = {
            patientId,
            consentType: dto.consentType,
            purpose: dto.purpose,
            description: dto.description,
            captureMethod: dto.captureMethod,
            signatureUrl: dto.signatureUrl,
            documentUrl: dto.documentUrl,
            witnessedBy: dto.witnessedBy,
            witnessSignatureUrl: dto.witnessSignatureUrl,
            linkedEntityType: dto.linkedEntityType,
            linkedEntityId: dto.linkedEntityId,
            metadata: dto.metadata,
        };
        if (dto.effectiveFrom) {
            consentData.effectiveFrom = new Date(dto.effectiveFrom);
        }
        if (dto.effectiveUntil) {
            consentData.effectiveUntil = new Date(dto.effectiveUntil);
        }
        return this.consentService.createConsent(consentData, context);
    }
    /**
     * GET /patients/:patientId/consents - Get patient consents
     */
    async getConsents(patientId, includeRevoked, category, consentType, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.consentService.getPatientConsents(tenantId, patientId, {
            includeRevoked: includeRevoked === 'true',
            category: category,
            consentType: consentType,
        });
    }
    /**
     * GET /patients/:patientId/consents/:consentId - Get consent by ID
     */
    async getConsent(consentId, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        // Simple implementation - fetch from database
        const consent = await this.consentService['prisma'].patientConsent.findUnique({
            where: { id: consentId },
        });
        if (!consent || consent.tenantId !== tenantId) {
            throw new Error('Consent not found');
        }
        return consent;
    }
    /**
     * POST /patients/:patientId/consents/:consentId/revoke - Revoke consent
     */
    async revokeConsent(consentId, dto, req) {
        const context = {
            userId: req.user?.id || 'system',
            tenantId: req.tenant?.id || 'default-tenant',
            facilityId: req.facility?.id || 'default-facility',
            userRole: req.user?.role || 'user',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        };
        return this.consentService.revokeConsent(consentId, dto, context);
    }
    /**
     * POST /patients/:patientId/consents/:consentId/renew - Renew consent
     */
    async renewConsent(consentId, req) {
        const context = {
            userId: req.user?.id || 'system',
            tenantId: req.tenant?.id || 'default-tenant',
            facilityId: req.facility?.id || 'default-facility',
            userRole: req.user?.role || 'user',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        };
        return this.consentService.renewConsent(consentId, context);
    }
    /**
     * GET /patients/:patientId/consents/history - Get consent history
     */
    async getConsentHistory(patientId, consentType, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.consentService.getConsentHistory(tenantId, patientId, consentType);
    }
    /**
     * GET /patients/:patientId/consents/required - Get required consents
     */
    async getRequiredConsents() {
        return {
            required: this.consentService.getRequiredConsents(),
        };
    }
    /**
     * GET /patients/:patientId/consents/validate - Validate required consents
     */
    async validateConsents(patientId, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.consentService.validateRequiredConsents(tenantId, patientId);
    }
    /**
     * POST /patients/:patientId/consents/bulk - Bulk create consents
     */
    async bulkCreateConsents(patientId, body, req) {
        const context = {
            userId: req.user?.id || 'system',
            tenantId: req.tenant?.id || 'default-tenant',
            facilityId: req.facility?.id || 'default-facility',
            userRole: req.user?.role || 'user',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        };
        return this.consentService.createBulkConsents(patientId, body.consents, context);
    }
    /**
     * GET /patients/:patientId/consents/audit - Get consent audit trail
     */
    async getAuditTrail(patientId, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.consentService.getConsentAuditTrail(tenantId, patientId);
    }
    /**
     * POST /patients/:patientId/consents/check-action - Check consent for action
     */
    async checkAction(patientId, body, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.consentService.checkConsentForAction(tenantId, patientId, body.action);
    }
    /**
     * GET /patients/:patientId/consents/export - Export consent data
     */
    async exportConsents(patientId, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.consentService.exportPatientConsents(tenantId, patientId);
    }
    /**
     * GET /patients/:patientId/consents/expiring - Get expiring consents
     */
    async getExpiringConsents(days, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        const daysUntilExpiry = days ? parseInt(days) : 30;
        return this.consentService.getExpiringConsents(tenantId, daysUntilExpiry);
    }
};
exports.ConsentController = ConsentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "createConsent", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('includeRevoked')),
    __param(2, (0, common_1.Query)('category')),
    __param(3, (0, common_1.Query)('consentType')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "getConsents", null);
__decorate([
    (0, common_1.Get)(':consentId'),
    __param(0, (0, common_1.Param)('consentId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "getConsent", null);
__decorate([
    (0, common_1.Post)(':consentId/revoke'),
    __param(0, (0, common_1.Param)('consentId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "revokeConsent", null);
__decorate([
    (0, common_1.Post)(':consentId/renew'),
    __param(0, (0, common_1.Param)('consentId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "renewConsent", null);
__decorate([
    (0, common_1.Get)('history/all'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('consentType')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "getConsentHistory", null);
__decorate([
    (0, common_1.Get)('required/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "getRequiredConsents", null);
__decorate([
    (0, common_1.Get)('validate/required'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "validateConsents", null);
__decorate([
    (0, common_1.Post)('bulk/create'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "bulkCreateConsents", null);
__decorate([
    (0, common_1.Get)('audit/trail'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "getAuditTrail", null);
__decorate([
    (0, common_1.Post)('check/action'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "checkAction", null);
__decorate([
    (0, common_1.Get)('export/data'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "exportConsents", null);
__decorate([
    (0, common_1.Get)('expiring/soon'),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "getExpiringConsents", null);
exports.ConsentController = ConsentController = __decorate([
    (0, common_1.Controller)('patients/:patientId/consents'),
    __metadata("design:paramtypes", [consent_service_1.ConsentService])
], ConsentController);
//# sourceMappingURL=consent.controller.js.map