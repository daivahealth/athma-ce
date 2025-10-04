import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RbacRepository } from './rbac.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RbacService {
  constructor(private readonly rbacRepository: RbacRepository) {}

  async createRole(dto: CreateRoleDto) {
    const collision = await this.rbacRepository.findRoleByTenantAndCode(dto.tenantId, dto.code);
    if (collision) {
      throw new ConflictException('Role code already exists for tenant');
    }
    return this.rbacRepository.createRole(dto);
  }

  listRoles(tenantId: string) {
    return this.rbacRepository.findRoles(tenantId);
  }

  async getRole(id: string) {
    const role = await this.rbacRepository.findRoleById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    const current = await this.getRole(id);
    if (dto.code && dto.code !== current.code) {
    const collision = await this.rbacRepository.findRoleByTenantAndCode(current.tenantId, dto.code);
    if (collision && collision.id !== id) {
      throw new ConflictException('Role code already exists for tenant');
    }
  }

    const updates: Partial<{ name: string; description: string }> = {};
    if (dto.name !== undefined) {
      updates.name = dto.name;
    }
    if (dto.description !== undefined) {
      updates.description = dto.description;
    }

    return this.rbacRepository.updateRole(id, updates);
  }

  async deleteRole(id: string) {
    await this.getRole(id);
    await this.rbacRepository.deleteRole(id);
  }

  async assignRoleToUser(userId: string, roleId: string) {
    await this.getRole(roleId);
    return this.rbacRepository.assignRoleToUser(userId, roleId);
  }

  removeRoleFromUser(userId: string, roleId: string) {
    return this.rbacRepository.removeRoleFromUser(userId, roleId);
  }

  listUserRoles(userId: string) {
    return this.rbacRepository.listUserRoles(userId);
  }

  listPermissions() {
    return this.rbacRepository.listPermissions();
  }
}
