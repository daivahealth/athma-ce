/**
 * The manual's parsing rules, after prrapp's help-content-core.ts.
 *
 * The source of truth is docs/help/*.md, one file per module or concept, each
 * opening with a front-matter block. Next.js has no import.meta.glob, so
 * scripts/build-help-content.mjs copies the files into help-docs.generated.ts
 * and this module turns that raw text into pages. Keep it free of React and of
 * browser APIs so the tests can run it as-is.
 */

export interface HelpHeading {
  depth: number;
  text: string;
  id: string;
  /**
   * Screen paths this heading explains, read from the code spans in the
   * heading and its opening paragraph, e.g. **Appointments**
   * (`/scheduling/appointments`). They refine a page match, so the help drawer
   * can open a long page at the one screen the user is looking at.
   */
  routes: string[];
}

export interface HelpDoc {
  slug: string;
  title: string;
  group: string;
  order: number;
  /** Screen paths this file explains, without the locale, matched by prefix. */
  routes: string[];
  description: string;
  body: string;
  headings: HelpHeading[];
}

export const HELP_GROUP_ORDER = [
  'Getting started',
  'Clinical care',
  'Diagnostics and pharmacy',
  'Billing and revenue',
  'Engagement and wellness',
  'Insights',
  'Administration',
  'Reference',
];

type FrontMatterValue = string | number | string[];

function unquote(raw: string): string {
  const value = raw.trim();
  const quoted = /^(['"])(.*)\1$/s.exec(value);
  return quoted ? quoted[2] : value;
}

/** The YAML subset the docs use: quoted or bare scalars, numbers, and flow lists. */
function parseFrontMatterValue(raw: string): FrontMatterValue {
  const value = raw.trim();
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    return inner ? inner.split(',').map(unquote) : [];
  }
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  return unquote(value);
}

export function splitFrontMatter(source: string): { meta: Record<string, FrontMatterValue>; body: string } {
  const normalised = source.replace(/\r\n/g, '\n');
  if (!normalised.startsWith('---\n')) {
    return { meta: {}, body: normalised };
  }
  const end = normalised.indexOf('\n---', 4);
  if (end < 0) {
    return { meta: {}, body: normalised };
  }
  const meta: Record<string, FrontMatterValue> = {};
  for (const line of normalised.slice(4, end).split('\n')) {
    const separator = line.indexOf(':');
    if (separator <= 0) continue;
    meta[line.slice(0, separator).trim()] = parseFrontMatterValue(line.slice(separator + 1));
  }
  const bodyStart = normalised.indexOf('\n', end + 1);
  return { meta, body: bodyStart < 0 ? '' : normalised.slice(bodyStart + 1).replace(/^\n+/, '') };
}

/** Plain text of a heading the way the renderer sees it, so ids match. */
export function headingText(rawHeading: string): string {
  return rawHeading
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/(^|\s)_([^_]+)_(?=\s|$)/g, '$1$2')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .trim();
}

/**
 * GitHub's heading ids: lower-case, punctuation dropped, spaces to hyphens,
 * and a repeat gets -1, -2. One slugger per document; the page's heading list
 * and the rendered headings (help-markdown.tsx) both use it, so they agree.
 */
export function createSlugger(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = text
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '')
      .replace(/\s/g, '-');
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

/**
 * Screen paths written as code spans: `/ot/board` counts, and a placeholder
 * segment such as `{id}` in `/encounters/{id}/triage` stands for any one id.
 */
/** A route as matched: `{id}`-style placeholders become `*`, no trailing slash. */
function normaliseRoute(route: string): string {
  return route.trim().replace(/\{[^}/]+\}/g, '*').replace(/\/+$/, '') || '/';
}

