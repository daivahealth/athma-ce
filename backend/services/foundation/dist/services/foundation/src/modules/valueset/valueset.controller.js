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
exports.ValueSetController = void 0;
const common_1 = require("@nestjs/common");
const valueset_service_1 = require("./valueset.service");
const query_valueset_dto_1 = require("./dto/query-valueset.dto");
let ValueSetController = class ValueSetController {
    valueSetService;
    constructor(valueSetService) {
        this.valueSetService = valueSetService;
    }
    /**
     * GET /api/v1/valuesets
     * Get all valuesets with optional filtering
     */
    async findAll(query) {
        return this.valueSetService.findAll(query);
    }
    /**
     * GET /api/v1/valuesets/categories
     * Get all available categories
     */
    async getCategories() {
        return this.valueSetService.getCategories();
    }
    /**
     * GET /api/v1/valuesets/search
     * Search concepts across valuesets
     */
    async searchConcepts(searchTerm, valueSetCode, language) {
        return this.valueSetService.searchConcepts(searchTerm, valueSetCode, language);
    }
    /**
     * GET /api/v1/valuesets/:code
     * Get a specific valueset by code
     */
    async findOne(code) {
        return this.valueSetService.findOne(code);
    }
    /**
     * GET /api/v1/valuesets/:code/concepts
     * Get concepts for a valueset with optional language and tenant overrides
     */
    async getConcepts(code, options) {
        return this.valueSetService.getConcepts(code, options);
    }
};
exports.ValueSetController = ValueSetController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_valueset_dto_1.QueryValueSetDto]),
    __metadata("design:returntype", Promise)
], ValueSetController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ValueSetController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('valueSetCode')),
    __param(2, (0, common_1.Query)('language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ValueSetController.prototype, "searchConcepts", null);
__decorate([
    (0, common_1.Get)(':code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ValueSetController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':code/concepts'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_valueset_dto_1.GetConceptsDto]),
    __metadata("design:returntype", Promise)
], ValueSetController.prototype, "getConcepts", null);
exports.ValueSetController = ValueSetController = __decorate([
    (0, common_1.Controller)('valuesets'),
    __metadata("design:paramtypes", [valueset_service_1.ValueSetService])
], ValueSetController);
//# sourceMappingURL=valueset.controller.js.map