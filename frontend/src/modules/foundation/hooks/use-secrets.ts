import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { secretService } from '../services/secret-service';

const secretKeys = {
  list: (tenantId: string, ownerId?: string) => ['secrets', tenantId, ownerId ?? 'all'] as const,
};

export function useSecrets(tenantId: string, ownerId?: string) {
  return useQuery({
    queryKey: secretKeys.list(tenantId, ownerId),
    queryFn: () => secretService.list(tenantId, ownerId),
    enabled: Boolean(tenantId),
  });
}

export function usePutSecret() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenantId,
      key,
      value,
      ownerId,
      facilityId,
    }: {
      tenantId: string;
      key: string;
      value: string;
      ownerId: string;
      facilityId?: string;
    }) => secretService.put(tenantId, key, { value, ownerId, ...(facilityId ? { facilityId } : {}) }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['secrets', variables.tenantId] });
    },
  });
}

export function useDeleteSecret() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenantId,
      key,
      ownerId,
      facilityId,
    }: {
      tenantId: string;
      key: string;
      ownerId: string;
      facilityId?: string;
    }) => secretService.remove(tenantId, key, { ownerId, ...(facilityId ? { facilityId } : {}) }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['secrets', variables.tenantId] });
    },
  });
}
