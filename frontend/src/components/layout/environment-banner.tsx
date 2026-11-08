'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { AlertTriangle, FlaskConical, Wrench, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsReadOnlyUser } from '@/lib/auth/read-only';
import { daysLeft } from '@/modules/sandboxes/api';
import { useMySandbox } from '@/modules/sandboxes/use-my-sandbox';
import {
  DEPLOYMENT_MODE,
  getDeploymentModeInfo,
  type DeploymentMode,
} from '@/lib/config/deployment';

const TONE: Record<Exclude<DeploymentMode, 'production'>, { strip: string; icon: string; badge: string }> = {
  demo: {
    strip: 'bg-warning/15 border-warning/40',
    icon: 'text-warning',
    // Solid amber with near-black text: readable in both themes (warning-foreground is near-white)
    badge: 'bg-warning text-neutral-950 border-warning',
  },
  staging: {
    strip: 'bg-warning/10 border-warning/30',
    icon: 'text-warning',
    badge: 'bg-warning/20 text-foreground border-warning',
  },
  development: {
    strip: 'bg-info/10 border-info/30',
    icon: 'text-info',
    badge: 'bg-info text-info-foreground border-info',
  },
};

const ICON = { demo: AlertTriangle, staging: FlaskConical, development: Wrench } as const;

/**
 * Closing the banner lasts for the browser session (sessionStorage), so a new
 * session shows the full notice again. The topbar badge keeps the mode visible
 * in the meantime.
 */
const DISMISS_KEY = 'athma.environment-banner.dismissed';
const listeners = new Set<() => void>();
let dismissedInMemory = false;

function readDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === DEPLOYMENT_MODE;
  } catch {
    return false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function dismiss() {
  try {
    window.sessionStorage.setItem(DISMISS_KEY, DEPLOYMENT_MODE);
  } catch {
    // Storage blocked: the banner still closes until the page reloads.
  }
  dismissedInMemory = true;
  listeners.forEach((listener) => listener());
}

const getSnapshot = () => dismissedInMemory || readDismissed();
// The server always renders the banner; the client hides it after hydration if it was closed.
const getServerSnapshot = () => false;

/**
 * Full-width notice naming the deployment mode. Renders nothing in production.
 * The demo notice carries the "not for production / live patients" disclaimer.
 * The close button hides it for the rest of the browser session.
 */
export function EnvironmentBanner({ locale, className }: { locale: string; className?: string }) {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const readOnly = useIsReadOnlyUser();
  const { data: sandboxStatus } = useMySandbox();
  const sandbox = sandboxStatus?.sandbox;
  const inSandbox = !!sandboxStatus?.inSandbox && !!sandbox;
  const canCreateSandbox = !!sandboxStatus?.available && sandboxStatus.eligible && sandbox?.status !== 'active';

  if (DEPLOYMENT_MODE === 'production' || dismissed) return null;
  const info = getDeploymentModeInfo();
  const tone = TONE[DEPLOYMENT_MODE];
  const Icon = ICON[DEPLOYMENT_MODE];

  return (
    <div
      role="note"
      aria-label={`${info.label} environment notice`}
      data-deployment-mode={DEPLOYMENT_MODE}
      className={cn(
        'flex w-full items-start gap-2 border-b px-3 py-1.5 text-xs leading-snug text-foreground md:items-center md:px-6',
        tone.strip,
        className,
      )}
    >
      <Icon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0 md:mt-0', tone.icon)} aria-hidden="true" />
      <p className="min-w-0 flex-1">
        <span className="font-semibold">{info.label}:</span> {info.notice}{' '}
        {inSandbox && sandbox && (
          <>
            <span className="font-semibold">
              You are in your sandbox, {sandbox.organisationName}: changes are saved here only
              {sandbox.expiresAt && ` until it is deleted in ${daysLeft(sandbox.expiresAt)} days`}.
            </span>{' '}
            <Link href={`/${locale}/sandbox`} className="whitespace-nowrap font-medium underline underline-offset-2 hover:text-primary">
              Manage
            </Link>
            {' · '}
          </>
        )}
        {readOnly && (
          <>
            <span className="font-semibold">You are exploring in read-only mode; changes are not saved.</span>{' '}
            {canCreateSandbox && (
              <>
                <Link href={`/${locale}/sandbox`} className="whitespace-nowrap font-medium underline underline-offset-2 hover:text-primary">
                  Create your own sandbox
                </Link>{' '}
                to try changes.{' '}
              </>
            )}
          </>
        )}
        <Link href={`/${locale}/terms`} className="whitespace-nowrap font-medium underline underline-offset-2 hover:text-primary">
          Terms
        </Link>
        {' · '}
        <Link href={`/${locale}/privacy`} className="whitespace-nowrap font-medium underline underline-offset-2 hover:text-primary">
          Privacy
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label={`Close the ${info.label.toLowerCase()} environment notice`}
        title="Close"
        className="-my-1 -mr-1.5 shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

/** Compact pill for the sticky topbar, so the mode stays visible after scrolling. */
export function EnvironmentBadge({ className }: { className?: string }) {
  const readOnly = useIsReadOnlyUser();
  const { data: sandboxStatus } = useMySandbox();
  if (DEPLOYMENT_MODE === 'production') return null;
  const info = getDeploymentModeInfo();
  const suffix = sandboxStatus?.inSandbox ? ' · SANDBOX' : readOnly ? ' · READ-ONLY' : '';
  return (
    <span
      title={readOnly ? `${info.notice} Read-only access: changes are not saved.` : info.notice}
      data-deployment-mode={DEPLOYMENT_MODE}
      className={cn(
        'inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold tracking-wider',
        TONE[DEPLOYMENT_MODE].badge,
        className,
      )}
    >
      {`${info.label}${suffix}`}
    </span>
  );
}
