import { type NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
export declare class RequestContextMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction): void;
}
export declare const requestContextHeaders: {
    readonly tenantId: "x-tenant-id";
    readonly userId: "x-user-id";
};
//# sourceMappingURL=request-context.middleware.d.ts.map