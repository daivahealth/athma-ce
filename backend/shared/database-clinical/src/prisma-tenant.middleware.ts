/**
 * Prisma Tenant Isolation Middleware
 *
 * Automatically injects tenantId filter into all database queries
 * to ensure row-level security and data isolation
 */

import { Prisma } from '../generated';
import { RequestContext, type RequestContextStore } from '@zeal/shared-utils';

/**
 * Models that require tenant isolation
 */
const TENANT_ISOLATED_MODELS = [
  'Patient',
  'PatientHistory',
  'PatientDocument',
  'PatientConsent',
  'ConsentTemplate',
  'Appointment',
  'Encounter',
  'Prescription',
  'LabOrder',
  'Invoice',
  'Payment',
  'StaffSchedule',
  'EquipmentSchedule',
  'SpaceSchedule',
  'ResourceBlock',
  'AppointmentSeries',
  'Package',
  'AdministrativeService',
  'VitalSignsTemplate',
  // Add all your tenant-isolated models here
];

/**
 * Models that should NOT have tenant isolation
 * (e.g., lookup tables, system-wide configuration)
 */
const EXCLUDED_MODELS: string[] = [
  // Add models that don't need tenant isolation
  // 'SystemConfiguration',
  // 'GlobalSettings',
];

/**
 * Creates Prisma middleware for automatic tenant isolation
 */
export function createTenantIsolationMiddleware() {
  return async (params: Prisma.MiddlewareParams, next: any) => {
    const model = params.model;

    // Skip if no model (raw queries, etc.)
    if (!model) {
      return next(params);
    }

    // Skip excluded models
    if (EXCLUDED_MODELS.includes(model)) {
      return next(params);
    }

    // Only apply to tenant-isolated models
    if (!TENANT_ISOLATED_MODELS.includes(model)) {
      return next(params);
    }

    // Get tenant from AsyncLocalStorage
    const store = RequestContext.getStore() as RequestContextStore | undefined;
    const tenantId = store?.tenantId;

    // If no tenant context, throw error (except for system operations)
    if (!tenantId) {
      // Allow bypass for system operations with special flag
      if (store && (store as any).bypassTenantCheck) {
        return next(params);
      }

      throw new Error(
        `Tenant context required for ${model}.${params.action}. ` +
        `Please ensure request is executed within tenant context.`
      );
    }

    // Inject tenantId into query based on operation type
    switch (params.action) {
      case 'findUnique':
      case 'findUniqueOrThrow':
      case 'findFirst':
      case 'findFirstOrThrow':
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
        break;

      case 'findMany':
      case 'count':
      case 'aggregate':
      case 'groupBy':
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
        break;

      case 'create':
      case 'createMany':
        if (params.action === 'create') {
          params.args.data = {
            ...params.args.data,
            tenantId,
          };
        } else {
          // createMany
          if (Array.isArray(params.args.data)) {
            params.args.data = params.args.data.map((item: any) => ({
              ...item,
              tenantId,
            }));
          } else {
            params.args.data = {
              ...params.args.data,
              tenantId,
            };
          }
        }
        break;

      case 'update':
      case 'updateMany':
        // Ensure update only affects records in this tenant
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
        // Don't allow changing tenantId
        if (params.args.data?.tenantId && params.args.data.tenantId !== tenantId) {
          throw new Error('Cannot change tenantId of existing record');
        }
        break;

      case 'upsert':
        // Add tenantId to where clause
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
        // Add tenantId to create data
        params.args.create = {
          ...params.args.create,
          tenantId,
        };
        // Ensure update doesn't change tenantId
        if (params.args.update?.tenantId && params.args.update.tenantId !== tenantId) {
          throw new Error('Cannot change tenantId of existing record');
        }
        break;

      case 'delete':
      case 'deleteMany':
        // Ensure delete only affects records in this tenant
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
        break;

      default:
        // For any other operations, log a warning
        console.warn(
          `Tenant isolation not implemented for operation: ${model}.${params.action}`
        );
    }

    return next(params);
  };
}

/**
 * Utility function to bypass tenant check for system operations
 * Use with extreme caution!
 */
export function withoutTenantCheck<T>(fn: () => Promise<T>): Promise<T> {
  return RequestContext.run(
    {
      ...RequestContext.getStore(),
      bypassTenantCheck: true,
    } as any,
    fn
  );
}
