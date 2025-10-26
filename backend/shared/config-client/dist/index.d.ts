/**
 * Zeal Configuration Client
 * Hierarchical configuration management with caching
 */
export { ConfigClient, createConfigClient } from './config-client';
export { getDefaultValue, CONFIG_DEFAULTS } from './defaults';
export type { ConfigContext, ConfigLevel, ConfigValueType, ConfigCategory, ConfigValue, ConfigSchema, ConfigValues, ConfigChangeEvent, ConfigClientOptions, ResolvedConfig, } from './types';
