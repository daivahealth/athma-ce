import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user-service';
import type { AssignFacilityDTO, CreateUserDTO, SetDefaultFacilityDTO, UpdateUserDTO } from '../types/user';

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

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDTO) => userService.create(data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'tenant', user.tenantId] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserDTO }) =>
      userService.update(userId, data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['users', user.id] });
      queryClient.invalidateQueries({ queryKey: ['users', 'tenant', user.tenantId] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useAssignFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AssignFacilityDTO }) =>
      userService.assignFacility(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId, 'facilities'] });
    },
  });
}

export function useSetDefaultFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: SetDefaultFacilityDTO }) =>
      userService.setDefaultFacility(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId, 'facilities'] });
    },
  });
}

export function useRevokeFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, facilityId }: { userId: string; facilityId: string }) =>
      userService.revokeFacility(userId, facilityId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId, 'facilities'] });
    },
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
