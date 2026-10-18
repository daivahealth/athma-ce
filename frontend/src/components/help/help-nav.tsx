'use client';

import * as React from 'react';
import Link from 'next/link';

import { getHelpGroups, helpDocPath, type HelpDoc } from '@/lib/help/help-content';
import { HELP_TONE, helpDocTone, helpGroupStyle, type HelpTone } from '@/lib/help/help-tones';
import { cn } from '@/lib/utils';

interface HelpNavProps {
  locale: string;
  activeSlug?: string;
  activeHeadingId?: string;
}

/** The manual's table of contents; the open page also lists its own headings. */
export function HelpNav({ locale, activeSlug, activeHeadingId }: HelpNavProps) {
  const groups = React.useMemo(() => getHelpGroups(), []);

  return (
    <nav aria-label="Manual contents" className="flex flex-col gap-5 text-sm">
      {groups.map(({ group, docs }) => {
        const { tone: groupTone, icon: Icon } = helpGroupStyle(group);
        return (
          <div key={group}>
            <p className={cn('mb-1.5 flex items-center gap-1.5 px-2 text-[11px] font-semibold uppercase tracking-wide', HELP_TONE[groupTone].text)}>
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {group}
            </p>
            <ul className="flex flex-col gap-0.5">
              {docs.map((doc) => {
                const tone = helpDocTone(doc);
                const active = doc.slug === activeSlug;
                return (
                  <li key={doc.slug}>
                    <Link
                      href={helpDocPath(locale, doc.slug)}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-baseline gap-2 rounded-md border px-2 py-1.5 leading-5 transition-colors',
                        active
                          ? cn(HELP_TONE[tone].panel, 'font-medium text-foreground')
                          : 'border-transparent text-foreground/85 hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      {doc.title}
                    </Link>
                    {active ? <HeadingList doc={doc} tone={tone} activeHeadingId={activeHeadingId} /> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function HeadingList({ doc, tone, activeHeadingId }: { doc: HelpDoc; tone: HelpTone; activeHeadingId?: string }) {
  const minDepth = Math.min(...doc.headings.map((heading) => heading.depth), 6);
  const headings = doc.headings.filter((heading) => heading.depth <= minDepth + 1);
  if (headings.length === 0) return null;

  return (
    <ul className="mb-1 ml-3 mt-0.5 flex flex-col border-l border-border">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            className={cn(
              '-ml-px block border-l py-1 pr-2 text-xs leading-5 transition-colors hover:text-foreground',
              heading.depth > minDepth ? 'pl-6' : 'pl-3',
              heading.id === activeHeadingId ? cn(HELP_TONE[tone].border, 'font-medium text-foreground') : 'border-transparent text-muted-foreground'
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
