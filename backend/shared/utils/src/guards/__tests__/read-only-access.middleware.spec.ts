import { describe, expect, it, jest } from '@jest/globals';
import * as jwt from 'jsonwebtoken';
import {
  readOnlyAccessMiddleware,
  isReadOnlyRoleSet,
  READ_ONLY_ERROR_CODE,
  AUTH_REQUIRED_ERROR_CODE,
  type WriteAccessOptions,
} from '../read-only-access.middleware';

const SECRET = 'test-secret-for-read-only-spec';

function token(payload: Record<string, unknown>) {
  return jwt.sign(payload, SECRET, { expiresIn: '5m' });
}

function run(
  method: string,
  url: string,
  authorization?: string,
  options: WriteAccessOptions = { requireTokenForWrites: false },
  extraHeaders: Record<string, string> = {},
) {
  const headers: Record<string, string> = { ...extraHeaders };
  if (authorization) headers.authorization = authorization;
  const req = { method, originalUrl: url, url, headers };
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      this.body = body;
      return this;
    },
  };
  const next = jest.fn();
  readOnlyAccessMiddleware(options)(req as never, res as never, next);
  return { res, next };
}

const readOnly = `Bearer ${token({ sub: 'u1', roles: ['demo_visitor'], readOnly: true })}`;
const normal = `Bearer ${token({ sub: 'u2', roles: ['physician'] })}`;

describe('readOnlyAccessMiddleware', () => {
  it('lets a read-only token read', () => {
    for (const method of ['GET', 'HEAD', 'OPTIONS']) {
      expect(run(method, '/api/v1/patients', readOnly).next).toHaveBeenCalled();
    }
  });

  it('refuses writes from a read-only token with READ_ONLY_ACCESS', () => {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      const { res, next } = run(method, '/api/v1/patients/abc', readOnly);
      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(403);
      expect(res.body).toMatchObject({ code: READ_ONLY_ERROR_CODE });
    }
  });

  it('allows session endpoints and read-shaped POSTs for a read-only token', () => {
    for (const url of [
      '/api/v1/auth/refresh',
      '/api/v1/auth/logout',
      '/api/v1/auth/switch-facility',
      '/api/v1/scheduling/availability/check-slot',
      '/api/v1/patients/123/consents/check/action',
      '/api/v1/ot/schedules/conflicts/check?x=1',
      '/api/v1/access-requests',
    ]) {
      expect(run('POST', url, readOnly).next).toHaveBeenCalled();
    }
  });

  it('does not let an allowlisted suffix hide inside a longer path', () => {
    expect(run('POST', '/api/v1/auth/refresh/extra', readOnly).res.statusCode).toBe(403);
    expect(run('POST', '/api/v1/patients', readOnly).res.statusCode).toBe(403);
  });

  it('leaves normal and anonymous requests to the regular auth layer', () => {
    expect(run('POST', '/api/v1/patients', normal).next).toHaveBeenCalled();
    expect(run('POST', '/api/v1/patients').next).toHaveBeenCalled();
    expect(run('POST', '/api/v1/patients', 'Bearer not-a-jwt').next).toHaveBeenCalled();
  });

  it('only treats readOnly === true as read-only', () => {
    const truthy = `Bearer ${token({ sub: 'u3', readOnly: 'true' })}`;
    expect(run('DELETE', '/api/v1/patients/1', truthy).next).toHaveBeenCalled();
  });
});

describe('readOnlyAccessMiddleware with requireTokenForWrites', () => {
  const strict: WriteAccessOptions = {
    requireTokenForWrites: true,
    jwtSecret: SECRET,
    internalApiKey: 'internal-key',
  };

  it('refuses an anonymous write with AUTH_REQUIRED', () => {
    const { res, next } = run('POST', '/api/v1/clinical-codings', undefined, strict, {
      'x-tenant-id': '11111111-1111-1111-1111-111111111111',
      'x-user-id': 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
    expect(res.body).toMatchObject({ code: AUTH_REQUIRED_ERROR_CODE });
  });

  it('refuses a token that does not verify', () => {
    const forged = `Bearer ${jwt.sign({ sub: 'x' }, 'other-secret')}`;
    expect(run('POST', '/api/v1/patients', forged, strict).res.statusCode).toBe(401);
  });

  it('allows anonymous reads and public auth writes', () => {
    expect(run('GET', '/api/v1/patients', undefined, strict).next).toHaveBeenCalled();
    expect(run('POST', '/api/v1/access-requests', undefined, strict).next).toHaveBeenCalled();
    expect(run('PATCH', '/api/v1/access-requests/abc', undefined, strict).res.statusCode).toBe(401);
    expect(run('POST', '/api/v1/auth/login', undefined, strict).next).toHaveBeenCalled();
    expect(run('POST', '/api/v1/auth/reset-password', undefined, strict).next).toHaveBeenCalled();
  });

  it('allows service calls with the internal key, refuses a wrong key', () => {
    expect(
      run('POST', '/api/v1/charge-posting-rules/process-event', undefined, strict, {
        'x-internal-api-key': 'internal-key',
      }).next,
    ).toHaveBeenCalled();
    expect(
      run('POST', '/api/v1/charge-posting-rules/process-event', undefined, strict, {
        'x-internal-api-key': 'guess',
      }).res.statusCode,
    ).toBe(401);
  });

  it('lets a verified normal token write and still blocks a read-only one', () => {
    expect(run('POST', '/api/v1/patients', normal, strict).next).toHaveBeenCalled();
    expect(run('POST', '/api/v1/patients', readOnly, strict).res.statusCode).toBe(403);
  });

  it('will not start without a JWT secret', () => {
    expect(() => readOnlyAccessMiddleware({ requireTokenForWrites: true, jwtSecret: '' })).toThrow();
  });
});

describe('isReadOnlyRoleSet', () => {
  it('detects the demo visitor role', () => {
    expect(isReadOnlyRoleSet(['demo_visitor'])).toBe(true);
    expect(isReadOnlyRoleSet(['physician', 'demo_visitor'])).toBe(true);
    expect(isReadOnlyRoleSet(['physician'])).toBe(false);
    expect(isReadOnlyRoleSet(undefined)).toBe(false);
  });
});
