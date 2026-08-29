import { describe, expect, it, beforeAll } from '@jest/globals';
import { UnauthorizedException, ForbiddenException, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { PermissionsGuard } from '../permissions.guard';

const SECRET = 'test-secret-for-guard-spec';

function contextFor(request: Record<string, unknown>, metadata: Record<string, unknown> = {}) {
  const reflector = {
    getAllAndOverride: (key: string) => metadata[key],
  } as unknown as Reflector;
  const context = {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { reflector, context, request };
}

function sign(payload: Record<string, unknown>, options: jwt.SignOptions = { expiresIn: '5m' }) {
  return jwt.sign(payload, SECRET, options);
}

describe('JwtAuthGuard (issue #65: auth is a named highest-risk surface)', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = SECRET;
  });

  it('lets @Public routes through without a token', () => {
    const { reflector, context } = contextFor({ headers: {} }, { isPublic: true });
    expect(new JwtAuthGuard(reflector).canActivate(context)).toBe(true);
  });

  it('rejects a missing bearer token', () => {
    const { reflector, context } = contextFor({ headers: {} });
    expect(() => new JwtAuthGuard(reflector).canActivate(context)).toThrow(UnauthorizedException);
  });

  it('accepts a valid token and attaches the user with tenant context', () => {
    const token = sign({
      sub: 'u1',
      userId: 'u1',
      email: 'a@b.c',
      tenantId: 't1',
      roles: ['staff'],
      permissions: ['patient.read'],
    });
    const { reflector, context, request } = contextFor({
      headers: { authorization: `Bearer ${token}` },
    });
    expect(new JwtAuthGuard(reflector).canActivate(context)).toBe(true);
    const user = (request as { user?: { tenantId?: string; permissions?: string[] } }).user;
    expect(user?.tenantId).toBe('t1');
    expect(user?.permissions).toContain('patient.read');
  });

  it('rejects an expired token', () => {
    const token = sign({ sub: 'u1', userId: 'u1' }, { expiresIn: '-1s' });
    const { reflector, context } = contextFor({ headers: { authorization: `Bearer ${token}` } });
    expect(() => new JwtAuthGuard(reflector).canActivate(context)).toThrow(UnauthorizedException);
  });

  it('rejects a token signed with a different secret', () => {
    const forged = jwt.sign({ sub: 'u1', userId: 'u1' }, 'wrong-secret', { expiresIn: '5m' });
    const { reflector, context } = contextFor({ headers: { authorization: `Bearer ${forged}` } });
    expect(() => new JwtAuthGuard(reflector).canActivate(context)).toThrow(UnauthorizedException);
  });

  it('rejects a tampered payload', () => {
    const token = sign({ sub: 'u1', userId: 'u1', tenantId: 't1' });
    const [h, , s] = token.split('.');
    const tampered = `${h}.${Buffer.from(JSON.stringify({ sub: 'u1', tenantId: 'OTHER' })).toString('base64url')}.${s}`;
    const { reflector, context } = contextFor({ headers: { authorization: `Bearer ${tampered}` } });
    expect(() => new JwtAuthGuard(reflector).canActivate(context)).toThrow(UnauthorizedException);
  });
});

describe('PermissionsGuard', () => {
  it('passes when no @Permissions metadata is declared', () => {
    const { reflector, context } = contextFor({ user: { permissions: [] } });
    expect(new PermissionsGuard(reflector).canActivate(context)).toBe(true);
  });

  it('rejects a user missing a required permission', () => {
    const { reflector, context } = contextFor(
      { user: { permissions: ['patient.read'] } },
      { permissions: ['tenant.read'] },
    );
    expect(() => new PermissionsGuard(reflector).canActivate(context)).toThrow(ForbiddenException);
  });

  it('passes a user holding every required permission', () => {
    const { reflector, context } = contextFor(
      { user: { permissions: ['tenant.read', 'tenant.update'] } },
      { permissions: ['tenant.read'] },
    );
    expect(new PermissionsGuard(reflector).canActivate(context)).toBe(true);
  });
});
