import { useQuery } from '@tanstack/react-query';
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
