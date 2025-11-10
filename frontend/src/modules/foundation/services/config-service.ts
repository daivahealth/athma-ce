import { foundationClient } from '@/lib/api/client';
import type {
  InstanceConfig,
  TenantConfig,
  FacilityConfig,
  ConfigSchema,
  ConfigResolveResponse,
  SetConfigDto,
} from '../types/config';

class ConfigService {
  /**
   * Get all instance configurations
   */
  async getAllInstanceConfigs(): Promise<InstanceConfig[]> {
    const response = await foundationClient.get('/configs/instance');
    return response.data;
  }

  /**
   * Get specific instance config by key
   */
  async getInstanceConfig(key: string): Promise<InstanceConfig> {
    const response = await foundationClient.get(`/configs/instance/${key}`);
    return response.data;
  }

  /**
   * Update instance config (admin only)
   */
  async updateInstanceConfig(key: string, data: SetConfigDto): Promise<InstanceConfig> {
    const response = await foundationClient.put(`/configs/instance/${key}`, data);
    return response.data;
  }

  /**
   * Get all tenant configs
   */
  async getTenantConfigs(tenantId: string): Promise<TenantConfig[]> {
    const response = await foundationClient.get(`/configs/tenant/${tenantId}`);
    return response.data;
  }

  /**
   * Set tenant config
   */
  async setTenantConfig(
    tenantId: string,
    key: string,
    data: SetConfigDto
  ): Promise<TenantConfig> {
    const response = await foundationClient.put(`/configs/tenant/${tenantId}/${key}`, data);
    return response.data;
  }

  /**
   * Delete tenant config (revert to instance default)
   */
  async deleteTenantConfig(tenantId: string, key: string, changeReason?: string): Promise<void> {
    await foundationClient.delete(`/configs/tenant/${tenantId}/${key}`, {
      data: { changeReason },
    });
  }

  /**
   * Get all facility configs
   */
  async getFacilityConfigs(facilityId: string): Promise<FacilityConfig[]> {
    const response = await foundationClient.get(`/configs/facility/${facilityId}`);
    return response.data;
  }

  /**
   * Set facility config
   */
  async setFacilityConfig(
    facilityId: string,
    key: string,
    data: SetConfigDto
  ): Promise<FacilityConfig> {
    const response = await foundationClient.put(`/configs/facility/${facilityId}/${key}`, data);
    return response.data;
  }

  /**
   * Delete facility config (revert to tenant/instance default)
   */
  async deleteFacilityConfig(
    facilityId: string,
    key: string,
    changeReason?: string
  ): Promise<void> {
    await foundationClient.delete(`/configs/facility/${facilityId}/${key}`, {
      data: { changeReason },
    });
  }

  /**
   * Resolve a config value for the current context
   */
  async resolveConfig(key: string): Promise<ConfigResolveResponse> {
    const response = await foundationClient.get('/configs/resolve', {
      params: { key },
    });
    return response.data;
  }

  /**
   * Get all effective configs for current context
   */
  async getEffectiveConfigs(): Promise<Record<string, any>> {
    const response = await foundationClient.get('/configs/effective');
    return response.data;
  }

  /**
   * Get config schema (all available keys)
   */
  async getConfigSchema(): Promise<ConfigSchema[]> {
    const response = await foundationClient.get('/configs/schema');
    return response.data;
  }
}

export const configService = new ConfigService();
