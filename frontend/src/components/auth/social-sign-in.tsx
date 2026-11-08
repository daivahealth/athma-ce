'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getOAuthProviders, oauthStartUrl, type OAuthProviderId } from '@/lib/api/client';

/** Messages for the oauthError codes foundation redirects back with. */
export const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  provider_denied: 'Sign-in was cancelled.',
  invalid_state: 'Your sign-in session expired. Please try again.',
  terms_required: 'Please accept the demo terms to continue.',
  rate_limited: 'Too many sign-in attempts from your network. Please try again later.',
  account_disabled: 'This account has been disabled.',
  provider_disabled: 'That sign-in option is not available.',
  not_configured: 'Sign-in with an external account is not available on this instance.',
  provider_error: 'We could not complete sign-in with that account. Please try again.',
  invalid_ticket: 'Your sign-in link expired. Please try again.',
};

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6.1C12.4 13.7 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.5 5.8c4.4-4.1 6.8-10.1 6.8-17.1z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.8-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.8 6.1C6.6 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 23 23" className="h-4 w-4" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M12 1h10v10H12z" />
      <path fill="#00A4EF" d="M1 12h10v10H1z" />
      <path fill="#FFB900" d="M12 12h10v10H12z" />
    </svg>
  );
}

const ICONS: Record<OAuthProviderId, () => JSX.Element> = {
  google: GoogleMark,
  microsoft: MicrosoftMark,
  github: () => <Github className="h-4 w-4" aria-hidden="true" />,
};

/**
 * "Continue with Google / Microsoft / GitHub" for the public demo. Renders
 * nothing when the instance has no external sign-in configured. New accounts
 * get read-only access to the demo hospital (see ADR-0016).
 */
export function SocialSignIn({
  locale,
  returnTo,
  className,
  onAvailabilityChange,
}: {
  locale: string;
  returnTo?: string;
  className?: string;
  /** Called once the provider list loads: true when at least one provider is enabled. */
  onAvailabilityChange?: (available: boolean) => void;
}) {
  const [providers, setProviders] = useState<Array<{ id: OAuthProviderId; label: string }>>([]);
  const [accepted, setAccepted] = useState(false);
  const consentId = useId();

  useEffect(() => {
    let active = true;
    getOAuthProviders()
      .then((data) => {
        if (!active) return;
        const list = data.providers ?? [];
        setProviders(list);
        onAvailabilityChange?.(list.length > 0);
      })
      .catch(() => {
        if (!active) return;
        setProviders([]);
        onAvailabilityChange?.(false);
      });
    return () => {
      active = false;
    };
    // Load once; the callback identity does not matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (providers.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-center text-sm font-medium text-foreground">Explore the demo</p>
      <div className="space-y-2">
        {providers.map((provider) => {
          const Icon = ICONS[provider.id];
          return (
            <Button
              key={provider.id}
              type="button"
              variant="outline"
              className="h-10 w-full justify-center gap-2 bg-background/60"
              disabled={!accepted}
              onClick={() => {
                window.location.assign(
                  oauthStartUrl(provider.id, { locale, ...(returnTo ? { returnTo } : {}) }),
                );
              }}
            >
              <Icon />
              Continue with {provider.label}
            </Button>
          );
        })}
      </div>
      <label
        htmlFor={consentId}
        className="flex cursor-pointer items-start gap-2 text-left text-xs leading-snug text-muted-foreground"
      >
        <input
          id={consentId}
          type="checkbox"
          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-primary"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
        />
        <span>
          I agree to the demo{' '}
          <Link
            href={`/${locale}/terms`}
            className="font-medium underline underline-offset-2 hover:text-primary"
          >
            Terms
          </Link>{' '}
          and{' '}
          <Link
            href={`/${locale}/privacy`}
            className="font-medium underline underline-offset-2 hover:text-primary"
          >
            Privacy Policy
          </Link>
          . Athma stores your name and email to give you read-only access to the demo hospital. Its
          records are fictitious.
        </span>
      </label>
    </div>
  );
}
