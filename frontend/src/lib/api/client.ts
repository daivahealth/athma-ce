'use client';

import axios from 'axios';
import { isTokenExpired, decodeAccessToken } from '@/lib/auth/tokens';
import type { AuthSession } from '@/types/auth';

const FOUNDATION_BASE_URL = process.env.NEXT_PUBLIC_FOUNDATION_BASE_URL ?? 'http://localhost:3010';
const CLINICAL_BASE_URL = process.env.NEXT_PUBLIC_CLINICAL_BASE_URL ?? 'http://localhost:3011';
const RCM_BASE_URL = process.env.NEXT_PUBLIC_RCM_BASE_URL ?? 'http://localhost:3012';

export const authClient = axios.create({
  baseURL: `${FOUNDATION_BASE_URL}/api/v1/auth`,
  withCredentials: true,
});

export const foundationClient = axios.create({
  baseURL: `${FOUNDATION_BASE_URL}/api/v1`,
  withCredentials: true,
});

export const clinicalClient = axios.create({
  baseURL: `${CLINICAL_BASE_URL}/api/v1`,
  withCredentials: true,
});

export const rcmClient = axios.create({
  baseURL: `${RCM_BASE_URL}/api/v1`,
  withCredentials: true,
});

let session: AuthSession = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

// Initialize session from localStorage on module load
if (typeof window !== 'undefined') {
  const storedAccessToken = localStorage.getItem('accessToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');

  if (storedAccessToken) {
    session = {
      accessToken: storedAccessToken,
      refreshToken: storedRefreshToken,
      user: decodeAccessToken(storedAccessToken),
    };
  }
}

export function getSession(): AuthSession {
  // Always try to load from localStorage first
  if (typeof window !== 'undefined') {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedAccessToken && !session.accessToken) {
      session = {
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
        user: decodeAccessToken(storedAccessToken),
      };
    }
  }

  return session;
}

export function setSession(update: AuthSession) {
  session = update;

  // Persist to localStorage
  if (typeof window !== 'undefined') {
    if (update.accessToken) {
      localStorage.setItem('accessToken', update.accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }

    if (update.refreshToken) {
      localStorage.setItem('refreshToken', update.refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }
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

// Interceptor for Foundation, Clinical, and RCM clients
const createApiInterceptor = (client: typeof foundationClient) => {
  client.interceptors.request.use(async (config) => {
    if (!session.accessToken || isTokenExpired(session.accessToken)) {
      await refreshAccessToken();
    }
    const claims = decodeAccessToken(session.accessToken);

    if (session.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    // Add required tenant context headers
    if (claims?.tenantId) {
      config.headers['x-tenant-id'] = claims.tenantId;
    }
    if (claims?.userId || claims?.sub) {
      config.headers['x-user-id'] = claims.userId || claims.sub;
    }
    if (claims?.facilityId) {
      config.headers['x-facility-id'] = claims.facilityId;
    }

    // Debug logging
    console.log('API Request Headers:', {
      url: config.url,
      hasAuth: !!session.accessToken,
      tenantId: config.headers['x-tenant-id'],
      userId: config.headers['x-user-id'],
      facilityId: config.headers['x-facility-id'],
      claims: claims ? {
        tenantId: claims.tenantId,
        userId: claims.userId,
        sub: claims.sub,
        facilityId: claims.facilityId,
      } : 'No claims',
    });

    return config;
  });
};

// Apply interceptors to all API clients
createApiInterceptor(foundationClient);
createApiInterceptor(clinicalClient);
createApiInterceptor(rcmClient);

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

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
}

export async function refreshAccessToken() {
  if (!session.refreshToken) return;
  try {
    const { data } = await authClient.post('/refresh', {
      refreshToken: session.refreshToken,
    });
    const newSession = {
      accessToken: data.accessToken ?? null,
      refreshToken: data.refreshToken ?? session.refreshToken,
      user: decodeAccessToken(data.accessToken),
    };
    setSession(newSession); // Use setSession to persist to localStorage
  } catch (error) {
    setSession({ accessToken: null, refreshToken: null, user: null }); // Clear session
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