function extractRoutePaths(text: string): string[] {
  const paths: string[] = [];
  for (const match of text.matchAll(/`([^`]+)`/g)) {
    const candidate = normaliseRoute(match[1]);
    if (/^\/[A-Za-z0-9\-_/*]*$/.test(candidate) && candidate.length > 1) {
      paths.push(candidate);
    }
  }
  return paths;
}

export function extractHeadings(body: string): HelpHeading[] {
  const slug = createSlugger();
  const headings: HelpHeading[] = [];
  let inFence = false;
  // Lines still able to contribute routes to the heading just seen: its own
  // line plus its opening paragraph.
  let openParagraph = false;
  let seenText = false;

  for (const line of body.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) {
      const text = headingText(match[2]);
      headings.push({ depth: match[1].length, text, id: slug(text), routes: extractRoutePaths(match[2]) });
      openParagraph = true;
      seenText = false;
      continue;
    }

    if (!openParagraph) continue;
    if (line.trim() === '') {
      if (seenText) openParagraph = false;
      continue;
    }
    seenText = true;
    headings[headings.length - 1].routes.push(...extractRoutePaths(line));
  }

  return headings.map((heading) => ({ ...heading, routes: [...new Set(heading.routes)] }));
}

function toStringArray(value: FrontMatterValue | undefined): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

/** Every manual page from its raw source, keyed by file name, in manual order. */
export function buildHelpDocs(rawDocs: Record<string, string>): HelpDoc[] {
  const docs: HelpDoc[] = [];
  for (const [path, source] of Object.entries(rawDocs)) {
    const slug = path.replace(/^.*\//, '').replace(/\.md$/, '');
    const { meta, body } = splitFrontMatter(source);
    docs.push({
      slug,
      title: String(meta.title ?? slug),
      group: String(meta.group ?? 'Reference'),
      order: typeof meta.order === 'number' ? meta.order : Number.MAX_SAFE_INTEGER,
      routes: toStringArray(meta.routes).map(normaliseRoute),
      description: String(meta.description ?? ''),
      body,
      headings: extractHeadings(body),
    });
  }
  return docs.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

/** The manual's groups in reading order, each with its pages in manual order. */
export function groupHelpDocs(docs: HelpDoc[]): { group: string; docs: HelpDoc[] }[] {
  const seen = new Map<string, HelpDoc[]>();
  for (const doc of docs) {
    const list = seen.get(doc.group) ?? [];
    list.push(doc);
    seen.set(doc.group, list);
  }
  const rank = (group: string) => {
    const index = HELP_GROUP_ORDER.indexOf(group);
    return index < 0 ? HELP_GROUP_ORDER.length : index;
  };
  return [...seen.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]))
    .map(([group, list]) => ({ group, docs: list }));
}

/** Parses a `slug.md#anchor` link as written in the docs (so GitHub renders them too). */
export function parseDocLink(href: string): { slug: string; hash: string } | null {
  const match = /^(?:\.\/)?([a-z0-9-]+)\.md(#[^\s]*)?$/i.exec(href.trim());
  return match ? { slug: match[1], hash: match[2] ?? '' } : null;
}

/** The locale prefix the app serves every screen under, e.g. `/en/patients` → `/patients`. */
export function stripLocale(pathname: string, locale?: string): string {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (locale && (path === `/${locale}` || path.startsWith(`/${locale}/`))) {
    return path.slice(locale.length + 1) || '/';
  }
  return path;
}

/**
 * A route matches its own path and everything below it. A placeholder
 * segment (`{id}` in the docs, stored as an asterisk) stands for one id, so
 * `/encounters/{id}/triage` claims every encounter's triage screen.
 */
export function routeMatches(route: string, path: string): boolean {
  if (route.includes('*')) {
    const routeParts = route.split('/');
    const pathParts = path.split('/');
    return routeParts.length <= pathParts.length && routeParts.every((part, i) => part === '*' || part === pathParts[i]);
  }
  return path === route || path.startsWith(route.endsWith('/') ? route : `${route}/`);
}

export interface HelpForPath {
  primary: HelpDoc | null;
  /** The heading within `primary` that explains this exact screen, if any. */
  heading: HelpHeading | null;
  related: HelpDoc[];
}

/** The most specific heading in one doc that claims this screen. */
export function findHeadingForPath(doc: HelpDoc, path: string): HelpHeading | null {
  let best: { heading: HelpHeading; length: number } | null = null;
  for (const heading of doc.headings) {
    for (const route of heading.routes) {
      if (!routeMatches(route, path)) continue;
      // A heading only refines the match; it never beats the page's own routes.
      if (doc.routes.some((docRoute) => docRoute.length > route.length && routeMatches(docRoute, path))) continue;
      if (!best || route.length > best.length) best = { heading, length: route.length };
    }
  }
  return best?.heading ?? null;
}

/**
 * The doc for a screen (a path without its locale): the one whose most
 * specific route matches wins, so `/revenue-cycle/refunds` gets Billing
 * rather than Revenue cycle, which is then offered as related reading. A
 * heading's routes count too: with one page per module, a screen that sits
 * under another module's path (an encounter's triage, under Patient access's
 * `/encounters`) still opens the page that explains it.
 */
export function findHelpForPath(docs: HelpDoc[], path: string): HelpForPath {
  const matches: { doc: HelpDoc; length: number }[] = [];
  for (const doc of docs) {
    let best = -1;
    for (const route of [...doc.routes, ...doc.headings.flatMap((heading) => heading.routes)]) {
      if (routeMatches(route, path)) best = Math.max(best, route.length);
    }
    if (best >= 0) matches.push({ doc, length: best });
  }
  matches.sort((a, b) => b.length - a.length || a.doc.order - b.doc.order);

  const primary = matches[0]?.doc ?? null;
  return {
    primary,
    heading: primary ? findHeadingForPath(primary, path) : null,
    related: matches.slice(1).map((match) => match.doc),
  };
}

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/** The three set paragraphs, by the bold words that open them. */
const CALLOUTS: Record<string, string> = { 'go to': 'go-to', check: 'check', 'if instead': 'if-instead' };

/** "go-to", "check" or "if-instead" when a paragraph opens with that bold label. */
export function calloutOf(node: unknown): string | undefined {
  const first = (node as HastNode | undefined)?.children?.[0];
  if (first?.type !== 'element' || first.tagName !== 'strong') return undefined;
  const label = (first.children ?? [])
    .map((child) => child.value ?? '')
    .join('')
    .replace(/:\s*$/, '')
    .trim()
    .toLowerCase();
  return CALLOUTS[label];
}

function textOf(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(textOf).join('');
}

/**
 * A rehype plugin giving every heading the id {@link extractHeadings} gave
 * it, in place of rehype-slug (and github-slugger, which is ESM-only and
 * would need jest reconfigured).
 */
export function rehypeHeadingIds() {
  return (tree: HastNode) => {
    const slug = createSlugger();
    const visit = (node: HastNode) => {
      if (node.type === 'element' && node.tagName && /^h[1-6]$/.test(node.tagName)) {
        node.properties = { ...node.properties, id: slug(textOf(node).trim()) };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
