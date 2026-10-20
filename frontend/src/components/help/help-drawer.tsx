'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, Map as MapIcon } from 'lucide-react';

import { HelpMarkdown } from '@/components/help/help-markdown';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ToneBadge } from '@/components/ui/tone-badge';
import {
  getHelpGroups,
  helpDocPath,
  helpForPathname,
  helpIndexPath,
  type HelpDoc,
  type HelpHeading,
} from '@/lib/help/help-content';
import { HELP_TONE, helpDocTone, helpGroupStyle } from '@/lib/help/help-tones';
import { cn } from '@/lib/utils';

interface HelpDrawerProps {
  locale: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Contextual help, after prrapp's help drawer: the manual page for the screen
 * the user is on, in a side sheet, so nobody has to leave a half-filled form
 * to read how it works.
 */
export default function HelpDrawer({ locale, open, onOpenChange }: HelpDrawerProps) {
  const pathname = usePathname() ?? '/';
  const { primary, heading, related } = React.useMemo(() => helpForPathname(pathname, locale), [pathname, locale]);
  const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-xl"
        aria-describedby={undefined}
        // Radix would focus the first link in the header and scroll back up to
        // it, undoing the jump to this screen's section; focus the sheet instead.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.currentTarget as HTMLElement).focus({ preventScroll: true });
        }}
      >
        {primary ? (
          <DocView locale={locale} doc={primary} heading={heading} related={related} onNavigate={close} open={open} />
        ) : (
          <NoPageHelp locale={locale} onNavigate={close} pathname={pathname} />
        )}
      </SheetContent>
    </Sheet>
  );
}

function DocView({
  locale,
  doc,
  heading,
  related,
  onNavigate,
  open,
}: {
  locale: string;
  doc: HelpDoc;
  heading: HelpHeading | null;
  related: HelpDoc[];
  onNavigate: () => void;
  open: boolean;
}) {
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);

  // One page covers a whole module, so open it at the section for the screen
  // the user is actually on. It is measured against the sticky header rather
  // than using scrollIntoView, which would leave the heading behind it, and
  // repeated through the sheet's 500 ms slide-in, which the first frame can
  // land before; a run that finds the heading in place moves nothing.
  React.useEffect(() => {
    if (!open || !heading) return;
    const scroll = () => {
      const body = bodyRef.current;
      const target = body?.querySelector(`#${CSS.escape(heading.id)}`);
      const scroller = body?.closest<HTMLElement>('[role="dialog"]');
      if (!target || !scroller) return;
      const clearBelow = (headerRef.current ?? scroller).getBoundingClientRect().bottom;
      scroller.scrollTop += target.getBoundingClientRect().top - clearBelow - 12;
    };
    const frame = requestAnimationFrame(scroll);
    const timers = [120, 320, 560].map((delay) => window.setTimeout(scroll, delay));
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [open, heading, doc.slug]);

  const tone = helpDocTone(doc);
  const { icon: GroupIcon } = helpGroupStyle(doc.group);

  return (
    <div className="contents" data-tone={tone} style={{ '--help-accent': HELP_TONE[tone].accent } as React.CSSProperties}>
      <div ref={headerRef} className={cn('sticky top-0 z-10 flex flex-col space-y-1 border-b p-5 pr-12 text-left backdrop-blur-sm', HELP_TONE[tone].panel)}>
        <p className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <span className={cn('flex h-5 w-5 items-center justify-center rounded-md', HELP_TONE[tone].chip)}>
            <GroupIcon className="h-3 w-3" aria-hidden />
          </span>
          Help
          <ToneBadge tone={tone} className="normal-case">
            {doc.group}
          </ToneBadge>
        </p>
        <SheetTitle>{heading ? heading.text : doc.title}</SheetTitle>
        {heading ? (
          <SheetDescription>
            In{' '}
            <Link href={helpDocPath(locale, doc.slug)} className="text-primary hover:underline" onClick={onNavigate}>
              {doc.title}
            </Link>
          </SheetDescription>
        ) : doc.description ? (
          <SheetDescription>{doc.description}</SheetDescription>
        ) : null}
      </div>
      <div ref={bodyRef} className="flex-1 px-5 py-4">
        <HelpMarkdown markdown={doc.body} locale={locale} className="help-prose--compact" onNavigate={onNavigate} />
      </div>
      <SheetFooter className="sticky bottom-0 flex-col gap-2 border-t border-border bg-popover p-4 sm:flex-col sm:justify-start sm:space-x-0">
        <Link
          href={helpDocPath(locale, doc.slug, heading ? `#${heading.id}` : '')}
          className={cn(
            'inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1 text-sm font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            HELP_TONE[tone].panel,
            HELP_TONE[tone].hover
          )}
          onClick={onNavigate}
        >
          <ExternalLink className={cn('h-3.5 w-3.5', HELP_TONE[tone].text)} aria-hidden />
          Open in the Help Centre
        </Link>
        {related.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            Also relevant here:
            {related.map((item) => {
              const itemTone = helpDocTone(item);
              return (
                <Link
                  key={item.slug}
                  href={helpDocPath(locale, item.slug)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-medium text-foreground transition-colors',
                    HELP_TONE[itemTone].panel,
                    HELP_TONE[itemTone].hover
                  )}
                  onClick={onNavigate}
                >
                  <span className={cn('h-1.5 w-1.5 rounded-full', HELP_TONE[itemTone].dot)} aria-hidden />
                  {item.title}
                </Link>
              );
            })}
          </div>
        ) : null}
      </SheetFooter>
    </div>
  );
}

function NoPageHelp({ locale, onNavigate, pathname }: { locale: string; onNavigate: () => void; pathname: string }) {
  const groups = getHelpGroups();
  return (
    <>
      <SheetHeader className={cn('space-y-1 border-b p-5 pr-12 text-left', HELP_TONE.amber.panel)}>
        <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <span className={cn('flex h-5 w-5 items-center justify-center rounded-md', HELP_TONE.amber.chip)}>
            <MapIcon className="h-3 w-3" aria-hidden />
          </span>
          Help
        </p>
        <SheetTitle>No page for this screen yet</SheetTitle>
        <SheetDescription>
          The manual has nothing written for <code className="rounded bg-muted px-1 py-0.5 text-xs">{pathname}</code>. Everything it does
          cover is listed below, or{' '}
          <Link href={helpIndexPath(locale)} className="text-primary hover:underline" onClick={onNavigate}>
            search the Help Centre
          </Link>
          .
        </SheetDescription>
      </SheetHeader>
      <nav aria-label="Manual contents" className="flex flex-col gap-4 px-5 py-4">
        {groups.map(({ group, docs }) => {
          const { tone, icon: Icon } = helpGroupStyle(group);
          return (
            <div key={group}>
              <p className={cn('mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide', HELP_TONE[tone].text)}>
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {group}
              </p>
              <ul className="flex flex-col gap-1">
                {docs.map((doc) => (
                  <li key={doc.slug}>
                    <Link
                      href={helpDocPath(locale, doc.slug)}
                      onClick={onNavigate}
                      className={cn(
                        'flex items-start gap-2 rounded-md border border-l-4 border-transparent px-2 py-1.5 text-sm transition-colors',
                        HELP_TONE[tone].edge,
                        HELP_TONE[tone].hover
                      )}
                    >
                      {doc.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </>
  );
}
