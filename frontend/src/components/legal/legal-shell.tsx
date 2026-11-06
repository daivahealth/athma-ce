import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LEGAL_LAST_UPDATED = 'November 2026';
export const LEGAL_ENTITY = 'Daiva Health Systems Private Limited';
export const DAIVA_HEALTH_URL = 'https://daiva.health/';

export function LegalHeader({ locale }: { locale: string }) {
  return (
    <header className="border-b border-border bg-background/95">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <Link href={`/${locale}/login`} aria-label="Athma home">
          <Image src="/athma-logo.svg" alt="Athma" width={120} height={35} className="h-8 w-auto dark:hidden" priority />
          <Image src="/athma-logo-dark.svg" alt="Athma" width={120} height={35} className="hidden h-8 w-auto dark:block" priority />
        </Link>
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Athma
        </Link>
      </div>
    </header>
  );
}

/** "Terms · Privacy" links, reused by the login screen and the legal pages. */
export function LegalLinks({ locale, className }: { locale: string; className?: string }) {
  return (
    <nav aria-label="Legal" className={cn('flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground', className)}>
      <Link href={`/${locale}/terms`} className="hover:text-primary hover:underline">
        Terms &amp; Conditions
      </Link>
      <span aria-hidden="true">·</span>
      <Link href={`/${locale}/privacy`} className="hover:text-primary hover:underline">
        Privacy Policy
      </Link>
    </nav>
  );
}

export function LegalFooter({ locale }: { locale: string }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-2 px-4 py-6 text-center text-xs text-muted-foreground">
        <LegalLinks locale={locale} />
        <p>
          &copy; 2026 {LEGAL_ENTITY}. Athma is open-source software from{' '}
          <a href={DAIVA_HEALTH_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            Daiva Health
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

export function LegalDocument({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <article className="space-y-8 text-sm leading-relaxed text-foreground/90">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="text-base text-muted-foreground">{lead}</p>
      </header>
      {children}
      <p className="border-t border-border pt-4 text-xs text-muted-foreground">
        Last updated: {LEGAL_LAST_UPDATED}. This page mirrors the {title} published at{' '}
        <a href={DAIVA_HEALTH_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          daiva.health
        </a>
        ; if the two differ, the version on daiva.health applies.
      </p>
    </article>
  );
}

export function LegalSection({
  heading,
  children,
  tone = 'default',
}: {
  heading: string;
  children: ReactNode;
  tone?: 'default' | 'warning';
}) {
  return (
    <section
      className={cn(
        'space-y-2',
        tone === 'warning' && 'rounded-lg border border-warning/40 bg-warning/10 p-4',
      )}
    >
      <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
      {children}
    </section>
  );
}
