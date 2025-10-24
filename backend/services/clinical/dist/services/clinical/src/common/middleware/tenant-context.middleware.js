"use strict";
/**
 * Tenant Context Middleware
 *
 * Extracts tenant information from request headers and stores in AsyncLocalStorage
 * This enables automatic tenant isolation in database queries
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantContextMiddleware = void 0;
const common_1 = require("@nestjs/common");
const shared_utils_1 = require("@zeal/shared-utils");
let TenantContextMiddleware = class TenantContextMiddleware {
    use(req, res, next) {
        // Extract tenant ID from header
        const tenantId = req.headers['x-tenant-id'];
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required. Please provide x-tenant-id header.');
        }
        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(tenantId)) {
            throw new common_1.BadRequestException('Invalid tenant ID format. Must be a valid UUID.');
        }
        // Extract user information (if available from auth)
        const userId = req.user?.id || req.headers['x-user-id'] || 'system';
        const facilityId = req.headers['x-facility-id'] || 'default-facility';
        const userAgent = req.headers['user-agent'] || '';
        // Store in AsyncLocalStorage for automatic access in services
        shared_utils_1.RequestContext.run({
            tenantId,
            userId,
            userAgent,
        }, () => {
            // Attach to request object for easy access in controllers
            req.context = {
                tenantId,
                userId,
                facilityId,
                userRole: req.user?.role || 'user',
                ipAddress: req.ip,
                userAgent,
            };
            next();
        });
    }
    generateRequestId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
};
exports.TenantContextMiddleware = TenantContextMiddleware;
exports.TenantContextMiddleware = TenantContextMiddleware = __decorate([
    (0, common_1.Injectable)()
], TenantContextMiddleware);
//# sourceMappingURL=tenant-context.middleware.js.map