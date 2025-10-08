'use client';

import axios from 'axios';
import { isTokenExpired, decodeAccessToken } from '@/lib/auth/tokens';
import type { AuthSession } from '@/types/auth';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3001';
const FOUNDATION_BASE_URL = process.env.NEXT_PUBLIC_FOUNDATION_BASE_URL ?? 'http://localhost:3010';

export const authClient = axios.create({
  baseURL: `${AUTH_BASE_URL}/api/v1/auth`,
  withCredentials: true,
});

export const foundationClient = axios.create({
  baseURL: FOUNDATION_BASE_URL,
  withCredentials: true,
});

let session: AuthSession = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

export function getSession(): AuthSession {
  return session;
}

export function setSession(update: AuthSession) {
  session = update;
}

authClient.interceptors.request.use(async (config) => {
  if (config.url?.includes('/login') || config.url?.includes('/refresh')) {
    return config;
  }
  if (!session.accessToken || isTokenExpired(session.accessToken)) {
    await refreshAccessToken();
  }
  if (session.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

foundationClient.interceptors.request.use(async (config) => {
  if (!session.accessToken || isTokenExpired(session.accessToken)) {
    await refreshAccessToken();
  }
  const claims = decodeAccessToken(session.accessToken);
  if (session.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  if (claims?.tenantId) {
    config.headers['x-tenant-id'] = claims.tenantId;
  }
  return config;
});

export async function login(payload: { email: string; password: string; mfaCode?: string | null }) {
  const { data } = await authClient.post('/login', payload);
  if (data.accessToken) {
    session = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? null,
      user: decodeAccessToken(data.accessToken),
    };
  }
  return data;
}

export async function logout(options: { refreshToken?: string; allDevices?: boolean } = {}) {
  try {
    // Send logout request to server with current refresh token
    const logoutPayload = {
      refreshToken: options.refreshToken || session.refreshToken,
      allDevices: options.allDevices || false,
    };
    
    await authClient.post('/logout', logoutPayload);
  } catch (error) {
    // Even if server logout fails, clear local session
    console.warn('Server logout failed, clearing local session:', error);
  } finally {
    // Always clear local session
    session = { accessToken: null, refreshToken: null, user: null };
  }
}

export async function refreshAccessToken() {
  if (!session.refreshToken) return;
  try {
    const { data } = await authClient.post('/refresh', {
      refreshToken: session.refreshToken,
    });
    session = {
      accessToken: data.accessToken ?? null,
      refreshToken: data.refreshToken ?? session.refreshToken,
      user: decodeAccessToken(data.accessToken),
    };
  } catch (error) {
    session = { accessToken: null, refreshToken: null, user: null };
    throw error;
  }
}

export function tenantScopedClient(path: string) {
  return foundationClient.get(path).then((res) => res.data);
}

export async function switchFacility(facilityId: string) {
  try {
    const { data } = await authClient.post('/switch-facility', { facilityId });
    
    if (data.accessToken) {
      session = {
        ...session,
        accessToken: data.accessToken,
        user: decodeAccessToken(data.accessToken),
      };
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}
