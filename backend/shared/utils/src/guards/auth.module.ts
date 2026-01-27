/**
 * Shared Auth Module
 *
 * Provides JWT authentication guards and permission/role guards
 * that can be imported by any service.
 */

import { Module, Global } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PermissionsGuard } from './permissions.guard';
import { RolesGuard } from './roles.guard';

@Global()
@Module({
  providers: [JwtAuthGuard, PermissionsGuard, RolesGuard],
  exports: [JwtAuthGuard, PermissionsGuard, RolesGuard],
})
export class SharedAuthModule {}
