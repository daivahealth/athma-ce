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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const staff_service_1 = require("./staff.service");
const create_staff_dto_1 = require("./dto/create-staff.dto");
const update_staff_dto_1 = require("./dto/update-staff.dto");
let StaffController = class StaffController {
    staffService;
    constructor(staffService) {
        this.staffService = staffService;
    }
    create(dto) {
        return this.staffService.create(dto);
    }
    list(tenantId, tenantHeader) {
        const effectiveTenantId = tenantId ?? tenantHeader;
        if (!effectiveTenantId) {
            throw new common_1.BadRequestException('tenantId is required (provide ?tenantId= or x-tenant-id header)');
        }
        return this.staffService.list(effectiveTenantId);
    }
    get(id) {
        return this.staffService.get(id);
    }
    update(id, dto) {
        return this.staffService.update(id, dto);
    }
    remove(id) {
        return this.staffService.archive(id);
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create new staff member',
        description: 'Creates a new healthcare staff member (doctor, nurse, technician, etc.) in the system'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Staff member created successfully',
        schema: {
            example: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                tenantId: '223e4567-e89b-12d3-a456-426614174000',
                firstName: 'Ahmed',
                lastName: 'Hassan',
                employeeId: 'EMP001',
                staffType: 'physician',
                email: 'ahmed.hassan@hospital.ae'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_dto_1.CreateStaffDto]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List all staff members',
        description: 'Retrieves all staff members for a tenant. Requires tenantId as query parameter or x-tenant-id header.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'tenantId',
        required: false,
        description: 'Tenant UUID (can also be provided via x-tenant-id header)',
        example: '223e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of staff members',
        schema: {
            example: [
                {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    firstName: 'Ahmed',
                    lastName: 'Hassan',
                    employeeId: 'EMP001',
                    staffType: 'physician',
                    email: 'ahmed.hassan@hospital.ae'
                }
            ]
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'tenantId is required' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get staff member by ID',
        description: 'Retrieves a single staff member by their UUID'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Staff UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Staff member details',
        schema: {
            example: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                tenantId: '223e4567-e89b-12d3-a456-426614174000',
                firstName: 'Ahmed',
                lastName: 'Hassan',
                employeeId: 'EMP001',
                staffType: 'physician',
                licenseNumber: 'DHA-12345',
                email: 'ahmed.hassan@hospital.ae',
                specialties: ['cardiology']
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update staff member',
        description: 'Updates an existing staff member\'s information'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Staff UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff member updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_staff_dto_1.UpdateStaffDto]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Archive staff member',
        description: 'Soft deletes (archives) a staff member. They will no longer appear in active lists but data is retained.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Staff UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff member archived successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "remove", null);
exports.StaffController = StaffController = __decorate([
    (0, swagger_1.ApiTags)('Staff'),
    (0, swagger_1.ApiSecurity)('x-tenant-id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('staff'),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map