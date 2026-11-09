'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PatientIdentity, type PatientIdentitySource } from '@/components/ui/patient-identity';
import { Skeleton } from '@/components/ui/skeleton';
import { ToneBadge, type BadgeTone } from '@/components/ui/tone-badge';
import { TONE_BAR } from '@/components/ui/tone-classes';
import { cn } from '@/lib/utils';
import { humanize } from './ot-list';

/**
 * The top of every OT detail page: a back link, a tone strip, the record's
 * kind and title with its badges and actions, and the patient beside a strip
 * of key facts.
 */
export function OtDetailHero({
  backHref,
  backLabel,
  kicker,
  icon: Icon,
  title,
  subtitle,
  badges,
  actions,
  tone,
  patient,
  facts,
}: {
  backHref: string;
  backLabel: string;
  kicker: string;
  icon: LucideIcon;
  title: string;
  subtitle?: ReactNode;
  badges?: ReactNode;
  actions?: ReactNode;
  tone: BadgeTone;
  patient?: PatientIdentitySource | null;
  facts?: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <Card className="overflow-hidden">
        <div className={cn('h-1 w-full', TONE_BAR[tone])} aria-hidden="true" />
        <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {kicker}
              </p>
              <h1 className="font-display text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
                {title}
              </h1>
              {subtitle ? <div className="text-sm text-muted-foreground">{subtitle}</div> : null}
              {badges ? (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">{badges}</div>
              ) : null}
            </div>
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">{actions}</div>
          ) : null}
        </div>

        {patient || facts ? (
          <div className="grid gap-4 border-t bg-muted/30 p-5 sm:p-6 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-center">
            {patient ? (
              <div className="rounded-xl border bg-background p-3.5">
                <PatientIdentity source={patient} size="lg" />
              </div>
            ) : null}
            {facts ? (
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 xl:grid-cols-4">
                {facts}
              </dl>
            ) : null}
          </div>
        ) : null}
      </Card>
    </div>
  );
}

/** One labelled value in a fact grid; renders "—" when the value is empty. */
export function OtFact({
  label,
  icon: Icon,
  children,
  className,
  wide,
}: {
  label: string;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  const empty = children == null || children === '' || children === false;
  return (
    <div className={cn('min-w-0', wide && 'col-span-full', className)}>
      <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
        {label}
      </dt>
      <dd
        className={cn(
          'mt-1 text-sm font-medium',
          empty ? 'text-muted-foreground' : 'text-foreground',
        )}
      >
        {empty ? '—' : children}
      </dd>
    </div>
  );
}

/** A titled card on an OT detail page. */
export function OtSection({
  title,
  icon: Icon,
  description,
  action,
  children,
  className,
  contentClassName,
}: {
  title: string;
  icon?: LucideIcon;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex items-center justify-between gap-3 border-b px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
          </div>
        </div>
        {action}
      </div>
      <div className={cn('p-5', contentClassName)}>{children}</div>
    </Card>
  );
}

export interface OtTimelineEvent {
  id: string;
  fromStatus?: string | null;
  toStatus: string;
  changedAt: string;
  reason?: string | null;
}

/**
 * Status history as a vertical timeline, newest first: a tone-coloured node per
 * step, the move from one status to the next, and when it happened.
 */
export function OtStatusTimeline({
  events,
  toneOf,
  formatDate,
}: {
  events: readonly OtTimelineEvent[];
  toneOf: (status: string) => BadgeTone;
  formatDate: (iso: string) => string;
}) {
  const ordered = [...events].sort((a, b) => b.changedAt.localeCompare(a.changedAt));
  return (
    <ol className="relative space-y-4">
      {ordered.map((event, index) => {
        const tone = toneOf(event.toStatus);
        const last = index === ordered.length - 1;
        return (
          <li key={event.id} className="relative flex gap-3">
            {!last ? (
              <span
                className="absolute left-[7px] top-5 h-[calc(100%+0.25rem)] w-px bg-border"
                aria-hidden="true"
              />
            ) : null}
            <span
              className={cn(
                'relative mt-1 size-[15px] shrink-0 rounded-full ring-4 ring-background',
                TONE_BAR[tone],
              )}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 text-sm">
                {event.fromStatus ? (
                  <>
                    <span className="text-muted-foreground">{humanize(event.fromStatus)}</span>
                    <span className="text-muted-foreground">→</span>
                  </>
                ) : null}
                <ToneBadge tone={tone}>{humanize(event.toStatus)}</ToneBadge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(event.changedAt)}</p>
              {event.reason ? (
                <p className="mt-1 text-xs text-foreground/80">{event.reason}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** A clickable row linking to a related OT record (a schedule or report). */
export function OtLinkRow({
  href,
  icon: Icon,
  title,
  meta,
  badge,
}: {
  href: string;
  icon: LucideIcon;
  title: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-xl border bg-background px-3.5 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">{title}</span>
          {meta ? (
            <span className="block truncate text-xs text-muted-foreground">{meta}</span>
          ) : null}
        </span>
      </span>
      {badge}
    </Link>
  );
}

/** Loading state for an OT detail page. */
export function OtDetailSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-56 w-full rounded-xl" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-64 w-full rounded-xl lg:col-span-2" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
