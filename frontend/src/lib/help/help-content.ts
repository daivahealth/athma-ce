import {
  buildHelpDocs,
  findHelpForPath,
  groupHelpDocs,
  stripLocale,
  type HelpDoc,
  type HelpForPath,
} from '@/lib/help/help-content-core';
import { rawHelpDocs } from '@/lib/help/help-docs.generated';

/**
 * The in-app manual: docs/help/*.md, bundled by scripts/build-help-content.mjs
 * and parsed by help-content-core.ts. Only the help surfaces import this, so
 * the manual's text stays out of every other page's bundle.
 */

export type { HelpDoc, HelpHeading, HelpForPath } from '@/lib/help/help-content-core';
export { HELP_GROUP_ORDER, calloutOf, parseDocLink, rehypeHeadingIds } from '@/lib/help/help-content-core';

export const helpDocs: HelpDoc[] = buildHelpDocs(rawHelpDocs);

const docsBySlug = new Map(helpDocs.map((doc) => [doc.slug, doc]));

export function getHelpDoc(slug: string | undefined): HelpDoc | undefined {
  return slug ? docsBySlug.get(slug) : undefined;
}

export function getHelpGroups(): { group: string; docs: HelpDoc[] }[] {
  return groupHelpDocs(helpDocs);
}

export function getAdjacentDocs(slug: string): { previous?: HelpDoc; next?: HelpDoc } {
  const index = helpDocs.findIndex((doc) => doc.slug === slug);
  if (index < 0) return {};
  return { previous: helpDocs[index - 1], next: helpDocs[index + 1] };
}

/** The page for the screen at `pathname` (with its locale prefix, as the router reports it). */
export function helpForPathname(pathname: string, locale: string): HelpForPath {
  return findHelpForPath(helpDocs, stripLocale(pathname, locale));
}

export function helpDocPath(locale: string, slug: string, hash = ''): string {
  return `/${locale}/help/${slug}${hash}`;
}

export function helpIndexPath(locale: string): string {
  return `/${locale}/help`;
}
