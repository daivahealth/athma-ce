/**
 * Example: How to use the Config Client in Clinical service
 *
 * This file demonstrates various ways to access configuration values
 * in the Clinical service.
 */

import { configClient } from './index';

/**
 * Example 1: Get a single config value
 */
export async function exampleSingleConfig(req: any) {
  const context = {
    tenantId: req.headers['x-tenant-id'],
    facilityId: req.headers['x-facility-id'],
    userId: req.headers['x-user-id'],
  };

  // Get timezone for the current facility/tenant
  const timezone = await configClient.get('locale.timezone', context);
  console.log('Timezone:', timezone);

  return timezone;
}

/**
 * Example 2: Get multiple configs at once
 */
export async function exampleMultipleConfigs(req: any) {
  const context = {
    tenantId: req.headers['x-tenant-id'],
    facilityId: req.headers['x-facility-id'],
  };

  const configs = await configClient.getMany(
    [
      'locale.timezone',
      'clinical.appointment_duration',
      'clinical.working_hours_start',
      'clinical.working_hours_end',
    ],
    context
  );

  console.log('Configs:', configs);
  // Type-safe access:
  // configs['locale.timezone'] -> string
  // configs['clinical.appointment_duration'] -> number

  return configs;
}

/**
 * Example 3: Use configs in business logic
 */
export async function createAppointment(patientId: string, req: any) {
  const context = {
    tenantId: req.headers['x-tenant-id'],
    facilityId: req.headers['x-facility-id'],
  };

  // Get appointment duration from config
  const duration = await configClient.get('clinical.appointment_duration', context);

  // Use it in your logic
  const appointment = {
    patientId,
    duration, // e.g., 30 minutes
    startTime: new Date(),
    endTime: new Date(Date.now() + duration * 60000),
  };

  return appointment;
}

/**
 * Example 4: Middleware to inject configs into request
 */
export async function configMiddleware(req: any, res: any, next: any) {
  const context = {
    tenantId: req.headers['x-tenant-id'],
    facilityId: req.headers['x-facility-id'],
  };

  // Preload common configs and attach to request
  req.configs = await configClient.getMany(
    [
      'locale.timezone',
      'locale.date_format',
      'clinical.appointment_duration',
    ],
    context
  );

  next();
}

/**
 * Example 5: Get all effective configs
 */
export async function exampleAllConfigs(req: any) {
  const context = {
    tenantId: req.headers['x-tenant-id'],
    facilityId: req.headers['x-facility-id'],
  };

  // Get all effective configs for this context
  const allConfigs = await configClient.getAll(context);

  return allConfigs;
}

/**
 * Example 6: Manual cache invalidation
 */
export async function invalidateConfigCache(key: string, tenantId?: string, facilityId?: string) {
  // If config was updated externally, invalidate the cache
  await configClient.invalidate(key, { tenantId, facilityId });
  console.log(`Cache invalidated for: ${key}`);
}
