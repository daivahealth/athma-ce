'use client';

import { cn } from '@/lib/utils';
import { CATEGORY_ORDER, getCategoryStyle, type TimelineCategory } from '../lib/timeline-category';

export interface TimelineLegendProps {
  /** Only show categories actually present in the current timeline. */
  activeCategories: Set<TimelineCategory>;
}

export function TimelineLegend({ activeCategories }: TimelineLegendProps) {
  const categories = CATEGORY_ORDER.filter((c) => activeCategories.has(c));
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {categories.map((category) => {
        const style = getCategoryStyle(category);
        return (
          <div key={category} className="flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded-full', style.swatch)} />
            <span className="text-xs text-muted-foreground">{style.label}</span>
          </div>
        );
      })}
    </div>
  );
}
