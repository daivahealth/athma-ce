/**
 * Tenant Context Middleware
 *
 * Extracts tenant information from request headers and stores in AsyncLocalStorage
 * This enables automatic tenant isolation in database queries
 */

import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { RequestContext } from '@zeal/shared-utils';
import * as jwt from 'jsonwebtoken';

interface VerifiedUser {
  userId?: string;
  facilityId?: string;
  role?: string;
  permissions: string[];
}

/**
 * Verify the bearer token (if any) against JWT_SECRET and return the user it
 * names. ai-gateway has no global JWT guard, so without this the request never
 * carries the user's RBAC permissions and every permission-gated catalog
 * entry (the report builder's metrics and dimensions) is hidden.
 * An invalid or expired token yields no user; it never widens access.
 */
function verifiedUserFromBearer(req: any): VerifiedUser | null {
  const header = req.headers?.authorization;
  if (typeof header !== 'string') return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const payload = jwt.verify(token, secret) as Record<string, unknown>;
    const roles = Array.isArray(payload.roles) ? (payload.roles as string[]) : [];
    return {
      userId: (payload.userId as string) || (payload.sub as string) || undefined,
      facilityId: (payload.facilityId as string) || undefined,
      role: roles[0],
      permissions: Array.isArray(payload.permissions) ? (payload.permissions as string[]) : [],
    };
  } catch {
    return null;
  }
}

export interface TenantRequestContext {
  tenantId: string;
  userId: string;
  facilityId: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  permissions?: string[];
}

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  private readonly uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  use(req: any, res: any, next: any) {
    // Extract tenant ID from header
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      throw new BadRequestException(
        'Tenant ID is required. Please provide x-tenant-id header.',
      );
    }

    // Validate UUID format
    if (!this.uuidRegex.test(tenantId)) {
      throw new BadRequestException(
        'Invalid tenant ID format. Must be a valid UUID.',
      );
    }

    // Extract user information from JWT token or headers
    if (!req.user) {
      const verified = verifiedUserFromBearer(req);
      if (verified) req.user = verified;
    }
    const userId =
      req.user?.id || req.user?.userId || (req.headers['x-user-id'] as string);
    const facilityId =
      req.user?.facilityId || (req.headers['x-facility-id'] as string);
    const userAgent = req.headers['user-agent'] || '';

    // Validate userId is a UUID (required for audit fields)
    if (!userId) {
      throw new BadRequestException(
        'User ID is required. Please authenticate or provide x-user-id header.',
      );
    }
    if (!this.uuidRegex.test(userId)) {
      throw new BadRequestException(
        'Invalid user ID format. Must be a valid UUID.',
      );
    }

    // Validate facilityId is a UUID (required for audit fields)
    if (!facilityId) {
      throw new BadRequestException(
        "Facility ID is required. Please provide x-facility-id header or ensure it's in your JWT token.",
      );
    }
    if (!this.uuidRegex.test(facilityId)) {
      throw new BadRequestException(
        'Invalid facility ID format. Must be a valid UUID.',
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
          permissions: req.user?.permissions || [],
        } as TenantRequestContext;

        next();
      },
    );
  }
}
