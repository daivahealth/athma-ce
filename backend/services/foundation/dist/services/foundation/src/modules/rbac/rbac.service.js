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
exports.RbacService = void 0;
const common_1 = require("@nestjs/common");
const rbac_repository_1 = require("./rbac.repository");
let RbacService = class RbacService {
    rbacRepository;
    constructor(rbacRepository) {
        this.rbacRepository = rbacRepository;
    }
    async createRole(dto) {
        const collision = await this.rbacRepository.findRoleByTenantAndCode(dto.tenantId, dto.code);
        if (collision) {
            throw new common_1.ConflictException('Role code already exists for tenant');
        }
        return this.rbacRepository.createRole(dto);
    }
    listRoles(tenantId) {
        return this.rbacRepository.findRoles(tenantId);
    }
    async getRole(id) {
        const role = await this.rbacRepository.findRoleById(id);
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        return role;
    }
    async updateRole(id, dto) {
        const current = await this.getRole(id);
        if (dto.code && dto.code !== current.code) {
            const collision = await this.rbacRepository.findRoleByTenantAndCode(current.tenantId, dto.code);
            if (collision && collision.id !== id) {
                throw new common_1.ConflictException('Role code already exists for tenant');
            }
        }
        const updates = {};
        if (dto.name !== undefined) {
            updates.name = dto.name;
        }
        if (dto.description !== undefined) {
            updates.description = dto.description;
        }
        return this.rbacRepository.updateRole(id, updates);
    }
    async deleteRole(id) {
        await this.getRole(id);
        await this.rbacRepository.deleteRole(id);
    }
    async assignRoleToUser(userId, roleId) {
        await this.getRole(roleId);
        return this.rbacRepository.assignRoleToUser(userId, roleId);
    }
    removeRoleFromUser(userId, roleId) {
        return this.rbacRepository.removeRoleFromUser(userId, roleId);
    }
    listUserRoles(userId) {
        return this.rbacRepository.listUserRoles(userId);
    }
    listPermissions() {
        return this.rbacRepository.listPermissions();
    }
};
exports.RbacService = RbacService;
exports.RbacService = RbacService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rbac_repository_1.RbacRepository])
], RbacService);
//# sourceMappingURL=rbac.service.js.map