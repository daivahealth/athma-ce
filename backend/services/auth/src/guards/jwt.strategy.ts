import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../services/user.service';
import { JwtPayload, JwtClaims } from '@zeal/contracts';
import { RequestContext } from '@zeal/shared-utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtClaims> {
    if (!payload.tenantId) {
      throw new UnauthorizedException('Token missing tenant context');
    }

    const tenantId = payload.tenantId as string;

    try {
      return await RequestContext.run(
        {
          tenantId,
          userId: payload.sub,
          userAgent: 'auth-service',
        },
        async () => {
          const user = await this.userService.getUserById(payload.sub);
          if (!user || user.status !== 'active') {
            throw new UnauthorizedException('User not found or inactive');
          }

          return {
            userId: payload.sub,
            email: payload.email,
            tenantId,
            roles: payload.roles,
            permissions: payload.permissions,
            sessionId: payload.jti,
          } satisfies JwtClaims;
        },
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}


