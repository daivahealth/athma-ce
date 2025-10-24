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

    // Extract user information from JWT token or headers
    // Priority: JWT token (req.user) > headers > error
    const userId = req.user?.id || req.user?.userId || req.headers['x-user-id'] as string;
    const facilityId = req.user?.facilityId || req.headers['x-facility-id'] as string;
    const userAgent = req.headers['user-agent'] || '';

    // Validate userId is a UUID (required for audit fields)
    if (!userId) {
      throw new BadRequestException(
        'User ID is required. Please authenticate or provide x-user-id header.'
      );
    }
    if (!uuidRegex.test(userId)) {
      throw new BadRequestException(
        'Invalid user ID format. Must be a valid UUID.'
      );
    }

    // Validate facilityId is a UUID (required for audit fields)
    if (!facilityId) {
      throw new BadRequestException(
        'Facility ID is required. Please provide x-facility-id header or ensure it\'s in your JWT token.'
      );
    }
    if (!uuidRegex.test(facilityId)) {
      throw new BadRequestException(
        'Invalid facility ID format. Must be a valid UUID.'
      );
    }

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
