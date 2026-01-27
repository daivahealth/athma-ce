/**
 * Shared Auth Decorators
 *
 * Decorators for role and permission-based access control.
 */

import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from './permissions.guard';
import { ROLES_KEY } from './roles.guard';
import { IS_PUBLIC_KEY } from './jwt-auth.guard';

/**
 * Decorator to specify required permissions for an endpoint.
 * User must have ALL specified permissions to access.
 *
 * @example
 * @Permissions('patient.read', 'patient.update')
 * @Get(':id')
 * getPatient() { }
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Decorator to specify required roles for an endpoint.
 * User must have at least ONE of the specified roles to access.
 *
 * @example
 * @Roles('physician', 'nurse')
 * @Get('clinical-data')
 * getClinicalData() { }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Decorator to mark an endpoint as public (no authentication required).
 *
 * @example
 * @Public()
 * @Get('health')
 * healthCheck() { }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
