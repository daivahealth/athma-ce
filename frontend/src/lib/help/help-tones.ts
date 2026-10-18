import {
  BookMarkedIcon,
  FlaskConical,
  HeartPulse,
  LibraryIcon,
  LineChart,
  ReceiptText,
  RocketIcon,
  Settings,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';

/**
 * The Help Centre's colours, after prrapp's help-tones.ts: each group of the
 * manual has its own, so a reader can tell a clinical page from a billing or
 * an admin one at a glance, on the index, in the contents and in the drawer.
 */
export type HelpTone = 'emerald' | 'blue' | 'violet' | 'amber' | 'rose' | 'cyan' | 'orange' | 'teal' | 'slate';

interface ToneClasses {
  /** The card's leading edge. */
  edge: string;
  /** The right-hand edge, for "Next". */
  edgeRight: string;
  /** The left border of the open heading in the contents. */
  border: string;
  /** The round chip behind an icon. */
  chip: string;
  /** A tinted panel: the page header, the open page in the contents. */
  panel: string;
  /** A tinted card's hover. */
  hover: string;
  /** A bullet or a small mark. */
  dot: string;
  /** Text in the tone, e.g. the group name over a card. */
  text: string;
  /** The tone as a colour (Tailwind's 500), for the prose accents (`--help-accent`). */
  accent: string;
}

/** Written out in full so Tailwind generates every class. */
export const HELP_TONE: Record<HelpTone, ToneClasses> = {
  emerald: {
    edge: 'border-l-emerald-500',
    edgeRight: 'border-r-emerald-500',
    border: 'border-emerald-500',
    chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
    panel: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/70 dark:bg-emerald-950/40',
    hover: 'hover:border-emerald-300 hover:bg-emerald-50/70 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
    accent: '#10b981',
  },
  blue: {
    edge: 'border-l-blue-500',
    edgeRight: 'border-r-blue-500',
    border: 'border-blue-500',
    chip: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300',
    panel: 'border-blue-200 bg-blue-50 dark:border-blue-800/70 dark:bg-blue-950/40',
    hover: 'hover:border-blue-300 hover:bg-blue-50/70 dark:hover:border-blue-700 dark:hover:bg-blue-950/30',
    dot: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-300',
    accent: '#3b82f6',
  },
  violet: {
    edge: 'border-l-violet-500',
    edgeRight: 'border-r-violet-500',
    border: 'border-violet-500',
    chip: 'bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300',
    panel: 'border-violet-200 bg-violet-50 dark:border-violet-800/70 dark:bg-violet-950/40',
    hover: 'hover:border-violet-300 hover:bg-violet-50/70 dark:hover:border-violet-700 dark:hover:bg-violet-950/30',
    dot: 'bg-violet-500',
    text: 'text-violet-700 dark:text-violet-300',
    accent: '#8b5cf6',
  },
  amber: {
    edge: 'border-l-amber-500',
    edgeRight: 'border-r-amber-500',
    border: 'border-amber-500',
    chip: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
    panel: 'border-amber-200 bg-amber-50 dark:border-amber-800/70 dark:bg-amber-950/40',
    hover: 'hover:border-amber-300 hover:bg-amber-50/70 dark:hover:border-amber-700 dark:hover:bg-amber-950/30',
    dot: 'bg-amber-500',
    text: 'text-amber-800 dark:text-amber-300',
    accent: '#f59e0b',
  },
  rose: {
    edge: 'border-l-rose-500',
    edgeRight: 'border-r-rose-500',
    border: 'border-rose-500',
    chip: 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300',
    panel: 'border-rose-200 bg-rose-50 dark:border-rose-800/70 dark:bg-rose-950/40',
    hover: 'hover:border-rose-300 hover:bg-rose-50/70 dark:hover:border-rose-700 dark:hover:bg-rose-950/30',
    dot: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-300',
    accent: '#f43f5e',
  },
  cyan: {
    edge: 'border-l-cyan-500',
    edgeRight: 'border-r-cyan-500',
    border: 'border-cyan-500',
    chip: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300',
    panel: 'border-cyan-200 bg-cyan-50 dark:border-cyan-800/70 dark:bg-cyan-950/40',
    hover: 'hover:border-cyan-300 hover:bg-cyan-50/70 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30',
    dot: 'bg-cyan-500',
    text: 'text-cyan-700 dark:text-cyan-300',
    accent: '#06b6d4',
  },
  orange: {
    edge: 'border-l-orange-500',
    edgeRight: 'border-r-orange-500',
    border: 'border-orange-500',
    chip: 'bg-orange-100 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300',
    panel: 'border-orange-200 bg-orange-50 dark:border-orange-800/70 dark:bg-orange-950/40',
    hover: 'hover:border-orange-300 hover:bg-orange-50/70 dark:hover:border-orange-700 dark:hover:bg-orange-950/30',
    dot: 'bg-orange-500',
    text: 'text-orange-700 dark:text-orange-300',
    accent: '#f97316',
  },
  teal: {
    edge: 'border-l-teal-500',
    edgeRight: 'border-r-teal-500',
    border: 'border-teal-500',
    chip: 'bg-teal-100 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300',
    panel: 'border-teal-200 bg-teal-50 dark:border-teal-800/70 dark:bg-teal-950/40',
    hover: 'hover:border-teal-300 hover:bg-teal-50/70 dark:hover:border-teal-700 dark:hover:bg-teal-950/30',
    dot: 'bg-teal-500',
    text: 'text-teal-700 dark:text-teal-300',
    accent: '#14b8a6',
  },
  slate: {
    edge: 'border-l-slate-500',
    edgeRight: 'border-r-slate-500',
    border: 'border-slate-500',
    chip: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    panel: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60',
    hover: 'hover:border-slate-300 hover:bg-slate-50/70 dark:hover:border-slate-600 dark:hover:bg-slate-900/40',
    dot: 'bg-slate-500',
    text: 'text-slate-700 dark:text-slate-300',
    accent: '#64748b',
  },
};

export interface HelpGroupStyle {
  tone: HelpTone;
  icon: LucideIcon;
  /** One line under the group's heading on the index: what its pages are for. */
  blurb: string;
}

const GROUP_STYLE: Record<string, HelpGroupStyle> = {
  'Getting started': { tone: 'emerald', icon: RocketIcon, blurb: 'Signing in, finding your way, and getting help on any screen.' },
  'Clinical care': { tone: 'blue', icon: Stethoscope, blurb: 'Registering patients, visits, charting, wards, theatre and oncology.' },
  'Diagnostics and pharmacy': { tone: 'violet', icon: FlaskConical, blurb: 'Lab samples and results, imaging and procedure reports, dispensing.' },
  'Billing and revenue': { tone: 'amber', icon: ReceiptText, blurb: 'Invoices and receipts, claims to payers, and the price lists behind them.' },
  'Engagement and wellness': { tone: 'rose', icon: HeartPulse, blurb: 'Wellness programmes, memberships and keeping in touch with patients.' },
  Insights: { tone: 'cyan', icon: LineChart, blurb: 'Building reports and searching across clinical records.' },
  Administration: { tone: 'orange', icon: Settings, blurb: 'Facilities, users and roles, catalogues and configuration.' },
  Reference: { tone: 'teal', icon: LibraryIcon, blurb: 'The terms the screens use.' },
};

const OTHER_GROUP: HelpGroupStyle = { tone: 'slate', icon: BookMarkedIcon, blurb: '' };

/** A group's colour, icon and blurb; a group not listed is slate. */
export function helpGroupStyle(group: string): HelpGroupStyle {
  return GROUP_STYLE[group] ?? OTHER_GROUP;
}

/** A page's colour: its group's. */
export function helpDocTone(doc: { group: string }): HelpTone {
  return helpGroupStyle(doc.group).tone;
}
