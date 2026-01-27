/**
 * Shared Permissions Guard
 *
 * Checks if the authenticated user has the required permissions.
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

export const PERMISSIONS_KEY = 'permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('PermissionsGuard: No user found in request. Ensure JwtAuthGuard runs first.');
      throw new ForbiddenException('User not authenticated');
    }

    const userPermissions: string[] = user.permissions || [];

    // Check if user has ALL required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      const missing = requiredPermissions.filter(
        (p) => !userPermissions.includes(p)
      );
      this.logger.warn(
        `Access denied for user ${user.userId}. Missing permissions: ${missing.join(', ')}`
      );
      throw new ForbiddenException(
        `Access denied. Missing required permissions: ${missing.join(', ')}`
      );
    }

    return true;
  }
}
