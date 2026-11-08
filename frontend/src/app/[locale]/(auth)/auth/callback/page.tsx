'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { exchangeOAuthTicket, setSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { OAUTH_ERROR_MESSAGES } from '@/components/auth/social-sign-in';

/** Same-site relative paths only, mirroring safeReturnTo in foundation. */
function safeReturnTo(value: string | null, locale: string): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return `/${locale}/dashboard`;
  return value;
}

/**
 * Landing page after external sign-in. Foundation redirects here with a
 * one-time ticket in the URL fragment (never sent to a server or in Referer);
 * this page exchanges it for tokens and continues into the app.
 */
export default function OAuthCallbackPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const ticket = fragment.get('ticket');
    const returnTo = safeReturnTo(fragment.get('returnTo'), params.locale);
    // Drop the ticket from the address bar and history straight away.
    window.history.replaceState(null, '', window.location.pathname);

    if (!ticket) {
      setError(OAUTH_ERROR_MESSAGES.invalid_ticket ?? 'Sign-in failed.');
      return;
    }

    exchangeOAuthTicket(ticket)
      .then((data) => {
        if (!data.accessToken) throw new Error('missing token');
        setSession({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken ?? null,
          user: decodeAccessToken(data.accessToken),
        });
        router.replace(returnTo);
      })
      .catch(() => setError(OAUTH_ERROR_MESSAGES.invalid_ticket ?? 'Sign-in failed.'));
  }, [params.locale, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-sm space-y-3 text-center">
        {error ? (
          <>
            <p className="text-sm font-medium text-destructive">{error}</p>
            <Link href={`/${params.locale}/login`} className="text-sm font-medium text-primary underline underline-offset-2">
              Back to sign in
            </Link>
          </>
        ) : (
          <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Signing you in…
          </p>
        )}
      </div>
    </div>
  );
}
