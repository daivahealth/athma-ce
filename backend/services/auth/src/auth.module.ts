import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { MfaService } from './services/mfa.service';
import { UserRepository } from './repositories/user.repository';
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

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
    MfaService,
    
    // Repositories
    UserRepository,
    
    // Strategies
    JwtStrategy,
    
    // Guards
    JwtAuthGuard,
    PermissionsGuard,
  ],
  exports: [
    AuthService,
    UserService,
    MfaService,
    JwtAuthGuard,
    PermissionsGuard,
  ],
})
export class AuthModule {}




