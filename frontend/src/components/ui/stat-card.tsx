'use client';

import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCountUp } from '@/hooks/use-count-up';
import { cn } from '@/lib/utils';

type StatAccent = 'primary' | 'success' | 'warning' | 'info' | 'destructive';

const ACCENT_CLASSES: Record<StatAccent, { icon: string; sparkline: string }> = {
  primary: { icon: 'bg-primary/10 text-primary', sparkline: 'hsl(var(--primary))' },
  success: { icon: 'bg-success/10 text-success', sparkline: 'hsl(var(--success))' },
  warning: { icon: 'bg-warning/10 text-warning', sparkline: 'hsl(var(--warning))' },
  info: { icon: 'bg-info/10 text-info', sparkline: 'hsl(var(--info))' },
  destructive: { icon: 'bg-destructive/10 text-destructive', sparkline: 'hsl(var(--destructive))' },
};

interface StatCardProps {
  label: string;
  /** Numeric value animates via count-up; a string is rendered as-is (no animation). */
  value: number | string;
  icon: LucideIcon;
  /** Formats the animated numeric value, e.g. (n) => n.toFixed(0). Ignored for string values. */
  formatValue?: (value: number) => string;
  delta?: number;
  deltaLabel?: string;
  /** Small trend series for the sparkline, oldest first. */
  trend?: number[];
  accent?: StatAccent;
  loading?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  formatValue = (n) => Math.round(n).toLocaleString(),
  delta,
  deltaLabel,
  trend,
  accent = 'primary',
  loading = false,
  className,
}: StatCardProps) {
  const numericValue = typeof value === 'number' ? value : 0;
  const animated = useCountUp(numericValue);
  const accentClasses = ACCENT_CLASSES[accent];
  const isPositive = (delta ?? 0) >= 0;

  if (loading) {
    return (
      <Card className={cn('p-5', className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-7 w-16" />
          </div>
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
        <Skeleton className="mt-4 h-8 w-full" />
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {typeof value === 'number' ? formatValue(animated) : value}
          </p>
          {delta !== undefined && (
            <div className="space-y-0.5">
              <div
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-medium',
                  isPositive ? 'text-success' : 'text-destructive',
                )}
              >
                {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span>{Math.abs(delta).toFixed(1)}%</span>
              </div>
              {deltaLabel && <p className="text-[11px] text-muted-foreground">{deltaLabel}</p>}
            </div>
          )}
        </div>
        <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', accentClasses.icon)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>

      {trend && trend.length > 1 && (
        <div className="-mx-1 -mb-1 mt-3 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 4, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id={`stat-sparkline-${label.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentClasses.sparkline} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={accentClasses.sparkline} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={accentClasses.sparkline}
                strokeWidth={1.75}
                fill={`url(#stat-sparkline-${label.replace(/\s+/g, '-')})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
