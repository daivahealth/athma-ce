"use strict";
/**
 * Consent Template Controller
 *
 * REST API endpoints for consent template management
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
exports.ConsentTemplateController = void 0;
const common_1 = require("@nestjs/common");
const consent_template_service_1 = require("./consent-template.service");
let ConsentTemplateController = class ConsentTemplateController {
    templateService;
    constructor(templateService) {
        this.templateService = templateService;
    }
    /**
     * POST /consent-templates - Create template
     */
    async createTemplate(dto, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.templateService.createTemplate(tenantId, dto);
    }
    /**
     * GET /consent-templates - Get all templates
     */
    async getTemplates(category, consentType, required, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        const options = {
            category: category,
            consentType: consentType,
        };
        if (required === 'true') {
            options.required = true;
        }
        else if (required === 'false') {
            options.required = false;
        }
        return this.templateService.getTemplates(tenantId, options);
    }
    /**
     * GET /consent-templates/:templateCode - Get template by code
     */
    async getTemplate(templateCode, language, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        const lang = language || 'en';
        return this.templateService.getTemplate(tenantId, templateCode, lang);
    }
    /**
     * PUT /consent-templates/:templateCode - Update template
     */
    async updateTemplate(templateCode, dto, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.templateService.updateTemplate(tenantId, templateCode, dto);
    }
    /**
     * GET /consent-templates/required/list - Get required templates
     */
    async getRequiredTemplates(language, req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        const lang = language || 'en';
        return this.templateService.getRequiredTemplates(tenantId, lang);
    }
    /**
     * POST /consent-templates/seed - Seed default templates
     */
    async seedTemplates(req) {
        const tenantId = req.tenant?.id || 'default-tenant';
        return this.templateService.seedDefaultTemplates(tenantId);
    }
};
exports.ConsentTemplateController = ConsentTemplateController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ConsentTemplateController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('consentType')),
    __param(2, (0, common_1.Query)('required')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ConsentTemplateController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)(':templateCode'),
    __param(0, (0, common_1.Param)('templateCode')),
    __param(1, (0, common_1.Query)('language')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ConsentTemplateController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Put)(':templateCode'),
    __param(0, (0, common_1.Param)('templateCode')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ConsentTemplateController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Get)('required/list'),
    __param(0, (0, common_1.Query)('language')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConsentTemplateController.prototype, "getRequiredTemplates", null);
__decorate([
    (0, common_1.Post)('seed/defaults'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsentTemplateController.prototype, "seedTemplates", null);
exports.ConsentTemplateController = ConsentTemplateController = __decorate([
    (0, common_1.Controller)('consent-templates'),
    __metadata("design:paramtypes", [consent_template_service_1.ConsentTemplateService])
], ConsentTemplateController);
//# sourceMappingURL=consent-template.controller.js.map