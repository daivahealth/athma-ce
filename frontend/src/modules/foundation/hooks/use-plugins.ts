import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pluginService } from '../services/plugin-service';

export const pluginKeys = {
  all: ['plugins'] as const,
  list: (filters?: { status?: string; targetService?: string }) =>
    [...pluginKeys.all, 'list', filters] as const,
  detail: (pluginId: string) => [...pluginKeys.all, 'detail', pluginId] as const,
  tenantActive: (tenantId: string) => [...pluginKeys.all, 'tenant', tenantId] as const,
};

export function usePlugins(filters?: { status?: string; targetService?: string }) {
  return useQuery({
    queryKey: pluginKeys.list(filters),
    queryFn: () => pluginService.listPlugins(filters),
  });
}

export function usePlugin(pluginId: string) {
  return useQuery({
    queryKey: pluginKeys.detail(pluginId),
    queryFn: () => pluginService.getPlugin(pluginId),
    enabled: !!pluginId,
  });
}

export function useActivatePlugin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pluginId,
      tenantId,
      settings,
    }: {
      pluginId: string;
      tenantId: string;
      settings?: Record<string, unknown>;
    }) => pluginService.activatePlugin(pluginId, tenantId, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pluginKeys.all });
    },
  });
}

export function useDeactivatePlugin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pluginId,
      tenantId,
    }: {
      pluginId: string;
      tenantId: string;
    }) => pluginService.deactivatePlugin(pluginId, tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pluginKeys.all });
    },
  });
}
