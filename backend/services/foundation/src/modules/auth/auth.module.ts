import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { MfaService } from './services/mfa.service';
import { UserRepository } from './repositories/user.repository';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { DEFAULT_ACCESS_TOKEN_EXPIRY, resolveExpiresIn } from './utils/jwt-expiry.util';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: resolveExpiresIn(process.env.JWT_EXPIRY, DEFAULT_ACCESS_TOKEN_EXPIRY),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Service-wide auth (issue #134): every foundation route requires a valid
    // JWT unless @Public; @Permissions is enforced where declared. Declared
    // here so the guards resolve inside AuthModule's DI context (JwtModule).
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    AuthService,
    UserService,
    MfaService,
    UserRepository,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
  ],
  exports: [
    AuthService,
    UserService,
    MfaService,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    JwtModule,
  ],
})
export class AuthModule {}
