'use client';

import { Suspense, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityTimeline } from '@/components/tables/activity-timeline';
import { AppointmentSchedule } from '@/components/charts/appointment-schedule';
import { cn, formatCurrency } from '@/lib/utils';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  Clock,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

const aiPulseMetrics = [
  {
    label: 'Tenant vitality',
    value: '92%',
    delta: '+6% vs last 7d',
    tone: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    icon: TrendingUp,
  },
  {
    label: 'Facility readiness',
    value: '8 sites',
    delta: '2 flagged for review',
    tone: 'text-sky-500',
    bg: 'bg-sky-500/10',
    icon: ShieldCheck,
  },
  {
    label: 'Resource strain',
    value: 'Low',
    delta: 'Avg. utilization 78%',
    tone: 'text-amber-500',
    bg: 'bg-amber-500/10',
    icon: Activity,
  },
];

const aiActionItems = [
  {
    title: 'Reassign elective blocks',
    detail: 'Two facilities overbooked for Friday afternoon. Auto-balance to satellite sites.',
    urgency: 'High impact',
  },
  {
    title: 'Close encounter loops',
    detail: '11 encounters missing follow-up tasks. AI recommends templated discharge plan.',
    urgency: 'Action due today',
  },
  {
    title: 'Boost care-team availability',
    detail: 'Staffing dip next Tuesday; suggest converting 4 virtual visits to asynchronous check-ins.',
    urgency: 'Plan ahead',
  },
];

const riskSignals = [
  {
    label: 'Prior auth backlog',
    severity: 'moderate',
    description: '17 claims pending > 10 days. Enable auto-escalation for cardiology queue.',
  },
  {
    label: 'Patient churn risk',
    severity: 'high',
    description: 'Top decile of chronic-care patients missed 2+ touch points this quarter.',
  },
  {
    label: 'Data completeness',
    severity: 'low',
    description: 'Insurance data missing in 4% of new registrations. Trigger intake checklist refresh.',
  },
];

const currencyLocaleMap: Record<string, string> = {
  AED: 'en-AE',
  INR: 'en-IN',
};

export default function DashboardPage() {
  const { data: currencyConfig } = useResolveConfig('finance.currency');
  const resolvedCurrency =
    typeof currencyConfig?.value === 'string' && currencyConfig.value.trim()
      ? currencyConfig.value.trim()
      : 'AED';
  const resolvedLocale = currencyLocaleMap[resolvedCurrency] ?? 'en-AE';
  const lastRefreshed = useMemo(() => new Date(), []);
  const utilizationSnapshots = useMemo(
    () => [
      { label: 'Clinical utilization', value: '81%', context: '+3 pts vs SLA', icon: Activity },
      { label: 'Wait time', value: '12m', context: 'Target < 15m', icon: Clock },
      {
        label: 'Revenue (MTD)',
        value: formatCurrency(284235.45, resolvedCurrency, resolvedLocale),
        context: 'Blend of paid & pending',
        icon: BarChart3,
      },
    ],
    [resolvedCurrency, resolvedLocale],
  );

  return (
    <div className="space-y-6 page-transition theme-transition">
      <Card className="border-primary/40 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-primary">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <CardTitle className="text-3xl">Health AI+</CardTitle>
            </div>
            <Badge variant="secondary" className="text-primary">
              Live insights · {(lastRefreshed).toLocaleTimeString()}
            </Badge>
          </div>
          <CardDescription className="text-base">
            Autonomous command center for tenant + facility operations. Metrics blend real telemetry with AI
            predictions so you can steer proactively.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {aiPulseMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="rounded-xl border border-border/60 bg-background/60 p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <span className={cn('rounded-full p-2', metric.bg)}>
                      <Icon className={cn('h-4 w-4', metric.tone)} />
                    </span>
                    <p className="text-xs uppercase text-muted-foreground tracking-wide">{metric.label}</p>
                  </div>
                  <p className="text-2xl font-semibold leading-tight">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.delta}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2" aria-label="AI insights">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>AI Operations Brief</CardTitle>
            </div>
            <CardDescription>Snapshot across all active tenants and facilities.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Patient throughput is tracking <span className="text-primary font-semibold">+8%</span> week over week.
              Utilization remains stable at <span className="text-primary font-semibold">81%</span> with no critical
              staffing breaches detected. Health AI+ recommends leaning into asynchronous visits to preserve high
              acuity capacity.
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Suggested Actions</CardTitle>
            </div>
            <CardDescription>AI-prioritized interventions ranked by impact.</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3" aria-label="Predictive monitoring">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Predicted Encounter Load</CardTitle>
            </div>
            <CardDescription>AI-adjusted view of today’s schedule + expected walk-ins.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-48 animate-pulse rounded-md bg-muted loading-shimmer" />}>
              <AppointmentSchedule />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle>Risk & Compliance Radar</CardTitle>
            </div>
            <CardDescription>Autonomous monitoring across revenue, care, data quality.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {riskSignals.map((risk) => (
                <li key={risk.label} className="rounded-lg border border-border/70 p-3">
                  <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                    <span>Severity: {risk.severity}</span>
                    <Badge variant="secondary" className="text-foreground">
                      Watchlist
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">{risk.label}</p>
                  <p className="text-sm text-muted-foreground">{risk.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2" aria-label="Live telemetry">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Clinical Activity Stream</CardTitle>
            </div>
            <CardDescription>PHI masked until user intent confirmed.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>AI Coaching Loop</CardTitle>
            </div>
            <CardDescription>Proactive nudge log for ops + care teams.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-lg border border-border/70 p-3">
                <p className="text-foreground font-semibold">Tenant-level broadcast</p>
                <p>Share AI summary with facility leads to align on Friday surge plan.</p>
              </div>
              <div className="rounded-lg border border-border/70 p-3">
                <p className="text-foreground font-semibold">Care quality watch</p>
                <p>AI detected rising readmission signals in telehealth cohort. Suggest QA review.</p>
              </div>
              <div className="rounded-lg border border-border/70 p-3">
                <p className="text-foreground font-semibold">Revenue safeguard</p>
                <p>Enable automated reminder for claims team—3 high-value claims hit day 25.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
