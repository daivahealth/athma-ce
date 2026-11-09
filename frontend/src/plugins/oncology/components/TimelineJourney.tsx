'use client';

import { cn } from '@/lib/utils';
import type { JourneyLayout, JourneyPoint, JourneySpan } from '../lib/timeline-journey';
import { getCategoryStyle } from '../lib/timeline-category';

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function Point({ item, onSelect }: { item: JourneyPoint; onSelect: (anchorId: string) => void }) {
  const style = getCategoryStyle(item.category);
  const label = `${item.title} — ${formatDay(item.date)}`;
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={() => onSelect(item.anchorId)}
      style={{ left: `${item.at}%` }}
      className={cn(
        'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow-sm transition-transform',
        'hover:scale-125 focus-visible:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        style.swatch,
        item.milestone
          ? 'h-4 w-4 ring-2 ring-offset-1 ring-offset-background ring-current'
          : 'h-3 w-3',
        item.milestone && style.iconColor,
        item.warning && 'ring-2 ring-amber-400 ring-offset-1 ring-offset-background',
      )}
    />
  );
}

function Span({ item, onSelect }: { item: JourneySpan; onSelect: (anchorId: string) => void }) {
  const style = getCategoryStyle(item.category);
  const width = Math.max(item.to - item.from, 0.8);
  const label = `${item.title} — ${formatDay(item.startDate)} to ${formatDay(item.endDate)}`;
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={() => onSelect(item.anchorId)}
      style={{ left: `${item.from}%`, width: `${width}%` }}
      className={cn(
        'group/span absolute top-1/2 h-4 -translate-y-1/2 rounded-full transition-shadow',
        'hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      <span
        className={cn(
          'absolute inset-0 rounded-full opacity-25 group-hover/span:opacity-40',
          style.swatch,
        )}
      />
      <span className={cn('absolute inset-y-0 left-0 w-1 rounded-l-full', style.swatch)} />
      <span className={cn('absolute inset-y-0 right-0 w-1 rounded-r-full', style.swatch)} />
      {item.ticks.map((t, i) => (
        <span
          key={i}
          title={t.title}
          className={cn(
            'absolute top-1/2 h-2.5 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full',
            t.warning ? 'bg-amber-500' : style.swatch,
          )}
          style={{ left: `${width > 0 ? ((t.at - item.from) / width) * 100 : 50}%` }}
        />
      ))}
    </button>
  );
}

export interface TimelineJourneyProps {
  layout: JourneyLayout;
  /** Scrolls the feed to the event or course with this anchor id. */
  onSelect: (anchorId: string) => void;
}

/** Swimlane overview of the whole journey on one time axis, with today marked. */
export function TimelineJourney({ layout, onSelect }: TimelineJourneyProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="relative grid grid-cols-[9.5rem_1fr]">
          {/* Lane labels and rows */}
          {layout.lanes.map((lane, i) => (
            <div key={lane.key} className="contents">
              <div
                className={cn(
                  'flex h-10 items-center pr-3 text-xs font-medium text-muted-foreground',
                  i % 2 === 0 && 'bg-muted/30',
                  'rounded-l-md pl-3',
                )}
              >
                {lane.label}
              </div>
              <div className={cn('relative h-10', i % 2 === 0 && 'bg-muted/30', 'rounded-r-md')}>
                {lane.items.map((item) =>
                  item.kind === 'span' ? (
                    <Span key={item.id} item={item} onSelect={onSelect} />
                  ) : (
                    <Point key={item.id} item={item} onSelect={onSelect} />
                  ),
                )}
              </div>
            </div>
          ))}

          {/* Month grid and today line, over the track column only */}
          <div
            className="pointer-events-none absolute inset-y-0 left-[9.5rem] right-0"
            aria-hidden="true"
          >
            {layout.ticks.map((t) => (
              <div
                key={`${t.label}-${t.at}`}
                className={cn(
                  'absolute inset-y-0 w-px',
                  t.yearStart ? 'bg-border' : 'bg-border/50',
                )}
                style={{ left: `${t.at}%` }}
              />
            ))}
            <div
              className="absolute inset-y-0 w-0 border-l-2 border-dashed border-primary/60"
              style={{ left: `${layout.todayAt}%` }}
            />
          </div>
        </div>

        {/* Axis */}
        <div className="relative ml-[9.5rem] mt-1 h-6 text-[11px] text-muted-foreground">
          {/* Labels under the Today pill are left out so the two don't overlap. */}
          {layout.ticks
            .filter((t) => Math.abs(t.at - layout.todayAt) > 6)
            .map((t) => (
              <span
                key={`${t.label}-${t.at}`}
                className={cn(
                  'absolute -translate-x-1/2 whitespace-nowrap',
                  t.yearStart && 'font-semibold text-foreground',
                )}
                style={{ left: `${t.at}%` }}
              >
                {t.label}
              </span>
            ))}
          <span
            className="absolute -top-0.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground"
            style={{ left: `${Math.min(layout.todayAt, 97)}%` }}
          >
            Today
          </span>
        </div>
      </div>
    </div>
  );
}
