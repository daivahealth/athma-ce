'use client';

import * as React from 'react';
import Link from 'next/link';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { calloutOf, helpDocPath, parseDocLink, rehypeHeadingIds } from '@/lib/help/help-content';
import { cn } from '@/lib/utils';

interface HelpMarkdownProps {
  markdown: string;
  locale: string;
  className?: string;
  /**
   * Called after a link into the app or to another help page is followed;
   * the help drawer uses it to close itself.
   */
  onNavigate?: () => void;
}

type AnchorProps = React.ComponentPropsWithoutRef<'a'> & { node?: unknown };

function isAppPath(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

/**
 * Renders one manual page. Links written as `slug.md#anchor` in the docs (so
 * GitHub renders them too) become help routes; bare app paths such as
 * `/patients` get the locale and become router links.
 */
export function HelpMarkdown({ markdown, locale, className, onNavigate }: HelpMarkdownProps) {
  const components = React.useMemo<Components>(
    () => ({
      a({ href = '', children, node: _node, ...props }: AnchorProps) {
        const docLink = parseDocLink(href);
        if (docLink) {
          return (
            <Link href={helpDocPath(locale, docLink.slug, docLink.hash)} onClick={onNavigate} {...props}>
              {children}
            </Link>
          );
        }
        if (href.startsWith('#')) {
          return (
            <a href={href} {...props}>
              {children}
            </a>
          );
        }
        if (isAppPath(href)) {
          return (
            <Link href={`/${locale}${href}`} onClick={onNavigate} {...props}>
              {children}
            </Link>
          );
        }
        return (
          <a href={href} target="_blank" rel="noreferrer" {...props}>
            {children}
          </a>
        );
      },
      // Go to, Check and If instead each get their colour (.help-prose in globals.css).
      p({ node, ...props }) {
        return <p data-callout={calloutOf(node)} {...props} />;
      },
      table({ node: _node, ...props }) {
        return (
          <div className="help-prose__table-scroll">
            <table {...props} />
          </div>
        );
      },
    }),
    [locale, onNavigate]
  );

  return (
    <div className={cn('help-prose', className)}>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHeadingIds]} components={components}>
        {markdown}
      </Markdown>
    </div>
  );
}
