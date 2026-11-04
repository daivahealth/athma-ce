'use client';

import { useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';
import { useDashboardMetrics } from '@/modules/reporting/hooks';
import {
  buildBoard,
  countNeedingAttention,
  DashboardBoard,
} from '@/modules/reporting/components/dashboard/dashboard-board';
import { DashboardForecast } from '@/modules/reporting/components/dashboard/dashboard-forecast';

const currencyLocaleMap: Record<string, string> = {
  AED: 'en-AE',
  INR: 'en-IN',
  USD: 'en-US',
};

/**
 * HealthAI+ dashboard: Today's worklist tiles (prrapp's board), then the
 * forecast and ranked insights from ai-gateway's cached metrics.
 */
export default function DashboardPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'en';
  const { data: currencyConfig } = useResolveConfig('finance.currency');
  const currency =
    typeof currencyConfig?.value === 'string' && currencyConfig.value.trim() ? currencyConfig.value.trim() : 'INR';
  const numberLocale = currencyLocaleMap[currency] ?? 'en-IN';

  const { data: metrics, isLoading, isFetching, refetch, fromCache } = useDashboardMetrics(currency);

  const formatMoney = useCallback(
    (value: number) => {
      // Compact above a lakh so tiles and axes stay short; exact below it.
      if (Math.abs(value) >= 100_000) {
        return new Intl.NumberFormat(numberLocale, {
          style: 'currency',
          currency,
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(value);
      }
      return formatCurrency(value, currency, numberLocale);
    },
    [currency, numberLocale],
  );

  const groups = useMemo(() => buildBoard(metrics, formatMoney), [metrics, formatMoney]);
  const needingAttention = countNeedingAttention(groups);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const updatedAt = metrics.cachedAt
    ? new Date(metrics.cachedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="flex flex-col gap-8 page-transition">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Today</h1>
          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            {today}
            {!isLoading ? (
              needingAttention > 0 ? (
                <>
                  {' · '}
                  <span className="font-medium text-warning">
                    {needingAttention} {needingAttention === 1 ? 'list needs' : 'lists need'} attention
                  </span>
                </>
              ) : (
                <>
                  {' · '}
                  <span className="font-medium text-success">every list is clear</span>
                </>
              )
            ) : null}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {updatedAt ? (
            <span>
              {fromCache ? 'Cached' : 'Live'} · updated {updatedAt}
            </span>
          ) : null}
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-8">
            <RefreshCw className={cn('mr-1 h-3.5 w-3.5', isFetching && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </header>

      <DashboardBoard groups={groups} isLoading={isLoading} locale={locale} />

      <DashboardForecast metrics={metrics} formatMoney={formatMoney} isLoading={isLoading} locale={locale} />
    </div>
  );
}
