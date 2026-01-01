/**
 * @UserId() Parameter Decorator
 * Extracts user ID from request user
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  const userClaim = process.env.OIDC_USER_CLAIM || 'sub';
  const userId = user?.[userClaim];

  if (!userId) {
    throw new Error('User ID not found in token');
  }

  return userId;
});
