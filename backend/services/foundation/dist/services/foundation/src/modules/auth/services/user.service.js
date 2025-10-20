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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
const shared_utils_1 = require("@zeal/shared-utils");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserById(userId) {
        return this.prisma.runWithRequestContext(async (tx) => tx.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                tenantId: true,
                status: true,
            },
        }));
    }
    async getUserWithRoles(userId) {
        const store = shared_utils_1.RequestContext.getStore();
        if (!store?.tenantId || !store?.userId) {
            throw new Error('Request context missing tenant or user information');
        }
        const user = await this.prisma.runWithRequestContext(async (tx) => tx.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                tenantId: true,
                userRoles: {
                    where: {
                        isActive: true,
                        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
                    },
                    select: {
                        role: {
                            select: { code: true },
                        },
                    },
                },
            },
        }));
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return {
            id: user.id,
            email: user.email,
            tenantId: user.tenantId,
            roles: user.userRoles.map((ur) => ur.role.code),
        };
    }
    async getUserPermissions(userId, tenantId) {
        const cached = (0, shared_utils_1.getCachedPermissions)(tenantId, userId);
        if (cached) {
            return cached;
        }
        const store = shared_utils_1.RequestContext.getStore();
        if (!store?.tenantId || !store?.userId) {
            throw new Error('Request context missing tenant or user information');
        }
        const { roles, permissions } = await this.prisma.runWithRequestContext(async (tx) => {
            const assignments = await tx.userRole.findMany({
                where: {
                    userId,
                    isActive: true,
                    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
                    role: { tenantId },
                },
                select: {
                    role: {
                        select: {
                            code: true,
                            rolePermissions: {
                                select: {
                                    permission: { select: { code: true } },
                                },
                            },
                        },
                    },
                },
            });
            const roleCodes = new Set();
            const permissionCodes = new Set();
            assignments.forEach((assignment) => {
                roleCodes.add(assignment.role.code);
                assignment.role.rolePermissions.forEach((rp) => permissionCodes.add(rp.permission.code));
            });
            return {
                roles: Array.from(roleCodes),
                permissions: Array.from(permissionCodes),
            };
        });
        (0, shared_utils_1.setCachedPermissions)(tenantId, userId, { roles, permissions });
        return { roles, permissions };
    }
    invalidateUserPermissions(userId, tenantId) {
        (0, shared_utils_1.invalidateCachedPermissions)(tenantId, userId);
    }
    invalidateTenantPermissions(tenantId) {
        (0, shared_utils_1.invalidateCachedPermissions)(tenantId);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map