/**
 * Shared Roles Guard
 *
 * Checks if the authenticated user has one of the required roles.
 * Requires JwtAuthGuard to run first to populate request.user.
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('RolesGuard: No user found in request. Ensure JwtAuthGuard runs first.');
      throw new ForbiddenException('User not authenticated');
    }

    const userRoles: string[] = user.roles || [];

    // Check if user has ANY of the required roles (OR logic)
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasRequiredRole) {
      this.logger.warn(
        `Access denied for user ${user.userId}. Required roles: ${requiredRoles.join(' or ')}. User roles: ${userRoles.join(', ')}`
      );
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(' or ')}`
      );
    }

    return true;
  }
}
