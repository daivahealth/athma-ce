/**
 * Configuration Client Types
 * Provides type-safe access to configuration values
 */

/**
 * Configuration context for resolution
 */
export interface ConfigContext {
  tenantId?: string;
  facilityId?: string;
  userId?: string; // For audit purposes
}

/**
 * Configuration levels in hierarchy
 */
export type ConfigLevel = 'instance' | 'tenant' | 'facility';

/**
 * Configuration value types
 */
export type ConfigValueType = 'string' | 'number' | 'boolean' | 'json';

/**
 * Configuration category
 */
export type ConfigCategory = 'localization' | 'finance' | 'clinical' | 'system';

/**
 * Base configuration interface
 */
export interface ConfigValue {
  key: string;
  value: any;
  valueType: ConfigValueType;
  category: ConfigCategory;
  level: ConfigLevel;
}

/**
 * Configuration schema definition
 */
export interface ConfigSchema {
  key: string;
  valueType: ConfigValueType;
  category: ConfigCategory;
  description: string;
  defaultValue: any;
  isOverridable: boolean;
  isSensitive: boolean;
  validation?: {
    min?: number;
    max?: number;
    enum?: any[];
    pattern?: string;
  };
}

/**
 * Typed configuration values
 * Add new config keys here for type safety
 */
export interface ConfigValues {
  // Localization
  'locale.default_language': string;
  'locale.supported_languages': string[];
  'locale.timezone': string;
  'locale.date_format': string;
  'locale.time_format': '12h' | '24h';
  'locale.first_day_of_week': 0 | 1; // 0 = Sunday, 1 = Monday
  'locale.number_format': string;

  // Finance
  'finance.currency': string; // ISO 4217 code
  'finance.decimal_places': number;
  'finance.tax_rate': number; // percentage
  'finance.tax_number': string;
  'finance.payment_terms_days': number;
  'finance.invoice_prefix': string;
  'finance.invoice_start_number': number;

  // Clinical
  'clinical.appointment_duration': number; // minutes
  'clinical.working_hours_start': string; // HH:MM format
  'clinical.working_hours_end': string; // HH:MM format
  'clinical.working_days': number[]; // 0-6 (Sun-Sat)
  'clinical.patient_mrn_prefix': string;
  'clinical.patient_mrn_format': string;
  'clinical.enable_telemedicine': boolean;
  'clinical.max_appointments_per_day': number;
  'clinical.consultation_types': string[];

  // System
  'system.session_timeout': number; // minutes
  'system.max_file_upload_size': number; // MB
  'system.allowed_file_types': string[];
  'system.data_retention_days': number;
  'system.enable_audit_logs': boolean;
  'system.enable_mfa': boolean;
  'system.password_min_length': number;
  'system.password_require_special_char': boolean;
}

/**
 * Configuration change event
 */
export interface ConfigChangeEvent {
  eventType: 'config.instance.updated' | 'config.tenant.updated' | 'config.facility.updated';
  eventId: string;
  timestamp: string;
  payload: {
    configKey: string;
    level: ConfigLevel;
    entityId?: string; // tenantId or facilityId
    oldValue: any;
    newValue: any;
    changedBy: string;
  };
}

/**
 * Configuration client options
 */
export interface ConfigClientOptions {
  foundationBaseUrl: string;
  enableCache?: boolean;
  cacheConfig?: {
    redisUrl?: string;
    memoryTtlMs?: number; // In-memory cache TTL
    redisTtlMs?: number;  // Redis cache TTL
  };
}

/**
 * Resolved configuration result
 */
export interface ResolvedConfig<T = any> {
  key: string;
  value: T;
  level: ConfigLevel;
  source: 'cache' | 'api' | 'default';
}
