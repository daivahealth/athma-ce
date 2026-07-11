'use client';

import { cn } from '@/lib/utils';

export function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground truncate">{label}</p>
      <p className="text-sm font-semibold text-foreground truncate">{value}</p>
    </div>
  );
}

export interface ProgressBarProps {
  /** 0-100 */
  percent: number;
  colorClass: string;
  label?: string;
}

export function ProgressBar({ percent, colorClass, label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="w-full">
      {label && <p className="text-[10px] font-medium text-muted-foreground mb-1">{label}</p>}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', colorClass)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
