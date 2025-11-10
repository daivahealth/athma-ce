export interface InstanceConfig {
  id: string;
  configKey: string;
  value: any;
  valueType: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description?: string;
  isOverridable: boolean;
  isSensitive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface TenantConfig {
  id: string;
  tenantId: string;
  configKey: string;
  value: any;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface FacilityConfig {
  id: string;
  facilityId: string;
  configKey: string;
  value: any;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ConfigSchema {
  configKey: string;
  valueType: string;
  category: string;
  description?: string;
  isOverridable: boolean;
  isSensitive: boolean;
}

export interface ConfigResolveResponse {
  value: any;
  level: 'instance' | 'tenant' | 'facility';
}

export interface SetConfigDto {
  value: any;
  changeReason?: string;
}
