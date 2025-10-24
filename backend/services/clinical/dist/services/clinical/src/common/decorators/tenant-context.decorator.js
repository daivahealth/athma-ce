"use strict";
/**
 * Tenant Context Decorators
 *
 * Provides convenient decorators for accessing tenant context in controllers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiresTenant = exports.BypassTenantCheck = exports.Context = exports.FacilityId = exports.UserId = exports.TenantId = void 0;
const common_1 = require("@nestjs/common");
const shared_utils_1 = require("@zeal/shared-utils");
/**
 * Get current tenant ID from request context
 */
exports.TenantId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const tenantId = request.context?.tenantId || request.headers['x-tenant-id'];
    if (!tenantId) {
        throw new Error('Tenant ID not found in request context');
    }
    return tenantId;
});
/**
 * Get current user ID from request context
 */
exports.UserId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.context?.userId || request.user?.id || 'system';
});
/**
 * Get current facility ID from request context
 */
exports.FacilityId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.context?.facilityId || request.headers['x-facility-id'] || 'default-facility';
});
/**
 * Get full request context
 */
exports.Context = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const store = shared_utils_1.RequestContext.getStore();
    return {
        tenantId: request.context?.tenantId || store?.tenantId,
        userId: request.context?.userId || store?.userId || 'system',
        facilityId: request.context?.facilityId || request.headers['x-facility-id'] || 'default-facility',
        userRole: request.user?.role || request.context?.userRole || 'user',
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'] || store?.userAgent,
    };
});
/**
 * Decorator to bypass tenant check for specific routes
 * Use with EXTREME caution - only for system-level operations
 */
const BypassTenantCheck = () => (0, common_1.SetMetadata)('bypassTenantCheck', true);
exports.BypassTenantCheck = BypassTenantCheck;
/**
 * Decorator to mark routes that require tenant context
 * This is the default behavior, but can be used for documentation
 */
const RequiresTenant = () => (0, common_1.SetMetadata)('requiresTenant', true);
exports.RequiresTenant = RequiresTenant;
//# sourceMappingURL=tenant-context.decorator.js.map