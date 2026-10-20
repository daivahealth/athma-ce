import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

import {
  HELP_GROUP_ORDER,
  buildHelpDocs,
  extractHeadings,
  findHelpForPath,
  parseDocLink,
  routeMatches,
  stripLocale,
} from '@/lib/help/help-content-core';
import { helpDocs } from '@/lib/help/help-content';
import { searchHelp } from '@/lib/help/help-search';

const page = (front: string, body: string) => `---\n${front}\n---\n\n${body}`;

describe('help content parsing', () => {
  it('reads front matter, flow lists and the body', () => {
    const [doc] = buildHelpDocs({
      'docs/help/billing.md': page(
        "title: 'Billing'\ngroup: 'Billing and revenue'\norder: 100\nroutes: ['/invoices', '/receipts/']\ndescription: 'Invoices.'",
        '## Invoices\n\nText.'
      ),
    });
    expect(doc).toMatchObject({
      slug: 'billing',
      title: 'Billing',
      group: 'Billing and revenue',
      order: 100,
      routes: ['/invoices', '/receipts'],
      description: 'Invoices.',
    });
    expect(doc.body.startsWith('## Invoices')).toBe(true);
  });

  it('gives headings GitHub-style ids, de-duplicated, and reads their screen paths', () => {
    const headings = extractHeadings(
      '## **Appointments** (`/scheduling/appointments`)\n\nOpen one (`/scheduling/appointments/{id}`).\n\n## Notes\n\n## Notes\n\n```\n## not a heading\n```'
    );
    expect(headings.map((heading) => heading.id)).toEqual(['appointments-schedulingappointments', 'notes', 'notes-1']);
    expect(headings[0].routes).toEqual(['/scheduling/appointments', '/scheduling/appointments/*']);
  });

  it('parses doc links written for GitHub', () => {
    expect(parseDocLink('patient-access.md#appointments')).toEqual({ slug: 'patient-access', hash: '#appointments' });
    expect(parseDocLink('./glossary.md')).toEqual({ slug: 'glossary', hash: '' });
    expect(parseDocLink('/patients')).toBeNull();
  });
});

describe('matching a screen to its page', () => {
  it('matches by whole path segment, with {id} placeholders', () => {
    expect(routeMatches('/patients', '/patients/123/edit')).toBe(true);
    expect(routeMatches('/patients', '/patients-ai/123')).toBe(false);
    expect(routeMatches('/encounters/*/triage', '/encounters/abc/triage')).toBe(true);
    expect(routeMatches('/encounters/*/triage', '/encounters/abc/charting')).toBe(false);
  });

  it('strips the locale the app serves every screen under', () => {
    expect(stripLocale('/en/patients/', 'en')).toBe('/patients');
    expect(stripLocale('/en', 'en')).toBe('/');
  });

  it('lets the most specific route win, headings included', () => {
    const docs = buildHelpDocs({
      'access.md': page("title: 'Access'\norder: 1\nroutes: ['/encounters']", '## Encounters (`/encounters`)'),
      'charting.md': page("title: 'Charting'\norder: 2\nroutes: ['/charting']", '## Triage (`/encounters/{id}/triage`)'),
    });
    const triage = findHelpForPath(docs, '/encounters/42/triage');
    expect(triage.primary?.slug).toBe('charting');
    expect(triage.heading?.text).toBe('Triage (/encounters/{id}/triage)');
    expect(triage.related.map((doc) => doc.slug)).toEqual(['access']);
    expect(findHelpForPath(docs, '/encounters').primary?.slug).toBe('access');
    expect(findHelpForPath(docs, '/nowhere').primary).toBeNull();
  });
});

describe('the manual in docs/help', () => {
  const slugs = new Set(helpDocs.map((doc) => doc.slug));

  it('is bundled up to date (run `npm run help:build` after editing docs/help)', () => {
    expect(() =>
      execFileSync('node', [join(__dirname, '../../../scripts/build-help-content.mjs'), '--check'], { stdio: 'pipe' })
    ).not.toThrow();
  });

  it('gives every page a title, a known group and a description', () => {
    for (const doc of helpDocs) {
      expect({ slug: doc.slug, title: doc.title !== doc.slug }).toEqual({ slug: doc.slug, title: true });
      expect({ slug: doc.slug, group: HELP_GROUP_ORDER.includes(doc.group) }).toEqual({ slug: doc.slug, group: true });
      expect({ slug: doc.slug, description: doc.description.length > 0 }).toEqual({ slug: doc.slug, description: true });
    }
  });

  it('only links to pages and headings that exist', () => {
    const broken: string[] = [];
    for (const doc of helpDocs) {
      for (const match of doc.body.matchAll(/\]\(([^)\s]+)\)/g)) {
        const link = parseDocLink(match[1]);
        if (!link) continue;
        const target = helpDocs.find((candidate) => candidate.slug === link.slug);
        const anchor = link.hash.slice(1);
        if (!slugs.has(link.slug) || (anchor && !target?.headings.some((heading) => heading.id === anchor))) {
          broken.push(`${doc.slug} → ${match[1]}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('finds a page by full-text search', () => {
    if (helpDocs.length === 0) return;
    const word = helpDocs[0].title.split(' ')[0];
    expect(searchHelp(word).length).toBeGreaterThan(0);
  });
});
