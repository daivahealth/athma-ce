/**
 * Shared JWT Auth Guard
 *
 * A stateless JWT verification guard that can be used across all services.
 * Validates JWT tokens without requiring a database call to Foundation.
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

export const IS_PUBLIC_KEY = 'isPublic';

export interface JwtPayload {
  sub: string;
  userId?: string;
  email: string;
  tenantId?: string;
  roles: string[];
  permissions: string[];
  facilityId?: string;
  facilityIds?: string[];
  iat: number;
  exp: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private readonly jwtSecret: string;

  constructor(private readonly reflector: Reflector) {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  canActivate(context: ExecutionContext): boolean {
    // Check if endpoint is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('Missing bearer token');
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const payload = jwt.verify(token, this.jwtSecret) as JwtPayload;

      // Attach user info to request
      request.user = {
        userId: payload.userId || payload.sub,
        email: payload.email,
        tenantId: payload.tenantId,
        roles: payload.roles || [],
        permissions: payload.permissions || [],
        facilityId: payload.facilityId,
        facilityIds: payload.facilityIds || [],
      };

      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        this.logger.warn('Token expired');
        throw new UnauthorizedException('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        this.logger.warn(`Invalid token: ${error.message}`);
        throw new UnauthorizedException('Invalid token');
      }
      this.logger.error(`JWT verification failed: ${error}`);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authorization = request.headers?.authorization || request.headers?.Authorization;
    if (!authorization) {
      return null;
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      return null;
    }

    return token;
  }
}
