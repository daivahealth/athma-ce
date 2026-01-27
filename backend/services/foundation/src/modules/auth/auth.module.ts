import { Module } from '@nestjs/common';
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
