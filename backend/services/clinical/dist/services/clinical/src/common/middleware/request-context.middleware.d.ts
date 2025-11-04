import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to initialize AsyncLocalStorage context for each request
 * Extracts multi-tenancy headers and stores them in the request context
 */
export declare class RequestContextMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
//# sourceMappingURL=request-context.middleware.d.ts.map