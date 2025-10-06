'use client';

import { jwtDecode } from 'jwt-decode';
import type { JwtClaims } from '@/types/auth';

export function decodeAccessToken(token: string | null | undefined): JwtClaims | null {
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtClaims & { sub?: string }>(token);
    return {
      ...decoded,
      userId: decoded.userId ?? decoded.sub ?? '',
    } as JwtClaims;
  } catch (error) {
    console.warn('Failed to decode access token', error);
    return null;
  }
}

export function isTokenExpired(token: string | null | undefined, offsetSeconds = 60): boolean {
  if (!token) return true;
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (!decoded.exp) return true;
    const expiry = decoded.exp * 1000;
    return Date.now() >= expiry - offsetSeconds * 1000;
  } catch (error) {
    console.warn('Failed to read JWT expiry', error);
    return true;
  }
}
