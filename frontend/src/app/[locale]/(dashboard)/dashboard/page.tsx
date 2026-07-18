'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton, StatRowSkeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { cn, formatCurrency } from '@/lib/utils';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';
import { useDashboardMetrics } from '@/modules/reporting/hooks';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarCheck,
  Clock,
  ReceiptText,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const currencyLocaleMap: Record<string, string> = {
  AED: 'en-AE',
  INR: 'en-IN',
  USD: 'en-US',
};

function SnapshotSkeleton() {
  return (
    <div className="rounded-lg border border-dashed border-border/80 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="mt-1 h-6 w-24" />
      <Skeleton className="mt-1 h-3 w-16" />
    </div>
  );
}

export default function DashboardPage() {
  const { data: currencyConfig } = useResolveConfig('finance.currency');
  const resolvedCurrency =
    typeof currencyConfig?.value === 'string' && currencyConfig.value.trim()
      ? currencyConfig.value.trim()
      : 'INR';
  const resolvedLocale = currencyLocaleMap[resolvedCurrency] ?? 'en-IN';

  // Fetch real metrics from Report Builder (cached)
  const { data: metrics, isLoading, refetch, fromCache } = useDashboardMetrics(resolvedCurrency);

  // Format the cached timestamp for display
  const cachedTimeDisplay = useMemo(() => {
    if (!metrics.cachedAt) return null;
    try {
      const cachedDate = new Date(metrics.cachedAt);
      return cachedDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch {
      return null;
    }
  }, [metrics.cachedAt]);

  // Utilization Snapshots - derived from real data
  const utilizationSnapshots = useMemo(() => [
    {
      label: 'Completion Rate',
      value: `${metrics.appointmentCompletionRate.toFixed(0)}%`,
      context: `${metrics.completedAppointments}/${metrics.appointmentsToday} appointments`,
      icon: Activity,
    },
    {
      label: 'Encounters Today',
      value: metrics.encountersToday.toString(),
      context: 'Real-time count',
      icon: Clock,
    },
    {
      label: 'Revenue (MTD)',
      value: formatCurrency(metrics.revenueMTD, resolvedCurrency, resolvedLocale),
      context: 'Current month total',
      icon: BarChart3,
    },
  ], [metrics, resolvedCurrency, resolvedLocale]);

  // Risk Signals - derived from real data
  const riskSignals = useMemo(() => {
    const signals = [];

    if (metrics.overdueInvoices > 0) {
      signals.push({
        label: 'Overdue Invoices',
        severity: metrics.overdueInvoices > 10 ? 'high' : 'moderate',
        description: `${metrics.overdueInvoices} invoices are overdue more than 30 days. Consider sending reminders.`,
      });
    }

    if (metrics.unpaidInvoices > 0) {
      signals.push({
        label: 'Unpaid Balance',
        severity: metrics.unpaidInvoices > 20 ? 'high' : 'moderate',
        description: `${metrics.unpaidInvoices} unpaid invoices totaling ${formatCurrency(metrics.unpaidAmount, resolvedCurrency, resolvedLocale)}.`,
      });
    }

    if (metrics.appointmentCompletionRate < 80 && metrics.appointmentsToday > 0) {
      signals.push({
        label: 'Low Completion Rate',
        severity: metrics.appointmentCompletionRate < 60 ? 'high' : 'moderate',
        description: `Appointment completion rate is ${metrics.appointmentCompletionRate.toFixed(0)}%. Review cancellations and no-shows.`,
      });
    }

    // Always show at least one signal
    if (signals.length === 0) {
      signals.push({
        label: 'Operations Normal',
        severity: 'low',
        description: 'No critical issues detected. All metrics are within expected ranges.',
      });
    }

    return signals.slice(0, 3); // Max 3 signals
  }, [metrics, resolvedCurrency, resolvedLocale]);

  // AI Action Items - derived from real data
  const aiActionItems = useMemo(() => {
    const actions = [];

    if (metrics.unpaidInvoices > 5) {
      actions.push({
        title: 'Follow up on unpaid invoices',
        detail: `${metrics.unpaidInvoices} invoices pending payment. Consider automated reminder campaigns.`,
        urgency: 'Action due today',
      });
    }

    if (metrics.appointmentsToday > 0 && metrics.completedAppointments < metrics.appointmentsToday / 2) {
      actions.push({
        title: 'Monitor appointment progress',
        detail: `${metrics.appointmentsToday - metrics.completedAppointments} appointments remaining today. Ensure adequate staffing.`,
        urgency: 'High impact',
      });
    }

    if (metrics.newPatientsThisMonth > 0) {
      actions.push({
        title: 'Welcome new patients',
        detail: `${metrics.newPatientsThisMonth} new patients this month. Send welcome communications and schedule follow-ups.`,
        urgency: 'Plan ahead',
      });
    }

    // Default actions if no data-driven ones
    if (actions.length === 0) {
      actions.push({
        title: 'Review daily operations',
        detail: 'Check appointment schedule and staff availability for optimal patient flow.',
        urgency: 'Routine',
      });
    }

    return actions.slice(0, 3);
  }, [metrics]);

  return (
    <div className="space-y-6 page-transition theme-transition">
      <PageHeader
        title="Health AI+"
        subtitle="Autonomous command center powered by real-time data from your Report Builder. Metrics refresh automatically every 5 minutes."
        icon={Sparkles}
        gradient
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isLoading} className="h-8">
              <RefreshCw className={cn('h-4 w-4 mr-1', isLoading && 'animate-spin')} />
              Refresh
            </Button>
            <Badge variant="secondary" className="text-primary">
              {fromCache ? 'Cached' : 'Live'} · {cachedTimeDisplay || 'Loading...'}
            </Badge>
          </>
        }
      />

      {isLoading ? (
        <StatRowSkeleton />
      ) : (
        <div className="grid gap-4 stagger sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Patients"
            value={metrics.totalPatients}
            icon={Users}
            accent="info"
            delta={metrics.patientGrowth}
            deltaLabel="vs last month"
          />
          <StatCard
            label="Revenue (MTD)"
            value={metrics.revenueMTD}
            formatValue={(n) => formatCurrency(n, resolvedCurrency, resolvedLocale)}
            icon={BarChart3}
            accent="success"
            delta={metrics.revenueGrowth}
            deltaLabel="vs last month"
          />
          <StatCard
            label="Appts Today"
            value={metrics.appointmentsToday}
            icon={CalendarCheck}
            accent="primary"
          />
          <StatCard
            label="Unpaid Invoices"
            value={metrics.unpaidInvoices}
            icon={ReceiptText}
            accent="warning"
          />
        </div>
      )}

      <div className="grid gap-6 stagger lg:grid-cols-2" aria-label="AI insights">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>AI Operations Brief</CardTitle>
            </div>
            <CardDescription>Real-time snapshot from Report Builder data.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <div className="grid gap-4 md:grid-cols-3">
                  <SnapshotSkeleton />
                  <SnapshotSkeleton />
                  <SnapshotSkeleton />
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Today you have <span className="text-primary font-semibold">{metrics.appointmentsToday} appointments</span> scheduled
                  with <span className="text-primary font-semibold">{metrics.completedAppointments} completed</span> so far.
                  {metrics.encountersToday > 0 && (
                    <> There have been <span className="text-primary font-semibold">{metrics.encountersToday} encounters</span> recorded today.</>
                  )}
                  {metrics.newPatientsThisMonth > 0 && (
                    <> This month saw <span className="text-primary font-semibold">{metrics.newPatientsThisMonth} new patients</span> registered.</>
                  )}
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {utilizationSnapshots.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="rounded-lg border border-dashed border-border/80 p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon className="h-4 w-4" />
                          <span className="text-xs uppercase tracking-wide">{item.label}</span>
                        </div>
                        <p className="mt-1 text-xl font-semibold">{item.value}</p>
                        <p className="text-xs text-muted-foreground">{item.context}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Suggested Actions</CardTitle>
            </div>
            <CardDescription>AI-prioritized interventions based on real data.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <ul className="space-y-3">
                {aiActionItems.map((action, index) => (
                  <li key={action.title} className="rounded-lg border border-border/70 p-3">
                    <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
                      <span>#{index + 1} {action.urgency}</span>
                      <Badge variant="outline">AI recommendation</Badge>
                    </div>
                    <p className="mt-2 text-base font-semibold text-foreground">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.detail}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card aria-label="Risk and compliance">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <CardTitle>Risk & Compliance Radar</CardTitle>
          </div>
          <CardDescription>Autonomous monitoring based on real metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <ul className="grid gap-3 stagger md:grid-cols-3">
              {riskSignals.map((risk) => (
                <li key={risk.label} className="rounded-lg border border-border/70 p-3">
                  <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                    <span>Severity: {risk.severity}</span>
                    <Badge
                      variant={risk.severity === 'high' ? 'destructive' : 'secondary'}
                      className="text-foreground"
                    >
                      {risk.severity === 'high' ? 'Alert' : risk.severity === 'moderate' ? 'Watchlist' : 'Info'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">{risk.label}</p>
                  <p className="text-sm text-muted-foreground">{risk.description}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
