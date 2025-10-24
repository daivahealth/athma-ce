/**
 * Tenant Context Middleware
 *
 * Extracts tenant information from request headers and stores in AsyncLocalStorage
 * This enables automatic tenant isolation in database queries
 */

import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { RequestContext } from '@zeal/shared-utils';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(req: any, res: any, next: any) {
    // Extract tenant ID from header
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      throw new BadRequestException(
        'Tenant ID is required. Please provide x-tenant-id header.'
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tenantId)) {
      throw new BadRequestException(
        'Invalid tenant ID format. Must be a valid UUID.'
      );
    }

    // Extract user information (if available from auth)
    const userId = req.user?.id || req.headers['x-user-id'] as string || 'system';
    const facilityId = req.headers['x-facility-id'] as string || 'default-facility';
    const userAgent = req.headers['user-agent'] || '';

    // Store in AsyncLocalStorage for automatic access in services
    RequestContext.run(
      {
        tenantId,
        userId,
        userAgent,
      },
      () => {
        // Attach to request object for easy access in controllers
        req.context = {
          tenantId,
          userId,
          facilityId,
          userRole: req.user?.role || 'user',
          ipAddress: req.ip,
          userAgent,
        };

        next();
      }
    );
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
