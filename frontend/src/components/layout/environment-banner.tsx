import Link from 'next/link';
import { AlertTriangle, FlaskConical, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
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
 * Full-width notice naming the deployment mode. Renders nothing in production.
 * The demo notice carries the "not for production / live patients" disclaimer.
 */
export function EnvironmentBanner({ locale, className }: { locale: string; className?: string }) {
  if (DEPLOYMENT_MODE === 'production') return null;
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
        <Link href={`/${locale}/terms`} className="whitespace-nowrap font-medium underline underline-offset-2 hover:text-primary">
          Terms
        </Link>
        {' · '}
        <Link href={`/${locale}/privacy`} className="whitespace-nowrap font-medium underline underline-offset-2 hover:text-primary">
          Privacy
        </Link>
      </p>
    </div>
  );
}

/** Compact pill for the sticky topbar, so the mode stays visible after scrolling. */
export function EnvironmentBadge({ className }: { className?: string }) {
  if (DEPLOYMENT_MODE === 'production') return null;
  const info = getDeploymentModeInfo();
  return (
    <span
      title={info.notice}
      data-deployment-mode={DEPLOYMENT_MODE}
      className={cn(
        'inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold tracking-wider',
        TONE[DEPLOYMENT_MODE].badge,
        className,
      )}
    >
      {info.label}
    </span>
  );
}
