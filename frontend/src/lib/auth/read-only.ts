'use client';

import { useEffect, useState } from 'react';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { useToastStore } from '@/components/ui/use-toast';

/**
 * Read-only access (demo visitor role).
 *
 * The backend refuses every write from a read-only token with 403 and
 * code READ_ONLY_ACCESS (readOnlyAccessMiddleware in @zeal/shared-utils), so
 * the UI does not have to hide every action button to stay safe. It shows a
 * notice in the environment banner and a toast when a write is refused.
 * See docs/features/DEPLOYMENT-MODE.md (Read-only demo visitors).
 */

export const READ_ONLY_ERROR_CODE = 'READ_ONLY_ACCESS';

export function isReadOnlyToken(token: string | null | undefined): boolean {
  return decodeAccessToken(token)?.readOnly === true;
}

export function isReadOnlyError(error: unknown): boolean {
  const response = (error as { response?: { status?: number; data?: { code?: unknown } } })?.response;
  return response?.status === 403 && response.data?.code === READ_ONLY_ERROR_CODE;
}

const TOAST_INTERVAL_MS = 4000;
let lastToastAt = 0;

/** Tells a read-only user why their action did nothing. At most one toast every few seconds. */
export function notifyReadOnlyRefusal(): void {
  const now = Date.now();
  if (now - lastToastAt < TOAST_INTERVAL_MS) return;
  lastToastAt = now;
  useToastStore.getState().publish({
    title: 'Read-only demo',
    description:
      'You are exploring the demo hospital in read-only mode, so changes are not saved. Create your own sandbox to try this.',
  });
}

function readStoredToken(): string | null {
  try {
    return window.localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

/** Whether the signed-in user holds a read-only token. False during server render and before mount. */
export function useIsReadOnlyUser(): boolean {
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const update = () => setReadOnly(isReadOnlyToken(readStoredToken()));
    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  return readOnly;
}
