"use strict";
/**
 * Example: How to use the Config Client in Clinical service
 *
 * This file demonstrates various ways to access configuration values
 * in the Clinical service.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleSingleConfig = exampleSingleConfig;
exports.exampleMultipleConfigs = exampleMultipleConfigs;
exports.createAppointment = createAppointment;
exports.configMiddleware = configMiddleware;
exports.exampleAllConfigs = exampleAllConfigs;
exports.invalidateConfigCache = invalidateConfigCache;
const index_1 = require("./index");
/**
 * Example 1: Get a single config value
 */
async function exampleSingleConfig(req) {
    const context = {
        tenantId: req.headers['x-tenant-id'],
        facilityId: req.headers['x-facility-id'],
        userId: req.headers['x-user-id'],
    };
    // Get timezone for the current facility/tenant
    const timezone = await index_1.configClient.get('locale.timezone', context);
    console.log('Timezone:', timezone);
    return timezone;
}
/**
 * Example 2: Get multiple configs at once
 */
async function exampleMultipleConfigs(req) {
    const context = {
        tenantId: req.headers['x-tenant-id'],
        facilityId: req.headers['x-facility-id'],
    };
    const configs = await index_1.configClient.getMany([
        'locale.timezone',
        'clinical.appointment_duration',
        'clinical.working_hours_start',
        'clinical.working_hours_end',
    ], context);
    console.log('Configs:', configs);
    // Type-safe access:
    // configs['locale.timezone'] -> string
    // configs['clinical.appointment_duration'] -> number
    return configs;
}
/**
 * Example 3: Use configs in business logic
 */
async function createAppointment(patientId, req) {
    const context = {
        tenantId: req.headers['x-tenant-id'],
        facilityId: req.headers['x-facility-id'],
    };
    // Get appointment duration from config
    const duration = await index_1.configClient.get('clinical.appointment_duration', context);
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
async function configMiddleware(req, res, next) {
    const context = {
        tenantId: req.headers['x-tenant-id'],
        facilityId: req.headers['x-facility-id'],
    };
    // Preload common configs and attach to request
    req.configs = await index_1.configClient.getMany([
        'locale.timezone',
        'locale.date_format',
        'clinical.appointment_duration',
    ], context);
    next();
}
/**
 * Example 5: Get all effective configs
 */
async function exampleAllConfigs(req) {
    const context = {
        tenantId: req.headers['x-tenant-id'],
        facilityId: req.headers['x-facility-id'],
    };
    // Get all effective configs for this context
    const allConfigs = await index_1.configClient.getAll(context);
    return allConfigs;
}
/**
 * Example 6: Manual cache invalidation
 */
async function invalidateConfigCache(key, tenantId, facilityId) {
    // If config was updated externally, invalidate the cache
    const context = {};
    if (tenantId)
        context.tenantId = tenantId;
    if (facilityId)
        context.facilityId = facilityId;
    await index_1.configClient.invalidate(key, context);
    console.log(`Cache invalidated for: ${key}`);
}
//# sourceMappingURL=example-usage.js.map