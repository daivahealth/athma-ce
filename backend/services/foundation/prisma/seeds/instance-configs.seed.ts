/**
 * Seed default instance-level configurations
 * Run this after creating the instance_configs table
 */

export const instanceConfigsData = [
  // ============================================
  // LOCALIZATION CONFIGS
  // ============================================
  {
    configKey: 'locale.default_language',
    value: 'en',
    valueType: 'string',
    category: 'localization',
    description: 'Default language for the platform (ISO 639-1 code)',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'locale.supported_languages',
    value: ['en', 'ar'],
    valueType: 'json',
    category: 'localization',
    description: 'List of supported languages',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'locale.timezone',
    value: 'UTC',
    valueType: 'string',
    category: 'localization',
    description: 'Default timezone (IANA timezone identifier)',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'locale.date_format',
    value: 'DD/MM/YYYY',
    valueType: 'string',
    category: 'localization',
    description: 'Default date display format',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'locale.time_format',
    value: '24h',
    valueType: 'string',
    category: 'localization',
    description: 'Time format: 12h or 24h',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'locale.first_day_of_week',
    value: 1,
    valueType: 'number',
    category: 'localization',
    description: 'First day of week: 0=Sunday, 1=Monday',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'locale.number_format',
    value: 'en-US',
    valueType: 'string',
    category: 'localization',
    description: 'Number formatting locale',
    isOverridable: true,
    isSensitive: false,
  },

  // ============================================
  // FINANCE CONFIGS
  // ============================================
  {
    configKey: 'finance.currency',
    value: 'USD',
    valueType: 'string',
    category: 'finance',
    description: 'Default currency (ISO 4217 code)',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'finance.decimal_places',
    value: 2,
    valueType: 'number',
    category: 'finance',
    description: 'Number of decimal places for currency display',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'finance.tax_rate',
    value: 0,
    valueType: 'number',
    category: 'finance',
    description: 'Default tax rate (percentage)',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'finance.payment_terms_days',
    value: 30,
    valueType: 'number',
    category: 'finance',
    description: 'Default payment terms (days)',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'finance.invoice_prefix',
    value: 'INV',
    valueType: 'string',
    category: 'finance',
    description: 'Invoice number prefix',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'finance.invoice_start_number',
    value: 1000,
    valueType: 'number',
    category: 'finance',
    description: 'Starting invoice number',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'finance.invoice_number_format',
    value: '{PREFIX}-{YEAR}-{SEQUENCE:6}',
    valueType: 'string',
    category: 'finance',
    description: 'Invoice number format pattern. Tokens: {PREFIX}, {YEAR}, {SEQUENCE:N}',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'finance.receipt_prefix',
    value: 'RCPT',
    valueType: 'string',
    category: 'finance',
    description: 'Receipt number prefix',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'finance.receipt_start_number',
    value: 1000,
    valueType: 'number',
    category: 'finance',
    description: 'Starting receipt number',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'finance.receipt_number_format',
    value: '{PREFIX}-{YEAR}-{SEQUENCE:6}',
    valueType: 'string',
    category: 'finance',
    description: 'Receipt number format pattern. Tokens: {PREFIX}, {YEAR}, {SEQUENCE:N}',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'finance.refund_prefix',
    value: 'REF',
    valueType: 'string',
    category: 'finance',
    description: 'Refund number prefix',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'finance.refund_start_number',
    value: 1000,
    valueType: 'number',
    category: 'finance',
    description: 'Starting refund number',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'finance.refund_number_format',
    value: '{PREFIX}-{YEAR}-{SEQUENCE:6}',
    valueType: 'string',
    category: 'finance',
    description: 'Refund number format pattern. Tokens: {PREFIX}, {YEAR}, {SEQUENCE:N}',
    isOverridable: true,
    isSensitive: false,
  },

  // ============================================
  // CLINICAL CONFIGS
  // ============================================
  {
    configKey: 'clinical.appointment_duration',
    value: 30,
    valueType: 'number',
    category: 'clinical',
    description: 'Default appointment duration in minutes',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'clinical.working_hours_start',
    value: '08:00',
    valueType: 'string',
    category: 'clinical',
    description: 'Default working hours start time (HH:MM)',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'clinical.working_hours_end',
    value: '18:00',
    valueType: 'string',
    category: 'clinical',
    description: 'Default working hours end time (HH:MM)',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'clinical.working_days',
    value: [1, 2, 3, 4, 5],
    valueType: 'json',
    category: 'clinical',
    description: 'Working days of the week (0=Sun, 1=Mon, ...)',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'clinical.patient_mrn_prefix',
    value: 'MRN',
    valueType: 'string',
    category: 'clinical',
    description: 'Patient Medical Record Number prefix',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'clinical.mrn_format',
    value: '{PREFIX}{YEAR}{SEQUENCE:6}',
    valueType: 'string',
    category: 'clinical',
    description: 'MRN format pattern',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'clinical.enable_telemedicine',
    value: false,
    valueType: 'boolean',
    category: 'clinical',
    description: 'Enable telemedicine/video consultations',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'clinical.max_appointments_per_day',
    value: 20,
    valueType: 'number',
    category: 'clinical',
    description: 'Maximum appointments per provider per day',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'clinical.consultation_types',
    value: ['in-person', 'video', 'phone'],
    valueType: 'json',
    category: 'clinical',
    description: 'Available consultation types',
    isOverridable: true,
    isSensitive: false,
  },

  // ============================================
  // SYSTEM CONFIGS
  // ============================================
  {
    configKey: 'system.session_timeout',
    value: 60,
    valueType: 'number',
    category: 'system',
    description: 'User session timeout in minutes',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'system.max_file_upload_size',
    value: 10,
    valueType: 'number',
    category: 'system',
    description: 'Maximum file upload size in MB',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'system.allowed_file_types',
    value: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
    valueType: 'json',
    category: 'system',
    description: 'Allowed file upload types',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'system.data_retention_days',
    value: 2555,
    valueType: 'number',
    category: 'system',
    description: 'Data retention period in days (~7 years)',
    isOverridable: false,
    isSensitive: false,
  },
  {
    configKey: 'system.enable_audit_logs',
    value: true,
    valueType: 'boolean',
    category: 'system',
    description: 'Enable comprehensive audit logging',
    isOverridable: false,
    isSensitive: false,
  },
  {
    configKey: 'system.enable_mfa',
    value: false,
    valueType: 'boolean',
    category: 'system',
    description: 'Require multi-factor authentication',
    isOverridable: true,
    isSensitive: false,
  },
  {
    configKey: 'system.password_min_length',
    value: 8,
    valueType: 'number',
    category: 'system',
    description: 'Minimum password length',
    isOverridable: false,
    isSensitive: false,
  },
  {
    configKey: 'system.password_require_special_char',
    value: true,
    valueType: 'boolean',
    category: 'system',
    description: 'Require special characters in passwords',
    isOverridable: false,
    isSensitive: false,
  },
];

/**
 * Get all instance configs grouped by category
 */
export function getInstanceConfigsByCategory() {
  const grouped: Record<string, typeof instanceConfigsData> = {};

  instanceConfigsData.forEach((config) => {
    if (!grouped[config.category]) {
      grouped[config.category] = [];
    }
    grouped[config.category].push(config);
  });

  return grouped;
}

/**
 * Get config by key
 */
export function getInstanceConfig(key: string) {
  return instanceConfigsData.find((c) => c.configKey === key);
}
