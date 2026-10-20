'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { HelpMarkdown } from '@/components/help/help-markdown';
import { HelpNav } from '@/components/help/help-nav';
import { ToneBadge } from '@/components/ui/tone-badge';
import { getAdjacentDocs, getHelpDoc, helpDocPath, helpIndexPath, type HelpDoc } from '@/lib/help/help-content';
import { HELP_TONE, helpDocTone, helpGroupStyle } from '@/lib/help/help-tones';
import { cn } from '@/lib/utils';

/** The heading the URL points at, kept in step with hash changes from the contents. */
function useHash(): string {
  const [hash, setHash] = React.useState('');
  React.useEffect(() => {
    const read = () => setHash(window.location.hash);
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);
  return hash;
}

/** One manual page with the contents beside it and previous/next beneath. */
export default function HelpDocPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const doc = getHelpDoc(params?.slug as string | undefined);
  const hash = useHash();
  const activeHeadingId = hash ? decodeURIComponent(hash.slice(1)) : undefined;

  // A hash in the URL has to be honoured by hand once the markdown has rendered
  // (a client navigation lands before it exists); fonts arriving late reflow
  // a long page, so the scroll is repeated once they are in.
  React.useEffect(() => {
    if (!doc) return;
    let cancelled = false;
    const scroll = () => {
      if (cancelled) return;
      if (activeHeadingId) document.getElementById(activeHeadingId)?.scrollIntoView({ block: 'start' });
      else window.scrollTo({ top: 0 });
    };
    scroll();
    document.fonts?.ready.then(scroll).catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [doc, activeHeadingId]);

  if (!doc) notFound();

  const { previous, next } = getAdjacentDocs(doc.slug);
  const tone = helpDocTone(doc);
  const { icon: GroupIcon } = helpGroupStyle(doc.group);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 py-2 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <div className="pane-scroll sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto pr-2">
          <HelpNav locale={locale} activeSlug={doc.slug} activeHeadingId={activeHeadingId} />
        </div>
      </aside>
      <article className="min-w-0" style={{ '--help-accent': HELP_TONE[tone].accent } as React.CSSProperties} data-tone={tone}>
        <header className={cn('mb-6 rounded-2xl border p-5', HELP_TONE[tone].panel)}>
          <div className="flex items-start gap-3">
            <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', HELP_TONE[tone].chip)}>
              <GroupIcon className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <Link href={helpIndexPath(locale)} className="hover:text-foreground">
                  Help Centre
                </Link>
                <span aria-hidden>›</span>
                <ToneBadge tone={tone} className="normal-case">
                  {doc.group}
                </ToneBadge>
              </p>
              <h1 className="mt-1.5 text-2xl font-semibold text-foreground">{doc.title}</h1>
              {doc.description ? <p className="mt-1.5 text-sm text-muted-foreground">{doc.description}</p> : null}
            </div>
          </div>
        </header>
        <HelpMarkdown markdown={doc.body} locale={locale} />
        <nav aria-label="Previous and next" className="mt-10 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
          {previous ? <AdjacentLink locale={locale} doc={previous} direction="previous" /> : <span />}
          {next ? <AdjacentLink locale={locale} doc={next} direction="next" /> : null}
        </nav>
      </article>
    </div>
  );
}

/** The page before or after, edged in its own colour. */
function AdjacentLink({ locale, doc, direction }: { locale: string; doc: HelpDoc; direction: 'previous' | 'next' }) {
  const tone = helpDocTone(doc);
  const isNext = direction === 'next';
  return (
    <Link
      href={helpDocPath(locale, doc.slug)}
      className={cn(
        'flex flex-col gap-0.5 rounded-lg border p-3 text-sm transition-colors',
        isNext ? cn('border-r-4 text-right', HELP_TONE[tone].edgeRight) : cn('border-l-4', HELP_TONE[tone].edge),
        HELP_TONE[tone].hover
      )}
    >
      <span className={cn('flex items-center gap-1 text-xs', isNext && 'justify-end', HELP_TONE[tone].text)}>
        {isNext ? (
          <>
            Next <ArrowRight className="h-3 w-3" aria-hidden />
          </>
        ) : (
          <>
            <ArrowLeft className="h-3 w-3" aria-hidden /> Previous
          </>
        )}
      </span>
      <span className="font-medium text-foreground">{doc.title}</span>
    </Link>
  );
}
