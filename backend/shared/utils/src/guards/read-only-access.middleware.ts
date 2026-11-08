/**
 * Write-access enforcement, mounted in every service ahead of routing.
 *
 * 1. Read-only tokens. Foundation marks an access token `readOnly: true` when
 *    the user holds a read-only role (see READ_ONLY_ROLE_CODES). Such a token
 *    can never change data, however a controller or guard is configured:
 *    anything other than GET/HEAD/OPTIONS is refused with 403
 *    (code READ_ONLY_ACCESS) unless the path is on READ_ONLY_ALLOWED_PATHS.
 *
 * 2. Authenticated writes (opt-in, AUTH_REQUIRE_TOKEN_FOR_WRITES=true). Some
 *    controllers trust the x-tenant-id / x-user-id headers without a JWT guard.
 *    With this switch on, an unsafe request must carry a bearer token that
 *    verifies against JWT_SECRET, or a valid x-internal-api-key, or hit one of
 *    PUBLIC_WRITE_PATHS; otherwise it is refused with 401 (code AUTH_REQUIRED).
 *    This stops a read-only user from dropping the token to get around (1).
 *    The public demo turns it on; see docs/security/20-RBAC-Access-Control.md.
 *
 * Without the switch the token is only decoded, never trusted: (1) can only
 * narrow access, and a forged or invalid token is still rejected by the normal
 * auth layer.
 */

import { timingSafeEqual } from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

/** Role codes whose holders get a read-only access token. */
export const READ_ONLY_ROLE_CODES: readonly string[] = ['demo_visitor'];

/** Error codes returned in the response body, so clients can tailor the message. */
export const READ_ONLY_ERROR_CODE = 'READ_ONLY_ACCESS';
export const AUTH_REQUIRED_ERROR_CODE = 'AUTH_REQUIRED';

const READ_ONLY_MESSAGE =
  'This account has read-only access to the demo hospital. Create your own sandbox to try changes.';

export function isReadOnlyRoleSet(roles: readonly string[] | undefined | null): boolean {
  return !!roles?.some((role) => READ_ONLY_ROLE_CODES.includes(role));
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Unsafe-method paths a read-only user may still call. Matched against the
 * request path (no query string, no trailing slash).
 * Keep this list to session handling and endpoints that only compute or check.
 */
export const READ_ONLY_ALLOWED_PATHS: readonly RegExp[] = [
  // Session handling (foundation)
  /\/auth\/(login|logout|refresh|switch-facility|mfa\/verify)$/,
  // Read-shaped POST endpoints (no writes)
  /\/scheduling\/availability\/(check-slot|suggest-alternatives)$/,
  /\/ot\/schedules\/conflicts\/check$/,
  /\/beds\/validate-availability$/,
  /\/patients\/[^/]+\/consents\/check\/action$/,
  /\/payer-contracts\/calculate-price$/,
  /\/fee-schedules\/lookup-price$/,
  /\/reports\/validate$/,
  // Public production access request form (landing page), also used by demo visitors
  /\/access-requests$/,
];

/** Unsafe-method paths that are legitimately called without a token. */
export const PUBLIC_WRITE_PATHS: readonly RegExp[] = [
  /\/auth\/(login|refresh|reset-password|confirm-reset-password|mfa\/verify)$/,
  /\/auth\/oauth\/exchange$/,
  /\/access-requests$/,
];

export interface WriteAccessOptions {
  /** Refuse unsafe requests that carry neither a valid token nor the internal key. Defaults to AUTH_REQUIRE_TOKEN_FOR_WRITES === 'true'. */
  requireTokenForWrites?: boolean;
  /** Defaults to JWT_SECRET. */
  jwtSecret?: string;
  /** Defaults to INTERNAL_API_KEY. */
  internalApiKey?: string;
}

function headerValue(req: Request, name: string): string | null {
  const value = req.headers?.[name];
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function bearerToken(req: Request): string | null {
  const header = headerValue(req, 'authorization');
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  return scheme?.toLowerCase() === 'bearer' && token ? token : null;
}

function requestPath(req: Request): string {
  const raw = req.originalUrl || req.url || '';
  const path = raw.split('?')[0] ?? '';
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function readOnlyClaim(payload: unknown): boolean {
  return !!payload && typeof payload === 'object' && (payload as { readOnly?: unknown }).readOnly === true;
}

export function isReadOnlyToken(token: string | null): boolean {
  return !!token && readOnlyClaim(jwt.decode(token));
}

export function isReadOnlyAllowedRequest(method: string, path: string): boolean {
  if (SAFE_METHODS.has(method.toUpperCase())) return true;
  return READ_ONLY_ALLOWED_PATHS.some((pattern) => pattern.test(path));
}

function refuse(res: Response, status: 401 | 403, code: string, message: string): void {
  res.status(status).json({
    statusCode: status,
    error: status === 401 ? 'Unauthorized' : 'Forbidden',
    code,
    message,
  });
}

/**
 * Express middleware. Mount with `app.use(readOnlyAccessMiddleware())` after
 * `enableCors()`, so a refused request still carries CORS headers.
 */
export function readOnlyAccessMiddleware(options: WriteAccessOptions = {}) {
  const requireToken =
    options.requireTokenForWrites ?? process.env.AUTH_REQUIRE_TOKEN_FOR_WRITES === 'true';
  const jwtSecret = options.jwtSecret ?? process.env.JWT_SECRET;
  const internalKey = options.internalApiKey ?? process.env.INTERNAL_API_KEY;

  if (requireToken && !jwtSecret) {
    throw new Error('AUTH_REQUIRE_TOKEN_FOR_WRITES=true needs JWT_SECRET to be set');
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    if (SAFE_METHODS.has(req.method?.toUpperCase())) {
      next();
      return;
    }

    const path = requestPath(req);
    const token = bearerToken(req);

    if (!requireToken) {
      if (isReadOnlyToken(token) && !isReadOnlyAllowedRequest(req.method, path)) {
        refuse(res, 403, READ_ONLY_ERROR_CODE, READ_ONLY_MESSAGE);
        return;
      }
      next();
      return;
    }

    let payload: unknown = null;
    if (token) {
      try {
        payload = jwt.verify(token, jwtSecret as string);
      } catch {
        payload = null;
      }
    }

    if (payload) {
      if (readOnlyClaim(payload) && !isReadOnlyAllowedRequest(req.method, path)) {
        refuse(res, 403, READ_ONLY_ERROR_CODE, READ_ONLY_MESSAGE);
        return;
      }
      next();
      return;
    }

    const providedKey = headerValue(req, 'x-internal-api-key');
    if (providedKey && internalKey && safeEqual(providedKey, internalKey)) {
      next();
      return;
    }

    if (PUBLIC_WRITE_PATHS.some((pattern) => pattern.test(path))) {
      next();
      return;
    }

    refuse(res, 401, AUTH_REQUIRED_ERROR_CODE, 'Sign in to make changes.');
  };
}
