import {
  Stethoscope, Activity, ClipboardList, CheckCircle2, FlaskConical, Zap,
  Scissors, LineChart, CalendarCheck2, StickyNote, type LucideIcon,
} from 'lucide-react';
import type { CancerTimelineEvent, TimelineEventType } from '../types';

/**
 * High-level clinical category a timeline event belongs to. Multiple
 * `TimelineEventType` values (e.g. all `chemo_*` states) roll up into one
 * category so the timeline can color-code and group by treatment modality
 * rather than by fine-grained lifecycle state.
 *
 * 'surgery' has no corresponding TimelineEventType (the backend has no
 * surgical-order workflow yet) - a manual/custom event can still be tagged
 * `metadata.category = 'surgery'` at creation time (see the "Add Event"
 * dialog), which `getEventCategory` below honors.
 */
export type TimelineCategory =
  | 'diagnosis' | 'staging' | 'tumor_board' | 'care_plan'
  | 'chemotherapy' | 'radiation' | 'surgery'
  | 'response' | 'follow_up' | 'custom';

export interface CategoryStyle {
  category: TimelineCategory;
  label: string;
  icon: LucideIcon;
  /** Tailwind classes for the small icon avatar on the timeline spine. */
  dot: string;
  /** Left accent border + card background wash. */
  border: string;
  /** Full-border variant of `border` color, for circular icon avatars. */
  ring: string;
  bg: string;
  /** Type badge. */
  badge: string;
  /** Solid swatch used in the legend and group-header accent bar. */
  swatch: string;
  iconColor: string;
}

const STYLES: Record<TimelineCategory, Omit<CategoryStyle, 'category' | 'label' | 'icon'>> = {
  diagnosis: {
    dot: 'bg-rose-500 border-rose-500',
    border: 'border-l-rose-400',
    ring: 'border-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    swatch: 'bg-rose-500',
    iconColor: 'text-rose-500',
  },
  staging: {
    dot: 'bg-purple-500 border-purple-500',
    border: 'border-l-purple-400',
    ring: 'border-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    swatch: 'bg-purple-500',
    iconColor: 'text-purple-500',
  },
  tumor_board: {
    dot: 'bg-indigo-500 border-indigo-500',
    border: 'border-l-indigo-400',
    ring: 'border-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    swatch: 'bg-indigo-500',
    iconColor: 'text-indigo-500',
  },
  care_plan: {
    dot: 'bg-sky-500 border-sky-500',
    border: 'border-l-sky-400',
    ring: 'border-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/20',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    swatch: 'bg-sky-500',
    iconColor: 'text-sky-500',
  },
  chemotherapy: {
    dot: 'bg-blue-500 border-blue-500',
    border: 'border-l-blue-400',
    ring: 'border-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    swatch: 'bg-blue-500',
    iconColor: 'text-blue-500',
  },
  radiation: {
    dot: 'bg-amber-600 border-amber-600',
    border: 'border-l-amber-500',
    ring: 'border-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    swatch: 'bg-amber-600',
    iconColor: 'text-amber-600',
  },
  surgery: {
    dot: 'bg-emerald-600 border-emerald-600',
    border: 'border-l-emerald-500',
    ring: 'border-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    swatch: 'bg-emerald-600',
    iconColor: 'text-emerald-600',
  },
  response: {
    dot: 'bg-cyan-500 border-cyan-500',
    border: 'border-l-cyan-400',
    ring: 'border-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/20',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    swatch: 'bg-cyan-500',
    iconColor: 'text-cyan-500',
  },
  follow_up: {
    dot: 'bg-lime-500 border-lime-500',
    border: 'border-l-lime-400',
    ring: 'border-lime-400',
    bg: 'bg-lime-50 dark:bg-lime-950/20',
    badge: 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
    swatch: 'bg-lime-500',
    iconColor: 'text-lime-600',
  },
  custom: {
    dot: 'bg-gray-400 border-gray-400',
    border: 'border-l-gray-300',
    ring: 'border-gray-300',
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    swatch: 'bg-gray-400',
    iconColor: 'text-gray-400',
  },
};

