"use strict";
/**
 * Schedule Controller
 *
 * REST API endpoints for managing resource schedules and blocks
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
exports.ScheduleController = void 0;
const common_1 = require("@nestjs/common");
const schedule_service_1 = require("./schedule.service");
const schedule_dto_1 = require("./dto/schedule.dto");
let ScheduleController = class ScheduleController {
    scheduleService;
    constructor(scheduleService) {
        this.scheduleService = scheduleService;
    }
    getContext(req) {
        return {
            userId: req.user?.id || 'system',
            tenantId: req.tenant?.id || 'default-tenant',
            facilityId: req.facility?.id || 'default-facility',
            userRole: req.user?.role || 'user',
        };
    }
    // ========================================
    // STAFF SCHEDULES
    // ========================================
    /**
     * POST /scheduling/staff-schedules - Create staff schedule
     */
    async createStaffSchedule(dto, req) {
        const context = this.getContext(req);
        return this.scheduleService.createStaffSchedule(dto, context);
    }
    /**
     * GET /scheduling/staff-schedules/:staffId - Get staff schedules
     */
    async getStaffSchedules(staffId, effectiveDate, includeExpired, facilityId, req) {
        const context = this.getContext(req);
        const filters = {
            includeExpired: includeExpired === 'true',
        };
        if (effectiveDate) {
            filters.effectiveDate = new Date(effectiveDate);
        }
        if (facilityId) {
            filters.facilityId = facilityId;
        }
        return this.scheduleService.getStaffSchedules(staffId, context, filters);
    }
    /**
     * PUT /scheduling/staff-schedules/:id - Update staff schedule
     */
    async updateStaffSchedule(id, dto, req) {
        const context = this.getContext(req);
        return this.scheduleService.updateStaffSchedule(id, dto, context);
    }
    /**
     * DELETE /scheduling/staff-schedules/:id - Delete staff schedule
     */
    async deleteStaffSchedule(id, req) {
        const context = this.getContext(req);
        await this.scheduleService.deleteStaffSchedule(id, context);
    }
    /**
     * POST /scheduling/staff-schedules/weekly - Create weekly schedule (bulk)
     */
    async createWeeklyStaffSchedule(dto, req) {
        const context = this.getContext(req);
        const scheduleOptions = {
            isAvailable: dto.isAvailable,
            effectiveFrom: dto.effectiveFrom,
        };
        if (dto.scheduleType) {
            scheduleOptions.scheduleType = dto.scheduleType;
        }
        if (dto.facilityId) {
            scheduleOptions.facilityId = dto.facilityId;
        }
        if (dto.effectiveTo) {
            scheduleOptions.effectiveTo = dto.effectiveTo;
        }
        if (dto.notes) {
            scheduleOptions.notes = dto.notes;
        }
        return this.scheduleService.createWeeklyStaffSchedule(dto.staffId, dto.days, dto.startTime, dto.endTime, scheduleOptions, context);
    }
    // ========================================
    // EQUIPMENT SCHEDULES
    // ========================================
    /**
     * POST /scheduling/equipment-schedules - Create equipment schedule
     */
    async createEquipmentSchedule(dto, req) {
        const context = this.getContext(req);
        return this.scheduleService.createEquipmentSchedule(dto, context);
    }
    /**
     * GET /scheduling/equipment-schedules/:equipmentId - Get equipment schedules
     */
    async getEquipmentSchedules(equipmentId, effectiveDate, includeExpired, req) {
        const context = this.getContext(req);
        const filters = {
            includeExpired: includeExpired === 'true',
        };
        if (effectiveDate) {
            filters.effectiveDate = new Date(effectiveDate);
        }
        return this.scheduleService.getEquipmentSchedules(equipmentId, context, filters);
    }
    /**
     * PUT /scheduling/equipment-schedules/:id - Update equipment schedule
     */
    async updateEquipmentSchedule(id, dto, req) {
        const context = this.getContext(req);
        return this.scheduleService.updateEquipmentSchedule(id, dto, context);
    }
    /**
     * DELETE /scheduling/equipment-schedules/:id - Delete equipment schedule
     */
    async deleteEquipmentSchedule(id, req) {
        const context = this.getContext(req);
        await this.scheduleService.deleteEquipmentSchedule(id, context);
    }
    // ========================================
    // SPACE SCHEDULES
    // ========================================
    /**
     * POST /scheduling/space-schedules - Create space schedule
     */
    async createSpaceSchedule(dto, req) {
        const context = this.getContext(req);
        return this.scheduleService.createSpaceSchedule(dto, context);
    }
    /**
     * GET /scheduling/space-schedules/:spaceId - Get space schedules
     */
    async getSpaceSchedules(spaceId, effectiveDate, includeExpired, req) {
        const context = this.getContext(req);
        const filters = {
            includeExpired: includeExpired === 'true',
        };
        if (effectiveDate) {
            filters.effectiveDate = new Date(effectiveDate);
        }
        return this.scheduleService.getSpaceSchedules(spaceId, context, filters);
    }
    /**
     * PUT /scheduling/space-schedules/:id - Update space schedule
     */
    async updateSpaceSchedule(id, dto, req) {
        const context = this.getContext(req);
        return this.scheduleService.updateSpaceSchedule(id, dto, context);
    }
    /**
     * DELETE /scheduling/space-schedules/:id - Delete space schedule
     */
    async deleteSpaceSchedule(id, req) {
        const context = this.getContext(req);
        await this.scheduleService.deleteSpaceSchedule(id, context);
    }
    // ========================================
    // RESOURCE BLOCKS
    // ========================================
    /**
     * POST /scheduling/resource-blocks - Create resource block
     */
    async createResourceBlock(dto, req) {
        const context = this.getContext(req);
        return this.scheduleService.createResourceBlock(dto, context);
    }
    /**
     * GET /scheduling/resource-blocks - Get resource blocks
     */
    async getResourceBlocks(resourceType, resourceId, startDate, endDate, approvalStatus, facilityId, req) {
        const context = this.getContext(req);
        const filters = {};
        if (resourceType) {
            filters.resourceType = resourceType;
        }
        if (resourceId) {
            filters.resourceId = resourceId;
        }
        if (startDate) {
            filters.startDate = new Date(startDate);
        }
        if (endDate) {
            filters.endDate = new Date(endDate);
        }
        if (approvalStatus) {
            filters.approvalStatus = approvalStatus;
        }
        if (facilityId) {
            filters.facilityId = facilityId;
        }
        return this.scheduleService.getResourceBlocks(context, filters);
    }
    /**
     * GET /scheduling/resource-blocks/pending - Get pending approval blocks
     */
    async getPendingBlocks(facilityId, req) {
        const context = this.getContext(req);
        return this.scheduleService.getPendingBlocks(context, facilityId);
    }
    /**
     * PUT /scheduling/resource-blocks/:id - Update resource block
     */
    async updateResourceBlock(id, dto, req) {
        const context = this.getContext(req);
        return this.scheduleService.updateResourceBlock(id, dto, context);
    }
    /**
     * POST /scheduling/resource-blocks/:id/approve - Approve resource block
     */
    async approveResourceBlock(id, req) {
        const context = this.getContext(req);
        return this.scheduleService.approveResourceBlock(id, context);
    }
    /**
     * POST /scheduling/resource-blocks/:id/reject - Reject resource block
     */
    async rejectResourceBlock(id, dto, req) {
        const context = this.getContext(req);
        return this.scheduleService.rejectResourceBlock(id, dto.reason, context);
    }
    /**
     * DELETE /scheduling/resource-blocks/:id - Delete resource block
     */
    async deleteResourceBlock(id, req) {
        const context = this.getContext(req);
        await this.scheduleService.deleteResourceBlock(id, context);
    }
    // ========================================
    // UTILITY ENDPOINTS
    // ========================================
    /**
     * GET /scheduling/resources/:resourceType/:resourceId/schedules/:date
     * Get all schedules for a resource on a specific date
     */
    async getResourceSchedulesForDate(resourceType, resourceId, date, req) {
        const context = this.getContext(req);
        return this.scheduleService.getResourceSchedulesForDate(resourceType, resourceId, new Date(date), context);
    }
};
exports.ScheduleController = ScheduleController;
__decorate([
    (0, common_1.Post)('staff-schedules'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.CreateStaffScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "createStaffSchedule", null);
__decorate([
    (0, common_1.Get)('staff-schedules/:staffId'),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Query)('effectiveDate')),
    __param(2, (0, common_1.Query)('includeExpired')),
    __param(3, (0, common_1.Query)('facilityId')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getStaffSchedules", null);
__decorate([
    (0, common_1.Put)('staff-schedules/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedule_dto_1.UpdateStaffScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "updateStaffSchedule", null);
__decorate([
    (0, common_1.Delete)('staff-schedules/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "deleteStaffSchedule", null);
__decorate([
    (0, common_1.Post)('staff-schedules/weekly'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.CreateWeeklyScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "createWeeklyStaffSchedule", null);
__decorate([
    (0, common_1.Post)('equipment-schedules'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.CreateEquipmentScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "createEquipmentSchedule", null);
__decorate([
    (0, common_1.Get)('equipment-schedules/:equipmentId'),
    __param(0, (0, common_1.Param)('equipmentId')),
    __param(1, (0, common_1.Query)('effectiveDate')),
    __param(2, (0, common_1.Query)('includeExpired')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getEquipmentSchedules", null);
__decorate([
    (0, common_1.Put)('equipment-schedules/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedule_dto_1.UpdateEquipmentScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "updateEquipmentSchedule", null);
__decorate([
    (0, common_1.Delete)('equipment-schedules/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "deleteEquipmentSchedule", null);
__decorate([
    (0, common_1.Post)('space-schedules'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.CreateSpaceScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "createSpaceSchedule", null);
__decorate([
    (0, common_1.Get)('space-schedules/:spaceId'),
    __param(0, (0, common_1.Param)('spaceId')),
    __param(1, (0, common_1.Query)('effectiveDate')),
    __param(2, (0, common_1.Query)('includeExpired')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getSpaceSchedules", null);
__decorate([
    (0, common_1.Put)('space-schedules/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedule_dto_1.UpdateSpaceScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "updateSpaceSchedule", null);
__decorate([
    (0, common_1.Delete)('space-schedules/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "deleteSpaceSchedule", null);
__decorate([
    (0, common_1.Post)('resource-blocks'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.CreateResourceBlockDto, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "createResourceBlock", null);
__decorate([
    (0, common_1.Get)('resource-blocks'),
    __param(0, (0, common_1.Query)('resourceType')),
    __param(1, (0, common_1.Query)('resourceId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('approvalStatus')),
    __param(5, (0, common_1.Query)('facilityId')),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getResourceBlocks", null);
__decorate([
    (0, common_1.Get)('resource-blocks/pending'),
    __param(0, (0, common_1.Query)('facilityId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getPendingBlocks", null);
__decorate([
    (0, common_1.Put)('resource-blocks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedule_dto_1.UpdateResourceBlockDto, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "updateResourceBlock", null);
__decorate([
    (0, common_1.Post)('resource-blocks/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "approveResourceBlock", null);
__decorate([
    (0, common_1.Post)('resource-blocks/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedule_dto_1.RejectResourceBlockDto, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "rejectResourceBlock", null);
__decorate([
    (0, common_1.Delete)('resource-blocks/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "deleteResourceBlock", null);
__decorate([
    (0, common_1.Get)('resources/:resourceType/:resourceId/schedules/:date'),
    __param(0, (0, common_1.Param)('resourceType')),
    __param(1, (0, common_1.Param)('resourceId')),
    __param(2, (0, common_1.Param)('date')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getResourceSchedulesForDate", null);
exports.ScheduleController = ScheduleController = __decorate([
    (0, common_1.Controller)('scheduling'),
    __metadata("design:paramtypes", [schedule_service_1.ScheduleService])
], ScheduleController);
//# sourceMappingURL=schedule.controller.js.map