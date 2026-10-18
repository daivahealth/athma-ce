import MiniSearch from 'minisearch';

import { helpDocs, type HelpDoc } from '@/lib/help/help-content';

/**
 * Full-text search over the manual, after prrapp's help-search.ts. Each
 * heading-delimited passage is one entry, so a hit lands the reader on the
 * paragraph rather than the top of a long page. The index is built on first
 * use; the whole manual takes a few milliseconds.
 */

export interface HelpSearchHit {
  id: string;
  slug: string;
  docTitle: string;
  group: string;
  heading: string;
  anchor: string;
  snippet: string;
  score: number;
}

interface HelpPassage {
  id: string;
  slug: string;
  docTitle: string;
  group: string;
  heading: string;
  anchor: string;
  text: string;
}

/** Markdown to plain prose: drop syntax, keep the words. */
export function markdownToText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/gm, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>|#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function passagesOf(doc: HelpDoc): HelpPassage[] {
  const passages: HelpPassage[] = [];
  let heading = doc.title;
  let anchor = '';
  let buffer: string[] = [];
  let headingIndex = 0;
  let inFence = false;

  const flush = () => {
    const text = markdownToText(buffer.join('\n'));
    if (text) {
      passages.push({
        id: `${doc.slug}#${anchor || '_top'}`,
        slug: doc.slug,
        docTitle: doc.title,
        group: doc.group,
        heading,
        anchor,
        text,
      });
    }
    buffer = [];
  };

  for (const line of doc.body.split('\n')) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (!inFence && /^#{1,6}\s+/.test(line)) {
      flush();
      const next = doc.headings[headingIndex++];
      heading = next?.text ?? line.replace(/^#+\s+/, '');
      anchor = next?.id ?? '';
      continue;
    }
    buffer.push(line);
  }
  flush();
  return passages;
}

let index: MiniSearch<HelpPassage> | null = null;

function getIndex(): MiniSearch<HelpPassage> {
  if (index) return index;
  index = new MiniSearch<HelpPassage>({
    fields: ['heading', 'text', 'docTitle'],
    storeFields: ['slug', 'docTitle', 'group', 'heading', 'anchor', 'text'],
    searchOptions: {
      boost: { heading: 3, docTitle: 2 },
      prefix: true,
      fuzzy: (term) => (term.length > 4 ? 0.2 : false),
      combineWith: 'AND',
    },
  });
  index.addAll(helpDocs.flatMap(passagesOf));
  return index;
}

function snippetFor(text: string, terms: string[], width = 160): string {
  const lower = text.toLowerCase();
  let at = -1;
  for (const term of terms) {
    at = lower.indexOf(term.toLowerCase());
    if (at >= 0) break;
  }
  if (at < 0) return text.length > width ? `${text.slice(0, width).trimEnd()}…` : text;
  const start = Math.max(0, at - Math.floor(width / 3));
  const end = Math.min(text.length, start + width);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

export function searchHelp(query: string, limit = 8): HelpSearchHit[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  return getIndex()
    .search(trimmed)
    .slice(0, limit)
    .map((result) => ({
      id: String(result.id),
      slug: result.slug as string,
      docTitle: result.docTitle as string,
      group: result.group as string,
      heading: result.heading as string,
      anchor: result.anchor as string,
      snippet: snippetFor(result.text as string, result.queryTerms),
      score: result.score,
    }));
}
