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
exports.StaffSpecialtyController = exports.SpecialtyController = void 0;
const common_1 = require("@nestjs/common");
const specialty_service_1 = require("./specialty.service");
const assign_specialty_dto_1 = require("./dto/assign-specialty.dto");
const search_staff_dto_1 = require("./dto/search-staff.dto");
// =====================================================
// Specialty Management Controller
// =====================================================
let SpecialtyController = class SpecialtyController {
    specialtyService;
    constructor(specialtyService) {
        this.specialtyService = specialtyService;
    }
    // =====================================================
    // Specialty Management Endpoints
    // =====================================================
    async getAllSpecialties(includeInactive, locale) {
        return this.specialtyService.getAllSpecialties(includeInactive === 'true', locale);
    }
    async getSpecialtyStats(tenantId, locale) {
        return this.specialtyService.getSpecialtyStats(tenantId, locale);
    }
    async getSpecialtyByCode(code, locale) {
        return this.specialtyService.getSpecialtyByCode(code, locale);
    }
    async getSpecialtyById(id, locale) {
        return this.specialtyService.getSpecialtyById(id, locale);
    }
};
exports.SpecialtyController = SpecialtyController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('includeInactive')),
    __param(1, (0, common_1.Query)('locale')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "getAllSpecialties", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('locale')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "getSpecialtyStats", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Query)('locale')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "getSpecialtyByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('locale')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "getSpecialtyById", null);
exports.SpecialtyController = SpecialtyController = __decorate([
    (0, common_1.Controller)('specialties'),
    __metadata("design:paramtypes", [specialty_service_1.SpecialtyService])
], SpecialtyController);
// =====================================================
// Staff Specialty Management Controller
// =====================================================
let StaffSpecialtyController = class StaffSpecialtyController {
    specialtyService;
    constructor(specialtyService) {
        this.specialtyService = specialtyService;
    }
    // =====================================================
    // Specialty-Based Doctor Search Endpoints
    // =====================================================
    async searchStaffBySpecialty(tenantId, dto) {
        return this.specialtyService.searchStaffBySpecialty(tenantId, dto);
    }
    async findDoctorsBySpecialty(tenantId, specialtyCode, facilityId, locale) {
        const searchDto = {
            specialtyCode,
            staffType: 'doctor',
            primaryOnly: true,
            activeOnly: true,
        };
        if (facilityId)
            searchDto.facilityId = facilityId;
        if (locale)
            searchDto.locale = locale;
        return this.specialtyService.searchStaffBySpecialty(tenantId, searchDto);
    }
    // =====================================================
    // Staff Specialty Assignment Endpoints
    // =====================================================
    async assignSpecialtyToStaff(tenantId, staffId, dto) {
        return this.specialtyService.assignSpecialtyToStaff(tenantId, staffId, dto);
    }
    async bulkAssignSpecialties(tenantId, staffId, dto) {
        return this.specialtyService.bulkAssignSpecialties(tenantId, staffId, dto);
    }
    async getStaffSpecialties(staffId, facilityId, locale) {
        return this.specialtyService.getStaffSpecialties(staffId, facilityId, locale);
    }
    async changePrimarySpecialty(staffId, facilityId, specialtyId) {
        return this.specialtyService.changePrimarySpecialty(staffId, facilityId, specialtyId);
    }
    async removeSpecialtyFromStaff(staffId, facilityId, specialtyId) {
        return this.specialtyService.removeSpecialtyFromStaff(staffId, facilityId, specialtyId);
    }
};
exports.StaffSpecialtyController = StaffSpecialtyController;
__decorate([
    (0, common_1.Get)('search/by-specialty'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, search_staff_dto_1.SearchStaffBySpecialtyDto]),
    __metadata("design:returntype", Promise)
], StaffSpecialtyController.prototype, "searchStaffBySpecialty", null);
__decorate([
    (0, common_1.Get)('doctors/specialty/:specialtyCode'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('specialtyCode')),
    __param(2, (0, common_1.Query)('facilityId')),
    __param(3, (0, common_1.Query)('locale')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], StaffSpecialtyController.prototype, "findDoctorsBySpecialty", null);
__decorate([
    (0, common_1.Post)(':staffId/specialties'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('staffId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, assign_specialty_dto_1.AssignSpecialtyDto]),
    __metadata("design:returntype", Promise)
], StaffSpecialtyController.prototype, "assignSpecialtyToStaff", null);
__decorate([
    (0, common_1.Post)(':staffId/specialties/bulk'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('staffId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, assign_specialty_dto_1.BulkAssignSpecialtiesDto]),
    __metadata("design:returntype", Promise)
], StaffSpecialtyController.prototype, "bulkAssignSpecialties", null);
__decorate([
    (0, common_1.Get)(':staffId/specialties'),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Query)('facilityId')),
    __param(2, (0, common_1.Query)('locale')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], StaffSpecialtyController.prototype, "getStaffSpecialties", null);
__decorate([
    (0, common_1.Put)(':staffId/specialties/facility/:facilityId/primary/:specialtyId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Param)('facilityId')),
    __param(2, (0, common_1.Param)('specialtyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], StaffSpecialtyController.prototype, "changePrimarySpecialty", null);
__decorate([
    (0, common_1.Delete)(':staffId/specialties/facility/:facilityId/specialty/:specialtyId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Param)('facilityId')),
    __param(2, (0, common_1.Param)('specialtyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], StaffSpecialtyController.prototype, "removeSpecialtyFromStaff", null);
exports.StaffSpecialtyController = StaffSpecialtyController = __decorate([
    (0, common_1.Controller)('staff'),
    __metadata("design:paramtypes", [specialty_service_1.SpecialtyService])
], StaffSpecialtyController);
//# sourceMappingURL=specialty.controller.js.map