import type { BadgeTone } from '@/components/ui/tone-badge';

/**
 * Tinted surfaces per tone, written out in full so Tailwind keeps them. The
 * tone badge colours a word; these colour a node, a card wash, a ring or a
 * bar, so the hero's steps, its cards and the referral's action rows read as
 * one palette.
 */
/** Solid node fill per tone for a step that has happened, written out so Tailwind keeps them. */
export const TONE_SOLID: Record<BadgeTone, string> = {
  sky: 'border-sky-500 bg-sky-500 text-white',
  blue: 'border-blue-600 bg-blue-600 text-white',
  indigo: 'border-indigo-600 bg-indigo-600 text-white',
  violet: 'border-violet-600 bg-violet-600 text-white',
  purple: 'border-purple-600 bg-purple-600 text-white',
  fuchsia: 'border-fuchsia-600 bg-fuchsia-600 text-white',
  teal: 'border-teal-600 bg-teal-600 text-white',
  cyan: 'border-cyan-600 bg-cyan-600 text-white',
  emerald: 'border-emerald-600 bg-emerald-600 text-white',
  green: 'border-green-600 bg-green-600 text-white',
  amber: 'border-amber-500 bg-amber-500 text-white',
  orange: 'border-orange-500 bg-orange-500 text-white',
  red: 'border-red-600 bg-red-600 text-white',
  rose: 'border-rose-600 bg-rose-600 text-white',
  slate: 'border-slate-500 bg-slate-500 text-white',
};

/** The ring around the node the patient is at now. */
export const TONE_RING: Record<BadgeTone, string> = {
  sky: 'ring-sky-200 dark:ring-sky-900/60',
  blue: 'ring-blue-200 dark:ring-blue-900/60',
  indigo: 'ring-indigo-200 dark:ring-indigo-900/60',
  violet: 'ring-violet-200 dark:ring-violet-900/60',
  purple: 'ring-purple-200 dark:ring-purple-900/60',
  fuchsia: 'ring-fuchsia-200 dark:ring-fuchsia-900/60',
  teal: 'ring-teal-200 dark:ring-teal-900/60',
  cyan: 'ring-cyan-200 dark:ring-cyan-900/60',
  emerald: 'ring-emerald-200 dark:ring-emerald-900/60',
  green: 'ring-green-200 dark:ring-green-900/60',
  amber: 'ring-amber-200 dark:ring-amber-900/60',
  orange: 'ring-orange-200 dark:ring-orange-900/60',
  red: 'ring-red-200 dark:ring-red-900/60',
  rose: 'ring-rose-200 dark:ring-rose-900/60',
  slate: 'ring-slate-200 dark:ring-slate-700',
};

/** The label colour of the current step and the callout's edge. */
export const TONE_TEXT: Record<BadgeTone, string> = {
  sky: 'text-sky-700 dark:text-sky-300',
  blue: 'text-blue-700 dark:text-blue-300',
  indigo: 'text-indigo-700 dark:text-indigo-300',
  violet: 'text-violet-700 dark:text-violet-300',
  purple: 'text-purple-700 dark:text-purple-300',
  fuchsia: 'text-fuchsia-700 dark:text-fuchsia-300',
  teal: 'text-teal-700 dark:text-teal-300',
  cyan: 'text-cyan-700 dark:text-cyan-300',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  green: 'text-green-700 dark:text-green-300',
  amber: 'text-amber-700 dark:text-amber-300',
  orange: 'text-orange-700 dark:text-orange-300',
  red: 'text-red-700 dark:text-red-300',
  rose: 'text-rose-700 dark:text-rose-300',
  slate: 'text-slate-600 dark:text-slate-300',
};

/** The soft wash behind the current-position callout and the clock cards. */
export const TONE_WASH: Record<BadgeTone, string> = {
  sky: 'border-sky-200 bg-sky-50 dark:border-sky-800/70 dark:bg-sky-950/40',
  blue: 'border-blue-200 bg-blue-50 dark:border-blue-800/70 dark:bg-blue-950/40',
  indigo: 'border-indigo-200 bg-indigo-50 dark:border-indigo-800/70 dark:bg-indigo-950/40',
  violet: 'border-violet-200 bg-violet-50 dark:border-violet-800/70 dark:bg-violet-950/40',
  purple: 'border-purple-200 bg-purple-50 dark:border-purple-800/70 dark:bg-purple-950/40',
  fuchsia: 'border-fuchsia-200 bg-fuchsia-50 dark:border-fuchsia-800/70 dark:bg-fuchsia-950/40',
  teal: 'border-teal-200 bg-teal-50 dark:border-teal-800/70 dark:bg-teal-950/40',
  cyan: 'border-cyan-200 bg-cyan-50 dark:border-cyan-800/70 dark:bg-cyan-950/40',
  emerald: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/70 dark:bg-emerald-950/40',
  green: 'border-green-200 bg-green-50 dark:border-green-800/70 dark:bg-green-950/40',
  amber: 'border-amber-200 bg-amber-50 dark:border-amber-800/70 dark:bg-amber-950/40',
  orange: 'border-orange-200 bg-orange-50 dark:border-orange-800/70 dark:bg-orange-950/40',
  red: 'border-red-200 bg-red-50 dark:border-red-800/70 dark:bg-red-950/40',
  rose: 'border-rose-200 bg-rose-50 dark:border-rose-800/70 dark:bg-rose-950/40',
  slate: 'border-border bg-muted/40',
};

