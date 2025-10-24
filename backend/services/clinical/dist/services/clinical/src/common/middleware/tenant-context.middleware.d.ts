/**
 * Tenant Context Middleware
 *
 * Extracts tenant information from request headers and stores in AsyncLocalStorage
 * This enables automatic tenant isolation in database queries
 */
import { NestMiddleware } from '@nestjs/common';
export declare class TenantContextMiddleware implements NestMiddleware {
    use(req: any, res: any, next: any): void;
    private generateRequestId;
}
//# sourceMappingURL=tenant-context.middleware.d.ts.map