/**
 * Tenant Context Decorators
 *
 * Provides convenient decorators for accessing tenant context in controllers
 */
/**
 * Get current tenant ID from request context
 */
export declare const TenantId: (...dataOrPipes: unknown[]) => ParameterDecorator;
/**
 * Get current user ID from request context
 */
export declare const UserId: (...dataOrPipes: unknown[]) => ParameterDecorator;
/**
 * Get current facility ID from request context
 */
export declare const FacilityId: (...dataOrPipes: unknown[]) => ParameterDecorator;
/**
 * Get full request context
 */
export declare const Context: (...dataOrPipes: unknown[]) => ParameterDecorator;
/**
 * Decorator to bypass tenant check for specific routes
 * Use with EXTREME caution - only for system-level operations
 */
export declare const BypassTenantCheck: () => import("@nestjs/common").CustomDecorator<string>;
/**
 * Decorator to mark routes that require tenant context
 * This is the default behavior, but can be used for documentation
 */
export declare const RequiresTenant: () => import("@nestjs/common").CustomDecorator<string>;
//# sourceMappingURL=tenant-context.decorator.d.ts.map