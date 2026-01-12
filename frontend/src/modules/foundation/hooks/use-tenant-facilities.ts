import { useQuery } from '@tanstack/react-query';
import { facilityService } from '../services/facility-service';

export function useTenantFacilities(tenantId: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['facilities', 'tenant', tenantId],
    queryFn: () => {
      if (!tenantId) {
        throw new Error('Tenant ID is required');
      }
      return facilityService.listByTenant(tenantId);
    },
    enabled: options?.enabled ?? !!tenantId,
  });
}
