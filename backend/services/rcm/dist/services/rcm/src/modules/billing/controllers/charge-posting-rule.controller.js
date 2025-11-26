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
exports.ChargePostingRuleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const charge_posting_service_1 = require("../services/charge-posting.service");
const charge_posting_rule_dto_1 = require("../dto/charge-posting-rule.dto");
let ChargePostingRuleController = class ChargePostingRuleController {
    chargePostingService;
    constructor(chargePostingService) {
        this.chargePostingService = chargePostingService;
    }
    // ========================================
    // RULE MANAGEMENT ENDPOINTS
    // ========================================
    async createRule(tenantId, userId, dto) {
        return this.chargePostingService.createRule(tenantId, dto, userId);
    }
    async findAllRules(tenantId, eventType, eventSource, billingItemType, isActive) {
        const filters = {};
        if (eventType !== undefined)
            filters.eventType = eventType;
        if (eventSource !== undefined)
            filters.eventSource = eventSource;
        if (billingItemType !== undefined)
            filters.billingItemType = billingItemType;
        if (isActive !== undefined)
            filters.isActive = isActive === 'true';
        return this.chargePostingService.findAllRules(tenantId, filters);
    }
    async findActiveRules(tenantId, eventType) {
        const filters = { isActive: true };
        if (eventType !== undefined)
            filters.eventType = eventType;
        return this.chargePostingService.findAllRules(tenantId, filters);
    }
    async findRuleById(tenantId, id) {
        return this.chargePostingService.findRuleById(tenantId, id);
    }
    async updateRule(tenantId, userId, id, dto) {
        return this.chargePostingService.updateRule(tenantId, id, dto, userId);
    }
    async activateRule(tenantId, userId, id) {
        return this.chargePostingService.setRuleActive(tenantId, id, true, userId);
    }
    async deactivateRule(tenantId, userId, id) {
        return this.chargePostingService.setRuleActive(tenantId, id, false, userId);
    }
    async deleteRule(tenantId, id) {
        return this.chargePostingService.deleteRule(tenantId, id);
    }
    // ========================================
    // EVENT PROCESSING ENDPOINTS
    // ========================================
    async processEvent(tenantId, dto) {
        return this.chargePostingService.processEvent(tenantId, dto);
    }
    async reprocessEvent(tenantId, eventId) {
        return this.chargePostingService.reprocessEvent(tenantId, eventId);
    }
    // ========================================
    // EVENT QUERY ENDPOINTS
    // ========================================
    async findAllEvents(tenantId, eventType, processed, patientId, encounterId, dateFrom, dateTo) {
        const filters = {};
        if (eventType !== undefined)
            filters.eventType = eventType;
        if (processed !== undefined)
            filters.processed = processed === 'true';
        if (patientId !== undefined)
            filters.patientId = patientId;
        if (encounterId !== undefined)
            filters.encounterId = encounterId;
        if (dateFrom !== undefined)
            filters.dateFrom = new Date(dateFrom);
        if (dateTo !== undefined)
            filters.dateTo = new Date(dateTo);
        return this.chargePostingService.findAllEvents(tenantId, filters);
    }
    async findEventById(tenantId, id) {
        return this.chargePostingService.findEventById(tenantId, id);
    }
    async findEventsByPatient(tenantId, patientId) {
        return this.chargePostingService.findEventsByPatient(tenantId, patientId);
    }
    async findEventsByEncounter(tenantId, encounterId) {
        return this.chargePostingService.findEventsByEncounter(tenantId, encounterId);
    }
    // ========================================
    // AUDIT QUERY ENDPOINTS
    // ========================================
    async findAllAuditRecords(tenantId, ruleId, chargeId, eventId, dateFrom, dateTo) {
        const filters = {};
        if (ruleId !== undefined)
            filters.ruleId = ruleId;
        if (chargeId !== undefined)
            filters.chargeId = chargeId;
        if (eventId !== undefined)
            filters.eventId = eventId;
        if (dateFrom !== undefined)
            filters.dateFrom = new Date(dateFrom);
        if (dateTo !== undefined)
            filters.dateTo = new Date(dateTo);
        return this.chargePostingService.findAllAuditRecords(tenantId, filters);
    }
    async findAuditByRule(tenantId, ruleId) {
        return this.chargePostingService.findAuditByRule(tenantId, ruleId);
    }
    async findAuditByCharge(tenantId, chargeId) {
        return this.chargePostingService.findAuditByCharge(tenantId, chargeId);
    }
    // ========================================
    // STATISTICS ENDPOINTS
    // ========================================
    async getRuleStatistics(tenantId, dateFrom, dateTo) {
        const filters = {};
        if (dateFrom !== undefined)
            filters.dateFrom = new Date(dateFrom);
        if (dateTo !== undefined)
            filters.dateTo = new Date(dateTo);
        return this.chargePostingService.getRuleStatistics(tenantId, filters);
    }
    async getEventStatistics(tenantId, dateFrom, dateTo) {
        const filters = {};
        if (dateFrom !== undefined)
            filters.dateFrom = new Date(dateFrom);
        if (dateTo !== undefined)
            filters.dateTo = new Date(dateTo);
        return this.chargePostingService.getEventStatistics(tenantId, filters);
    }
};
exports.ChargePostingRuleController = ChargePostingRuleController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new charge posting rule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Rule created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, charge_posting_rule_dto_1.CreateChargePostingRuleDto]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "createRule", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all charge posting rules for tenant' }),
    (0, swagger_1.ApiQuery)({ name: 'eventType', required: false, enum: charge_posting_rule_dto_1.EventType }),
    (0, swagger_1.ApiQuery)({ name: 'eventSource', required: false, enum: charge_posting_rule_dto_1.EventSource }),
    (0, swagger_1.ApiQuery)({ name: 'billingItemType', required: false, enum: charge_posting_rule_dto_1.BillingItemType }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rules retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('eventType')),
    __param(2, (0, common_1.Query)('eventSource')),
    __param(3, (0, common_1.Query)('billingItemType')),
    __param(4, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "findAllRules", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active charge posting rules' }),
    (0, swagger_1.ApiQuery)({ name: 'eventType', required: false, enum: charge_posting_rule_dto_1.EventType }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active rules retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('eventType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "findActiveRules", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get charge posting rule by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rule found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "findRuleById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update charge posting rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rule updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, charge_posting_rule_dto_1.UpdateChargePostingRuleDto]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "updateRule", null);
__decorate([
    (0, common_1.Put)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate charge posting rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rule activated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "activateRule", null);
__decorate([
    (0, common_1.Put)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate charge posting rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rule deactivated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "deactivateRule", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete charge posting rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rule deleted successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "deleteRule", null);
__decorate([
    (0, common_1.Post)('process-event'),
    (0, swagger_1.ApiOperation)({ summary: 'Process a clinical event and create charges based on rules' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Event processed successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, charge_posting_rule_dto_1.ProcessEventDto]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "processEvent", null);
__decorate([
    (0, common_1.Post)('events/:eventId/reprocess'),
    (0, swagger_1.ApiOperation)({ summary: 'Reprocess an existing event' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event reprocessed successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "reprocessEvent", null);
__decorate([
    (0, common_1.Get)('events/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all charge posting events' }),
    (0, swagger_1.ApiQuery)({ name: 'eventType', required: false, enum: charge_posting_rule_dto_1.EventType }),
    (0, swagger_1.ApiQuery)({ name: 'processed', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'encounterId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Events retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('eventType')),
    __param(2, (0, common_1.Query)('processed')),
    __param(3, (0, common_1.Query)('patientId')),
    __param(4, (0, common_1.Query)('encounterId')),
    __param(5, (0, common_1.Query)('dateFrom')),
    __param(6, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "findAllEvents", null);
__decorate([
    (0, common_1.Get)('events/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get charge posting event by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "findEventById", null);
__decorate([
    (0, common_1.Get)('events/patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get events by patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Events retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "findEventsByPatient", null);
__decorate([
    (0, common_1.Get)('events/encounter/:encounterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get events by encounter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Events retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "findEventsByEncounter", null);
__decorate([
    (0, common_1.Get)('audit/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all charge posting audit records' }),
    (0, swagger_1.ApiQuery)({ name: 'ruleId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'chargeId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'eventId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit records retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('ruleId')),
    __param(2, (0, common_1.Query)('chargeId')),
    __param(3, (0, common_1.Query)('eventId')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "findAllAuditRecords", null);
__decorate([
    (0, common_1.Get)('audit/rule/:ruleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit records for a specific rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit records retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('ruleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "findAuditByRule", null);
__decorate([
    (0, common_1.Get)('audit/charge/:chargeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit records for a specific charge' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit records retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('chargeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "findAuditByCharge", null);
__decorate([
    (0, common_1.Get)('statistics/rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rule execution statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "getRuleStatistics", null);
__decorate([
    (0, common_1.Get)('statistics/events'),
    (0, swagger_1.ApiOperation)({ summary: 'Get event processing statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ChargePostingRuleController.prototype, "getEventStatistics", null);
exports.ChargePostingRuleController = ChargePostingRuleController = __decorate([
    (0, swagger_1.ApiTags)('Charge Posting Rules'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('charge-posting-rules'),
    __metadata("design:paramtypes", [charge_posting_service_1.ChargePostingService])
], ChargePostingRuleController);
//# sourceMappingURL=charge-posting-rule.controller.js.map