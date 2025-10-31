"use strict";
/**
 * Availability Controller
 *
 * REST API endpoints for checking resource availability and finding time slots
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
exports.AvailabilityController = void 0;
const common_1 = require("@nestjs/common");
const availability_service_1 = require("./availability.service");
const availability_dto_1 = require("./dto/availability.dto");
let AvailabilityController = class AvailabilityController {
    availabilityService;
    constructor(availabilityService) {
        this.availabilityService = availabilityService;
    }
    getContext(req) {
        return {
            userId: req.user?.id || 'system',
            tenantId: req.tenant?.id || 'default-tenant',
            facilityId: req.facility?.id || 'default-facility',
            userRole: req.user?.role || 'user',
        };
    }
    /**
     * POST /scheduling/availability/find-slots - Find available slots for a resource
     */
    async findAvailableSlots(dto, req) {
        const context = this.getContext(req);
        const options = {};
        if (dto.facilityId) {
            options.facilityId = dto.facilityId;
        }
        if (dto.slotInterval !== undefined) {
            options.slotInterval = dto.slotInterval;
        }
        if (dto.includePreparationTime !== undefined) {
            options.includePreparationTime = dto.includePreparationTime;
        }
        if (dto.preparationMinutes !== undefined) {
            options.preparationMinutes = dto.preparationMinutes;
        }
        if (dto.cleanupMinutes !== undefined) {
            options.cleanupMinutes = dto.cleanupMinutes;
        }
        return this.availabilityService.findAvailableSlots(dto.resourceType, dto.resourceId, dto.startDate, dto.endDate, dto.durationMinutes, context, options);
    }
    /**
     * POST /scheduling/availability/check-slot - Check if a specific slot is available
     */
    async checkSlotAvailability(dto, req) {
        const context = this.getContext(req);
        const isAvailable = await this.availabilityService.isSlotAvailable(dto.resourceType, dto.resourceId, dto.startTime, dto.endTime, context, {
            ...(dto.preparationStart ? { preparationStart: dto.preparationStart } : {}),
            ...(dto.cleanupEnd ? { cleanupEnd: dto.cleanupEnd } : {}),
        });
        return { isAvailable };
    }
    /**
     * POST /scheduling/availability/detect-conflicts - Detect conflicts for a resource at a specific time
     */
    async detectConflicts(dto, req) {
        const context = this.getContext(req);
        const conflicts = await this.availabilityService.detectConflicts(dto.resourceType, dto.resourceId, dto.startTime, dto.endTime, context, {
            ...(dto.preparationStart ? { preparationStart: dto.preparationStart } : {}),
            ...(dto.cleanupEnd ? { cleanupEnd: dto.cleanupEnd } : {}),
        });
        return { conflicts };
    }
    /**
     * POST /scheduling/availability/find-slots-for-appointment-type
     * Find available slots that satisfy all resource requirements for an appointment type
     */
    async findSlotsForAppointmentType(dto, req) {
        const context = this.getContext(req);
        const options = {};
        if (dto.facilityId) {
            options.facilityId = dto.facilityId;
        }
        if (dto.preferredStaffIds && dto.preferredStaffIds.length > 0) {
            options.preferredStaffIds = dto.preferredStaffIds;
        }
        if (dto.preferredTimeOfDay) {
            options.preferredTimeOfDay = dto.preferredTimeOfDay;
        }
        if (dto.slotInterval !== undefined) {
            options.slotInterval = dto.slotInterval;
        }
        return this.availabilityService.findAvailableSlotsForAppointmentType(dto.appointmentType, dto.startDate, dto.endDate, context, options);
    }
    /**
     * POST /scheduling/availability/utilization - Get resource utilization statistics
     */
    async getResourceUtilization(dto, req) {
        const context = this.getContext(req);
        return this.availabilityService.getResourceUtilization(dto.resourceType, dto.resourceId, dto.startDate, dto.endDate, context);
    }
    /**
     * POST /scheduling/availability/next-available - Find next available slot for a resource
     */
    async findNextAvailableSlot(dto, req) {
        const context = this.getContext(req);
        const options = {};
        if (dto.startFrom) {
            options.startFrom = dto.startFrom;
        }
        if (dto.maxDaysToSearch !== undefined) {
            options.maxDaysToSearch = dto.maxDaysToSearch;
        }
        const slot = await this.availabilityService.findNextAvailableSlot(dto.resourceType, dto.resourceId, dto.durationMinutes, context, options);
        return { slot };
    }
    /**
     * POST /scheduling/availability/suggest-alternatives - Suggest alternative time slots
     */
    async suggestAlternativeSlots(dto, req) {
        const context = this.getContext(req);
        const options = {};
        if (dto.maxAlternatives !== undefined) {
            options.maxAlternatives = dto.maxAlternatives;
        }
        if (dto.searchWindowDays !== undefined) {
            options.searchWindowDays = dto.searchWindowDays;
        }
        return this.availabilityService.suggestAlternativeSlots(dto.resourceType, dto.resourceId, dto.preferredStartTime, dto.durationMinutes, context, options);
    }
    /**
     * GET /scheduling/availability/resources/:resourceType/:resourceId/utilization
     * Get resource utilization (convenience GET endpoint)
     */
    async getResourceUtilizationByParams(resourceType, resourceId, startDate, endDate, req) {
        const context = this.getContext(req);
        return this.availabilityService.getResourceUtilization(resourceType, resourceId, new Date(startDate), new Date(endDate), context);
    }
};
exports.AvailabilityController = AvailabilityController;
__decorate([
    (0, common_1.Post)('find-slots'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [availability_dto_1.FindAvailableSlotsDto, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "findAvailableSlots", null);
__decorate([
    (0, common_1.Post)('check-slot'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [availability_dto_1.CheckSlotAvailabilityDto, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "checkSlotAvailability", null);
__decorate([
    (0, common_1.Post)('detect-conflicts'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [availability_dto_1.CheckSlotAvailabilityDto, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "detectConflicts", null);
__decorate([
    (0, common_1.Post)('find-slots-for-appointment-type'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [availability_dto_1.FindSlotsForAppointmentTypeDto, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "findSlotsForAppointmentType", null);
__decorate([
    (0, common_1.Post)('utilization'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [availability_dto_1.GetResourceUtilizationDto, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "getResourceUtilization", null);
__decorate([
    (0, common_1.Post)('next-available'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [availability_dto_1.FindNextAvailableSlotDto, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "findNextAvailableSlot", null);
__decorate([
    (0, common_1.Post)('suggest-alternatives'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [availability_dto_1.SuggestAlternativeSlotsDto, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "suggestAlternativeSlots", null);
__decorate([
    (0, common_1.Get)('resources/:resourceType/:resourceId/utilization'),
    __param(0, (0, common_1.Param)('resourceType')),
    __param(1, (0, common_1.Param)('resourceId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "getResourceUtilizationByParams", null);
exports.AvailabilityController = AvailabilityController = __decorate([
    (0, common_1.Controller)('scheduling/availability'),
    __metadata("design:paramtypes", [availability_service_1.AvailabilityService])
], AvailabilityController);
//# sourceMappingURL=availability.controller.js.map