import { foundationClient } from '@/lib/api/client';
import type { CreateRoleDTO, Permission, Role, UpdateRoleDTO, UserRole } from '../types/role';

class RoleService {
  async list(tenantId: string): Promise<Role[]> {
    const response = await foundationClient.get('/rbac/roles', {
      params: { tenantId },
    });
    return response.data;
  }

  async getById(id: string): Promise<Role> {
    const response = await foundationClient.get(`/rbac/roles/${id}`);
    return response.data;
  }

  async create(data: CreateRoleDTO): Promise<Role> {
    const response = await foundationClient.post('/rbac/roles', data);
    return response.data;
  }

  async update(id: string, data: UpdateRoleDTO): Promise<Role> {
    const response = await foundationClient.put(`/rbac/roles/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await foundationClient.delete(`/rbac/roles/${id}`);
  }

  async listPermissions(): Promise<Permission[]> {
    const response = await foundationClient.get('/rbac/permissions');
    return response.data;
  }

  async setRolePermissions(roleId: string, permissionIds: string[]): Promise<Role> {
    const response = await foundationClient.put(`/rbac/roles/${roleId}/permissions`, {
      permissionIds,
    });
    return response.data;
  }

  async listUserRoles(userId: string): Promise<UserRole[]> {
    const response = await foundationClient.get(`/rbac/users/${userId}/roles`);
    return response.data;
  }

  async assignRoleToUser(
    userId: string,
    roleId: string,
  ): Promise<{ id: string; userId: string; roleId: string }> {
    const response = await foundationClient.post(`/rbac/users/${userId}/roles/${roleId}`);
    return response.data;
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    await foundationClient.delete(`/rbac/users/${userId}/roles/${roleId}`);
  }
}

export const roleService = new RoleService();
