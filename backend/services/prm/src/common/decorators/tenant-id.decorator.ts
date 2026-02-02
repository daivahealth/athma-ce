/**
 * @TenantId() Parameter Decorator
 * Extracts tenant ID from request user
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  const tenantClaim = process.env.OIDC_TENANT_CLAIM || 'tid';
  const tenantId = user?.tenantId || user?.[tenantClaim];

  if (!tenantId) {
    throw new Error('Tenant ID not found in token');
  }

  return tenantId;
});
