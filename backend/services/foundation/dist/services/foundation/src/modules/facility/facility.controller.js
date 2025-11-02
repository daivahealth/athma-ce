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
exports.FacilityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const facility_service_1 = require("./facility.service");
const create_facility_dto_1 = require("./dto/create-facility.dto");
const update_facility_dto_1 = require("./dto/update-facility.dto");
const specialty_service_1 = require("../specialty/specialty.service");
let FacilityController = class FacilityController {
    facilityService;
    specialtyService;
    constructor(facilityService, specialtyService) {
        this.facilityService = facilityService;
        this.specialtyService = specialtyService;
    }
    create(dto) {
        return this.facilityService.create(dto);
    }
    list(tenantId) {
        // Tenant-level operation: requires tenantId as query parameter
        if (!tenantId) {
            throw new common_1.BadRequestException('tenantId query parameter is required');
        }
        return this.facilityService.list(tenantId);
    }
    get(id) {
        return this.facilityService.get(id);
    }
    update(id, dto) {
        return this.facilityService.update(id, dto);
    }
    remove(id) {
        return this.facilityService.archive(id);
    }
    async getFacilitySpecialties(facilityId, locale) {
        return this.specialtyService.getFacilitySpecialties(facilityId, locale);
    }
};
exports.FacilityController = FacilityController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create new facility',
        description: 'Creates a new healthcare facility (hospital, clinic, etc.)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Facility created successfully',
        schema: {
            example: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                tenantId: '223e4567-e89b-12d3-a456-426614174000',
                name: 'Dubai Central Hospital',
                facilityType: 'hospital',
                address: 'Sheikh Zayed Road, Dubai',
                status: 'active'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_facility_dto_1.CreateFacilityDto]),
    __metadata("design:returntype", void 0)
], FacilityController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List all facilities',
        description: 'Retrieves all facilities for a tenant'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'tenantId',
        required: true,
        description: 'Tenant UUID',
        example: '223e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of facilities',
        schema: {
            example: [
                {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Dubai Central Hospital',
                    facilityType: 'hospital',
                    address: 'Sheikh Zayed Road, Dubai',
                    status: 'active'
                }
            ]
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'tenantId query parameter is required' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FacilityController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get facility by ID',
        description: 'Retrieves a single facility by its UUID'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Facility UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Facility details',
        schema: {
            example: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                tenantId: '223e4567-e89b-12d3-a456-426614174000',
                name: 'Dubai Central Hospital',
                facilityType: 'hospital',
                address: 'Sheikh Zayed Road, Dubai',
                contactNumber: '+971-4-1234567',
                email: 'info@dubaihospital.ae',
                status: 'active'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Facility not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FacilityController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update facility',
        description: 'Updates an existing facility\'s information'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Facility UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Facility updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Facility not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_facility_dto_1.UpdateFacilityDto]),
    __metadata("design:returntype", void 0)
], FacilityController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Archive facility',
        description: 'Soft deletes (archives) a facility. It will no longer appear in active lists but data is retained.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Facility UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Facility archived successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Facility not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FacilityController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/specialties'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get facility specialties',
        description: 'Retrieves all medical specialties available at a facility with optional localization'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Facility UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'locale',
        required: false,
        description: 'Language code for translations (en, ar)',
        example: 'en'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of specialties at the facility',
        schema: {
            example: [
                {
                    id: '323e4567-e89b-12d3-a456-426614174000',
                    code: 'cardiology',
                    name: 'Cardiology',
                    description: 'Heart and cardiovascular care'
                }
            ]
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Facility not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('locale')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "getFacilitySpecialties", null);
exports.FacilityController = FacilityController = __decorate([
    (0, swagger_1.ApiTags)('Facilities'),
    (0, swagger_1.ApiSecurity)('x-tenant-id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('facilities'),
    __metadata("design:paramtypes", [facility_service_1.FacilityService,
        specialty_service_1.SpecialtyService])
], FacilityController);
//# sourceMappingURL=facility.controller.js.map