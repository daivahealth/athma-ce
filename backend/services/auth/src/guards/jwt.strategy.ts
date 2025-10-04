import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../services/user.service';
import { JwtPayload, JwtClaims } from '@zeal/contracts';
import { RequestContext } from '@zeal/shared-utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtClaims> {
    try {
      // Verify user still exists and is active
      const user = await this.userService.getUserById(payload.sub);
      if (!user || user.status !== 'active') {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Set tenant context if available
      if (payload.tenantId) {
        RequestContext.set({
          tenantId: payload.tenantId,
          userId: payload.sub,
        });
      }

      // Return user claims
      return {
        userId: payload.sub,
        email: payload.email,
        tenantId: payload.tenantId,
        roles: payload.roles,
        permissions: payload.permissions,
        sessionId: payload.jti,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}




