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
    userId?: string;
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
    'locale.default_language': string;
    'locale.supported_languages': string[];
    'locale.timezone': string;
    'locale.date_format': string;
    'locale.time_format': '12h' | '24h';
    'locale.first_day_of_week': 0 | 1;
    'locale.number_format': string;
    'finance.currency': string;
    'finance.decimal_places': number;
    'finance.tax_rate': number;
    'finance.tax_number': string;
    'finance.payment_terms_days': number;
    'finance.invoice_prefix': string;
    'finance.invoice_start_number': number;
    'clinical.appointment_duration': number;
    'clinical.working_hours_start': string;
    'clinical.working_hours_end': string;
    'clinical.working_days': number[];
    'clinical.mrn_format': string;
    'clinical.encounter_number_format': string;
    'clinical.enable_telemedicine': boolean;
    'clinical.max_appointments_per_day': number;
    'clinical.consultation_types': string[];
    'clinical.default_country_name': string;
    'clinical.default_country_iso': string;
    'clinical.default_city': string;
    'clinical.default_nationality_name': string;
    'clinical.default_nationality_iso': string;
    'clinical.patient_name_format': string;
    'system.session_timeout': number;
    'system.max_file_upload_size': number;
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
        entityId?: string;
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
        memoryTtlMs?: number;
        redisTtlMs?: number;
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
