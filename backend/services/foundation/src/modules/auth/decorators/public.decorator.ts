import { SetMetadata } from '@nestjs/common';

/**
 * Public Decorator
 *
 * Use this decorator to mark endpoints that should bypass JWT authentication.
 * When applied to a controller method or class, JwtAuthGuard will skip
 * token verification and allow unauthenticated access.
 *
 * @example
 * // Mark a single endpoint as public
 * @Public()
 * @Get('health')
 * healthCheck() { return { status: 'ok' }; }
 *
 * @example
 * // Mark all endpoints in a controller as public
 * @Public()
 * @Controller('public')
 * export class PublicController { }
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
