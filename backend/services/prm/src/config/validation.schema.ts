/**
 * Environment Variables Validation
 * Uses Joi to validate environment on startup
 */

import * as Joi from 'joi';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().port().default(3013),
  LOG_LEVEL: Joi.string().valid('trace', 'debug', 'info', 'warn', 'error', 'fatal').default('info'),

  PRM_DATABASE_URL: Joi.string().uri().required(),

  OIDC_ISSUER: Joi.string().uri().required(),
  OIDC_CLIENT_ID: Joi.string().required(),
  OIDC_CLIENT_SECRET: Joi.string().required(),
  OIDC_CALLBACK_URL: Joi.string().uri().required(),
  OIDC_TENANT_CLAIM: Joi.string().default('tid'),
  OIDC_USER_CLAIM: Joi.string().default('sub'),

  CLINICAL_CONSENT_SERVICE_URL: Joi.string().uri().required(),
  CLINICAL_CONSENT_SERVICE_TIMEOUT: Joi.number().default(5000),

  JOB_WORKER_INTERVAL_MS: Joi.number().default(5000),
  JOB_WORKER_BATCH_SIZE: Joi.number().default(10),
  JOB_WORKER_MAX_RETRIES: Joi.number().default(3),
  JOB_WORKER_BACKOFF_BASE_MS: Joi.number().default(1000),

  SMS_PROVIDER: Joi.string().default('twilio'),
  SMS_PROVIDER_API_KEY: Joi.string().default('stub'),
  WHATSAPP_PROVIDER: Joi.string().default('twilio'),
  WHATSAPP_PROVIDER_API_KEY: Joi.string().default('stub'),
  EMAIL_PROVIDER: Joi.string().default('sendgrid'),
  EMAIL_PROVIDER_API_KEY: Joi.string().default('stub'),
});

export function validateEnvironment(config: Record<string, unknown>) {
  const { error, value } = validationSchema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
}
