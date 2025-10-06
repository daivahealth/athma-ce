import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ActivityTimeline } from '@/components/tables/activity-timeline';
import { AppointmentSchedule } from '@/components/charts/appointment-schedule';
import { Suspense } from 'react';

const metricCards = [
  {
    title: 'Active Patients',
    value: '1,482',
    subtitle: '↑ 8% vs last month',
  },
  {
    title: 'Revenue (MTD)',
    value: formatCurrency(284235.45),
    subtitle: 'Includes paid & pending claims',
  },
  {
    title: 'Avg. Wait Time',
    value: '12m',
    subtitle: 'Target: < 15 minutes',
  },
  {
    title: 'Clinical Utilization',
    value: '81%',
    subtitle: 'Across providers & rooms',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
        {metricCards.map((card) => (
          <Card key={card.title} className="border-border/60 bg-gradient-to-br from-background to-muted/40">
            <CardHeader className="space-y-2">
              <CardDescription>{card.subtitle}</CardDescription>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2" aria-label="Operational insights">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Encounters</CardTitle>
            <CardDescription>Provider load balanced across specialties</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-48 animate-pulse rounded-md bg-muted" />}> 
              <AppointmentSchedule />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Clinical Activity</CardTitle>
            <CardDescription>Automatic masking applied to PHI until user reveals</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
