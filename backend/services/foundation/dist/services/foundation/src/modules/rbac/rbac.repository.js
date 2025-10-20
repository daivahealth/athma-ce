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
exports.RbacRepository = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
let RbacRepository = class RbacRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    createRole(data) {
        return this.prisma.role.create({
            data,
            select: this.roleSelect,
        });
    }
    findRoleByTenantAndCode(tenantId, code) {
        return this.prisma.role.findUnique({
            where: {
                tenantId_code: {
                    tenantId,
                    code,
                },
            },
            select: this.roleSelect,
        });
    }
    findRoles(tenantId) {
        return this.prisma.role.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' },
            select: this.roleSelect,
        });
    }
    findRoleById(id) {
        return this.prisma.role.findUnique({ where: { id }, select: this.roleSelect });
    }
    updateRole(id, data) {
        return this.prisma.role.update({
            where: { id },
            data,
            select: this.roleSelect,
        });
    }
    deleteRole(id) {
        return this.prisma.role.delete({ where: { id }, select: this.roleSelect });
    }
    createPermission(data) {
        return this.prisma.permission.create({
            data,
            select: this.permissionSelect,
        });
    }
    findPermissionByCode(code) {
        return this.prisma.permission.findUnique({ where: { code }, select: this.permissionSelect });
    }
    listPermissions() {
        return this.prisma.permission.findMany({
            orderBy: { code: 'asc' },
            select: this.permissionSelect,
        });
    }
    assignRoleToUser(userId, roleId) {
        return this.prisma.userRole.create({
            data: {
                userId,
                roleId,
            },
            select: this.userRoleSelect,
        });
    }
    removeRoleFromUser(userId, roleId) {
        return this.prisma.userRole.delete({
            where: {
                userId_roleId: {
                    userId,
                    roleId,
                },
            },
            select: this.userRoleSelect,
        });
    }
    listUserRoles(userId) {
        return this.prisma.userRole.findMany({
            where: { userId },
            select: {
                id: true,
                role: {
                    select: this.roleSelect,
                },
            },
        });
    }
    roleSelect = {
        id: true,
        tenantId: true,
        code: true,
        name: true,
        description: true,
        isSystem: true,
        createdAt: true,
        updatedAt: true,
    };
    permissionSelect = {
        id: true,
        code: true,
        name: true,
        description: true,
        resource: true,
        action: true,
        createdAt: true,
        updatedAt: true,
    };
    userRoleSelect = {
        id: true,
        userId: true,
        roleId: true,
        assignedAt: true,
        expiresAt: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
    };
};
exports.RbacRepository = RbacRepository;
exports.RbacRepository = RbacRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], RbacRepository);
//# sourceMappingURL=rbac.repository.js.map