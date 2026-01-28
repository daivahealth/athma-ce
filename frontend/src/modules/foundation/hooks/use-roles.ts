import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession } from '@/lib/api/client';
import { roleService } from '../services/role-service';
import type { CreateRoleDTO, Role, UpdateRoleDTO } from '../types/role';

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

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleDTO) => roleService.create(data),
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: ['roles', role.tenantId] });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleDTO }) =>
      roleService.update(id, data),
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: ['role', role.id] });
      queryClient.invalidateQueries({ queryKey: ['roles', role.tenantId] });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}
