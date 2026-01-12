import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user-service';

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
