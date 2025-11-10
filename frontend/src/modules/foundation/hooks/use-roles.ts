import { useQuery } from '@tanstack/react-query';
import { getSession } from '@/lib/api/client';
import { roleService } from '../services/role-service';
import type { Role } from '../types/role';

export function useRoles() {
  const session = getSession();
  const tenantId = session.user?.tenantId;

  return useQuery<Role[]>({
    queryKey: ['roles', tenantId ?? 'unknown'],
    queryFn: () => {
      if (!tenantId) {
        throw new Error('Tenant ID is required to load roles');
      }
      return roleService.list(tenantId);
    },
    enabled: Boolean(tenantId),
  });
}
