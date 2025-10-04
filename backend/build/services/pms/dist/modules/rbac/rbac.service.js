"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacService = void 0;
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
const rbac_dto_1 = require("./dto/rbac.dto");
let RbacService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RbacService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RbacService = _classThis = _classDescriptor.value;
            if (_metadata)
                Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        // ============================================================================
        // ROLE MANAGEMENT
        // ============================================================================
        /**
         * Create a new role
         */
        async createRole(createRoleDto) {
            const { tenantId, code, name, description, isSystem } = createRoleDto;
            // Check if tenant exists
            const tenant = await this.prisma.tenant.findUnique({
                where: { id: tenantId }
            });
            if (!tenant) {
                throw new common_1.NotFoundException(`Tenant with ID ${tenantId} not found`);
            }
            // Check for existing role with same code in tenant
            const existingRole = await this.prisma.role.findUnique({
                where: {
                    tenantId_code: {
                        tenantId,
                        code
                    }
                }
            });
            if (existingRole) {
                throw new common_1.ConflictException('Role with this code already exists in this tenant');
            }
            return this.prisma.role.create({
                data: {
                    tenantId,
                    code,
                    name,
                    description: description || null,
                    isSystem: isSystem || false
                }
            });
        }
        /**
         * Get role by ID
         */
        async getRoleById(id) {
            const role = await this.prisma.role.findUnique({
                where: { id },
                include: {
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                            domain: true
                        }
                    },
                    rolePermissions: {
                        include: {
                            permission: true
                        }
                    },
                    userRoles: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            });
            if (!role) {
                throw new common_1.NotFoundException(`Role with ID ${id} not found`);
            }
            return role;
        }
        /**
         * Get roles for tenant
         */
        async getRolesByTenant(tenantId) {
            return this.prisma.role.findMany({
                where: { tenantId },
                orderBy: { name: 'asc' },
                include: {
                    _count: {
                        select: {
                            userRoles: true,
                            rolePermissions: true
                        }
                    }
                }
            });
        }
        /**
         * Update role
         */
        async updateRole(id, updateRoleDto) {
            const { name, description } = updateRoleDto;
            // Check if role exists
            const existingRole = await this.prisma.role.findUnique({
                where: { id }
            });
            if (!existingRole) {
                throw new common_1.NotFoundException(`Role with ID ${id} not found`);
            }
            // Prevent updating system roles
            if (existingRole.isSystem) {
                throw new common_1.BadRequestException('Cannot update system roles');
            }
            return this.prisma.role.update({
                where: { id },
                data: {
                    ...(name && { name }),
                    ...(description && { description })
                }
            });
        }
        /**
         * Delete role
         */
        async deleteRole(id) {
            const role = await this.prisma.role.findUnique({
                where: { id }
            });
            if (!role) {
                throw new common_1.NotFoundException(`Role with ID ${id} not found`);
            }
            // Prevent deleting system roles
            if (role.isSystem) {
                throw new common_1.BadRequestException('Cannot delete system roles');
            }
            // Check if role is assigned to users
            const userRoleCount = await this.prisma.userRole.count({
                where: { roleId: id }
            });
            if (userRoleCount > 0) {
                throw new common_1.BadRequestException('Cannot delete role that is assigned to users');
            }
            await this.prisma.role.delete({
                where: { id }
            });
        }
        // ============================================================================
        // PERMISSION MANAGEMENT
        // ============================================================================
        /**
         * Create a new permission
         */
        async createPermission(createPermissionDto) {
            const { code, name, description, resource, action } = createPermissionDto;
            // Check for existing permission with same code
            const existingPermission = await this.prisma.permission.findUnique({
                where: { code }
            });
            if (existingPermission) {
                throw new common_1.ConflictException('Permission with this code already exists');
            }
            return this.prisma.permission.create({
                data: {
                    code,
                    name,
                    description: description || null,
                    resource: resource || null,
                    action: action || null
                }
            });
        }
        /**
         * Get permission by ID
         */
        async getPermissionById(id) {
            const permission = await this.prisma.permission.findUnique({
                where: { id },
                include: {
                    rolePermissions: {
                        include: {
                            role: {
                                select: {
                                    id: true,
                                    name: true,
                                    tenant: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            if (!permission) {
                throw new common_1.NotFoundException(`Permission with ID ${id} not found`);
            }
            return permission;
        }
        /**
         * Get all permissions
         */
        async getAllPermissions() {
            return this.prisma.permission.findMany({
                orderBy: { code: 'asc' }
            });
        }
        /**
         * Get permissions by resource
         */
        async getPermissionsByResource(resource) {
            return this.prisma.permission.findMany({
                where: { resource },
                orderBy: { code: 'asc' }
            });
        }
        // ============================================================================
        // ROLE-PERMISSION MANAGEMENT
        // ============================================================================
        /**
         * Assign permission to role
         */
        async assignPermissionToRole(roleId, permissionId) {
            // Check if role exists
            const role = await this.prisma.role.findUnique({
                where: { id: roleId }
            });
            if (!role) {
                throw new common_1.NotFoundException(`Role with ID ${roleId} not found`);
            }
            // Check if permission exists
            const permission = await this.prisma.permission.findUnique({
                where: { id: permissionId }
            });
            if (!permission) {
                throw new common_1.NotFoundException(`Permission with ID ${permissionId} not found`);
            }
            // Check if assignment already exists
            const existingAssignment = await this.prisma.rolePermission.findUnique({
                where: {
                    roleId_permissionId: {
                        roleId,
                        permissionId
                    }
                }
            });
            if (existingAssignment) {
                throw new common_1.ConflictException('Permission is already assigned to this role');
            }
            return this.prisma.rolePermission.create({
                data: {
                    roleId,
                    permissionId
                },
                include: {
                    role: true,
                    permission: true
                }
            });
        }
        /**
         * Remove permission from role
         */
        async removePermissionFromRole(roleId, permissionId) {
            const assignment = await this.prisma.rolePermission.findUnique({
                where: {
                    roleId_permissionId: {
                        roleId,
                        permissionId
                    }
                }
            });
            if (!assignment) {
                throw new common_1.NotFoundException('Permission assignment not found');
            }
            await this.prisma.rolePermission.delete({
                where: {
                    roleId_permissionId: {
                        roleId,
                        permissionId
                    }
                }
            });
        }
        /**
         * Get role permissions
         */
        async getRolePermissions(roleId) {
            const rolePermissions = await this.prisma.rolePermission.findMany({
                where: { roleId },
                include: {
                    permission: true
                }
            });
            return rolePermissions.map(rp => rp.permission);
        }
        // ============================================================================
        // USER-ROLE MANAGEMENT
        // ============================================================================
        /**
         * Assign role to user
         */
        async assignRoleToUser(assignRoleDto) {
            const { userId, roleId, assignedBy, expiresAt } = assignRoleDto;
            // Check if user exists
            const user = await this.prisma.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${userId} not found`);
            }
            // Check if role exists
            const role = await this.prisma.role.findUnique({
                where: { id: roleId }
            });
            if (!role) {
                throw new common_1.NotFoundException(`Role with ID ${roleId} not found`);
            }
            // Check if assignment already exists
            const existingAssignment = await this.prisma.userRole.findUnique({
                where: {
                    userId_roleId: {
                        userId,
                        roleId
                    }
                }
            });
            if (existingAssignment) {
                throw new common_1.ConflictException('Role is already assigned to this user');
            }
            return this.prisma.userRole.create({
                data: {
                    userId,
                    roleId,
                    assignedBy: assignedBy || null,
                    expiresAt: expiresAt ? new Date(expiresAt) : null
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    role: true
                }
            });
        }
        /**
         * Remove role from user
         */
        async removeRoleFromUser(userId, roleId) {
            const assignment = await this.prisma.userRole.findUnique({
                where: {
                    userId_roleId: {
                        userId,
                        roleId
                    }
                }
            });
            if (!assignment) {
                throw new common_1.NotFoundException('Role assignment not found');
            }
            await this.prisma.userRole.delete({
                where: {
                    userId_roleId: {
                        userId,
                        roleId
                    }
                }
            });
        }
        /**
         * Get user roles
         */
        async getUserRoles(userId) {
            const userRoles = await this.prisma.userRole.findMany({
                where: {
                    userId,
                    isActive: true,
                    OR: [
                        { expiresAt: null },
                        { expiresAt: { gt: new Date() } }
                    ]
                },
                include: {
                    role: true
                }
            });
            return userRoles.map(ur => ur.role);
        }
        /**
         * Get user permissions
         */
        async getUserPermissions(userId) {
            const userRoles = await this.prisma.userRole.findMany({
                where: {
                    userId,
                    isActive: true,
                    OR: [
                        { expiresAt: null },
                        { expiresAt: { gt: new Date() } }
                    ]
                },
                include: {
                    role: {
                        include: {
                            rolePermissions: {
                                include: {
                                    permission: true
                                }
                            }
                        }
                    }
                }
            });
            const permissions = new Map();
            userRoles.forEach(userRole => {
                userRole.role.rolePermissions.forEach(rolePermission => {
                    permissions.set(rolePermission.permission.id, rolePermission.permission);
                });
            });
            return Array.from(permissions.values());
        }
        /**
         * Check if user has permission
         */
        async userHasPermission(userId, permissionCode) {
            const userPermissions = await this.getUserPermissions(userId);
            return userPermissions.some(permission => permission.code === permissionCode);
        }
        /**
         * Check if user has any of the specified permissions
         */
        async userHasAnyPermission(userId, permissionCodes) {
            const userPermissions = await this.getUserPermissions(userId);
            return permissionCodes.some(code => userPermissions.some(permission => permission.code === code));
        }
        /**
         * Check if user has all of the specified permissions
         */
        async userHasAllPermissions(userId, permissionCodes) {
            const userPermissions = await this.getUserPermissions(userId);
            return permissionCodes.every(code => userPermissions.some(permission => permission.code === code));
        }
        // ============================================================================
        // UTILITY METHODS
        // ============================================================================
        /**
         * Get RBAC statistics for tenant
         */
        async getRbacStats(tenantId) {
            const [totalRoles, systemRoles, customRoles, totalPermissions, totalRoleAssignments, activeRoleAssignments] = await Promise.all([
                this.prisma.role.count({ where: { tenantId } }),
                this.prisma.role.count({ where: { tenantId, isSystem: true } }),
                this.prisma.role.count({ where: { tenantId, isSystem: false } }),
                this.prisma.permission.count(),
                this.prisma.userRole.count({
                    where: {
                        role: { tenantId }
                    }
                }),
                this.prisma.userRole.count({
                    where: {
                        role: { tenantId },
                        isActive: true,
                        OR: [
                            { expiresAt: null },
                            { expiresAt: { gt: new Date() } }
                        ]
                    }
                })
            ]);
            return {
                totalRoles,
                systemRoles,
                customRoles,
                totalPermissions,
                totalRoleAssignments,
                activeRoleAssignments
            };
        }
    };
    return RbacService = _classThis;
})();
exports.RbacService = RbacService;
//# sourceMappingURL=rbac.service.js.map
//# sourceMappingURL=rbac.service.js.map