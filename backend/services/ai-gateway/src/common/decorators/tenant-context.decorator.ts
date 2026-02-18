import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantRequestContext } from '../middleware/tenant-context.middleware';

/**
 * Decorator to extract full tenant context from request
 */
export const Context = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TenantRequestContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.context;
  },
);

/**
 * Decorator to extract just the tenant ID from request
 */
export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.context?.tenantId;
  },
);

/**
 * Decorator to extract just the user ID from request
 */
export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.context?.userId;
  },
);

/**
 * Decorator to extract facility ID from request
 */
export const FacilityId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.context?.facilityId;
  },
);
