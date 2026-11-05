'use client';

import { Suspense, useCallback, useMemo } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatCurrency } from '@/lib/utils';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';
import { useDashboardMetrics } from '@/modules/reporting/hooks';
import {
  buildBoard,
  countNeedingAttention,
  DashboardBoard,
} from '@/modules/reporting/components/dashboard/dashboard-board';
import { DashboardForecast } from '@/modules/reporting/components/dashboard/dashboard-forecast';
import { DashboardTrendsView } from '@/modules/reporting/components/dashboard/dashboard-trends-view';
import {
  formatPeriodParam,
  parseDashboardView,
  parsePeriodParam,
  type DashboardPeriod,
  type DashboardView,
} from '@/modules/reporting/lib/dashboard-periods';

const currencyLocaleMap: Record<string, string> = {
  AED: 'en-AE',
  INR: 'en-IN',
  USD: 'en-US',
};

const TAB_LABELS: Record<DashboardView, string> = { today: 'Today', week: 'Week', month: 'Month' };

/**
 * HealthAI+ dashboard: Today's worklist tiles (prrapp's board) with the
 * forecast and ranked insights, or the Week and Month trends
 * (`?view=week|month&period=…`), all from ai-gateway's cached metrics.
 */
function Dashboard() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'en';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = parseDashboardView(searchParams.get('view'));

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

  // The server's "today" when the history has it, so periods match the figures.
  const todayIso = metrics.trends?.days.at(-1) ?? new Date().toISOString().slice(0, 10);
  const period =
    view === 'today' ? null : parsePeriodParam(view, searchParams.get('period'), todayIso);

  const setQuery = (next: { view?: DashboardView; period?: DashboardPeriod | null }) => {
    const query = new URLSearchParams(searchParams.toString());
    if (next.view !== undefined) {
      // Moving between views drops the period: a week and a month are written differently.
      query.delete('period');
      if (next.view === 'today') query.delete('view');
      else query.set('view', next.view);
    }
    if (next.period) query.set('period', formatPeriodParam(next.period));
    const search = query.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

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
    <Tabs
      value={view}
      onValueChange={(value) => setQuery({ view: parseDashboardView(value) })}
      className="flex flex-col gap-6 page-transition"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList aria-label="Dashboard view">
          {(Object.keys(TAB_LABELS) as DashboardView[]).map((key) => (
            <TabsTrigger key={key} value={key} className="px-4">
              {TAB_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>
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
      </div>

      <TabsContent value="today" className="mt-0 flex flex-col gap-8">
        <header>
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
        </header>

        <DashboardBoard groups={groups} isLoading={isLoading} locale={locale} />

        <DashboardForecast metrics={metrics} formatMoney={formatMoney} isLoading={isLoading} locale={locale} />
      </TabsContent>

      {(['week', 'month'] as const).map((key) => (
        <TabsContent key={key} value={key} className="mt-0">
          {view === key && period ? (
            <DashboardTrendsView
              view={key}
              period={period}
              onPeriodChange={(next) => setQuery({ period: next })}
              metrics={metrics}
              isLoading={isLoading}
              formatMoney={formatMoney}
              locale={locale}
            />
          ) : null}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function DashboardFallback() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading the dashboard">
      <Skeleton className="h-9 w-56" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // useSearchParams needs a Suspense boundary so the rest of the route can prerender (Next 16).
  return (
    <Suspense fallback={<DashboardFallback />}>
      <Dashboard />
    </Suspense>
  );
}
