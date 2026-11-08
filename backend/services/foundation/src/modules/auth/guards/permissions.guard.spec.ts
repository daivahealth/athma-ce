import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';
import { ALLOW_SELF_KEY } from '../decorators/permissions.decorator';

function guardFor(metadata: Record<string, unknown>) {
  const reflector = { getAllAndOverride: (key: string) => metadata[key] } as unknown as Reflector;
  return new PermissionsGuard(reflector);
}

function context(user: Record<string, unknown>, params: Record<string, string> = {}) {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => ({ user, params }) }),
  } as unknown as ExecutionContext;
}

describe('PermissionsGuard @AllowSelf', () => {
  const metadata = { permissions: ['user.read'], [ALLOW_SELF_KEY]: 'id' };

  it('lets a user read their own record without user.read', () => {
    const guard = guardFor(metadata);
    expect(guard.canActivate(context({ userId: 'u1', permissions: [] }, { id: 'u1' }))).toBe(true);
  });

  it('still requires user.read for someone else', () => {
    const guard = guardFor(metadata);
    expect(() => guard.canActivate(context({ userId: 'u1', permissions: [] }, { id: 'u2' }))).toThrow(
      ForbiddenException,
    );
  });

  it('does nothing on routes without @AllowSelf', () => {
    const guard = guardFor({ permissions: ['user.read'] });
    expect(() => guard.canActivate(context({ userId: 'u1', permissions: [] }, { id: 'u1' }))).toThrow(
      ForbiddenException,
    );
  });
});
