'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpen, Search } from 'lucide-react';

import { ToneBadge } from '@/components/ui/tone-badge';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { getHelpGroups, helpDocPath, type HelpDoc } from '@/lib/help/help-content';
import { searchHelp, type HelpSearchHit } from '@/lib/help/help-search';
import { HELP_TONE, helpDocTone, helpGroupStyle } from '@/lib/help/help-tones';
import { cn } from '@/lib/utils';

function groupId(group: string): string {
  return `help-group-${group.replace(/\s+/g, '-').toLowerCase()}`;
}

/** The Help Centre landing page, after prrapp's: search, then the manual grouped by purpose. */
export default function HelpIndexPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const groups = React.useMemo(() => getHelpGroups(), []);
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebouncedValue(query, 150);
  const hits = React.useMemo(() => searchHelp(debouncedQuery, 12), [debouncedQuery]);
  const searching = debouncedQuery.trim().length >= 2;
  const pageCount = groups.reduce((total, { docs }) => total + docs.length, 0);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-2">
      <header className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 p-5 dark:border-indigo-900/70 dark:from-indigo-950/50 dark:via-sky-950/30 dark:to-emerald-950/30 sm:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Help Centre
              <ToneBadge tone="indigo">{pageCount} pages</ToneBadge>
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">The user manual, in the application</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              New here? Start with{' '}
              <Link href={helpDocPath(locale, 'getting-started')} className="font-medium text-primary underline-offset-4 hover:underline">
                Getting started
              </Link>
              : signing in, finding your way round the sidebar, and switching facility. The rest explains each module: what its screens show,
              what to press, and what to do when a screen says no. Press{' '}
              <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">?</kbd> on any screen for the page
              that explains it.
            </p>
          </div>
          <label className="relative block max-w-xl">
            <span className="sr-only">Search the manual</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the manual, e.g. admission, claim batch, dispense"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </div>
      </header>

      {searching ? (
        <SearchResults locale={locale} hits={hits} query={debouncedQuery} />
      ) : (
        <>
          <nav aria-label="Manual groups" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {groups.map(({ group, docs }) => {
              const { tone, icon: Icon } = helpGroupStyle(group);
              return (
                <a
                  key={group}
                  href={`#${groupId(group)}`}
                  className={cn(
                    'flex flex-col gap-1.5 rounded-xl border px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    HELP_TONE[tone].panel,
                    HELP_TONE[tone].hover
                  )}
                >
                  <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg', HELP_TONE[tone].chip)}>
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold leading-4 text-foreground">{group}</span>
                  <span className={cn('text-[11px] tabular-nums', HELP_TONE[tone].text)}>
                    {docs.length} {docs.length === 1 ? 'page' : 'pages'}
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="grid gap-8">
            {groups.map(({ group, docs }) => {
              const { tone, icon: Icon, blurb } = helpGroupStyle(group);
              return (
                <section key={group} aria-labelledby={groupId(group)} className="scroll-mt-20">
                  <div className="mb-3 flex items-start gap-3">
                    <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', HELP_TONE[tone].chip)}>
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <h2 id={groupId(group)} className="flex scroll-mt-20 items-center gap-2 text-sm font-semibold text-foreground">
                        {group}
                        <ToneBadge tone={tone}>{docs.length}</ToneBadge>
                      </h2>
                      {blurb ? <p className="text-xs text-muted-foreground">{blurb}</p> : null}
                    </div>
                  </div>
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {docs.map((doc) => (
                      <li key={doc.slug}>
                        <DocCard locale={locale} doc={doc} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

/** A page of the manual, edged in its group's colour. */
function DocCard({ locale, doc }: { locale: string; doc: HelpDoc }) {
  const tone = helpDocTone(doc);
  return (
    <Link
      href={helpDocPath(locale, doc.slug)}
      className={cn(
        'flex h-full flex-col gap-1.5 rounded-xl border border-l-4 border-border bg-card p-4 text-card-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        HELP_TONE[tone].edge,
        HELP_TONE[tone].hover
      )}
    >
      <span className={cn('flex items-center gap-2 text-xs font-medium', HELP_TONE[tone].text)}>
        <span className={cn('h-1.5 w-1.5 rounded-full', HELP_TONE[tone].dot)} aria-hidden />
        {doc.group}
      </span>
      <span className="font-medium text-foreground">{doc.title}</span>
      {doc.description ? <span className="text-xs leading-5 text-muted-foreground">{doc.description}</span> : null}
    </Link>
  );
}

function SearchResults({ locale, hits, query }: { locale: string; hits: HelpSearchHit[]; query: string }) {
  if (hits.length === 0) {
    return (
      <p
        className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-100"
        role="status"
      >
        Nothing in the manual matches “{query.trim()}”.
      </p>
    );
  }
  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card" aria-label="Search results">
      {hits.map((hit) => {
        const tone = helpDocTone({ group: hit.group });
        return (
          <li key={hit.id}>
            <Link
              href={helpDocPath(locale, hit.slug, hit.anchor ? `#${hit.anchor}` : '')}
              className={cn(
                'flex flex-col gap-1 border-l-4 px-4 py-3 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                HELP_TONE[tone].edge
              )}
            >
              <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <ToneBadge tone={tone}>{hit.group}</ToneBadge>
                {hit.docTitle}
              </span>
              <span className="font-medium text-foreground">{hit.heading}</span>
              <span className="text-xs leading-5 text-muted-foreground">{hit.snippet}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
