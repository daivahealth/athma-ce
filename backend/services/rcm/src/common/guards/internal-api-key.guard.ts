import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * Guard for internal service-to-service endpoints (clinical → RCM charge
 * posting). Validates X-Internal-Api-Key against INTERNAL_API_KEY — the same
 * shared-key convention clinical, foundation, and the connector use.
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
