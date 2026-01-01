/**
 * Configuration Factory
 * Returns typed configuration object
 */

export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3013', 10),
  logLevel: process.env.LOG_LEVEL || 'info',

  database: {
    url: process.env.PRM_DATABASE_URL,
  },

  oidc: {
    issuer: process.env.OIDC_ISSUER,
    clientId: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    callbackUrl: process.env.OIDC_CALLBACK_URL,
    tenantClaim: process.env.OIDC_TENANT_CLAIM || 'tid',
    userClaim: process.env.OIDC_USER_CLAIM || 'sub',
  },

  externalServices: {
    clinicalConsent: {
      url: process.env.CLINICAL_CONSENT_SERVICE_URL,
      timeout: parseInt(process.env.CLINICAL_CONSENT_SERVICE_TIMEOUT || '5000', 10),
    },
  },

  jobWorker: {
    intervalMs: parseInt(process.env.JOB_WORKER_INTERVAL_MS || '5000', 10),
    batchSize: parseInt(process.env.JOB_WORKER_BATCH_SIZE || '10', 10),
    maxRetries: parseInt(process.env.JOB_WORKER_MAX_RETRIES || '3', 10),
    backoffBaseMs: parseInt(process.env.JOB_WORKER_BACKOFF_BASE_MS || '1000', 10),
    instanceId: process.env.JOB_WORKER_INSTANCE_ID || `worker-${Math.random().toString(36).substr(2, 9)}`,
  },

  channelProviders: {
    sms: {
      provider: process.env.SMS_PROVIDER || 'twilio',
      apiKey: process.env.SMS_PROVIDER_API_KEY || 'stub',
    },
    whatsapp: {
      provider: process.env.WHATSAPP_PROVIDER || 'twilio',
      apiKey: process.env.WHATSAPP_PROVIDER_API_KEY || 'stub',
    },
    email: {
      provider: process.env.EMAIL_PROVIDER || 'sendgrid',
      apiKey: process.env.EMAIL_PROVIDER_API_KEY || 'stub',
    },
  },
});
