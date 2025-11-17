"use strict";
/**
 * Catalog Controller
 *
 * REST API endpoints for managing master catalog data.
 * Routes: /catalogs/{medications|lab-tests|imaging-studies|procedures}
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
exports.CatalogController = void 0;
const common_1 = require("@nestjs/common");
const catalog_service_1 = require("./catalog.service");
let CatalogController = class CatalogController {
    catalogService;
    constructor(catalogService) {
        this.catalogService = catalogService;
    }
    getContext(req) {
        if (!req.context) {
            throw new Error('Request context not found');
        }
        return req.context;
    }
    // ========================================
    // MEDICATION ENDPOINTS
    // ========================================
    async listMedications(tenantId, isActive, search, includeGlobal) {
        return this.catalogService.listMedications({
            tenantId,
            isActive: isActive ? isActive === 'true' : undefined,
            search,
            includeGlobal: includeGlobal !== 'false',
        });
    }
    async getMedicationById(id) {
        return this.catalogService.getMedicationById(id);
    }
    async createMedication(data) {
        return this.catalogService.createMedication(data);
    }
    async updateMedication(id, data) {
        return this.catalogService.updateMedication(id, data);
    }
    async deactivateMedication(id) {
        return this.catalogService.deactivateMedication(id);
    }
    // ========================================
    // LAB TEST ENDPOINTS
    // ========================================
    async listLabTests(tenantId, isActive, search, includeGlobal) {
        return this.catalogService.listLabTests({
            tenantId,
            isActive: isActive ? isActive === 'true' : undefined,
            search,
            includeGlobal: includeGlobal !== 'false',
        });
    }
    async getLabTestById(id) {
        return this.catalogService.getLabTestById(id);
    }
    async createLabTest(data) {
        return this.catalogService.createLabTest(data);
    }
    async updateLabTest(id, data) {
        return this.catalogService.updateLabTest(id, data);
    }
    async deactivateLabTest(id) {
        return this.catalogService.deactivateLabTest(id);
    }
    // ========================================
    // IMAGING STUDY ENDPOINTS
    // ========================================
    async listImagingStudies(tenantId, isActive, search, includeGlobal) {
        return this.catalogService.listImagingStudies({
            tenantId,
            isActive: isActive ? isActive === 'true' : undefined,
            search,
            includeGlobal: includeGlobal !== 'false',
        });
    }
    async getImagingStudyById(id) {
        return this.catalogService.getImagingStudyById(id);
    }
    async createImagingStudy(data) {
        return this.catalogService.createImagingStudy(data);
    }
    async updateImagingStudy(id, data) {
        return this.catalogService.updateImagingStudy(id, data);
    }
    async deactivateImagingStudy(id) {
        return this.catalogService.deactivateImagingStudy(id);
    }
    // ========================================
    // PROCEDURE ENDPOINTS
    // ========================================
    async listProcedures(tenantId, isActive, search, includeGlobal) {
        return this.catalogService.listProcedures({
            tenantId,
            isActive: isActive ? isActive === 'true' : undefined,
            search,
            includeGlobal: includeGlobal !== 'false',
        });
    }
    async getProcedureById(id) {
        return this.catalogService.getProcedureById(id);
    }
    async createProcedure(data) {
        return this.catalogService.createProcedure(data);
    }
    async updateProcedure(id, data) {
        return this.catalogService.updateProcedure(id, data);
    }
    async deactivateProcedure(id) {
        return this.catalogService.deactivateProcedure(id);
    }
};
exports.CatalogController = CatalogController;
__decorate([
    (0, common_1.Get)('medications'),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('includeGlobal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "listMedications", null);
__decorate([
    (0, common_1.Get)('medications/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "getMedicationById", null);
__decorate([
    (0, common_1.Post)('medications'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "createMedication", null);
__decorate([
    (0, common_1.Put)('medications/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "updateMedication", null);
__decorate([
    (0, common_1.Delete)('medications/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "deactivateMedication", null);
__decorate([
    (0, common_1.Get)('lab-tests'),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('includeGlobal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "listLabTests", null);
__decorate([
    (0, common_1.Get)('lab-tests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "getLabTestById", null);
__decorate([
    (0, common_1.Post)('lab-tests'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "createLabTest", null);
__decorate([
    (0, common_1.Put)('lab-tests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "updateLabTest", null);
__decorate([
    (0, common_1.Delete)('lab-tests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "deactivateLabTest", null);
__decorate([
    (0, common_1.Get)('imaging-studies'),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('includeGlobal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "listImagingStudies", null);
__decorate([
    (0, common_1.Get)('imaging-studies/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "getImagingStudyById", null);
__decorate([
    (0, common_1.Post)('imaging-studies'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "createImagingStudy", null);
__decorate([
    (0, common_1.Put)('imaging-studies/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "updateImagingStudy", null);
__decorate([
    (0, common_1.Delete)('imaging-studies/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "deactivateImagingStudy", null);
__decorate([
    (0, common_1.Get)('procedures'),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('includeGlobal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "listProcedures", null);
__decorate([
    (0, common_1.Get)('procedures/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "getProcedureById", null);
__decorate([
    (0, common_1.Post)('procedures'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "createProcedure", null);
__decorate([
    (0, common_1.Put)('procedures/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "updateProcedure", null);
__decorate([
    (0, common_1.Delete)('procedures/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "deactivateProcedure", null);
exports.CatalogController = CatalogController = __decorate([
    (0, common_1.Controller)('catalogs'),
    __metadata("design:paramtypes", [catalog_service_1.CatalogService])
], CatalogController);
//# sourceMappingURL=catalog.controller.js.map