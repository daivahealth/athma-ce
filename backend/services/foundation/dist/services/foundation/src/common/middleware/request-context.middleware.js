"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextMiddleware = void 0;
const common_1 = require("@nestjs/common");
const request_context_1 = require("../context/request-context");
/**
 * Middleware to initialize AsyncLocalStorage context for each request
 * Extracts multi-tenancy headers and stores them in the request context
 */
let RequestContextMiddleware = class RequestContextMiddleware {
    use(req, res, next) {
        const tenantId = req.headers['x-tenant-id'];
        const userId = req.headers['x-user-id'];
        const facilityId = req.headers['x-facility-id'];
        const ip = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        request_context_1.RequestContextService.run({
            ...(tenantId && { tenantId }),
            ...(userId && { userId }),
            ...(facilityId && { facilityId }),
            ...(ip && { ip }),
            ...(userAgent && { userAgent }),
            path: req.path,
            method: req.method,
        }, () => {
            next();
        });
    }
};
exports.RequestContextMiddleware = RequestContextMiddleware;
exports.RequestContextMiddleware = RequestContextMiddleware = __decorate([
    (0, common_1.Injectable)()
], RequestContextMiddleware);
//# sourceMappingURL=request-context.middleware.js.map