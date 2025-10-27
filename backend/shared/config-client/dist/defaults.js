"use strict";
/**
 * Default configuration values
 * These are fallback values when no config is found in DB
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG_DEFAULTS = void 0;
exports.getDefaultValue = getDefaultValue;
/**
 * Code-level defaults for all configuration keys
 * These serve as the ultimate fallback
 */
exports.CONFIG_DEFAULTS = {
    // Localization
    'locale.default_language': 'en',
    'locale.supported_languages': ['en', 'ar'],
    'locale.timezone': 'UTC',
    'locale.date_format': 'DD/MM/YYYY',
    'locale.time_format': '24h',
    'locale.first_day_of_week': 1, // Monday
    'locale.number_format': 'en-US',
    // Finance
    'finance.currency': 'AED',
    'finance.decimal_places': 2,
    'finance.tax_rate': 0,
    'finance.payment_terms_days': 30,
    'finance.invoice_prefix': 'INV',
    'finance.invoice_start_number': 1000,
    // Clinical
    'clinical.appointment_duration': 30, // 30 minutes
    'clinical.working_hours_start': '08:00',
    'clinical.working_hours_end': '18:00',
    'clinical.working_days': [1, 2, 3, 4, 5], // Mon-Fri
    'clinical.mrn_format': 'PAT-{YEAR}-{SEQ:6}', // Default MRN format
    'clinical.enable_telemedicine': false,
    'clinical.max_appointments_per_day': 20,
    'clinical.consultation_types': ['in-person', 'video', 'phone'],
    'clinical.default_country_name': 'United Arab Emirates',
    'clinical.default_country_iso': 'AE',
    'clinical.default_city': 'Dubai',
    'clinical.default_nationality_name': 'United Arab Emirates',
    'clinical.default_nationality_iso': 'AE',
    // System
    'system.session_timeout': 60, // 60 minutes
    'system.max_file_upload_size': 10, // 10 MB
    'system.allowed_file_types': ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
    'system.data_retention_days': 2555, // ~7 years
    'system.enable_audit_logs': true,
    'system.enable_mfa': false,
    'system.password_min_length': 8,
    'system.password_require_special_char': true,
};
/**
 * Get default value for a configuration key
 */
function getDefaultValue(key) {
    return exports.CONFIG_DEFAULTS[key];
}
