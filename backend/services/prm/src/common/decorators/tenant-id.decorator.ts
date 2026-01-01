/**
 * @TenantId() Parameter Decorator
 * Extracts tenant ID from request user
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  // Create tenant service instance to extract tenant ID
  // Note: This is a simplified version. In production, inject TenantService in controller
  const tenantClaim = process.env.OIDC_TENANT_CLAIM || 'tid';
  const tenantId = user?.[tenantClaim];

  if (!tenantId) {
    throw new Error('Tenant ID not found in token');
  }

  return tenantId;
});
