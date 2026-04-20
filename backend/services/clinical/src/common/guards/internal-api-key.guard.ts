import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * Guard for internal service-to-service endpoints.
 * Validates the X-Internal-Api-Key header against the INTERNAL_API_KEY env var.
 * Used by the pharmacy queue scheduler (RCM side) to call clinical without a user JWT.
 */
@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const providedKey = request.headers['x-internal-api-key'];
    const expectedKey = process.env.INTERNAL_API_KEY;

    if (!expectedKey) {
      throw new UnauthorizedException('Internal API key not configured on server');
    }

    if (!providedKey || providedKey !== expectedKey) {
      throw new UnauthorizedException('Invalid or missing internal API key');
    }

    return true;
  }
}
