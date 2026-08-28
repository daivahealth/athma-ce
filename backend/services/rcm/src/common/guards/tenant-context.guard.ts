import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@zeal/shared-utils';

/**
 * Makes RCM's header-derived tenant/user context trustworthy (issue #73).
 *
 * RCM controllers read `x-tenant-id` / `x-user-id` directly. Rather than
 * rewriting 30 controllers, this global guard (running AFTER JwtAuthGuard)
 * binds those headers to the authenticated JWT:
 *
 *  - `x-user-id` is always overwritten with the JWT's userId — never trusted.
 *  - `x-tenant-id` absent → injected from the JWT.
 *  - `x-tenant-id` mismatching the JWT tenant → 403, unless the caller is a
 *    super_admin (instance operators may act across tenants).
 *
 * Public routes (health, internal-key endpoints) are skipped — their own
 * guards apply.
 */
@Injectable()
export class TenantContextGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user as
            | { userId?: string; tenantId?: string; roles?: string[] }
            | undefined;
        if (!user) return true; // JwtAuthGuard already rejected unauthenticated requests

        if (user.userId) {
            request.headers['x-user-id'] = user.userId;
        }

        const headerTenant = request.headers['x-tenant-id'];
        if (!user.tenantId) return true;

        if (!headerTenant) {
            request.headers['x-tenant-id'] = user.tenantId;
            return true;
        }
        if (headerTenant === user.tenantId) return true;
        if ((user.roles ?? []).includes('super_admin')) return true;

        throw new ForbiddenException('x-tenant-id does not match the authenticated tenant');
    }
}
