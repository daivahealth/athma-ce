import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user-service';

export function useUsers(tenantId: string | undefined) {
  return useQuery({
    queryKey: ['users', 'tenant', tenantId],
    queryFn: () => {
      if (!tenantId) {
        throw new Error('Tenant ID is required');
      }
      return userService.listByTenant(tenantId);
    },
    enabled: !!tenantId,
  });
}

export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return userService.getById(userId);
    },
    enabled: !!userId,
  });
}

export function useUserFacilities(userId: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['users', userId, 'facilities'],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return userService.getUserFacilities(userId);
    },
    enabled: options?.enabled ?? !!userId,
  });
}

export function useLinkStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, staffId }: { userId: string; staffId: string }) =>
      userService.linkStaff(userId, staffId),
    onSuccess: (data) => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ['users', data.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });

      // Invalidate staff queries since staff now has a linked user
      if (data.staffId) {
        queryClient.invalidateQueries({ queryKey: ['staff', data.staffId] });
      }
    },
  });
}

export function useUnlinkStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.unlinkStaff(userId),
    onSuccess: (data, userId) => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });

      // Invalidate staff queries
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}
