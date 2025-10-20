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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFacilityService = void 0;
const common_1 = require("@nestjs/common");
const user_facility_repository_1 = require("./user-facility.repository");
const database_foundation_1 = require("@zeal/database-foundation");
let UserFacilityService = class UserFacilityService {
    userFacilityRepo;
    prisma;
    constructor(userFacilityRepo, prisma) {
        this.userFacilityRepo = userFacilityRepo;
        this.prisma = prisma;
    }
    /**
     * Get all facilities for a user
     */
    async getUserFacilities(userId) {
        // Verify user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, tenantId: true },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const facilities = await this.userFacilityRepo.getUserFacilities(userId);
        const defaultFacility = facilities.find((f) => f.isDefault);
        return {
            defaultFacility: defaultFacility
                ? {
                    id: defaultFacility.facility.id,
                    name: defaultFacility.facility.name,
                    facilityType: defaultFacility.facility.facilityType,
                    accessLevel: defaultFacility.accessLevel,
                }
                : null,
            facilities: facilities.map((f) => ({
                id: f.facility.id,
                name: f.facility.name,
                facilityType: f.facility.facilityType,
                city: f.facility.city,
                emirate: f.facility.emirate,
                accessLevel: f.accessLevel,
                isDefault: f.isDefault,
                grantedAt: f.grantedAt,
            })),
        };
    }
    /**
     * Assign facility access to user
     */
    async assignFacility(userId, dto, grantedBy) {
        // Verify user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, tenantId: true },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        // Verify facility exists and belongs to same tenant
        const facility = await this.prisma.facility.findUnique({
            where: { id: dto.facilityId },
            select: { id: true, tenantId: true, name: true, status: true },
        });
        if (!facility) {
            throw new common_1.NotFoundException(`Facility with ID ${dto.facilityId} not found`);
        }
        if (facility.tenantId !== user.tenantId) {
            throw new common_1.BadRequestException('Facility must belong to the same tenant as the user');
        }
        if (facility.status !== 'active') {
            throw new common_1.BadRequestException('Cannot assign access to inactive facility');
        }
        // Build assign data with proper optional handling
        const assignParams = {
            userId,
            facilityId: dto.facilityId,
            accessLevel: dto.accessLevel || 'standard',
        };
        // Only add optional fields if they have values
        if (dto.setAsDefault !== undefined) {
            assignParams.setAsDefault = dto.setAsDefault;
        }
        if (grantedBy !== undefined) {
            assignParams.grantedBy = grantedBy;
        }
        const userFacility = await this.userFacilityRepo.assignFacility(assignParams);
        return {
            success: true,
            facilityAccess: {
                facilityId: userFacility.facilityId,
                facilityName: userFacility.facility?.name || facility.name,
                accessLevel: userFacility.accessLevel,
                isDefault: userFacility.isDefault,
                grantedAt: userFacility.grantedAt,
            },
        };
    }
    /**
     * Set default facility for user
     */
    async setDefaultFacility(userId, dto) {
        try {
            const defaultFacility = await this.userFacilityRepo.setDefaultFacility(userId, dto.facilityId);
            if (!defaultFacility?.facility) {
                throw new Error('Failed to set default facility');
            }
            return {
                success: true,
                defaultFacility: {
                    id: defaultFacility.facility.id,
                    name: defaultFacility.facility.name,
                    facilityType: defaultFacility.facility.facilityType,
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (errorMessage === 'User does not have access to this facility') {
                throw new common_1.BadRequestException(errorMessage);
            }
            throw error;
        }
    }
    /**
     * Revoke facility access for user
     */
    async revokeFacility(userId, facilityId) {
        try {
            await this.userFacilityRepo.revokeFacility(userId, facilityId);
            return {
                success: true,
                message: 'Facility access revoked successfully',
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '';
            const errorCode = error?.code || '';
            if (errorMessage.includes('Cannot revoke access to default facility')) {
                throw new common_1.BadRequestException(errorMessage);
            }
            if (errorCode === 'P2025') {
                throw new common_1.NotFoundException('Facility access not found');
            }
            throw error;
        }
    }
    /**
     * Check if user has access to facility
     */
    async hasAccessToFacility(userId, facilityId) {
        return this.userFacilityRepo.hasAccessToFacility(userId, facilityId);
    }
    /**
     * Get all users with access to a facility
     */
    async getFacilityUsers(facilityId) {
        const users = await this.userFacilityRepo.getFacilityUsers(facilityId);
        return {
            facilityId,
            users: users.map((u) => ({
                id: u.user.id,
                email: u.user.email,
                firstName: u.user.firstName,
                lastName: u.user.lastName,
                role: u.user.role,
                accessLevel: u.accessLevel,
                isDefault: u.isDefault,
                grantedAt: u.grantedAt,
            })),
        };
    }
};
exports.UserFacilityService = UserFacilityService;
exports.UserFacilityService = UserFacilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_facility_repository_1.UserFacilityRepository,
        database_foundation_1.PrismaService])
], UserFacilityService);
//# sourceMappingURL=user-facility.service.js.map