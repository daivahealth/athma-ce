import { foundationClient } from '@/lib/api/client';
import type { PluginRegistryEntry } from '../types/plugin';

class PluginService {
  async listPlugins(filters?: { status?: string; targetService?: string }): Promise<PluginRegistryEntry[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.targetService) params.set('targetService', filters.targetService);
    const response = await foundationClient.get('/plugins', { params });
    return response.data.data;
  }

  async getPlugin(pluginId: string): Promise<PluginRegistryEntry> {
    const response = await foundationClient.get(`/plugins/${pluginId}`);
    return response.data.data;
  }

  async installPlugin(packagePath: string, manifest?: Record<string, unknown>): Promise<PluginRegistryEntry> {
    const response = await foundationClient.post('/plugins/install', { packagePath, manifest });
    return response.data.data;
  }

  async activatePlugin(pluginId: string, tenantId: string, settings?: Record<string, unknown>) {
    const response = await foundationClient.put(`/plugins/${pluginId}/activate`, { tenantId, settings });
    return response.data.data;
  }

  async deactivatePlugin(pluginId: string, tenantId: string) {
    const response = await foundationClient.put(`/plugins/${pluginId}/deactivate`, { tenantId });
    return response.data.data;
  }

  async getActivePluginsForTenant(tenantId: string) {
    const response = await foundationClient.get(`/plugins/tenant/${tenantId}/active`);
    return response.data.data;
  }
}

export const pluginService = new PluginService();
