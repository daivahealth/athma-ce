import { foundationClient } from '@/lib/api/client';
import type { Role } from '../types/role';

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
}

export const roleService = new RoleService();
