import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { JwtClaims } from '@zeal/contracts';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: JwtClaims; headers: Record<string, string> }>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      const authHeader = request.headers?.authorization ?? request.headers?.Authorization;
      this.logger.warn(`Missing bearer token. Authorization header present=${Boolean(authHeader)} valueSample=${authHeader ? authHeader.split(' ')[0] : 'none'}`);
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const claims = await this.jwtService.verifyAsync<JwtClaims>(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });
      request.user = claims;
      return true;
    } catch (error) {
      this.logger.warn(`Invalid token: ${error instanceof Error ? error.message : 'unknown error'}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: { headers: Record<string, string> }): string | null {
    const authorization = request.headers?.authorization ?? request.headers?.Authorization;
    if (!authorization) {
      return null;
    }
    const [scheme, value] = authorization.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !value) {
      this.logger.warn(`Authorization format invalid. scheme=${scheme ?? 'none'} hasToken=${Boolean(value)}`);
      return null;
    }
    return value;
  }
}
