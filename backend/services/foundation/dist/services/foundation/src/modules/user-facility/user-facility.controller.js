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
exports.FacilityUsersController = exports.UserFacilityController = void 0;
const common_1 = require("@nestjs/common");
const user_facility_service_1 = require("./user-facility.service");
const assign_facility_dto_1 = require("./dto/assign-facility.dto");
const set_default_facility_dto_1 = require("./dto/set-default-facility.dto");
let UserFacilityController = class UserFacilityController {
    userFacilityService;
    constructor(userFacilityService) {
        this.userFacilityService = userFacilityService;
    }
    getUserFacilities(userId, tenantId) {
        // User-level operation: tenantId can be provided via header for validation
        return this.userFacilityService.getUserFacilities(userId);
    }
    assignFacility(userId, dto, req) {
        // TODO: Get grantedBy from authenticated user in request
        const grantedBy = req.user?.userId;
        return this.userFacilityService.assignFacility(userId, dto, grantedBy);
    }
    setDefaultFacility(userId, dto) {
        return this.userFacilityService.setDefaultFacility(userId, dto);
    }
    revokeFacility(userId, facilityId) {
        return this.userFacilityService.revokeFacility(userId, facilityId);
    }
    async checkAccess(userId, facilityId) {
        const hasAccess = await this.userFacilityService.hasAccessToFacility(userId, facilityId);
        return {
            userId,
            facilityId,
            hasAccess,
        };
    }
};
exports.UserFacilityController = UserFacilityController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserFacilityController.prototype, "getUserFacilities", null);
__decorate([
    (0, common_1.Post)('assign'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_facility_dto_1.AssignFacilityDto, Object]),
    __metadata("design:returntype", void 0)
], UserFacilityController.prototype, "assignFacility", null);
__decorate([
    (0, common_1.Post)('set-default'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_default_facility_dto_1.SetDefaultFacilityDto]),
    __metadata("design:returntype", void 0)
], UserFacilityController.prototype, "setDefaultFacility", null);
__decorate([
    (0, common_1.Delete)(':facilityId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('facilityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserFacilityController.prototype, "revokeFacility", null);
__decorate([
    (0, common_1.Get)('check/:facilityId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('facilityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserFacilityController.prototype, "checkAccess", null);
exports.UserFacilityController = UserFacilityController = __decorate([
    (0, common_1.Controller)('users/:userId/facilities'),
    __metadata("design:paramtypes", [user_facility_service_1.UserFacilityService])
], UserFacilityController);
let FacilityUsersController = class FacilityUsersController {
    userFacilityService;
    constructor(userFacilityService) {
        this.userFacilityService = userFacilityService;
    }
    getFacilityUsers(facilityId) {
        return this.userFacilityService.getFacilityUsers(facilityId);
    }
};
exports.FacilityUsersController = FacilityUsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('facilityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FacilityUsersController.prototype, "getFacilityUsers", null);
exports.FacilityUsersController = FacilityUsersController = __decorate([
    (0, common_1.Controller)('facilities/:facilityId/users'),
    __metadata("design:paramtypes", [user_facility_service_1.UserFacilityService])
], FacilityUsersController);
//# sourceMappingURL=user-facility.controller.js.map