"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function")
        throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn)
            context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access)
            context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done)
            throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0)
                continue;
            if (result === null || typeof result !== "object")
                throw new TypeError("Object expected");
            if (_ = accept(result.get))
                descriptor.get = _;
            if (_ = accept(result.set))
                descriptor.set = _;
            if (_ = accept(result.init))
                initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field")
                initializers.unshift(_);
            else
                descriptor[key] = _;
        }
    }
    if (target)
        Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
const common_1 = require("@nestjs/common");
const shared_database_1 = require("@zeal/shared-database");
const user_dto_1 = require("./dto/user.dto");
const bcrypt = __importStar(require("bcryptjs"));
let UserService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UserService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UserService = _classThis = _classDescriptor.value;
            if (_metadata)
                Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        /**
         * Create a new user
         */
        async createUser(createUserDto) {
            const { tenantId, email, firstName, lastName, password, role, permissions } = createUserDto;
            // Check if tenant exists
            const tenant = await this.prisma.tenant.findUnique({
                where: { id: tenantId }
            });
            if (!tenant) {
                throw new common_1.NotFoundException(`Tenant with ID ${tenantId} not found`);
            }
            // Check for existing user with same email in tenant
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    tenantId_email: {
                        tenantId,
                        email
                    }
                }
            });
            if (existingUser) {
                throw new common_1.ConflictException('User with this email already exists in this tenant');
            }
            // Hash password
            const passwordHash = await bcrypt.hash(password, 12);
            return this.prisma.user.create({
                data: {
                    tenantId,
                    email,
                    firstName,
                    lastName,
                    passwordHash,
                    role,
                    permissions: permissions || {},
                    status: 'active'
                }
            });
        }
        /**
         * Get user by ID
         */
        async getUserById(id) {
            const user = await this.prisma.user.findUnique({
                where: { id },
                include: {
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                            domain: true
                        }
                    },
                    userRoles: {
                        include: {
                            role: true
                        }
                    },
                    mfaSettings: true
                }
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        }
        /**
         * Get user by email and tenant
         */
        async getUserByEmail(tenantId, email) {
            const user = await this.prisma.user.findUnique({
                where: {
                    tenantId_email: {
                        tenantId,
                        email
                    }
                },
                include: {
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                            domain: true
                        }
                    },
                    userRoles: {
                        include: {
                            role: true
                        }
                    },
                    mfaSettings: true
                }
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with email ${email} not found in tenant ${tenantId}`);
            }
            return user;
        }
        /**
         * Search users with pagination
         */
        async searchUsers(tenantId, searchDto, pagination) {
            const { query, role, status } = searchDto;
            const { page = 1, limit = 20 } = pagination;
            const where = {
                tenantId,
                AND: [
                    ...(query
                        ? [
                            {
                                OR: [
                                    { firstName: { contains: query, mode: 'insensitive' } },
                                    { lastName: { contains: query, mode: 'insensitive' } },
                                    { email: { contains: query, mode: 'insensitive' } }
                                ]
                            }
                        ]
                        : []),
                    ...(role ? [{ role }] : []),
                    ...(status ? [{ status }] : [])
                ]
            };
            const [users, total] = await this.prisma.$transaction([
                this.prisma.user.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { lastName: 'asc' },
                    include: {
                        tenant: {
                            select: {
                                id: true,
                                name: true,
                                domain: true
                            }
                        },
                        userRoles: {
                            include: {
                                role: true
                            }
                        }
                    }
                }),
                this.prisma.user.count({ where })
            ]);
            return { users, total };
        }
        /**
         * Update user
         */
        async updateUser(id, updateUserDto) {
            const { firstName, lastName, role, status, permissions } = updateUserDto;
            // Check if user exists
            const existingUser = await this.prisma.user.findUnique({
                where: { id }
            });
            if (!existingUser) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return this.prisma.user.update({
                where: { id },
                data: {
                    ...(firstName && { firstName }),
                    ...(lastName && { lastName }),
                    ...(role && { role }),
                    ...(status && { status }),
                    ...(permissions && { permissions })
                },
                include: {
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                            domain: true
                        }
                    },
                    userRoles: {
                        include: {
                            role: true
                        }
                    }
                }
            });
        }
        /**
         * Change user password
         */
        async changePassword(id, changePasswordDto) {
            const { currentPassword, newPassword } = changePasswordDto;
            const user = await this.prisma.user.findUnique({
                where: { id }
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            // Verify current password
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!isCurrentPasswordValid) {
                throw new common_1.UnauthorizedException('Current password is incorrect');
            }
            // Hash new password
            const newPasswordHash = await bcrypt.hash(newPassword, 12);
            await this.prisma.user.update({
                where: { id },
                data: { passwordHash: newPasswordHash }
            });
        }
        /**
         * Delete user (soft delete by setting status to inactive)
         */
        async deleteUser(id) {
            const user = await this.prisma.user.findUnique({
                where: { id }
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            // Soft delete by setting status to inactive
            await this.prisma.user.update({
                where: { id },
                data: { status: 'inactive' }
            });
        }
        /**
         * Verify user password
         */
        async verifyPassword(id, password) {
            const user = await this.prisma.user.findUnique({
                where: { id },
                select: { passwordHash: true }
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return bcrypt.compare(password, user.passwordHash);
        }
        /**
         * Update last login timestamp
         */
        async updateLastLogin(id) {
            await this.prisma.user.update({
                where: { id },
                data: { lastLogin: new Date() }
            });
        }
        /**
         * Get users by role
         */
        async getUsersByRole(tenantId, role) {
            return this.prisma.user.findMany({
                where: {
                    tenantId,
                    role,
                    status: 'active'
                },
                orderBy: { lastName: 'asc' },
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,
                    status: true,
                    email: true,
                    tenantId: true,
                    firstName: true,
                    lastName: true,
                    permissions: true,
                    passwordHash: true,
                    lastLogin: true
                }
            });
        }
        /**
         * Get user statistics for tenant
         */
        async getUserStats(tenantId) {
            const [totalUsers, activeUsers, inactiveUsers, usersByRole, recentLogins] = await Promise.all([
                this.prisma.user.count({ where: { tenantId } }),
                this.prisma.user.count({ where: { tenantId, status: 'active' } }),
                this.prisma.user.count({ where: { tenantId, status: 'inactive' } }),
                this.prisma.user.groupBy({
                    by: ['role'],
                    where: { tenantId, status: 'active' },
                    _count: { role: true }
                }),
                this.prisma.user.count({
                    where: {
                        tenantId,
                        lastLogin: {
                            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                        }
                    }
                })
            ]);
            const usersByRoleMap = usersByRole.reduce((acc, item) => {
                acc[item.role] = item._count.role;
                return acc;
            }, {});
            return {
                totalUsers,
                activeUsers,
                inactiveUsers,
                usersByRole: usersByRoleMap,
                recentLogins
            };
        }
        /**
         * Check if user exists
         */
        async userExists(id) {
            const user = await this.prisma.user.findUnique({
                where: { id },
                select: { id: true }
            });
            return !!user;
        }
        /**
         * Check if email exists in tenant
         */
        async emailExistsInTenant(tenantId, email) {
            const user = await this.prisma.user.findUnique({
                where: {
                    tenantId_email: {
                        tenantId,
                        email
                    }
                },
                select: { id: true }
            });
            return !!user;
        }
    };
    return UserService = _classThis;
})();
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map
//# sourceMappingURL=user.service.js.map