const ICONS: Record<TimelineCategory, LucideIcon> = {
  diagnosis: Stethoscope,
  staging: Activity,
  tumor_board: ClipboardList,
  care_plan: CheckCircle2,
  chemotherapy: FlaskConical,
  radiation: Zap,
  surgery: Scissors,
  response: LineChart,
  follow_up: CalendarCheck2,
  custom: StickyNote,
};

const LABELS: Record<TimelineCategory, string> = {
  diagnosis: 'Diagnosis',
  staging: 'Staging',
  tumor_board: 'Tumor Board',
  care_plan: 'Care Plan',
  chemotherapy: 'Chemotherapy',
  radiation: 'Radiation',
  surgery: 'Surgery',
  response: 'Response',
  follow_up: 'Follow-up',
  custom: 'Note',
};

/** Maps a raw event type (or a bare category string, for forward-compat) to its category. */
export function getCategory(type: TimelineEventType | string): TimelineCategory {
  if (type === 'diagnosis') return 'diagnosis';
  if (type === 'staging') return 'staging';
  if (type === 'tumor_board' || type === 'tumor_board_decision') return 'tumor_board';
  if (type.startsWith('care_plan')) return 'care_plan';
  if (type.startsWith('chemo')) return 'chemotherapy';
  if (type.startsWith('radiation') || type === 'simulation') return 'radiation';
  if (type.startsWith('surgery') || type.startsWith('surgical')) return 'surgery';
  if (type === 'response_assessment') return 'response';
  if (type === 'follow_up') return 'follow_up';
  return 'custom';
}

export function getCategoryStyle(type: TimelineEventType | string): CategoryStyle {
  const category = getCategory(type);
  return { category, label: LABELS[category], icon: ICONS[category], ...STYLES[category] };
}

const ALL_CATEGORIES = new Set<string>(Object.keys(LABELS));

/** Honors an explicit `metadata.category` tag (set on manual events) before falling back to event_type. */
export function getEventCategory(event: CancerTimelineEvent): TimelineCategory {
  const tagged = event.metadata?.category;
  if (typeof tagged === 'string' && ALL_CATEGORIES.has(tagged)) return tagged as TimelineCategory;
  return getCategory(event.event_type);
}

export function getEventCategoryStyle(event: CancerTimelineEvent): CategoryStyle {
  const category = getEventCategory(event);
  return { category, label: LABELS[category], icon: ICONS[category], ...STYLES[category] };
}

export const EVENT_TYPE_LABELS: Record<TimelineEventType, string> = {
  diagnosis: 'Diagnosis',
  staging: 'Staging',
  tumor_board: 'Tumor Board',
  tumor_board_decision: 'MDT Decision',
  care_plan_created: 'Care Plan Created',
  care_plan_approved: 'Care Plan Approved',
  chemo_ordered: 'Chemo Ordered',
  chemo_approved: 'Chemo Approved',
  chemo_started: 'Chemo Administered',
  chemo_completed: 'Chemo Completed',
  chemo_held: 'Chemo Held',
  chemo_cancelled: 'Chemo Cancelled',
  radiation_prescribed: 'Radiation Prescribed',
  radiation_started: 'Radiation Started',
  radiation_completed: 'Radiation Completed',
  simulation: 'CT Simulation',
  response_assessment: 'Response Assessment',
  follow_up: 'Follow-up',
  custom: 'Note',
};

export function getEventLabel(type: TimelineEventType): string {
  return EVENT_TYPE_LABELS[type] ?? type;
}

/** All categories, in the order they should appear in a legend. */
export const CATEGORY_ORDER: TimelineCategory[] = [
  'diagnosis', 'staging', 'tumor_board', 'care_plan',
  'chemotherapy', 'radiation', 'surgery', 'response', 'follow_up', 'custom',
];
