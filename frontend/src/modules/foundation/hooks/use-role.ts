import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleService } from '../services/role-service';

export function useRole(id: string | undefined) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Role ID is required');
      }
      return roleService.getById(id);
    },
    enabled: !!id,
  });
}

export function useSetRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      roleService.setRolePermissions(roleId, permissionIds),
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: ['role', role.id] });
    },
  });
}
