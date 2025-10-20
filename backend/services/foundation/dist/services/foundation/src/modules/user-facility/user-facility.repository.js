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
exports.UserFacilityRepository = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
let UserFacilityRepository = class UserFacilityRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Get all facilities for a user (excluding revoked access)
     */
    async getUserFacilities(userId) {
        return this.prisma.userFacility.findMany({
            where: {
                userId,
                revokedAt: null,
            },
            include: {
                facility: {
                    select: {
                        id: true,
                        name: true,
                        facilityType: true,
                        city: true,
                        emirate: true,
                        status: true,
                    },
                },
            },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
        });
    }
    /**
     * Get user's default facility
     */
    async getDefaultFacility(userId) {
        return this.prisma.userFacility.findFirst({
            where: {
                userId,
                isDefault: true,
                revokedAt: null,
            },
            include: {
                facility: true,
            },
        });
    }
    /**
     * Check if user has access to a facility
     */
    async hasAccessToFacility(userId, facilityId) {
        const access = await this.prisma.userFacility.findUnique({
            where: {
                userId_facilityId: {
                    userId,
                    facilityId,
                },
            },
            select: { revokedAt: true },
        });
        return access !== null && access.revokedAt === null;
    }
    /**
     * Assign facility access to user
     */
    async assignFacility(data) {
        // If setting as default, unset other defaults first
        if (data.setAsDefault) {
            await this.prisma.userFacility.updateMany({
                where: {
                    userId: data.userId,
                    isDefault: true,
                },
                data: {
                    isDefault: false,
                },
            });
        }
        // Create or update the facility access
        const userFacility = await this.prisma.userFacility.upsert({
            where: {
                userId_facilityId: {
                    userId: data.userId,
                    facilityId: data.facilityId,
                },
            },
            create: {
                userId: data.userId,
                facilityId: data.facilityId,
                accessLevel: data.accessLevel,
                isDefault: data.setAsDefault || false,
                grantedBy: data.grantedBy || null,
                grantedAt: new Date(),
            },
            update: {
                accessLevel: data.accessLevel,
                isDefault: data.setAsDefault || false,
                revokedAt: null, // Restore access if previously revoked
                grantedBy: data.grantedBy || null,
                grantedAt: new Date(),
            },
            include: {
                facility: true,
            },
        });
        // If this is set as default, update the user's defaultFacilityId
        if (data.setAsDefault) {
            await this.prisma.user.update({
                where: { id: data.userId },
                data: { defaultFacilityId: data.facilityId },
            });
        }
        return userFacility;
    }
    /**
     * Set a facility as default for user
     */
    async setDefaultFacility(userId, facilityId) {
        // Verify user has access to this facility
        const hasAccess = await this.hasAccessToFacility(userId, facilityId);
        if (!hasAccess) {
            throw new Error('User does not have access to this facility');
        }
        // Unset current default
        await this.prisma.userFacility.updateMany({
            where: {
                userId,
                isDefault: true,
            },
            data: {
                isDefault: false,
            },
        });
        // Set new default
        await this.prisma.userFacility.update({
            where: {
                userId_facilityId: {
                    userId,
                    facilityId,
                },
            },
            data: {
                isDefault: true,
            },
        });
        // Update user's defaultFacilityId
        await this.prisma.user.update({
            where: { id: userId },
            data: { defaultFacilityId: facilityId },
        });
        return this.getDefaultFacility(userId);
    }
    /**
     * Revoke facility access for user
     */
    async revokeFacility(userId, facilityId) {
        // Check if this is the default facility
        const defaultFacility = await this.getDefaultFacility(userId);
        if (defaultFacility?.facilityId === facilityId) {
            throw new Error('Cannot revoke access to default facility. Set a new default facility first.');
        }
        return this.prisma.userFacility.update({
            where: {
                userId_facilityId: {
                    userId,
                    facilityId,
                },
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }
    /**
     * Get all users with access to a facility
     */
    async getFacilityUsers(facilityId) {
        return this.prisma.userFacility.findMany({
            where: {
                facilityId,
                revokedAt: null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        status: true,
                    },
                },
            },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
        });
    }
};
exports.UserFacilityRepository = UserFacilityRepository;
exports.UserFacilityRepository = UserFacilityRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], UserFacilityRepository);
//# sourceMappingURL=user-facility.repository.js.map