/** The connector after a node: solid once the step is done, dotted for what is still to come. */
export const TONE_BAR: Record<BadgeTone, string> = {
  sky: 'bg-sky-400',
  blue: 'bg-blue-400',
  indigo: 'bg-indigo-400',
  violet: 'bg-violet-400',
  purple: 'bg-purple-400',
  fuchsia: 'bg-fuchsia-400',
  teal: 'bg-teal-400',
  cyan: 'bg-cyan-400',
  emerald: 'bg-emerald-400',
  green: 'bg-green-400',
  amber: 'bg-amber-400',
  orange: 'bg-orange-400',
  red: 'bg-red-400',
  rose: 'bg-rose-400',
  slate: 'bg-slate-300 dark:bg-slate-600',
};

/**
 * A chart series' stroke and fill per tone: the 600 shade on a light page and
 * the 400 on a dark one, the same pairing as {@link TONE_TEXT}. Written as
 * colour values rather than classes because Recharts draws with SVG
 * attributes, and as literals because Tailwind only emits the theme variables
 * a class uses.
 */
export const TONE_CHART: Record<BadgeTone, { light: string; dark: string }> = {
  sky: { light: 'oklch(58.8% 0.158 241.966)', dark: 'oklch(74.6% 0.16 232.661)' },
  blue: { light: 'oklch(54.6% 0.245 262.881)', dark: 'oklch(70.7% 0.165 254.624)' },
  indigo: { light: 'oklch(51.1% 0.262 276.966)', dark: 'oklch(67.3% 0.182 276.935)' },
  violet: { light: 'oklch(54.1% 0.281 293.009)', dark: 'oklch(70.2% 0.183 293.541)' },
  purple: { light: 'oklch(55.8% 0.288 302.321)', dark: 'oklch(71.4% 0.203 305.504)' },
  fuchsia: { light: 'oklch(59.1% 0.293 322.896)', dark: 'oklch(74% 0.238 322.16)' },
  teal: { light: 'oklch(60% 0.118 184.704)', dark: 'oklch(77.7% 0.152 181.912)' },
  cyan: { light: 'oklch(60.9% 0.126 221.723)', dark: 'oklch(78.9% 0.154 211.53)' },
  emerald: { light: 'oklch(59.6% 0.145 163.225)', dark: 'oklch(76.5% 0.177 163.223)' },
  green: { light: 'oklch(62.7% 0.194 149.214)', dark: 'oklch(79.2% 0.209 151.711)' },
  amber: { light: 'oklch(66.6% 0.179 58.318)', dark: 'oklch(82.8% 0.189 84.429)' },
  orange: { light: 'oklch(64.6% 0.222 41.116)', dark: 'oklch(75% 0.183 55.934)' },
  red: { light: 'oklch(57.7% 0.245 27.325)', dark: 'oklch(70.4% 0.191 22.216)' },
  rose: { light: 'oklch(58.6% 0.253 17.585)', dark: 'oklch(71.2% 0.194 13.428)' },
  slate: { light: 'oklch(44.6% 0.043 257.281)', dark: 'oklch(70.4% 0.04 256.788)' },
};

/**
 * Looks a domain value up in a `<domain>-tone.ts` map, falling back to a
 * deliberate tone (slate unless the map says otherwise) for anything the map
 * does not know yet, so a new backend value renders uncoloured rather than
 * breaking the row.
 */
export function toneOf(
  map: Readonly<Record<string, BadgeTone>>,
  value: string | null | undefined,
  fallback: BadgeTone = 'slate',
): BadgeTone {
  if (!value) return fallback;
  return Object.prototype.hasOwnProperty.call(map, value) ? map[value] : fallback;
}
