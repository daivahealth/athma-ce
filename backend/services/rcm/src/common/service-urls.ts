/**
 * Base URLs for RCM's calls to other services.
 *
 * Deployments set the upstream URL variables either as a bare origin
 * (`http://clinical:3011`, as the demo compose and `.env.example` do) or with
 * the API prefix (`http://localhost:3011/api/v1`). Every service mounts its
 * routes under `/api/v1`, so a bare origin gets the prefix appended; a URL
 * that already has a path is used as given. Trailing slashes are dropped so
 * callers can append `/patients/...`.
 */
export const API_PREFIX = '/api/v1';

export function apiBaseUrl(value: string | undefined, fallback: string): string {
  const raw = (value?.trim() || fallback).replace(/\/+$/, '');
  let path: string;
  try {
    path = new URL(raw).pathname;
  } catch {
    return raw;
  }
  return path === '' || path === '/' ? `${raw}${API_PREFIX}` : raw;
}

/** Clinical service API base, from `CLINICAL_API_URL`. */
export function resolveClinicalApiUrl(env: NodeJS.ProcessEnv = process.env): string {
  return apiBaseUrl(env.CLINICAL_API_URL, 'http://localhost:3011');
}

/** Clinical service API base for pharmacy, from `CLINICAL_SERVICE_URL`. */
export function resolveClinicalServiceApiUrl(env: NodeJS.ProcessEnv = process.env): string {
  return apiBaseUrl(env.CLINICAL_SERVICE_URL, 'http://localhost:3011');
}

/** Foundation service API base, from `FOUNDATION_API_URL`. */
export function resolveFoundationApiUrl(env: NodeJS.ProcessEnv = process.env): string {
  return apiBaseUrl(env.FOUNDATION_API_URL, 'http://localhost:3010');
}
