/**
 * Tenant Context Decorators
 *
 * Provides convenient decorators for accessing tenant context in controllers
 */

import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { RequestContext } from '@zeal/shared-utils';

/**
 * Get current tenant ID from request context
 */
export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const tenantId = request.context?.tenantId || request.headers['x-tenant-id'];

    if (!tenantId) {
      throw new Error('Tenant ID not found in request context');
    }

    return tenantId;
  },
);

/**
 * Get current user ID from request context
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.context?.userId || request.user?.id || 'system';
  },
);

/**
 * Get current facility ID from request context
 */
export const FacilityId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.context?.facilityId || request.headers['x-facility-id'] || 'default-facility';
  },
);

/**
 * Get full request context
 */
export const Context = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const store = RequestContext.getStore();

    return {
      tenantId: request.context?.tenantId || store?.tenantId,
      userId: request.context?.userId || store?.userId || 'system',
      facilityId: request.context?.facilityId || request.headers['x-facility-id'] || 'default-facility',
      userRole: request.user?.role || request.context?.userRole || 'user',
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'] || store?.userAgent,
    };
  },
);

/**
 * Decorator to bypass tenant check for specific routes
 * Use with EXTREME caution - only for system-level operations
 */
export const BypassTenantCheck = () => SetMetadata('bypassTenantCheck', true);

/**
 * Decorator to mark routes that require tenant context
 * This is the default behavior, but can be used for documentation
 */
export const RequiresTenant = () => SetMetadata('requiresTenant', true);
