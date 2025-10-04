import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { MfaService } from './services/mfa.service';
import { UserRepository } from './repositories/user.repository';
import { RoleRepository } from './repositories/role.repository';
import { PermissionRepository } from './repositories/permission.repository';
import { MfaRepository } from './repositories/mfa.repository';
import { JwtStrategy } from './guards/jwt.strategy';
import { LocalStrategy } from './guards/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { MfaGuard } from './guards/mfa.guard';
import { TenantMiddleware } from './middleware/tenant.middleware';
import { AuditMiddleware } from './middleware/audit.middleware';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRY || '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Services
    AuthService,
    UserService,
    RoleService,
    PermissionService,
    MfaService,
    
    // Repositories
    UserRepository,
    RoleRepository,
    PermissionRepository,
    MfaRepository,
    
    // Strategies
    JwtStrategy,
    LocalStrategy,
    
    // Guards
    JwtAuthGuard,
    LocalAuthGuard,
    RolesGuard,
    PermissionsGuard,
    MfaGuard,
    
    // Middleware
    TenantMiddleware,
    AuditMiddleware,
  ],
  exports: [
    AuthService,
    UserService,
    RoleService,
    PermissionService,
    MfaService,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    MfaGuard,
  ],
})
export class AuthModule {}





