import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configService } from '../services/config-service';
import type { SetConfigDto } from '../types/config';

// Query keys
export const configKeys = {
  all: ['configs'] as const,
  instance: () => [...configKeys.all, 'instance'] as const,
  instanceConfig: (key: string) => [...configKeys.instance(), key] as const,
  tenant: (tenantId: string) => [...configKeys.all, 'tenant', tenantId] as const,
  facility: (facilityId: string) => [...configKeys.all, 'facility', facilityId] as const,
  effective: () => [...configKeys.all, 'effective'] as const,
  schema: () => [...configKeys.all, 'schema'] as const,
  resolve: (key: string) => [...configKeys.all, 'resolve', key] as const,
};

/**
 * Hook to fetch all instance configurations
 */
export function useInstanceConfigs() {
  return useQuery({
    queryKey: configKeys.instance(),
    queryFn: () => configService.getAllInstanceConfigs(),
  });
}

/**
 * Hook to fetch a specific instance configuration
 */
export function useInstanceConfig(key: string) {
  return useQuery({
    queryKey: configKeys.instanceConfig(key),
    queryFn: () => configService.getInstanceConfig(key),
    enabled: !!key,
  });
}

/**
 * Hook to update an instance configuration
 */
export function useUpdateInstanceConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: SetConfigDto }) =>
      configService.updateInstanceConfig(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: configKeys.instance() });
      queryClient.invalidateQueries({ queryKey: configKeys.effective() });
    },
  });
}

/**
 * Hook to fetch tenant configurations
 */
export function useTenantConfigs(tenantId: string) {
  return useQuery({
    queryKey: configKeys.tenant(tenantId),
    queryFn: () => configService.getTenantConfigs(tenantId),
    enabled: !!tenantId,
  });
}

/**
 * Hook to set tenant configuration
 */
export function useSetTenantConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tenantId,
      key,
      data,
    }: {
      tenantId: string;
      key: string;
      data: SetConfigDto;
    }) => configService.setTenantConfig(tenantId, key, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: configKeys.tenant(variables.tenantId) });
      queryClient.invalidateQueries({ queryKey: configKeys.effective() });
    },
  });
}

/**
 * Hook to delete tenant configuration
 */
export function useDeleteTenantConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tenantId,
      key,
      changeReason,
    }: {
      tenantId: string;
      key: string;
      changeReason?: string;
    }) => configService.deleteTenantConfig(tenantId, key, changeReason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: configKeys.tenant(variables.tenantId) });
      queryClient.invalidateQueries({ queryKey: configKeys.effective() });
    },
  });
}

/**
 * Hook to fetch facility configurations
 */
export function useFacilityConfigs(facilityId: string) {
  return useQuery({
    queryKey: configKeys.facility(facilityId),
    queryFn: () => configService.getFacilityConfigs(facilityId),
    enabled: !!facilityId,
  });
}

/**
 * Hook to set facility configuration
 */
export function useSetFacilityConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      key,
      data,
    }: {
      facilityId: string;
      key: string;
      data: SetConfigDto;
    }) => configService.setFacilityConfig(facilityId, key, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: configKeys.facility(variables.facilityId) });
      queryClient.invalidateQueries({ queryKey: configKeys.effective() });
    },
  });
}

/**
 * Hook to delete facility configuration
 */
export function useDeleteFacilityConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      key,
      changeReason,
    }: {
      facilityId: string;
      key: string;
      changeReason?: string;
    }) => configService.deleteFacilityConfig(facilityId, key, changeReason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: configKeys.facility(variables.facilityId) });
      queryClient.invalidateQueries({ queryKey: configKeys.effective() });
    },
  });
}

/**
 * Hook to resolve a configuration value
 */
export function useResolveConfig(key: string) {
  return useQuery({
    queryKey: configKeys.resolve(key),
    queryFn: () => configService.resolveConfig(key),
    enabled: !!key,
  });
}

/**
 * Hook to fetch all effective configurations
 */
export function useEffectiveConfigs() {
  return useQuery({
    queryKey: configKeys.effective(),
    queryFn: () => configService.getEffectiveConfigs(),
  });
}

/**
 * Hook to fetch configuration schema
 */
export function useConfigSchema() {
  return useQuery({
    queryKey: configKeys.schema(),
    queryFn: () => configService.getConfigSchema(),
  });
}
