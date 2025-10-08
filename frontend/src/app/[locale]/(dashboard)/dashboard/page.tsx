import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ActivityTimeline } from '@/components/tables/activity-timeline';
import { AppointmentSchedule } from '@/components/charts/appointment-schedule';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { 
  Users, 
  DollarSign, 
  Clock, 
  Activity, 
  TrendingUp, 
  Calendar,
  Shield,
  Zap
} from 'lucide-react';

const metricCards = [
  {
    title: 'Active Patients',
    value: '1,482',
    subtitle: '↑ 8% vs last month',
    icon: Users,
    trend: 'up',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    title: 'Revenue (MTD)',
    value: formatCurrency(284235.45),
    subtitle: 'Includes paid & pending claims',
    icon: DollarSign,
    trend: 'up',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    title: 'Avg. Wait Time',
    value: '12m',
    subtitle: 'Target: < 15 minutes',
    icon: Clock,
    trend: 'down',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    title: 'Clinical Utilization',
    value: '81%',
    subtitle: 'Across providers & rooms',
    icon: Activity,
    trend: 'up',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 page-transition theme-transition">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your healthcare operations.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-success" />
          <span>All systems operational</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
        {metricCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.title} 
              className={cn(
                "group border-border/60 bg-gradient-to-br from-background to-muted/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2 rounded-lg", card.bgColor)}>
                    <Icon className={cn("h-4 w-4", card.color)} />
                  </div>
                          <TrendingUp className={cn(
                            "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                            card.trend === 'up' ? "text-success" : "text-error"
                          )} />
                </div>
                <CardDescription className="text-xs">{card.subtitle}</CardDescription>
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight transition-colors duration-200 group-hover:text-primary">
                  {card.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2" aria-label="Operational insights">
        <Card className="group transition-all duration-300 hover:shadow-lg animate-scale-in">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Today's Encounters</CardTitle>
            </div>
            <CardDescription>Provider load balanced across specialties</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={
              <div className="h-48 animate-pulse rounded-md bg-muted loading-shimmer" />
            }> 
              <AppointmentSchedule />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="group transition-all duration-300 hover:shadow-lg animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Clinical Activity</CardTitle>
            </div>
            <CardDescription>Automatic masking applied to PHI until user reveals</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border/60 hover:bg-accent/50 transition-colors duration-200 cursor-pointer group">
              <div className="p-2 rounded-lg bg-info/10 group-hover:bg-info/20 transition-colors duration-200">
                <Users className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="font-medium">New Patient</p>
                <p className="text-sm text-muted-foreground">Register patient</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border/60 hover:bg-accent/50 transition-colors duration-200 cursor-pointer group">
              <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors duration-200">
                <Calendar className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Schedule Appointment</p>
                <p className="text-sm text-muted-foreground">Book consultation</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border/60 hover:bg-accent/50 transition-colors duration-200 cursor-pointer group">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">View Reports</p>
                <p className="text-sm text-muted-foreground">Analytics dashboard</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
