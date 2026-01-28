import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleService } from '../services/role-service';
import type { Permission, UserRole } from '../types/role';

const rbacKeys = {
  permissions: () => ['rbac', 'permissions'] as const,
  userRoles: (userId: string) => ['rbac', 'users', userId, 'roles'] as const,
};

export function usePermissions() {
  return useQuery<Permission[]>({
    queryKey: rbacKeys.permissions(),
    queryFn: () => roleService.listPermissions(),
  });
}

export function useUserRoles(userId: string | undefined) {
  return useQuery<UserRole[]>({
    queryKey: userId ? rbacKeys.userRoles(userId) : ['rbac', 'users', 'unknown', 'roles'],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return roleService.listUserRoles(userId);
    },
    enabled: !!userId,
  });
}

export function useAssignUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      roleService.assignRoleToUser(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.userRoles(variables.userId) });
      queryClient.invalidateQueries({ queryKey: ['role', variables.roleId] });
    },
  });
}

export function useRemoveUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      roleService.removeRoleFromUser(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.userRoles(variables.userId) });
      queryClient.invalidateQueries({ queryKey: ['role', variables.roleId] });
    },
  });
}
