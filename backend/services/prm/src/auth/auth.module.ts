/**
 * Auth Module
 * Provides OIDC authentication
 */

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OidcStrategy } from './strategies/oidc.strategy';
import { OidcAuthGuard } from './guards/oidc-auth.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'oidc' })],
  providers: [OidcStrategy, OidcAuthGuard],
  exports: [OidcAuthGuard],
})
export class AuthModule {}
