/**
 * Default configuration values
 * These are fallback values when no config is found in DB
 */
import type { ConfigValues } from './types';
/**
 * Code-level defaults for all configuration keys
 * These serve as the ultimate fallback
 */
export declare const CONFIG_DEFAULTS: Partial<ConfigValues>;
/**
 * Get default value for a configuration key
 */
export declare function getDefaultValue<K extends keyof ConfigValues>(key: K): ConfigValues[K] | undefined;
